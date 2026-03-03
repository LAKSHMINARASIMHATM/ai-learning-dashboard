import mongoose from 'mongoose';

const connectDB = async (retries: number = 5, delay: number = 3000): Promise<void> => {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-learning-dashboard';

    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const conn = await mongoose.connect(mongoURI);
            console.log(`✅ MongoDB Connected: ${conn.connection.host}`);

            // Handle connection events after initial connect
            mongoose.connection.on('error', (err) => {
                console.error('❌ MongoDB connection error:', err);
            });

            mongoose.connection.on('disconnected', () => {
                console.warn('⚠️ MongoDB disconnected. Attempting reconnect...');
            });

            return;
        } catch (error) {
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

export default connectDB;
