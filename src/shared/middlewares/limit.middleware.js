// *************** IMPORT LIBRARY ***************
import { rateLimit } from 'express-rate-limit';

// *************** GLOBAL VARIABLES ***************
const limit = rateLimit({
  // Maximum time window for counting incoming requests.
  windowMs: 10 * 60 * 1000,
  // Maximum number of requests allowed within the configured time window.
  limit: 10,
  // Include standardized RateLimit response headers.
  standardHeaders: 'draft-8',
  // Disable legacy X-RateLimit-* response headers.
  legacyHeaders: false,
  // Standardized response returned when rate limit threshold is exceeded.
  message: {
    status: 'fail',
    code: 'RATE_LIMIT_EXCEDEED',
    message: 'Too many report card download requests, please try again later',
  },
});

// *************** EXPORT MODULE ***************
export { limit };
