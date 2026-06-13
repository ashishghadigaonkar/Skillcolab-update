/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import admin from "firebase-admin";
import mongoose from "mongoose";
import { 
  MongoDBService, UserModel, ProjectModel, TeamModel, ApplicationModel, 
  HackathonModel, InternshipModel, MentorModel, MentorBookingModel, 
  ChatModel, MessageModel, NotificationModel, StartupIdeaModel, 
  VerificationRequestModel, SubscriptionModel, PaymentModel, InvoiceModel, AuditLogModel,
  FollowerModel
} from "./src/services/mongodbService";
import { 
  User, UserRole, Project, Team, TeamApplication, 
  Hackathon, InternshipPost, Mentor, MentorshipSession, 
  ChatThread, Notification, SystemAnalytics, FollowerRelation
} from "./src/types";

// Initialize Gemini client lazy-loaded
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
              'User-Agent': 'aistudio-build',
            }
          }
        });
      } catch (e: any) {
        console.warn("Failed to initialize Google GenAI SDK (using silent fallback):", e?.message || e);
      }
    }
  }
  return geminiClient;
}

const app = express();
const PORT = 3000;

app.use(express.json());

// Path to persist mock data across HMR reloads
const DB_FILE_PATH = path.join(process.cwd(), "src", "mock_db_store.json");

// Define Initial Seed Data
const DEFAULT_USER: User = {
  id: "student_ashish",
  email: "ashishghadigaonkar85@gmail.com",
  fullName: "Ashish Ghadigaonkar",
  role: UserRole.STUDENT,
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
  coverUrl: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?auto=format&fit=crop&w=800&q=80",
  headline: "Computer Science Sophomore | Budding Fullstack & ML Engineer",
  bio: "Passionate CS major interested in Fullstack Web Development, Next-generation LLM APIs, and Cloud Architectures. Eager to collaborate on decentralized web projects and participate in smart-campus hackathons.",
  location: "Mumbai, India",
  skills: ["React.js", "Node.js", "Express.js", "TypeScript", "Tailwind CSS", "MongoDB", "Python"],
  education: [
    {
      institution: "State Technological University",
      degree: "Bachelor of Technology",
      fieldOfStudy: "Computer Science and Engineering",
      startYear: 2024,
      endYear: 2028
    }
  ],
  experience: [
    {
      title: "Open Source Contributor",
      company: "Hacktoberfest & Local Web Club",
      location: "Remote",
      startDate: "Oct 2025",
      endDate: "Dec 2025",
      description: "Contributed to college utility projects. Developed accessible and responsive Tailwind UI pages."
    }
  ],
  certifications: ["AWS Certified Cloud Practitioner", "Google Advanced React Certificate"],
  achievements: ["1st Place - Local Campus Hackathon 2025", "Dean's List for Academic Excellence"],
  resumeUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
  links: {
    github: "https://github.com/ashishgh",
    linkedin: "https://linkedin.com/in/ashishgh",
    portfolio: "https://ashishportfolio.dev"
  },
  reputationPoints: 450,
  badges: ["React Novice", "Team Player", "Code Wrangler"],
  connectionsCount: 82,
  followersCount: 120
};

const DEFAULT_PROJECTS: Project[] = [
  {
    id: "proj_1",
    title: "AI Study Buddy",
    tagline: "An automated peer learning and note-summarization portal powered by LLMs.",
    description: "A centralized platform where university students can form instantaneous study clusters, share lecture audio notes, and receive automated, contextual quiz cards. We are scaling the backend to handle concurrent summaries.",
    creatorId: "user_rohan",
    creatorName: "Rohan Sharma",
    creatorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80",
    skillsNeeded: ["Node.js", "React.js", "Gemini API", "Vector Embeddings"],
    tags: ["Artificial Intelligence", "EdTech", "Web App"],
    difficulty: "Advanced",
    status: "Recruiting",
    teamSizeLimit: 4,
    currentTeamSize: 2,
    createdAt: "2026-06-01T08:00:00Z",
    milestones: [
      { id: "m1", title: "API Integrations Setup", description: "Hook up Gemini LLM streaming APIs on Express backend", status: "Done", dueDate: "2026-06-15" },
      { id: "m2", title: "Shared Workspace Dashboard", description: "Create collaborative multi-editor pages for live notes", status: "Pending", dueDate: "2026-06-30" },
      { id: "m3", title: "Beta Usability Testing", description: "Compile user reviews and run performance profiling", status: "Pending", dueDate: "2026-07-15" }
    ],
    attachments: [
      { name: "Project Pitch Deck.pdf", url: "#" },
      { name: "API Architecture Wireframe", url: "#" }
    ]
  },
  {
    id: "proj_2",
    title: "EcoCampus Carbon Tracker",
    tagline: "Track and gamify real-time carbon emissions in regional university hubs.",
    description: "EcoCampus allows students to log sustainable deeds (carpooling, using solar outlets, green canteen choices) and dynamically outputs real-time personal footprint charts. Teaming up with the College Eco-club to build utility integrations.",
    creatorId: "user_priya",
    creatorName: "Priya Patel",
    creatorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80",
    skillsNeeded: ["React.js", "Tailwind CSS", "Data Visualizations", "MongoDB"],
    tags: ["Sustainability", "Gamification", "D3.js"],
    difficulty: "Intermediate",
    status: "Recruiting",
    teamSizeLimit: 3,
    currentTeamSize: 1,
    createdAt: "2026-06-05T12:00:00Z",
    milestones: [
      { id: "mc1", title: "Eco-deeds Logging Form", description: "Build forms supporting standard touch inputs", status: "Done", dueDate: "2026-06-12" },
      { id: "mc2", title: "D3 Data Visualization Integration", description: "Map campus carbon indices", status: "Pending", dueDate: "2026-06-25" }
    ],
    attachments: []
  },
  {
    id: "proj_3",
    title: "Decentralized Credential Locker",
    tagline: "Secure tamper-proof college degree validation using scalable ledgers.",
    description: "A cryptographically secure system verifying university credits and micro-certifications instantly. We have established localized smart contracts and need a frontend engineer who understands robust responsive UI layers to stitch things up.",
    creatorId: "user_kabir",
    creatorName: "Kabir Singh",
    creatorAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80",
    skillsNeeded: ["TypeScript", "Solidity", "Node.js", "Security Standards"],
    tags: ["Blockchain", "Credentials", "Security"],
    difficulty: "Advanced",
    status: "Recruiting",
    teamSizeLimit: 5,
    currentTeamSize: 2,
    createdAt: "2026-06-10T10:30:00Z",
    milestones: [
      { id: "md1", title: "Contract Testing", description: "Execute gas optimization trials on private network", status: "Done", dueDate: "2026-06-10" },
      { id: "md2", title: "Express Middleware proxy gating", description: "Design cryptographic token validation routing", status: "Pending", dueDate: "2026-06-28" }
    ]
  }
];

const DEFAULT_TEAMS: Team[] = [
  {
    id: "team_1",
    projectId: "proj_1",
    projectTitle: "AI Study Buddy",
    leaderId: "user_rohan",
    members: [
      { userId: "user_rohan", fullName: "Rohan Sharma", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80", role: "Backend Developer & PM", joinedAt: "2026-06-01T08:00:00Z" },
      { userId: "user_sneha", fullName: "Sneha Nair", avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100&q=80", role: "UI/UX Designer", joinedAt: "2026-06-02T11:00:00Z" }
    ],
    invitees: []
  },
  {
    id: "team_2",
    projectId: "proj_2",
    projectTitle: "EcoCampus Carbon Tracker",
    leaderId: "user_priya",
    members: [
      { userId: "user_priya", fullName: "Priya Patel", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80", role: "Fullstack Lead", joinedAt: "2026-06-05T12:00:00Z" }
    ],
    invitees: []
  },
  {
    id: "team_3",
    projectId: "proj_3",
    projectTitle: "Decentralized Credential Locker",
    leaderId: "user_kabir",
    members: [
      { userId: "user_kabir", fullName: "Kabir Singh", avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80", role: "Network Architect", joinedAt: "2026-06-10T10:30:00Z" },
      { userId: "user_dev", fullName: "Dev Datta", avatarUrl: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=100&h=100&q=80", role: "Solidity Developer", joinedAt: "2026-06-11T14:00:00Z" }
    ],
    invitees: []
  }
];

const DEFAULT_APPLICATIONS: TeamApplication[] = [
  {
    id: "app_1",
    projectId: "proj_1",
    projectTitle: "AI Study Buddy",
    applicantId: "user_ankit",
    applicantName: "Ankit Jha",
    applicantAvatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=100&h=100&q=80",
    applicantHeadline: "Python Scripting Enthusiast | Devops Explorer",
    applicantSkills: ["Python", "FastAPI", "Docker", "Git"],
    requestedRole: "AI / Data Engineer",
    coverLetter: "I have experience setting up secure API pathways. Your project is exactly the kind of smart app I want to help deploy. I am familiar with the modern GenAI libraries.",
    status: "Pending",
    createdAt: "2026-06-08T09:12:00Z"
  }
];

const DEFAULT_HACKATHONS: Hackathon[] = [
  {
    id: "hack_1",
    title: "Google AI Smart Campus 2026",
    bannerUrl: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
    organizer: "Google Developer Student Clubs (GDSC)",
    description: "Build innovative cloud solutions or agentic software to improve regional student workflows, class operations, student mental health, safety, or study ecosystems. Projects using Google GenAI APIs will receive special credit awards.",
    startDate: "2026-06-18T00:00:00Z",
    endDate: "2026-06-25T23:59:59Z",
    prizePool: "INR 500,000 + Cloud Credits",
    categories: ["Artificial Intelligence", "Smart Utilities", "Campus Governance"],
    status: "Active",
    registeredTeamsCount: 42,
    rules: "1. Open to enrolled college students only.\n2. Teams can range from 1 to 4 individuals.\n3. Implement a web or mobile working layout.\n4. AI components must run safely in container boundaries.",
    submissions: [
      {
        teamId: "team_1",
        teamName: "Neural Learners",
        projectTitle: "AI Study Buddy",
        demoUrl: "https://studybuddy-demo.ai",
        githubUrl: "https://github.com/rohansh/ai-study-buddy",
        score: 94
      }
    ]
  },
  {
    id: "hack_2",
    title: "Global Web3 Sustainability Hackathon",
    bannerUrl: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
    organizer: "Ethereum India Foundation",
    description: "A digital convention challenging developers to craft low-overhead web smart systems supporting green indices, regional waste-management networks, or token economics for conscious energy consumption.",
    startDate: "2026-07-05T00:00:00Z",
    endDate: "2026-07-12T23:59:59Z",
    prizePool: "USD 12,000 + Developer Mentorship",
    categories: ["GreenTech", "Blockchain", "DApp Challenge"],
    status: "Upcoming",
    registeredTeamsCount: 18,
    rules: "1. All smart contracts must be verifiable on-chain.\n2. Visual tracking charts are mandatory.",
    submissions: []
  }
];

const DEFAULT_INTERNSHIPS: InternshipPost[] = [
  {
    id: "intern_1",
    title: "Full-Stack Developer Intern",
    companyName: "TechStack Solutions",
    companyLogo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=100&h=100&q=80",
    location: "Mumbai, India",
    type: "Hybrid",
    duration: "4 Months",
    stipend: "INR 25,000 / month",
    skillsRequired: ["React.js", "Express.js", "MongoDB", "Node.js"],
    description: "Join our core services squad. You will take part in building robust high-throughput responsive portals for enterprise client onboarding. You will be paired with an engineering mentor to build actual web telemetry dashboards.",
    applyBy: "2026-06-25",
    applicantsCount: 3,
    applicants: [
      {
        userId: "user_sneha",
        fullName: "Sneha Nair",
        avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100&q=80",
        appliedAt: "2026-06-11T09:00:00Z",
        status: "Reviewing"
      }
    ]
  },
  {
    id: "intern_2",
    title: "AI Engineer Intern",
    companyName: "Google Cloud Partner Guild",
    companyLogo: "https://images.unsplash.com/photo-1573804633927-bfcbcd909acd?auto=format&fit=crop&w=100&h=100&q=80",
    location: "Bangalore, India",
    type: "Remote",
    duration: "6 Months",
    stipend: "INR 45,000 / month",
    skillsRequired: ["Python", "TensorFlow", "Gemini API", "Vector Databases"],
    description: "Seeking a sophomore or junior student who is comfortable with modern LLM fine-tuning, retrieval techniques (RAG), and prompt engineering parameters. Help us deploy lightweight automation pipelines in sandboxed developer suites.",
    applyBy: "2026-07-01",
    applicantsCount: 0,
    applicants: []
  }
];

const DEFAULT_MENTORS: Mentor[] = [
  {
    id: "ment_1",
    userId: "mentor_nitin",
    fullName: "Nitin Kamath",
    avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&h=150&q=80",
    company: "Google Cloud",
    role: "Senior Engineering Manager",
    expertise: ["Cloud Arch", "Go/Rust Systems", "MLOps", "Career Guidance"],
    biography: "Ex-Meta, Ex-Google Tech Lead. Enjoys bootstrapping architecture modules, talking about scaling bottlenecks, reviewing system diagrams, and reviewing CV strategies for Big Tech applications.",
    rating: 4.9,
    reviewCount: 38,
    pricing: "Free for students",
    availability: [
      { day: "Monday", slots: ["4:30 PM", "5:00 PM"] },
      { day: "Thursday", slots: ["2:00 PM", "3:00 PM"] }
    ],
    reviews: [
      { id: "rev_1", reviewerName: "Rohan Sharma", rating: 5, comment: "Amazing session! Nitin diagnosed our database index bottleneck in 10 minutes and offered great references.", createdAt: "2026-05-20" }
    ]
  },
  {
    id: "ment_2",
    userId: "mentor_ayesha",
    fullName: "Ayesha Qureshi",
    avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=150&h=150&q=80",
    company: "Stripe",
    role: "Lead Software Architect",
    expertise: ["API Protocol Design", "React & Frontend Architecture", "Fintech Scaling"],
    biography: "Passionate about fullstack engineering, security middleware, and micro-frontends. Regular open-source organizer who loves helping students deploy their first production SaaS widgets.",
    rating: 4.8,
    reviewCount: 22,
    pricing: "$10/hr (Free session trials available)",
    availability: [
      { day: "Wednesday", slots: ["10:00 AM", "11:30 AM"] },
      { day: "Friday", slots: ["3:30 PM", "4:30 PM"] }
    ],
    reviews: [
      { id: "rev_2", reviewerName: "Sneha Nair", rating: 5, comment: "Extremely helpful feedback on my React Hook logic and Redux-alternative state design.", createdAt: "2026-05-25" }
    ]
  }
];

const DEFAULT_SESSIONS: MentorshipSession[] = [
  {
    id: "sess_1",
    mentorId: "ment_1",
    mentorName: "Nitin Kamath",
    mentorAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&h=150&q=80",
    menteeId: "student_ashish",
    menteeName: "Ashish Ghadigaonkar",
    topic: "Resume Structuring & Web API Design Validation",
    date: "2026-06-15",
    timeSlot: "4:30 PM",
    status: "Scheduled",
    meetingLink: "https://meet.google.com/abc-defg-hij"
  }
];

const DEFAULT_CHATS: ChatThread[] = [
  {
    id: "proj_1",
    title: "AI Study Buddy - Team",
    avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=100&h=100&q=80",
    type: "Project",
    lastMessage: "Rohan: Just updated the backend server mock configuration.",
    lastMessageTime: "2 hours ago",
    unreadCount: 0,
    messages: [
      { id: "m_1", senderId: "user_sneha", senderName: "Sneha Nair", senderAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100&q=80", content: "Hi team! I uploaded the draft wireframes for our dashboard layouts.", timestamp: "10:15 AM" },
      { id: "m_2", senderId: "user_rohan", senderName: "Rohan Sharma", senderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80", content: "Awesome, they look crisp. I'm now finishing up the authentication schema models. Just updated the backend server mock configuration.", timestamp: "11:20 AM" }
    ]
  },
  {
    id: "mentor_nitin",
    title: "Nitin Kamath (Google)",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&h=150&q=80",
    type: "Direct",
    lastMessage: "Nitin: Looking forward to reviewing your portfolio live on Monday!",
    lastMessageTime: "Yesterday",
    unreadCount: 1,
    messages: [
      { id: "m_a1", senderId: "student_ashish", senderName: "Ashish Ghadigaonkar", senderAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80", content: "Hello Nitin, I scheduled our layout review. I am mainly stuck on micro-service telemetry structures.", timestamp: "06:10 PM" },
      { id: "m_a2", senderId: "mentor_nitin", senderName: "Nitin Kamath", senderAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&h=150&q=80", content: "No problem. We will cover cloud-watch logging and scalable file store proxies. Looking forward to reviewing your portfolio live on Monday!", timestamp: "07:30 PM" }
    ]
  }
];

const DEFAULT_NOTIFICATIONS: Notification[] = [
  {
    id: "nt_1",
    userId: "student_ashish",
    title: "Mentorship Session Scheduled",
    message: "Your session with Nitin Kamath from Google Cloud is approved for Monday June 15.",
    type: "Update",
    read: false,
    createdAt: "2026-06-11T16:00:00Z"
  },
  {
    id: "nt_2",
    userId: "student_ashish",
    title: "New Hackathon Announced",
    message: "Google AI Smart Campus 2026 has opened registrations, with over 5L INR in prizes.",
    type: "Update",
    read: true,
    createdAt: "2026-06-08T10:00:00Z"
  }
];

const DEFAULT_ANALYTICS: SystemAnalytics = {
  dau: 1540,
  mau: 24800,
  activeProjects: 312,
  teamCreationRate: 85,
  internshipApplications: 1420,
  skillsFrequency: [
    { name: "ReactJS", count: 870 },
    { name: "NodeJS", count: 650 },
    { name: "Python", count: 540 },
    { name: "ML Engine", count: 420 },
    { name: "Tailwind", count: 910 }
  ]
};

const DEFAULT_CHANNEL_MESSAGES: Record<string, any[]> = {
  "gen_collab": [
    {
      id: "msg_collab_1",
      channelId: "gen_collab",
      senderName: "Sneha Nair",
      senderAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100&q=80",
      content: "Hi team! I uploaded the draft wireframes for our dashboard layouts. Check the design specs in Figma!",
      createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
    },
    {
      id: "msg_collab_2",
      channelId: "gen_collab",
      senderName: "Rohan Sharma",
      senderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80",
      content: "Amazing, they look crisp. I'm now finishing up the authentication schema models. Just updated the backend server mock configuration.",
      createdAt: new Date(Date.now() - 3600000).toISOString()
    }
  ],
  "gdsc_general": [
    {
      id: "msg_gdsc_1",
      channelId: "gdsc_general",
      senderName: "Rahul Dev (Lead Dev)",
      senderAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
      content: "Welcome everyone to GDSC Campus Hackathon! Submissions deadline is tonight, team!",
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
    }
  ],
  "stripe_ops": [
    {
      id: "msg_stripe_1",
      channelId: "stripe_ops",
      senderName: "Ayesha Qureshi (Stripe)",
      senderAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100&q=80",
      content: "API credentials set in secrets tab. Secure channel established with Stripe Connect mockup endpoints.",
      createdAt: new Date(Date.now() - 3600000 * 6).toISOString()
    }
  ],
  "dm_ayesha": [
    {
      id: "msg_ayesha_1",
      channelId: "dm_ayesha",
      senderName: "Ayesha Qureshi (Stripe)",
      senderAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100&q=80",
      content: "Sure, let's connect tomorrow morning. Awesome sessions yesterday, Ashish.",
      createdAt: new Date(Date.now() - 3600000 * 10).toISOString()
    }
  ],
  "dm_nitin": [
    {
      id: "msg_nitin_1",
      channelId: "dm_nitin",
      senderName: "Nitin Kamath (Google)",
      senderAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&h=150&q=80",
      content: "Your ML model looks well-scoped. Let's schedule a portfolio review on Monday.",
      createdAt: new Date(Date.now() - 3600000 * 20).toISOString()
    }
  ]
};

// Database state container
let dbState = {
  user: DEFAULT_USER,
  projects: DEFAULT_PROJECTS,
  teams: DEFAULT_TEAMS,
  applications: DEFAULT_APPLICATIONS,
  hackathons: DEFAULT_HACKATHONS,
  internships: DEFAULT_INTERNSHIPS,
  mentors: DEFAULT_MENTORS,
  sessions: DEFAULT_SESSIONS,
  chats: DEFAULT_CHATS,
  notifications: DEFAULT_NOTIFICATIONS,
  analytics: DEFAULT_ANALYTICS,
  channelMessages: DEFAULT_CHANNEL_MESSAGES as Record<string, any[]>,
  followers: [
    { id: "follow_1", followerId: "student_ashish", followingId: "comp_microsoft", followingType: "company" },
    { id: "follow_2", followerId: "student_ashish", followingId: "mentor_nitin", followingType: "mentor" },
    { id: "follow_3", followerId: "student_ashish", followingId: "mentor_ayesha", followingType: "mentor" }
  ] as FollowerRelation[]
};

// Load database state from disk if exists
function loadDb() {
  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const dataStr = fs.readFileSync(DB_FILE_PATH, "utf-8");
      dbState = JSON.parse(dataStr);
      if (!dbState.channelMessages) {
        dbState.channelMessages = JSON.parse(JSON.stringify(DEFAULT_CHANNEL_MESSAGES));
        saveDb();
      }
      if (!dbState.followers) {
        dbState.followers = [
          { id: "follow_1", followerId: "student_ashish", followingId: "comp_microsoft", followingType: "company" },
          { id: "follow_2", followerId: "student_ashish", followingId: "mentor_nitin", followingType: "mentor" },
          { id: "follow_3", followerId: "student_ashish", followingId: "mentor_ayesha", followingType: "mentor" }
        ];
        saveDb();
      }
      console.log("Mock database successfully loaded from:", DB_FILE_PATH);
    } else {
      saveDb(); // Seed initial database write
    }
  } catch (e) {
    console.error("Error reading mock database:", e);
  }
}

// Save database state to disk
function saveDb() {
  try {
    const parentDir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(dbState, null, 2), "utf-8");
  } catch (e) {
    console.error("Error writing mock database states:", e);
  }
}

// Initialize mock DB container
loadDb();


// API Core Endpoints

// 1. Auth Simulation Routing
app.post("/api/auth/register", (req, res) => {
  const { email, fullName, role } = req.body;
  dbState.user = {
    ...DEFAULT_USER,
    email: email || DEFAULT_USER.email,
    fullName: fullName || DEFAULT_USER.fullName,
    role: (role as UserRole) || UserRole.STUDENT,
  };
  saveDb();
  res.json({ success: true, message: "Registered", user: dbState.user, token: "jwt_tok_stub_123" });
});

app.post("/api/auth/login", (req, res) => {
  const { email } = req.body;
  if (email) {
    dbState.user.email = email;
    saveDb();
  }
  res.json({ success: true, user: dbState.user, token: "jwt_tok_stub_123" });
});

app.post("/api/auth/logout", (req, res) => {
  res.json({ success: true, message: "Logged out safely" });
});

// Lazy Firebase Admin SDK Initializer
let isFirebaseAdminInitialized = false;
let firebaseAdminApp: any = null;

function initializeFirebaseAdmin() {
  if (isFirebaseAdminInitialized) return firebaseAdminApp;
  
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

  if (projectId && privateKey && clientEmail) {
    try {
      firebaseAdminApp = admin.initializeApp({
        credential: (admin as any).credential.cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
      isFirebaseAdminInitialized = true;
      console.info("[FirebaseAdmin] Server SDK lazy initialized for Firebase Project");
    } catch (e: any) {
      console.warn("[FirebaseAdmin] Server SDK lazy init failed with warning:", e?.message);
    }
  } else {
    console.info("[FirebaseAdmin] No server side credentials available (FIREBASE_PROJECT_ID/CLIENT_EMAIL/PRIVATE_KEY). Simulation fallback enabled.");
  }
  return firebaseAdminApp;
}

// 1b. Real Firebase Auth Sync Hook to MongoDB
app.post("/api/auth/sync", async (req, res) => {
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
        console.info(`[AuthSync] Security token validated for UID: ${uid}`);
      } catch (e: any) {
        console.error(`[AuthSync] Token signature verification failed:`, e?.message);
        return res.status(401).json({ error: "Invalid Firebase session verification token." });
      }
    }
  }

  if (mongoose.connection.readyState !== 1) {
    dbState.user = {
      ...dbState.user,
      id: uid,
      email: email || dbState.user.email,
      fullName: fullName || dbState.user.fullName,
      avatarUrl: avatarUrl || dbState.user.avatarUrl
    };
    saveDb();
    return res.json({ success: true, user: dbState.user });
  }

  try {
    const mongoService = MongoDBService.getInstance();
    const syncedDoc = await mongoService.syncUserWithFirebase(uid, {
      email,
      fullName,
      avatarUrl
    });

    dbState.user = {
      id: syncedDoc.firebaseUid,
      email: syncedDoc.email,
      fullName: syncedDoc.fullName,
      role: syncedDoc.role,
      avatarUrl: syncedDoc.avatarUrl,
      coverUrl: syncedDoc.coverUrl,
      headline: syncedDoc.headline,
      bio: syncedDoc.bio,
      location: syncedDoc.location,
      skills: syncedDoc.skills,
      education: syncedDoc.education,
      experience: syncedDoc.experience,
      certifications: syncedDoc.certifications,
      achievements: syncedDoc.achievements,
      resumeUrl: syncedDoc.resumeUrl,
      links: syncedDoc.links,
      reputationPoints: syncedDoc.reputationPoints,
      badges: syncedDoc.badges,
      connectionsCount: syncedDoc.connectionsCount,
      followersCount: syncedDoc.followersCount
    };
    saveDb();

    console.info(`[AuthSync] MongoDB sync complete for username: ${syncedDoc.fullName}`);
    return res.json({ success: true, user: dbState.user });
  } catch (err: any) {
    console.error("[AuthSync] MongoDB matching synchronization failure:", err);
    return res.status(500).json({ error: "Persistent storage synchronization failure: " + err.message });
  }
});

// 2. Profile APIs
app.get("/api/users/me", (req, res) => {
  res.json(dbState.user);
});

app.put("/api/users/profile", async (req, res) => {
  const { fullName, headline, bio, skills, education, experience, links } = req.body;
  
  if (fullName !== undefined) dbState.user.fullName = fullName;
  if (headline !== undefined) dbState.user.headline = headline;
  if (bio !== undefined) dbState.user.bio = bio;
  if (skills !== undefined) dbState.user.skills = skills;
  if (education !== undefined) dbState.user.education = education;
  if (experience !== undefined) dbState.user.experience = experience;
  if (links !== undefined) dbState.user.links = { ...dbState.user.links, ...links };
  
  saveDb();

  // Also update inside the live MongoDB user record if signed in and database is live
  if (mongoose.connection.readyState === 1 && dbState.user && dbState.user.id) {
    try {
      await UserModel.updateOne(
        { firebaseUid: dbState.user.id },
        {
          $set: {
            fullName: dbState.user.fullName,
            headline: dbState.user.headline,
            bio: dbState.user.bio,
            skills: dbState.user.skills,
            education: dbState.user.education,
            experience: dbState.user.experience,
            links: dbState.user.links,
          }
        }
      );
      console.info(`[DatabaseUpdate] Synced profile changes to MongoDB user: ${dbState.user.fullName}`);
    } catch (err: any) {
      console.warn("[DatabaseUpdate] Warning updating MongoDB profile document:", err?.message);
    }
  }
  
  res.json({ success: true, user: dbState.user });
});

// 3. Projects Marketplace APIs
app.get("/api/projects", async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.json(dbState.projects);
  }

  try {
    const projects = await ProjectModel.find().sort({ createdAt: -1 });
    const mappedProjects = projects.map(p => ({
      id: p._id.toString(),
      title: p.title,
      tagline: p.tagline,
      description: p.description,
      creatorId: p.creatorId,
      creatorName: p.creatorName,
      creatorAvatar: p.creatorAvatar,
      skillsNeeded: p.skillsNeeded,
      tags: p.tags,
      difficulty: p.difficulty,
      status: p.status,
      teamSizeLimit: p.teamSizeLimit,
      currentTeamSize: p.currentTeamSize,
      createdAt: p.createdAt.toISOString(),
      milestones: p.milestones,
      attachments: p.attachments
    }));
    res.json(mappedProjects);
  } catch (err: any) {
    console.error("[Projects] Error reading from MongoDB:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/projects", async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    const { title, tagline, description, skillsNeeded, tags, difficulty, teamSizeLimit } = req.body;
    if (!title || !tagline || !description) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const projectId = `proj_${Date.now()}`;
    const newProject: Project = {
      id: projectId,
      title,
      tagline,
      description,
      creatorId: dbState.user.id || "student_ashish",
      creatorName: dbState.user.fullName || "Ashish Ghadigaonkar",
      creatorAvatar: dbState.user.avatarUrl || "",
      skillsNeeded: skillsNeeded || [],
      tags: tags || [],
      difficulty: difficulty || "Intermediate",
      status: "Recruiting",
      teamSizeLimit: Number(teamSizeLimit) || 4,
      currentTeamSize: 1,
      createdAt: new Date().toISOString(),
      milestones: [
        { id: `ml_1`, title: "Project Inception", description: "Define task schedules and system designs.", status: "Pending", dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10) }
      ],
      attachments: []
    };
    dbState.projects.unshift(newProject);
    
    const newTeam: Team = {
      id: `team_${Date.now()}`,
      projectId,
      projectTitle: title,
      leaderId: dbState.user.id || "student_ashish",
      members: [
        {
          userId: dbState.user.id || "student_ashish",
          fullName: dbState.user.fullName || "Ashish Ghadigaonkar",
          avatarUrl: dbState.user.avatarUrl || "",
          role: "Project Lead / Entrepreneur",
          joinedAt: new Date().toISOString()
        }
      ],
      invitees: []
    };
    dbState.teams.unshift(newTeam);

    const newChat: ChatThread = {
      id: projectId,
      title: `${title} - Workspace`,
      avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=100&h=100&q=80",
      type: "Project" as const,
      lastMessage: "System: Team channel created.",
      lastMessageTime: new Date().toISOString(),
      unreadCount: 0,
      messages: []
    };
    dbState.chats.unshift(newChat);
    saveDb();
    return res.json({ success: true, project: newProject, team: newTeam });
  }

  try {
    const { title, tagline, description, skillsNeeded, tags, difficulty, teamSizeLimit } = req.body;
    
    if (!title || !tagline || !description) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newProjectDoc = new ProjectModel({
      title,
      tagline,
      description,
      creatorId: dbState.user.id || "student_ashish",
      creatorName: dbState.user.fullName || "Ashish Ghadigaonkar",
      creatorAvatar: dbState.user.avatarUrl || "",
      skillsNeeded: skillsNeeded || [],
      tags: tags || [],
      difficulty: difficulty || "Intermediate",
      status: "Recruiting",
      teamSizeLimit: Number(teamSizeLimit) || 4,
      currentTeamSize: 1,
      milestones: [
        { id: `ml_1`, title: "Project Inception", description: "Define task schedules and system designs.", status: "Pending", dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10) }
      ],
      attachments: []
    });

    const savedProject = await newProjectDoc.save();
    const projectId = savedProject._id.toString();

    // Create associated team squad
    const newTeamDoc = new TeamModel({
      projectId,
      projectTitle: savedProject.title,
      leaderId: dbState.user.id || "student_ashish",
      members: [
        {
          userId: dbState.user.id || "student_ashish",
          fullName: dbState.user.fullName || "Ashish Ghadigaonkar",
          avatarUrl: dbState.user.avatarUrl || "",
          role: "Project Lead / Entrepreneur",
          joinedAt: new Date()
        }
      ],
      invitees: []
    });

    const savedTeam = await newTeamDoc.save();

    // Create associated project group chat
    const newChatDoc = new ChatModel({
      threadId: projectId,
      title: `${savedProject.title} - Workspace`,
      avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=100&h=100&q=80",
      type: "Project",
      lastMessage: "System: Team channel created.",
      lastMessageTime: new Date(),
      unreadCount: 0
    });

    await newChatDoc.save();

    // Create a first message
    const firstMessageDoc = new MessageModel({
      threadId: projectId,
      senderId: "System",
      senderName: "CollabBot",
      senderAvatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=100&h=100&q=80",
      content: `Welcome to the active workspace for ${savedProject.title}! Chat with your team here.`,
      read: false
    });

    await firstMessageDoc.save();

    const mappedProj: Project = {
      id: projectId,
      title: savedProject.title,
      tagline: savedProject.tagline,
      description: savedProject.description,
      creatorId: savedProject.creatorId,
      creatorName: savedProject.creatorName,
      creatorAvatar: savedProject.creatorAvatar,
      skillsNeeded: savedProject.skillsNeeded,
      tags: savedProject.tags,
      difficulty: savedProject.difficulty as any,
      status: savedProject.status as any,
      teamSizeLimit: savedProject.teamSizeLimit,
      currentTeamSize: savedProject.currentTeamSize,
      createdAt: (savedProject as any).createdAt ? (savedProject as any).createdAt.toISOString() : new Date().toISOString(),
      milestones: savedProject.milestones,
      attachments: savedProject.attachments
    };

    const mappedTeam: Team = {
      id: savedTeam._id.toString(),
      projectId,
      projectTitle: savedTeam.projectTitle,
      leaderId: savedTeam.leaderId,
      members: savedTeam.members.map(m => ({
        userId: m.userId,
        fullName: m.fullName,
        avatarUrl: m.avatarUrl,
        role: m.role,
        joinedAt: m.joinedAt.toISOString()
      })),
      invitees: savedTeam.invitees
    };

    res.json({ success: true, project: mappedProj, team: mappedTeam });
  } catch (err: any) {
    console.error("[Projects] Error creating project in MongoDB:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/projects/:id/apply", async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    const { id } = req.params;
    const { requestedRole, coverLetter } = req.body;
    const project = dbState.projects.find(p => p.id === id);
    if (!project) return res.status(404).json({ error: "Project not found" });

    const existingApp = dbState.applications.find(a => a.projectId === id && a.applicantId === (dbState.user.id || "student_ashish"));
    if (existingApp) {
      return res.status(400).json({ error: "You have already applied to this project squad" });
    }

    const newApp: TeamApplication = {
      id: `app_${Date.now()}`,
      projectId: id,
      projectTitle: project.title,
      applicantId: dbState.user.id || "student_ashish",
      applicantName: dbState.user.fullName || "Ashish Ghadigaonkar",
      applicantAvatar: dbState.user.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
      applicantHeadline: dbState.user.headline || "Enthusiastic Developer",
      applicantSkills: dbState.user.skills || [],
      requestedRole: requestedRole || "General Developer",
      coverLetter: coverLetter || "Highly interested in matching up with the team.",
      status: "Pending" as any,
      createdAt: new Date().toISOString()
    };

    dbState.applications.unshift(newApp);

    const newNotif: Notification = {
      id: `notif_${Date.now()}`,
      userId: project.creatorId,
      title: "New Application Received",
      message: `${dbState.user.fullName || "Someone"} applied to join ${project.title} as ${requestedRole || "developer"}.`,
      type: "Application" as const,
      read: false,
      createdAt: new Date().toISOString()
    };

    dbState.notifications.unshift(newNotif);
    saveDb();
    return res.json({ success: true, application: newApp });
  }

  try {
    const { id } = req.params;
    const { requestedRole, coverLetter } = req.body;
    const project = await ProjectModel.findById(id);
    if (!project) return res.status(404).json({ error: "Project not found" });

    const existingApp = await ApplicationModel.findOne({ projectId: id, applicantId: dbState.user.id || "student_ashish" });
    if (existingApp) {
      return res.status(400).json({ error: "You have already applied to this project squad" });
    }

    const newAppDoc = new ApplicationModel({
      projectId: id,
      projectTitle: project.title,
      applicantId: dbState.user.id || "student_ashish",
      applicantName: dbState.user.fullName || "Ashish Ghadigaonkar",
      applicantAvatar: dbState.user.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
      applicantHeadline: dbState.user.headline || "Enthusiastic Developer",
      applicantSkills: dbState.user.skills || [],
      requestedRole: requestedRole || "General Developer",
      coverLetter: coverLetter || "Highly interested in matching up with the team.",
      status: "Pending"
    });

    const savedApp = await newAppDoc.save();

    // Notify team leader
    const newNotif = new NotificationModel({
      userId: project.creatorId,
      title: "New Application Received",
      message: `${dbState.user.fullName || "Someone"} applied to join ${project.title} as ${requestedRole || "developer"}.`,
      type: "Application",
      read: false,
      actionUrl: `/projects`
    });

    await newNotif.save();

    const mappedApp = {
      id: savedApp._id.toString(),
      projectId: savedApp.projectId,
      projectTitle: savedApp.projectTitle,
      applicantId: savedApp.applicantId,
      applicantName: savedApp.applicantName,
      applicantAvatar: savedApp.applicantAvatar,
      applicantHeadline: savedApp.applicantHeadline,
      applicantSkills: savedApp.applicantSkills,
      requestedRole: savedApp.requestedRole,
      coverLetter: savedApp.coverLetter,
      status: savedApp.status,
      createdAt: (savedApp as any).createdAt ? (savedApp as any).createdAt.toISOString() : new Date().toISOString()
    };

    res.json({ success: true, application: mappedApp });
  } catch (err: any) {
    console.error("[Apply] Error applying in MongoDB:", err);
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/applications", async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.json(dbState.applications);
  }

  try {
    const apps = await ApplicationModel.find().sort({ createdAt: -1 });
    const mapped = apps.map(a => ({
      id: a._id.toString(),
      projectId: a.projectId,
      projectTitle: a.projectTitle,
      applicantId: a.applicantId,
      applicantName: a.applicantName,
      applicantAvatar: a.applicantAvatar,
      applicantHeadline: a.applicantHeadline,
      applicantSkills: a.applicantSkills,
      requestedRole: a.requestedRole,
      coverLetter: a.coverLetter,
      status: a.status,
      createdAt: (a as any).createdAt ? (a as any).createdAt.toISOString() : new Date().toISOString()
    }));
    res.json(mapped);
  } catch (err: any) {
    console.error("[Applications] Error fetching:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/applications/:appId/status", async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    const { appId } = req.params;
    const { status } = req.body; // "Approved" or "Rejected"
    
    const application = dbState.applications.find(a => a.id === appId);
    if (!application) return res.status(404).json({ error: "Application not found" });

    application.status = status;

    if (status === "Approved") {
      const project = dbState.projects.find(p => p.id === application.projectId);
      const team = dbState.teams.find(t => t.projectId === application.projectId);

      if (project && team) {
        const alreadyMember = team.members.some(m => m.userId === application.applicantId);
        if (!alreadyMember) {
          team.members.push({
            userId: application.applicantId,
            fullName: application.applicantName,
            avatarUrl: application.applicantAvatar,
            role: application.requestedRole,
            joinedAt: new Date().toISOString()
          });

          project.currentTeamSize = team.members.length;
          if (project.currentTeamSize >= project.teamSizeLimit) {
            project.status = "In Progress" as any;
          }
        }
      }
    }

    const newNotif: Notification = {
      id: `nt_${Date.now()}`,
      userId: application.applicantId,
      title: `Project Application ${status}`,
      message: `Your request to join team '${application.projectTitle}' was ${status.toLowerCase()}.`,
      type: "Update" as const,
      read: false,
      createdAt: new Date().toISOString()
    };
    dbState.notifications.unshift(newNotif);
    saveDb();
    return res.json({ success: true, application });
  }

  try {
    const { appId } = req.params;
    const { status } = req.body; // "Approved" or "Rejected"
    
    const application = await ApplicationModel.findById(appId);
    if (!application) return res.status(404).json({ error: "Application not found" });

    application.status = status;
    await application.save();

    if (status === "Approved") {
      // Add member to the respective squad
      const project = await ProjectModel.findById(application.projectId);
      const team = await TeamModel.findOne({ projectId: application.projectId });

      if (project && team) {
        const alreadyMember = team.members.some(m => m.userId === application.applicantId);
        if (!alreadyMember) {
          team.members.push({
            userId: application.applicantId,
            fullName: application.applicantName,
            avatarUrl: application.applicantAvatar,
            role: application.requestedRole,
            joinedAt: new Date()
          });
          await team.save();

          project.currentTeamSize = team.members.length;
          if (project.currentTeamSize >= project.teamSizeLimit) {
            project.status = "In Progress";
          }
          await project.save();
        }
      }
    }

    // Notify applicant
    const newNotif = new NotificationModel({
      userId: application.applicantId,
      title: `Project Application ${status}`,
      message: `Your request to join team '${application.projectTitle}' was ${status.toLowerCase()}.`,
      type: "Update",
      read: false
    });
    await newNotif.save();

    const mappedApp = {
      id: application._id.toString(),
      projectId: application.projectId,
      projectTitle: application.projectTitle,
      applicantId: application.applicantId,
      applicantName: application.applicantName,
      applicantAvatar: application.applicantAvatar,
      applicantHeadline: application.applicantHeadline,
      applicantSkills: application.applicantSkills,
      requestedRole: application.requestedRole,
      coverLetter: application.coverLetter,
      status: application.status,
      createdAt: (application as any).createdAt ? (application as any).createdAt.toISOString() : new Date().toISOString()
    };

    res.json({ success: true, application: mappedApp });
  } catch (err: any) {
    console.error("[AppStatus] Error updating status in MongoDB:", err);
    res.status(500).json({ error: err.message });
  }
});

// Milestone APIs
app.post("/api/projects/:id/milestones", async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    const { id } = req.params;
    const { title, description, dueDate } = req.body;
    const project = dbState.projects.find(p => p.id === id);
    if (!project) return res.status(404).json({ error: "Project not found" });

    const newMilestone = {
      id: `ml_${Date.now()}`,
      title,
      description,
      status: "Pending" as const,
      dueDate: dueDate || new Date().toISOString().slice(0, 10)
    };

    project.milestones.push(newMilestone);
    saveDb();
    return res.json({ success: true, milestone: newMilestone });
  }

  try {
    const { id } = req.params;
    const { title, description, dueDate } = req.body;
    const project = await ProjectModel.findById(id);
    if (!project) return res.status(404).json({ error: "Project not found" });

    const newMilestone = {
      id: `ml_${Date.now()}`,
      title,
      description,
      status: "Pending" as const,
      dueDate: dueDate || new Date().toISOString().slice(0, 10)
    };

    project.milestones.push(newMilestone);
    await project.save();
    res.json({ success: true, milestone: newMilestone });
  } catch (err: any) {
    console.error("[Milestones] Error adding milestone:", err);
    res.status(500).json({ error: err.message });
  }
});

app.patch("/api/projects/:id/milestones/:milestoneId", async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    const { id, milestoneId } = req.params;
    const { status } = req.body; // "Done" or "Pending"
    const project = dbState.projects.find(p => p.id === id);
    if (!project) return res.status(404).json({ error: "Project not found" });

    const milestone = project.milestones.find(m => m.id === milestoneId);
    if (!milestone) return res.status(404).json({ error: "Milestone not found" });

    milestone.status = status;
    saveDb();
    return res.json({ success: true, milestone });
  }

  try {
    const { id, milestoneId } = req.params;
    const { status } = req.body; // "Done" or "Pending"
    const project = await ProjectModel.findById(id);
    if (!project) return res.status(404).json({ error: "Project not found" });

    const milestone = project.milestones.find(m => m.id === milestoneId);
    if (!milestone) return res.status(404).json({ error: "Milestone not found" });

    milestone.status = status;
    await project.save();
    res.json({ success: true, milestone });
  } catch (err: any) {
    console.error("[Milestones] Error updating milestone:", err);
    res.status(500).json({ error: err.message });
  }
});


// 4. Teams Fetch
app.get("/api/teams", async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.json(dbState.teams);
  }

  try {
    const teams = await TeamModel.find();
    const mapped = teams.map(t => ({
      id: t._id.toString(),
      projectId: t.projectId,
      projectTitle: t.projectTitle,
      leaderId: t.leaderId,
      members: t.members.map(m => ({
        userId: m.userId,
        fullName: m.fullName,
        avatarUrl: m.avatarUrl,
        role: m.role,
        joinedAt: m.joinedAt.toISOString()
      })),
      invitees: t.invitees
    }));
    res.json(mapped);
  } catch (err: any) {
    console.error("[Teams] Error fetching from MongoDB:", err);
    res.status(500).json({ error: err.message });
  }
});


// 5. AI Recommendations Engine (Powered by Gemini!)
app.post("/api/recommendations", async (req, res) => {
  try {
    const ai = getGeminiClient();
    const student = mongoose.connection.readyState === 1
      ? (await UserModel.findOne({ firebaseUid: dbState.user.id }) || dbState.user)
      : dbState.user;
    
    // Read live catalog items from MongoDB Atlas if active, otherwise fallback to local JSON database
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
          model: "gemini-2.5-flash",
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
        console.warn("Gemini recommendations API limit/Unavailable. Activated standard local heuristic scoring engine fallback.", geminiError?.message || geminiError);
      }
    }

    // Fallback: Local Dynamic Heuristic Scoring Recommendation Generator (always works perfectly offline!)
    const projectRecs = dbProjects.map(p => {
      const skillsNeeded = p.skillsNeeded || [];
      const matches = skillsNeeded.filter(sk => student.skills.some(usk => usk.toLowerCase() === sk.toLowerCase()));
      const overlapRate = skillsNeeded.length > 0 ? (matches.length / skillsNeeded.length) : 0.5;
      const pct = Math.min(95, Math.max(50, Math.round(55 + overlapRate * 40)));
      return {
        id: p._id ? p._id.toString() : (p as any).id,
        matchPercentage: pct,
        reason: `${student.fullName}, your experience with ${matches.join(", ") || "full-stack UI layers"} perfectly matches the specialized tech requirements of "${p.title}". Joining this team as a collaborator will grow your portfolio!`
      };
    }).sort((a, b) => b.matchPercentage - a.matchPercentage);

    const mentorRecs = dbMentors.map(m => {
      const expertise = m.expertise || [];
      const matches = expertise.filter(e => student.skills.some(usk => e.toLowerCase().includes(usk.toLowerCase()) || usk.toLowerCase().includes(e.toLowerCase())));
      const pct = Math.min(95, Math.max(50, Math.round(60 + (matches.length / (expertise.length || 1)) * 35)));
      return {
        id: m._id ? m._id.toString() : (m as any).id,
        matchPercentage: pct,
        reason: `Connect with ${m.fullName} (${m.company || "Expert"}) to receive focused feedback on your ${student.skills.slice(0, 3).join(", ")} skills and mapping out your junior-year industry applications.`
      };
    });

    const internshipRecs = dbInternships.map(i => {
      const skillsRequired = i.skillsRequired || [];
      const matches = skillsRequired.filter(s => student.skills.some(usk => usk.toLowerCase() === s.toLowerCase()));
      const pct = Math.min(98, Math.max(45, Math.round(50 + (matches.length / (skillsRequired.length || 1)) * 48)));
      return {
        id: i._id ? i._id.toString() : (i as any).id,
        matchPercentage: pct,
        reason: `Tech job matches: ${i.companyName} is recruiting for skills you possess (${matches.join(", ") || "Fullstack web tooling"}). Secure your slot today by sending over your resume.`
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
    console.error("Fatal error generating recommendations:", error);
    res.status(500).json({ error: "Recommendation Engine exception: " + error.message });
  }
});


// 6. Hackathons APIs
app.get("/api/hackathons", async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.json(dbState.hackathons);
  }

  try {
    const hacks = await HackathonModel.find();
    const mapped = hacks.map(h => ({
      id: h._id.toString(),
      title: h.title,
      bannerUrl: h.bannerUrl,
      organizer: h.organizer,
      description: h.description,
      startDate: h.startDate,
      endDate: h.endDate,
      prizePool: h.prizePool,
      categories: h.categories,
      status: h.status,
      registeredTeamsCount: h.registeredTeamsCount,
      rules: h.rules,
      submissions: []
    }));
    res.json(mapped);
  } catch (err: any) {
    console.error("[Hackathons] Error fetching from MongoDB:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/hackathons/:id/register", async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    const { id } = req.params;
    const hackathon = dbState.hackathons.find(h => h.id === id);
    if (!hackathon) return res.status(404).json({ error: "Hackathon not found" });

    hackathon.registeredTeamsCount += 1;

    const newNotif: Notification = {
      id: `notif_${Date.now()}`,
      userId: dbState.user.id || "student_ashish",
      title: "Registered for Hackathon",
      message: `You registered for the '${hackathon.title}' challenge. Prepare your submission!`,
      type: "Update" as const,
      read: false,
      createdAt: new Date().toISOString()
    };
    dbState.notifications.unshift(newNotif);
    saveDb();
    return res.json({ success: true, hackathon });
  }

  try {
    const { id } = req.params;
    const hackathon = await HackathonModel.findById(id);
    if (!hackathon) return res.status(404).json({ error: "Hackathon not found" });

    hackathon.registeredTeamsCount += 1;
    await hackathon.save();

    // Notify student
    const newNotif = new NotificationModel({
      userId: dbState.user.id || "student_ashish",
      title: "Registered for Hackathon",
      message: `You registered for the '${hackathon.title}' challenge. Prepare your submission!`,
      type: "Update",
      read: false
    });
    await newNotif.save();

    res.json({ success: true, hackathon: { ...hackathon.toObject(), id: hackathon._id.toString() } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/hackathons/:id/submit", async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    const { id } = req.params;
    const { teamName, projectTitle, demoUrl, githubUrl } = req.body;
    const hackathon = dbState.hackathons.find(h => h.id === id);
    if (!hackathon) return res.status(404).json({ error: "Hackathon not found" });

    hackathon.registeredTeamsCount += 1;

    dbState.user.reputationPoints += 150;
    if (!dbState.user.badges.includes("Hackathon Submit!")) {
      dbState.user.badges.push("Hackathon Submit!");
    }
    saveDb();
    return res.json({ 
      success: true, 
      submission: { teamName, projectTitle, demoUrl, githubUrl },
      user: dbState.user 
    });
  }

  try {
    const { id } = req.params;
    const { teamName, projectTitle, demoUrl, githubUrl } = req.body;
    const hackathon = await HackathonModel.findById(id);
    if (!hackathon) return res.status(404).json({ error: "Hackathon not found" });

    hackathon.registeredTeamsCount += 1;
    await hackathon.save();

    const studentUser = await UserModel.findOne({ firebaseUid: dbState.user.id });
    if (studentUser) {
      studentUser.reputationPoints += 150;
      if (!studentUser.badges.includes("Hackathon Submit!")) {
        studentUser.badges.push("Hackathon Submit!");
      }
      await studentUser.save();
      
      // Sync local dbState
      dbState.user.reputationPoints = studentUser.reputationPoints;
      dbState.user.badges = studentUser.badges;
    }

    res.json({ 
      success: true, 
      submission: { teamName, projectTitle, demoUrl, githubUrl },
      user: dbState.user 
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


// 7. Internships Board APIs
app.get("/api/internships", async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.json(dbState.internships);
  }

  try {
    const internships = await InternshipModel.find().sort({ createdAt: -1 });
    const mapped = internships.map(i => ({
      id: i._id.toString(),
      title: i.title,
      companyName: i.companyName,
      companyLogo: i.companyLogo,
      location: i.location,
      type: i.type,
      duration: i.duration,
      stipend: i.stipend,
      skillsRequired: i.skillsRequired,
      description: i.description,
      applyBy: i.applyBy,
      applicantsCount: i.applicantsCount,
      applicants: i.applicants
    }));
    res.json(mapped);
  } catch (err: any) {
    console.error("[Internships] Error fetching:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/internships", async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    const { title, companyName, stipend, skillsRequired, location, type, duration, description } = req.body;
    if (!title || !companyName) {
      return res.status(400).json({ error: "Missing company or title details" });
    }

    const newInter = {
      id: `intern_${Date.now()}`,
      title,
      companyName,
      companyLogo: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=100&h=100&q=80",
      stipend: stipend || "Competitive Stipend",
      skillsRequired: skillsRequired || ["ReactJS"],
      location: location || "Remote",
      type: type || "Remote",
      duration: duration || "3 Months",
      description: description || "Looking for eager front-end developer wizards.",
      applyBy: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      applicantsCount: 0,
      applicants: []
    };

    dbState.internships.unshift(newInter as any);
    saveDb();
    return res.json({ success: true, internship: newInter });
  }

  try {
    const { title, companyName, stipend, skillsRequired, location, type, duration, description } = req.body;
    if (!title || !companyName) {
      return res.status(400).json({ error: "Missing company or title details" });
    }

    const newInternship = new InternshipModel({
      title,
      companyName,
      companyLogo: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=100&h=100&q=80",
      stipend: stipend || "Competitive Stipend",
      skillsRequired: skillsRequired || ["ReactJS"],
      location: location || "Remote",
      type: type || "Remote",
      duration: duration || "3 Months",
      description: description || "Looking for eager front-end developer wizards.",
      applyBy: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      applicantsCount: 0,
      applicants: []
    });

    const saved = await newInternship.save();
    res.json({ success: true, internship: { ...saved.toObject(), id: saved._id.toString() } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/internships/:id/apply", async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    const { id } = req.params;
    const internship = dbState.internships.find(i => i.id === id);
    if (!internship) return res.status(404).json({ error: "Internship post not found" });

    const alreadyApplied = (internship.applicants || []).some(a => a.userId === (dbState.user.id || "student_ashish"));
    if (alreadyApplied) {
      return res.status(400).json({ error: "You've already applied for this slot" });
    }

    if (!internship.applicants) internship.applicants = [];
    internship.applicants.push({
      userId: dbState.user.id || "student_ashish",
      fullName: dbState.user.fullName || "Ashish Ghadigaonkar",
      avatarUrl: dbState.user.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
      resumeUrl: dbState.user.resumeUrl || "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      status: "Applied" as any,
      appliedAt: new Date().toISOString() as any
    });

    internship.applicantsCount = internship.applicants.length;

    const newNotif: Notification = {
      id: `notif_${Date.now()}`,
      userId: dbState.user.id || "student_ashish",
      title: "Internship Application Sent",
      message: `Your credentials was successfully submitted to '${internship.companyName}' for '${internship.title}'.`,
      type: "Update" as const,
      read: false,
      createdAt: new Date().toISOString()
    };
    dbState.notifications.unshift(newNotif);
    saveDb();
    return res.json({ success: true, internship });
  }

  try {
    const { id } = req.params;
    const internship = await InternshipModel.findById(id);
    if (!internship) return res.status(404).json({ error: "Internship post not found" });

    const alreadyApplied = internship.applicants.some(a => a.userId === (dbState.user.id || "student_ashish"));
    if (alreadyApplied) {
      return res.status(400).json({ error: "You've already applied for this slot" });
    }

    const applicantUser = await UserModel.findOne({ firebaseUid: dbState.user.id });

    internship.applicants.push({
      userId: dbState.user.id || "student_ashish",
      fullName: dbState.user.fullName || "Ashish Ghadigaonkar",
      avatarUrl: dbState.user.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
      resumeUrl: applicantUser?.resumeUrl || dbState.user.resumeUrl || "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
      status: "Applied",
      appliedAt: new Date()
    });

    internship.applicantsCount = internship.applicants.length;
    await internship.save();

    const newNotif = new NotificationModel({
      userId: dbState.user.id || "student_ashish",
      title: "Internship Application Sent",
      message: `Your credentials was successfully submitted to '${internship.companyName}' for '${internship.title}'.`,
      type: "Update",
      read: false
    });
    await newNotif.save();

    res.json({ success: true, internship: { ...internship.toObject(), id: internship._id.toString() } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


// ==========================================
// 7b. FOLLOW SYSTEM APIS
// ==========================================
app.get("/api/follows", async (req, res) => {
  const userId = dbState.user.id || "student_ashish";

  if (mongoose.connection.readyState !== 1) {
    const list = dbState.followers.filter(f => f.followerId === userId);
    return res.json(list);
  }

  try {
    const list = await FollowerModel.find({ followerId: userId });
    const mapped = list.map(f => ({
      id: f._id.toString(),
      followerId: f.followerId,
      followingId: f.followingId,
      followingType: f.followingType
    }));
    return res.json(mapped);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.post("/api/follows", async (req, res) => {
  const userId = dbState.user.id || "student_ashish";
  const { followingId, followingType } = req.body;

  if (!followingId || !followingType) {
    return res.status(400).json({ error: "Missing followingId or followingType" });
  }

  if (mongoose.connection.readyState !== 1) {
    const existingIndex = dbState.followers.findIndex(
      f => f.followerId === userId && f.followingId === followingId
    );

    if (existingIndex > -1) {
      // Unfollow
      dbState.followers.splice(existingIndex, 1);
      saveDb();
      return res.json({ followed: false, followingId });
    } else {
      // Follow
      const newFollow: FollowerRelation = {
        id: `follow_${Date.now()}`,
        followerId: userId,
        followingId,
        followingType
      };
      dbState.followers.push(newFollow);
      saveDb();
      return res.json({ followed: true, followingId });
    }
  }

  try {
    const existing = await FollowerModel.findOne({ followerId: userId, followingId });
    if (existing) {
      await FollowerModel.deleteOne({ _id: existing._id });
      return res.json({ followed: false, followingId });
    } else {
      const newFollow = new FollowerModel({
        followerId: userId,
        followingId,
        followingType
      });
      await newFollow.save();
      return res.json({ followed: true, followingId, id: newFollow._id.toString() });
    }
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});


// 8. Mentors Directory APIs
app.get("/api/mentors", async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.json(dbState.mentors);
  }

  try {
    const mentors = await MentorModel.find();
    const mapped = mentors.map(m => ({
      id: m._id.toString(),
      fullName: m.fullName,
      avatarUrl: m.avatarUrl,
      title: (m as any).title || (m as any).role,
      company: m.company,
      expertise: m.expertise || (m as any).skills,
      bio: (m as any).bio || (m as any).biography,
      rating: m.rating,
      reviewsCount: (m as any).reviewsCount || (m as any).reviewCount,
      skills: (m as any).skills || m.expertise,
      pricing: m.pricing,
      availability: m.availability
    }));
    res.json(mapped);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/mentors/:id/book", async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    const { id } = req.params;
    const { topic, date, timeSlot } = req.body;
    
    const mentor = dbState.mentors.find(m => m.id === id);
    if (!mentor) return res.status(404).json({ error: "Mentor not found" });

    const newBooking = {
      id: `book_${Date.now()}`,
      mentorId: id,
      mentorName: mentor.fullName,
      mentorAvatar: mentor.avatarUrl,
      menteeId: dbState.user.id || "student_ashish",
      menteeName: dbState.user.fullName || "Ashish Ghadigaonkar",
      topic: topic || "General Career Mentorship Session",
      date: date || new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      timeSlot: timeSlot || "4:00 PM",
      status: "Scheduled" as any,
      meetingLink: `https://meet.google.com/meet-${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 5)}`
    };

    if (!dbState.sessions) dbState.sessions = [];
    dbState.sessions.unshift(newBooking as any);

    const newNotif: Notification = {
      id: `notif_${Date.now()}`,
      userId: dbState.user.id || "student_ashish",
      title: "Mentorship Reserved",
      message: `Session booked with ${mentor.fullName} on ${newBooking.date} at ${newBooking.timeSlot}.`,
      type: "Update" as const,
      read: false,
      createdAt: new Date().toISOString()
    };
    dbState.notifications.unshift(newNotif);
    saveDb();
    return res.json({ success: true, session: newBooking });
  }

  try {
    const { id } = req.params;
    const { topic, date, timeSlot } = req.body;
    
    const mentor = await MentorModel.findById(id);
    if (!mentor) return res.status(404).json({ error: "Mentor not found" });

    const newBooking = new MentorBookingModel({
      mentorId: id,
      mentorName: mentor.fullName,
      mentorAvatar: mentor.avatarUrl,
      menteeId: dbState.user.id || "student_ashish",
      menteeName: dbState.user.fullName || "Ashish Ghadigaonkar",
      topic: topic || "General Career Mentorship Session",
      date: date || new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      timeSlot: timeSlot || "4:00 PM",
      status: "Scheduled",
      meetingLink: `https://meet.google.com/meet-${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 5)}`
    });

    await newBooking.save();

    const newNotif = new NotificationModel({
      userId: dbState.user.id || "student_ashish",
      title: "Mentorship Reserved",
      message: `Session booked with ${mentor.fullName} on ${newBooking.date} at ${newBooking.timeSlot}.`,
      type: "Update",
      read: false
    });
    await newNotif.save();

    const mappedSession = {
      id: newBooking._id.toString(),
      mentorId: newBooking.mentorId,
      mentorName: newBooking.mentorName,
      mentorAvatar: newBooking.mentorAvatar,
      menteeId: newBooking.menteeId,
      menteeName: newBooking.menteeName,
      topic: newBooking.topic,
      date: newBooking.date,
      timeSlot: newBooking.timeSlot,
      status: newBooking.status,
      meetingLink: newBooking.meetingLink
    };

    res.json({ success: true, session: mappedSession });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/mentors/booked", async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    const userId = dbState.user.id || "student_ashish";
    const bookings = (dbState.sessions || []).filter(b => b.menteeId === userId);
    return res.json(bookings);
  }

  try {
    const userId = dbState.user.id || "student_ashish";
    const bookings = await MentorBookingModel.find({ menteeId: userId }).sort({ date: -1 });
    const mapped = bookings.map(b => ({
      id: b._id.toString(),
      mentorId: b.mentorId,
      mentorName: b.mentorName,
      mentorAvatar: b.mentorAvatar,
      menteeId: b.menteeId,
      menteeName: b.menteeName,
      topic: b.topic,
      date: b.date,
      timeSlot: b.timeSlot,
      status: b.status,
      meetingLink: b.meetingLink
    }));
    res.json(mapped);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


// 9. Chats & Messages Real-Time Channels
app.get("/api/chats", async (req, res) => {
  const { channelId } = req.query;

  if (mongoose.connection.readyState !== 1) {
    if (channelId) {
      if (!dbState.channelMessages) {
        dbState.channelMessages = JSON.parse(JSON.stringify(DEFAULT_CHANNEL_MESSAGES));
        saveDb();
      }
      const chatLogs = dbState.channelMessages[channelId as string] || [];
      return res.json(chatLogs);
    }
    return res.json(dbState.chats);
  }

  try {
    if (channelId) {
      // Fetch messages from MongoDB MessageModel for the given channelId/threadId
      const messages = await MessageModel.find({ threadId: channelId as string }).sort({ createdAt: 1 }).lean();
      
      // If none found, we can populate with seed data!
      if (messages.length === 0) {
        const seedLogs = DEFAULT_CHANNEL_MESSAGES[channelId as string] || [];
        if (seedLogs.length > 0) {
          const docsToInsert = seedLogs.map(m => ({
            threadId: channelId as string,
            senderId: m.senderId || "system",
            senderName: m.senderName,
            senderAvatar: m.senderAvatar,
            content: m.content,
            createdAt: new Date(m.createdAt)
          }));
          await MessageModel.insertMany(docsToInsert);
          const freshMsgs = await MessageModel.find({ threadId: channelId as string }).sort({ createdAt: 1 }).lean();
          return res.json(freshMsgs.map(m => ({
            id: m._id.toString(),
            channelId: m.threadId,
            senderName: m.senderName,
            senderAvatar: m.senderAvatar,
            content: m.content,
            createdAt: (m as any).createdAt || new Date().toISOString()
          })));
        }
      }

      return res.json(messages.map(m => ({
        id: m._id.toString(),
        channelId: m.threadId,
        senderName: m.senderName,
        senderAvatar: m.senderAvatar,
        content: m.content,
        createdAt: (m as any).createdAt ? new Date((m as any).createdAt).toISOString() : new Date().toISOString()
      })));
    }

    const chats = await ChatModel.find().lean();
    const mappedChats = await Promise.all(chats.map(async (c) => {
      const messages = await MessageModel.find({ threadId: c.threadId }).sort({ createdAt: 1 }).lean();
      return {
        id: c.threadId,
        title: c.title,
        avatar: c.avatar,
        type: c.type,
        lastMessage: c.lastMessage,
        lastMessageTime: c.lastMessageTime ? new Date(c.lastMessageTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now",
        unreadCount: c.unreadCount || 0,
        messages: messages.map(m => ({
          id: m._id.toString(),
          senderId: m.senderId,
          senderName: m.senderName,
          senderAvatar: m.senderAvatar,
          content: m.content,
          timestamp: (m as any).createdAt ? new Date((m as any).createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "Just now"
        }))
      };
    }));
    res.json(mappedChats);
  } catch (err: any) {
    console.error("[Chats] Error reading from Database:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/chats", async (req, res) => {
  const { channelId, content, senderName, senderAvatar, senderId } = req.body;
  if (!channelId || !content) {
    return res.status(400).json({ error: "Missing channelId or content payload parameter." });
  }

  if (mongoose.connection.readyState !== 1) {
    if (!dbState.channelMessages) {
      dbState.channelMessages = JSON.parse(JSON.stringify(DEFAULT_CHANNEL_MESSAGES));
    }
    if (!dbState.channelMessages[channelId]) {
      dbState.channelMessages[channelId] = [];
    }

    const newMessage = {
      id: `msg_${Date.now()}`,
      channelId,
      senderName: senderName || dbState.user.fullName || "Ashish Ghadigaonkar",
      senderAvatar: senderAvatar || dbState.user.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
      content,
      createdAt: new Date().toISOString()
    };

    dbState.channelMessages[channelId].push(newMessage);
    saveDb();
    return res.json(dbState.channelMessages[channelId]);
  }

  try {
    const newMessageDoc = new MessageModel({
      threadId: channelId,
      senderId: senderId || dbState.user.id || "student_ashish",
      senderName: senderName || dbState.user.fullName || "Ashish Ghadigaonkar",
      senderAvatar: senderAvatar || dbState.user.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
      content,
      read: false
    });

    await newMessageDoc.save();

    // Fetch refreshed complete list to return, mapping correctly
    const messages = await MessageModel.find({ threadId: channelId }).sort({ createdAt: 1 }).lean();
    const mapped = messages.map(m => ({
      id: m._id.toString(),
      channelId: m.threadId,
      senderName: m.senderName,
      senderAvatar: m.senderAvatar,
      content: m.content,
      createdAt: (m as any).createdAt ? new Date((m as any).createdAt).toISOString() : new Date().toISOString()
    }));

    res.json(mapped);
  } catch (err: any) {
    console.error("[Chats] Error writing to Database:", err);
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/chats/:id/messages", async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    const { id } = req.params;
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: "Cannot send empty workspace line" });

    let chat = dbState.chats.find(c => c.id === id);
    if (!chat) {
      const mentorMatch = dbState.mentors.find(m => m.id === id || m.fullName.toLowerCase().includes(id.toLowerCase()));
      chat = {
        id: id,
        title: mentorMatch ? mentorMatch.fullName : "Interactive Thread",
        avatar: mentorMatch ? mentorMatch.avatarUrl : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
        type: "Direct" as const,
        unreadCount: 0,
        lastMessage: "",
        lastMessageTime: new Date().toISOString(),
        messages: []
      };
      dbState.chats.unshift(chat);
    }

    const newMessage = {
      id: `msg_${Date.now()}`,
      senderId: dbState.user.id || "student_ashish",
      senderName: dbState.user.fullName || "Ashish Ghadigaonkar",
      senderAvatar: dbState.user.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    if (!chat.messages) chat.messages = [];
    chat.messages.push(newMessage as any);

    chat.lastMessage = `${(dbState.user.fullName || "Ashish").split(" ")[0]}: ${content}`;
    chat.lastMessageTime = new Date().toISOString();

    if (chat.type === "Project" || id === "proj_1") {
      setTimeout(() => {
        const bots = [
          { name: "Rohan Sharma", id: "user_rohan", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80", replies: ["Looks neat!", "Got it, checking the task list.", "Let us keep pushing on this design.", "Nice progress."] },
          { name: "Sneha Nair", id: "user_sneha", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100&q=80", replies: ["Perfect!", "I love this team's work rate.", "Will update the Figma mockup layout in a bit.", "Should we map a quick meeting session?"] }
        ];
        const selectedBot = bots[Math.floor(Math.random() * bots.length)];
        const botResponse = selectedBot.replies[Math.floor(Math.random() * selectedBot.replies.length)];

        const botMsg = {
          id: `msg_${Date.now()}`,
          senderId: selectedBot.id,
          senderName: selectedBot.name,
          senderAvatar: selectedBot.avatar,
          content: botResponse,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        chat!.messages!.push(botMsg as any);
        chat!.lastMessage = `${selectedBot.name.split(" ")[0]}: ${botResponse}`;
        chat!.lastMessageTime = new Date().toISOString();
        saveDb();
      }, 1500);
    } else if (chat.type === "Direct") {
      setTimeout(() => {
        const botMsg = {
          id: `msg_${Date.now()}`,
          senderId: id,
          senderName: chat!.title,
          senderAvatar: chat!.avatar,
          content: `Hey! Thanks for pinging. I received your message: "${content}". Let's finalize our session topic in detail over the mentor card.`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        chat!.messages!.push(botMsg as any);
        chat!.lastMessage = `${chat!.title.split(" ")[0]}: Hey! Thanks for pinging...`;
        chat!.lastMessageTime = new Date().toISOString();
        saveDb();
      }, 1800);
    }

    saveDb();
    return res.json({ success: true, message: newMessage, chat });
  }

  try {
    const { id } = req.params;
    const { content } = req.body;
    
    if (!content) return res.status(400).json({ error: "Cannot send empty workspace line" });

    let chat = await ChatModel.findOne({ threadId: id });
    if (!chat) {
      // dynamically create thread
      const mentorMatch = await MentorModel.findOne({ 
        $or: [
          { _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : undefined }, 
          { fullName: new RegExp(id, "i") }
        ] 
      });
      chat = new ChatModel({
        threadId: id,
        title: mentorMatch ? mentorMatch.fullName : "Interactive Thread",
        avatar: mentorMatch ? mentorMatch.avatarUrl : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
        type: "Direct",
        unreadCount: 0,
        lastMessage: "",
        lastMessageTime: new Date()
      });
      await chat.save();
    }

    const newMessage = new MessageModel({
      threadId: id,
      senderId: dbState.user.id || "student_ashish",
      senderName: dbState.user.fullName || "Ashish Ghadigaonkar",
      senderAvatar: dbState.user.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
      content,
      read: false
    });

    await newMessage.save();

    chat.lastMessage = `${(dbState.user.fullName || "Ashish").split(" ")[0]}: ${content}`;
    chat.lastMessageTime = new Date();
    await chat.save();

    // Simulate automatic responsive bot replies to make chat highly interactive!
    if (chat.type === "Project" || id === "proj_1") {
      setTimeout(async () => {
        try {
          const bots = [
            { name: "Rohan Sharma", id: "user_rohan", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80", replies: ["Looks neat!", "Got it, checking the task list.", "Let us keep pushing on this design.", "Nice progress."] },
            { name: "Sneha Nair", id: "user_sneha", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100&q=80", replies: ["Perfect!", "I love this team's work rate.", "Will update the Figma mockup layout in a bit.", "Should we map a quick meeting session?"] }
          ];
          const selectedBot = bots[Math.floor(Math.random() * bots.length)];
          const botResponse = selectedBot.replies[Math.floor(Math.random() * selectedBot.replies.length)];

          const botMessage = new MessageModel({
            threadId: id,
            senderId: selectedBot.id,
            senderName: selectedBot.name,
            senderAvatar: selectedBot.avatar,
            content: botResponse,
            read: false
          });
          await botMessage.save();

          const targetChat = await ChatModel.findOne({ threadId: id });
          if (targetChat) {
            targetChat.lastMessage = `${selectedBot.name.split(" ")[0]}: ${botResponse}`;
            targetChat.lastMessageTime = new Date();
            await targetChat.save();
          }
        } catch (botErr) {
          console.error("Bot simulation reply error:", botErr);
        }
      }, 1500);
    } else if (chat.type === "Direct") {
      setTimeout(async () => {
        try {
          const botMessage = new MessageModel({
            threadId: id,
            senderId: id,
            senderName: chat!.title,
            senderAvatar: chat!.avatar,
            content: `Hey! Thanks for pinging. I received your message: "${content}". Let's finalize our session topic in detail over the mentor card.`,
            read: false
          });
          await botMessage.save();

          const targetChat = await ChatModel.findOne({ threadId: id });
          if (targetChat) {
            targetChat.lastMessage = `${chat!.title.split(" ")[0]}: Hey! Thanks for pinging...`;
            targetChat.lastMessageTime = new Date();
            await targetChat.save();
          }
        } catch (botErr) {
          console.error("Bot simulation direct reply error:", botErr);
        }
      }, 1800);
    }

    const mappedMessage = {
      id: newMessage._id.toString(),
      senderId: newMessage.senderId,
      senderName: newMessage.senderName,
      senderAvatar: newMessage.senderAvatar,
      content: newMessage.content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    res.json({ success: true, message: mappedMessage, chat: { ...chat.toObject(), id: chat.threadId } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


// ====================================================
// ADVANCED STARTUP-SCALE PLATFORM ENDPOINTS (SkillCollab)
// ====================================================

// Initialize extra persistent state containers if not present
if (!(dbState as any).cofounderPosts) {
  (dbState as any).cofounderPosts = [
    {
      id: "cf_1",
      title: "EdTech AI Co-founder Wanted",
      tagline: "Building next-generation adaptive study tools for high-school classrooms.",
      description: "We are seeking a technical B.Tech Lead as a technical co-founder. We have won 2 college hackathons, sketched out fully resolved Figma prototypes, and already have a solid pitch deck showing investor interest.",
      authorName: "Ananya Mehta",
      authorRole: "Business Lead & PM",
      authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100&q=80",
      skillsNeeded: ["React.js", "Node.js", "Gemini API", "Vector Embeddings"],
      equityOffer: "25% - 35%",
      applicantsCount: 3,
      createdAt: new Date().toISOString()
    },
    {
      id: "cf_2",
      title: "FinTech Passives App",
      tagline: "Automated spare-change investment strategies for college students.",
      description: "We are design-complete and looking for a robust Node.js backend developer to co-found and build our micro-investment accounting ledger, Redis lock pools, and Sandbox trading APIs.",
      authorName: "Rishabh Roy",
      authorRole: "UX Design Lead",
      authorAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&h=100&q=80",
      skillsNeeded: ["TypeScript", "MongoDB", "Express.js", "Stripe API"],
      equityOffer: "18% - 30%",
      applicantsCount: 1,
      createdAt: new Date().toISOString()
    }
  ];
}

if (!(dbState as any).opensourceIssues) {
  (dbState as any).opensourceIssues = [
    {
      id: "os_1",
      repoName: "react-ui-accessible-flyout",
      issueTitle: "accessibility: support keyboard focus and high-contrast styling inside drawer modal",
      issueNumber: 64,
      difficulty: "Good First Issue",
      languages: ["React", "CSS", "TypeScript"],
      stars: 480,
      description: "Ensure that flyout cards handle keyboard focus transitions cleanly and respect standard contrast benchmarks. Beginner-friendly accessibility ticket."
    },
    {
      id: "os_2",
      repoName: "express-rate-limit-redis",
      issueTitle: "bug: optimize redis connection pool release during high-frequency server recycles",
      issueNumber: 119,
      difficulty: "Intermediate",
      languages: ["TypeScript", "Node.js", "Redis"],
      stars: 1450,
      description: "Connection pool leaks threads if express server undergoing massive Docker container cold starts. Add robust connection teardown handlers."
    },
    {
      id: "os_3",
      repoName: "d3-analytics-dashboard",
      issueTitle: "feature: implement responsive container width triggers to redraw canvas on resize",
      issueNumber: 247,
      difficulty: "Advanced",
      languages: ["React", "D3.js", "SVG"],
      stars: 890,
      description: "Charts currently overlap frame margins on tablet devices. Use ResizeObserver to trigger custom canvas layouts."
    }
  ];
}

// 1. Startup Co-Founders Matching APIs
app.get("/api/co-founders/posts", async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.json((dbState as any).cofounderPosts || []);
  }

  try {
    const posts = await StartupIdeaModel.find().sort({ createdAt: -1 });
    const mapped = posts.map(p => ({
      id: p._id.toString(),
      title: p.title,
      tagline: p.problem,
      description: p.description,
      authorName: p.authorName,
      authorRole: p.authorRole,
      authorAvatar: p.authorAvatar,
      skillsNeeded: p.tags,
      equityOffer: p.equityOffer || "15% - 25%",
      applicantsCount: p.neededRoles.length || 0,
      createdAt: (p as any).createdAt ? (p as any).createdAt.toISOString() : new Date().toISOString()
    }));
    res.json(mapped);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/co-founders/posts", async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    const { title, tagline, description, authorName, authorRole, skillsNeeded, equityOffer } = req.body;
    if (!title || !description || !tagline) {
      return res.status(400).json({ error: "Missing required co-founder posting fields" });
    }

    const newPost = {
      id: `cf_${Date.now()}`,
      title,
      tagline,
      description,
      authorName: authorName || dbState.user.fullName,
      authorRole: authorRole || "Lead Founder",
      authorAvatar: dbState.user.avatarUrl,
      skillsNeeded: skillsNeeded || ["React", "Node.js"],
      equityOffer: equityOffer || "10% - 20%",
      applicantsCount: 0,
      createdAt: new Date().toISOString()
    };

    if (!(dbState as any).cofounderPosts) (dbState as any).cofounderPosts = [];
    (dbState as any).cofounderPosts.unshift(newPost);
    saveDb();
    return res.json({ success: true, post: newPost });
  }

  try {
    const { title, tagline, description, authorName, authorRole, skillsNeeded, equityOffer } = req.body;
    if (!title || !description || !tagline) {
      return res.status(400).json({ error: "Missing required co-founder posting fields" });
    }

    const newPost = new StartupIdeaModel({
      title,
      description: description,
      problem: tagline,
      solution: "General automated MVP platform setup",
      tags: skillsNeeded || ["React", "Node.js"],
      authorId: dbState.user.id || "student_ashish",
      authorName: authorName || dbState.user.fullName || "Ashish Ghadigaonkar",
      authorRole: authorRole || "Lead Founder",
      authorAvatar: dbState.user.avatarUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100&q=80",
      neededRoles: skillsNeeded || [],
      equityOffer: equityOffer || "10% - 20%"
    });

    const saved = await newPost.save();
    
    const mapped = {
      id: saved._id.toString(),
      title: saved.title,
      tagline: saved.problem,
      description: saved.description,
      authorName: saved.authorName,
      authorRole: saved.authorRole,
      authorAvatar: saved.authorAvatar,
      skillsNeeded: saved.tags,
      equityOffer: saved.equityOffer,
      applicantsCount: 0,
      createdAt: (saved as any).createdAt ? (saved as any).createdAt.toISOString() : new Date().toISOString()
    };

    res.json({ success: true, post: mapped });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/co-founders/posts/:id/apply", async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    const { id } = req.params;
    const posts = (dbState as any).cofounderPosts || [];
    const post = posts.find((p: any) => p.id === id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    post.applicantsCount += 1;

    const newNotif: Notification = {
      id: `notif_${Date.now()}`,
      userId: dbState.user.id,
      title: "New Co-Founder Pitch!",
      message: `${dbState.user.fullName} pitched for your idea: "${post.title}". High skills match score!`,
      type: "Application" as const,
      read: false,
      createdAt: new Date().toISOString()
    };
    dbState.notifications.unshift(newNotif);
    saveDb();
    return res.json({ success: true, post });
  }

  try {
    const { id } = req.params;
    const post = await StartupIdeaModel.findById(id);
    if (!post) return res.status(404).json({ error: "Post not found" });

    const newNotif = new NotificationModel({
      userId: post.authorId,
      title: "New Co-Founder Pitch!",
      message: `${dbState.user.fullName || "Someone"} pitched for your idea: "${post.title}". High skills match score!`,
      type: "Application",
      read: false
    });
    await newNotif.save();

    res.json({ success: true, post: { ...post.toObject(), id: post._id.toString(), tagline: post.problem, skillsNeeded: post.tags, applicantsCount: 1 } });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Open Source Collaboration Hub APIs
app.get("/api/open-source/issues", (req, res) => {
  const sampleIssues = [
    {
      id: "os_1",
      repoName: "react-ui-accessible-flyout",
      issueTitle: "accessibility: support keyboard focus and high-contrast styling inside drawer modal",
      issueNumber: 64,
      difficulty: "Good First Issue",
      languages: ["React", "CSS", "TypeScript"],
      stars: 480,
      description: "Ensure that flyout cards handle keyboard focus transitions cleanly and respect standard contrast benchmarks."
    },
    {
      id: "os_2",
      repoName: "express-rate-limit-redis",
      issueTitle: "bug: optimize redis connection pool release during high-frequency server recycles",
      issueNumber: 119,
      difficulty: "Intermediate",
      languages: ["TypeScript", "Node.js", "Redis"],
      stars: 1450,
      description: "Connection pool leaks threads if express server undergoing massive Docker container cold starts."
    },
    {
      id: "os_3",
      repoName: "d3-analytics-dashboard",
      issueTitle: "feature: implement responsive container width triggers to redraw canvas on resize",
      issueNumber: 247,
      difficulty: "Advanced",
      languages: ["React", "D3.js", "SVG"],
      stars: 890,
      description: "Charts currently overlap frame margins on tablet devices. Use ResizeObserver to trigger custom canvas layouts."
    }
  ];
  res.json(sampleIssues);
});

app.post("/api/open-source/log", async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    const { issueId, pullRequestUrl, comment } = req.body;
    if (!issueId || !pullRequestUrl) {
      return res.status(400).json({ error: "Missing contribution data" });
    }

    const pointsEarned = issueId === "os_1" ? 75 : issueId === "os_2" ? 150 : 250;

    dbState.user.reputationPoints += pointsEarned;
    if (!dbState.user.badges.includes("Open Source Ally")) {
      dbState.user.badges.push("Open Source Ally");
    }

    const notification: Notification = {
      id: `notif_${Date.now()}`,
      userId: dbState.user.id || "student_ashish",
      title: "Points Awarded!",
      message: `Logged contribution. Earned +${pointsEarned} Rep Points!`,
      type: "Update" as const,
      read: false,
      createdAt: new Date().toISOString()
    };
    dbState.notifications.unshift(notification);
    saveDb();
    return res.json({ success: true, pointsEarned, user: dbState.user });
  }

  try {
    const { issueId, pullRequestUrl, comment } = req.body;
    if (!issueId || !pullRequestUrl) {
      return res.status(400).json({ error: "Missing contribution data" });
    }

    const pointsEarned = issueId === "os_1" ? 75 : issueId === "os_2" ? 150 : 250;
    
    // Save to user repository in MongoDB Atlas
    const user = await UserModel.findOne({ firebaseUid: dbState.user.id });
    if (user) {
      user.reputationPoints += pointsEarned;
      if (!user.badges.includes("Open Source Ally")) {
        user.badges.push("Open Source Ally");
      }
      await user.save();
      
      dbState.user.reputationPoints = user.reputationPoints;
      dbState.user.badges = user.badges;
    }

    // Generate notification
    const notification = new NotificationModel({
      userId: dbState.user.id || "student_ashish",
      title: "Points Awarded!",
      message: `Logged contribution. Earned +${pointsEarned} Rep Points!`,
      type: "Update",
      read: false
    });
    await notification.save();

    res.json({ success: true, pointsEarned, user: dbState.user });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 3. AI Resume Builder API
app.post("/api/ai/resume-builder", async (req, res) => {
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
          model: "gemini-2.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            temperature: 0.3
          }
        });
        const clean = (response.text || "").replace(/```json/g, "").replace(/```/g, "").trim();
        return res.json(JSON.parse(clean));
      } catch (e: any) {
        console.warn("Gemini resume-builder unavailable. Activated local Resume analyzer fallback.", e?.message || e);
      }
    }

    // Heuristic Fallback
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
});

// 4. AI Mock Interview Platform API 
app.post("/api/ai/mock-interview/start", async (req, res) => {
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
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.5
        }
      });
      const clean = (response.text || "").replace(/```json/g, "").replace(/```/g, "").trim();
      return res.json(JSON.parse(clean));
    } catch (e: any) {
      console.warn("Gemini interview-start unavailable. Backed up to standard local question catalog.", e?.message || e);
    }
  }

  // Backup Mock Catalog
  let fallbackQ = "Explain how you would handle race conditions on an Express.js server when multiple student developers apply to the same project role at the exact same millisecond.";
  if (type === "DSA") {
    fallbackQ = "Write a highly optimized time-bound method to extract top K most frequently matched mentors from a stream of 1M session ratings.";
  } else if (type === "HR") {
    fallbackQ = "Your co-founder wants to rewrite the complete database in Rust, but the hackathon ends in 24 hours. How do you resolve this technical conflict?";
  }
  res.json({ question: fallbackQ });
});

app.post("/api/ai/mock-interview/submit", async (req, res) => {
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
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.4
        }
      });
      const clean = (response.text || "").replace(/```json/g, "").replace(/```/g, "").trim();
      return res.json(JSON.parse(clean));
    } catch (e: any) {
      console.warn("Gemini interview-submit unavailable. Activated local scoring mechanism.", e?.message || e);
    }
  }

  // Backup scoring mechanism
  const localScore = Math.min(95, Math.max(55, 45 + userAnswer.split(" ").length * 1.5));
  res.json({
    score: localScore,
    feedback: [
      "Your answer shows sound conceptual familiarity! Great job on outlining the high-level flow.",
      "To improve, explicitly outline the exact files or database commands used (e.g. Mongoose findOneAndUpdate, transaction locks)."
    ],
    exemplarAnswer: "To handle high concurrency safely, we implement atomic updates on the server level. In MongoDB, we use unique indexes or schema validation, coupled with retry locks on the Node layer."
  });
});

// 5. Career Roadmap Generator API
app.post("/api/ai/career-roadmap", async (req, res) => {
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
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.3
        }
      });
      const clean = (response.text || "").replace(/```json/g, "").replace(/```/g, "").trim();
      return res.json(JSON.parse(clean));
    } catch (e: any) {
      console.warn("Gemini roadmap unavailable. Running default high-quality roadmap template fallback.", e?.message || e);
    }
  }

  // Backup static roadmap selector
  let defaultRoadmap = {
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
});

// 6. AI Project Generator API
app.post("/api/ai/project-generator", async (req, res) => {
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
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.4
        }
      });
      const clean = (response.text || "").replace(/```json/g, "").replace(/```/g, "").trim();
      return res.json(JSON.parse(clean));
    } catch (e: any) {
      console.warn("Gemini project generator currently restricted or unavailable. Gracefully mapping custom offline developer blueprints.", e?.message || e);
    }
  }

  // Fallback engine
  res.json({
    title: `${domain} ProFlow`,
    tagline: `Unlocking seamless ${domain} pipelines for high-growth student squads.`,
    summary: `A production-level system designed to tackle critical friction points in the ${domain} ecosystem. Specially optimized for an agile team of ${size} developers operating in intermediate cycles.`,
    keyFeatures: [
      "Dynamic data aggregation layer with lazy-loaded modules",
      "Responsive metric dashboard integrated with SVG charting",
      "Collaborative multiplayer team sockets with notification indicators",
      "Secure credential scoping using JWT tokens and robust route guards"
    ],
    techStack: {
      db: "MongoDB & Mongoose schemas",
      frontend: "React with TypeScript & high-performance Tailwind CSS",
      server: "Express Node.js custom applet container on Port 3000",
      extra: "Gemini API text-generation models for predictive auditing"
    },
    milestones: [
      { title: "Stage 1: Core API & DB schemas", timeline: "Weeks 1-2", aim: "Establish full-stack routes with mock verification layers." },
      { title: "Stage 2: Interface & State stitching", timeline: "Weeks 3-4", aim: "Implement responsive mobile-first Tailwind layouts and real-time state hooks." },
      { title: "Stage 3: End-to-end testing & Deploy", timeline: "Weeks 5-6", aim: "Configure Docker containers, check linter directives, and publish." }
    ],
    proposedSchema: `const UserRecordSchema = new Mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  metricValue: { type: Number, default: 0 },
  contributions: [{ id: String, loggedAt: Date }],
  metadata: { type: Map, of: String }
});`
  });
});


// 10. Notifications
app.get("/api/notifications", async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.json(dbState.notifications);
  }

  try {
    const userId = dbState.user.id || "student_ashish";
    const notifs = await NotificationModel.find({ userId }).sort({ createdAt: -1 });
    const mapped = notifs.map(n => ({
      id: n._id.toString(),
      userId: n.userId,
      title: n.title,
      message: n.message,
      type: n.type,
      read: n.read,
      createdAt: (n as any).createdAt ? (n as any).createdAt.toISOString() : new Date().toISOString()
    }));
    res.json(mapped);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// 7. AI LinkedIn Post Compiler Proxy Route
app.post("/api/professional/ai-post", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: "Missing prompt" });

  const ai = getGeminiClient();
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `You are a professional technical Career Coach and personal branding strategist.
Modify and compile the following collegiate achievement into a high-impact, highly engaging, professional LinkedIn-style post. Add relevant structured takeaways, bullet points, and clean hashtags. Make it inspire peers and catch the attention of tech recruiters.
Achievement details: "${prompt}"

Respond with ONLY the final post body. Avoid markdown intro headers or chatter.`,
        config: {
          temperature: 0.7
        }
      });
      return res.json({ text: response.text || "" });
    } catch (e: any) {
      console.warn("Gemini LinkedIn compiler currently offline or limited:", e?.message || e);
    }
  }

  // Fallback
  return res.json({ text: "" });
});

app.post("/api/notifications/:id/read", async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    const { id } = req.params;
    const notif = dbState.notifications.find(n => n.id === id);
    if (notif) {
      notif.read = true;
      saveDb();
    }
    return res.json({ success: true, notif: notif || null });
  }

  try {
    const { id } = req.params;
    const notif = await NotificationModel.findById(id);
    if (notif) {
      notif.read = true;
      await notif.save();
    }
    res.json({ success: true, notif: notif ? { ...notif.toObject(), id: notif._id.toString() } : null });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/notifications/read-all", async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    dbState.notifications.forEach(n => {
      n.read = true;
    });
    saveDb();
    return res.json({ success: true });
  }

  try {
    const userId = dbState.user.id || "student_ashish";
    await NotificationModel.updateMany({ userId }, { $set: { read: true } });
    res.json({ success: true });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


// 11. Admin Moderation & Live Analytics Hub
app.get("/api/admin/analytics", async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    const randomizer = Math.floor(Math.random() * 20 - 10);
    const realTimeAnal = {
      dau: (dbState.analytics?.dau || 48) + randomizer,
      activeProjects: dbState.projects.length + 300,
      internshipApplications: dbState.internships.reduce((acc, current) => acc + current.applicantsCount, 1420),
      matchRateSaaS: 94
    };
    return res.json(realTimeAnal);
  }

  try {
    const activeProjects = await ProjectModel.countDocuments();
    const activeHackathons = await HackathonModel.countDocuments();
    const activeMentors = await MentorModel.countDocuments();
    const activeUsers = await UserModel.countDocuments();

    res.json({
      dau: 45 + Math.floor(Math.random() * 12),
      activeProjects: activeProjects + 120,
      internshipApplications: 34 + Math.floor(activeUsers * 1.5),
      matchRateSaaS: 94
    });
  } catch (err: any) {
    res.json({
      dau: 45,
      activeProjects: 312,
      internshipApplications: 1420,
      matchRateSaaS: 92
    });
  }
});

app.get("/api/admin/stats", async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    const randomizer = Math.floor(Math.random() * 20 - 10);
    const realTimeAnal = {
      dau: (dbState.analytics?.dau || 48) + randomizer,
      activeProjects: dbState.projects.length + 300,
      internshipApplications: dbState.internships.reduce((acc, current) => acc + current.applicantsCount, 1420),
      matchRateSaaS: 94
    };
    return res.json(realTimeAnal);
  }

  try {
    const activeProjects = await ProjectModel.countDocuments();
    const activeHackathons = await HackathonModel.countDocuments();
    const activeMentors = await MentorModel.countDocuments();
    const activeUsers = await UserModel.countDocuments();

    res.json({
      dau: 45 + Math.floor(Math.random() * 12),
      activeProjects: activeProjects + 120,
      internshipApplications: 34 + Math.floor(activeUsers * 1.5),
      matchRateSaaS: 94
    });
  } catch (err: any) {
    res.json({
      dau: 45,
      activeProjects: 312,
      internshipApplications: 1420,
      matchRateSaaS: 92
    });
  }
});

app.post("/api/admin/reset", (req, res) => {
  dbState = {
    user: JSON.parse(JSON.stringify(DEFAULT_USER)),
    projects: JSON.parse(JSON.stringify(DEFAULT_PROJECTS)),
    teams: JSON.parse(JSON.stringify(DEFAULT_TEAMS)),
    applications: JSON.parse(JSON.stringify(DEFAULT_APPLICATIONS)),
    hackathons: JSON.parse(JSON.stringify(DEFAULT_HACKATHONS)),
    internships: JSON.parse(JSON.stringify(DEFAULT_INTERNSHIPS)),
    mentors: JSON.parse(JSON.stringify(DEFAULT_MENTORS)),
    sessions: JSON.parse(JSON.stringify(DEFAULT_SESSIONS)),
    chats: JSON.parse(JSON.stringify(DEFAULT_CHATS)),
    notifications: JSON.parse(JSON.stringify(DEFAULT_NOTIFICATIONS)),
    analytics: JSON.parse(JSON.stringify(DEFAULT_ANALYTICS)),
    channelMessages: JSON.parse(JSON.stringify(DEFAULT_CHANNEL_MESSAGES)),
    followers: []
  };
  saveDb();
  res.json({ success: true });
});

app.get("/api/admin/moderation", (req, res) => {
  // Collect logs of active platform items representing safety checks
  res.json({
    pendingApprovalCompanies: [
      { id: "comp_1", name: "EduGrow Tech Labs", contact: "contact@edugrow.io", requestedAt: "2026-06-11T12:00:00Z" }
    ],
    reportsOfPlagiarism: [
      { id: "rep_1", reportedItem: "Project: NFT Card-Deck", reporter: "Deepak Rawat", reason: "Copied code from standard boilerplate tutorial.", status: "Pending Action" }
    ]
  });
});

app.post("/api/admin/action", async (req, res) => {
  if (mongoose.connection.readyState !== 1) {
    const { targetId, action } = req.body;
    if (action === "Delete") {
      dbState.projects = dbState.projects.filter(p => p.id !== targetId);
      saveDb();
    }
    return res.json({ success: true, message: `Action '${action}' was run successfully against target entity.` });
  }

  try {
    const { targetId, action } = req.body; // e.g. "Delete" or "Approve"
    if (action === "Delete") {
      await ProjectModel.findByIdAndDelete(targetId);
    }
    res.json({ success: true, message: `Action '${action}' was run successfully against target entity.` });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


// Vite Asset Gating Middleware Configuration

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SkillCollab Build] Server running continuously at http://0.0.0.0:${PORT}`);
    // Connect to MongoDB Atlas Connection Pool
    MongoDBService.getInstance().connect()
      .then(() => console.info("[Bootstrap] MongoDB Atlas Connection pool established successfully."))
      .catch((err) => {
        if (err?.message?.includes("ECONNREFUSED") || err?.name === "MongooseServerSelectionError" || err?.message?.includes("MongooseServerSelectionError")) {
          console.info("[Bootstrap] Offline fallback activated: Local MongoDB is offline/unresolved. SkillCollab operates stably using full file-based dbState mock fallbacks.");
        } else {
          console.warn("[Bootstrap] MongoDB Atlas Connection deferred or initialized under offline fallback:", err?.message || err);
        }
      });
  });
}

startServer();
