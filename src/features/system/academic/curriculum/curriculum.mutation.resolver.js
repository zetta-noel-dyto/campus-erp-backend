// *************** IMPORT MODULE ***************
import { NormalizeGqlError } from "../../../../core/error.js";
import {
    checkEntityLock,
    ValidateSubjectWeightage,
    ValidateTestWeightage
} from "./curriculum.helper.js";
import {
    BlockModel as Blocks,
    SubjectModel as Subjects,
    TestModel as Tests
} from "./curriculum.model.js";
import {
    CreateBlockSchema,
    CreateSubjectSchema,
    CreateTestSchema,
    UpdateBlockSchema,
    UpdateSubjectSchema,
    UpdateTestSchema,
    ValidateInput
} from "./curriculum.validator.js"

// *************** MUTATIONS ***************

/**
 * Validates and creates a new academic block record.
 * 
 * @param {null} _ - Unused GraphQL root source context
 * @param {object} args - Contains payload inputs
 * @param {object} args.input - Raw configuration fields for the new block
 * @throws {GraphQLError} Normalized representation of validation or storage failure
 * @returns {Promise<object>} The newly generated block database record
 */
const CreateBlock = async (_, { input }) => {
    try {
        const data = ValidateInput(CreateBlockSchema, input);
        return await Blocks.create(data);
    } catch (error) {
        throw NormalizeGqlError(error);
    }
}

/**
 * Updates an un-locked academic block using partial modifications.
 * 
 * @param {null} _ - Unused GraphQL root source context
 * @param {object} args - Operational input arguments
 * @param {string} args.id - Target record identifier
 * @param {object} args.input - Partial payload containing mutation fields
 * @throws {GraphQLError} Normalized representations of state locking or validation errors
 * @returns {Promise<object>} The updated block document structure
 */
const UpdateBlock = async (_, { id, input }) => {
    try {
        await checkEntityLock(id);
        const data = ValidateInput(UpdateBlockSchema, input);
        return await Blocks.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
        throw NormalizeGqlError(error)
    }
}

/**
 * Removes a specific academic block record by its unique identifier.
 * 
 * @param {null} _ - Unused GraphQL root source context
 * @param {object} args - Structural targets for deletion
 * @param {string} args.id - Target record identifier
 * @throws {GraphQLError} Normalized representations of operational locking failures
 * @returns {Promise<object>} The raw data of the deleted block document
 */
const DeleteBlock = async (_, { id }) => {
    try {
        await checkEntityLock(id);
        return await Blocks.findByIdAndDelete(id);
    } catch (error) {
        throw NormalizeGqlError(error);
    }
}

/**
 * Validates aggregate weight boundary metrics and spawns a new subject instance.
 * 
 * @param {null} _ - Unused GraphQL root source context
 * @param {object} args - Payload input mappings
 * @param {object} args.input - Raw fields defining name, block relations, and weightage
 * @throws {GraphQLError} Normalized error from schema issues or weight accumulation limits
 * @returns {Promise<object>} The newly created subject data entry
 */
const CreateSubject = async (_, { input }) => {
    try {
        const data = ValidateInput(CreateSubjectSchema, input);
        await ValidateSubjectWeightage(data.block_id, data.weightage);
        return await Subjects.create(data);
    } catch (error) {
        throw NormalizeGqlError(error);
    }
}

/**
 * Adjusts structural elements of an existing subject item under verification locks.
 * 
 * @param {null} _ - Unused GraphQL root source context
 * @param {object} args - Operation parameters for state mutation
 * @param {string} args.id - Target record identifier
 * @param {object} args.input - Configuration updates for the subject properties
 * @throws {GraphQLError} Normalized tracking errors for runtime resource locking failures
 * @returns {Promise<object>} The mutation output data from the modified record
 */
const UpdateSubject = async (_, { id, input }) => {
    try {
        await checkEntityLock(id);
        const data = ValidateInput(UpdateSubjectSchema, input);
        return await Subjects.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
        throw NormalizeGqlError(error);
    }
}

/**
 * Deletes an existing subject item using explicit identification checks.
 * 
 * @param {null} _ - Unused GraphQL root source context
 * @param {object} args - Elimination metrics containing resource markers
 * @param {string} args.id - Target record identifier
 * @throws {GraphQLError} Handled error packets detailing transaction lock failure states
 * @returns {Promise<object>} The original document content pre-destruction phase
 */
const DeleteSubject = async (_, { id }) => {
    try {
        await checkEntityLock(id);
        return await Subjects.findByIdAndDelete(id);
    } catch (error) {
        throw NormalizeGqlError(error);
    }
}

/**
 * Evaluates internal distribution rules and instantiates a new examination test.
 * 
 * @param {null} _ - Unused GraphQL root source context
 * @param {object} args - Input wrappers containing tracking info
 * @param {object} args.input - Property schema setting name, subject ties, and weight parameters
 * @throws {GraphQLError} Handled limits mapping payload data failures
 * @returns {Promise<object>} The operational transaction state tracker representing the test entity
 */
const CreateTest = async (_, { input }) => {
    try {
        const data = ValidateInput(CreateTestSchema, input);
        await ValidateTestWeightage(data.subject_id, data.weightage);
        return await Tests.create(data);
    } catch (error) {
        throw NormalizeGqlError(error);
    }
}

/**
 * Mutates structural attributes on an individual test criteria layout.
 * 
 * @param {null} _ - Unused GraphQL root source context
 * @param {object} args - Data items processing update requests
 * @param {string} args.id - Target record identifier
 * @param {object} args.input - Structural property modifications mapped over target values
 * @throws {GraphQLError} Handled tracking representations for locked entity changes
 * @returns {Promise<object>} The mutated document values resulting from runtime execution
 */
const UpdateTest = async (_, { id, input }) => {
    try {
        await checkEntityLock(id);
        const data = ValidateInput(UpdateTestSchema, input);
        return await Tests.findByIdAndUpdate(id, data, { new: true });
    } catch (error) {
        throw NormalizeGqlError(error);
    }
}

/**
 * Evaluates execution blocks and wipes a chosen test descriptor from persistence.
 * 
 * @param {null} _ - Unused GraphQL root source context
 * @param {object} args - Deletion properties wrapping execution contexts
 * @param {string} args.id - Target record identifier
 * @throws {GraphQLError} System exception states triggered during operational block evaluations
 * @returns {Promise<object>} The deleted test database document
 */
const DeleteTest = async (_, { id }) => {
    try {
        await checkEntityLock(id);
        return await Tests.findByIdAndDelete(id);
    } catch (error) {
        throw NormalizeGqlError(error);
    }
}

// *************** GRAPHQL RESOLVERS ***************
const resolver = {
    Mutation: {
        CreateBlock,
        UpdateBlock,
        DeleteBlock,
        CreateSubject,
        UpdateSubject,
        DeleteSubject,
        CreateTest,
        UpdateTest,
        DeleteTest
    }
}

// *************** EXPORT MODULE ***************
export {
    resolver
}