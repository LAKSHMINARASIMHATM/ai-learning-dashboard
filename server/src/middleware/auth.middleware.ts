import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import User from '../models/User';
import TokenBlacklist from '../models/TokenBlacklist';
import RefreshToken from '../models/RefreshToken';
import { AuthRequest, TokenPayload, AuthTokens } from '../types';
// Helper for unique ID generation
const generateJti = () => crypto.randomUUID();

// Validate JWT_SECRET exists
const getJwtSecret = (): string => {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
        throw new Error('FATAL: JWT_SECRET environment variable is not set');
    }

    // CRIT-04: Enforce minimum secret length in production
    if (process.env.NODE_ENV === 'production' && secret.length < 32) {
        throw new Error('FATAL: JWT_SECRET must be at least 32 characters in production');
    }

    return secret;
};

// Generate access token (short-lived)
export const generateAccessToken = (userId: string): string => {
    const payload: TokenPayload = {
        id: userId,
        jti: generateJti(),
        type: 'access',
    };

    return jwt.sign(payload, getJwtSecret(), {
        expiresIn: (process.env.JWT_ACCESS_EXPIRE || '15m') as any,
    });
};

// Generate refresh token (long-lived)
export const generateRefreshToken = (userId: string): string => {
    const payload: TokenPayload = {
        id: userId,
        jti: generateJti(),
        type: 'refresh',
    };

    return jwt.sign(payload, getJwtSecret(), {
        expiresIn: (process.env.JWT_REFRESH_EXPIRE || '7d') as any,
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

        // Extract token from Authorization header or Cookie (MED-07)
        if (req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        } else if (req.headers.cookie) {
            // Manual parsing in case cookie-parser isn't installed
            const cookies = Object.fromEntries(
                req.headers.cookie.split(';').map((c: string) => c.trim().split('='))
            );
            token = cookies['accessToken'];
        }

        if (!token) {
            res.status(401).json({
                success: false,
                error: 'Not authorized to access this route. Please provide a valid token.',
            });
            return;
        }

        // Verify token first to get jti
        try {
            const decoded = verifyAccessToken(token);

            // HIGH-10: Check if token jti is blacklisted (Efficient lookup)
            const isBlacklisted = await (TokenBlacklist as any).isBlacklisted(decoded.jti);

            if (isBlacklisted) {
                res.status(401).json({
                    success: false,
                    error: 'Token has been revoked',
                });
                return;
            }

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
