"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnalyticsSummary = exports.getImprovement = exports.getStudyTime = exports.getQuizScores = void 0;
const Progress_1 = __importDefault(require("../models/Progress"));
// @desc    Get quiz scores trend
// @route   GET /api/analytics/quiz-scores
// @access  Private
const getQuizScores = async (req, res, next) => {
    try {
        const progress = await Progress_1.default.findOne({ userId: req.user?._id });
        const quizScores = progress?.quizScores || [];
        res.status(200).json({
            success: true,
            data: quizScores,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getQuizScores = getQuizScores;
// @desc    Get study time data
// @route   GET /api/analytics/study-time
// @access  Private
const getStudyTime = async (req, res, next) => {
    try {
        const progress = await Progress_1.default.findOne({ userId: req.user?._id });
        const studyTime = progress?.studyTime || [];
        const totalHours = studyTime.reduce((sum, day) => sum + day.hours, 0);
        res.status(200).json({
            success: true,
            data: {
                studyTime,
                totalHours,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getStudyTime = getStudyTime;
// @desc    Get improvement metrics
// @route   GET /api/analytics/improvement
// @access  Private
const getImprovement = async (req, res, next) => {
    try {
        const progress = await Progress_1.default.findOne({ userId: req.user?._id });
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
    }
    catch (error) {
        next(error);
    }
};
exports.getImprovement = getImprovement;
// @desc    Get full analytics summary
// @route   GET /api/analytics/summary
// @access  Private
const getAnalyticsSummary = async (req, res, next) => {
    try {
        const progress = await Progress_1.default.findOne({ userId: req.user?._id });
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
    }
    catch (error) {
        next(error);
    }
};
exports.getAnalyticsSummary = getAnalyticsSummary;
//# sourceMappingURL=analytics.controller.js.map