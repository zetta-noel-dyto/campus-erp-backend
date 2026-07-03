// *************** IMPORT LIBRARY ***************
import { GraphQLError } from "graphql";

/**
 * Standardized operational error wrapper mechanism enforcing architectural contract compliance across layers.
 * @param {string} message - Human-readable contextual evaluation summary explaining the fault state
 * @param {string} code - Strict internal tracking constant representing specific domain error types
 * @param {number} httpStatus - Target network transport layer compliance code maps
 */
class AppError extends Error {
    constructor(message, code, httpStatus) {
        super(message);
        this.code = code;
        this.httpStatus = httpStatus;
    }
}

/**
 * Transforms system exceptions into standard format GraphQLErrors for client transport layers.
 * @param {Error|AppError|GraphQLError} error - Incoming native or custom error object from downstream processes
 * @returns {GraphQLError} Standardized error structure populated with domain-specific extensions
 */
const NormalizeGqlError = (error) => {
    if (error instanceof GraphQLError) {
        throw error;
    }

    if (error instanceof AppError) {
        return new GraphQLError(error.message, {
            extensions: {
                code: error.code,
                ...(error.httpStatus && { http: { status: error.httpStatus } }),
                ...(error.meta && { meta: error.meta })
            }
        })
    }

    return new GraphQLError('An internal server error occured', {
        extensions: { code: "INTERNAL_SERVER_ERROR", http: { status: 500 } }
    })
}

// *************** EXPORT MODULE ***************
export {
    AppError,
    NormalizeGqlError
}