import mongoose, { model, Schema } from 'mongoose';

const UserSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['admin', 'teacher'],
      required: true,
    },
  },
  { timestamps: true },
);

const UserModel = model('User', UserSchema);

export { UserModel };
