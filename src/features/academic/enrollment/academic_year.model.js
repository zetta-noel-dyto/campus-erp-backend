// *************** IMPORT LIBRARY ***************
import mongoose, { model, Schema } from "mongoose";

// *************** SCHEMA ***************
// Defines the structure of an academic year entity used to group blocks and students
const AcademicYearSchema = new Schema({
    // Academic year display name (e.g., "2025/2026")
    name: {
        type: String,
        required: true
    },
    // Start date of the academic year
    start_date: {
        type: Date,
        required: true
    },
    // End date of the academic year
    end_date: {
        type: Date,
        required: true
    },
    // Lifecycle status of the academic year
    status: {
        type: String,
        enum: ['active', 'completed', 'archived'],
        default: 'active'
    },
    // List of blocks associated with this academic year
    block_ids: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Block',
        }],
        required: true
    },
    // List of students enrolled in this academic year
    student_ids: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
        }],
        default: []
    }
}, { timestamps: true })

// *************** MONGOOSE MODEL ***************
// Compiled model used for CRUD operations on AcademicYear collection
const AcademicYearModel = model('AcademicYear', AcademicYearSchema);

// *************** EXPORT MODULE ***************
export {
    AcademicYearModel
}