import { Router } from "express";
import { BrandsController } from "./brands.controller";
import { authMiddleware, checkRole } from "../auth/auth.middleware";
import { UserRole } from "../users/users.entity";
import { upload } from "../../middleware/upload.middleware";

const router = Router();

// Public routes
router.get("/", BrandsController.getBrands);
router.get("/active", BrandsController.getActiveBrands);
router.get("/:id", BrandsController.getBrandById);

// Admin-only routes
router.post(
  "/",
  authMiddleware,
  checkRole([UserRole.ADMIN, UserRole.STAFF]),
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'image', maxCount: 1 }
  ]),
  BrandsController.createBrand
);

router.put(
  "/:id",
  authMiddleware,
  checkRole([UserRole.ADMIN, UserRole.STAFF]),
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'image', maxCount: 1 }
  ]),
  BrandsController.updateBrand
);

router.delete(
  "/:id",
  authMiddleware,
  checkRole([UserRole.ADMIN, UserRole.STAFF]),
  BrandsController.deleteBrand
);

export default router;
