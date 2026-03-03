import { Router } from 'express';
import { body } from 'express-validator';
import {
    sendMessage,
    getChatHistory,
    clearHistory,
    getSuggestions
} from '../controllers/assistant.controller';
import { protect } from '../middleware/auth.middleware';
import { chatLimiter } from '../middleware/rateLimiter.middleware';
import { handleValidationErrors } from '../middleware/validation.middleware';

const router = Router();

router.use(protect);

// Chat message validation + rate limiting
router.post('/chat',
    chatLimiter,
    [
        body('content')
            .trim()
            .isLength({ min: 1, max: 2000 })
            .withMessage('Message must be between 1 and 2000 characters'),
        handleValidationErrors,
    ],
    sendMessage
);

router.get('/history', getChatHistory);
router.delete('/history', clearHistory);
router.get('/suggestions', getSuggestions);

export default router;
