import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
export declare const getProgress: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getTopicProgress: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const updateProgress: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const submitQuizScore: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const logStudyTime: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=progress.controller.d.ts.map