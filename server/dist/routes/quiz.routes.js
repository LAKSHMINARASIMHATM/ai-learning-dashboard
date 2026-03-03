"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const rbac_middleware_1 = require("../middleware/rbac.middleware");
const quiz_controller_1 = require("../controllers/quiz.controller");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_middleware_1.protect);
router.get('/', quiz_controller_1.getQuizzes);
router.get('/history', quiz_controller_1.getQuizHistory);
router.get('/analytics', quiz_controller_1.getQuizAnalytics);
router.get('/recommendations', quiz_controller_1.getQuizRecommendations);
router.post('/reseed', (0, rbac_middleware_1.requireRole)('admin'), quiz_controller_1.reseedQuizzes);
router.get('/:id', quiz_controller_1.getQuiz);
router.post('/:id/submit', quiz_controller_1.submitQuizAttempt);
exports.default = router;
//# sourceMappingURL=quiz.routes.js.map