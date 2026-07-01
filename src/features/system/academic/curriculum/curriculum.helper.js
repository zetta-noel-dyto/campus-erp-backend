// *************** IMPORT LIBRARY ***************
import mongoose from 'mongoose';

// *************** IMPORT MODULE ***************
import { AppError } from '../../../../core/error.js';
import { SubjectModel as Subjects } from "./curriculum.model.js";
import { TestModel as Tests } from './curriculum.model.js';

/**
 * Validates accumulated subject weightages under a specific block boundary.
 * 
 * @param {string} block_id - Target block identifier
 * @param {number} incomingWeightage - New subject weight package
 * @throws {AppError} If aggregate weight breaches 100% threshold
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
 * 
 * @param {string} subject_id - Target subject identifier
 * @param {number} incomingWeightage - New test weight package
 * @throws {AppError} If aggregate weight breaches 100% threshold
 */
const ValidateTestWeightage = async (subject_id, incomingWeightage) => {
    const tests = await Tests.find({ subject_id });
    let totalWeightages = tests.reduce((acc, subject) => acc + tests.weightage, 0);
    totalWeightages = Number((totalWeightages + incomingWeightage).toFixed(2));

    if (totalWeightages > 100) {
        throw new AppError('Subject weightage exceeds 100', "WEIGHTAGE_LIMIT_EXCEEDED", 400);
    }
}

/**
 * Evaluates entity immutability state based on persistent transactional records.
 * 
 * @param {string} entity_id - Structural entity unique key
 * @throws {AppError} If active data prevents structural modifications
 */
const checkEntityLock = async (entity_id) => {
    const StudentGrades = mongoose.connection.collection("student_grades");
    const existing = StudentGrades.findOne({ entity_id });

    if (existing) {
        throw new AppError("Entity is locked due to existing grades", "ENTITY_LOCKED_GRADES_EXIST", 409);
    }
}

// *************** EXPORT MODULE ***************
export {
    checkEntityLock,
    ValidateSubjectWeightage,
    ValidateTestWeightage
}