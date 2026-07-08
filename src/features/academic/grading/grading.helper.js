// *************** IMPORT MODULE ***************
import { AppError } from '../../../core/error.js';
import { StudentModel as Students } from '../../users/student/student.model.js';
import { StudentGradeModel as StudentGrades } from './student_grade.model.js';
import { TestModel as Tests } from '../../academic/curriculum/curriculum.model.js';

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
  const studentIds = input.grades.map((item) => item.student_id);
  // Fetch all referenced students in a single database query.
  const students = await Students.find({ _id: { $in: studentIds } });
  // Create lookup map to efficiently verify student existence during validation.
  const studentMap = new Map(students.map((student) => [student._id.toString(), student]));
  // Ensure every submitted grade references a valid student record.
  for (const item of input.grades) {
    if (!studentMap.has(item.student_id)) {
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
  return await StudentGrades.insertMany(mappedGrades);
  // *************** END: Save grades to DB ***************
};

// *************** EXPORT MODULE ***************
export { SubmitTestGradesHelper };
