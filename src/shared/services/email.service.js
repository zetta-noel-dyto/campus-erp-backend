// *************** IMPORT LIBRARY ***************
import nodemailer from 'nodemailer';

// *************** IMPORT MODULE ***************
import { smtp } from '../../core/config.js';

// *************** GLOBAL VARIABLES ***************
const transporter = nodemailer.createTransport({
  // SMTP server hostname used for email delivery connection.
  host: smtp.host,
  // SMTP server port used for SMTP communication.
  port: smtp.port,
  // Disable secure connection because SMTP transport uses non-SSL configuration.
  secure: false,
  // Authentication credentials used to connect to SMTP server.
  auth: {
    // SMTP account username.
    user: smtp.user,
    // SMTP account password.
    pass: smtp.pass,
  },
});

// *************** HELPER FUNCTION ***************
/**
 * Sends an email notification using the configured SMTP service.
 * @param {string} to - Recipient email address.
 * @param {string} subject - Email subject title.
 * @param {string} htmlBody - HTML content of the email message.
 * @returns {Promise<Object>} Result returned by the email transporter after sending.
 */
const SendEmail = async (to, subject, htmlBody) => {
  // *************** START: Send email notification ***************
  return await transporter.sendMail({
    to,
    subject,
    html: htmlBody,
  });
  // *************** END: Send email notification ***************
};

// *************** EXPORT MODULE ***************
export { SendEmail };
