import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User';
import path from 'path';

// Load env from server root
dotenv.config({ path: path.join(__dirname, '../../.env') });

const createDemoUser = async () => {
    try {
        if (!process.env.MONGODB_URI) {
            throw new Error('MONGODB_URI is not defined');
        }

        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const email = 'sarah@example.com';
        const password = 'password';

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name: 'Sarah Wilson',
                email,
                password,
            });
            console.log('Demo user created successfully');
        } else {
            console.log('Demo user already exists');
        }

        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

createDemoUser();
