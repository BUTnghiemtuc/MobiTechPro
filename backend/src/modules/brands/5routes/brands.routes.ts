import { Router } from "express";
import { BrandsController } from "../4controllers/brands.controller";
import { authenticateJWT, checkRole } from "../../auth/3middlewares/auth.middleware";
import { upload } from "../../../middleware/upload.middleware";

const router = Router();

router.get("/", BrandsController.getBrands);
router.get("/active", BrandsController.getActiveBrands);
router.get("/:id", BrandsController.getBrandById);

router.post(
  "/",
  authenticateJWT,
  checkRole(["admin", "staff"]),
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'image', maxCount: 1 }
  ]),
  BrandsController.createBrand
);

router.put(
  "/:id",
  authenticateJWT,
  checkRole(["admin", "staff"]),
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'image', maxCount: 1 }
  ]),
  BrandsController.updateBrand
);

router.delete(
  "/:id",
  authenticateJWT,
  checkRole(["admin", "staff"]),
  BrandsController.deleteBrand
);

export default router;