// *************** IMPORT LIBRARY ***************
import Joi from 'joi'

// *************** VALIDATOR ***************
const LoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
})

// *************** EXPORT MODULE ***************
export { LoginSchema }
