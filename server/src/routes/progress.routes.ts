import { Router } from 'express';
import {
    getProgress,
    updateProgress,
    submitQuizScore,
    logStudyTime
} from '../controllers/progress.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.use(protect);

router.get('/', getProgress);
router.put('/', updateProgress);
router.post('/quiz', submitQuizScore);
router.post('/study-time', logStudyTime);

export default router;
