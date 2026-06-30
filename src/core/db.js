import mongoose from "mongoose";
import { AppError } from "./error.js";
import { db } from "./config.js";

const ConnectDB = async () => {
    // Get the active Mongoose connection instance
    const connection = mongoose.connection

    // Display message in console if the database connected
    connection.on("open", () => {
        console.log("Database connected")
    })

    // Throw error in console when connection error
    connection.on("error", (error) => {
        throw new AppError(`Connection error : ${error}`, "CONNECTION_DB_ERROR", 500)
    })

    try {
        // Connect with the database
        await mongoose.connect(db.uri);
    } catch (error) {
        // Throw error if the connection is failed and 
        throw new AppError(`Database error : ${error}`, "DATABASE_ERROR", 500)
        // Turn off the server
        process.exit(1)
    }
}

export {
    ConnectDB
}