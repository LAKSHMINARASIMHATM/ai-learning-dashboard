import { Request } from 'express';
import { Document, Types } from 'mongoose';

// Learning Style Types
export type LearningStyle = 'visual' | 'auditory' | 'kinesthetic' | 'reading';
export type LearningPace = 'slow' | 'moderate' | 'fast';

// Academic History Types
export interface IAcademicRecord {
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startYear: number;
    endYear?: number;
    grades?: { subject: string; grade: string; score?: number }[];
}

// Learner Profile Types
export interface ILearnerProfile {
    learningStyle: LearningStyle;
    secondaryStyle?: LearningStyle;
    academicHistory: IAcademicRecord[];
    strengths: string[];
    weaknesses: string[];
    preferredLearningTime: {
        startHour: number; // 0-23
        endHour: number;
        timezone: string;
    };
    averageSessionDuration: number; // minutes
    learningPace: LearningPace;
    dailyGoalMinutes: number;
    weeklyGoalHours: number;
    interests: string[];
    careerGoals: string[];
}

// User Types
export interface IUser extends Document {
    _id: Types.ObjectId;
    email: string;
    password: string;
    name: string;
    avatar?: string;
    role: 'student' | 'teacher' | 'admin';
    learnerProfile: ILearnerProfile;
    preferences: {
        theme: 'light' | 'dark' | 'system';
        notifications: boolean;
        emailUpdates: boolean;
        language: string;
        accessibilityMode: boolean;
    };
    currentLearningPathId?: Types.ObjectId;
    lastActive: Date;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

export interface AuthRequest extends Request {
    user?: IUser;
}

// Topic Progress Types
export interface ITopicProgress {
    topicId: string;
    topicName: string;
    masteryLevel: number; // 0-100
    timeSpentMinutes: number;
    lessonsCompleted: number;
    totalLessons: number;
    errorCount: number;
    retryCount: number;
    lastAccessedAt: Date;
    status: 'not_started' | 'in_progress' | 'mastered';
}

// Assignment Types
export interface IAssignment {
    assignmentId: string;
    title: string;
    submittedAt: Date;
    grade: number;
    feedback?: string;
    timeSpentMinutes: number;
}

// Progress Types
export interface IProgress extends Document {
    userId: Types.ObjectId;
    skillLevel: number;
    learningProgress: number;
    topicsCompleted: number;
    totalTopics: number;
    weakAreas: string[];
    strongAreas: string[];
    topicProgress: ITopicProgress[];
    assignments: IAssignment[];
    quizScores: {
        week: string;
        quizId?: string;
        score: number;
        totalQuestions?: number;
        correctAnswers?: number;
        timeSpentMinutes?: number;
        date: Date;
    }[];
    studyTime: {
        day: string;
        hours: number;
        topicId?: string;
        date: Date;
    }[];
    improvementData: {
        month: string;
        score: number;
    }[];
    streakDays: number;
    totalStudyHours: number;
    lastStudyDate: Date;
    createdAt: Date;
    updatedAt: Date;
}

// Learning Path Types
export interface IChecklistItem {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    completedAt?: Date;
    estimatedHours: number;
    resourceType: 'video' | 'article' | 'exercise' | 'project' | 'quiz';
    isRequired: boolean;
}

export interface ILearningStep {
    title: string;
    description: string;
    order: number;
    completed: boolean;
    completedAt?: Date;
    estimatedTime: number; // in minutes
    milestoneId?: string;
    moduleId?: string;
    checklist: IChecklistItem[];
    quizTopic?: string;
    passingScore: number;
    needsReview: boolean;
    skippedDueToMastery: boolean;
    // Legacy support
    id?: number;
    topic?: string;
    icon?: string;
    status?: 'completed' | 'active' | 'locked';
    progress?: number;
}

export interface ILearningPath extends Document {
    userId: Types.ObjectId;
    title: string;
    description: string;
    category: string;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    estimatedTime: string;
    totalWeeks: number;
    totalSteps: number;
    steps: ILearningStep[];
    currentStepIndex: number;
    progress: number;
    startedAt: Date;
    completedAt?: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Resource Types
export type ResourceType = 'video' | 'article' | 'course' | 'interactive';
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced';

export interface IResource extends Document {
    title: string;
    description: string;
    type: ResourceType;
    duration: string;
    difficulty: DifficultyLevel;
    rating: number;
    author: string;
    url?: string;
    thumbnailUrl?: string;
    topics: string[];
    createdAt: Date;
    updatedAt: Date;
}

// Chat Message Types
export interface IChatMessage extends Document {
    userId: Types.ObjectId;
    type: 'user' | 'ai';
    content: string;
    createdAt: Date;
}

// Skill Gap Types
export interface ISkillGap extends Document {
    userId: Types.ObjectId;
    skills: {
        topic: string;
        currentLevel: number;
        targetLevel: number;
        gap: number;
        priority: 'high' | 'medium' | 'low';
    }[];
    lastAssessmentDate: Date;
    createdAt: Date;
    updatedAt: Date;
}
// Quiz Types
export interface IQuizQuestion {
    questionId: string;
    question: string;
    type: 'multiple_choice' | 'true_false' | 'fill_blank' | 'short_answer';
    options?: string[];
    correctAnswer: string;
    explanation?: string;
    difficulty: DifficultyLevel;
    topic: string;
    points: number;
}

export interface IQuiz extends Document {
    title: string;
    description: string;
    topic: string;
    difficulty: DifficultyLevel;
    questions: IQuizQuestion[];
    timeLimit: number; // minutes
    passingScore: number; // percentage
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface IQuizAttempt extends Document {
    userId: Types.ObjectId;
    quizId: Types.ObjectId;
    answers: {
        questionId: string;
        selectedAnswer: string;
        isCorrect: boolean;
        timeSpentSeconds: number;
        attempts: number;
    }[];
    score: number;
    totalPoints: number;
    correctAnswers: number;
    wrongAnswers: number;
    timeSpentMinutes: number;
    passed: boolean;
    completedAt: Date;
    createdAt: Date;
}

// API Response Types
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}
