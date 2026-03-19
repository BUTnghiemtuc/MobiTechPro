import { Router } from "express";
import { UsersController } from "../4controllers/users.controller";
import { authenticateJWT, checkRole } from "../../auth/3middlewares/auth.middleware";

const router = Router();

router.get("/profile", authenticateJWT, UsersController.getProfile);
router.get("/me", authenticateJWT, UsersController.getProfile);

router.put("/profile", authenticateJWT, UsersController.updateProfile);
router.put("/me", authenticateJWT, UsersController.updateProfile);

router.put("/change-password", authenticateJWT, UsersController.changePassword);
router.put("/me/password", authenticateJWT, UsersController.changePassword);

router.get("/", authenticateJWT, checkRole(["admin"]), UsersController.getAllUsers);

router.delete("/:id", authenticateJWT, checkRole(["admin"]), UsersController.deleteUser);

export default router;