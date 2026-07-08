// *************** IMPORT LIBRARY ***************
import Joi from 'joi';

// *************** VALIDATOR ***************
/**
 * Defines validation rules for submitting student test grades.
 * @returns {Object} Joi validation schema for grade submission input.
 */
const SubmitTestGradesSchema = Joi.object({
  // Validates academic year identifier reference using MongoDB ObjectId format.
  academic_year_id: Joi.string().hex().length(24).required(),
  // Validates test identifier reference using MongoDB ObjectId format.
  test_id: Joi.string().hex().length(24).required(),
  // Validates collection of student grade records submitted for the test.
  grades: Joi.array()
    .items(
      Joi.object({
        // Validates student identifier reference using MongoDB ObjectId format.
        student_id: Joi.string().hex().length(24).required(),
        // Validates student score value within the allowed grading range.
        score: Joi.number().min(0).max(100).required(),
      }),
    )
    // Ensure at least one student grade record is submitted.
    .min(1)
    .required(),
});

// *************** EXPORT MODULE ***************
export { SubmitTestGradesSchema };
