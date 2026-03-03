"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectDB = async (retries = 5, delay = 3000) => {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-learning-dashboard';
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const conn = await mongoose_1.default.connect(mongoURI);
            console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
            // Handle connection events after initial connect
            mongoose_1.default.connection.on('error', (err) => {
                console.error('❌ MongoDB connection error:', err);
            });
            mongoose_1.default.connection.on('disconnected', () => {
                console.warn('⚠️ MongoDB disconnected. Attempting reconnect...');
            });
            return;
        }
        catch (error) {
            console.error(`❌ MongoDB connection attempt ${attempt}/${retries} failed:`, error instanceof Error ? error.message : error);
            if (attempt < retries) {
                const waitTime = delay * Math.pow(2, attempt - 1);
                console.log(`⏳ Retrying in ${waitTime / 1000}s...`);
                await new Promise(resolve => setTimeout(resolve, waitTime));
            }
        }
    }
    console.error('❌ All MongoDB connection attempts failed. Exiting...');
    process.exit(1);
};
exports.default = connectDB;
//# sourceMappingURL=database.js.map