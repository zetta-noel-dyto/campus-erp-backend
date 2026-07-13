// *************** IMPORT LIBRARY ***************
import puppeteer from 'puppeteer';
import { Readable } from 'stream';

// *************** IMPORT MODULE ***************
import { AppError } from '../../core/error.js';

// *************** GLOBAL VARIABLES ***************
let browserInstance = null;

// *************** SERVICE INITIALIZATION ***************
/**
 * Initializes Puppeteer browser instance used by PDF generation service.
 * @returns {Promise<void>} Resolves once browser instance is ready.
 */
const InitializePDFService = async () => {
  if (browserInstance) return;

  browserInstance = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });
};

// *************** PDF GENERATION ***************
/**
 * Generates a PDF stream from provided HTML content.
 * @param {string} htmlContent - HTML markup used as PDF source content.
 * @returns {Promise<Readable>} Readable stream containing generated PDF data.
 * @throws {AppError} Throws error when PDF service is not initialized or generation fails.
 */
const GeneratePDFStream = async (htmlContent) => {
  // *************** START: Validate PDF service availability ***************
  if (!browserInstance) {
    throw new AppError('PDF service is not initialized', 'PDF_SERVICE_NOT_INITIALIZED', 500);
  }
  // *************** END: Validate PDF service availability ***************

  let page = null;

  try {
    // *************** START: Create PDF page ***************
    page = await browserInstance.newPage();
    await page.setContent(htmlContent, {
      waitUntil: 'networkidle0',
    });
    // *************** END: Create PDF page ***************

    // *************** START: Generate PDF stream ***************
    const webStream = await page.createPDFStream({
      format: 'A4',
      printBackground: true,
    });
    const pdfStream = Readable.fromWeb(webStream);

    const closePage = async () => {
      if (page) {
        await page.close();
        page = null;
      }
    };

    pdfStream.on('end', closePage);
    pdfStream.on('error', closePage);
    pdfStream.on('close', closePage);
    // *************** END: Generate PDF stream ***************

    return pdfStream;
  } catch (error) {
    // *************** START: Handle PDF generation failure ***************
    if (page) await page.close();
    console.error(error);

    throw new AppError(`Failed to generate PDF : ${error.message}`, 'PDF_GENERATION_FAILED', 500);
    // *************** END: Handle PDF generation failure ***************
  }
};

// *************** EXPORT MODULE ***************
export { InitializePDFService, GeneratePDFStream };
