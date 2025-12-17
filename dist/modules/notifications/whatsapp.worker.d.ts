import { Worker } from 'bullmq';
import { WhatsAppJobData } from './notification.service';
export declare const whatsappWorker: Worker<WhatsAppJobData, any, string>;
export declare function startWhatsAppWorker(): void;
//# sourceMappingURL=whatsapp.worker.d.ts.map