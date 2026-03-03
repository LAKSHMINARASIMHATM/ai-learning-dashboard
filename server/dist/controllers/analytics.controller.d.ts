import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
export declare const getQuizScores: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getStudyTime: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getImprovement: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getAnalyticsSummary: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=analytics.controller.d.ts.map