import { Request, Response } from "express";
import mongoose from "mongoose";
import { GoogleGenAI } from "@google/genai";
import { UserModel, ProjectModel, MentorModel, InternshipModel } from "../../services/mongodbService";
import { dbState } from "../../shared/database/dbState";
import { LoggerService } from "../../shared/logger";

let geminiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
      try {
        geminiClient = new GoogleGenAI({
          apiKey: apiKey,
          httpOptions: {
            headers: {
              "User-Agent": "aistudio-build",
            }
          }
        });
        LoggerService.info("Google GenAI client successfully authorized and initialized.");
      } catch (e: any) {
        LoggerService.warn("Failed to initialize Google GenAI SDK (using dynamic fallbacks): " + e.message);
      }
    }
  }
  return geminiClient;
}

export class AiController {
  async resumeBuilder(req: Request, res: Response) {
    try {
      const ai = getGeminiClient();
      const userProfile = dbState.user;

      const prompt = `You are a professional Startup Resume vetting tool.
Analyze this student's profile:
Name: ${userProfile.fullName}
Headline: ${userProfile.headline}
Bio: ${userProfile.bio}
Skills: ${userProfile.skills.join(", ")}
Experience: ${JSON.stringify(userProfile.experience)}
Education: ${JSON.stringify(userProfile.education)}

Analyze their resume parameters and generate:
1. ATS ATS-Score from 0 to 100 based on standard tech hiring filters.
2. Bullet points optimization: list 3 redesigned professional accomplishments in a secure key-results (X-Y-Z) format.
3. Improvement Suggestions: list 4 concrete modifications to make this resume land tech startups or corporate internships.
4. Recommended resume templates.

Respond strictly in the following JSON template format:
{
  "atsScore": 78,
  "accomplishments": [
    "Redesigned the state campus ticketing layout using React.js and Tailwind, boosting mobile interactive responsiveness by over 45% based on client profiling.",
    "Integrated live mock-database state persistence on Express.js server, cutting memory footprint during concurrent reloads by 30%."
  ],
  "structuralImprovements": [
    "Introduce quantitative business metrics (e.g., latency percentages, concurrent user limits) rather than vague role descriptions.",
    "Place technical language libraries (TypeScript, Express) immediately below your heading description to pass ATS scanners."
  ],
  "suggestedTemplates": ["Tech Minimalist", "Professional Executive", "Academic Single-Column"]
}
Only output the valid compiled JSON format. No markdown tags.`;

      if (ai) {
        try {
          const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              temperature: 0.3
            }
          });
          const clean = (response.text || "").replace(/```json/g, "").replace(/```/g, "").trim();
          return res.json(JSON.parse(clean));
        } catch (e: any) {
          LoggerService.warn("Gemini resume-builder unavailable, invoking heuristic fallback.", e);
        }
      }

      const localAts = 75 + Math.min(20, userProfile.skills.length * 3);
      res.json({
        atsScore: localAts,
        accomplishments: [
          `Spearheaded modular integration of ${userProfile.skills[0] || "Frontend frameworks"} with state-authoritative Node.js routing, achieving lag-free page updates under 120ms.`,
          `Optimized state structures across complex custom views utilizing local persistence systems, eliminating redundant database re-fetches.`,
          `Synthesized clean ${userProfile.skills.slice(0, 3).join(", ") || "Fullstack components"} adhering closely to strict SOLID conventions.`
        ],
        structuralImprovements: [
          "Include tangible KPI ratios (e.g., total active student contributors, percentage faster load times) for your project milestones.",
          "Add explicit links to your real GitHub outputs and hosted live pages adjacent to your Bachelor degree heading.",
          "Group your skill arrays into explicit tiers such as 'Languages', 'Frameworks', and 'Developer Utilities' to boost ATS scanner indices."
        ],
        suggestedTemplates: ["Tech Minimalist", "Professional Executive", "Academic Single-Column"]
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async startInterview(req: Request, res: Response) {
    try {
      const { interviewType, targetRole } = req.body;
      const userProfile = dbState.user;
      const type = interviewType || "Technical";
      const role = targetRole || "Fullstack Software Engineer";

      const prompt = `You are a Senior technical interviewer recruiting for a high-growth AI SaaS startup.
Create a single challenging, highly contextual first interview question for ${userProfile.fullName} applying for the "${role}" position.
Their key listed skills are: ${userProfile.skills.join(", ")}.
Interview category: ${type}.

If technical, focus on real engineering scenarios (e.g. system bottlenecks, security flags, concurrent queries).
If DSA, focus on practical optimization problem (e.g. caching, search bounds, queues).
If HR, focus on team collaboration conflict resolution or startup prioritization.

Respond strictly in this JSON structure:
{
  "question": "What is the primary difference between debounce and throttle, and how would you implement an offline cache mechanism to safely store student metrics?"
}
Do not include any extra text. Return only valid parsed JSON.`;

      const ai = getGeminiClient();
      if (ai) {
        try {
          const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              temperature: 0.5
            }
          });
          const clean = (response.text || "").replace(/```json/g, "").replace(/```/g, "").trim();
          return res.json(JSON.parse(clean));
        } catch (e: any) {
          LoggerService.warn("Gemini interview-start unavailable, backing up to locale questions.", e);
        }
      }

      let fallbackQ = "Explain how you would handle race conditions on an Express.js server when multiple student developers apply to the same project role at the exact same millisecond.";
      if (type === "DSA") {
        fallbackQ = "Write a highly optimized time-bound method to extract top K most frequently matched mentors from a stream of 1M session ratings.";
      } else if (type === "HR") {
        fallbackQ = "Your co-founder wants to rewrite the complete database in Rust, but the hackathon ends in 24 hours. How do you resolve this technical conflict?";
      }
      res.json({ question: fallbackQ });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async submitInterview(req: Request, res: Response) {
    try {
      const { question, userAnswer, interviewType } = req.body;
      if (!userAnswer) return res.status(400).json({ error: "Missing user answer" });

      const prompt = `You are a professional Technical Recruiter judging this interview exchange:
Question: "${question}"
User Answer: "${userAnswer}"
Interview Domain: "${interviewType || "Technical"}"

Evaluate the accuracy, clarity, and structural depth of the student's answer.
Output:
1. Evaluation Score: an integer from 0 to 100.
2. Feedback Summary: 2 bullet points of constructive criticism.
3. Exemplar Answer: A pristine model response that the student should study.

Respond strictly as JSON:
{
  "score": 85,
  "feedback": [
    "Your description of race-conditions was solid, but you missed explaining transactions or database locks explicitly.",
    "Recommend mentioning Redis lock keys as an industry standard solution to guarantee thread-safety."
  ],
  "exemplarAnswer": "A robust solution should leverage a database transaction block or implement distributed locking with Redis. In Node.js, we can execute a SELECT for UPDATE in PostgreSQL, or use a conditional document check in MongoDB to ensure atomic writes."
}
Only output the compiled JSON. No markdown wrappers.`;

      const ai = getGeminiClient();
      if (ai) {
        try {
          const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              temperature: 0.4
            }
          });
          const clean = (response.text || "").replace(/```json/g, "").replace(/```/g, "").trim();
          return res.json(JSON.parse(clean));
        } catch (e: any) {
          LoggerService.warn("Gemini interview-submit unavailable, using local evaluator.", e);
        }
      }

      const localScore = Math.min(95, Math.max(55, 45 + userAnswer.split(" ").length * 1.5));
      res.json({
        score: localScore,
        feedback: [
          "Your answer shows sound conceptual familiarity! Great job on outlining the high-level flow.",
          "To improve, explicitly outline the exact files or database commands used (e.g. Mongoose findOneAndUpdate, transaction locks)."
        ],
        exemplarAnswer: "To handle high concurrency safely, we implement atomic updates on the server level. In MongoDB, we use unique indexes or schema validation, coupled with retry locks on the Node layer."
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async careerRoadmap(req: Request, res: Response) {
    try {
      const { goal } = req.body;
      if (!goal) return res.status(400).json({ error: "Missing custom career goal directive" });

      const prompt = `You are a seasoned Silicon Valley engineering educator mapping out a career guide.
Generate a structured learning roadmap for an undergraduate student wanting to master: "${goal}".
The guide must contain EXACTLY 4 ordered stages (milestones) containing:
1. Name of Stage
2. Duration to complete (e.g. 'Weeks 1-4')
3. Core study tasks & frameworks.
4. Recommended cert / resource name.
5. Starter project assignments.
6. Recommended interview prep questions.

Respond strictly in this JSON format:
{
  "goal": "MERN Developer",
  "stages": [
    {
      "stageName": "JavaScript & DOM Foundations",
      "duration": "Weeks 1-4",
      "topics": ["Closures", "Async-Await", "Event Loops", "Fetch API"],
      "certificates": "MDN Advanced JS Tracks",
      "project": "Build an offline local storage calculator and UTC clock widget.",
      "interviewQuestion": "Can you explain the event loop and how macro-task queues are prioritized?"
    }
  ]
}
Only output the valid compiled JSON format. No markdown tags.`;

      const ai = getGeminiClient();
      if (ai) {
        try {
          const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              temperature: 0.3
            }
          });
          const clean = (response.text || "").replace(/```json/g, "").replace(/```/g, "").trim();
          return res.json(JSON.parse(clean));
        } catch (e: any) {
          LoggerService.warn("Gemini roadmap unavailable. Running fallback template.", e);
        }
      }

      const defaultRoadmap = {
        goal: goal,
        stages: [
          {
            stageName: "Frontend Craftsmanship & Design Systems",
            duration: "Weeks 1-6",
            topics: ["HTML5 Canvas", "Tailwind CSS Utility Layers", "React 19 State Gating", "TypeScript Strict Types"],
            certificates: "Meta Advanced Frontend Developer Certificate",
            project: "Design a visually high-contrast agile user profile board with direct editing flows.",
            interviewQuestion: "How does React fiber algorithm map DOM updates under selective re-renders?"
          },
          {
            stageName: "Server Side & Databases Architecture",
            duration: "Weeks 7-12",
            topics: ["Express Middleware Gating", "MongoDB Aggregation Pipelines", "Lazy Initialization", "Memory Leak Prevention"],
            certificates: "MongoDB Certified Developer Associate",
            project: "Stitch an Express backend with JSON-based file persistence and file parsing tools.",
            interviewQuestion: "What is the difference between an embedded document versus a reference relationship?"
          },
          {
            stageName: "Systems Scaling & Multi-User Real-Time Platforms",
            duration: "Weeks 13-18",
            topics: ["WebSockets / Socket.io Event Loops", "Redis caching", "Atomic updates", "JWT authentication"],
            certificates: "AWS Certified Developer - Associate",
            project: "Develop a real-time multiplayer board and message relay server supporting offline indicators.",
            interviewQuestion: "How do you scale WebSockets connections across multiple instances of Docker containers?"
          },
          {
            stageName: "Production Deployment & DevOps Pipelines",
            duration: "Weeks 19-24",
            topics: ["Docker containers", "Kubernetes cluster setups", "AWS EC2 Ingress routing", "GitHub Actions"],
            certificates: "CKA (Certified Kubernetes Administrator)",
            project: "Package full-stack web application into a Docker container and set up a multi-stage YAML CI/CD pipeline.",
            interviewQuestion: "Explain how an Nginx reverse proxy routes internal service ports seamlessly."
          }
        ]
      };
      res.json(defaultRoadmap);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async projectGenerator(req: Request, res: Response) {
    try {
      const { domain, difficulty, teamSize } = req.body;
      if (!domain) return res.status(400).json({ error: "Missing project domain" });

      const size = teamSize || 3;
      const diff = difficulty || "Intermediate";

      const prompt = `You are a veteran Startup Incubator Technical Coach.
Generate a high-fidelity startup product idea matching:
Domain: "${domain}"
Difficulty: "${diff}"
Team Size: ${size}

Outputs to create:
1. A creative Project Title and Catchy Tagline.
2. Short product summary.
3. List of 4 distinct high-impact functional modules (features).
4. Recommended technology stack (Database, Frontend, Middleware, APIs).
5. 3 developmental Milestones mapped onto a timeline.
6. A proposed Mongoose MongoDB Database schema representing the core records.

Respond strictly as JSON:
{
  "title": "EcoLogix",
  "tagline": "AI-automated supply chain carbon auditing",
  "summary": "Full overview of the solution...",
  "keyFeatures": ["Auto carbon ingestion API", "Frictionless multi-tenant dashboards"],
  "techStack": { "db": "MongoDB", "frontend": "React & Tailwind", "server": "Express", "extra": "Gemini API" },
  "milestones": [
    { "title": "Milestone 1", "timeline": "Weeks 1-2", "aim": "Setup backend routing" }
  ],
  "proposedSchema": "const AuditSchema = new Schema({ carbonSaved: Number });"
}
Only return valid, compilable JSON format.`;

      const ai = getGeminiClient();
      if (ai) {
        try {
          const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              temperature: 0.4
            }
          });
          const clean = (response.text || "").replace(/```json/g, "").replace(/```/g, "").trim();
          return res.json(JSON.parse(clean));
        } catch (e: any) {
          LoggerService.warn("Gemini project-generator unavailable, doing heuristic fallback.", e);
        }
      }

      res.json({
        title: `${domain} ProFlow`,
        tagline: `Unlocking seamless ${domain} pipelines for student hack groups.`,
        summary: `A production-level system designed to tackle critical friction points in the ${domain} ecosystem. Specially optimized for an agile team of ${size} developers.`,
        keyFeatures: [
          "Dynamic data aggregation layer with lazy-loaded modules",
          "Responsive metric dashboard integrated with SVG charting",
          "Collaborative multiplayer team sockets with notification indicators",
          "Secure credential scoping using JWT tokens and robust route guards"
        ],
        techStack: {
          db: "MongoDB & Mongoose schemas",
          frontend: "React 19 & Tailwind CSS 4",
          server: "Express & Node.js clusters",
          extra: "Gemini API Services proxy"
        },
        milestones: [
          { title: "Blueprint and Wireframe Integration", timeline: "Weeks 1-2", aim: "Establish full database schemas and layout typography models." },
          { title: "Core Modules Engineering", timeline: "Weeks 3-4", aim: "Develop the primary analytical dashboard widgets." },
          { title: "Cloud Optimization & Live Deploy", timeline: "Weeks 5-6", aim: "Containerize dependencies into production-ready images." }
        ],
        proposedSchema: `const ProfileSchema = new Schema({\n  id: String,\n  category: String,\n  metricsCollected: Array,\n  syncedAt: Date\n});`
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async aiLinkedInPost(req: Request, res: Response) {
    try {
      const { prompt } = req.body;
      if (!prompt) return res.status(400).json({ error: "Missing prompt" });

      const ai = getGeminiClient();
      if (ai) {
        try {
          const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: `You are a professional technical Career Coach and personal branding strategist.
Modify and compile the following collegiate achievement into a high-impact, highly engaging, professional LinkedIn-style post. Add relevant takeaways, bullet points, and clean hashtags. Make it inspire peers and catch the attention of tech recruiters.
Achievement details: "${prompt}"

Respond with ONLY the final post body. Avoid markdown intro headers or chatter.`,
            config: {
              temperature: 0.7
            }
          });
          return res.json({ text: response.text || "" });
        } catch (e: any) {
          LoggerService.warn("Gemini professional ai-post currently offline.", e);
        }
      }

      res.json({ text: "" });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async getRecommendations(req: Request, res: Response) {
    try {
      const ai = getGeminiClient();
      const student = mongoose.connection.readyState === 1
        ? (await UserModel.findOne({ firebaseUid: dbState.user.id }) || dbState.user)
        : dbState.user;
      
      const dbProjects = mongoose.connection.readyState === 1
        ? await ProjectModel.find().limit(10)
        : (dbState.projects || []).slice(0, 10);
        
      const dbMentors = mongoose.connection.readyState === 1
        ? await MentorModel.find().limit(10)
        : (dbState.mentors || []).slice(0, 10);
        
      const dbInternships = mongoose.connection.readyState === 1
        ? await InternshipModel.find().limit(10)
        : (dbState.internships || []).slice(0, 10);

      const projectListStr = dbProjects.map(p => `- [id: ${p._id ? p._id.toString() : (p as any).id}] "${p.title}": Tagline: "${p.tagline}". Key technologies required: ${(p.skillsNeeded || []).join(", ")}`).join("\n");
      const mentorListStr = dbMentors.map(m => `- [id: ${m._id ? m._id.toString() : (m as any).id}] "${m.fullName}": Company: "${m.company || "Google"}". Expertise: ${(m.expertise || []).join(", ")}`).join("\n");
      const internshipsListStr = dbInternships.map(i => `- [id: ${i._id ? i._id.toString() : (i as any).id}] "${i.title}": Company: ${i.companyName}. Required: ${(i.skillsRequired || []).join(", ")}`).join("\n");

      const prompt = `You are the core AI Recommendation Engine of SkillCollab.
A student named "${student.fullName}" has the following skills: ${student.skills.join(", ")}.
Their career bio says: "${student.bio}".

Here are the active items available in our SaaS ecosystem:
PROJECTS:
${projectListStr}

MENTORS:
${mentorListStr}

INTERNSHIPS:
${internshipsListStr}

Use your matching scoring algorithm to generate personal recommendations.
For each item, provide:
1. ID of the matching item.
2. Suitability Match Percentage (an integer 0-100) based on skill overlap and interest alignment.
3. A short, highly encouraging "Why we recommend this", addressing the student by name (${student.fullName}) and describing how their skills (like ${student.skills.slice(0, 3).join(", ")}) make them a good fit.

You MUST respond strictly in the following JSON schema format:
{
  "recommendations": {
    "projects": [
      { "id": "proj_1", "matchPercentage": 92, "reason": "We recommend Rohans AI Study Buddy because Ashish's skills in React.js and Node.js will let you easily craft the LLM streaming..." }
    ],
    "mentors": [
      { "id": "ment_1", "matchPercentage": 88, "reason": "Nitin Kamath is a perfect mentor search for Ashish as your Go, Python and React frameworks match their Cloud and engineering career experience..." }
    ],
    "internships": [
      { "id": "intern_1", "matchPercentage": 95, "reason": "TechStack Solutions seeks React.js, Node.js, and MongoDB - which represent Ashish's strongest full-stack tools..." }
    ]
  }
}
Respond with only valid, parsed JSON. Do not include markdown wraps or code block selectors.`;

      if (ai) {
        try {
          const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",
            contents: prompt,
            config: {
              responseMimeType: "application/json",
              temperature: 0.2
            }
          });
          
          const rawText = response.text || "";
          const cleanJsonStr = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
          const parsedData = JSON.parse(cleanJsonStr);
          return res.json(parsedData);
        } catch (geminiError: any) {
          LoggerService.warn("Gemini recommendations API limited, running local heuristic matcher.", geminiError);
        }
      }

      const projectRecs = dbProjects.map(p => {
        const skillsNeeded = p.skillsNeeded || [];
        const matches = skillsNeeded.filter(sk => student.skills.some(usk => usk.toLowerCase() === sk.toLowerCase()));
        const overlapRate = skillsNeeded.length > 0 ? (matches.length / skillsNeeded.length) : 0.5;
        const pct = Math.min(95, Math.max(50, Math.round(55 + overlapRate * 40)));
        return {
          id: p._id ? p._id.toString() : (p as any).id,
          matchPercentage: pct,
          reason: `${student.fullName}, your experience with ${matches.join(", ") || "full-stack UI layers"} perfectly matches the requirements of "${p.title}". Joining this team will grow your portfolio!`
        };
      }).sort((a, b) => b.matchPercentage - a.matchPercentage);

      const mentorRecs = dbMentors.map(m => {
        const expertise = m.expertise || [];
        const matches = expertise.filter(e => student.skills.some(usk => e.toLowerCase().includes(usk.toLowerCase()) || usk.toLowerCase().includes(e.toLowerCase())));
        const pct = Math.min(95, Math.max(50, Math.round(60 + (matches.length / (expertise.length || 1)) * 35)));
        return {
          id: m._id ? m._id.toString() : (m as any).id,
          matchPercentage: pct,
          reason: `Connect with ${m.fullName} to receive feedback on your ${student.skills.slice(0, 3).join(", ")} skills and mapping out your junior-year industry applications.`
        };
      });

      const internshipRecs = dbInternships.map(i => {
        const skillsRequired = i.skillsRequired || [];
        const matches = skillsRequired.filter(s => student.skills.some(usk => usk.toLowerCase() === s.toLowerCase()));
        const pct = Math.min(98, Math.max(45, Math.round(50 + (matches.length / (skillsRequired.length || 1)) * 48)));
        return {
          id: i._id ? i._id.toString() : (i as any).id,
          matchPercentage: pct,
          reason: `Job match: ${i.companyName} is recruiting for skills you possess (${matches.join(", ") || "Fullstack web tooling"}). Secure your slot today by sending your resume.`
        };
      });

      res.json({
        recommendations: {
          projects: projectRecs,
          mentors: mentorRecs,
          internships: internshipRecs
        }
      });
    } catch (error: any) {
      LoggerService.error("Fatal recommendations fail:", error);
      res.status(500).json({ error: "Recommendation Engine exception: " + error.message });
    }
  }
}
export const aiController = new AiController();
