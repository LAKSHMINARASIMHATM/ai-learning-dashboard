import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { getPathById } from '../data/learningPathTemplates';
export declare const convertTemplateToSteps: (template: ReturnType<typeof getPathById>) => {
    title: string;
    description: string;
    order: number;
    completed: boolean;
    estimatedTime: number;
    milestoneId: string;
    moduleId: string;
    checklist: {
        id: string;
        title: string;
        description: string;
        completed: boolean;
        estimatedHours: number;
        resourceType: "video" | "article" | "exercise" | "project" | "quiz";
        isRequired: boolean;
        url: string | undefined;
    }[];
    quizTopic: string | undefined;
    passingScore: number;
}[];
export declare const register: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const login: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const socialLogin: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const verifyEmail: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const resendVerification: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getMe: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const refreshToken: (req: Request, res: Response, _next: NextFunction) => Promise<void>;
export declare const logout: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const updatePassword: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=auth.controller.d.ts.map