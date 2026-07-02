// *************** IMPORT MODULE ***************
import { NormalizeGqlError } from "../../../core/error.js";
import {
    checkEntityLock,
    CreateBlockHelper,
    CreateSubjectHelper,
    DeleteBlockHelper,
    DeleteTestHelper,
    UpdateBlockHelper,
    UpdateSubjectHelper,
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

/**
 * Validates inputs and creates a new academic block record via helper.
 * * @param {null} _ - Unused GraphQL root source context
 * @param {object} args - Request parameters
 * @param {object} args.input - Payload configurations for the new block
 * @throws {GraphQLError} Normalized representation of validation or creation failures
 * @returns {Promise<object>} The newly generated block document record
 */
const CreateBlock = async (_, { input }) => {
    try {
        const data = ValidateInput(CreateBlockSchema, input);
        return await CreateBlockHelper(data);
    } catch (error) {
        throw NormalizeGqlError(error);
    }
}

/**
 * Updates an un-locked academic block using partial adjustments via helper.
 * * @param {null} _ - Unused GraphQL root source context
 * @param {object} args - Request parameters
 * @param {string} args.id - Unique block target identifier
 * @param {object} args.input - Partial payload properties containing mutations
 * @throws {GraphQLError} Normalized operational errors for locked entities or validation issues
 * @returns {Promise<object>} The newly updated block document structure
 */
const UpdateBlock = async (_, { id, input }) => {
    try {
        await checkEntityLock(id);
        const data = ValidateInput(UpdateBlockSchema, input);
        return await UpdateBlockHelper(id, data);
    } catch (error) {
        throw NormalizeGqlError(error);
    }
}

/**
 * Destroys a chosen academic block using strict relational checks via helper.
 * * @param {null} _ - Unused GraphQL root source context
 * @param {object} args - Request parameters
 * @param {string} args.id - Unique block target identifier
 * @throws {GraphQLError} Normalized operational errors if the resource state is locked
 * @returns {Promise<object>} The deleted block data values pre-destruction phase
 */
const DeleteBlock = async (_, { id }) => {
    try {
        await checkEntityLock(id);
        return await DeleteBlockHelper(id);
    } catch (error) {
        throw NormalizeGqlError(error);
    }
}

/**
 * Validates constraints and generates a new subject entry via helper.
 * * @param {null} _ - Unused GraphQL root source context
 * @param {object} args - Request parameters
 * @param {object} args.input - Payload containing name, parent block references, and weights
 * @throws {GraphQLError} Normalized errors handling schema verification or cumulative weight breaches
 * @returns {Promise<object>} The newly created subject data structure
 */
const CreateSubject = async (_, { input }) => {
    try {
        const data = ValidateInput(CreateSubjectSchema, input);
        await ValidateSubjectWeightage(data.block_id, data.weightage);
        return await CreateSubjectHelper(data);
    } catch (error) {
        throw NormalizeGqlError(error);
    }
}

/**
 * Modifies structural components on a designated unlocked subject via helper.
 * * @param {null} _ - Unused GraphQL root source context
 * @param {object} args - Request parameters
 * @param {string} args.id - Unique subject target identifier
 * @param {object} args.input - Partial schema items targeted for overriding fields
 * @throws {GraphQLError} Normalized errors handling transactional resource locks
 * @returns {Promise<object>} The resulting subject record values post mutation execution
 */
const UpdateSubject = async (_, { id, input }) => {
    try {
        await checkEntityLock(id);
        const data = ValidateInput(UpdateSubjectSchema, input);
        return await UpdateSubjectHelper(id, data);
    } catch (error) {
        throw NormalizeGqlError(error);
    }
}

/**
 * Purges an individual subject descriptor from database persistence via helper.
 * * @param {null} _ - Unused GraphQL root source context
 * @param {object} args - Request parameters
 * @param {string} args.id - Unique subject target identifier
 * @throws {GraphQLError} Normalized errors detailing active entity lock states
 * @returns {Promise<object>} The removed subject document values
 */
const DeleteSubject = async (_, { id }) => {
    try {
        await checkEntityLock(id);
        return await DeleteSubjectHelper(id);
    } catch (error) {
        throw NormalizeGqlError(error);
    }
}

/**
 * Enforces fractional limit tracking and instantiates a new examination test.
 * * @param {null} _ - Unused GraphQL root source context
 * @param {object} args - Request parameters
 * @param {object} args.input - Properties matching name, parent subject ties, and weight points
 * @throws {GraphQLError} Normalized errors handling schema exceptions or weightage overflows
 * @returns {Promise<object>} The newly generated test collection record
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
 * Overwrites specific parameters on an un-locked test descriptor document.
 * * @param {null} _ - Unused GraphQL root source context
 * @param {object} args - Request parameters
 * @param {string} args.id - Unique test target identifier
 * @param {object} args.input - Modifiable values mapping over structural properties
 * @throws {GraphQLError} Normalized errors reporting transaction block updates on active items
 * @returns {Promise<object>} The modified record payload output
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
 * Removes an individual test item using verification protocols via helper.
 * * @param {null} _ - Unused GraphQL root source context
 * @param {object} args - Request parameters
 * @param {string} args.id - Unique test target identifier
 * @throws {GraphQLError} Normalized errors dealing with unexpected modification locks
 * @returns {Promise<object>} The raw data of the deleted test document
 */
const DeleteTest = async (_, { id }) => {
    try {
        await checkEntityLock(id);
        return await DeleteTestHelper(id);
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