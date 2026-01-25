import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import TokenBlacklist from '../models/TokenBlacklist';
import RefreshToken from '../models/RefreshToken';
import { AuthRequest, TokenPayload, AuthTokens } from '../types';

// Validate JWT_SECRET exists
const getJwtSecret = (): string => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('FATAL: JWT_SECRET environment variable is not set');
    }
    if (secret.length < 32) {
        console.warn('WARNING: JWT_SECRET should be at least 32 characters for security');
    }
    return secret;
};

// Generate access token (short-lived)
export const generateAccessToken = (userId: string): string => {
    const payload: TokenPayload = {
        id: userId,
        type: 'access',
    };

    return jwt.sign(payload, getJwtSecret(), {
        expiresIn: process.env.JWT_ACCESS_EXPIRE || '15m',
    });
};

// Generate refresh token (long-lived)
export const generateRefreshToken = (userId: string): string => {
    const payload: TokenPayload = {
        id: userId,
        type: 'refresh',
    };

    return jwt.sign(payload, getJwtSecret(), {
        expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
    });
};

// Generate both tokens
export const generateTokens = async (
    userId: string,
    deviceInfo?: { userAgent?: string; ip?: string }
): Promise<AuthTokens> => {
    const accessToken = generateAccessToken(userId);
    const refreshToken = generateRefreshToken(userId);

    // Decode to get expiration
    const decoded = jwt.decode(refreshToken) as TokenPayload;
    const expiresAt = decoded.exp ? new Date(decoded.exp * 1000) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    // Store refresh token in database
    await RefreshToken.create({
        userId,
        token: refreshToken,
        expiresAt,
        deviceInfo,
    });

    return { accessToken, refreshToken };
};

// Verify access token
export const verifyAccessToken = (token: string): TokenPayload => {
    try {
        const decoded = jwt.verify(token, getJwtSecret()) as TokenPayload;

        // Validate token type
        if (decoded.type !== 'access') {
            throw new Error('Invalid token type');
        }

        return decoded;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new Error('Access token expired');
        }
        if (error instanceof jwt.JsonWebTokenError) {
            throw new Error('Invalid access token');
        }
        throw error;
    }
};

// Verify refresh token
export const verifyRefreshToken = async (token: string): Promise<TokenPayload> => {
    try {
        const decoded = jwt.verify(token, getJwtSecret()) as TokenPayload;

        // Validate token type
        if (decoded.type !== 'refresh') {
            throw new Error('Invalid token type');
        }

        // Check if token exists in database and is not revoked
        const storedToken = await RefreshToken.findOne({
            token,
            expiresAt: { $gt: new Date() },
            isRevoked: false,
        });

        if (!storedToken) {
            throw new Error('Refresh token not found or revoked');
        }

        return decoded;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new Error('Refresh token expired');
        }
        if (error instanceof jwt.JsonWebTokenError) {
            throw new Error('Invalid refresh token');
        }
        throw error;
    }
};

// Protect middleware - validates access token
export const protect = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        let token: string | undefined;

        // Extract token from Authorization header
        if (req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            res.status(401).json({
                success: false,
                error: 'Not authorized to access this route. Please provide a valid token.',
            });
            return;
        }

        // Check if token is blacklisted
        const isBlacklisted = await TokenBlacklist.findOne({
            token,
            expiresAt: { $gt: new Date() },
        });

        if (isBlacklisted) {
            res.status(401).json({
                success: false,
                error: 'Token has been revoked',
            });
            return;
        }

        // Verify token
        try {
            const decoded = verifyAccessToken(token);

            // Get user from database
            const user = await User.findById(decoded.id);

            if (!user) {
                res.status(401).json({
                    success: false,
                    error: 'User not found',
                });
                return;
            }

            // Attach user to request
            req.user = user;
            next();
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Token is invalid';
            res.status(401).json({
                success: false,
                error: message,
            });
        }
    } catch (error) {
        next(error);
    }
};

// Legacy function for backward compatibility
export const generateToken = (id: string): string => {
    return generateAccessToken(id);
};
