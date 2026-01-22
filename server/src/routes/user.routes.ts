import { Router } from 'express';
import { updateProfile, updateSettings } from '../controllers/user.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.use(protect);

router.put('/profile', updateProfile);
router.put('/settings', updateSettings);

export default router;
