// *************** IMPORT LIBRARY ***************
import mongoose from "mongoose"

// *************** IMPORT MODULE ***************
import { AppError } from "./error.js"
import { db } from "./config.js"

// *************** GLOBAL VARIABLES ***************
const connection = mongoose.connection

// *************** START: Connection Event Listeners Registration ***************

// *************** Broadcast active operational readiness status to internal engineering logs upon connection lifecycle open
connection.on("open", () => {
    console.log("Database connected")
})

// *************** Enforce global application panic error state interception if runtime stream interfaces failure event
connection.on("error", (error) => {
    throw new AppError(`Connection error : ${error}`, "CONNECTION_DB_ERROR", 500)
})

// *************** END: Connection Event Listeners Registration ***************

// *************** QUERY ***************
/**
 * Establishes persistent cluster connection protocols with the MongoDB persistence store engine.
 * 
 * @throws {AppError} Enforces execution validation errors if transport layer handshakes break down
 * @returns {Promise<void>} Resolves successfully when operational session pathways become active
 */
const ConnectDB = async () => {
    try {
        // *************** Intercept native client state engine driver validation to trigger backend storage bind
        await mongoose.connect(db.uri);
    } catch (error) {
        // *************** Enforce architectural fallback panic state structures if initial authentication packets fail
        throw new AppError(`Database error : ${error}`, "DATABASE_ERROR", 500)
        // *************** Terminate local platform node instances to avoid execution of loose queries
        process.exit(1)
    }
}

// *************** EXPORT MODULE ***************
export {
    ConnectDB
}