// *************** IMPORT LIBRARY ***************
import nodemailer from 'nodemailer'

// *************** IMPORT MODULE ***************
import { email, smtp } from '../../core/config.js'

// *************** GLOBAL VARIABLES ***************
const transporter = nodemailer.createTransport({
  host: smtp.host,
  port: smtp.port,
  secure: false,
  auth: {
    user: smtp.user,
    pass: smtp.pass
  }
})

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
    from: email.admin,
    to,
    subject,
    html: htmlBody
  })
  // *************** END: Send email notification ***************
}

// *************** EXPORT MODULE ***************
export { SendEmail }
