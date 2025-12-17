import { Worker } from 'bullmq';
import { PdfJobData } from './notification.service';
export declare const pdfWorker: Worker<PdfJobData, any, string>;
export declare function startPdfWorker(): void;
//# sourceMappingURL=pdf.worker.d.ts.map