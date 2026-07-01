// *************** IMPORT LIBRARY ***************
import mongoose from "mongoose"

// *************** IMPORT MODULE ***************
import { AppError } from "./error.js"
import { db } from "./config.js"

// *************** GLOBAL VARIABLES ***************
// Reference the native Mongoose connection lifecycle manager to attach infrastructure event hooks
const connection = mongoose.connection

// *************** START: Connection Event Listeners Registration ***************

// *************** Broadcast active operational readiness status to internal engineering logs upon connection lifecycle open
connection.on("open", () => {
    console.log("Database connected")
})

// *************** Intercept transient database stream errors and execute a controlled platform runtime shutdown
connection.on("error", async (error) => {
    console.error("Database error:", error)
    // *************** Teardown existing connections gracefully before forcing a process engine failure state
    await mongoose.disconnect()
    // *************** Terminate node process engine to prevent execution of unhandled loose queries during downtime
    process.exit(1)
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
        await mongoose.connect(db.uri)
    } catch (error) {
        // *************** Enforce architectural fallback panic state structures if initial authentication packets fail
        throw new AppError(
            `Database error : ${error}`,
            "DATABASE_ERROR",
            500
        )
    }
}

// *************** EXPORT MODULE ***************
export {
    ConnectDB
}