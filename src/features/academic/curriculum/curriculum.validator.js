// *************** IMPORT LIBRARY ***************
import Joi from "joi";
import { GraphQLError } from "graphql";

/**
 * Validates payload structures against Joi schemas and maps errors to GraphQLError format.
 * @param {object} schema - Target validation blueprint
 * @param {object} payload - Incoming request payload
 * @param {string} context - Execution operation name
 * @throws {GraphQLError} If structural constraints fail
 * @returns {object} Cleaned and validated dataset
 */
const ValidateInput = (schema, payload, context = 'Validation') => {
    const { error, value } = schema.validate(payload, {
        abortEarly: false,
        stripUnknown: true,
        convert: true
    })

    if (error) {
        const errors = error.details.map((detail) => ({
            // Field path that failed validation
            field: detail.path.join('.'),
            // Human-readable validation error message
            message: detail.message
        }))

        throw new GraphQLError('Validation failed', {
            extensions: {
                code: "INVALID_INPUT",
                http: { status: 400 },
                context,
                errors
            }
        })
    }

    return value;
}

// *************** GRADING RULE SCHEMAS ***************
// Validation schema for creating a grading rule
const CreateGradingRuleSchema = Joi.object({
    label: Joi.string().required(),
    operator: Joi.string().valid('>', '>=', '<', '<=', '==').required(),
    threshold: Joi.number().required()
})

// Validation schema for partially updating a grading rule
const UpdateGradingRuleSchema = Joi.object({
    label: Joi.string(),
    operator: Joi.string().valid('>', '>=', '<', '<=', '=='),
    threshold: Joi.number()
})

// *************** BLOCK SCHEMAS ***************
// Validation schema for creating a block
const CreateBlockSchema = Joi.object({
    name: Joi.string().required(),
    academic_year: Joi.string().required(),
    grading_rules: Joi.array().items(CreateGradingRuleSchema).required()
})

// Validation schema for updating a block
const UpdateBlockSchema = Joi.object({
    name: Joi.string(),
    academic_year: Joi.string(),
    grading_rules: Joi.array().items(UpdateGradingRuleSchema)
}).min(1)

// *************** SUBJECT SCHEMAS ***************
// Validation schema for creating a subject
const CreateSubjectSchema = Joi.object({
    name: Joi.string().required(),
    block_id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    weightage: Joi.number().greater(0).max(100).required(),
    grading_rules: Joi.array().items(CreateGradingRuleSchema).required()
})

// Validation schema for updating a subject
const UpdateSubjectSchema = Joi.object({
    name: Joi.string(),
    block_id: Joi.string().regex(/^[0-9a-fA-F]{24}$/),
    weightage: Joi.number().greater(0).max(100),
    grading_rules: Joi.array().items(UpdateGradingRuleSchema)
}).min(1)

// *************** TEST SCHEMAS ***************
// Validation schema for creating a test
const CreateTestSchema = Joi.object({
    name: Joi.string().required(),
    subject_id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    weightage: Joi.number().greater(0).max(100).required(),
    grading_rules: Joi.array().items(CreateGradingRuleSchema).required()
})

// Validation schema for updating a test
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
    UpdateTestSchema,
    ValidateInput
}