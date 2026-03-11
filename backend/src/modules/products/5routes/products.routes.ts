import { Router } from "express";
import { ProductsController } from "../4controllers/products.controller";
import { authenticateJWT, checkRole } from "../../auth/3middlewares/auth.middleware";
import { upload } from "../../../middleware/upload.middleware"

const router = Router();

router.get("/", ProductsController.getProducts);
router.get("/:id", ProductsController.getProductById);

router.post(
  "/",
  authenticateJWT,
  checkRole(["staff", "admin"]),
  upload.array("images", 5),
  ProductsController.createProduct
);

router.put(
  "/:id",
  authenticateJWT,
  checkRole(["staff", "admin"]),
  upload.array("images", 5),
  ProductsController.updateProduct
);

router.delete(
  "/:id",
  authenticateJWT,
  checkRole(["staff", "admin"]),
  ProductsController.deleteProduct
);

export default router;