// *************** IMPORT LIBRARY ***************
import { GraphQLError } from 'graphql';

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
    convert: true,
  });

  if (error) {
    const errors = error.details.map((detail) => ({
      // Field path that failed validation
      field: detail.path.join('.'),
      // Human-readable validation error message
      message: detail.message,
    }));

    throw new GraphQLError('Validation failed', {
      extensions: {
        code: 'INVALID_INPUT',
        http: { status: 400 },
        context,
        errors,
      },
    });
  }

  return value;
};

export { ValidateInput };
