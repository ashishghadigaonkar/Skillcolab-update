import { Router } from "express";
import { hackathonsController } from "./hackathons.controller";

const router = Router();

router.get("/api/hackathons", hackathonsController.getHackathons);
router.post("/api/api/hackathons/:id/register", hackathonsController.register); // Oh wait, let's look at original path: "/api/hackathons/:id/register"
router.post("/api/hackathons/:id/register", hackathonsController.register);
router.post("/api/hackathons/:id/submit", hackathonsController.submit);

export default router;
