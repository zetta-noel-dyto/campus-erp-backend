// *************** IMPORT LIBRARY ***************
import mongoose from 'mongoose';

// *************** IMPORT MODULE ***************
import { AppError } from './error.js';
import { db } from './config.js';

// *************** GLOBAL VARIABLES ***************
// Mongoose global connection instance used for lifecycle monitoring
const connection = mongoose.connection;

// *************** CONNECTION EVENT HANDLERS ***************
// Fired when MongoDB connection is successfully established
connection.on('open', () => {
  console.log('Database connected');
});

// Fired when MongoDB connection encounters runtime errors
connection.on('error', async (error) => {
  console.error('Database error:', error);
  // Ensures clean shutdown if database connection becomes unstable
  await mongoose.disconnect();
  process.exit(1);
});

// *************** DATABASE CONNECTION ***************
/**
 * Establishes persistent cluster connection protocols with the MongoDB persistence store engine.
 *
 * This function initializes the database layer and ensures the application
 * has a valid connection before serving any requests.
 *
 * @throws {AppError} Enforces execution validation errors if transport layer handshakes break down
 * @returns {Promise<void>} Resolves successfully when operational session pathways become active
 */
const ConnectDB = async () => {
  mongoose.set('debug', true);

  try {
    await mongoose.connect(db.uri);
  } catch (error) {
    throw new AppError(`Database error : ${error}`, 'DATABASE_ERROR', 500);
  }
};

// *************** EXPORT MODULE ***************
export { ConnectDB };
