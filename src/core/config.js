// *************** IMPORT LIBRARY ***************
import dotenv from 'dotenv'

// *************** IMPORT MODULE ***************
import { AppError } from './error.js'

// *************** INITIALIZE ENVIRONMENT ***************
dotenv.config()

// *************** GLOBAL VARIABLES ***************
const db = {
  uri: process.env.MONGO_URI
}

const port = process.env.PORT

const jwtKey = {
  secret: process.env.JWT_SECRET
}

const smtp = {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  user: process.env.SMTP_USER,
  pass: process.env.SMTP_PASS
}

const email = {
  admin: process.env.ADMIN_EMAIL_ADDRESS
}

const webhookWarehouse = process.env.WEBHOOK_WAREHOUSE_URL

// *************** VALIDATION ***************
if (!db.uri || !port || !webhookWarehouse || !/^https?:\/\/.+/.test(webhookWarehouse)) {
  throw new AppError('Missing required env variables', 'ENV_ERROR', 500)
}

// *************** EXPORT MODULE ***************
export { db, email, jwtKey, port, smtp, webhookWarehouse }
