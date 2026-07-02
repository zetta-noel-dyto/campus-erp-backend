import mongoose, { model, Schema } from "mongoose";

const AcademicYearSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    start_date: {
        type: Date,
        required: true
    },
    end_date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'completed', 'archived'],
        default: 'active'
    },
    block_ids: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Block',
        }],
        required: true
    },
    student_ids: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            default: []
        }],
        default: []
    }
}, { timestamps: true })

const AcademicYearModel = model('AcademicYear', AcademicYearSchema);

export {
    AcademicYearModel
}