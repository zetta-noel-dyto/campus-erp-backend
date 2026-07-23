// *************** IMPORT LIBRARY ***************
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

// *************** IMPORT MODULE ***************
import { AppError } from '../../../core/error.js'
import { jwtKey } from '../../../core/config.js'
import { UserModel as Users } from '../user/user.model.js'

// *************** HELPER FUNCTION ***************
/**
 * Authenticates a user using email and password credentials.
 * @param {Object} input - User login credentials.
 * @param {string} input.email - User email address.
 * @param {string} input.password - User plain-text password.
 * @returns {string} Signed JWT access token.
 * @throws {AppError} Throws unauthorized error when credentials are invalid.
 */
const LoginHelper = async (input) => {
  // *************** START: Fetch user account ***************
  const user = await Users.findOne({ email: input.email }).lean()
  if (!user) {
    throw new AppError('Invalid email or password', 'UNAUTHORIZED', 401)
  }
  // *************** END: Fetch user account ***************

  // *************** START: Validate user password ***************
  const comparePassword = await bcrypt.compare(input.password, user.password)
  if (!comparePassword) {
    throw new AppError('Invalid email or password', 'UNAUTHORIZED', 401)
  }
  // *************** END: Validate user password ***************

  // *************** START: Generate authentication token ***************
  return jwt.sign({ userId: user._id, role: user.role }, jwtKey.secret, { expiresIn: '8h' })
  // *************** END: Generate authentication token ***************
}

// *************** EXPORT MODULE ***************
export { LoginHelper }
