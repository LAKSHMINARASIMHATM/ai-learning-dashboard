import { Router } from 'express';
import { protect } from '../middleware/auth.middleware';
import {
    getQuizzes,
    getQuiz,
    submitQuizAttempt,
    getQuizHistory,
    getQuizAnalytics,
    getQuizRecommendations,
    reseedQuizzes,
} from '../controllers/quiz.controller';

const router = Router();

// All routes require authentication
router.use(protect);

router.get('/', getQuizzes);
router.get('/history', getQuizHistory);
router.get('/analytics', getQuizAnalytics);
router.get('/recommendations', getQuizRecommendations);
router.post('/reseed', reseedQuizzes);
router.get('/:id', getQuiz);
router.post('/:id/submit', submitQuizAttempt);

export default router;
