"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orders_controller_1 = require("./orders.controller");
const auth_middleware_1 = require("../auth/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authMiddleware);
router.post("/", orders_controller_1.OrdersController.createOrder);
router.get("/my-orders", orders_controller_1.OrdersController.getMyOrders);
// Admin & Staff Routes
router.get("/stats", (0, auth_middleware_1.checkRole)(["Admin", "Staff"]), orders_controller_1.OrdersController.getStats);
router.get("/admin", (0, auth_middleware_1.checkRole)(["Admin", "Staff"]), orders_controller_1.OrdersController.getAllOrders);
router.patch("/:id/status", (0, auth_middleware_1.checkRole)(["Admin", "Staff"]), orders_controller_1.OrdersController.updateStatus);
// Admin Only
router.delete("/:id", (0, auth_middleware_1.checkRole)(["Admin"]), orders_controller_1.OrdersController.deleteOrder);
exports.default = router;
//# sourceMappingURL=orders.routes.js.map