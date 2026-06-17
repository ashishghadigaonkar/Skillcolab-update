import { Request, Response } from "express";
import { githubOauthService } from "./github.oauth.service";
import { githubSyncService } from "./github.sync.service";
import { githubRepository } from "./github.repository";
import { githubSkillsService } from "./github.skills.service";
import { githubReputationService } from "./github.reputation.service";
import { githubMatchingService } from "./github.matching.service";
import { githubAnalyticsService } from "./github.analytics.service";
import { dbState, saveDb } from "../../shared/database/dbState";
import { ProjectModel, TeamModel, ChatModel, UserModel } from "../../services/mongodbService";
import mongoose from "mongoose";

export class GithubController {
  async getAuthUrl(req: Request, res: Response) {
    const { redirectUri } = req.query;
    const fallbackRedirect = `${req.protocol}://${req.get("host")}/api/github/callback`;
    const targetUrl = githubOauthService.getAuthUrl((redirectUri as string) || fallbackRedirect);
    res.json({ success: true, url: targetUrl });
  }

  async handleCallback(req: Request, res: Response) {
    const { code, state, redirectUri } = req.query;
    
    if (!code) {
      return res.status(400).send("<h3>OAuth Error: Code param is missing.</h3>");
    }

    try {
      const fallbackRedirect = `${req.protocol}://${req.get("host")}/api/github/callback`;
      const token = await githubOauthService.exchangeCodeForToken(code as string, (redirectUri as string) || fallbackRedirect);

      // We resolve the current active user from system dbState/session
      const activeUserId = dbState.user?.id || "student_ashish";

      // Mark user profile linked with credentials (Phase 1)
      const rawUser = await githubOauthService.fetchGithubUser(token);
      
      await this.linkUserGithubDetails(activeUserId, rawUser);

      // Perform synchronous full initial sync (profile, repos, contributions, languages...)
      await githubSyncService.syncAll(activeUserId, token);

      // Run verified skills detection algorithm (Phase 8)
      await githubSkillsService.analyzeSkills(activeUserId);

      // Run reputation and lock initial achievements badges (Phases 9 & 11)
      await githubReputationService.calculateReputation(activeUserId);

      // Return popup success callback page (Phase 1 iframe redirect helper)
      res.send(`
        <html>
          <body>
            <h2>Authentication Completed Successfully!</h2>
            <p>Your technical work profile has been securely synced to your SkillCollab portfolio dashboard. You can close this window now.</p>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: "GITHUB_OAUTH_SUCCESS" }, "*");
              }
              window.close();
            </script>
          </body>
        </html>
      `);
    } catch (err: any) {
      console.error("[GitHub Controller] OAuth callback error:", err);
      res.status(500).send(`<h3>Authentication Sync Encountered an Error:</h3><p>${err.message}</p>`);
    }
  }

  private async linkUserGithubDetails(userId: string, rawUser: any) {
    const updates = {
      githubId: String(rawUser.id),
      githubConnected: true,
      githubUsername: rawUser.login,
      githubAvatar: rawUser.avatar_url,
      githubProfileUrl: rawUser.html_url || `https://github.com/${rawUser.login}`,
      githubConnectedAt: new Date().toISOString()
    };

    // Update in Mongo DB if live
    if (mongoose.connection.readyState === 1) {
      try {
        const u = await UserModel.findOne({ firebaseUid: userId });
        if (u) {
          Object.assign(u, updates);
          u.links.github = updates.githubProfileUrl;
          await u.save();
        }
      } catch (e) {
        console.error("[GitHub Controller] Failed to update user in MDB:", e);
      }
    }

    // Always update dbState user fallback
    if (dbState.user && (dbState.user.id === userId || !dbState.user.githubConnected)) {
      Object.assign(dbState.user, updates);
      if (!dbState.user.links) dbState.user.links = {};
      dbState.user.links.github = updates.githubProfileUrl;
      saveDb();
    }
  }

  async getProfileDashboard(req: Request, res: Response) {
    const userId = (req.query.userId as string) || dbState.user?.id || "student_ashish";

    try {
      const profile = await githubRepository.getProfile(userId);
      if (!profile) {
        return res.json({ connected: false });
      }

      const repos = await githubRepository.getRepositories(userId);
      const prs = await githubRepository.getPullRequests(userId);
      const issues = await githubRepository.getIssues(userId);
      const organizations = await githubRepository.getOrganizations(userId);
      const verifiedSkills = await githubRepository.getVerifiedSkills(userId);
      const achievements = await githubRepository.getAchievements(userId);
      const activities = await githubRepository.getActivities(userId);
      const aiScorecard = await githubAnalyticsService.generateTalentAnalysis(userId);

      res.json({
        connected: true,
        profile,
        repos,
        prs,
        issues,
        organizations,
        verifiedSkills,
        achievements,
        activities,
        aiScorecard
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async triggerManualSync(req: Request, res: Response) {
    const userId = dbState.user?.id || "student_ashish";
    
    try {
      // Execute standard synchronization using active credentials or sandbox token
      const token = "simulated_oauth_token_for_student_ashish_789";
      const profile = await githubSyncService.syncAll(userId, token);
      await githubSkillsService.analyzeSkills(userId);
      await githubReputationService.calculateReputation(userId);

      res.json({ success: true, message: "Manual synchronization executed successfully.", profile });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async toggleRepoFlag(req: Request, res: Response) {
    const userId = dbState.user?.id || "student_ashish";
    const { repoName } = req.params;
    const { flag } = req.body; // "featured" | "pinned" | "hidden"

    if (!repoName || !flag) {
      return res.status(400).json({ error: "Missing repoName or flag selection." });
    }

    try {
      const repos = await githubRepository.getRepositories(userId);
      const repo = repos.find(r => r.name === repoName);
      if (!repo) {
        return res.status(404).json({ error: "Repository record not found." });
      }

      const updates: any = {};
      if (flag === "featured") {
        updates.isFeatured = !repo.isFeatured;
        await githubRepository.saveActivity(userId, {
          type: "RepoFeatured",
          title: `${updates.isFeatured ? "featured" : "unfeatured"} repository: ${repoName}`,
          repoName,
          createdAt: new Date().toISOString()
        });
      } else if (flag === "pinned") {
        updates.isPinned = !repo.isPinned;
      } else if (flag === "hidden") {
        updates.isHidden = !repo.isHidden;
      }

      const updated = await githubRepository.updateRepositoryFlag(userId, repoName, updates);
      res.json({ success: true, repository: updated });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async importProject(req: Request, res: Response) {
    const userId = dbState.user?.id || "student_ashish";
    const { repoName } = req.body;

    if (!repoName) {
      return res.status(400).json({ error: "No repository name specified." });
    }

    try {
      const repos = await githubRepository.getRepositories(userId);
      const r = repos.find(x => x.name === repoName);
      if (!r) {
        return res.status(404).json({ error: "Source repository name not found." });
      }

      const projectId = `proj_${Date.now()}`;
      const title = `${r.name}`;
      const tagline = r.description || "Open source project imported from GitHub workspace.";
      const description = `This is a verified SkillCollab repository project. Originally synced from the open-source GitHub package "${r.fullName}". Starring ${r.stars} community users and supporting active continuous contributions directly on campus.`;
      const skillsNeeded = r.topics.slice(0, 5).length > 0 ? r.topics.slice(0, 5) : [r.language || "TypeScript"];

      // Setup models in DB or Fallback (Phase 7)
      if (mongoose.connection.readyState === 1) {
        const doc = new ProjectModel({
          _id: new mongoose.Types.ObjectId(),
          title,
          tagline,
          description,
          creatorId: userId,
          creatorName: dbState.user?.fullName || "Collaborator",
          creatorAvatar: dbState.user?.avatarUrl || "",
          skillsNeeded,
          tags: ["GitHub-Imported", r.language || "TypeScript"],
          difficulty: "Advanced",
          status: "Recruiting",
          teamSizeLimit: 5,
          currentTeamSize: 1,
          milestones: [
            { id: "ml_1", title: "GitHub Codebase Setup", description: "Establish pull request branches and code styling rules.", status: "Done", dueDate: new Date().toISOString().slice(0, 10) }
          ],
          attachments: [{ name: "Review Code repository", url: r.readme || "" }]
        });
        await doc.save();

        const tDoc = new TeamModel({
          projectId: doc._id.toString(),
          projectTitle: title,
          leaderId: userId,
          members: [
            {
              userId,
              fullName: dbState.user?.fullName || "Collaborator",
              avatarUrl: dbState.user?.avatarUrl || "",
              role: "Lead Maintainer",
              joinedAt: new Date()
            }
          ]
        });
        await tDoc.save();
      }

      // Sync user fallback
      const fallbackProject = {
        id: projectId,
        title,
        tagline,
        description,
        creatorId: userId,
        creatorName: dbState.user?.fullName || "Collaborator",
        creatorAvatar: dbState.user?.avatarUrl || "",
        skillsNeeded,
        tags: ["GitHub-Imported", r.language || "TypeScript"],
        difficulty: "Advanced",
        status: "Recruiting",
        teamSizeLimit: 5,
        currentTeamSize: 1,
        createdAt: new Date().toISOString(),
        milestones: [
          { id: "ml_1", title: "GitHub Codebase Setup", description: "Establish pull request branches and code styling rules.", status: "Pending", dueDate: new Date().toISOString().slice(0, 10) }
        ],
        attachments: []
      };

      dbState.projects.unshift(fallbackProject);
      dbState.teams.unshift({
        id: `team_${Date.now()}`,
        projectId,
        projectTitle: title,
        leaderId: userId,
        members: [{
          userId,
          fullName: dbState.user?.fullName || "Collaborator",
          avatarUrl: dbState.user?.avatarUrl || "",
          role: "Lead Maintainer",
          joinedAt: new Date().toISOString()
        }],
        invitees: []
      });
      saveDb();

      // Set imported flag
      await githubRepository.updateRepositoryFlag(userId, repoName, { isImported: true });

      res.json({ success: true, message: `Successfully initialized project: ${title}` });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async getMatchingDevelopers(req: Request, res: Response) {
    const { skills } = req.query;
    if (!skills) {
      return res.status(400).json({ error: "Missing skills query string." });
    }

    try {
      const skillsArray = (skills as string).split(",");
      const matches = await githubMatchingService.matchDevelopersForProject(skillsArray);
      res.json(matches);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async getAiAnalytics(req: Request, res: Response) {
    const userId = (req.query.userId as string) || dbState.user?.id || "student_ashish";

    try {
      const report = await githubAnalyticsService.generateTalentAnalysis(userId);
      res.json(report);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async disconnect(req: Request, res: Response) {
    const userId = dbState.user?.id || "student_ashish";

    try {
      await githubRepository.deleteProfile(userId);

      if (mongoose.connection.readyState === 1) {
        try {
          const u = await UserModel.findOne({ firebaseUid: userId });
          if (u) {
            u.githubConnected = false;
            u.githubId = undefined;
            u.githubUsername = undefined;
            u.githubAvatar = undefined;
            u.githubProfileUrl = undefined;
            if (u.links) {
              u.links.github = "";
            }
            await u.save();
          }
        } catch (e) {
          console.error("[GitHub Controller] Failed to reset user details in MongoDB:", e);
        }
      }

      if (dbState.user && dbState.user.id === userId) {
        dbState.user.githubConnected = false;
        dbState.user.githubId = undefined;
        dbState.user.githubUsername = undefined;
        dbState.user.githubAvatar = undefined;
        dbState.user.githubProfileUrl = undefined;
        if (dbState.user.links) {
          dbState.user.links.github = "";
        }
        saveDb();
      }

      res.json({ success: true, message: "Successfully disconnected GitHub account." });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}

export const githubController = new GithubController();
