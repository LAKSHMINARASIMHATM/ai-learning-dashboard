"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const skillGaps_controller_1 = require("../controllers/skillGaps.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.protect);
router.get('/', skillGaps_controller_1.getSkillGaps);
router.post('/assessment', skillGaps_controller_1.submitAssessment);
router.get('/recommendations', skillGaps_controller_1.getRecommendations);
exports.default = router;
//# sourceMappingURL=skillGaps.routes.js.map