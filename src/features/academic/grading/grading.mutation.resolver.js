// *************** IMPORT MODULE ***************
import { NormalizeGqlError } from '../../../core/error.js'
import { SubmitTestGradesHelper } from './grading.helper.js'
import { SubmitTestGradesSchema } from './grading.validator.js'
import { ValidateInput } from '../../../shared/validators/input.validators.js'

// *************** MUTATION ***************
/**
 * Handles student grade submission by validating input and executing grade persistence logic.
 * @param {Object} _ - Unused GraphQL resolver parent object.
 * @param {Object} args - GraphQL resolver arguments.
 * @param {Object} args.input - Student grade submission payload.
 * @returns {Promise<Array<Object>>} Newly created student grade records.
 * @throws {Error} Normalized GraphQL error when validation or submission fails.
 */
const SubmitTestGrades = async (_, { input }) => {
  try {
    // *************** START: Validate grade submission payload ***************
    const data = ValidateInput(SubmitTestGradesSchema, input)
    // *************** END: Validate grade submission payload ***************

    // *************** START: Submit student grades ***************
    return await SubmitTestGradesHelper(data)
    // *************** END: Submit student grades ***************
  } catch (error) {
    throw NormalizeGqlError(error)
  }
}

// *************** EXPORT MODULE ***************
const resolver = {
  Mutation: {
    SubmitTestGrades
  }
}

export { resolver }
