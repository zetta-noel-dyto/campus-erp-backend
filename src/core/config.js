// *************** IMPORT LIBRARY ***************
import dotenv from 'dotenv';
// *************** IMPORT MODULE ***************
import { AppError } from './error.js';

// *************** INITIALIZE ENVIRONMENT ***************
// Load environment variables into memory to configure core infrastructure ports and database URIs
dotenv.config();

// *************** GLOBAL VARIABLES ***************
// Centralized configuration values loaded from environment variables
const db = {
    // MongoDB connection URI used by database layer to establish connection
    uri: process.env.MONGO_URI
}

// Application runtime port used by HTTP server
const port = process.env.PORT;

// *************** VALIDATION ***************
// Ensure critical environment variables exist before application starts
if (!db.uri || !port) {
    // Throws structured application error when required environment config is missing
    throw new AppError('Missing required env variables', "ENV_ERROR", 500);
    process.exit(1);
}

// *************** EXPORT MODULE ***************
export {
    db,
    port
}