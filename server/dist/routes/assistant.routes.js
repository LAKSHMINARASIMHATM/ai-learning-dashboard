"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const assistant_controller_1 = require("../controllers/assistant.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const rateLimiter_middleware_1 = require("../middleware/rateLimiter.middleware");
const validation_middleware_1 = require("../middleware/validation.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.protect);
// Chat message validation + rate limiting
router.post('/chat', rateLimiter_middleware_1.chatLimiter, [
    (0, express_validator_1.body)('content')
        .trim()
        .isLength({ min: 1, max: 2000 })
        .withMessage('Message must be between 1 and 2000 characters'),
    validation_middleware_1.handleValidationErrors,
], assistant_controller_1.sendMessage);
router.get('/history', assistant_controller_1.getChatHistory);
router.delete('/history', assistant_controller_1.clearHistory);
router.get('/suggestions', assistant_controller_1.getSuggestions);
exports.default = router;
//# sourceMappingURL=assistant.routes.js.map