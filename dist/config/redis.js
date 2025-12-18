"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
const index_1 = __importDefault(require("./index"));
let redis = null;
exports.redis = redis;
try {
    if (index_1.default.redisUrl) {
        exports.redis = redis = new ioredis_1.default(index_1.default.redisUrl, {
            maxRetriesPerRequest: null,
            enableReadyCheck: false,
            lazyConnect: true,
        });
        redis.on('connect', () => {
            console.log('Connected to Redis');
        });
        redis.on('error', (err) => {
            console.warn('Redis connection error (Redis is optional):', err.message);
        });
        // Try to connect but don't block startup
        redis.connect().catch((err) => {
            console.warn('Redis not available (background jobs disabled):', err.message);
            exports.redis = redis = null;
        });
    }
    else {
        console.warn('Redis URL not configured - background jobs disabled');
    }
}
catch (err) {
    console.warn('Redis initialization failed - background jobs disabled');
    exports.redis = redis = null;
}
exports.default = redis;
//# sourceMappingURL=redis.js.map