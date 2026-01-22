import mongoose, { Schema } from 'mongoose';
import { IQuiz, IQuizAttempt } from '../types';

// Quiz Schema - Question Bank
const quizSchema = new Schema<IQuiz>(
    {
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
    },
    {
        timestamps: true,
    }
);

// Quiz Attempt Schema - Track user attempts
const quizAttemptSchema = new Schema<IQuizAttempt>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
            index: true,
        },
        quizId: {
            type: Schema.Types.ObjectId,
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
    },
    {
        timestamps: true,
    }
);

// Indexes for efficient querying
quizSchema.index({ topic: 1, difficulty: 1 });
quizAttemptSchema.index({ userId: 1, quizId: 1 });
quizAttemptSchema.index({ userId: 1, completedAt: -1 });

export const Quiz = mongoose.model<IQuiz>('Quiz', quizSchema);
export const QuizAttempt = mongoose.model<IQuizAttempt>('QuizAttempt', quizAttemptSchema);
