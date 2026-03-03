import { Request, Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
export declare const getResources: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getRecommendedResources: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getResource: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const createResource: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=resources.controller.d.ts.map