// *************** IMPORT LIBRARY ***************
import { Router } from 'express';

// *************** IMPORT MODULE ***************
import { GetReportCard } from './grading.rest.controller.js';

// *************** GLOBAL VARIABLES ***************
const router = Router();

// *************** ROUTE ***************
router.get('/report-card/:academicYearId/:studentId', GetReportCard);

// *************** EXPORT MODULE ***************
export { router };
