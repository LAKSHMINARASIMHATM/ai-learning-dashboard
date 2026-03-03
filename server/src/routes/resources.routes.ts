import { Router } from 'express';
import {
    getResources,
    getRecommendedResources,
    getResource,
    createResource
} from '../controllers/resources.controller';
import { protect } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/rbac.middleware';

const router = Router();

// Public routes
router.get('/', getResources);

// Protected routes — MUST come BEFORE /:id to avoid route shadowing
router.get('/user/recommended', protect, getRecommendedResources);
router.post('/', protect, requireRole('admin'), createResource);

// Parameterized route LAST
router.get('/:id', getResource);

export default router;
