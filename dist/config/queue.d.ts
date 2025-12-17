import { Queue, QueueEvents } from 'bullmq';
declare let connection: {
    host: string;
    port: number;
    password?: string;
} | null;
declare let emailQueue: Queue | null;
declare let smsQueue: Queue | null;
declare let whatsappQueue: Queue | null;
declare let pdfQueue: Queue | null;
declare let reportQueue: Queue | null;
declare let emailQueueEvents: QueueEvents | null;
declare let smsQueueEvents: QueueEvents | null;
export { connection, emailQueue, smsQueue, whatsappQueue, pdfQueue, reportQueue, emailQueueEvents, smsQueueEvents, };
//# sourceMappingURL=queue.d.ts.map