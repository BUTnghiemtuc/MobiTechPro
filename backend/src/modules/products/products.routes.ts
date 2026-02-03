import { Router } from "express";
import { ProductsController } from "./products.controller";
import { authMiddleware, checkRole } from "../auth/auth.middleware";
import { UserRole } from "../users/users.entity";

const router = Router();

router.get("/", ProductsController.getProducts);
router.post(
  "/",
  authMiddleware,
  checkRole([UserRole.STAFF]),
  ProductsController.createProduct
);

export default router;
