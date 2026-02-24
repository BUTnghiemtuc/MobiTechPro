"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const brands_controller_1 = require("./brands.controller");
const auth_middleware_1 = require("../auth/auth.middleware");
const users_entity_1 = require("../users/users.entity");
const upload_middleware_1 = require("../../middleware/upload.middleware");
const router = (0, express_1.Router)();
// Public routes
router.get("/", brands_controller_1.BrandsController.getBrands);
router.get("/active", brands_controller_1.BrandsController.getActiveBrands);
router.get("/:id", brands_controller_1.BrandsController.getBrandById);
// Admin-only routes
router.post("/", auth_middleware_1.authMiddleware, (0, auth_middleware_1.checkRole)([users_entity_1.UserRole.ADMIN, users_entity_1.UserRole.STAFF]), upload_middleware_1.upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'image', maxCount: 1 }
]), brands_controller_1.BrandsController.createBrand);
router.put("/:id", auth_middleware_1.authMiddleware, (0, auth_middleware_1.checkRole)([users_entity_1.UserRole.ADMIN, users_entity_1.UserRole.STAFF]), upload_middleware_1.upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'image', maxCount: 1 }
]), brands_controller_1.BrandsController.updateBrand);
router.delete("/:id", auth_middleware_1.authMiddleware, (0, auth_middleware_1.checkRole)([users_entity_1.UserRole.ADMIN, users_entity_1.UserRole.STAFF]), brands_controller_1.BrandsController.deleteBrand);
exports.default = router;
//# sourceMappingURL=brands.routes.js.map