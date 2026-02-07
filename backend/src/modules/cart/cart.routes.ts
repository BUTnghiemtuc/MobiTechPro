import { Router } from "express";
import { CartController } from "./cart.controller";
import { authMiddleware } from "../auth/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.post("/", CartController.addToCart);
router.get("/", CartController.getCart);
router.delete("/:id", CartController.removeFromCart);

export default router;
