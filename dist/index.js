"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config"));
const database_1 = __importDefault(require("./config/database"));
const logger_1 = __importDefault(require("./utils/logger"));
// Graceful shutdown handler
async function gracefulShutdown(signal) {
    logger_1.default.info(`Received ${signal}. Starting graceful shutdown...`);
    // Close database connection
    await database_1.default.$disconnect();
    logger_1.default.info('Database connection closed');
    process.exit(0);
}
// Start server
async function startServer() {
    try {
        // Test database connection
        await database_1.default.$connect();
        logger_1.default.info('Database connected successfully');
        // Start notification workers only if Redis is configured
        if (config_1.default.nodeEnv !== 'test' && config_1.default.redisUrl) {
            try {
                const { startEmailWorker } = await Promise.resolve().then(() => __importStar(require('./modules/notifications/email.worker')));
                const { startSmsWorker } = await Promise.resolve().then(() => __importStar(require('./modules/notifications/sms.worker')));
                const { startWhatsAppWorker } = await Promise.resolve().then(() => __importStar(require('./modules/notifications/whatsapp.worker')));
                const { startPdfWorker } = await Promise.resolve().then(() => __importStar(require('./modules/notifications/pdf.worker')));
                startEmailWorker();
                startSmsWorker();
                startWhatsAppWorker();
                startPdfWorker();
                logger_1.default.info('Notification workers started');
            }
            catch (error) {
                logger_1.default.warn('Failed to start notification workers - Redis may not be available');
            }
        }
        else if (!config_1.default.redisUrl) {
            logger_1.default.warn('Redis not configured - notification workers disabled');
        }
        // Start HTTP server
        const server = app_1.default.listen(config_1.default.port, () => {
            logger_1.default.info(`Server running on port ${config_1.default.port} in ${config_1.default.nodeEnv} mode`);
            logger_1.default.info(`API available at http://localhost:${config_1.default.port}/api`);
        });
        // Handle graceful shutdown
        process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
        process.on('SIGINT', () => gracefulShutdown('SIGINT'));
        // Handle uncaught exceptions
        process.on('uncaughtException', (error) => {
            logger_1.default.error('Uncaught Exception:', error);
            process.exit(1);
        });
        // Handle unhandled promise rejections
        process.on('unhandledRejection', (reason) => {
            logger_1.default.error('Unhandled Rejection:', reason);
            process.exit(1);
        });
    }
    catch (error) {
        logger_1.default.error('Failed to start server:', error);
        process.exit(1);
    }
}
// Start the server
startServer();
//# sourceMappingURL=index.js.map