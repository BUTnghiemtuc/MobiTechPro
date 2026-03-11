import { Router } from "express";
import { CartController } from "../4controllers/cart.controller";
import { authenticateJWT } from "../../auth/3middlewares/auth.middleware";

const router = Router();

router.use(authenticateJWT);

router.post("/", CartController.addToCart);
router.get("/", CartController.getCart);
router.delete("/:id", CartController.removeFromCart);

export default router;
