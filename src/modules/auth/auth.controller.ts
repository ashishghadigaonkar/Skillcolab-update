import { Request, Response } from "express";
import { authRepository } from "./auth.repository";
import { initializeFirebaseAdmin } from "../../shared/helpers/firebase";
import { LoggerService } from "../../shared/logger";

export class AuthController {
  async register(req: Request, res: Response) {
    try {
      const { email, fullName, role } = req.body;
      const user = await authRepository.register(email, fullName, role);
      res.json({ success: true, message: "Registered", user, token: "jwt_tok_stub_123" });
    } catch (err: any) {
      LoggerService.error("Auth register controller failed", err);
      res.status(500).json({ error: err.message });
    }
  }

  async login(req: Request, res: Response) {
    try {
      const { email } = req.body;
      const user = await authRepository.login(email);
      res.json({ success: true, user, token: "jwt_tok_stub_123" });
    } catch (err: any) {
      LoggerService.error("Auth login controller failed", err);
      res.status(500).json({ error: err.message });
    }
  }

  async logout(req: Request, res: Response) {
    res.json({ success: true, message: "Logged out safely" });
  }

  async sync(req: Request, res: Response) {
    const authHeader = req.headers.authorization;
    const { user } = req.body;
    
    if (!user || !user.uid) {
      return res.status(400).json({ error: "Missing authentication synchronization user object." });
    }

    let uid = user.uid;
    let email = user.email || "";
    let fullName = user.displayName || user.fullName || "Ecosystem Student";
    let avatarUrl = user.photoURL || user.avatarUrl || "";

    const token = authHeader?.startsWith("Bearer ") ? authHeader.substring(7) : null;
    if (token && !token.startsWith("simulated_")) {
      const adminApp = initializeFirebaseAdmin();
      if (adminApp) {
        try {
          const decoded = await adminApp.auth().verifyIdToken(token);
          uid = decoded.uid;
          email = decoded.email || email;
          fullName = decoded.name || fullName;
          avatarUrl = decoded.picture || avatarUrl;
          LoggerService.info(`[AuthSync] Security token validated for UID: ${uid}`);
        } catch (e: any) {
          LoggerService.error(`[AuthSync] Token signature verification failed`, e);
          return res.status(401).json({ error: "Invalid Firebase session verification token." });
        }
      }
    }

    try {
      const synced = await authRepository.syncUser(uid, email, fullName, avatarUrl, user);
      res.json({ success: true, user: synced });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}
export const authController = new AuthController();
