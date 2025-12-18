"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.smsQueueEvents = exports.emailQueueEvents = exports.reportQueue = exports.pdfQueue = exports.whatsappQueue = exports.smsQueue = exports.emailQueue = exports.connection = void 0;
const bullmq_1 = require("bullmq");
const index_1 = __importDefault(require("./index"));
let connection = null;
exports.connection = connection;
let emailQueue = null;
exports.emailQueue = emailQueue;
let smsQueue = null;
exports.smsQueue = smsQueue;
let whatsappQueue = null;
exports.whatsappQueue = whatsappQueue;
let pdfQueue = null;
exports.pdfQueue = pdfQueue;
let reportQueue = null;
exports.reportQueue = reportQueue;
let emailQueueEvents = null;
exports.emailQueueEvents = emailQueueEvents;
let smsQueueEvents = null;
exports.smsQueueEvents = smsQueueEvents;
try {
    if (index_1.default.redisUrl) {
        const redisUrl = new URL(index_1.default.redisUrl);
        exports.connection = connection = {
            host: redisUrl.hostname || 'localhost',
            port: parseInt(redisUrl.port || '6379', 10),
            password: redisUrl.password || undefined,
        };
        // Notification Queues
        exports.emailQueue = emailQueue = new bullmq_1.Queue('email', { connection });
        exports.smsQueue = smsQueue = new bullmq_1.Queue('sms', { connection });
        exports.whatsappQueue = whatsappQueue = new bullmq_1.Queue('whatsapp', { connection });
        // PDF Generation Queue
        exports.pdfQueue = pdfQueue = new bullmq_1.Queue('pdf', { connection });
        // Report Generation Queue
        exports.reportQueue = reportQueue = new bullmq_1.Queue('report', { connection });
        // Queue Events for monitoring
        exports.emailQueueEvents = emailQueueEvents = new bullmq_1.QueueEvents('email', { connection });
        exports.smsQueueEvents = smsQueueEvents = new bullmq_1.QueueEvents('sms', { connection });
    }
    else {
        console.warn('Redis not configured - queues disabled');
    }
}
catch (err) {
    console.warn('Queue initialization failed - background jobs disabled');
}
//# sourceMappingURL=queue.js.map