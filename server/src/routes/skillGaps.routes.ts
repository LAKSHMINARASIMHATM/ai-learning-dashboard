import { Router } from 'express';
import {
    getSkillGaps,
    submitAssessment,
    getRecommendations
} from '../controllers/skillGaps.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.use(protect);

router.get('/', getSkillGaps);
router.post('/assessment', submitAssessment);
router.get('/recommendations', getRecommendations);

export default router;
