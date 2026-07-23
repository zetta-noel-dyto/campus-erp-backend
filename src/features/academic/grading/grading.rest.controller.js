// *************** IMPORT CORE ***************
import { pipeline } from 'stream/promises'

// *************** IMPORT MODULE ***************
import { GeneratePDFStream } from '../../../shared/services/pdf.service.js'
import { GetReportCardHelper } from './grading.rest.helper.js'
import { HandleApiError } from '../../../core/error.js'
import { ParamsSchema } from './grading.validator.js'
import { ValidateInput } from '../../../shared/validators/input.validators.js'

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
    // *************** START: Validate request parameters ***************
    const data = ValidateInput(ParamsSchema, req.params)
    // *************** END: Validate request parameters ***************

    // *************** START: Generate report card content ***************
    const html = await GetReportCardHelper(data)
    const stream = await GeneratePDFStream(html)
    // *************** END: Generate report card content ***************

    // *************** START: Configure PDF response ***************
    res.setHeader('Content-Type', 'application/pdf')
    res.setHeader('Content-Disposition', `attachment; filename="ReportCard_${data.studentId}.pdf"`)
    // *************** END: Configure PDF response ***************

    // *************** START: Stream PDF response ***************
    await pipeline(stream, res)
    // *************** END: Stream PDF response ***************
  } catch (error) {
    // *************** START: Handle controller error ***************
    HandleApiError(res, error)
    // *************** END: Handle controller error ***************
  }
}

// *************** EXPORT MODULE ***************
export { GetReportCard }
