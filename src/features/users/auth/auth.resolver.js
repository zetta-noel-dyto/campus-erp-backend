// *************** IMPORT MODULE ***************
import { LoginHelper } from './auth.helper.js';
import { LoginSchema } from './auth.validator.js';
import { NormalizeGqlError } from '../../../core/error.js';
import { ValidateInput } from '../../../shared/validators/validators.input.js';

// *************** MUTATION ***************
/**
 * Handles user login mutation by validating input and executing authentication flow.
 *
 * @param {Object} _ - Unused GraphQL resolver parent object.
 * @param {Object} args - GraphQL resolver arguments.
 * @param {Object} args.input - Login credentials payload.
 * @returns {Promise<string>} JWT authentication token.
 * @throws {Error} Normalized GraphQL error when authentication fails.
 */
const Login = async (_, { input }) => {
  try {
    // *************** START: Validate login payload ***************
    // Ensure login input follows the required authentication schema before processing.
    const data = ValidateInput(LoginSchema, input);
    // *************** END: Validate login payload ***************

    // *************** START: Authenticate user ***************
    // Verify user credentials and generate authentication token.
    return await LoginHelper(data);
    // *************** END: Authenticate user ***************
  } catch (error) {
    // *************** Normalize authentication error response ***************
    // Convert internal errors into standardized GraphQL error format.
    throw NormalizeGqlError(error);
  }
};

// *************** EXPORT MODULE ***************
const resolver = {
  Mutation: {
    Login,
  },
};

export { resolver };
