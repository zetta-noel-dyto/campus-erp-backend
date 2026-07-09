// *************** IMPORT LIBRARY ***************
import nodeCron from 'node-cron';

// *************** IMPORT MODULE ***************
import { AcademicYearModel as AcademicYears } from '../features/academic/enrollment/academic_year.model.js';
import { AppError } from '../core/error.js';
import { NotificationLogModel } from '../features/system/notifications/notification_log.model.js';
import { SendEmail } from '../shared/services/email.service.js';
import { StudentModel as Students } from '../features/users/student/student.model.js';
import { TestModel as Tests } from '../features/academic/curriculum/curriculum.model.js';
import { UserModel as Users } from '../features/users/user/user.model.js';

// *************** AGGREGATION PIPELINE ***************
// Finds active academic records where enrolled students do not have corresponding test grades.
const aggregation = [
  // Filter only active academic years for auditing.
  { $match: { status: 'active' } },
  // Expand student references to validate each student's grade completion.
  { $unwind: '$student_ids' },
  // Expand block references to locate related subjects and tests.
  { $unwind: '$block_ids' },
  // Retrieve subjects associated with the academic block.
  {
    $lookup: {
      from: 'subjects',
      localField: 'block_ids',
      foreignField: 'block_id',
      as: 'subjects',
    },
  },
  // Convert subject array result into individual subject documents.
  { $unwind: '$subjects' },
  // Retrieve tests associated with each subject.
  {
    $lookup: {
      from: 'tests',
      localField: 'subjects._id',
      foreignField: 'subject_id',
      as: 'tests',
    },
  },
  // Convert test array result into individual test documents.
  { $unwind: '$tests' },
  // Check whether a grade record already exists for student, test, and academic year combination.
  {
    $lookup: {
      from: 'studentgrades',
      let: {
        studentId: '$student_ids',
        testId: '$tests._id',
        academicYearId: '$_id',
      },
      pipeline: [
        {
          $match: {
            $expr: {
              $and: [
                { $eq: ['$student_id', '$$studentId'] },
                { $eq: ['$test_id', '$$testId'] },
                { $eq: ['$academic_year_id', '$$academicYearId'] },
              ],
            },
          },
        },
      ],
      as: 'grades',
    },
  },
  // Keep only records where no grade has been submitted.
  {
    $match: {
      grades: { $size: 0 },
    },
  },
  // Return only required identifiers for notification processing.
  {
    $project: {
      student_id: '$student_ids',
      test_id: '$tests._id',
      academic_year_id: '$_id',
    },
  },
];

// *************** HELPER FUNCTION ***************
/**
 * Delays execution for the specified amount of time.
 * @param {number} ms - Delay duration in milliseconds.
 * @returns {Promise<void>} Promise resolved after the delay duration.
 */
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// *************** JOB FUNCTION ***************
/**
 * Checks for missing student grades and sends alert notifications.
 * @returns {Promise<void>}
 */
const MissingGradeAuditorJob = async () => {
  try {
    // *************** START: Find missing grade records ***************
    const results = await AcademicYears.aggregate(aggregation);
    // *************** END: Find missing grade records ***************

    const teacher = await Users.findOne({ role: 'teacher' }).lean();
    if (!teacher || !teacher.email) {
      throw new AppError('The requested teacher does not exist or has incomplete information', 'TEACHER_NOT_FOUND', 404);
    }

    // *************** START: Prepare related data lookup ***************
    // Extract identifiers required to fetch student and test information in batches.
    const studentIds = results.map((result) => result.student_id);
    const testIds = results.map((result) => result.test_id);

    // Fetch required student information for notification content generation.
    const students = await Students.find({ _id: { $in: studentIds } })
      .select('first_name last_name email student_number')
      .lean();

    // Fetch required test information for notification content generation.
    const tests = await Tests.find({ _id: { $in: testIds } })
      .select('name')
      .lean();

    // Create lookup maps to avoid repeated database queries during processing.
    const studentMap = new Map(students.map((student) => [String(student._id), student]));
    const testMap = new Map(tests.map((test) => [String(test._id), test]));
    // *************** END: Prepare related data lookup ***************

    // *************** START: Process missing grade notifications ***************
    for (const result of results) {
      // Check whether notification has already been sent to prevent duplicate alerts.
      const exist = await NotificationLogModel.findOne({
        type: 'MISSING_GRADE_ALERT',
        student_id: result.student_id,
        test_id: result.test_id,
      }).lean();
      if (exist) continue;

      // Retrieve student and test details for notification message generation.
      const student = studentMap.get(String(result.student_id));
      const test = testMap.get(String(result.test_id));

      // Generate notification email content containing missing grade information.
      const html = `
      <h3>Missing Grade Alert</h3>
      <p>
        Student ${student.first_name} ${student.last_name} with student number ${student.student_number}
        is missing grade for test ${test.name}
      </p>
    `;

      // Send notification email and record delivery history.
      await SendEmail(teacher.email, 'Missing Grade Alert', html);
      // Store notification log to prevent duplicate email delivery.
      await NotificationLogModel.create({
        type: 'MISSING_GRADE_ALERT',
        student_id: result.student_id,
        test_id: result.test_id,
        academic_year_id: result.academic_year_id,
      });
      // Slow down email delivery to respect external SMTP rate limits.
      await delay(11_000);
    }
    // *************** END: Process missing grade notifications ***************
  } catch (error) {
    // Log unexpected job failure before propagating error.
    console.error(error);
    throw error;
  }
};

// *************** JOB INITIALIZER ***************
/**
 * Initializes recurring missing grade auditor background job.
 * @returns {void}
 */
const InitializeGradeAuditorJob = () => {
  // Schedule auditor execution every minute to monitor missing grades.
  nodeCron.schedule('* * * * *', () => {
    // Execute missing grade audit process.
    MissingGradeAuditorJob().catch((error) => console.error(`Error executing MissingGradeAuditorJob : ${error}`));
  });
};

// *************** EXPORT MODULE ***************
export { InitializeGradeAuditorJob };
