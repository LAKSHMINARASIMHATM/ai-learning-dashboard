"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const resources_controller_1 = require("../controllers/resources.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const rbac_middleware_1 = require("../middleware/rbac.middleware");
const router = (0, express_1.Router)();
// Public routes
router.get('/', resources_controller_1.getResources);
// Protected routes — MUST come BEFORE /:id to avoid route shadowing
router.get('/user/recommended', auth_middleware_1.protect, resources_controller_1.getRecommendedResources);
router.post('/', auth_middleware_1.protect, (0, rbac_middleware_1.requireRole)('admin'), resources_controller_1.createResource);
// Parameterized route LAST
router.get('/:id', resources_controller_1.getResource);
exports.default = router;
//# sourceMappingURL=resources.routes.js.map