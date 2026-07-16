// *************** IMPORT LIBRARY ***************
import jwt from 'jsonwebtoken';

// *************** IMPORT MODULE ***************
import { AppError } from '../../core/error.js';
import { jwtKey } from '../../core/config.js';

// *************** MIDDLEWARES ***************
/**
 * Validates JWT authentication token from request headers and attaches user data to request context.
 * @param {Object} req - Express request object containing incoming HTTP request data.
 * @param {Object} res - Express response object.
 * @param {Function} next - Callback function to continue request processing.
 * @returns {void}
 */
const AuthMiddleware = (req, res, next) => {
  // *************** START: Extract authorization token ***************
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    req.user = undefined;
    return next();
  }

  const token = header.split(' ')[1];
  // *************** END: Extract authorization token ***************

  // *************** START: Verify JWT token ***************
  try {
    const decoded = jwt.verify(token, jwtKey.secret);
    req.user = decoded;
  } catch (error) {
    req.user = undefined;
  }
  // *************** END: Verify JWT token ***************

  return next();
};

/**
 * Ensures incoming request is authenticated before accessing protected REST endpoints.
 * @param {Object} req - Express request object containing incoming HTTP request data.
 * @param {Object} res - Express response object.
 * @param {Function} next - Callback function to continue request processing.
 * @returns {void}
 */
const RequiredAuthMiddleware = (req, res, next) => {
  // *************** START: Validate authorization header ***************
  const header = req.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    return next(new AppError('Authentication required', 'UNAUTHORIZED', 401));
  }

  const token = header.split(' ')[1];
  // *************** END: Validate authorization header ***************

  // *************** START: Verify authentication token ***************
  try {
    req.user = jwt.verify(token, jwtKey.secret);
    return next();
  } catch (error) {
    return next(new AppError('Invalid authentication token', 'UNAUTHORIZED', 401));
  }
  // *************** END: Verify authentication token ***************
};

// *************** MIDDLEWARE ***************
/**
 * Creates role-based authorization middleware for protected REST endpoints.
 * @param {Array<string>} roles - Collection of roles permitted to access the target resource.
 * @returns {Function} Express middleware that validates authenticated user's role.
 */
const AuthorizeRoles = (roles) => (req, res, next) => {
  // *************** START: Validate authenticated user ***************
  if (!req.user) {
    return next(new AppError('Authentication required', 'UNAUTHORIZED', 401));
  }
  // *************** END: Validate authenticated user ***************

  // *************** START: Validate user authorization ***************
  if (!roles.includes(req.user.role)) {
    return next(new AppError('Access denied', 'FORBIDDEN', 403));
  }
  // *************** END: Validate user authorization ***************

  return next();
};

// *************** EXPORT MODULE ***************
export { AuthMiddleware, AuthorizeRoles, RequiredAuthMiddleware };
