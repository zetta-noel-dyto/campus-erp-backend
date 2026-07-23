// *************** IMPORT LIBRARY ***************
import mongoose, { model, Schema } from 'mongoose'

// *************** SCHEMA DEFINITION ***************
const AcademicStandingSchema = new Schema(
  {
    // Reference to the student whose academic performance is being tracked, uses ObjectId relation to the Student collection.
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },
    // Reference to the academic year where the standing record applies, uses ObjectId relation to the AcademicYear collection.
    academic_year_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AcademicYear',
      required: true
    },
    // Reference to the block containing aggregated subject performance, uses ObjectId relation to the Block collection.
    block_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Block',
      required: true
    },
    // Calculated average score across all subjects within the block.
    block_average: Number,
    // Overall block performance status based on grading rules.
    block_status: {
      type: String,
      enum: ['Pass', 'Fail', 'Retake']
    },
    // Collection of subject-level academic performance results.
    subjects: [
      {
        // Reference to the subject being evaluated, uses ObjectId relation to the Subject collection.
        subject_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Subject'
        },
        // Calculated average score across all tests within the subject.
        subject_average: Number,
        // Subject performance status based on subject grading rules.
        subject_status: {
          type: String,
          enum: ['Pass', 'Fail', 'Retake']
        },
        // Collection of test-level score details for the subject.
        tests: [
          {
            // Reference to the test associated with the score record, uses ObjectId relation to the Test collection.
            test_id: {
              type: mongoose.Schema.Types.ObjectId,
              ref: 'Test'
            },
            // Score achieved by the student for the specific test.
            total_mark: Number,
            // Test performance status based on test grading rules.
            test_status: {
              type: String,
              enum: ['Pass', 'Fail', 'Retake']
            }
          }
        ]
      }
    ]
  },
  { timestamps: true }
)

// *************** MODEL DEFINITION ***************
const AcademicStandingModel = model('AcademicStanding', AcademicStandingSchema)

// *************** EXPORT MODULE ***************
export { AcademicStandingModel }
