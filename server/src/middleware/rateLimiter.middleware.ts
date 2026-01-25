import rateLimit from 'express-rate-limit';

// Rate limiter for login attempts
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 50, // 50 requests per window
    message: {
        success: false,
        error: 'Too many login attempts. Please try again after 15 minutes.',
    },
    standardHeaders: true,
    legacyHeaders: false,
    // Skip successful requests
    skipSuccessfulRequests: true,
});

// Rate limiter for registration
export const registerLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 30, // 30 registrations per hour per IP
    message: {
        success: false,
        error: 'Too many registration attempts. Please try again after 1 hour.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limiter for token refresh
export const refreshTokenLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // 100 refresh requests per window
    message: {
        success: false,
        error: 'Too many token refresh attempts. Please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// General API rate limiter
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // 1000 requests per window
    message: {
        success: false,
        error: 'Too many requests. Please try again later.',
    },
    standardHeaders: true,
    legacyHeaders: false,
});
