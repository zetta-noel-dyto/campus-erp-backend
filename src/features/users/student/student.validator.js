// *************** IMPORT LIBRARY ***************
import Joi from 'joi';

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
  academic_year_ids: Joi.array().items(Joi.string().hex().length(24)).default([]),
});

// Validation schema for querying students by academic year with pagination and optional filtering
const GetStudentsByAcademicYearSchema = Joi.object({
  academic_year_id: Joi.string().hex().length(24).required(),
  page: Joi.number().default(1).min(1),
  limit: Joi.number().min(1).default(10).max(100),
  search: Joi.string().trim().optional(),
});

// *************** EXPORT MODULE ***************
export { CreateStudentSchema, GetStudentsByAcademicYearSchema };
