import { Router } from "express";
import { authController } from "./auth.controller";

const router = Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);
router.post("/sync", authController.sync);

export default router;
