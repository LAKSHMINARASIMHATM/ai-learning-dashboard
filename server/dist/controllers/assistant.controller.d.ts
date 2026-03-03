import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
export declare const sendMessage: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getChatHistory: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const clearHistory: (req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
export declare const getSuggestions: (_req: AuthRequest, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=assistant.controller.d.ts.map