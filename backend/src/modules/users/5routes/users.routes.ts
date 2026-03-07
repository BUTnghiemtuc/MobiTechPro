import { Router } from "express";
import { UsersController } from "../4controllers/users.controller";
import { authenticateJWT, checkRole } from "../../auth/3middlewares/auth.middleware";

const router = Router();

router.get("/me", authenticateJWT, UsersController.getProfile);

router.put("/me", authenticateJWT, UsersController.updateProfile);

router.put("/me/password", authenticateJWT, UsersController.changePassword);

router.get("/", authenticateJWT, checkRole(["admin"]), UsersController.getAllUsers);

router.delete("/:id", authenticateJWT, checkRole(["admin"]), UsersController.deleteUser);

export default router;