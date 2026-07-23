// *************** IMPORT LIBRARY ***************
import mongoose, { model, Schema } from 'mongoose'

// *************** SCHEMA ***************
const StudentSchema = new Schema(
  {
    // Student's first name
    first_name: {
      type: String,
      required: true
    },
    // Student's last name
    last_name: {
      type: String,
      required: true
    },
    // Unique email address used for authentication and communication
    email: {
      type: String,
      unique: true,
      required: true
    },
    // Unique student identifier used across academic systems
    student_number: {
      type: String,
      unique: true,
      required: true
    },
    // Date when the student was registered into the system
    registration_date: {
      type: Date,
      default: Date.now
    },
    // References to academic years the student is enrolled in
    academic_year_ids: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'AcademicYear'
        }
      ],
      default: []
    }
  },
  { timestamps: true }
)

// *************** MONGOOSE MODEL ***************
const StudentModel = model('Student', StudentSchema)

// *************** EXPORT MODULE ***************
export { StudentModel }
