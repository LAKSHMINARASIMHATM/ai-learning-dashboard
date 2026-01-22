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

        const quizScores = progress?.quizScores || [
            { week: 'Week 1', score: 65 },
            { week: 'Week 2', score: 68 },
            { week: 'Week 3', score: 72 },
            { week: 'Week 4', score: 70 },
            { week: 'Week 5', score: 80 },
            { week: 'Week 6', score: 85 },
            { week: 'Week 7', score: 88 },
            { week: 'Week 8', score: 92 },
        ];

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

        const studyTime = progress?.studyTime || [
            { day: 'Mon', hours: 2.5 },
            { day: 'Tue', hours: 3.0 },
            { day: 'Wed', hours: 1.5 },
            { day: 'Thu', hours: 4.0 },
            { day: 'Fri', hours: 3.5 },
            { day: 'Sat', hours: 5.0 },
            { day: 'Sun', hours: 2.0 },
        ];

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

        const improvementData = progress?.improvementData || [
            { month: 'Month 1', score: 60 },
            { month: 'Month 2', score: 65 },
            { month: 'Month 3', score: 72 },
            { month: 'Month 4', score: 78 },
            { month: 'Month 5', score: 85 },
        ];

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
            : 77;

        const totalHours = studyTime.reduce((sum, d) => sum + d.hours, 0);

        const firstScore = improvementData[0]?.score || 60;
        const lastScore = improvementData[improvementData.length - 1]?.score || 85;
        const improvementRate = ((lastScore - firstScore) / firstScore * 100).toFixed(1);

        res.status(200).json({
            success: true,
            data: {
                averageQuizScore: avgQuizScore,
                weeklyStudyTime: totalHours.toFixed(1),
                improvementRate: `+${improvementRate}%`,
                quizScores: progress?.quizScores,
                studyTime: progress?.studyTime,
                improvementData: progress?.improvementData,
            },
        });
    } catch (error) {
        next(error);
    }
};
