// *************** IMPORT CORE ***************
import fs from 'fs/promises'
import path from 'path'

// *************** IMPORT LIBRARY ***************
import Handlebars from 'handlebars'

// *************** IMPORT MODULE ***************
import { AcademicStandingModel as AcademicStanding } from './academic_standing.model.js'
import { AppError } from '../../../core/error.js'
import { StudentModel as Students } from '../../users/student/student.model.js'

// *************** HELPER ***************
/**
 * Retrieves student report card data and generates HTML content from report card template.
 * @param {Object} data - Report card request data containing required identifiers.
 * @param {string} data.academicYearId - Academic year identifier used to filter academic records.
 * @param {string} data.studentId - Student identifier used to retrieve student information.
 * @returns {Promise<string>} Generated report card HTML content.
 * @throws {AppError} Throws error when academic standing data or student record does not exist.
 */
const GetReportCardHelper = async (data) => {
  // *************** START: Extract request parameters ***************
  const { academicYearId, studentId } = data
  // *************** END: Extract request parameters ***************

  // *************** START: Fetch academic standing data ***************
  const academicStanding = await AcademicStanding.find({
    academic_year_id: academicYearId,
    student_id: studentId
  })
    .populate([
      { path: 'block_id' },
      { path: 'subjects.subject_id' },
      { path: 'subjects.tests.test_id' }
    ])
    .lean()
  // *************** END: Fetch academic standing data ***************

  // *************** START: Fetch student data ***************
  const student = await Students.findById(studentId).lean()
  // *************** END: Fetch student data ***************

  // *************** START: Validate report card data ***************
  if (academicStanding.length === 0 || !student) {
    throw new AppError('Data not found', 'DATA_NOT_FOUND', 404)
  }
  // *************** END: Validate report card data ***************

  // *************** START: Load report card template ***************
  const templatePath = path.join(
    process.cwd(),
    'src',
    'features',
    'academic',
    'grading',
    'templates',
    'report_card.hbs'
  )
  const source = await fs.readFile(templatePath, 'utf8')
  const template = Handlebars.compile(source)
  // *************** END: Load report card template ***************

  // *************** START: Generate report card HTML ***************
  return template({
    student,
    academicStanding
  })
  // *************** END: Generate report card HTML ***************
}

// *************** EXPORT MODULE ***************
export { GetReportCardHelper }
