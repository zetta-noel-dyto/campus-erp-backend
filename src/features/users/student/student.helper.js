// *************** IMPORT MODULE ***************
import mongoose from 'mongoose';
import { AppError } from '../../../core/error.js';
import { StudentModel as Students } from './student.model.js';

// *************** STUDENT HELPERS ***************
const GetStudentsByAcademicYearHelper = async (input) => {
    const page = input.page || 1;
    const limit = input.limit || 10;
    const skip = (page - 1) * limit;

    const query = {
        academic_year_ids: new mongoose.Types.ObjectId(input.academic_year_id),
    }
    if (input.search) {
        query.$or = [{ first_name: { $regex: input.search, $options: 'i' } }, { last_name: { $regex: input.search, $options: 'i' } }];
    }

    const students = await Students.aggregate([
        { $match: query },
        {
            $facet: {
                metadata: [{ $count: 'total' }],
                data: [{ $skip: skip }, { $limit: limit }],
            },
        }
    ])
    const total = students[0].metadata[0]?.total || 0;
    const data = result[0].data;
    const total_pages = Math.ceil(total / limit);

    return {
        total_count: total,
        current_page: page,
        total_pages,
        data,
    }
}

/**
 * Creates a new student record after validating uniqueness constraints.
 * @param {object} input - Student payload containing identity and academic data
 * @throws {AppError} 409 if student already exists, 500 if creation fails
 * @returns {Promise<object>} The newly created student document
 */
const CreateStudentHelper = async (input) => {
    // *************** START: Validate duplicate student ***************
    // Checks whether a student already exists with same email OR student number
    const exist = await Students.findOne({
        $or: [{ email: input.email }, { student_number: input.student_number }],
    }).lean();
    if (exist) {
        throw new AppError('Student already exist', 'STUDENT_EXIST', 409);
    }
    // *************** END: Validate duplicate student ***************

    // *************** START: Persist student creation ***************
    const student = await Students.create(input);
    if (!student) {
        throw new AppError('Failed to create student', 'CREATE_STUDENT_FAILED', 500);
    }

    return student;
    // *************** END: Persist student creation ***************
}

// *************** EXPORT MODULE ***************
export {
    CreateStudentHelper,
    GetStudentsByAcademicYearHelper
}