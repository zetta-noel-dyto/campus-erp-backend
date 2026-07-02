import { AppError } from "../../../core/error.js";
import { StudentModel as Students } from "./student.model.js";

const CreateStudentHelper = async (input) => {
    const exist = await Students.findOne({
        email: input.email,
        student_number: input.student_number
    }).lean();
    if (exist) {
        throw new AppError('Student already exist', "STUDENT_EXIST", 409);
    }

    const student = await Students.create(input);
    if (!student) {
        throw new AppError('Failed to create student', "CREATE_STUDENT_FAILED", 500);
    }

    return student;
}

export {
    CreateStudentHelper
}