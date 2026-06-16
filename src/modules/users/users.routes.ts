import { Router } from "express";
import { userController } from "./users.controller";

const router = Router();

router.get("/me", userController.getMe);
router.get("/discover/peers", userController.getDiscoverPeers);
router.get("/username/:username", userController.getUserByUsername);
router.get("/:userId", userController.getUserById);
router.get("/:userId/activity", userController.getUserActivity);
router.get("/:userId/projects", userController.getUserProjects);
router.get("/:userId/connections", userController.getUserConnections);
router.get("/:userId/followers", userController.getUserFollowers);
router.get("/:userId/following", userController.getUserFollowing);
router.put("/profile", userController.updateProfile);

export default router;
