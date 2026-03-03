import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
/**
 * Role-Based Access Control middleware.
 * Restricts route access to users with specified roles.
 * Must be used AFTER the `protect` middleware.
 */
export declare const requireRole: (...roles: string[]) => (req: AuthRequest, res: Response, next: NextFunction) => void;
//# sourceMappingURL=rbac.middleware.d.ts.map