import Joi from "joi";

const CreateStudentSchema = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    email: Joi.string().email().required(),
    student_number: Joi.string().required(),
    academic_year_ids: Joi.array().items(Joi.string().hex().length(24)).default([])
})

export {
    CreateStudentSchema
}