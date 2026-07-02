// *************** IMPORT LIBRARY ***************
import mongoose, { model, Schema } from 'mongoose';

// *************** SCHEMAS ***************
const GradingRuleSchema = new Schema({
    label: {
        type: String,
        enum: ['Pass', 'Fail', 'Retake'],
        required: true
    },
    operator: {
        type: String,
        enum: ['>', '>=', '<', '<=', '=='],
        required: true
    },
    threshold: {
        type: Number,
        required: true
    }
}, { timestamps: true })

const BlockSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    academic_year: {
        type: String,
        required: true
    },
    grading_rules: [GradingRuleSchema]
}, { timestamps: true })

const SubjectSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    block_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Block',
        required: true
    },
    weightage: {
        type: Number,
        required: true
    },
    grading_rules: [GradingRuleSchema]
}, { timestamps: true })

const TestSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    subject_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    },
    weightage: {
        type: Number,
        required: true
    },
    grading_rules: [GradingRuleSchema]
}, { timestamps: true })

// *************** MONGOOSE MODELS ***************
const BlockModel = model('Block', BlockSchema);
const SubjectModel = model('Subject', SubjectSchema);
const TestModel = model('Test', TestSchema);

// *************** EXPORT MODULE ***************
export {
    BlockModel,
    SubjectModel,
    TestModel
}