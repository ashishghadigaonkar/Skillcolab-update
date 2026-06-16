import { Router } from "express";
import { connectionsController } from "./connections.controller";

const router = Router();

router.get("/api/connections", connectionsController.getConnectionsAndRequests);
router.post("/api/connections/request", connectionsController.sendRequest);
router.post("/api/connections/accept", connectionsController.acceptRequest);
router.post("/api/connections/reject", connectionsController.rejectRequest);
router.post("/api/connections/withdraw", connectionsController.withdrawRequest);
router.post("/api/connections/remove", connectionsController.removeConnection);

export default router;
