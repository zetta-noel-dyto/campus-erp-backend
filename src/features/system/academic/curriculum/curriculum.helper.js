// *************** IMPORT LIBRARY ***************
import mongoose from 'mongoose';

// *************** IMPORT MODULE ***************
import { AppError } from '../../../../core/error.js';
import { BlockModel as Blocks } from './curriculum.model.js';
import { SubjectModel as Subjects } from "./curriculum.model.js";
import { TestModel as Tests } from './curriculum.model.js';

/**
 * Validates uniqueness and instantiates a new academic block record.
 * * @param {object} input - Core properties for block creation
 * @throws {AppError} 409 if block name exists, 500 if collection insert fails
 * @returns {Promise<object>} The created block document
 */
const CreateBlockHelper = async (input) => {
    const exist = await Blocks.findOne({ name: input.name });
    if (exist) {
        throw new AppError('Block already exist', "BLOCK_EXIST", 409);
    }

    const block = await Blocks.create(input);
    if (!block) {
        throw new AppError('Failed to create block', "CREATE_BLOCK_FAILED", 500);
    }

    return block;
}

/**
 * Modifies fields of an existing academic block after verifying name uniqueness.
 * * @param {string} id - Target block unique identifier
 * @param {object} input - Mutation properties to apply
 * @throws {AppError} 404 if block missing, 409 if target name clashes, 500 if updates fail
 * @returns {Promise<object>} The mutated block document
 */
const UpdateBlockHelper = async (id, input) => {
    const exist = await Blocks.findById(id);
    if (!exist) {
        throw new AppError('Block not found', "BLOCK_NOT_FOUND", 404);
    }

    const check = await Blocks.findOne({ name: input.name, _id: { $ne: id } });
    if (check) {
        throw new AppError('Block already exist', "BLOCK_EXIST", 409);
    }

    const block = await Blocks.findByIdAndUpdate(id, input, { new: true });
    if (!block) {
        throw new AppError('Failed to update block', "UPDATE_BLOCK_FAILED", 500);
    }

    return block;
}

/**
 * Removes an academic block after verifying it has no child subject relations.
 * * @param {string} id - Target block unique identifier
 * @throws {AppError} 404 if block missing, 409 if dependent subjects exist
 * @returns {Promise<object>} The deleted block document pre-destruction
 */
const DeleteBlockHelper = async (id) => {
    const block = await Blocks.findById(id);
    if (!block) {
        throw new AppError('Block not found', "BLOCK_NOT_FOUND", 404);
    }

    const subjects = await Subjects.exists({ block_id: id });
    if (subjects) {
        throw new AppError("Cannot delete block with existing subjects", "BLOCK_HAS_CHILDREN", 409);
    }
    await Blocks.findByIdAndDelete(id);

    return block;
}

/**
 * Verifies parent reference existence and registers a new subject item.
 * * @param {object} input - Core properties including block_id reference and name
 * @throws {AppError} 404 if parent block missing, 409 if subject name exists, 500 if insertion fails
 * @returns {Promise<object>} The created subject document
 */
const CreateSubjectHelper = async (input) => {
    const block = await Blocks.findById(input.block_id);
    if (!block) {
        throw new AppError('Block not found', "BLOCK_NOT_FOUND", 404);
    }

    const exist = await Subjects.findOne({ name: input.name });
    if (exist) {
        throw new AppError('Subject already exist', "SUBJECT_EXIST", 409);
    }

    const subject = await Subjects.create(input);
    if (!subject) {
        throw new AppError('Failed to create subject', "CREATE_SUBJECT_FAILED", 500);
    }

    return subject;
}

/**
 * Modifies an existing subject descriptor after ensuring name parameters are unique.
 * * @param {string} id - Target subject unique identifier
 * @param {object} input - Mutation properties to apply
 * @throws {AppError} 404 if subject missing, 409 if name clashes, 500 if updates fail
 * @returns {Promise<object>} The updated subject document
 */
const UpdateSubjectHelper = async (id, input) => {
    const exist = await Subjects.findById(id);
    if (!exist) {
        throw new AppError('Subject not found', "SUBJECT_NOT_FOUND", 404);
    }

    const check = await Subjects.findOne({ name: input.name, _id: { $ne: id } })
    if (check) {
        throw new AppError('Subject already exist', "SUBJECT_EXIST", 409);
    }

    const subject = await Subjects.findByIdAndUpdate(id, input, { new: true });
    if (!subject) {
        throw new AppError('Failed to update subject', "UPDATE_SUBJECT_FAILED", 500);
    }

    return subject;
}

/**
 * Removes an existing subject item after verifying it contains no child test entities.
 * * @param {string} id - Target subject unique identifier
 * @throws {AppError} 404 if subject missing, 409 if dependent tests exist
 * @returns {Promise<object>} The deleted subject document pre-destruction
 */
const DeleteSubjectHelper = async (id) => {
    const subject = await Subjects.findById(id);
    if (!subject) {
        throw new AppError('Subject not found', "SUBJECT_NOT_FOUND", 404);
    }

    const tests = await Tests.exists({ subject_id: id });
    if (tests) {
        throw new AppError("Cannot delete subject with existing tests", "SUBJECT_HAS_CHILDREN", 409);
    }
    await Subjects.findByIdAndDelete(id);

    return subject;
}

/**
 * Verifies parent subject visibility constraints and provisions a new test entity.
 * * @param {object} input - Core properties including subject_id reference and name
 * @throws {AppError} 404 if parent subject missing, 409 if test name exists, 500 if creation fails
 * @returns {Promise<object>} The created test document
 */
const CreateTestHelper = async (input) => {
    const subject = await Subjects.findById(input.subject_id);
    if (!subject) {
        throw new AppError('Subject not found', "SUBJECT_NOT_FOUND", 404);
    }

    const exist = await Tests.findOne({ name: input.name });
    if (exist) {
        throw new AppError('Test already exist', "TEST_EXIST", 409);
    }

    const test = await Tests.create(input);
    if (!test) {
        throw new AppError('Failed to create test', "CREATE_TEST_FAILED", 500);
    }

    return test;
}

/**
 * Updates parameters on an existing test item following name identity verification.
 * * @param {string} id - Target test unique identifier
 * @param {object} input - Mutation properties to apply
 * @throws {AppError} 404 if test missing, 409 if name clashes, 500 if updates fail
 * @returns {Promise<object>} The updated test document
 */
const UpdateTestHelper = async (id, input) => {
    const exist = await Tests.findById(id);
    if (!exist) {
        throw new AppError('Test not found', "TEST_NOT_FOUND", 404);
    }

    const check = await Tests.findOne({ name: input.name, _id: { $ne: id } });
    if (check) {
        throw new AppError('Test already exist', "TEST_EXIST", 409);
    }

    const test = await Tests.findByIdAndUpdate(id, input, { new: true });
    if (!test) {
        throw new AppError('Failed to update test', "UPDATE_TEST_FAILED", 500);
    }

    return test;
}

/**
 * Removes an individual test node from database storage tracking directly.
 * * @param {string} id - Target test unique identifier
 * @throws {AppError} 404 if test document is missing
 * @returns {Promise<object>} The wiped test document parameters
 */
const DeleteTestHelper = async (id) => {
    const test = await Tests.findById(id);
    if (!test) {
        throw new AppError('Test not found', "TEST_NOT_FOUND", 404);
    }

    await Tests.findByIdAndDelete(id);
    return test;
}

/**
 * Validates accumulated subject weightages under a specific block boundary.
 * * @param {string} block_id - Target block identifier
 * @param {number} incomingWeightage - New subject weight package
 * @throws {AppError} 400 if aggregate weight breaches 100% threshold
 */
const ValidateSubjectWeightage = async (block_id, incomingWeightage) => {
    const subjects = await Subjects.find({ block_id });
    let totalWeightages = subjects.reduce((acc, subject) => acc + subject.weightage, 0);
    totalWeightages = Number((totalWeightages + incomingWeightage).toFixed(2));

    if (totalWeightages > 100) {
        throw new AppError('Subject weightage exceeds 100', "WEIGHTAGE_LIMIT_EXCEEDED", 400);
    }
}

/**
 * Validates accumulated test weightages under a specific subject boundary.
 * * @param {string} subject_id - Target subject identifier
 * @param {number} incomingWeightage - New test weight package
 * @throws {AppError} 400 if aggregate weight breaches 100% threshold
 */
const ValidateTestWeightage = async (subject_id, incomingWeightage) => {
    const tests = await Tests.find({ subject_id });
    let totalWeightages = tests.reduce((acc, test) => acc + test.weightage, 0);
    totalWeightages = Number((totalWeightages + incomingWeightage).toFixed(2));

    if (totalWeightages > 100) {
        throw new AppError('Subject weightage exceeds 100', "WEIGHTAGE_LIMIT_EXCEEDED", 400);
    }
}

/**
 * Evaluates entity immutability state based on persistent transactional records.
 * * @param {string} entity_id - Structural entity unique key
 * @throws {AppError} 409 if active data prevents structural modifications
 */
const checkEntityLock = async (entity_id) => {
    const StudentGrades = mongoose.connection.collection("student_grades");
    const existing = await StudentGrades.findOne({ entity_id });

    if (existing) {
        throw new AppError('Entity is locked due to existing grades', "ENTITY_LOCKED_GRADES_EXIST", 409);
    }
}

// *************** EXPORT MODULE ***************
export {
    checkEntityLock,
    CreateBlockHelper,
    UpdateBlockHelper,
    DeleteBlockHelper,
    CreateSubjectHelper,
    UpdateSubjectHelper,
    DeleteSubjectHelper,
    CreateTestHelper,
    UpdateTestHelper,
    DeleteTestHelper,
    ValidateSubjectWeightage,
    ValidateTestWeightage
}