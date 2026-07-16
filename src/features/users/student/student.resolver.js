// *************** IMPORT MODULE ***************
import { CreateStudentHelper, GetStudentsByAcademicYearHelper } from './student.helper.js';
import { CreateStudentSchema, GetStudentsByAcademicYearSchema } from './student.validator.js';
import { NormalizeGqlError } from '../../../core/error.js';
import { ValidateInput } from '../../../shared/validators/input.validators.js';

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

/**
 * Handles GraphQL query for retrieving students filtered by academic year with pagination support.
 *
 * @param {null} _ - Unused GraphQL root source context
 * @param {object} args - Request arguments
 * @param {object} args.input - Filter and pagination payload
 * @throws {GraphQLError} Normalized operational or validation errors
 * @returns {Promise<object>} Paginated list of students with metadata
 */
const GetStudentsByAcademicYear = async (_, { input }) => {
  try {
    // *************** START: Validate input payload ***************
    const data = ValidateInput(GetStudentsByAcademicYearSchema, input);
    // *************** END: Validate input payload ***************

    return await GetStudentsByAcademicYearHelper(data);
  } catch (error) {
    throw NormalizeGqlError(error);
  }
};

// *************** GRAPHQL RESOLVERS ***************
const resolver = {
  Mutation: {
    CreateStudent,
  },
  Query: {
    GetStudentsByAcademicYear,
  },
  Student: {
    academic_years(parent, _, context) {
      return context.AcademicYearLoader.loadMany(parent.academic_year_ids);
    },
  },
};

// *************** EXPORT MODULE ***************
export { resolver };
