import { Router } from 'express';
import { body } from 'express-validator';
import { register, login, socialLogin, verifyEmail, resendVerification, getMe, refreshToken, logout, updatePassword } from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';
import { validateLogin, validateRegister, validateRefreshToken, handleValidationErrors } from '../middleware/validation.middleware';
import { loginLimiter, registerLimiter, refreshTokenLimiter } from '../middleware/rateLimiter.middleware';

const router = Router();

router.post('/register', registerLimiter, validateRegister, register);
router.post('/login', loginLimiter, validateLogin, login);
router.post('/social', loginLimiter, socialLogin);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', protect, resendVerification);
router.post('/refresh', refreshTokenLimiter, validateRefreshToken, refreshToken);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

// Password update with validation
router.put('/password', protect, [
    body('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),
    body('newPassword')
        .isLength({ min: 8 })
        .withMessage('New password must be at least 8 characters long')
        .matches(/[a-z]/)
        .withMessage('New password must contain at least one lowercase letter')
        .matches(/[A-Z]/)
        .withMessage('New password must contain at least one uppercase letter')
        .matches(/[0-9]/)
        .withMessage('New password must contain at least one number')
        .matches(/[@$!%*?&#]/)
        .withMessage('New password must contain at least one special character (@$!%*?&#)'),
    handleValidationErrors,
], updatePassword);

export default router;
