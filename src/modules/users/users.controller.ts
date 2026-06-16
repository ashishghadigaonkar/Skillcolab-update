import { Request, Response } from "express";
import { userRepository } from "./users.repository";
import { LoggerService } from "../../shared/logger";

export class UserController {
  async getMe(req: Request, res: Response) {
    try {
      const me = await userRepository.getMe();
      res.json(me);
    } catch (err: any) {
      LoggerService.error("Error getting current user:", err);
      res.status(500).json({ error: err.message });
    }
  }

  async getDiscoverPeers(req: Request, res: Response) {
    try {
      const peers = await userRepository.getDiscoverPeers();
      res.json(peers);
    } catch (err: any) {
      LoggerService.error("Error getting discover peers:", err);
      res.status(500).json({ error: err.message });
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const user = await userRepository.findById(userId);
      res.json(user);
    } catch (err: any) {
      LoggerService.error(`Error getting user: ${req.params.userId}`, err);
      res.status(500).json({ error: err.message });
    }
  }

  async getUserByUsername(req: Request, res: Response) {
    try {
      const { username } = req.params;
      const user = await userRepository.findByUsername(username);
      res.json(user);
    } catch (err: any) {
      LoggerService.error(`Error getting user by username: ${req.params.username}`, err);
      res.status(500).json({ error: err.message });
    }
  }

  async getUserActivity(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const activity = await userRepository.getActivity(userId);
      res.json(activity);
    } catch (err: any) {
      LoggerService.error(`Error getting activity for: ${req.params.userId}`, err);
      res.status(500).json({ error: err.message });
    }
  }

  async getUserProjects(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const projects = await userRepository.getProjects(userId);
      res.json(projects);
    } catch (err: any) {
      LoggerService.error(`Error getting projects for: ${req.params.userId}`, err);
      res.status(500).json({ error: err.message });
    }
  }

  async getUserConnections(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const connections = await userRepository.getConnections(userId);
      res.json(connections);
    } catch (err: any) {
      LoggerService.error(`Error getting connections for: ${req.params.userId}`, err);
      res.status(500).json({ error: err.message });
    }
  }

  async getUserFollowers(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const followers = await userRepository.getFollowers(userId);
      res.json(followers);
    } catch (err: any) {
      LoggerService.error(`Error getting followers for: ${req.params.userId}`, err);
      res.status(500).json({ error: err.message });
    }
  }

  async getUserFollowing(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      const following = await userRepository.getFollowing(userId);
      res.json(following);
    } catch (err: any) {
      LoggerService.error(`Error getting following for: ${req.params.userId}`, err);
      res.status(500).json({ error: err.message });
    }
  }

  async updateProfile(req: Request, res: Response) {
    try {
      const updated = await userRepository.updateProfile(req.body);
      res.json({ success: true, user: updated });
    } catch (err: any) {
      LoggerService.error("Error updating user profile:", err);
      res.status(500).json({ error: err.message });
    }
  }
}
export const userController = new UserController();
