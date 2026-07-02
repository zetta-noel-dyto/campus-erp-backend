import { AcademicYearModel as AcademicYear } from "./academic_year.model.js";
import { AppError } from "../../../core/error.js";
import { StudentModel as Students } from "../../users/student/student.model.js";

const EnrollStudentHelper = async (input) => {
    const academicYear = await AcademicYear.findById(input.academic_year_id).lean();
    if (!academicYear) {
        throw new AppError('Academic year not found', "ACADEMIC_YEAR_NOT_FOUND", 404);
    }
    if (academicYear.status !== 'active') {
        throw new AppError('Academic year is now closed to new enrollments', "ACADEMIC_YEAR_CLOSED", 400);
    }

    const countStudents = await Students.countDocuments(
        { _id: { $in: input.student_ids } }
    )
    if (countStudents !== input.student_ids.length) {
        throw new AppError("One or more student IDs are invalid or not found", "INVALID_STUDENT_REFERENCE", 400);
    }

    const updatedYear = await AcademicYear.findByIdAndUpdate(
        input.academic_year_id,
        {
            $addToSet: {
                student_ids: { $each: input.student_ids }
            }
        },
        { new: true }
    )

    await Students.updateMany(
        { _id: { $in: input.student_ids } },
        { $addToSet: { academic_year_ids: input.academic_year_id } }
    )

    return updatedYear;
}

export {
    EnrollStudentHelper
}