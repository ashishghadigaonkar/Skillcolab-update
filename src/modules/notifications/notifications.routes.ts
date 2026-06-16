import { Router } from "express";
import { notificationsController } from "./notifications.controller";

const router = Router();

router.get("/", notificationsController.getNotifications);
router.post("/:id/read", notificationsController.markAsRead);
router.post("/read-all", notificationsController.markAllAsRead);

export default router;
