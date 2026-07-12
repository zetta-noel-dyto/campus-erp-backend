// *************** IMPORT CORE ***************
import path from 'path';
import { fileURLToPath } from 'url';
import { Worker } from 'worker_threads';

// *************** IMPORT MODULE ***************
import { AppError } from '../../../core/error.js';
import { StudentModel as Students } from '../../users/student/student.model.js';
import { StudentGradeModel as StudentGrades } from './student_grade.model.js';
import { TestModel as Tests } from '../../academic/curriculum/curriculum.model.js';

// *************** GLOBAL VARIABLES ***************
// Resolve current module location to build absolute worker file path.
const filename = fileURLToPath(import.meta.url);
// Directory path used as the base location for resolving worker scripts.
const dirname = path.dirname(filename);

// *************** HELPER FUNCTION ***************
/**
 * Validates submitted student grades and stores grade records in the database.
 * @param {Object} input - Grade submission payload.
 * @param {string} input.test_id - Identifier of the test associated with submitted grades.
 * @param {string} input.academic_year_id - Identifier of the academic year for the grades.
 * @param {Array<Object>} input.grades - List of student grade records to be submitted.
 * @returns {Promise<Array<Object>>} Inserted student grade records.
 * @throws {AppError} Throws error when referenced test or student does not exist.
 */
const SubmitTestGradesHelper = async (input) => {
  // *************** START: Validate test reference ***************
  const test = await Tests.findById(input.test_id).lean();
  if (!test) {
    throw new AppError('Test not found', 'TEST_NOT_FOUND', 404);
  }
  // *************** END: Validate test reference ***************

  // *************** START: Validate student references ***************
  // Extract student identifiers from submitted grade records for batch validation.
  const studentIds = input.grades.map((item) => String(item.student_id));
  // Fetch all referenced students in a single database query.
  const students = await Students.find({ _id: { $in: studentIds } })
    .select('_id')
    .lean();
  // Build a Set of existing student IDs for O(1) existence checks.
  const studentExist = new Set(students.map((student) => String(student._id)));
  // Ensure every submitted grade references a valid student record.
  for (const item of input.grades) {
    if (!studentExist.has(item.student_id)) {
      throw new AppError('Student not found', 'INVALID_STUDENT_REFERENCE', 400);
    }
  }
  // *************** END: Validate student references ***************

  // *************** START: Prepare grade records ***************
  // Transform input payload into database schema format before insertion.
  const mappedGrades = input.grades.map((grade) => ({
    student_id: grade.student_id,
    test_id: input.test_id,
    academic_year_id: input.academic_year_id,
    score: grade.score,
  }));
  // *************** END: Prepare grade records ***************

  // *************** START: Save grades to DB ***************
  const result = await StudentGrades.insertMany(mappedGrades);
  // *************** END: Save grades to DB ***************

  // *************** START: Initialize grade aggregation worker ***************
  // Prepare worker payload containing student grades context required for aggregation processing.
  const payload = JSON.stringify({
    student_ids: studentIds,
    test_id: input.test_id,
    academic_year_id: input.academic_year_id,
  });

  // Create worker thread to process academic standing aggregation asynchronously.
  const worker = new Worker(path.resolve(dirname, '../../../worker/grade_aggregator/grade_aggregator.worker.js'), {
    workerData: payload,
  });
  // Handle worker communication and lifecycle events.
  worker
    .on('message', (message) => {
      // Receive aggregation result status from background worker.
      console.log(`Worker message : ${message}`);
    })
    .on('error', (error) => {
      // Log unexpected worker execution errors.
      console.error(`Grade aggregator worker error : ${error}`);
    })
    .on('exit', (code) => {
      // Detect abnormal worker termination.
      if (code !== 0) {
        console.error(`Grade aggregator worker stopped with exit code ${code}`);
      }
    });
  // *************** END: Initialize grade aggregation worker ***************

  return result;
};

// *************** EXPORT MODULE ***************
export { SubmitTestGradesHelper };
