// *************** IMPORT MODULE ***************
import { AcademicStandingModel as AcademicStanding } from './academic_standing.model.js';
import { AppError } from '../../../core/error.js';
import { StudentModel as Students } from '../../users/student/student.model.js';

// *************** HELPER FUNCTION ***************
/**
 * Retrieves student report card data including academic standing details and student information.
 * @param {Object} req - Express request object containing report card request parameters.
 * @param {Object} req.params - Route parameters containing academic year and student identifiers.
 * @param {string} req.params.academicYearId - Academic year identifier used to filter academic records.
 * @param {string} req.params.studentId - Student identifier used to retrieve student information.
 * @returns {Promise<Object>} Report card data containing academic standing and student details.
 * @throws {AppError} Throws error when academic standing data or student record does not exist.
 */
const GetReportCardHelper = async (req) => {
  // *************** START: Extract request parameters ***************
  const { academicYearId, studentId } = req.params;
  // *************** END: Extract request parameters ***************

  // *************** START: Fetch academic standing data ***************
  const academicStanding = await AcademicStanding.find({
    academic_year_id: academicYearId,
    student_id: studentId,
  })
    .populate([
      { path: 'block_id', select: 'name' },
      { path: 'subjects.subject_id', select: 'name' },
      { path: 'subjects.tests.test_id', select: 'name' },
    ])
    .lean();
  // *************** END: Fetch academic standing data ***************

  // *************** START: Fetch student data ***************
  const student = await Students.findById(studentId).lean();
  // *************** END: Fetch student data ***************

  // *************** START: Validate report card data ***************
  if (!academicStanding.length === 0 || !student) {
    throw new AppError('Data not found', 'DATA_NOT_FOUND', 404);
  }
  // *************** END: Validate report card data ***************

  return { academicStanding, student };
};

// *************** EXPORT MODULE ***************
export { GetReportCardHelper };
