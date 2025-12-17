import { Worker } from 'bullmq';
import { connection } from '../../config/queue';
import logger from '../../utils/logger';
import { pdfService } from '../pdf/pdf.service';
// Process PDF generation job
async function processPdf(job) {
    const { type, orderId } = job.data;
    logger.info(`Processing PDF job ${job.id} - Type: ${type}, OrderId: ${orderId}`);
    try {
        let url;
        if (type === 'invoice') {
            url = await pdfService.generateInvoice(orderId);
        }
        else {
            url = await pdfService.generateDeliveryNote(orderId);
        }
        logger.info(`PDF generated and uploaded: ${job.id}, URL: ${url}`);
    }
    catch (error) {
        logger.error(`PDF generation failed: ${job.id}`, error);
        throw error;
    }
}
// Create and export worker
export const pdfWorker = new Worker('pdf', processPdf, {
    connection,
    concurrency: 2,
});
// Worker event handlers
pdfWorker.on('completed', (job) => {
    logger.info(`PDF job ${job.id} completed`);
});
pdfWorker.on('failed', (job, err) => {
    logger.error(`PDF job ${job?.id} failed:`, err);
});
pdfWorker.on('error', (err) => {
    logger.error('PDF worker error:', err);
});
export function startPdfWorker() {
    logger.info('PDF worker started');
}
//# sourceMappingURL=pdf.worker.js.map