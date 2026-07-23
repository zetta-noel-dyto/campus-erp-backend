// *************** IMPORT LIBRARY ***************
import Joi from 'joi'
import { GraphQLError } from 'graphql'

// *************** GRADING RULE SCHEMAS ***************
const CreateGradingRuleSchema = Joi.object({
  label: Joi.string().required(),
  operator: Joi.string().valid('>', '>=', '<', '<=', '==').required(),
  threshold: Joi.number().required()
})

const UpdateGradingRuleSchema = Joi.object({
  label: Joi.string(),
  operator: Joi.string().valid('>', '>=', '<', '<=', '=='),
  threshold: Joi.number()
})

// *************** BLOCK SCHEMAS ***************
const CreateBlockSchema = Joi.object({
  name: Joi.string().required(),
  academic_year: Joi.string().required(),
  grading_rules: Joi.array().items(CreateGradingRuleSchema).required()
})

const UpdateBlockSchema = Joi.object({
  name: Joi.string(),
  academic_year: Joi.string(),
  grading_rules: Joi.array().items(UpdateGradingRuleSchema)
}).min(1)

// *************** SUBJECT SCHEMAS ***************
const CreateSubjectSchema = Joi.object({
  name: Joi.string().required(),
  block_id: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  weightage: Joi.number().greater(0).max(100).required(),
  grading_rules: Joi.array().items(CreateGradingRuleSchema).required()
})

const UpdateSubjectSchema = Joi.object({
  name: Joi.string(),
  block_id: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  weightage: Joi.number().greater(0).max(100),
  grading_rules: Joi.array().items(UpdateGradingRuleSchema)
}).min(1)

// *************** TEST SCHEMAS ***************
const CreateTestSchema = Joi.object({
  name: Joi.string().required(),
  subject_id: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required(),
  weightage: Joi.number().greater(0).max(100).required(),
  grading_rules: Joi.array().items(CreateGradingRuleSchema).required()
})

const UpdateTestSchema = Joi.object({
  name: Joi.string(),
  subject_id: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
  weightage: Joi.number().greater(0).max(100),
  grading_rules: Joi.array().items(UpdateGradingRuleSchema)
}).min(1)

// *************** EXPORT MODULE ***************
export {
  CreateGradingRuleSchema,
  UpdateGradingRuleSchema,
  CreateBlockSchema,
  UpdateBlockSchema,
  CreateSubjectSchema,
  UpdateSubjectSchema,
  CreateTestSchema,
  UpdateTestSchema
}
