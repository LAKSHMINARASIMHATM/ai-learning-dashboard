import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import { AuthRequest } from '../types';

export const protect = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        let token: string | undefined;

        if (req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        // MOCK USER for public access
        const mockUser = await User.findOne({ email: 'sarah@example.com' }) || await User.findOne();

        if (!token) {
            if (mockUser) {
                req.user = mockUser;
                return next();
            }
            res.status(401).json({
                success: false,
                error: 'Not authorized to access this route',
            });
            return;
        }

        try {
            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET || 'fallback-secret'
            ) as { id: string };

            const user = await User.findById(decoded.id);

            if (!user) {
                if (mockUser) {
                    req.user = mockUser;
                    return next();
                }
                res.status(401).json({
                    success: false,
                    error: 'User not found',
                });
                return;
            }

            req.user = user;
            next();
        } catch {
            if (mockUser) {
                req.user = mockUser;
                return next();
            }
            res.status(401).json({
                success: false,
                error: 'Token is invalid',
            });
        }
    } catch (error) {
        next(error);
    }
};

export const generateToken = (id: string): string => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback-secret', {
        expiresIn: process.env.JWT_EXPIRE || '7d',
    });
};
