// *************** IMPORT LIBRARY ***************
import { rateLimit } from 'express-rate-limit'

// *************** GLOBAL VARIABLES ***************
const limit = rateLimit({
  windowMs: 10 * 60 * 1000,
  limit: 10,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  message: {
    status: 'fail',
    code: 'RATE_LIMIT_EXCEDEED',
    message: 'Too many report card download requests, please try again later'
  }
})

// *************** EXPORT MODULE ***************
export { limit }
