import { Router } from "express";
import { ReviewsController } from "./reviews.controller";
import { authMiddleware } from "../auth/auth.middleware";

const router = Router();
const reviewsController = new ReviewsController();

router.post("/", authMiddleware, reviewsController.create.bind(reviewsController));
router.get("/:productId", reviewsController.getByProduct.bind(reviewsController));

export default router;
