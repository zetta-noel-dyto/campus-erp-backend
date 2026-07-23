// *************** IMPORT LIBRARY ***************
import Joi from 'joi'

// *************** ENROLLMENT SCHEMA ***************
const EnrollStudentsSchema = Joi.object({
  academic_year_id: Joi.string().hex().length(24).required(),
  student_ids: Joi.array().items(Joi.string().hex().length(24)).min(1).required()
})

// *************** EXPORT MODULE ***************
export { EnrollStudentsSchema }
