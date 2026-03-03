import mongoose, { Schema } from 'mongoose';
import { IProgress } from '../types';

const progressSchema = new Schema<IProgress>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            unique: true,
        },
        skillLevel: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
        learningProgress: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
        topicsCompleted: {
            type: Number,
            default: 0,
        },
        totalTopics: {
            type: Number,
            default: 36,
        },
        weakAreas: {
            type: [String],
            default: [],
        },
        strongAreas: {
            type: [String],
            default: [],
        },
        topicProgress: [{
            topicId: { type: String, required: true },
            topicName: { type: String, required: true },
            masteryLevel: { type: Number, min: 0, max: 100, default: 0 },
            timeSpentMinutes: { type: Number, default: 0 },
            lessonsCompleted: { type: Number, default: 0 },
            totalLessons: { type: Number, default: 0 },
            errorCount: { type: Number, default: 0 },
            retryCount: { type: Number, default: 0 },
            lastAccessedAt: { type: Date, default: Date.now },
            status: {
                type: String,
                enum: ['not_started', 'in_progress', 'mastered', 'locked'],
                default: 'not_started',
            },
        }],
        assignments: [{
            assignmentId: { type: String, required: true },
            title: { type: String, required: true },
            submittedAt: { type: Date, default: Date.now },
            grade: { type: Number, min: 0, max: 100 },
            feedback: String,
            timeSpentMinutes: { type: Number, default: 0 },
        }],
        quizScores: [{
            week: String,
            quizId: String,
            score: Number,
            totalQuestions: Number,
            correctAnswers: Number,
            timeSpentMinutes: Number,
            date: { type: Date, default: Date.now },
        }],
        studyTime: [{
            day: String,
            hours: Number,
            topicId: String,
            date: { type: Date, default: Date.now },
        }],
        improvementData: [{
            month: String,
            score: Number,
        }],
        streakDays: {
            type: Number,
            default: 0,
        },
        totalStudyHours: {
            type: Number,
            default: 0,
        },
        lastStudyDate: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    }
);

// Update streak and cap array sizes (SUP-02: prevent unbounded growth)
progressSchema.pre('save', function (next) {
    // 1. Cap history arrays to 100 items to prevent document bloat
    const MAX_HISTORY = 100;

    if (this.quizScores.length > MAX_HISTORY) {
        this.quizScores = this.quizScores.slice(-MAX_HISTORY);
    }
    if (this.studyTime.length > MAX_HISTORY) {
        this.studyTime = this.studyTime.slice(-MAX_HISTORY);
    }
    if (this.assignments.length > MAX_HISTORY) {
        this.assignments = this.assignments.slice(-MAX_HISTORY);
    }

    // 2. Update streak when study time is logged
    if (this.isModified('studyTime') && this.studyTime.length > 0) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const lastStudy = new Date(this.lastStudyDate);
        lastStudy.setHours(0, 0, 0, 0);

        const diffDays = Math.floor((today.getTime() - lastStudy.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            // Consecutive day
            this.streakDays += 1;
        } else if (diffDays > 1) {
            // Streak broken
            this.streakDays = 1;
        }

        this.lastStudyDate = new Date();
    }
    next();
});

const Progress = mongoose.model<IProgress>('Progress', progressSchema);

export default Progress;
