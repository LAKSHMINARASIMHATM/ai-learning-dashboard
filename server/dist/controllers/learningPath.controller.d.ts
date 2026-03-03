import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
export declare const getPathTemplates: (_req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getTemplateDetails: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const startLearningPath: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getLearningPath: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const updateChecklistItem: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const completeStep: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const adjustLearningPath: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getPathRecommendations: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=learningPath.controller.d.ts.map