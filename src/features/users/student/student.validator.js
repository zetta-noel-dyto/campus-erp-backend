// *************** IMPORT LIBRARY ***************
import Joi from "joi";

// *************** STUDENT SCHEMAS ***************
// Validation schema for creating a new student record
const CreateStudentSchema = Joi.object({
    // Student first name (required)
    first_name: Joi.string().required(),
    // Student last name (required)
    last_name: Joi.string().required(),
    // Student email address (must be valid email format and unique at DB level)
    email: Joi.string().email().required(),
    // Unique student number identifier
    student_number: Joi.string().required(),
    // List of academic year ObjectIds associated with the student
    academic_year_ids: Joi.array()
        .items(Joi.string().hex().length(24))
        .default([])
})

// *************** EXPORT MODULE ***************
export {
    CreateStudentSchema
}