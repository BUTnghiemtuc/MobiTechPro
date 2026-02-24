import { Router } from "express";
import { OrdersController } from "./orders.controller";
import { authMiddleware, checkRole } from "../auth/auth.middleware";

const router = Router();

router.use(authMiddleware);

router.post("/", OrdersController.createOrder);
router.get("/my-orders", OrdersController.getMyOrders);

// Admin & Staff Routes
router.get("/stats", checkRole(["Admin", "Staff"]), OrdersController.getStats);
router.get("/admin", checkRole(["Admin", "Staff"]), OrdersController.getAllOrders);
router.patch("/:id/status", checkRole(["Admin", "Staff"]), OrdersController.updateStatus);

// Admin Only
router.delete("/:id", checkRole(["Admin"]), OrdersController.deleteOrder);

export default router;
