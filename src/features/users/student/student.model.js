import mongoose, { model, Schema } from "mongoose";

const StudentSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },
    last_name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    student_number: {
        type: String,
        unique: true,
        required: true
    },
    registration_date: {
        type: Date,
        default: Date.now
    },
    academic_year_ids: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'AcademicYear'
        }],
        default: []
    }
}, { timestamps: true })

const StudentModel = model('Student', StudentSchema);

export {
    StudentModel
}