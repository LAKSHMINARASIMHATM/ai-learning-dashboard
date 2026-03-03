import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';

/**
 * Role-Based Access Control middleware.
 * Restricts route access to users with specified roles.
 * Must be used AFTER the `protect` middleware.
 */
export const requireRole = (...roles: string[]) => {
    return (req: AuthRequest, res: Response, next: NextFunction): void => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403).json({
                success: false,
                error: 'Insufficient permissions. This action requires elevated access.',
            });
            return;
        }
        next();
    };
};
