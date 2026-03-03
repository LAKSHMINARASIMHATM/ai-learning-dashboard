"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const analytics_controller_1 = require("../controllers/analytics.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.protect);
router.get('/quiz-scores', analytics_controller_1.getQuizScores);
router.get('/study-time', analytics_controller_1.getStudyTime);
router.get('/improvement', analytics_controller_1.getImprovement);
router.get('/summary', analytics_controller_1.getAnalyticsSummary);
exports.default = router;
//# sourceMappingURL=analytics.routes.js.map