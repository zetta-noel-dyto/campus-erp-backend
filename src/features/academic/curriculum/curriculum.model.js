// *************** IMPORT LIBRARY ***************
import mongoose, { model, Schema } from 'mongoose'

// *************** SCHEMAS ***************
// *************** Grading Rule Schema ***************
const GradingRuleSchema = new Schema(
  {
    // Label/name of the grading rule (e.g., "Pass Mark", "Minimum Requirement")
    label: {
      type: String,
      required: true
    },
    // Comparison operator used to evaluate score against threshold
    operator: {
      type: String,
      enum: ['>', '>=', '<', '<=', '=='],
      required: true
    },
    // Numeric threshold value used for evaluation logic
    threshold: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
)

// *************** Block Schema ***************
const BlockSchema = new Schema(
  {
    // Human - readable name of the block (e.g., "Block A", "Semester 1")
    name: {
      type: String,
      required: true
    },
    // Academic year associated with this block (e.g., "2025/2026")
    academic_year: {
      type: String,
      required: true
    },
    // List of grading rules applied at block level for evaluation consistency
    grading_rules: [GradingRuleSchema]
  },
  { timestamps: true }
)

// *************** Subject Schema ***************
const SubjectSchema = new Schema(
  {
    // Name of the subject (e.g., "Mathematics", "Physics")
    name: {
      type: String,
      required: true
    },
    // Reference to the Block this subject belongs to, used for relational mapping and grouping subjects under academic structure
    block_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Block',
      required: true
    },
    // Weightage of this subject in overall grading calculation
    weightage: {
      type: Number,
      required: true
    },
    // Grading rules specific to this subject (can override or extend block rules)
    grading_rules: [GradingRuleSchema]
  },
  { timestamps: true }
)

// *************** Test Schema ***************
const TestSchema = new Schema(
  {
    // Name of the test (e.g., "Midterm Exam", "Quiz 1")
    name: {
      type: String,
      required: true
    },
    // Reference to the Subject this test belongs to, enables hierarchical academic structure : Block -> Subject -> Test
    subject_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Subject',
      required: true
    },
    // Weightage of this test in subject-level grading computation
    weightage: {
      type: Number,
      required: true
    },
    // Grading rules specific to this test
    grading_rules: [GradingRuleSchema]
  },
  { timestamps: true }
)

// *************** MONGOOSE MODELS ***************
const BlockModel = model('Block', BlockSchema)
const SubjectModel = model('Subject', SubjectSchema)
const TestModel = model('Test', TestSchema)

// *************** EXPORT MODULE ***************
export { BlockModel, SubjectModel, TestModel }
