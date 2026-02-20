import { Router } from "express";
import { BlogController } from "./blog.controller";
import { authMiddleware, checkRole } from "../auth/auth.middleware";
import { UserRole } from "../users/users.entity";

const router = Router();

// Public routes
router.get("/", BlogController.getPublishedPosts);
router.get("/:id", BlogController.getPost);
router.get("/slug/:slug", BlogController.getPostBySlug);

// Admin/Staff protected routes
const adminRouter = Router();
adminRouter.get("/", authMiddleware, checkRole([UserRole.STAFF, UserRole.ADMIN]), BlogController.getAllPosts);
adminRouter.post("/", authMiddleware, checkRole([UserRole.STAFF, UserRole.ADMIN]), BlogController.createPost);
adminRouter.put("/:id", authMiddleware, checkRole([UserRole.STAFF, UserRole.ADMIN]), BlogController.updatePost);
adminRouter.delete("/:id", authMiddleware, checkRole([UserRole.STAFF, UserRole.ADMIN]), BlogController.deletePost);
adminRouter.patch("/:id/publish", authMiddleware, checkRole([UserRole.STAFF, UserRole.ADMIN]), BlogController.togglePublish);

export { router as blogRoutes, adminRouter as blogAdminRoutes };
