// *************** IMPORT MODULE ***************
import { LoginHelper } from './auth.helper.js'
import { LoginSchema } from './auth.validator.js'
import { NormalizeGqlError } from '../../../core/error.js'
import { ValidateInput } from '../../../shared/validators/input.validators.js'

// *************** MUTATION ***************
/**
 * Handles user login mutation by validating input and executing authentication flow.
 * @param {Object} _ - Unused GraphQL resolver parent object.
 * @param {Object} args - GraphQL resolver arguments.
 * @param {Object} args.input - Login credentials payload.
 * @returns {Promise<string>} JWT authentication token.
 * @throws {Error} Normalized GraphQL error when authentication fails.
 */
const Login = async (_, { input }) => {
  try {
    // *************** START: Validate login payload ***************
    const data = ValidateInput(LoginSchema, input)
    // *************** END: Validate login payload ***************

    // *************** START: Authenticate user ***************
    return await LoginHelper(data)
    // *************** END: Authenticate user ***************
  } catch (error) {
    throw NormalizeGqlError(error)
  }
}

// *************** EXPORT MODULE ***************
const resolver = {
  Mutation: {
    Login
  }
}

export { resolver }
