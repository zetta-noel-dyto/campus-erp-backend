// *************** IMPORT MODULE ***************
import { AppError } from '../../core/error.js';
import { webhookWarehouse } from '../../core/config.js';

// *************** HELPER FUNCTION ***************
/**
 * Dispatches academic standing updates to the warehouse webhook endpoint.
 * @param {Array} standingsArray - List of academic standing records to be sent to warehouse service
 * @returns {Promise<void>} Resolves when the webhook dispatch process is completed
 */
const DispatchAcademicStandings = async (standingsArray) => {
  try {
    // *************** START: Send academic standing update event to warehouse webhook ***************
    const response = await fetch(webhookWarehouse, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        event: 'ACADEMIC_STANDINGS_UPDATED',
        timestamp: new Date().toISOString(),
        data: standingsArray,
      }),
    });
    if (!response.ok) {
      throw new AppError(`Webhook request failed : ${response.status} ${response.statusText}`, 'WEBHOOK_DISPATCH_FAILED', response.status);
    }
    // *************** END: Send academic standing update event to warehouse webhook ***************
  } catch (error) {
    console.error(`Failed to dispatch webhook : ${error.message}`);
    return;
  }
};

// *************** EXPORT MODULE ***************
export { DispatchAcademicStandings };
