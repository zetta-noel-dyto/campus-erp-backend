// *************** IMPORT LIBRARY ***************
import Joi from "joi";

// *************** ENROLLMENT SCHEMA ***************
// Validation schema for enrolling multiple students into an academic year
const EnrollStudentsSchema = Joi.object({
    // Target academic year ObjectId
    academic_year_id: Joi.string()
        .hex()
        .length(24)
        .required(),
    // List of student ObjectIds to be enrolled
    student_ids: Joi.array()
        .items(Joi.string().hex().length(24))
        .min(1)
        .required()

})

// *************** EXPORT MODULE ***************
export {
    EnrollStudentsSchema
}