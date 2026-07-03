// *************** IMPORT MODULE ***************
import { EnrollStudentsSchema } from "./enrollment.validator.js";
import { ValidateInput } from "../curriculum/curriculum.validator.js";
import { NormalizeGqlError } from "../../../core/error.js";
import { EnrollStudentHelper } from "./enrollment.helper.js";

// *************** ENROLLMENT RESOLVERS ***************
/**
 * Handles GraphQL mutation for enrolling multiple students into an academic year.
 * @param {null} _ - Unused GraphQL root source context
 * @param {object} args - Request arguments
 * @param {object} args.input - Payload containing academic_year_id and student_ids
 * @throws {GraphQLError} Normalized validation or operational errors
 * @returns {Promise<object>} Updated academic year document after enrollment
 */
const EnrollStudentsToYear = async (_, { input }) => {
    try {
        // *************** START: Validate input payload ***************
        const data = ValidateInput(EnrollStudentsSchema, input);
        // *************** END: Validate input payload ***************

        return await EnrollStudentHelper(data);
    } catch (error) {
        throw NormalizeGqlError(error);
    }
}

// *************** GRAPHQL RESOLVERS ***************
const resolver = {
    Mutation: {
        EnrollStudentsToYear
    }
}

// *************** EXPORT MODULE ***************
export {
    resolver
}