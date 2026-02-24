import { Router } from "express";
import { UsersController } from "./users.controller";
import { authMiddleware, checkRole } from "../auth/auth.middleware";

const router = Router();
const usersController = new UsersController();

// User Routes
router.get("/me", authMiddleware, usersController.getProfile.bind(usersController));
router.put("/me", authMiddleware, usersController.updateProfile.bind(usersController));
router.put("/me/password", authMiddleware, usersController.changePassword.bind(usersController));

// Admin Routes
router.get("/", authMiddleware, checkRole(["Admin"]), usersController.getAllUsers.bind(usersController));
router.delete("/:id", authMiddleware, checkRole(["Admin"]), usersController.deleteUser.bind(usersController));

export default router;
