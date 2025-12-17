import { Worker } from 'bullmq';
import { EmailJobData } from './notification.service';
export declare const emailWorker: Worker<EmailJobData, any, string>;
export declare function startEmailWorker(): void;
//# sourceMappingURL=email.worker.d.ts.map