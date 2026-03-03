import { Request } from 'express';
import { Document, Types } from 'mongoose';
export type LearningStyle = 'visual' | 'auditory' | 'kinesthetic' | 'reading';
export type LearningPace = 'slow' | 'moderate' | 'fast';
export interface IAcademicRecord {
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startYear: number;
    endYear?: number;
    grades?: {
        subject: string;
        grade: string;
        score?: number;
    }[];
}
export interface ILearnerProfile {
    learningStyle: LearningStyle;
    secondaryStyle?: LearningStyle;
    academicHistory: IAcademicRecord[];
    strengths: string[];
    weaknesses: string[];
    preferredLearningTime: {
        startHour: number;
        endHour: number;
        timezone: string;
    };
    averageSessionDuration: number;
    learningPace: LearningPace;
    dailyGoalMinutes: number;
    weeklyGoalHours: number;
    interests: string[];
    careerGoals: string[];
}
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
    isVerified: boolean;
    verificationToken?: string;
    verificationTokenExpires?: Date;
    resetPasswordToken?: string;
    resetPasswordExpires?: Date;
    lastActive: Date;
    createdAt: Date;
    updatedAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}
export interface AuthRequest extends Request {
    user?: IUser;
}
export interface TokenPayload {
    id: string;
    jti: string;
    type: 'access' | 'refresh';
    iat?: number;
    exp?: number;
}
export interface AuthTokens {
    accessToken: string;
    refreshToken: string;
}
export interface IRefreshToken extends Document {
    userId: Types.ObjectId;
    token: string;
    expiresAt: Date;
    isRevoked: boolean;
    deviceInfo?: {
        userAgent?: string;
        ip?: string;
    };
    createdAt: Date;
    updatedAt: Date;
}
export interface ITokenBlacklist extends Document {
    jti: string;
    expiresAt: Date;
    reason: 'logout' | 'revoked' | 'security';
    createdAt: Date;
    updatedAt: Date;
}
export interface ITopicProgress {
    topicId: string;
    topicName: string;
    masteryLevel: number;
    timeSpentMinutes: number;
    lessonsCompleted: number;
    totalLessons: number;
    errorCount: number;
    retryCount: number;
    lastAccessedAt: Date;
    status: 'not_started' | 'in_progress' | 'mastered';
}
export interface IAssignment {
    assignmentId: string;
    title: string;
    submittedAt: Date;
    grade: number;
    feedback?: string;
    timeSpentMinutes: number;
}
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
export interface IChecklistItem {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    completedAt?: Date;
    estimatedHours: number;
    resourceType: 'video' | 'article' | 'exercise' | 'project' | 'quiz';
    isRequired: boolean;
    url?: string;
}
export interface ILearningStep {
    title: string;
    description: string;
    order: number;
    completed: boolean;
    completedAt?: Date;
    estimatedTime: number;
    milestoneId?: string;
    moduleId?: string;
    checklist: IChecklistItem[];
    quizTopic?: string;
    passingScore: number;
    needsReview: boolean;
    skippedDueToMastery: boolean;
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
    tags?: string[];
    createdAt: Date;
    updatedAt: Date;
}
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
export interface IChatMessage extends Document {
    userId: Types.ObjectId;
    type: 'user' | 'ai';
    content: string;
    createdAt: Date;
}
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
    timeLimit: number;
    passingScore: number;
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
export interface ApiResponse<T = unknown> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}
//# sourceMappingURL=index.d.ts.map