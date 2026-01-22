import { Router } from 'express';
import {
    sendMessage,
    getChatHistory,
    clearHistory,
    getSuggestions
} from '../controllers/assistant.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.use(protect);

router.post('/chat', sendMessage);
router.get('/history', getChatHistory);
router.delete('/history', clearHistory);
router.get('/suggestions', getSuggestions);

export default router;
