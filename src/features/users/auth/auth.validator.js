// *************** IMPORT LIBRARY ***************
import Joi from 'joi';

// *************** VALIDATOR ***************
// Validation schema used to validate login request payload.
const LoginSchema = Joi.object({
  // Validates that the provided email is in a valid email format and is required.
  email: Joi.string().email().required(),
  // Validates that the password field exists and contains a string value.
  password: Joi.string().required(),
});

// *************** EXPORT MODULE ***************
export { LoginSchema };
