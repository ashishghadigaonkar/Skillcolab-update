import { Router } from "express";
import { githubController } from "./github.controller";

const router = Router();

// Connection and Callback (Phase 1)
router.get("/api/github/auth-url", githubController.getAuthUrl);
router.get("/api/github/callback", githubController.handleCallback);
router.post("/api/github/disconnect", githubController.disconnect);

// Profile and Repositories Sync (Phases 3, 4, 5, 6)
router.get("/api/github/profile", githubController.getProfileDashboard);
router.post("/api/github/sync", githubController.triggerManualSync);

// Edit Repo preferences (Phase 6 features)
router.post("/api/github/repo/:repoName/feature", githubController.toggleRepoFlag);

// Import Repo as campus projects (Phase 7)
router.post("/api/github/import-project", githubController.importProject);

// Project developer matching engine (Phase 12)
router.get("/api/github/match", githubController.getMatchingDevelopers);

// AI Career and Recruiter scoreboard (Phases 13 & 14)
router.get("/api/github/analytics", githubController.getAiAnalytics);

export default router;
