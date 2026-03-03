"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logStudyTime = exports.submitQuizScore = exports.updateProgress = exports.getTopicProgress = exports.getProgress = void 0;
const Progress_1 = __importDefault(require("../models/Progress"));
// @desc    Get user progress summary
// @route   GET /api/progress
// @access  Private
const getProgress = async (req, res, next) => {
    try {
        let progress = await Progress_1.default.findOne({ userId: req.user?._id });
        if (!progress) {
            // Create default progress if none exists
            progress = await Progress_1.default.create({
                userId: req.user?._id,
                skillLevel: 0,
                learningProgress: 0,
                topicsCompleted: 0,
                totalTopics: 0,
                weakAreas: [],
                strongAreas: [],
                topicProgress: [],
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
                strongAreas: progress.strongAreas,
                topicProgress: progress.topicProgress,
                quizScores: progress.quizScores,
                studyTime: progress.studyTime,
                improvementData: progress.improvementData,
                streakDays: progress.streakDays,
                totalStudyHours: progress.totalStudyHours,
            },
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getProgress = getProgress;
// @desc    Get topic progress
// @route   GET /api/progress/topics
// @access  Private
const getTopicProgress = async (req, res, next) => {
    try {
        const progress = await Progress_1.default.findOne({ userId: req.user?._id });
        res.status(200).json({
            success: true,
            data: progress?.topicProgress || [],
        });
    }
    catch (error) {
        next(error);
    }
};
exports.getTopicProgress = getTopicProgress;
// @desc    Update progress data
// @route   PUT /api/progress
// @access  Private
const updateProgress = async (req, res, next) => {
    try {
        const { skillLevel, learningProgress, topicsCompleted, weakAreas } = req.body;
        const progress = await Progress_1.default.findOneAndUpdate({ userId: req.user?._id }, { skillLevel, learningProgress, topicsCompleted, weakAreas }, { new: true, runValidators: true, upsert: true });
        res.status(200).json({
            success: true,
            data: progress,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateProgress = updateProgress;
// @desc    Submit quiz score
// @route   POST /api/progress/quiz
// @access  Private
const submitQuizScore = async (req, res, next) => {
    try {
        const { week, score } = req.body;
        const progress = await Progress_1.default.findOneAndUpdate({ userId: req.user?._id }, {
            $push: {
                quizScores: { week, score, date: new Date() },
            },
        }, { new: true, upsert: true });
        res.status(200).json({
            success: true,
            data: progress?.quizScores,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.submitQuizScore = submitQuizScore;
// @desc    Log study time
// @route   POST /api/progress/study-time
// @access  Private
const logStudyTime = async (req, res, next) => {
    try {
        const { day, hours } = req.body;
        const progress = await Progress_1.default.findOneAndUpdate({ userId: req.user?._id }, {
            $push: {
                studyTime: { day, hours, date: new Date() },
            },
        }, { new: true, upsert: true });
        res.status(200).json({
            success: true,
            data: progress?.studyTime,
        });
    }
    catch (error) {
        next(error);
    }
};
exports.logStudyTime = logStudyTime;
//# sourceMappingURL=progress.controller.js.map