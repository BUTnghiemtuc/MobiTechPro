import { Router } from "express";
import { BlogController } from "../4controllers/blog.controller";
import { authenticateJWT, checkRole } from "../../auth/3middlewares/auth.middleware";
import { upload } from "../../../middleware/upload.middleware"; 

const router = Router();

router.get("/", BlogController.getPublishedPosts);
router.get("/:id", BlogController.getPost);
router.get("/slug/:slug", BlogController.getPostBySlug);

const adminRouter = Router();

adminRouter.use(authenticateJWT, checkRole(["staff", "admin"]));

adminRouter.get("/", BlogController.getAllPosts);
adminRouter.post("/", upload.single('featured_image'), BlogController.createPost);
adminRouter.put("/:id", upload.single('featured_image'), BlogController.updatePost);
adminRouter.delete("/:id", BlogController.deletePost);
adminRouter.patch("/:id/publish", BlogController.togglePublish);

export { router as blogRoutes, adminRouter as blogAdminRoutes };