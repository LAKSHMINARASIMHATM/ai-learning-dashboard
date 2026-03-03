"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const progress_controller_1 = require("../controllers/progress.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.protect);
router.get('/', progress_controller_1.getProgress);
router.put('/', progress_controller_1.updateProgress);
router.post('/quiz', progress_controller_1.submitQuizScore);
router.post('/study-time', progress_controller_1.logStudyTime);
router.get('/topics', progress_controller_1.getTopicProgress);
exports.default = router;
//# sourceMappingURL=progress.routes.js.map