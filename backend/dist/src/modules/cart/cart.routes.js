"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const cart_controller_1 = require("./cart.controller");
const auth_middleware_1 = require("../auth/auth.middleware");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authMiddleware);
router.post("/", cart_controller_1.CartController.addToCart);
router.get("/", cart_controller_1.CartController.getCart);
router.delete("/:id", cart_controller_1.CartController.removeFromCart);
exports.default = router;
//# sourceMappingURL=cart.routes.js.map