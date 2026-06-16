import { Router } from "express";
import { aiController } from "./ai.controller";

const router = Router();

// Core AI features
router.post("/api/ai/resume-builder", aiController.resumeBuilder);
router.post("/api/ai/mock-interview/start", aiController.startInterview);
router.post("/api/ai/mock-interview/submit", aiController.submitInterview);
router.post("/api/ai/career-roadmap", aiController.careerRoadmap);
router.post("/api/ai/project-generator", aiController.projectGenerator);

// Outer AI helpers
router.post("/api/professional/ai-post", aiController.aiLinkedInPost);
router.post("/api/recommendations", aiController.getRecommendations);

export default router;
