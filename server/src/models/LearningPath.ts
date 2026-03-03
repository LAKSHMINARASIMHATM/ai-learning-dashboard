import mongoose, { Schema } from 'mongoose';
import { ILearningPath } from '../types';

// Checklist item schema for granular progress tracking
const checklistItemSchema = new Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date },
    estimatedHours: { type: Number, default: 1 },
    resourceType: {
        type: String,
        enum: ['video', 'article', 'exercise', 'project', 'quiz'],
        default: 'article',
    },
    isRequired: { type: Boolean, default: true },
    url: { type: String },
});

// Learning step schema with milestone support
const learningStepSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    order: { type: Number, required: true },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date },
    estimatedTime: { type: Number, default: 60 }, // in minutes
    milestoneId: { type: String },
    moduleId: { type: String },
    checklist: [checklistItemSchema],
    quizTopic: { type: String },
    passingScore: { type: Number, default: 70 },
    needsReview: { type: Boolean, default: false },
    skippedDueToMastery: { type: Boolean, default: false },
    // Legacy support
    id: { type: Number },
    topic: { type: String },
    icon: { type: String, default: 'book' },
    status: {
        type: String,
        enum: ['completed', 'active', 'locked'],
        default: 'locked',
    },
    progress: { type: Number, default: 0 },
});

const learningPathSchema = new Schema<ILearningPath>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        category: {
            type: String,
            default: 'Web Development',
        },
        difficulty: {
            type: String,
            enum: ['beginner', 'intermediate', 'advanced'],
            default: 'intermediate',
        },
        estimatedTime: {
            type: String,
            default: '24h 30m',
        },
        totalWeeks: {
            type: Number,
            default: 12,
        },
        totalSteps: {
            type: Number,
            default: 12,
        },
        steps: [learningStepSchema],
        currentStepIndex: {
            type: Number,
            default: 0,
        },
        progress: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },
        startedAt: {
            type: Date,
            default: Date.now,
        },
        completedAt: {
            type: Date,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        tags: [String],
    },
    {
        timestamps: true,
    }
);

// Indexes for efficient queries
learningPathSchema.index({ userId: 1, isActive: 1 });
learningPathSchema.index({ userId: 1, createdAt: -1 });

// Virtual for completion percentage
learningPathSchema.virtual('completionPercentage').get(function (this: ILearningPath) {
    if (!this.steps || this.steps.length === 0) return 0;
    const completed = this.steps.filter(s => s.completed).length;
    return Math.round((completed / this.steps.length) * 100);
});

// Pre-save hook to update progress
learningPathSchema.pre('save', function (this: ILearningPath, next) {
    if (this.steps && this.steps.length > 0) {
        const completed = this.steps.filter(s => s.completed).length;
        this.progress = Math.round((completed / this.steps.length) * 100);
        this.totalSteps = this.steps.length;

        // Mark as completed if all steps done
        if (this.progress === 100 && !this.completedAt) {
            this.completedAt = new Date();
        }
    }
    next();
});

const LearningPath = mongoose.model<ILearningPath>('LearningPath', learningPathSchema);

export default LearningPath;
