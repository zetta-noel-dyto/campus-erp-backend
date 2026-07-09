// *************** IMPORT LIBRARY ***************
import jwt from 'jsonwebtoken';

// *************** IMPORT MODULE ***************
import { jwtKey } from '../../core/config.js';

// *************** MIDDLEWARE ***************
/**
 * Validates JWT authentication token from request headers and attaches user data to request context.
 *
 * @param {Object} req - Express request object containing incoming HTTP request data.
 * @param {Object} res - Express response object.
 * @param {Function} next - Callback function to continue request processing.
 * @returns {void}
 */
const AuthMiddleware = (req, res, next) => {
  // *************** START: Extract authorization token ***************
  // Retrieve authorization header to check whether request contains authentication credentials.
  const header = req.headers.authorization;

  // Allow unauthenticated requests to continue without user context.
  if (!header || !header.startsWith('Bearer ')) {
    req.user = undefined;
    return next();
  }

  // Extract JWT token value from Bearer authentication format.
  const token = header.split(' ')[1];
  // *************** END: Extract authorization token ***************

  // *************** START: Verify JWT token ***************
  try {
    // Verify token validity and decode user information stored in JWT payload.
    const decoded = jwt.verify(token, jwtKey.secret);

    // Attach authenticated user payload to request for downstream middleware/resolver usage.
    req.user = decoded;
  } catch (error) {
    // Ignore invalid or expired tokens and continue request as unauthenticated.
    req.user = undefined;
  }
  // *************** END: Verify JWT token ***************

  // Continue processing request regardless of authentication result.
  next();
};

// *************** EXPORT MODULE ***************
export { AuthMiddleware };
