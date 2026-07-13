// *************** IMPORT CORE ***************
import fs from 'fs/promises';
import path from 'path';

// *************** IMPORT LIBRARY ***************
import Handlebars from 'handlebars';

// *************** IMPORT MODULE ***************
import { GeneratePDFStream } from '../../../shared/services/pdf.service.js';
import { GetReportCardHelper } from './grading.rest.helper.js';
import { HandleApiError } from '../../../core/error.js';

// *************** CONTROLLER ***************
/**
 * Generates a student report card PDF document and streams it as an API response.
 * @param {Object} req - Express request object containing student and academic year parameters.
 * @param {Object} res - Express response object used to return generated PDF stream.
 * @param {Function} next - Express middleware callback for request flow control.
 * @returns {Promise<void>}
 */
const GetReportCard = async (req, res, next) => {
  try {
    // *************** START: Retrieve report card data ***************
    const { academicStanding, student } = await GetReportCardHelper(req);
    // *************** END: Retrieve report card data ***************

    // *************** START: Load report card template ***************
    const templatePath = path.join(process.cwd(), 'src', 'features', 'academic', 'grading', 'templates', 'report_card.hbs');
    const source = await fs.readFile(templatePath, 'utf8');
    const template = Handlebars.compile(source);
    const html = template({
      student,
      academicStanding,
    });
    // *************** END: Load report card template ***************

    // *************** START: Generate PDF response ***************
    const stream = await GeneratePDFStream(html);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="ReportCard_${req.params.studentId}.pdf"`);

    stream.pipe(res);
    // *************** END: Generate PDF response ***************
  } catch (error) {
    HandleApiError(res, error);
  }
};

// *************** EXPORT MODULE ***************
export { GetReportCard };
