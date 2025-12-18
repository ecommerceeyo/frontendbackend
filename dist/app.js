"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const path_1 = __importDefault(require("path"));
const config_1 = __importDefault(require("./config"));
const routes_1 = __importDefault(require("./routes"));
const errorHandler_1 = require("./middleware/errorHandler");
const rateLimit_1 = require("./middleware/rateLimit");
const sanitize_1 = require("./middleware/sanitize");
const logger_1 = __importDefault(require("./utils/logger"));
// Create Express app
const app = (0, express_1.default)();
// Trust proxy (for rate limiting behind reverse proxy)
app.set('trust proxy', 1);
// Security middleware
app.use((0, helmet_1.default)({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", 'data:', 'https://*.supabase.co'],
        },
    },
    crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
// CORS configuration
app.use((0, cors_1.default)({
    origin: config_1.default.corsOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Cart-Id'],
}));
// Compression
app.use((0, compression_1.default)());
// Body parsing
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Input sanitization
app.use(sanitize_1.sanitize);
// Request logging
if (config_1.default.nodeEnv !== 'test') {
    app.use((0, morgan_1.default)('combined', {
        stream: {
            write: (message) => logger_1.default.info(message.trim()),
        },
    }));
}
// Rate limiting for API routes
app.use('/api', rateLimit_1.apiLimiter);
// Serve static files for local uploads (development mode)
app.use('/uploads', express_1.default.static(path_1.default.join(process.cwd(), 'public', 'uploads')));
// API routes
app.use('/api', routes_1.default);
// Root endpoint
app.get('/', (req, res) => {
    res.json({
        name: 'E-Commerce API',
        version: '1.0.0',
        status: 'running',
        documentation: '/api/docs',
    });
});
// 404 handler
app.use(errorHandler_1.notFoundHandler);
// Error handler
app.use(errorHandler_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map