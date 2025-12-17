import { Worker } from 'bullmq';
import { SmsJobData } from './notification.service';
export declare const smsWorker: Worker<SmsJobData, any, string>;
export declare function startSmsWorker(): void;
//# sourceMappingURL=sms.worker.d.ts.map