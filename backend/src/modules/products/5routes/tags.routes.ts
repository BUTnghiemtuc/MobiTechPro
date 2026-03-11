import { Router } from "express";
// Cập nhật đường dẫn
import { TagsController } from "../4controllers/tags.controller";
import { authenticateJWT, checkRole } from "../../auth/3middlewares/auth.middleware";

const router = Router();

router.get("/", TagsController.getAllTags);

router.get("/stats", TagsController.getTagStats); 

router.post(
    "/",
    authenticateJWT,
    checkRole(["staff", "admin"]),
    TagsController.createTag
);

router.post(
    "/assign",
    authenticateJWT,
    checkRole(["staff", "admin"]),
    TagsController.assignTagToProduct
);

router.post(
    "/remove",
    authenticateJWT,
    checkRole(["staff", "admin"]),
    TagsController.removeTagFromProduct
);

export default router;