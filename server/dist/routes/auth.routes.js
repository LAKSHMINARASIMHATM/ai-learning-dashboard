"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const validation_middleware_1 = require("../middleware/validation.middleware");
const rateLimiter_middleware_1 = require("../middleware/rateLimiter.middleware");
const router = (0, express_1.Router)();
router.post('/register', rateLimiter_middleware_1.registerLimiter, validation_middleware_1.validateRegister, auth_controller_1.register);
router.post('/login', rateLimiter_middleware_1.loginLimiter, validation_middleware_1.validateLogin, auth_controller_1.login);
router.post('/social', rateLimiter_middleware_1.loginLimiter, auth_controller_1.socialLogin);
router.post('/verify-email', auth_controller_1.verifyEmail);
router.post('/resend-verification', auth_middleware_1.protect, auth_controller_1.resendVerification);
router.post('/refresh', rateLimiter_middleware_1.refreshTokenLimiter, validation_middleware_1.validateRefreshToken, auth_controller_1.refreshToken);
router.post('/logout', auth_middleware_1.protect, auth_controller_1.logout);
router.get('/me', auth_middleware_1.protect, auth_controller_1.getMe);
// Password update with validation
router.put('/password', auth_middleware_1.protect, [
    (0, express_validator_1.body)('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),
    (0, express_validator_1.body)('newPassword')
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
    validation_middleware_1.handleValidationErrors,
], auth_controller_1.updatePassword);
exports.default = router;
//# sourceMappingURL=auth.routes.js.map