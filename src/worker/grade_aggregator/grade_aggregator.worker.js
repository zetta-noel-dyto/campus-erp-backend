// *************** IMPORT LIBRARY ***************
import mongoose from 'mongoose';

// *************** IMPORT CORE ***************
import { parentPort, workerData } from 'worker_threads';

// *************** IMPORT MODULE ***************
import { AcademicStandingModel } from '../../features/academic/grading/academic_standing.model.js';
import { AppError } from '../../core/error.js';
import { ConnectDB } from '../../core/db.js';
import { GradeWorkerHelper } from './grade_aggregator.helper.js';

// *************** WORKER FUNCTION ***************
/**
 * Runs grade aggregation worker process and updates academic standing records.
 * @returns {Promise<void>}
 */
const run = async () => {
  // Exit code used to indicate worker execution result.
  let code = 0;

  try {
    // *************** START: Initialize worker database connection ***************
    await ConnectDB();
    // *************** END: Initialize worker database connection ***************

    // *************** START: Parse worker payload ***************
    const payload = JSON.parse(workerData);
    const { student_ids, test_id, academic_year_id } = payload;
    // *************** END: Parse worker payload ***************

    // *************** START: Generate academic standing operations ***************
    const operations = await GradeWorkerHelper(student_ids, test_id, academic_year_id);
    if (operations.length) {
      await AcademicStandingModel.bulkWrite(operations);
    }
    // *************** END: Generate academic standing operations ***************

    // *************** Notify parent worker process ***************
    parentPort.postMessage({
      status: 'success',
    });
  } catch (error) {
    // Mark worker execution as failed before terminating the process.
    code = 1;
    // Notify parent process about worker execution failure.
    parentPort.postMessage({
      status: 'error',
      message: error.message,
    });
  } finally {
    // *************** START: Release worker resources ***************
    try {
      await mongoose.disconnect();
    } catch (error) {
      console.error(`Failed to disconnect database in worker : ${error}`);
    }
    // Terminate worker process using execution result as exit code.
    process.exit(code);
    // *************** END: Release worker resources ***************
  }
};

// *************** ERROR HANDLING ***************
run().catch((error) => {
  // Send failure status and error message back to the parent process.
  parentPort.postMessage({
    status: 'error',
    message: error.message,
  });
});
