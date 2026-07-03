// *************** IMPORT MODULE ***************
import { AppError } from "../../../core/error.js";
import { StudentModel as Students } from "./student.model.js";

// *************** STUDENT HELPERS ***************
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
        $or: [
            { email: input.email },
            { student_number: input.student_number }
        ]
    }).lean();
    if (exist) {
        throw new AppError('Student already exist', "STUDENT_EXIST", 409);
    }
    // *************** END: Validate duplicate student ***************

    // *************** START: Persist student creation ***************
    const student = await Students.create(input);
    if (!student) {
        throw new AppError('Failed to create student', "CREATE_STUDENT_FAILED", 500);
    }

    return student;
    // *************** END: Persist student creation ***************
}

// *************** EXPORT MODULE ***************
export {
    CreateStudentHelper
}