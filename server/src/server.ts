import express, { Application } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import helmet from 'helmet';

// Load environment variables first
dotenv.config();

// Validate required environment variables
const requiredEnvVars = ['JWT_SECRET', 'MONGODB_URI'];
const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
    console.error('❌ FATAL ERROR: Missing required environment variables:');
    missingEnvVars.forEach(varName => console.error(`   - ${varName}`));
    console.error('\n📝 Please check server/ENV_SETUP.md for configuration instructions\n');
    process.exit(1);
}

import connectDB from './config/database';
import { errorHandler, notFound } from './middleware/error.middleware';

// Route imports
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import progressRoutes from './routes/progress.routes';
import learningPathRoutes from './routes/learningPath.routes';
import resourcesRoutes from './routes/resources.routes';
import assistantRoutes from './routes/assistant.routes';
import analyticsRoutes from './routes/analytics.routes';
import skillGapsRoutes from './routes/skillGaps.routes';
import quizRoutes from './routes/quiz.routes';

// Load environment variables
dotenv.config();

// Create Express app
const app: Application = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet()); // Security headers
app.use(cors({
    origin: '*',
    credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', message: 'AI Learning Dashboard API is running' });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/learning-path', learningPathRoutes);
app.use('/api/resources', resourcesRoutes);
app.use('/api/assistant', assistantRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/skill-gaps', skillGapsRoutes);
app.use('/api/quiz', quizRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📍 API available at http://localhost:${PORT}/api`);
});

export default app;
