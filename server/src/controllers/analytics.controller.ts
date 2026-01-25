import { Response, NextFunction } from 'express';
import Progress from '../models/Progress';
import { AuthRequest } from '../types';

// @desc    Get quiz scores trend
// @route   GET /api/analytics/quiz-scores
// @access  Private
export const getQuizScores = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const progress = await Progress.findOne({ userId: req.user?._id });

        const quizScores = progress?.quizScores || [];

        res.status(200).json({
            success: true,
            data: quizScores,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get study time data
// @route   GET /api/analytics/study-time
// @access  Private
export const getStudyTime = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const progress = await Progress.findOne({ userId: req.user?._id });

        const studyTime = progress?.studyTime || [];

        const totalHours = studyTime.reduce((sum, day) => sum + day.hours, 0);

        res.status(200).json({
            success: true,
            data: {
                studyTime,
                totalHours,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get improvement metrics
// @route   GET /api/analytics/improvement
// @access  Private
export const getImprovement = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const progress = await Progress.findOne({ userId: req.user?._id });

        const improvementData = progress?.improvementData || [];

        const firstScore = improvementData[0]?.score || 0;
        const lastScore = improvementData[improvementData.length - 1]?.score || 0;
        const improvementRate = firstScore > 0
            ? ((lastScore - firstScore) / firstScore * 100).toFixed(1)
            : '0';

        res.status(200).json({
            success: true,
            data: {
                improvementData,
                improvementRate: `+${improvementRate}%`,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get full analytics summary
// @route   GET /api/analytics/summary
// @access  Private
export const getAnalyticsSummary = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        const progress = await Progress.findOne({ userId: req.user?._id });

        const quizScores = progress?.quizScores || [];
        const studyTime = progress?.studyTime || [];
        const improvementData = progress?.improvementData || [];

        const avgQuizScore = quizScores.length > 0
            ? Math.round(quizScores.reduce((sum, q) => sum + q.score, 0) / quizScores.length)
            : 0;

        const totalHours = studyTime.reduce((sum, d) => sum + d.hours, 0);

        const firstScore = improvementData[0]?.score || 0;
        const lastScore = improvementData[improvementData.length - 1]?.score || 0;
        const improvementRate = firstScore > 0
            ? ((lastScore - firstScore) / firstScore * 100).toFixed(1)
            : '0';

        res.status(200).json({
            success: true,
            data: {
                averageQuizScore: avgQuizScore,
                weeklyStudyTime: totalHours.toFixed(1),
                improvementRate: `+${improvementRate}%`,
                quizScores,
                studyTime,
                improvementData,
            },
        });
    } catch (error) {
        next(error);
    }
};
