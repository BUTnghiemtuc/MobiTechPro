import { Router } from "express";
import { OrdersController } from "../4controllers/orders.controller";
import { authenticateJWT, checkRole } from "../../auth/3middlewares/auth.middleware";

const router = Router();

router.use(authenticateJWT);

router.post("/", OrdersController.createOrder);
router.get("/my-orders", OrdersController.getMyOrders);

router.get("/stats", checkRole(["admin", "staff"]), OrdersController.getStats);
router.get("/admin", checkRole(["admin", "staff"]), OrdersController.getAllOrders);
router.patch("/:id/status", checkRole(["admin", "staff"]), OrdersController.updateStatus);

// Admin Only
router.delete("/:id", checkRole(["admin"]), OrdersController.deleteOrder);

export default router;