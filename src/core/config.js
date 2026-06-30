// *************** IMPORT LIBRARY ***************
import dotenv from 'dotenv'
// *************** IMPORT MODULE ***************
import { AppError } from './error.js'

// *************** START: Environment Configuration Initialization ***************

// Load ecosystem variables into memory to configure core infrastructure ports and database URIs
dotenv.config()

// *************** END: Environment Configuration Initialization ***************

// *************** GLOBAL VARIABLES ***************
const db = {
    uri: process.env.MONGO_URI
}

const port = process.env.PORT

// *************** START: Configuration Dependency Validation ***************

if (!db.uri || !port) {
    // *************** Enforce strict environment variables configuration to halt runtime on missing parameters
    throw new AppError("Missing required env variables", "ENV_ERROR", 500)
    // *************** Immediately terminate node process engine execution on fatal setup configurations
    process.exit(1)
}

// *************** END: Configuration Dependency Validation ***************

// *************** EXPORT MODULE ***************
export {
    db,
    port
}