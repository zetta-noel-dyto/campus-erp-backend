// *************** IMPORT MODULE ***************
import { CreateStudentSchema } from './student.validator.js';
import { CreateStudentHelper } from './student.helper.js';
import { NormalizeGqlError } from '../../../core/error.js';
import { ValidateInput } from '../../academic/curriculum/curriculum.validator.js';

// *************** STUDENT RESOLVERS ***************
/**
 * Handles GraphQL mutation for creating a new student record.
 * @param {null} _ - Unused GraphQL root source context
 * @param {object} args - Request arguments
 * @param {object} args.input - Payload containing student creation data
 * @throws {GraphQLError} Normalized operational or validation errors
 * @returns {Promise<object>} The newly created student document
 */
const CreateStudent = async (_, { input }) => {
  try {
    // *************** START: Validate input payload ***************
    const data = ValidateInput(CreateStudentSchema, input);
    // *************** END: Validate input payload ***************

    return await CreateStudentHelper(data);
  } catch (error) {
    throw NormalizeGqlError(error);
  }
};

// *************** GRAPHQL RESOLVERS ***************
const resolver = {
  Mutation: {
    CreateStudent,
  },
};

// *************** EXPORT MODULE ***************
export { resolver };
