import { Router } from "express";
import { OrdersController } from "./orders.controller";
import { authMiddleware } from "../auth/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.post("/", OrdersController.createOrder);

export default router;
