import { githubRepository } from "./github.repository";

export class GithubSkillsService {
  async analyzeSkills(userId: string): Promise<any[]> {
    console.info(`[Skills Engine] Running algorithmic verified-skills parser for: ${userId}`);
    const repos = await githubRepository.getRepositories(userId);
    const verifieds: any[] = [];

    if (!repos || repos.length === 0) {
      return [];
    }

    // Technology Mapping config
    const techMapping = [
      { skill: "React", keywords: ["react", "frontend", "nextjs", "jsx", "tsx", "recharts"], lang: ["typescript", "javascript", "jsx", "tsx"], defaultConfidence: "Verified" },
      { skill: "Next.js", keywords: ["nextjs", "next.js", "ssr", "server-components"], lang: ["typescript", "tsx"], defaultConfidence: "Verified" },
      { skill: "TypeScript", keywords: ["typescript", "ts", "tsx"], lang: ["typescript", "tsx"], defaultConfidence: "Verified" },
      { skill: "JavaScript", keywords: ["javascript", "js", "node"], lang: ["javascript"], defaultConfidence: "Verified" },
      { skill: "Node.js", keywords: ["nodejs", "node.js", "npm", "express", "backend"], lang: ["typescript", "javascript"], defaultConfidence: "Verified" },
      { skill: "Express", keywords: ["express", "expressjs", "rest-api", "middleware"], lang: ["typescript", "javascript"], defaultConfidence: "Verified" },
      { skill: "MongoDB", keywords: ["mongodb", "mongoose", "nosql", "database"], lang: [], defaultConfidence: "Verified" },
      { skill: "PostgreSQL", keywords: ["postgresql", "postgres", "sql", "drizzle", "prisma"], lang: [], defaultConfidence: "Verified" },
      { skill: "Python", keywords: ["python", "py", "django", "fastapi", "jupyter"], lang: ["python"], defaultConfidence: "Verified" },
      { skill: "Django", keywords: ["django", "jinja"], lang: ["python"], defaultConfidence: "Verified" },
      { skill: "FastAPI", keywords: ["fastapi", "uvicorn"], lang: ["python"], defaultConfidence: "Verified" },
      { skill: "Java", keywords: ["java", "spring", "spring-boot", "maven", "gradle"], lang: ["java"], defaultConfidence: "Verified" },
      { skill: "Spring Boot", keywords: ["spring", "spring-boot"], lang: ["java"], defaultConfidence: "Verified" },
      { skill: "Go", keywords: ["go", "golang", "gin"], lang: ["go"], defaultConfidence: "Verified" },
      { skill: "Rust", keywords: ["rust", "cargo", "wasm"], lang: ["rust"], defaultConfidence: "Verified" },
      { skill: "Docker", keywords: ["docker", "dockerfile", "container"], lang: [], defaultConfidence: "Verified" },
      { skill: "Kubernetes", keywords: ["kubernetes", "k8s", "helm", "yaml"], lang: [], defaultConfidence: "Verified" },
      { skill: "AWS", keywords: ["aws", "s3", "lambda", "ec2", "cloudformation"], lang: [], defaultConfidence: "Verified" },
      { skill: "GCP", keywords: ["gcp", "cloud-run", "spanner", "google-cloud"], lang: [], defaultConfidence: "Verified" },
      { skill: "Blockchain", keywords: ["blockchain", "solidity", "ethereum", "web3", "hardhat", "ethers"], lang: ["solidity"], defaultConfidence: "Verified" },
      { skill: "Solidity", keywords: ["solidity", "erc721", "erc20", "smart-contract"], lang: ["solidity"], defaultConfidence: "Verified" },
      { skill: "Machine Learning", keywords: ["machine-learning", "ml", "tensorflow", "pytorch", "scikit-learn", "numpy", "pandas"], lang: ["python"], defaultConfidence: "Verified" },
      { skill: "AI", keywords: ["ai", "gemini", "openai", "agent", "llm", "prompt", "nlp", "rag"], lang: ["python", "typescript"], defaultConfidence: "Verified" }
    ];

    // Analyze repositories
    for (const mapping of techMapping) {
      let matchCount = 0;
      let starsScore = 0;

      for (const r of repos) {
        const titleLower = r.name.toLowerCase();
        const descLower = (r.description || "").toLowerCase();
        const langLower = (r.language || "").toLowerCase();
        const topicsNormalized = (r.topics || []).map((t: string) => t.toLowerCase());

        // Check language matching match
        const langMatch = mapping.lang.some(l => langLower === l.toLowerCase() || titleLower.endsWith(`.${l.toLowerCase()}`));
        
        // Check keywords match
        const keywordMatch = mapping.keywords.some(k => 
          titleLower.includes(k.toLowerCase()) || 
          descLower.includes(k.toLowerCase()) || 
          topicsNormalized.includes(k.toLowerCase())
        );

        if (langMatch || keywordMatch) {
          matchCount++;
          starsScore += r.stars || 0;
        }
      }

      if (matchCount > 0) {
        // Higher confidence if stars are present, or multiple repositories
        let confidence = "Verified";
        if (starsScore >= 20 || matchCount >= 3) {
          confidence = "Expert Verified";
        }

        verifieds.push({
          skillName: mapping.skill,
          confidence,
          evidenceType: "GitHub Repositories",
          evidenceCount: matchCount
        });
      }
    }

    // Save analyzed skills to database
    await githubRepository.saveVerifiedSkills(userId, verifieds);
    return verifieds;
  }
}

export const githubSkillsService = new GithubSkillsService();
