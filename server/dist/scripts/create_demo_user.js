"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = __importDefault(require("../models/User"));
const path_1 = __importDefault(require("path"));
// Load env from server root
dotenv_1.default.config({ path: path_1.default.join(__dirname, '../../.env') });
const createDemoUser = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined');
        }
        await mongoose_1.default.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        const email = 'sarah@example.com';
        const password = 'password';
        let user = await User_1.default.findOne({ email });
        if (!user) {
            user = await User_1.default.create({
                name: 'Sarah Wilson',
                email,
                password,
            });
            console.log('Demo user created successfully');
        }
        else {
            console.log('Demo user already exists');
        }
        await mongoose_1.default.disconnect();
        process.exit(0);
    }
    catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};
createDemoUser();
//# sourceMappingURL=create_demo_user.js.map