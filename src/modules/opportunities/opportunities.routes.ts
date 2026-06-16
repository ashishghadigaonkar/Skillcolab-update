import { Router } from "express";
import { opportunitiesController } from "./opportunities.controller";

const router = Router();

// Internships
router.get("/api/internships", opportunitiesController.getInternships);
router.post("/api/internships", opportunitiesController.createInternship);
router.post("/api/internships/:id/apply", opportunitiesController.applyInternship);

// Co-founders
router.get("/api/co-founders/posts", opportunitiesController.getCofounderPosts);
router.post("/api/co-founders/posts", opportunitiesController.createCofounderPost);
router.post("/api/co-founders/posts/:id/apply", opportunitiesController.applyCofounderPost);

// Open Source
router.get("/api/open-source/issues", opportunitiesController.getOpenSourceIssues);
router.post("/api/open-source/log", opportunitiesController.logOpenSourceContribution);

export default router;
