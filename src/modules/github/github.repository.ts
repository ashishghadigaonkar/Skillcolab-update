import mongoose, { Schema, Document, Model } from "mongoose";
import { dbState, saveDb } from "../../shared/database/dbState";

// ==========================================
// MONGOOSE INTERFACES & SCHEMAS
// ==========================================

export interface IGithubProfile extends Document {
  userId: string;
  username: string;
  name: string;
  bio: string;
  avatarUrl: string;
  location: string;
  followers: number;
  following: number;
  organizationsCount: number;
  publicRepos: number;
  githubCreatedAt: string;
  profileUrl: string;
  contributionCount: number;
  openSourceScore: number;
  rank: string;
  updatedAt: Date;
}

export interface IGithubRepository extends Document {
  userId: string;
  name: string;
  fullName: string;
  description: string;
  stars: number;
  forks: number;
  language: string;
  contributorsCount: number;
  visibility: string;
  topics: string[];
  homepage: string;
  readme: string;
  isImported: boolean;
  isFeatured: boolean;
  isPinned: boolean;
  isHidden: boolean;
}

export interface IGithubPullRequest extends Document {
  userId: string;
  title: string;
  repoName: string;
  status: string; // 'open' | 'closed' | 'merged'
  mergedAt: string;
  prUrl: string;
  reviewCount: number;
}

export interface IGithubIssue extends Document {
  userId: string;
  title: string;
  repoName: string;
  status: string;
  issueUrl: string;
}

export interface IGithubOrganization extends Document {
  userId: string;
  login: string;
  avatarUrl: string;
  description: string;
}

export interface IVerifiedSkill extends Document {
  userId: string;
  skillName: string;
  confidence: string; // "Verified" | "Expert" | "Novice"
  evidenceType: string; // "GitHub Repositories" | "Pull Requests"
  evidenceCount: number;
}

export interface IGithubAchievement extends Document {
  userId: string;
  badgeId: string;
  title: string;
  description: string;
  unlockedAt: string;
}

export interface IGithubActivity extends Document {
  userId: string;
  type: string; // "RepoCreated" | "RepoFeatured" | "PRMerged" | "IssueClosed" | "AchievementUnlocked"
  title: string;
  repoName: string;
  url: string;
  createdAt: string;
}

// 1. Profile Schema
const GithubProfileSchema = new Schema<IGithubProfile>({
  userId: { type: String, required: true, unique: true },
  username: { type: String, required: true },
  name: { type: String, default: "" },
  bio: { type: String, default: "" },
  avatarUrl: { type: String, default: "" },
  location: { type: String, default: "" },
  followers: { type: Number, default: 0 },
  following: { type: Number, default: 0 },
  organizationsCount: { type: Number, default: 0 },
  publicRepos: { type: Number, default: 0 },
  githubCreatedAt: { type: String, default: "" },
  profileUrl: { type: String, default: "" },
  contributionCount: { type: Number, default: 0 },
  openSourceScore: { type: Number, default: 0 },
  rank: { type: String, default: "Active Contributor" }
}, { timestamps: true });

// 2. Repository Schema
const GithubRepositorySchema = new Schema<IGithubRepository>({
  userId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  fullName: { type: String, required: true },
  description: { type: String, default: "" },
  stars: { type: Number, default: 0 },
  forks: { type: Number, default: 0 },
  language: { type: String, default: "" },
  contributorsCount: { type: Number, default: 1 },
  visibility: { type: String, default: "public" },
  topics: { type: [String], default: [] },
  homepage: { type: String, default: "" },
  readme: { type: String, default: "" },
  isImported: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  isPinned: { type: Boolean, default: false },
  isHidden: { type: Boolean, default: false }
});

const GithubPullRequestSchema = new Schema<IGithubPullRequest>({
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  repoName: { type: String, required: true },
  status: { type: String, default: "open" },
  mergedAt: { type: String, default: "" },
  prUrl: { type: String, default: "" },
  reviewCount: { type: Number, default: 0 }
});

const GithubIssueSchema = new Schema<IGithubIssue>({
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  repoName: { type: String, required: true },
  status: { type: String, default: "open" },
  issueUrl: { type: String, default: "" }
});

const GithubOrganizationSchema = new Schema<IGithubOrganization>({
  userId: { type: String, required: true, index: true },
  login: { type: String, required: true },
  avatarUrl: { type: String, default: "" },
  description: { type: String, default: "" }
});

const VerifiedSkillSchema = new Schema<IVerifiedSkill>({
  userId: { type: String, required: true, index: true },
  skillName: { type: String, required: true },
  confidence: { type: String, default: "Verified" },
  evidenceType: { type: String, default: "GitHub Repositories" },
  evidenceCount: { type: Number, default: 1 }
});

const GithubAchievementSchema = new Schema<IGithubAchievement>({
  userId: { type: String, required: true, index: true },
  badgeId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: "" },
  unlockedAt: { type: String, default: "" }
});

const GithubActivitySchema = new Schema<IGithubActivity>({
  userId: { type: String, required: true, index: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  repoName: { type: String, default: "" },
  url: { type: String, default: "" },
  createdAt: { type: String, default: "" }
});

// Avoid re-compiling models
export const GithubProfileModel: Model<IGithubProfile> = mongoose.models.GithubProfile || mongoose.model<IGithubProfile>("GithubProfile", GithubProfileSchema);
export const GithubRepositoryModel: Model<IGithubRepository> = mongoose.models.GithubRepository || mongoose.model<IGithubRepository>("GithubRepository", GithubRepositorySchema);
export const GithubPullRequestModel: Model<IGithubPullRequest> = mongoose.models.GithubPullRequest || mongoose.model<IGithubPullRequest>("GithubPullRequest", GithubPullRequestSchema);
export const GithubIssueModel: Model<IGithubIssue> = mongoose.models.GithubIssue || mongoose.model<IGithubIssue>("GithubIssue", GithubIssueSchema);
export const GithubOrganizationModel: Model<IGithubOrganization> = mongoose.models.GithubOrganization || mongoose.model<IGithubOrganization>("GithubOrganization", GithubOrganizationSchema);
export const VerifiedSkillModel: Model<IVerifiedSkill> = mongoose.models.VerifiedSkill || mongoose.model<IVerifiedSkill>("VerifiedSkill", VerifiedSkillSchema);
export const GithubAchievementModel: Model<IGithubAchievement> = mongoose.models.GithubAchievement || mongoose.model<IGithubAchievement>("GithubAchievement", GithubAchievementSchema);
export const GithubActivityModel: Model<IGithubActivity> = mongoose.models.GithubActivity || mongoose.model<IGithubActivity>("GithubActivity", GithubActivitySchema);

// Ensure Fallback arrays exist on dbState
const checkDbStateInit = () => {
  const state = dbState as any;
  if (!state.githubProfiles) state.githubProfiles = [];
  if (!state.githubRepositories) state.githubRepositories = [];
  if (!state.githubPullRequests) state.githubPullRequests = [];
  if (!state.githubIssues) state.githubIssues = [];
  if (!state.githubOrganizations) state.githubOrganizations = [];
  if (!state.verifiedSkills) state.verifiedSkills = [];
  if (!state.githubAchievements) state.githubAchievements = [];
  if (!state.githubActivities) state.githubActivities = [];
};

// ==========================================
// REPOSITORY DATA-ACCESS IMPLEMENTATION
// ==========================================

export class GithubRepository {
  private isOnline(): boolean {
    return mongoose.connection.readyState === 1;
  }

  // --- Profile CRUD ---
  async getProfile(userId: string): Promise<any> {
    if (this.isOnline()) {
      return await GithubProfileModel.findOne({ userId });
    } else {
      checkDbStateInit();
      return (dbState as any).githubProfiles.find((p: any) => p.userId === userId) || null;
    }
  }

  async deleteProfile(userId: string): Promise<void> {
    if (this.isOnline()) {
      await GithubProfileModel.deleteOne({ userId });
      await GithubRepositoryModel.deleteMany({ userId });
      await GithubPullRequestModel.deleteMany({ userId });
      await GithubIssueModel.deleteMany({ userId });
      await GithubOrganizationModel.deleteMany({ userId });
      await VerifiedSkillModel.deleteMany({ userId });
      await GithubAchievementModel.deleteMany({ userId });
      await GithubActivityModel.deleteMany({ userId });
    } else {
      checkDbStateInit();
      const state = dbState as any;
      state.githubProfiles = state.githubProfiles.filter((p: any) => p.userId !== userId);
      state.githubRepositories = state.githubRepositories.filter((r: any) => r.userId !== userId);
      state.githubPullRequests = state.githubPullRequests.filter((pr: any) => pr.userId !== userId);
      state.githubIssues = state.githubIssues.filter((i: any) => i.userId !== userId);
      state.githubOrganizations = state.githubOrganizations.filter((o: any) => o.userId !== userId);
      state.verifiedSkills = state.verifiedSkills.filter((s: any) => s.userId !== userId);
      state.githubAchievements = state.githubAchievements.filter((a: any) => a.userId !== userId);
      state.githubActivities = state.githubActivities.filter((act: any) => act.userId !== userId);
      saveDb();
    }
  }

  async saveProfile(profile: any): Promise<any> {
    if (this.isOnline()) {
      return await GithubProfileModel.findOneAndUpdate(
        { userId: profile.userId },
        profile,
        { upspsert: true, new: true, upsert: true }
      );
    } else {
      checkDbStateInit();
      const profiles = (dbState as any).githubProfiles;
      const idx = profiles.findIndex((p: any) => p.userId === profile.userId);
      if (idx !== -1) {
        profiles[idx] = { ...profiles[idx], ...profile };
      } else {
        profiles.push(profile);
      }
      saveDb();
      return profile;
    }
  }

  // --- Repositories ---
  async getRepositories(userId: string): Promise<any[]> {
    if (this.isOnline()) {
      return await GithubRepositoryModel.find({ userId });
    } else {
      checkDbStateInit();
      return (dbState as any).githubRepositories.filter((r: any) => r.userId === userId);
    }
  }

  async saveRepositories(userId: string, repos: any[]): Promise<void> {
    if (this.isOnline()) {
      await GithubRepositoryModel.deleteMany({ userId });
      if (repos.length > 0) {
        await GithubRepositoryModel.insertMany(repos.map(r => ({ ...r, userId })));
      }
    } else {
      checkDbStateInit();
      const state = dbState as any;
      state.githubRepositories = state.githubRepositories.filter((r: any) => r.userId !== userId);
      state.githubRepositories.push(...repos.map(r => ({ ...r, userId })));
      saveDb();
    }
  }

  async updateRepositoryFlag(userId: string, repoIdOrName: string, updates: Partial<IGithubRepository>): Promise<any> {
    if (this.isOnline()) {
      return await GithubRepositoryModel.findOneAndUpdate(
        { userId, name: repoIdOrName },
        { $set: updates },
        { new: true }
      );
    } else {
      checkDbStateInit();
      const rList = (dbState as any).githubRepositories;
      const r = rList.find((x: any) => x.userId === userId && x.name === repoIdOrName);
      if (r) {
        Object.assign(r, updates);
        saveDb();
      }
      return r;
    }
  }

  // --- Pull Requests ---
  async getPullRequests(userId: string): Promise<any[]> {
    if (this.isOnline()) {
      return await GithubPullRequestModel.find({ userId });
    } else {
      checkDbStateInit();
      return (dbState as any).githubPullRequests.filter((pr: any) => pr.userId === userId);
    }
  }

  async savePullRequests(userId: string, prs: any[]): Promise<void> {
    if (this.isOnline()) {
      await GithubPullRequestModel.deleteMany({ userId });
      if (prs.length > 0) {
        await GithubPullRequestModel.insertMany(prs.map(p => ({ ...p, userId })));
      }
    } else {
      checkDbStateInit();
      const state = dbState as any;
      state.githubPullRequests = state.githubPullRequests.filter((pr: any) => pr.userId !== userId);
      state.githubPullRequests.push(...prs.map(p => ({ ...p, userId })));
      saveDb();
    }
  }

  // --- Issues ---
  async getIssues(userId: string): Promise<any[]> {
    if (this.isOnline()) {
      return await GithubIssueModel.find({ userId });
    } else {
      checkDbStateInit();
      return (dbState as any).githubIssues.filter((i: any) => i.userId === userId);
    }
  }

  async saveIssues(userId: string, issues: any[]): Promise<void> {
    if (this.isOnline()) {
      await GithubIssueModel.deleteMany({ userId });
      if (issues.length > 0) {
        await GithubIssueModel.insertMany(issues.map(i => ({ ...i, userId })));
      }
    } else {
      checkDbStateInit();
      const state = dbState as any;
      state.githubIssues = state.githubIssues.filter((i: any) => i.userId !== userId);
      state.githubIssues.push(...issues.map(i => ({ ...i, userId })));
      saveDb();
    }
  }

  // --- Organizations ---
  async getOrganizations(userId: string): Promise<any[]> {
    if (this.isOnline()) {
      return await GithubOrganizationModel.find({ userId });
    } else {
      checkDbStateInit();
      return (dbState as any).githubOrganizations.filter((org: any) => org.userId === userId);
    }
  }

  async saveOrganizations(userId: string, orgs: any[]): Promise<void> {
    if (this.isOnline()) {
      await GithubOrganizationModel.deleteMany({ userId });
      if (orgs.length > 0) {
        await GithubOrganizationModel.insertMany(orgs.map(o => ({ ...o, userId })));
      }
    } else {
      checkDbStateInit();
      const state = dbState as any;
      state.githubOrganizations = state.githubOrganizations.filter((org: any) => org.userId !== userId);
      state.githubOrganizations.push(...orgs.map(o => ({ ...o, userId })));
      saveDb();
    }
  }

  // --- Verified Skills ---
  async getVerifiedSkills(userId: string): Promise<any[]> {
    if (this.isOnline()) {
      return await VerifiedSkillModel.find({ userId });
    } else {
      checkDbStateInit();
      return (dbState as any).verifiedSkills.filter((vs: any) => vs.userId === userId);
    }
  }

  async saveVerifiedSkills(userId: string, skills: any[]): Promise<void> {
    if (this.isOnline()) {
      await VerifiedSkillModel.deleteMany({ userId });
      if (skills.length > 0) {
        await VerifiedSkillModel.insertMany(skills.map(s => ({ ...s, userId })));
      }
    } else {
      checkDbStateInit();
      const state = dbState as any;
      state.verifiedSkills = state.verifiedSkills.filter((vs: any) => vs.userId !== userId);
      state.verifiedSkills.push(...skills.map(s => ({ ...s, userId })));
      saveDb();
    }
  }

  // --- Achievements ---
  async getAchievements(userId: string): Promise<any[]> {
    if (this.isOnline()) {
      return await GithubAchievementModel.find({ userId });
    } else {
      checkDbStateInit();
      return (dbState as any).githubAchievements.filter((a: any) => a.userId === userId);
    }
  }

  async saveAchievements(userId: string, achievements: any[]): Promise<void> {
    if (this.isOnline()) {
      await GithubAchievementModel.deleteMany({ userId });
      if (achievements.length > 0) {
        await GithubAchievementModel.insertMany(achievements.map(a => ({ ...a, userId })));
      }
    } else {
      checkDbStateInit();
      const state = dbState as any;
      state.githubAchievements = state.githubAchievements.filter((a: any) => a.userId !== userId);
      state.githubAchievements.push(...achievements.map(a => ({ ...a, userId })));
      saveDb();
    }
  }

  // --- Activities ---
  async getActivities(userId: string): Promise<any[]> {
    if (this.isOnline()) {
      return await GithubActivityModel.find({ userId }).sort({ createdAt: -1 }).limit(20);
    } else {
      checkDbStateInit();
      return (dbState as any).githubActivities
        .filter((act: any) => act.userId === userId)
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 20);
    }
  }

  async saveActivity(userId: string, activity: any): Promise<void> {
    if (this.isOnline()) {
      const act = new GithubActivityModel({ ...activity, userId });
      await act.save();
    } else {
      checkDbStateInit();
      const state = dbState as any;
      state.githubActivities.unshift({ ...activity, userId });
      saveDb();
    }
  }

  async getAllVerifiedUsers(): Promise<any[]> {
    // Used for matching developers
    if (this.isOnline()) {
      const profiles = await GithubProfileModel.find();
      return profiles;
    } else {
      checkDbStateInit();
      return (dbState as any).githubProfiles;
    }
  }
}

export const githubRepository = new GithubRepository();
