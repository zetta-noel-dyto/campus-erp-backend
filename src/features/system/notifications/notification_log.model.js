// *************** IMPORT LIBRARY ***************
import mongoose, { model, Schema } from 'mongoose';

// *************** SCHEMA DEFINITION ***************
// Defines the structure and validation rules for notification log documents stored in MongoDB.
const NotificationLogSchema = new Schema({
  // Notification category used to identify the type of system alert generated.
  type: {
    type: String,
    enum: ['MISSING_GRADE_ALERT'],
    required: true,
  },
  // Reference to the student associated with the notification event, uses ObjectId relation to the Student collection.
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true,
  },
  // Reference to the test related to the notification event, uses ObjectId relation to the Test collection.
  test_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Test',
    required: true,
  },
  // Reference to the academic year context where the notification was generated, uses ObjectId relation to the AcademicYear collection.
  academic_year_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AcademicYear',
    required: true,
  },
  // Timestamp indicating when the notification log record was created.
  created_at: {
    type: Date,
    default: Date.now,
  },
});

// *************** INDEX CONFIGURATION ***************
NotificationLogSchema.index(
  {
    type: 1,
    student_id: 1,
    test_id: 1,
    academic_year_id: 1,
  },
  { unique: true },
);

// *************** MODEL DEFINITION ***************
const NotificationLogModel = model('NotificationLog', NotificationLogSchema);

// *************** EXPORT MODULE ***************
export { NotificationLogModel };
