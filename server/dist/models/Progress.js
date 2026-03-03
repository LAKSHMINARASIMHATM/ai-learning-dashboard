"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const progressSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, {
    timestamps: true,
});
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
        }
        else if (diffDays > 1) {
            // Streak broken
            this.streakDays = 1;
        }
        this.lastStudyDate = new Date();
    }
    next();
});
const Progress = mongoose_1.default.model('Progress', progressSchema);
exports.default = Progress;
//# sourceMappingURL=Progress.js.map