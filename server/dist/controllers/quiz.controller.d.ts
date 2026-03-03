import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
export declare const reseedQuizzes: (_req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getQuizzes: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getQuiz: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const submitQuizAttempt: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getQuizHistory: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getQuizAnalytics: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getQuizRecommendations: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=quiz.controller.d.ts.map