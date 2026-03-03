"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const learningPath_controller_1 = require("../controllers/learningPath.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// Public routes
router.get('/templates', learningPath_controller_1.getPathTemplates);
router.get('/templates/:templateId', learningPath_controller_1.getTemplateDetails);
// Protected routes
router.use(auth_middleware_1.protect);
// Learning path operations
router.get('/', learningPath_controller_1.getLearningPath);
router.post('/start', learningPath_controller_1.startLearningPath);
// Progress tracking
router.put('/checklist/:stepIndex/:itemId', learningPath_controller_1.updateChecklistItem);
router.put('/step/:stepIndex/complete', learningPath_controller_1.completeStep);
// Adaptive learning
router.post('/adjust', learningPath_controller_1.adjustLearningPath);
router.get('/recommendations', learningPath_controller_1.getPathRecommendations);
exports.default = router;
//# sourceMappingURL=learningPath.routes.js.map