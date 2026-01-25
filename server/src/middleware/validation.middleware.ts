import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Validation error handler
export const handleValidationErrors = (
    req: Request,
    res: Response,
    next: NextFunction
): void => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.status(400).json({
            success: false,
            error: 'Validation failed',
            details: errors.array().map(err => ({
                field: err.type === 'field' ? err.path : 'unknown',
                message: err.msg,
            })),
        });
        return;
    }
    next();
};

// Email validation
export const validateEmail = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email address')
        .normalizeEmail(),
];

// Password validation - strong requirements
export const validatePassword = [
    body('password')
        .isLength({ min: 8 })
        .withMessage('Password must be at least 8 characters long')
        .matches(/[a-z]/)
        .withMessage('Password must contain at least one lowercase letter')
        .matches(/[A-Z]/)
        .withMessage('Password must contain at least one uppercase letter')
        .matches(/[0-9]/)
        .withMessage('Password must contain at least one number')
        .matches(/[@$!%*?&#]/)
        .withMessage('Password must contain at least one special character (@$!%*?&#)'),
];

// Name validation
export const validateName = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters')
        .matches(/^[a-zA-Z\s]+$/)
        .withMessage('Name can only contain letters and spaces'),
];

// Login validation
export const validateLogin = [
    ...validateEmail,
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
    handleValidationErrors,
];

// Registration validation
export const validateRegister = [
    ...validateName,
    ...validateEmail,
    ...validatePassword,
    body('learningPathId')
        .optional()
        .isString()
        .withMessage('Learning path ID must be a string'),
    handleValidationErrors,
];

// Refresh token validation
export const validateRefreshToken = [
    body('refreshToken')
        .notEmpty()
        .withMessage('Refresh token is required')
        .isString()
        .withMessage('Refresh token must be a string'),
    handleValidationErrors,
];
