import { Response, NextFunction } from 'express';
import Progress from '../models/Progress';
import { AuthRequest } from '../types';

// @desc    Get user progress summary
// @route   GET /api/progress
// @access  Private
export const getProgress = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        let progress = await Progress.findOne({ userId: req.user?._id });

        if (!progress) {
            // Create default progress if none exists
            progress = await Progress.create({
                userId: req.user?._id,
                skillLevel: 75,
                learningProgress: 68,
                topicsCompleted: 24,
                totalTopics: 36,
                weakAreas: ['Advanced TypeScript', 'System Design', 'Testing'],
            });
        }

        res.status(200).json({
            success: true,
            data: {
                skillLevel: progress.skillLevel,
                learningProgress: progress.learningProgress,
                topicsCompleted: progress.topicsCompleted,
                totalTopics: progress.totalTopics,
                weakAreas: progress.weakAreas,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update progress data
// @route   PUT /api/progress
// @access  Private
export const updateProgress = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { skillLevel, learningProgress, topicsCompleted, weakAreas } = req.body;

        const progress = await Progress.findOneAndUpdate(
            { userId: req.user?._id },
            { skillLevel, learningProgress, topicsCompleted, weakAreas },
            { new: true, runValidators: true, upsert: true }
        );

        res.status(200).json({
            success: true,
            data: progress,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Submit quiz score
// @route   POST /api/progress/quiz
// @access  Private
export const submitQuizScore = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { week, score } = req.body;

        const progress = await Progress.findOneAndUpdate(
            { userId: req.user?._id },
            {
                $push: {
                    quizScores: { week, score, date: new Date() },
                },
            },
            { new: true, upsert: true }
        );

        res.status(200).json({
            success: true,
            data: progress?.quizScores,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Log study time
// @route   POST /api/progress/study-time
// @access  Private
export const logStudyTime = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const { day, hours } = req.body;

        const progress = await Progress.findOneAndUpdate(
            { userId: req.user?._id },
            {
                $push: {
                    studyTime: { day, hours, date: new Date() },
                },
            },
            { new: true, upsert: true }
        );

        res.status(200).json({
            success: true,
            data: progress?.studyTime,
        });
    } catch (error) {
        next(error);
    }
};
