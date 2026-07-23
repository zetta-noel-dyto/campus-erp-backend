// *************** IMPORT LIBRARY ***************
import mongoose, { model, Schema } from 'mongoose'

// *************** SCHEMA DEFINITION ***************
const StudentGradeSchema = new Schema(
  {
    // Reference to the student who received this grade, uses ObjectId relation to the Student collection
    student_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Student',
      required: true
    },
    // Reference to the test associated with this student grade, uses ObjectId relation to the Test collection
    test_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Test',
      required: true
    },
    // Reference to the academic year context where this grade was recorded, uses ObjectId relation to the AcademicYear collection
    academic_year_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AcademicYear',
      required: true
    },
    // Numerical score achieved by the student for the related test, value must be within the supported grading range from 0 to 100
    score: {
      type: Number,
      min: 0,
      max: 100,
      required: true
    }
  },
  // Automatically manages createdAt and updatedAt fields for grade records
  { timestamps: true }
)

// *************** INDEX CONFIGURATION ***************
StudentGradeSchema.index(
  {
    student_id: 1,
    test_id: 1,
    academic_year_id: 1
  },
  { unique: true }
)

// *************** MODEL DEFINITION ***************
const StudentGradeModel = model('StudentGrade', StudentGradeSchema)

// *************** EXPORT MODULE ***************
export { StudentGradeModel }
