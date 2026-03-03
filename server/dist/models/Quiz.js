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
exports.QuizAttempt = exports.Quiz = void 0;
const mongoose_1 = __importStar(require("mongoose"));
// Quiz Schema - Question Bank
const quizSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'Quiz title is required'],
        trim: true,
    },
    description: {
        type: String,
        default: '',
    },
    topic: {
        type: String,
        required: [true, 'Topic is required'],
        index: true,
    },
    difficulty: {
        type: String,
        enum: ['beginner', 'intermediate', 'advanced'],
        default: 'intermediate',
    },
    questions: [{
            questionId: { type: String, required: true },
            question: { type: String, required: true },
            type: {
                type: String,
                enum: ['multiple_choice', 'true_false', 'fill_blank', 'short_answer'],
                default: 'multiple_choice',
            },
            options: [String],
            correctAnswer: { type: String, required: true },
            explanation: String,
            difficulty: {
                type: String,
                enum: ['beginner', 'intermediate', 'advanced'],
                default: 'intermediate',
            },
            topic: String,
            points: { type: Number, default: 10 },
        }],
    timeLimit: {
        type: Number,
        default: 30, // 30 minutes
    },
    passingScore: {
        type: Number,
        default: 70, // 70%
    },
    isActive: {
        type: Boolean,
        default: true,
    },
}, {
    timestamps: true,
});
// Quiz Attempt Schema - Track user attempts
const quizAttemptSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true,
    },
    quizId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Quiz',
        required: true,
        index: true,
    },
    answers: [{
            questionId: { type: String, required: true },
            selectedAnswer: { type: String, required: true },
            isCorrect: { type: Boolean, required: true },
            timeSpentSeconds: { type: Number, default: 0 },
            attempts: { type: Number, default: 1 },
        }],
    score: {
        type: Number,
        required: true,
        min: 0,
        max: 100,
    },
    totalPoints: {
        type: Number,
        default: 0,
    },
    correctAnswers: {
        type: Number,
        default: 0,
    },
    wrongAnswers: {
        type: Number,
        default: 0,
    },
    timeSpentMinutes: {
        type: Number,
        default: 0,
    },
    passed: {
        type: Boolean,
        default: false,
    },
    completedAt: {
        type: Date,
        default: Date.now,
    },
}, {
    timestamps: true,
});
// Indexes for efficient querying
quizSchema.index({ topic: 1, difficulty: 1 });
quizAttemptSchema.index({ userId: 1, quizId: 1 });
quizAttemptSchema.index({ userId: 1, completedAt: -1 });
exports.Quiz = mongoose_1.default.model('Quiz', quizSchema);
exports.QuizAttempt = mongoose_1.default.model('QuizAttempt', quizAttemptSchema);
//# sourceMappingURL=Quiz.js.map