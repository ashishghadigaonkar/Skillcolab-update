/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserRole } from "../types";

export const DEFAULT_USER = {
  firebaseUid: "student_ashish",
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

export const DEFAULT_PROJECTS = [
  {
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
    milestones: [
      { id: "mc1", title: "Eco-deeds Logging Form", description: "Build forms supporting standard touch inputs", status: "Done", dueDate: "2026-06-12" },
      { id: "mc2", title: "D3 Data Visualization Integration", description: "Map campus carbon indices", status: "Pending", dueDate: "2026-06-25" }
    ],
    attachments: []
  },
  {
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
    milestones: [
      { id: "md1", title: "Contract Testing", description: "Execute gas optimization trials on private network", status: "Done", dueDate: "2026-06-10" },
      { id: "md2", title: "Express Middleware proxy gating", description: "Design cryptographic token validation routing", status: "Pending", dueDate: "2026-06-28" }
    ],
    attachments: []
  }
];

export const DEFAULT_TEAMS = [
  {
    projectId: "proj_1",
    projectTitle: "AI Study Buddy",
    leaderId: "user_rohan",
    members: [
      { userId: "user_rohan", fullName: "Rohan Sharma", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80", role: "Backend Developer & PM", joinedAt: new Date("2026-06-01T08:00:00Z") },
      { userId: "user_sneha", fullName: "Sneha Nair", avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100&q=80", role: "UI/UX Designer", joinedAt: new Date("2026-06-02T11:00:00Z") }
    ],
    invitees: []
  },
  {
    projectId: "proj_2",
    projectTitle: "EcoCampus Carbon Tracker",
    leaderId: "user_priya",
    members: [
      { userId: "user_priya", fullName: "Priya Patel", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80", role: "Fullstack Lead", joinedAt: new Date("2026-06-05T12:00:00Z") }
    ],
    invitees: []
  }
];

export const DEFAULT_APPLICATIONS = [
  {
    projectId: "proj_1",
    projectTitle: "AI Study Buddy",
    applicantId: "user_ankit",
    applicantName: "Ankit Jha",
    applicantAvatar: "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=100&h=100&q=80",
    applicantHeadline: "Python Scripting Enthusiast | Devops Explorer",
    applicantSkills: ["Python", "FastAPI", "Docker", "Git"],
    requestedRole: "AI / Data Engineer",
    coverLetter: "I have experience setting up secure API pathways. Your project is exactly the kind of smart app I want to help deploy. I am familiar with the modern GenAI libraries.",
    status: "Pending"
  }
];

export const DEFAULT_HACKATHONS = [
  {
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
    rules: "1. Open to enrolled college students only.\n2. Teams can range from 1 to 4 individuals.\n3. Implement a web or mobile working layout.\n4. AI components must run safely in container boundaries."
  },
  {
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
    rules: "1. All smart contracts must be verifiable on-chain.\n2. Visual tracking charts are mandatory."
  }
];

export const DEFAULT_INTERNSHIPS = [
  {
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
    applicantsCount: 1,
    applicants: [
      {
        userId: "user_sneha",
        fullName: "Sneha Nair",
        avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100&q=80",
        appliedAt: new Date("2026-06-11T09:00:00Z"),
        status: "Reviewing"
      }
    ]
  },
  {
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

export const DEFAULT_MENTORS = [
  {
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
    ]
  },
  {
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
    ]
  }
];

export const DEFAULT_SESSIONS = [
  {
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

export const DEFAULT_CHATS = [
  {
    threadId: "proj_1",
    title: "AI Study Buddy - Team",
    avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=100&h=100&q=80",
    type: "Project",
    lastMessage: "Rohan: Just updated the backend server mock configuration.",
    lastMessageTime: new Date()
  },
  {
    threadId: "mentor_nitin",
    title: "Nitin Kamath (Google)",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&h=150&q=80",
    type: "Direct",
    lastMessage: "Nitin: Looking forward to reviewing your portfolio live on Monday!",
    lastMessageTime: new Date()
  }
];

export const DEFAULT_NOTIFICATIONS = [
  {
    userId: "student_ashish",
    title: "Mentorship Session Scheduled",
    message: "Your session with Nitin Kamath from Google Cloud is approved for Monday June 15.",
    type: "Update",
    read: false
  },
  {
    userId: "student_ashish",
    title: "New Hackathon Announced",
    message: "Google AI Smart Campus 2026 has opened registrations, with over 5L INR in prizes.",
    type: "Update",
    read: true
  }
];

export const DEFAULT_STARTUP_IDEAS = [
  {
    title: "UniMeal Gifting Portal",
    description: "Allow parents and friends to gift dynamic dining credits to campus canteens easily tracking dietary scores.",
    problem: "Students struggle with healthy eating and running out of canteen allowance at the end of semesters.",
    solution: "A simple micro-subscription ledger integrating QR verification codes at regional food-joints.",
    tags: ["Campus Tech", "Fintech", "Health & Wellness"],
    authorId: "user_priya",
    authorName: "Priya Patel",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80",
    authorRole: "B.Tech Sophomore",
    neededRoles: ["Frontend Specialist", "Merchant Integrator"],
    equityOffer: "15% Equity"
  }
];
