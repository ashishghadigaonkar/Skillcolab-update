import { 
  User, UserRole, Project, Team, TeamApplication, 
  Hackathon, InternshipPost, Mentor, MentorshipSession, 
  ChatThread, Notification, SystemAnalytics, FollowerRelation 
} from "../../types";

export const DEFAULT_USER: User = {
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
  followersCount: 120,
  theme: "light",
  settings: {
    theme: "light"
  }
};

export const DEFAULT_PROJECTS: Project[] = [
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

export const DEFAULT_TEAMS: Team[] = [
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

export const DEFAULT_APPLICATIONS: TeamApplication[] = [
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

export const DEFAULT_HACKATHONS: Hackathon[] = [
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

export const DEFAULT_INTERNSHIPS: InternshipPost[] = [
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

export const DEFAULT_MENTORS: Mentor[] = [
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

export const DEFAULT_SESSIONS: MentorshipSession[] = [
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

export const DEFAULT_CHATS: ChatThread[] = [
  {
    id: "proj_1",
    title: "AI Study Buddy - Team",
    avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=100&h=100&q=80",
    type: "Projects" as any,
    lastMessage: "Rohan: Just updated the backend server mock configuration.",
    lastMessageTime: "2 hours ago",
    unreadCount: 0,
    messages: [
      { id: "m_1", senderId: "user_sneha", senderName: "Sneha Nair", senderAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100&q=80", content: "Hi team! I uploaded the draft wireframes for our dashboard layouts.", timestamp: "10:15 AM", reactions: { "👍": 2 } },
      { id: "m_2", senderId: "user_rohan", senderName: "Rohan Sharma", senderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80", content: "Awesome, they look crisp. I'm now finishing up the authentication schema models. Just updated the backend server mock configuration.", timestamp: "11:20 AM", reactions: { "🚀": 1 } }
    ]
  },
  {
    id: "mentor_nitin",
    title: "Nitin Kamath (Google)",
    avatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&h=150&q=80",
    type: "Mentors" as any,
    lastMessage: "Nitin: Looking forward to reviewing your portfolio live on Monday!",
    lastMessageTime: "Yesterday",
    unreadCount: 1,
    messages: [
      { id: "m_a1", senderId: "student_ashish", senderName: "Ashish Ghadigaonkar", senderAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80", content: "Hello Nitin, I scheduled our layout review. I am mainly stuck on micro-service telemetry structures.", timestamp: "06:10 PM" },
      { id: "m_a2", senderId: "mentor_nitin", senderName: "Nitin Kamath", senderAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&h=150&q=80", content: "No problem. We will cover cloud-watch logging and scalable file store proxies. Looking forward to reviewing your portfolio live on Monday!", timestamp: "07:30 PM", reactions: { "🔥": 2 } }
    ]
  },
  {
    id: "conn_chat_user_priya",
    title: "Priya Patel",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
    type: "Connections" as any,
    lastMessage: "Priya: I loved your recent AWS certification announcement, congrats!",
    lastMessageTime: "Yesterday",
    unreadCount: 0,
    messages: [
      { id: "m_p1", senderId: "user_priya", senderName: "Priya Patel", senderAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80", content: "Hi Ashish, thanks for accepting my connection request! I loved your recent AWS certification announcement, congrats!", timestamp: "04:30 PM", reactions: { "👏": 3 } }
    ]
  },
  {
    id: "team_superchain",
    title: "Superchain Devs",
    avatar: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&w=150&h=150&q=80",
    type: "Teams" as any,
    lastMessage: "Vijay: Submissions deadline is tonight, team!",
    lastMessageTime: "3 hours ago",
    unreadCount: 2,
    messages: [
      { id: "m_sc1", senderId: "user_sneha", senderName: "Sneha Nair", senderAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100&q=80", content: "Did we compile the smart contract artifacts to the /build folder?", timestamp: "08:12 AM" },
      { id: "m_sc2", senderId: "user_rohan", senderName: "Rohan Sharma", senderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80", content: "Yes! Deploy scripts are fully verified on local testbed.", timestamp: "09:00 AM" },
      { id: "m_sc3", senderId: "mentor_ayesha", senderName: "Ayesha Qureshi", senderAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80", content: "Superb. Submissions deadline is tonight, team! Compile early.", timestamp: "11:45 AM", reactions: { "👍": 2 } }
    ]
  },
  {
    id: "recruiter_sarah",
    title: "Sarah Jenkins (Google HR)",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80",
    type: "Recruiters" as any,
    lastMessage: "Sarah: Your technical screening scores were excellent. Let's arrange a fit check.",
    lastMessageTime: "2 days ago",
    unreadCount: 0,
    messages: [
      { id: "m_r1", senderId: "recruiter_sarah", senderName: "Sarah Jenkins", senderAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80", content: "Hi Ashish, I saw your application for the Cloud Engineering vacancy on SkillCollab. Your technical screening scores were excellent. Let's arrange a fit check.", timestamp: "02:15 PM" }
    ]
  },
  {
    id: "startup_aditya",
    title: "Aditya Sen (Founder, EtherPulse)",
    avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80",
    type: "Startup Teams" as any,
    lastMessage: "Aditya: We have our co-founder alignment pitch in Bangalore next Friday. Are you free?",
    lastMessageTime: "3 days ago",
    unreadCount: 0,
    messages: [
      { id: "m_st1", senderId: "startup_aditya", senderName: "Aditya Sen", senderAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80", content: "Hey Ashish! I read your proposal regarding the distributed multi-channel routing node. It is highly innovative. We have our co-founder alignment pitch in Bangalore next Friday. Are you free?", timestamp: "11:00 AM", reactions: { "💡": 1 } }
    ]
  }
];

export const DEFAULT_NOTIFICATIONS: Notification[] = [
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

export const DEFAULT_ANALYTICS: SystemAnalytics = {
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

export const DEFAULT_CHANNEL_MESSAGES: Record<string, any[]> = {
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

export const DEFAULT_ACTIVITIES: any[] = [
  {
    id: "act_1",
    userId: "student_sneha",
    authorName: "Sneha Nair",
    authorRole: "Lead Product Designer",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
    type: "SocialPost",
    content: "Designing cohesive, highly polished, and professional visual grids is always more impactful than loading standard templates. In our Fintech squad, we worked through endless visual presets to choose ONE extremely refined theme. What is your go-to typography pairings for building clean dashboard tools? ✨",
    skills: ["Figma", "Design Systems", "UI/UX"],
    likesCount: 22,
    commentsCount: 1,
    sharesCount: 1,
    likes: ["student_ashish"],
    saves: [],
    comments: [
      { id: "cm_1", author: "Ashish Ghadigaonkar", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80", text: "I highly recommend Space Grotesk paired with JetBrains Mono for a professional startup dashboard aesthetic!", time: "1 hour ago" }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString()
  },
  {
    id: "act_2",
    userId: "student_ashish",
    authorName: "Ashish Ghadigaonkar",
    authorRole: "Fullstack Lead Developer (You)",
    authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
    type: "CertificationPost",
    content: "Thrilled to share that I have successfully completed the AWS Cloud Practitioner Certification! ☁️ Looking forward to leveraging scalable VPCs and IAM credential scoping blocks to architect more robust, enterprise-grade cloud native backends for our startup portfolios.",
    skills: ["AWS Cloud", "IAM Scopes", "Security"],
    likesCount: 48,
    commentsCount: 1,
    sharesCount: 5,
    likes: ["student_sneha", "mentor_nitin"],
    saves: [],
    comments: [
      { id: "cm_2", author: "Nitin Kamath", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80", text: "Phenomenal work Ashish! This cloud certification combined with your Node.js experience is a premium matching score.", time: "4 hours ago" }
    ],
    createdAt: new Date(Date.now() - 1000 * 60 * 120).toISOString()
  },
  {
    id: "act_3",
    userId: "org_gdsc",
    authorName: "Google GDSC Tech Team",
    authorRole: "Official Campus Partner",
    authorAvatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&h=150&q=80",
    type: "HackathonOpportunity",
    content: "🚨 NEXT GENERATION GENAI HACKATHON IS NOW LIVE! Register your team blocks in the hackathons tab. Over $15K in prize pools, mentorship interviews with Google engineers, and a custom Gemini Developer badge for all verified submissions.",
    skills: ["Gemini API", "FastAPI", "React", "Next.js"],
    likesCount: 156,
    commentsCount: 0,
    sharesCount: 18,
    likes: ["student_ashish"],
    saves: [],
    comments: [],
    opportunityMeta: {
      id: "hack_1",
      title: "AI Studio Hackathon 2026",
      description: "Build native Android & Web apps with Gemini Multimodal Models",
      opportunityType: "hackathon",
      deadline: "June 25, 2026",
      location: "Virtual / Campus Hub",
      starsCount: 480
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 300).toISOString()
  },
  {
    id: "act_4",
    userId: "mentor_nitin",
    authorName: "Nitin Kamath",
    authorRole: "VP of Engineering at CloudSecure",
    authorAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80",
    type: "InternshipOpportunity",
    content: "We're hiring 3 Cloud DevOps Interns at CloudSecure! If you have hands-on familiarity with Kubernetes clusters, AWS S3 buckets, and github actions, apply today. We care strictly about your active GitHub project milestones, not college name plates.",
    skills: ["Kubernetes", "AWS Cloud", "Linux Bash", "GitHub Actions"],
    likesCount: 92,
    commentsCount: 0,
    sharesCount: 11,
    likes: ["student_ashish"],
    saves: ["student_ashish"],
    comments: [],
    opportunityMeta: {
      id: "intern_1",
      role: "Cloud DevOps Intern",
      companyName: "CloudSecure Systems",
      companyLogo: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=50&h=50&q=80",
      opportunityType: "internship",
      deadline: "June 30, 2026",
      location: "Remote / Hybrid Bangalore"
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 600).toISOString()
  },
  {
    id: "act_5",
    userId: "student_rohan",
    authorName: "Rohan Sharma",
    authorRole: "Backend Core Builder",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80",
    type: "ConnectionActivity",
    content: "Rohan Sharma joined Project AI Career Assistant. He just matched with the core build squad to compile our vector matching logic in the startup hub!",
    skills: ["Teamwork", "Career Match", "Advisory"],
    likesCount: 18,
    commentsCount: 0,
    sharesCount: 0,
    likes: ["student_ashish"],
    saves: [],
    comments: [],
    createdAt: new Date(Date.now() - 1000 * 60 * 800).toISOString()
  },
  {
    id: "act_6",
    userId: "mentor_ayesha",
    authorName: "Ayesha Qureshi",
    authorRole: "Stripe Operations Advisor",
    authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100&q=80",
    type: "MentorRecommendation",
    content: "I have opened up 4 slots for 1-on-1 portfolio auditing and design reviews this week! We'll audit your active GitHub links, cover letters, and help compile standard Stripe SDK hooks for high-frequency transactions.",
    skills: ["Stripe Connect", "API Auditing", "Career Growth"],
    likesCount: 35,
    commentsCount: 0,
    sharesCount: 1,
    likes: [],
    saves: [],
    comments: [],
    opportunityMeta: {
      id: "mentor_ayesha",
      opportunityType: "mentor",
      mentorAvailability: "Mon & Wed afternoons",
      price: "Free for vetted students"
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 1000).toISOString()
  },
  {
    id: "act_7",
    userId: "student_priya",
    authorName: "Priya Sharma",
    authorRole: "MERN Stack Specialist",
    authorAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&h=100&q=80",
    type: "AchievementPost",
    content: "Priya Sharma merged 5 pull requests this week in the Open Source Kubernetes sandbox project! Helping standardizing deployment clusters for containerized microservice architectures.",
    skills: ["Open Source", "Kubernetes", "Pull Request"],
    likesCount: 65,
    commentsCount: 0,
    sharesCount: 0,
    likes: ["student_ashish", "student_sneha"],
    saves: [],
    comments: [],
    createdAt: new Date(Date.now() - 1000 * 60 * 1200).toISOString()
  },
  {
    id: "act_8",
    userId: "startup_founder_rahul",
    authorName: "Rahul Dev",
    authorRole: "Founder at EcoLogix",
    authorAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    type: "StartupOpportunity",
    content: "EcoLogix is launching its second capital round! We're building AI-automated supply chain carbon auditing. Looking to matching with student co-founders who want to lead the React/TypeScript frontend core build squad.",
    skills: ["MongoDB", "React & Tailwind", "Express Node.js"],
    likesCount: 45,
    commentsCount: 0,
    sharesCount: 2,
    likes: [],
    saves: [],
    comments: [],
    opportunityMeta: {
      id: "startup_ecologix",
      title: "EcoLogix AI",
      opportunityType: "startup",
      role: "Lead Frontend Partner",
      description: "Auto carbon auditing platform utilizing Gemini API models."
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 1500).toISOString()
  },
  {
    id: "act_9",
    userId: "os_kubernetes",
    authorName: "Kubernetes Starter",
    authorRole: "Open Source Advocate",
    authorAvatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=100&h=100&q=80",
    type: "OpenSourceOpportunity",
    content: "A beginners-friendly issue is open in Kubernetes cloud-native integration repo: 'Refactor standard YAML loader parameters for multi-tier microservices.' This is a supreme starting block for student dev applicants!",
    skills: ["Go", "Kubernetes", "YAML", "Docker"],
    likesCount: 110,
    commentsCount: 0,
    sharesCount: 0,
    likes: [],
    saves: [],
    comments: [],
    opportunityMeta: {
      id: "os_issue_1",
      title: "Refactor standard YAML loader",
      opportunityType: "opensource",
      githubLink: "https://github.com/kubernetes/kubernetes/issues/10927",
      issueTitle: "Fix multi-tier microservice config load warnings"
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 2000).toISOString()
  },
  {
    id: "act_10",
    userId: "career_ai",
    authorName: "SkillCollab AI Agent",
    authorRole: "Automated Placement Coach",
    authorAvatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&h=150&q=80",
    type: "AIInsight",
    content: "💡 AI Career Insight: Solidity developers specialized in REST/gRPC microservice wrappers are experiencing an increased matching pool of 42% on startup boards this week. Recommend prioritizing AWS IAM Cloud Practitioner courses or standard Docker setups to stand out.",
    skills: ["Solidity", "Docker", "gRPC", "Market Trends"],
    likesCount: 88,
    commentsCount: 0,
    sharesCount: 1,
    likes: ["student_ashish"],
    saves: [],
    comments: [],
    createdAt: new Date(Date.now() - 1000 * 60 * 2400).toISOString()
  }
];
