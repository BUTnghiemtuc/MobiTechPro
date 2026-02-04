import { Router } from "express";
import { ProductsController } from "./products.controller";
import { authMiddleware, checkRole } from "../auth/auth.middleware";
import { UserRole } from "../users/users.entity";
import { upload } from "../../middleware/upload.middleware";

const router = Router();

router.get("/", ProductsController.getProducts);
router.get("/:id", ProductsController.getProductById);
router.post(
  "/",
  authMiddleware,
  checkRole([UserRole.STAFF, UserRole.ADMIN]),
  upload.single("image"),
  ProductsController.createProduct
);

router.put(
  "/:id",
  authMiddleware,
  checkRole([UserRole.STAFF, UserRole.ADMIN]),
  upload.single("image"),
  ProductsController.updateProduct
);

router.delete(
  "/:id",
  authMiddleware,
  checkRole([UserRole.STAFF, UserRole.ADMIN]),
  ProductsController.deleteProduct
);

export default router;
