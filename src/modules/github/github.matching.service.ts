import { githubRepository } from "./github.repository";

export interface IMatchResult {
  userId: string;
  username: string;
  name: string;
  avatarUrl: string;
  rank: string;
  openSourceScore: number;
  matchPercentage: number;
  skillMatchScore: number;
  contributionMatchScore: number;
  technologyMatchScore: number;
  matchingSkills: string[];
}

export class GithubMatchingService {
  async matchDevelopersForProject(requiredSkills: string[]): Promise<IMatchResult[]> {
    console.info(`[Matching Engine] Matching developers for technologies: ${requiredSkills.join(", ")}`);
    const users = await githubRepository.getAllVerifiedUsers();
    const results: IMatchResult[] = [];

    if (!users || users.length === 0) return [];

    const normRequired = requiredSkills.map(s => s.toLowerCase().trim());

    for (const profile of users) {
      const userId = profile.userId;
      const verifiedSkills = await githubRepository.getVerifiedSkills(userId);
      const repos = await githubRepository.getRepositories(userId);

      // 1. Skill Match Score (from verified certificates / skills)
      let matchedCount = 0;
      const matchingSkills: string[] = [];

      const normVerified = verifiedSkills.map(vs => vs.skillName.toLowerCase());
      for (const skill of normRequired) {
        if (normVerified.some(v => v.includes(skill) || skill.includes(v))) {
          matchedCount++;
          const actualSkillName = verifiedSkills.find(vs => vs.skillName.toLowerCase().includes(skill) || skill.includes(vs.skillName.toLowerCase()))?.skillName || skill;
          matchingSkills.push(actualSkillName);
        }
      }

      const skillMatchScore = normRequired.length > 0 
        ? Math.floor((matchedCount / normRequired.length) * 100)
        : 70; // baseline if no targets specified

      // 2. Technology Match Score (from repo languages and tags)
      let repoMatchCount = 0;
      for (const r of repos) {
        const langLower = (r.language || "").toLowerCase();
        const topics = (r.topics || []).map((t: string) => t.toLowerCase());

        const hasLang = normRequired.some(s => langLower.includes(s) || s.includes(langLower));
        const hasTopic = normRequired.some(s => topics.some(t => t.includes(s) || s.includes(t)));

        if (hasLang || hasTopic) {
          repoMatchCount++;
        }
      }

      const technologyMatchScore = Math.min(100, Math.floor((repoMatchCount / (repos.length || 1)) * 100) + (matchedCount > 0 ? 30 : 0));

      // 3. Contribution Match Score (from open source activity index)
      const contributionMatchScore = profile.openSourceScore || 10;

      // 4. Cumulative Overall Match Percentage
      const matchPercentage = Math.min(100, Math.max(10, Math.floor(
        (skillMatchScore * 0.5) + 
        (technologyMatchScore * 0.3) + 
        (contributionMatchScore * 0.2)
      )));

      results.push({
        userId,
        username: profile.username,
        name: profile.name,
        avatarUrl: profile.avatarUrl,
        rank: profile.rank,
        openSourceScore: profile.openSourceScore || 0,
        matchPercentage,
        skillMatchScore,
        contributionMatchScore,
        technologyMatchScore,
        matchingSkills
      });
    }

    // Sort by match percentage descending
    return results.sort((a, b) => b.matchPercentage - a.matchPercentage);
  }
}

export const githubMatchingService = new GithubMatchingService();
