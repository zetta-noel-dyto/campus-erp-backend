// *************** IMPORT LIBRARY ***************
import dotenv from 'dotenv';
// *************** IMPORT MODULE ***************
import { AppError } from './error.js';

// Load ecosystem variables into memory to configure core infrastructure ports and database URIs
dotenv.config();

// *************** GLOBAL VARIABLES ***************
const db = {
    uri: process.env.MONGO_URI
}
const port = process.env.PORT;

if (!db.uri || !port) {
    throw new AppError('Missing required env variables", "ENV_ERROR', 500);
    process.exit(1);
}

// *************** EXPORT MODULE ***************
export {
    db,
    port
}