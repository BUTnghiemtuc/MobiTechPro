import { Router } from "express";
import { TagsController } from "./tags.controller";
import { authMiddleware, checkRole } from "../auth/auth.middleware";
import { UserRole } from "../users/users.entity";

const router = Router();

// Get all tags
router.get("/", TagsController.getAllTags);

// Create a new tag (Admin/Staff only)
router.post(
    "/",
    authMiddleware,
    checkRole([UserRole.STAFF, UserRole.ADMIN]),
    TagsController.createTag
);

// Assign tag to product (Admin/Staff only)
router.post(
    "/assign",
    authMiddleware,
    checkRole([UserRole.STAFF, UserRole.ADMIN]),
    TagsController.assignTagToProduct
);

// Remove tag from product (Admin/Staff only)
router.post(
    "/remove",
    authMiddleware,
    checkRole([UserRole.STAFF, UserRole.ADMIN]),
    TagsController.removeTagFromProduct
);

// Get Tag Stats (Public or maybe Admin only? Let's make it public for now or checkRequirement)
// Since it's for analytics ("Đếm xem mỗi Tag đang được gắn cho bao nhiêu sản phẩm"), it could be public or admin. 
// Assuming it might be used for filtering UI (show count next to tag), let's make it public.
router.get("/stats", TagsController.getTagStats);

export default router;
