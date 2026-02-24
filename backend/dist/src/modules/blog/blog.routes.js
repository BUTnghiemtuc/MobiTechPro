"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.blogAdminRoutes = exports.blogRoutes = void 0;
const express_1 = require("express");
const blog_controller_1 = require("./blog.controller");
const auth_middleware_1 = require("../auth/auth.middleware");
const users_entity_1 = require("../users/users.entity");
const router = (0, express_1.Router)();
exports.blogRoutes = router;
// Public routes
router.get("/", blog_controller_1.BlogController.getPublishedPosts);
router.get("/:id", blog_controller_1.BlogController.getPost);
router.get("/slug/:slug", blog_controller_1.BlogController.getPostBySlug);
// Admin/Staff protected routes
const adminRouter = (0, express_1.Router)();
exports.blogAdminRoutes = adminRouter;
adminRouter.get("/", auth_middleware_1.authMiddleware, (0, auth_middleware_1.checkRole)([users_entity_1.UserRole.STAFF, users_entity_1.UserRole.ADMIN]), blog_controller_1.BlogController.getAllPosts);
adminRouter.post("/", auth_middleware_1.authMiddleware, (0, auth_middleware_1.checkRole)([users_entity_1.UserRole.STAFF, users_entity_1.UserRole.ADMIN]), blog_controller_1.BlogController.createPost);
adminRouter.put("/:id", auth_middleware_1.authMiddleware, (0, auth_middleware_1.checkRole)([users_entity_1.UserRole.STAFF, users_entity_1.UserRole.ADMIN]), blog_controller_1.BlogController.updatePost);
adminRouter.delete("/:id", auth_middleware_1.authMiddleware, (0, auth_middleware_1.checkRole)([users_entity_1.UserRole.STAFF, users_entity_1.UserRole.ADMIN]), blog_controller_1.BlogController.deletePost);
adminRouter.patch("/:id/publish", auth_middleware_1.authMiddleware, (0, auth_middleware_1.checkRole)([users_entity_1.UserRole.STAFF, users_entity_1.UserRole.ADMIN]), blog_controller_1.BlogController.togglePublish);
//# sourceMappingURL=blog.routes.js.map