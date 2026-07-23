// *************** IMPORT LIBRARY ***************
import Joi from 'joi'

// *************** STUDENT SCHEMAS ***************
const CreateStudentSchema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().email().required(),
  student_number: Joi.string().required(),
  academic_year_ids: Joi.array().items(Joi.string().hex().length(24)).default([])
})

const GetStudentsByAcademicYearSchema = Joi.object({
  academic_year_id: Joi.string().hex().length(24).required(),
  page: Joi.number().default(1).min(1),
  limit: Joi.number().min(1).default(10).max(100),
  search: Joi.string().trim().optional()
})

// *************** EXPORT MODULE ***************
export { CreateStudentSchema, GetStudentsByAcademicYearSchema }
