// *************** IMPORT LIBRARY ***************
import { GraphQLError } from 'graphql';

// *************** ERROR CLASS ***************
/**
 * Standardized operational error wrapper mechanism enforcing architectural contract compliance across layers.
 * @param {string} message - Human-readable contextual evaluation summary explaining the fault state.
 * @param {string} code - Strict internal tracking constant representing specific domain error types.
 * @param {number} httpStatus - Target network transport layer compliance code maps.
 */
class AppError extends Error {
  constructor(message, code, httpStatus) {
    super(message);
    this.code = code;
    this.httpStatus = httpStatus;
  }
}

// *************** GRAPHQL ERROR HANDLER ***************
/**
 * Transforms system exceptions into standard format GraphQLErrors for client transport layers.
 * @param {Error|AppError|GraphQLError} error - Incoming native or custom error object from downstream processes.
 * @returns {GraphQLError} Standardized error structure populated with domain-specific extensions.
 */
const NormalizeGqlError = (error) => {
  // *************** START: Preserve GraphQL errors ***************
  if (error instanceof GraphQLError) {
    throw error;
  }
  // *************** END: Preserve GraphQL errors ***************

  // *************** START: Transform application errors ***************
  if (error instanceof AppError) {
    return new GraphQLError(error.message, {
      extensions: {
        code: error.code,
        ...(error.httpStatus && { http: { status: error.httpStatus } }),
        ...(error.meta && { meta: error.meta }),
      },
    });
  }
  // *************** END: Transform application errors ***************

  // *************** START: Handle unknown errors ***************
  return new GraphQLError('An internal server error occured', {
    extensions: { code: 'INTERNAL_SERVER_ERROR', http: { status: 500 } },
  });
  // *************** END: Handle unknown errors ***************
};

// *************** REST API ERROR HANDLER ***************
/**
 * Handles REST API errors and sends standardized HTTP error responses.
 * @param {Object} res - Express response object used to send HTTP responses.
 * @param {Error|AppError} error - Incoming error object generated during request processing.
 * @returns {Object} Express response containing standardized error payload.
 */
const HandleApiError = (res, error) => {
  // *************** START: Handle known application errors ***************
  if (error instanceof AppError) {
    return res.status(error.httpStatus).json({
      status: 'fail',
      code: error.code,
      message: error.message,
      ...(error.meta && { meta: error.meta }),
    });
  }
  // *************** END: Handle known application errors ***************

  // *************** START: Handle unknown errors ***************
  return res.status(500).json({
    status: 'error',
    code: 'INTERNAL_SERVER_ERROR',
    message: 'An internal server error occured',
  });
  // *************** END: Handle unknown errors ***************
};

// *************** EXPORT MODULE ***************
export { AppError, HandleApiError, NormalizeGqlError };
