"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const dotenv_1 = __importDefault(require("dotenv"));
const helmet_1 = __importDefault(require("helmet"));
const mongoose_1 = __importDefault(require("mongoose"));
// Load environment variables first
dotenv_1.default.config();
// Validate required environment variables
const requiredEnvVars = ['JWT_SECRET', 'MONGODB_URI'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
    console.error('❌ FATAL ERROR: Missing required environment variables:');
    missingEnvVars.forEach(varName => console.error(`   - ${varName}`));
    console.error('\n📝 Please check server/ENV_SETUP.md for configuration instructions\n');
    process.exit(1);
}
const database_1 = __importDefault(require("./config/database"));
const error_middleware_1 = require("./middleware/error.middleware");
// Route imports
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const progress_routes_1 = __importDefault(require("./routes/progress.routes"));
const learningPath_routes_1 = __importDefault(require("./routes/learningPath.routes"));
const resources_routes_1 = __importDefault(require("./routes/resources.routes"));
const assistant_routes_1 = __importDefault(require("./routes/assistant.routes"));
const analytics_routes_1 = __importDefault(require("./routes/analytics.routes"));
const skillGaps_routes_1 = __importDefault(require("./routes/skillGaps.routes"));
const quiz_routes_1 = __importDefault(require("./routes/quiz.routes"));
// Import global rate limiter
const rateLimiter_middleware_1 = require("./middleware/rateLimiter.middleware");
// Create Express app
const app = (0, express_1.default)();
// Connect to MongoDB
(0, database_1.default)();
// Middleware
app.use((0, helmet_1.default)()); // Security headers
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN?.split(',') || ['http://localhost:3000'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use((0, morgan_1.default)(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express_1.default.json({ limit: '10kb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10kb' }));
// Handle malformed JSON
app.use((err, _req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        res.status(400).json({ success: false, error: 'Invalid JSON in request body' });
        return;
    }
    next(err);
});
// Apply global API rate limiter
app.use('/api', rateLimiter_middleware_1.apiLimiter);
// Health check endpoint
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', message: 'AI Learning Dashboard API is running' });
});
// API Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/user', user_routes_1.default);
app.use('/api/progress', progress_routes_1.default);
app.use('/api/learning-path', learningPath_routes_1.default);
app.use('/api/resources', resources_routes_1.default);
app.use('/api/assistant', assistant_routes_1.default);
app.use('/api/analytics', analytics_routes_1.default);
app.use('/api/skill-gaps', skillGaps_routes_1.default);
app.use('/api/quiz', quiz_routes_1.default);
// Error handling middleware
app.use(error_middleware_1.notFound);
app.use(error_middleware_1.errorHandler);
// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 API available at http://localhost:${PORT}/api`);
});
// Graceful shutdown handler
const gracefulShutdown = (signal) => {
    console.log(`\n${signal} received. Shutting down gracefully...`);
    server.close(() => {
        console.log('✅ HTTP server closed');
        mongoose_1.default.connection.close().then(() => {
            console.log('✅ MongoDB connection closed');
            process.exit(0);
        });
    });
    // Force exit after 10 seconds
    setTimeout(() => {
        console.error('⚠️ Forced shutdown after timeout');
        process.exit(1);
    }, 10000);
};
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));
exports.default = app;
//# sourceMappingURL=server.js.map