// *************** IMPORT MODULE ***************
import { AcademicYearModel as AcademicYear } from "./academic_year.model.js";
import { AppError } from "../../../core/error.js";
import { StudentModel as Students } from "../../users/student/student.model.js";

// *************** STUDENT ENROLLMENT HELPER ***************
/**
 * Enrolls multiple students into an academic year using transactional consistency.
 * @param {object} input - Enrollment payload containing academic_year_id and student_ids
 * @throws {AppError} Various domain errors for invalid state, missing entities, or closed enrollment
 * @returns {Promise<object>} Updated academic year document with enrolled students
 */
const EnrollStudentHelper = async (input) => {
    // *************** START: Validate academic year ***************
    const academicYear = await AcademicYear.findById(input.academic_year_id).lean();

    if (!academicYear) {
        throw new AppError('Academic year not found', "ACADEMIC_YEAR_NOT_FOUND", 404);
    }

    if (academicYear.status !== 'active') {
        throw new AppError(
            'Academic year is now closed to new enrollments',
            "ACADEMIC_YEAR_CLOSED",
            400
        )
    }
    // *************** END: Validate academic year ***************

    // *************** START: Validate student references ***************
    const uniqueStudentIDs = [...new Set(input.student_ids)];

    const countStudents = await Students.countDocuments(
        { _id: { $in: uniqueStudentIDs } }
    )

    if (countStudents !== uniqueStudentIDs.length) {
        throw new AppError(
            "One or more student IDs are invalid or not found",
            "INVALID_STUDENT_REFERENCE",
            400
        )
    }
    // *************** END: Validate student references ***************

    // *************** START: Update academic year enrollment ***************
    const updatedYear = await AcademicYear.findByIdAndUpdate(
        input.academic_year_id,
        {
            $addToSet: {
                student_ids: { $each: uniqueStudentIDs }
            }
        },
        { new: true }
    )
    // *************** END: Update academic year enrollment ***************

    // *************** START: Update student academic history ***************
    await Students.updateMany(
        { _id: { $in: input.student_ids } },
        { $addToSet: { academic_year_ids: input.academic_year_id } }
    )
    // *************** END: Update student academic history ***************

    return updatedYear;
}

// *************** EXPORT MODULE ***************
export {
    EnrollStudentHelper
}