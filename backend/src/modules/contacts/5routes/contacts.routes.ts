import { Router } from "express";
import { ContactsController } from "../4controllers/contacts.controller";
import { authenticateJWT, checkRole } from "../../auth/3middlewares/auth.middleware";

const router = Router();

// Public route to submit contact form
router.post("/", ContactsController.submit);

// Admin route to view all contacts
router.get("/", authenticateJWT, checkRole(["admin", "staff"]), ContactsController.getAll);

export default router;
