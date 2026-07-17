// *************** IMPORT LIBRARY ***************
import Joi from 'joi';

// *************** VALIDATORS ***************
/**
 * Defines validation rules for submitting student test grades.
 * @returns {Object} Joi validation schema for grade submission input.
 */
const SubmitTestGradesSchema = Joi.object({
  // Academic year identifier reference used for grade submission.
  academic_year_id: Joi.string().hex().length(24).required(),
  // Test identifier reference associated with submitted grades.
  test_id: Joi.string().hex().length(24).required(),
  // Collection of student grade records submitted for the selected test.
  grades: Joi.array()
    .items(
      Joi.object({
        // Student identifier reference receiving the submitted grade.
        student_id: Joi.string().hex().length(24).required(),

        // Numeric student score value within the accepted grading range.
        score: Joi.number().min(0).max(100).required(),
      }),
    )
    // Ensure grade submission contains at least one student record.
    .min(1)
    .required(),
});

/**
 * Defines validation rules for report card request parameters.
 * @returns {Object} Joi validation schema for report card route parameters.
 */
const ParamsSchema = Joi.object({
  // Academic year identifier used to retrieve student's academic standing records.
  academicYearId: Joi.string().hex().length(24).required(),
  // Student identifier used to retrieve the requested report card owner.
  studentId: Joi.string().hex().length(24).required(),
});

// *************** EXPORT MODULE ***************
export { ParamsSchema, SubmitTestGradesSchema };
