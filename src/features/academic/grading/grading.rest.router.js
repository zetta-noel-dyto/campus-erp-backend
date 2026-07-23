// *************** IMPORT LIBRARY ***************
import { Router } from 'express'

// *************** IMPORT MODULE ***************
import {
  AuthorizeRoles,
  RequiredAuthMiddleware
} from '../../../shared/middlewares/auth.middleware.js'
import { GetReportCard } from './grading.rest.controller.js'
import { limit } from '../../../shared/middlewares/limit.middleware.js'

// *************** GLOBAL VARIABLES ***************
const router = Router()

// *************** ROUTE ***************
router.get(
  '/report-card/:academicYearId/:studentId',
  limit,
  RequiredAuthMiddleware,
  AuthorizeRoles(['student', 'teacher']),
  GetReportCard
)

// *************** EXPORT MODULE ***************
export { router }
