import { Router } from "express";
import { mentorsController } from "./mentors.controller";

const router = Router();

// Follows
router.get("/api/follows", mentorsController.getFollows);
router.post("/api/follows", mentorsController.toggleFollow);

// Mentors
router.get("/api/mentors", mentorsController.getMentors);
router.post("/api/mentors/:id/book", mentorsController.bookMentor);
router.get("/api/mentors/booked", mentorsController.getBookedSessions);

export default router;
