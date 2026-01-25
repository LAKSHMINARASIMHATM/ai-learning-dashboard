import { Router } from 'express';
import { register, login, getMe, refreshToken, logout, updatePassword } from '../controllers/auth.controller';
import { protect } from '../middleware/auth.middleware';
import { validateLogin, validateRegister, validateRefreshToken } from '../middleware/validation.middleware';
import { loginLimiter, registerLimiter, refreshTokenLimiter } from '../middleware/rateLimiter.middleware';

const router = Router();

router.post('/register', registerLimiter, validateRegister, register);
router.post('/login', loginLimiter, validateLogin, login);
router.post('/refresh', refreshTokenLimiter, validateRefreshToken, refreshToken);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);
router.put('/password', protect, updatePassword);

export default router;
