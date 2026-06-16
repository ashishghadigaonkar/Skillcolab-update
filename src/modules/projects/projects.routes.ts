import { Router } from "express";
import { projectsController } from "./projects.controller";

const router = Router();

router.get("/api/projects", projectsController.getProjects);
router.post("/api/projects", projectsController.createProject);
router.post("/api/projects/:id/apply", projectsController.applyToProject);
router.get("/api/applications", projectsController.getApplications);
router.post("/api/applications/:appId/status", projectsController.updateApplicationStatus);
router.post("/api/projects/:id/milestones", projectsController.addMilestone);
router.patch("/api/projects/:id/milestones/:milestoneId", projectsController.patchMilestone);
router.get("/api/teams", projectsController.getTeams);

export default router;
