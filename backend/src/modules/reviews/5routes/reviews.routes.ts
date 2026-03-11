import { Router } from "express";
import { ReviewsController } from "../4controllers/reviews.controller";
import { authenticateJWT } from "../../auth/3middlewares/auth.middleware";

const router = Router();

router.post("/", authenticateJWT, ReviewsController.create);
router.get("/:productId", ReviewsController.getByProduct);

export default router;