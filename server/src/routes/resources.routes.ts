import { Router } from 'express';
import {
    getResources,
    getRecommendedResources,
    getResource,
    createResource
} from '../controllers/resources.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

// Public routes
router.get('/', getResources);
router.get('/:id', getResource);

// Protected routes
router.get('/user/recommended', protect, getRecommendedResources);
router.post('/', protect, createResource);

export default router;
