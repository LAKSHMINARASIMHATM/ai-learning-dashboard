"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateToken = exports.protect = exports.verifyRefreshToken = exports.verifyAccessToken = exports.generateTokens = exports.generateRefreshToken = exports.generateAccessToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const User_1 = __importDefault(require("../models/User"));
const TokenBlacklist_1 = __importDefault(require("../models/TokenBlacklist"));
const RefreshToken_1 = __importDefault(require("../models/RefreshToken"));
// Helper for unique ID generation
const generateJti = () => crypto_1.default.randomUUID();
// Validate JWT_SECRET exists
const getJwtSecret = () => {
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
const generateAccessToken = (userId) => {
    const payload = {
        id: userId,
        jti: generateJti(),
        type: 'access',
    };
    return jsonwebtoken_1.default.sign(payload, getJwtSecret(), {
        expiresIn: (process.env.JWT_ACCESS_EXPIRE || '15m'),
    });
};
exports.generateAccessToken = generateAccessToken;
// Generate refresh token (long-lived)
const generateRefreshToken = (userId) => {
    const payload = {
        id: userId,
        jti: generateJti(),
        type: 'refresh',
    };
    return jsonwebtoken_1.default.sign(payload, getJwtSecret(), {
        expiresIn: (process.env.JWT_REFRESH_EXPIRE || '7d'),
    });
};
exports.generateRefreshToken = generateRefreshToken;
// Generate both tokens
const generateTokens = async (userId, deviceInfo) => {
    const accessToken = (0, exports.generateAccessToken)(userId);
    const refreshToken = (0, exports.generateRefreshToken)(userId);
    // Decode to get expiration
    const decoded = jsonwebtoken_1.default.decode(refreshToken);
    const expiresAt = decoded.exp ? new Date(decoded.exp * 1000) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    // Store refresh token in database
    await RefreshToken_1.default.create({
        userId,
        token: refreshToken,
        expiresAt,
        deviceInfo,
    });
    return { accessToken, refreshToken };
};
exports.generateTokens = generateTokens;
// Verify access token
const verifyAccessToken = (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, getJwtSecret());
        // Validate token type
        if (decoded.type !== 'access') {
            throw new Error('Invalid token type');
        }
        return decoded;
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            throw new Error('Access token expired');
        }
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            throw new Error('Invalid access token');
        }
        throw error;
    }
};
exports.verifyAccessToken = verifyAccessToken;
// Verify refresh token
const verifyRefreshToken = async (token) => {
    try {
        const decoded = jsonwebtoken_1.default.verify(token, getJwtSecret());
        // Validate token type
        if (decoded.type !== 'refresh') {
            throw new Error('Invalid token type');
        }
        // Check if token exists in database and is not revoked
        const storedToken = await RefreshToken_1.default.findOne({
            token,
            expiresAt: { $gt: new Date() },
            isRevoked: false,
        });
        if (!storedToken) {
            throw new Error('Refresh token not found or revoked');
        }
        return decoded;
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            throw new Error('Refresh token expired');
        }
        if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            throw new Error('Invalid refresh token');
        }
        throw error;
    }
};
exports.verifyRefreshToken = verifyRefreshToken;
// Protect middleware - validates access token
const protect = async (req, res, next) => {
    try {
        let token;
        // Extract token from Authorization header or Cookie (MED-07)
        if (req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }
        else if (req.headers.cookie) {
            // Manual parsing in case cookie-parser isn't installed
            const cookies = Object.fromEntries(req.headers.cookie.split(';').map((c) => c.trim().split('=')));
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
            const decoded = (0, exports.verifyAccessToken)(token);
            // HIGH-10: Check if token jti is blacklisted (Efficient lookup)
            const isBlacklisted = await TokenBlacklist_1.default.isBlacklisted(decoded.jti);
            if (isBlacklisted) {
                res.status(401).json({
                    success: false,
                    error: 'Token has been revoked',
                });
                return;
            }
            // Get user from database
            const user = await User_1.default.findById(decoded.id);
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
        }
        catch (error) {
            const message = error instanceof Error ? error.message : 'Token is invalid';
            res.status(401).json({
                success: false,
                error: message,
            });
        }
    }
    catch (error) {
        next(error);
    }
};
exports.protect = protect;
// Legacy function for backward compatibility
const generateToken = (id) => {
    return (0, exports.generateAccessToken)(id);
};
exports.generateToken = generateToken;
//# sourceMappingURL=auth.middleware.js.map