import dotenv from 'dotenv';
import { AppError } from './error.js';

// Get the values in .env file
dotenv.config();

const db = {
    uri: process.env.MONGO_URI
}

const port = process.env.PORT

if (!db.uri || !port) {
    // Throw an error when there are no env variables
    throw new AppError("Missing required env variables", "ENV_ERROR", 500)
    // Shut down the server
    process.exit(1)
}

export {
    db,
    port
}