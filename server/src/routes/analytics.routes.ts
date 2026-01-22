import { Router } from 'express';
import {
    getQuizScores,
    getStudyTime,
    getImprovement,
    getAnalyticsSummary
} from '../controllers/analytics.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.use(protect);

router.get('/quiz-scores', getQuizScores);
router.get('/study-time', getStudyTime);
router.get('/improvement', getImprovement);
router.get('/summary', getAnalyticsSummary);

export default router;
