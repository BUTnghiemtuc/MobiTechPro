"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tags_controller_1 = require("./tags.controller");
const auth_middleware_1 = require("../auth/auth.middleware");
const users_entity_1 = require("../users/users.entity");
const router = (0, express_1.Router)();
// Get all tags
router.get("/", tags_controller_1.TagsController.getAllTags);
// Create a new tag (Admin/Staff only)
router.post("/", auth_middleware_1.authMiddleware, (0, auth_middleware_1.checkRole)([users_entity_1.UserRole.STAFF, users_entity_1.UserRole.ADMIN]), tags_controller_1.TagsController.createTag);
// Assign tag to product (Admin/Staff only)
router.post("/assign", auth_middleware_1.authMiddleware, (0, auth_middleware_1.checkRole)([users_entity_1.UserRole.STAFF, users_entity_1.UserRole.ADMIN]), tags_controller_1.TagsController.assignTagToProduct);
// Remove tag from product (Admin/Staff only)
router.post("/remove", auth_middleware_1.authMiddleware, (0, auth_middleware_1.checkRole)([users_entity_1.UserRole.STAFF, users_entity_1.UserRole.ADMIN]), tags_controller_1.TagsController.removeTagFromProduct);
// Get Tag Stats (Public or maybe Admin only? Let's make it public for now or checkRequirement)
// Since it's for analytics ("Đếm xem mỗi Tag đang được gắn cho bao nhiêu sản phẩm"), it could be public or admin. 
// Assuming it might be used for filtering UI (show count next to tag), let's make it public.
router.get("/stats", tags_controller_1.TagsController.getTagStats);
exports.default = router;
//# sourceMappingURL=tags.routes.js.map