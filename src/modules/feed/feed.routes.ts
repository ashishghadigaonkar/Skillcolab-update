import { Router } from "express";
import { feedController } from "./feed.controller";

const router = Router();

router.get("/", feedController.getFeed);
router.post("/posts", feedController.createPost);
router.post("/posts/:id/like", feedController.toggleLike);
router.post("/posts/:id/comment", feedController.addComment);
router.post("/posts/:id/save", feedController.savePost);
router.post("/posts/:id/share", feedController.sharePost);
router.post("/posts/:id/report", feedController.reportPost);
router.post("/posts/:id/connect-author", feedController.connectAuthor);

export default router;
