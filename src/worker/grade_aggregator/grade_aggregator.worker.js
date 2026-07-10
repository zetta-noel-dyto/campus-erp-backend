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
 *
 * @returns {Promise<void>}
 */
const run = async () => {
  // *************** START: Initialize worker database connection ***************
  await ConnectDB();
  // *************** END: Initialize worker database connection ***************

  // *************** START: Parse worker payload ***************
  // Convert worker input data into usable object structure.
  const payload = JSON.parse(workerData);
  // Extract required identifiers used for grade aggregation processing.
  const { student_ids, test_id, academic_year_id } = payload;
  // *************** END: Parse worker payload ***************

  // *************** START: Generate academic standing operations ***************
  // Calculate bulk database operations required to update student academic standings.
  const operations = await GradeWorkerHelper(student_ids, test_id, academic_year_id);
  // Execute bulk update only when there are generated operations.
  if (operations.length) {
    await AcademicStandingModel.bulkWrite(operations);
  }
  // *************** END: Generate academic standing operations ***************

  // *************** Notify parent worker process ***************
  parentPort.postMessage({
    status: 'success',
  });
};

// *************** ERROR HANDLING ***************
run().catch((error) => {
  // Send failure status and error message back to the parent process.
  parentPort.postMessage({
    status: 'error',
    message: error.message,
  });
});
