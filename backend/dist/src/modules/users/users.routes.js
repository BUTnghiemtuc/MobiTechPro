"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_controller_1 = require("./users.controller");
const auth_middleware_1 = require("../auth/auth.middleware");
const router = (0, express_1.Router)();
const usersController = new users_controller_1.UsersController();
// User Routes
router.get("/me", auth_middleware_1.authMiddleware, usersController.getProfile.bind(usersController));
router.put("/me", auth_middleware_1.authMiddleware, usersController.updateProfile.bind(usersController));
router.put("/me/password", auth_middleware_1.authMiddleware, usersController.changePassword.bind(usersController));
// Admin Routes
router.get("/", auth_middleware_1.authMiddleware, (0, auth_middleware_1.checkRole)(["Admin"]), usersController.getAllUsers.bind(usersController));
router.delete("/:id", auth_middleware_1.authMiddleware, (0, auth_middleware_1.checkRole)(["Admin"]), usersController.deleteUser.bind(usersController));
exports.default = router;
//# sourceMappingURL=users.routes.js.map