import { Router } from 'express';
import {
    getLearningPath,
    getPathTemplates,
    getTemplateDetails,
    startLearningPath,
    updateChecklistItem,
    completeStep,
    adjustLearningPath,
    getPathRecommendations,
} from '../controllers/learningPath.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/templates', getPathTemplates);
router.get('/templates/:templateId', getTemplateDetails);

// Protected routes
router.use(protect);

// Learning path operations
router.get('/', getLearningPath);
router.post('/start', startLearningPath);

// Progress tracking
router.put('/checklist/:stepIndex/:itemId', updateChecklistItem);
router.put('/step/:stepIndex/complete', completeStep);

// Adaptive learning
router.post('/adjust', adjustLearningPath);
router.get('/recommendations', getPathRecommendations);

export default router;
