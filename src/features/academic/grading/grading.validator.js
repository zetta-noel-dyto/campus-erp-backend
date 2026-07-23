// *************** IMPORT LIBRARY ***************
import Joi from 'joi'

// *************** VALIDATORS ***************
/**
 * Defines validation rules for submitting student test grades.
 * @returns {Object} Joi validation schema for grade submission input.
 */
const SubmitTestGradesSchema = Joi.object({
  academic_year_id: Joi.string().hex().length(24).required(),
  test_id: Joi.string().hex().length(24).required(),
  grades: Joi.array()
    .items(
      Joi.object({
        student_id: Joi.string().hex().length(24).required(),
        score: Joi.number().min(0).max(100).required()
      })
    )
    .min(1)
    .required()
})

/**
 * Defines validation rules for report card request parameters.
 * @returns {Object} Joi validation schema for report card route parameters.
 */
const ParamsSchema = Joi.object({
  academicYearId: Joi.string().hex().length(24).required(),
  studentId: Joi.string().hex().length(24).required()
})

// *************** EXPORT MODULE ***************
export { ParamsSchema, SubmitTestGradesSchema }
