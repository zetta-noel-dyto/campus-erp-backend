// *************** GLOBAL VARIABLES ***************
/**
 * Standardized operational error wrapper mechanism enforcing architectural contract compliance across layers.
 * 
 * @param {string} message - Human-readable contextual evaluation summary explaining the fault state
 * @param {string} code - Strict internal tracking constant representing specific domain error types
 * @param {number} httpStatus - Target network transport layer compliance code maps
 */
class AppError extends Error {
    constructor(message, code, httpStatus) {
        super(message);
        this.code = code;
        this.httpStatus = httpStatus
    }
}

// *************** EXPORT MODULE ***************
export {
    AppError
}