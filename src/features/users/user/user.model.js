// *************** IMPORT LIBRARY ***************
import mongoose, { model, Schema } from 'mongoose';

// *************** SCHEMA ***************
// Defines the structure and validation rules for user documents stored in MongoDB.
const UserSchema = new Schema(
  {
    // User email address used as the unique identifier for authentication
    email: {
      type: String,
      unique: true,
      required: true,
    },
    // Hashed user password used for authentication verification
    password: {
      type: String,
      required: true,
    },
    // Defines the user's access level for authorization purposes
    role: {
      type: String,
      enum: ['admin', 'teacher'],
      required: true,
    },
  },
  // Automatically manages createdAt and updatedAt fields for user records
  { timestamps: true },
);

// *************** MODEL DEFINITION ***************
// Creates a Mongoose model to interact with the User collection in MongoDB
const UserModel = model('User', UserSchema);

// *************** EXPORT MODULE ***************
export { UserModel };
