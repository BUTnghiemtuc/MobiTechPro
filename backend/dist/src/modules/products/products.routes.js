"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const products_controller_1 = require("./products.controller");
const auth_middleware_1 = require("../auth/auth.middleware");
const users_entity_1 = require("../users/users.entity");
const upload_middleware_1 = require("../../middleware/upload.middleware");
const router = (0, express_1.Router)();
router.get("/", products_controller_1.ProductsController.getProducts);
router.get("/:id", products_controller_1.ProductsController.getProductById);
router.post("/", auth_middleware_1.authMiddleware, (0, auth_middleware_1.checkRole)([users_entity_1.UserRole.STAFF, users_entity_1.UserRole.ADMIN]), upload_middleware_1.upload.array("images", 5), // Max 5 images
products_controller_1.ProductsController.createProduct);
router.put("/:id", auth_middleware_1.authMiddleware, (0, auth_middleware_1.checkRole)([users_entity_1.UserRole.STAFF, users_entity_1.UserRole.ADMIN]), upload_middleware_1.upload.array("images", 5), // Max 5 images
products_controller_1.ProductsController.updateProduct);
router.delete("/:id", auth_middleware_1.authMiddleware, (0, auth_middleware_1.checkRole)([users_entity_1.UserRole.STAFF, users_entity_1.UserRole.ADMIN]), products_controller_1.ProductsController.deleteProduct);
exports.default = router;
//# sourceMappingURL=products.routes.js.map