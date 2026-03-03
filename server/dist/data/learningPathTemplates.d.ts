export interface ChecklistItem {
    id: string;
    title: string;
    description: string;
    estimatedHours: number;
    resourceType: 'video' | 'article' | 'exercise' | 'project' | 'quiz';
    isRequired: boolean;
    url?: string;
}
export interface Milestone {
    id: string;
    title: string;
    description: string;
    checklistItems: ChecklistItem[];
    quizTopic?: string;
    passingScore: number;
}
export interface LearningModule {
    id: string;
    title: string;
    description: string;
    order: number;
    estimatedWeeks: number;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    milestones: Milestone[];
    prerequisites: string[];
}
export interface LearningPathTemplate {
    id: string;
    title: string;
    description: string;
    category: string;
    totalWeeks: number;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    modules: LearningModule[];
    outcomes: string[];
    targetRoles: string[];
    tags?: string[];
}
export declare const fullStackPath: LearningPathTemplate;
export declare const frontendPath: LearningPathTemplate;
export declare const reactSpecialistPath: LearningPathTemplate;
export declare const backendPath: LearningPathTemplate;
export declare const aiPath: LearningPathTemplate;
export declare const allLearningPaths: LearningPathTemplate[];
export declare const getPathById: (id: string) => LearningPathTemplate | undefined;
export declare const getPathsByCategory: (category: string) => LearningPathTemplate[];
export declare const getPathsByDifficulty: (difficulty: string) => LearningPathTemplate[];
//# sourceMappingURL=learningPathTemplates.d.ts.map