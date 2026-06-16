import { Router } from "express";
import { adminController } from "./admin.controller";

const router = Router();

router.get("/analytics", adminController.getAnalytics);
router.get("/stats", adminController.getStats);
router.post("/reset", adminController.resetDatabase);
router.get("/moderation", adminController.getModerationQueue);
router.post("/action", adminController.runAction);

export default router;
