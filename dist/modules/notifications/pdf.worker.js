"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pdfWorker = void 0;
exports.startPdfWorker = startPdfWorker;
const bullmq_1 = require("bullmq");
const queue_1 = require("../../config/queue");
const logger_1 = __importDefault(require("../../utils/logger"));
const pdf_service_1 = require("../pdf/pdf.service");
// Process PDF generation job
async function processPdf(job) {
    const { type, orderId } = job.data;
    logger_1.default.info(`Processing PDF job ${job.id} - Type: ${type}, OrderId: ${orderId}`);
    try {
        let url;
        if (type === 'invoice') {
            url = await pdf_service_1.pdfService.generateInvoice(orderId);
        }
        else {
            url = await pdf_service_1.pdfService.generateDeliveryNote(orderId);
        }
        logger_1.default.info(`PDF generated and uploaded: ${job.id}, URL: ${url}`);
    }
    catch (error) {
        logger_1.default.error(`PDF generation failed: ${job.id}`, error);
        throw error;
    }
}
// Create and export worker
exports.pdfWorker = new bullmq_1.Worker('pdf', processPdf, {
    connection: queue_1.connection,
    concurrency: 2,
});
// Worker event handlers
exports.pdfWorker.on('completed', (job) => {
    logger_1.default.info(`PDF job ${job.id} completed`);
});
exports.pdfWorker.on('failed', (job, err) => {
    logger_1.default.error(`PDF job ${job?.id} failed:`, err);
});
exports.pdfWorker.on('error', (err) => {
    logger_1.default.error('PDF worker error:', err);
});
function startPdfWorker() {
    logger_1.default.info('PDF worker started');
}
//# sourceMappingURL=pdf.worker.js.map