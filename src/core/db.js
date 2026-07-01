// *************** IMPORT LIBRARY ***************
import mongoose from "mongoose";

// *************** IMPORT MODULE ***************
import { AppError } from "./error.js";
import { db } from "./config.js";

// *************** GLOBAL VARIABLES ***************
const connection = mongoose.connection;

connection.on("open", () => {
    console.log("Database connected");
})

connection.on("error", async (error) => {
    console.error("Database error:", error);
    await mongoose.disconnect();
    process.exit(1);
})

/**
 * Establishes persistent cluster connection protocols with the MongoDB persistence store engine.
 * 
 * @throws {AppError} Enforces execution validation errors if transport layer handshakes break down
 * @returns {Promise<void>} Resolves successfully when operational session pathways become active
 */
const ConnectDB = async () => {
    try {
        await mongoose.connect(db.uri);
    } catch (error) {
        throw new AppError(`Database error : ${error}`, "DATABASE_ERROR", 500);
    }
}

// *************** EXPORT MODULE ***************
export {
    ConnectDB
}