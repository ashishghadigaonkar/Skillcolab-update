import { githubRepository } from "./github.repository";
import { dbState, saveDb } from "../../shared/database/dbState";
import mongoose from "mongoose";
import { UserModel } from "../../services/mongodbService";

export class GithubReputationService {
  async calculateReputation(userId: string): Promise<any> {
    console.info(`[Reputation Engine] Running verification metrics evaluation for: ${userId}`);
    const profile = await githubRepository.getProfile(userId);
    if (!profile) return null;

    const repos = await githubRepository.getRepositories(userId);
    const prs = await githubRepository.getPullRequests(userId);
    const issues = await githubRepository.getIssues(userId);

    // Score calculations
    const starCount = repos.reduce((acc, r) => acc + (r.stars || 0), 0);
    const prCount = prs.length;
    const closedIssues = issues.filter(i => i.status === "closed").length;
    const commitsCount = profile.contributionCount ? Math.max(20, profile.contributionCount - prCount - issues.length) : 50;

    // Open Source Score Calculation (Min 5, Max 100)
    const openSourceScore = Math.max(5, Math.min(100, Math.floor(
      (starCount * 8) + 
      (prCount * 5) + 
      (closedIssues * 3) + 
      (commitsCount * 0.1)
    )));

    // Rank designation
    let rank = "Beginner Contributor";
    if (openSourceScore >= 80) rank = "Elite Maintainer";
    else if (openSourceScore >= 60) rank = "Maintainer";
    else if (openSourceScore >= 40) rank = "Senior Contributor";
    else if (openSourceScore >= 15) rank = "Active Contributor";

    // Achievements evaluation (Phase 11)
    const achievements: any[] = [
      {
        badgeId: "github_verified",
        title: "GitHub Verified",
        description: "Successfully connected a secure live GitHub profile workspace.",
        unlockedAt: profile.createdAt || new Date().toISOString()
      }
    ];

    // Commits badges
    if (commitsCount >= 1000) {
      achievements.push({ badgeId: "commits_1k", title: "1000 Commits", description: "Committed 1,000+ incremental index modifications.", unlockedAt: new Date().toISOString() });
    } else if (commitsCount >= 500) {
      achievements.push({ badgeId: "commits_500", title: "500 Commits", description: "Committed 500+ updates to global repositories.", unlockedAt: new Date().toISOString() });
    } else if (commitsCount >= 100) {
      achievements.push({ badgeId: "commits_100", title: "100 Commits", description: "Committed 100+ codebase increments.", unlockedAt: new Date().toISOString() });
    }

    // PRs badges
    if (prCount >= 100) {
      achievements.push({ badgeId: "prs_100", title: "100 PRs", description: "Opened and merged 100+ collaborative product requests.", unlockedAt: new Date().toISOString() });
    } else if (prCount >= 50) {
      achievements.push({ badgeId: "prs_50", title: "50 PRs", description: "Opened and merged 50+ repository expansions.", unlockedAt: new Date().toISOString() });
    } else if (prCount >= 10) {
      achievements.push({ badgeId: "prs_10", title: "10 PRs", description: "Merged 10+ core project contributions.", unlockedAt: new Date().toISOString() });
    }

    // Star / Maintainer Check
    const hasStarredRepo = repos.some(r => r.stars >= 5);
    if (hasStarredRepo || repos.length >= 8) {
      achievements.push({
        badgeId: "os_maintainer",
        title: "Open Source Maintainer",
        description: "Host or lead public hubs scoring star triggers or community issues.",
        unlockedAt: new Date().toISOString()
      });
    }

    if (openSourceScore > 60) {
      achievements.push({
        badgeId: "top_contributor",
        title: "Top Contributor",
        description: "Scored high-order cumulative metrics on open source rankings.",
        unlockedAt: new Date().toISOString()
      });
    }

    // Reviews badge check
    const totalReviews = prs.reduce((acc, p) => acc + (p.reviewCount || 0), 0);
    if (totalReviews > 5) {
      achievements.push({
        badgeId: "community_reviewer",
        title: "Community Reviewer",
        description: "Reviewed peer code submissions in modern pull requests.",
        unlockedAt: new Date().toISOString()
      });
    }

    // Save Profile & Achievements
    profile.openSourceScore = openSourceScore;
    profile.rank = rank;
    await githubRepository.saveProfile(profile);
    await githubRepository.saveAchievements(userId, achievements);

    // Apply reputation points to global system account (increase points!)
    const reputationPointsBonus = Math.floor(openSourceScore * 10);
    await this.applyReputationToUser(userId, reputationPointsBonus, achievements.map(a => a.title));

    return {
      openSourceScore,
      rank,
      achievementsCount: achievements.length,
      achievements
    };
  }

  private async applyReputationToUser(userId: string, points: number, badgeTitles: string[]): Promise<void> {
    if (mongoose.connection.readyState === 1) {
      try {
        const u = await UserModel.findOne({ firebaseUid: userId });
        if (u) {
          u.reputationPoints = Math.max(u.reputationPoints, 100 + points);
          // append any missing badges
          for (const title of badgeTitles) {
            if (!u.badges.includes(title)) {
              u.badges.push(title);
            }
          }
          await u.save();
        }
      } catch (e) {
        console.error("[Reputation Engine] Error saving reputation to MongoDB User:", e);
      }
    }
    
    // Always sync fallback dbState
    if (dbState.user && dbState.user.id === userId) {
      dbState.user.reputationPoints = Math.max(dbState.user.reputationPoints, 100 + points);
      if (!dbState.user.badges) dbState.user.badges = [];
      for (const title of badgeTitles) {
        if (!dbState.user.badges.includes(title)) {
          dbState.user.badges.push(title);
        }
      }
      saveDb();
    }
  }
}

export const githubReputationService = new GithubReputationService();
