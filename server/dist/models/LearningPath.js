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
// Checklist item schema for granular progress tracking
const checklistItemSchema = new mongoose_1.Schema({
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
const learningStepSchema = new mongoose_1.Schema({
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
const learningPathSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
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
}, {
    timestamps: true,
});
// Indexes for efficient queries
learningPathSchema.index({ userId: 1, isActive: 1 });
learningPathSchema.index({ userId: 1, createdAt: -1 });
// Virtual for completion percentage
learningPathSchema.virtual('completionPercentage').get(function () {
    if (!this.steps || this.steps.length === 0)
        return 0;
    const completed = this.steps.filter(s => s.completed).length;
    return Math.round((completed / this.steps.length) * 100);
});
// Pre-save hook to update progress
learningPathSchema.pre('save', function (next) {
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
const LearningPath = mongoose_1.default.model('LearningPath', learningPathSchema);
exports.default = LearningPath;
//# sourceMappingURL=LearningPath.js.map