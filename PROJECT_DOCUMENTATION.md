# SkillCollab Product & System Architecture Documentation
*Version: 1.0.0-PROD*  
*Authors: Senior Technical Writer, Software Architect, Solution Architect, and Lead Developer*

---

## 1. Project Overview

### 1.1 Project Name
**SkillCollab**

### 1.2 Purpose
SkillCollab is an advanced full-stack peer-to-peer collaboration, hackathon team-builder, mentor scheduling, and professional development hub tailored specifically for college campuses. It acts as an elite technical ecosystem where students form multi-disciplinary startup squads, sync their active open-source contributions, book industrial technical mentors, apply for vetted local startup internships, and receive real-time, context-aware artificial intelligence recommendations powered by the `@google/genai` TypeScript SDK.

### 1.3 Vision
To bridge the critical gap between academic curriculum guidelines and real-world micro-startup experiences. SkillCollab builds a borderless campus-wide network that rewards verifiable skills, open-source pedigree, and completed milestones—empowering the next generation of engineers, developers, designers, and managers to build real-world products with durable tech stacks and industrial standards.

### 1.4 Problems Solved
- **Academic Silos:** College campuses suffer from a severe separation of departments, meaning business, engineering, and design students rarely meet to build functional mockups.
- **Cold-Start Resume Dilemma:** Junior developers struggle to cross ATS screening barriers due to a lack of quantitative X-Y-Z achievements.
- **Unverified Competencies:** Recruiters must filter through dozens of duplicate self-reported resumes without verifiable proof of skills or team collaboration capabilities.
- **Mock-Everything Burnout:** Students waste energy writing code in a vacuum, with no system feedback, professional mentorship networks, or team organization pipelines.

### 1.5 Target Users
1. **The Student & Aspiring Founder:** Looking to join or create active projects, register collegiate hackathon rosters, and access AI career guidance.
2. **The Industry Mentor:** Seeking highly engaged student portfolios to review, offering slots for 120ms latency mock interviews, and mapping career steps.
3. **The Recruiter & Startup Founder:** Looking to post internships, scrutinize student project contribution milestones, view validated achievements, and hire candidates.
4. **The Admin / College Administrator:** Operating moderation filters, viewing Daily Active Users (DAU) analytics, and resetting simulated state variables.

---

## 2. Technology Stack & Decision Matrix

SkillCollab is structured as a full-stack, decoupled-component React SPA backed by an active, high-ingress Express.js server, relying on dual-engine persistence (Mongoose MongoDB Atlas integration + high-fidelity flat file-based JSON state containers).

| Layer / Service | Technology Selected | Rationale for Use |
| :--- | :--- | :--- |
| **Frontend UI Core** | React 19.x + TypeScript | Functional component structures, hooks-based state orchestration, extreme modularity, and high-quality type safety across props. |
| **Styling Architecture** | Tailwind CSS v4.0.0 | High-performance, compile-to-utility visual layering. Avoids bloated separate layout stylesheets and speeds up DOM repaints. |
| **Compiler & Dev Bundler** | Vite 6.x | Fast dev bundler. Provides optimized static assets in the `/dist` directory for production deployment. |
| **Web Server** | Node.js + Express.js | Low-latency middleware pipeline. Handles REST routes, handles CORS, proxies API endpoints, and serves React index pages. |
| **API Bundler / Transpiler** | Esbuild + TSX | Fast bundler for server scripts. Converts `server.ts` to `dist/server.cjs` and handles native TypeScript compilation. |
| **Primary Database (Cloud)** | MongoDB Atlas + Mongoose | Highly schema-flexible document database. Fits nested project milestones, user experience arrays, and complex chat thread payloads. |
| **Local Offline Fallback** | JSON Flat-File State Store | Robust file persistence (`src/mock_db_store.json`) when local MongoDB is offline, guaranteeing students never lose data. |
| **Authentication Service** | Firebase Client SDK + Auth | Fast Google and GitHub OAuth popups with secure state persistence (local token validation) or high-fidelity simulation fallbacks. |
| **Core AI Orchestration** | `@google/genai` SDK | Accesses official Google Gemini 2.5 models for generating resume scores, career roadmaps, interview analysis, and recommendations. |
| **Micro-Animations** | Motion (`motion/react`) | Fluid card entries, transition fades, and micro-hover parameters for premium visual design. |
| **Iconography** | Lucide React | Clean, responsive modern SVG icons. Implemented directly in JSX with zero external stylesheet dependencies. |

---

## 3. Directory Layout & Folder Structure

```
├── .env.example                     # Environment configuration template (Gemini API keys, App URL)
├── .gitignore                       # Ignored file patterns (node_modules, /dist, local secrets)
├── firebase-applet-config.json      # Client-side configuration for Firebase Auth integration
├── index.html                       # Base HTML mounting harness for Vite frontend
├── metadata.json                    # App name, description, capabilities, and permissions
├── package.json                     # Dependency manager, script execution commands, package versioning
├── server.ts                        # Master Express server codebase (REST endpoints, Gemini integration)
├── tsconfig.json                    # Strict type compiling and resolution parameters
├── vite.config.ts                   # Host binding, React plugin, and utility routing settings
├── assets/                          # Static images, screenshots, mock assets, and logos
└── src/
    ├── App.tsx                      # Primary frontend entrypoint, routing hub, and core layout
    ├── index.css                    # Tailwind CSS import directives, typography definitions, and global themes
    ├── main.tsx                     # React 19 DOM rendering hook mount point
    ├── mock_db_store.json           # File-based local database persistence store (JSON container)
    ├── types.ts                     # Universal TypeScript type contracts, interfaces, and enums
    └── components/                  # Modular, reusable high-fidelity layouts and views
        ├── AICareerSuite.tsx        # Career helper (Resume builder, Mock interview, Roadmap)
        ├── AdminConsole.tsx         # Analytical dashboards, reset mechanisms, and logs
        ├── Dashboard.tsx            # Main user landing interface, quick metrics, and profile edit
        ├── DeveloperBlueprint.tsx   # Extensive architectural specifications and design patterns
        ├── HackathonHub.tsx         # Platform for hackathon teams, rules, and mock registration
        ├── HomeFeed.tsx             # Collegiate micro-blog, post liking, and comment engine
        ├── InternshipBoard.tsx      # Job boards, applicant tracking, and recruiter views
        ├── MentorNetwork.tsx        # Technical mentor booking interface and rating lists
        ├── MyUserProfile.tsx        # Student portfolio view and resume/links synchronization
        ├── OpenSourceHub.tsx        # Interactive GitHub issue tracker and verification logger
        ├── ProjectMarketplace.tsx   # Project list, creation, applicant management, and task boards
        ├── RecommendationEngine.tsx # Dual-engine semantic matching scoring dashboard (Gemini + Local)
        ├── StartupLaunchpad.tsx     # Co-founder board and AI business idea generator
        ├── TeamBuilder.tsx          # Real-time workforce rostering, team views, and invites
        └── WorkspaceChat.tsx        # Threaded collaborative team channels and peer DM inbox
    └── services/                    # Core abstraction layers
        ├── firebase.ts              # Firebase auth interface and mock offline auth state managers
        ├── mongodbService.ts        # MongoDB Atlas connection manager & Mongoose schemas
        ├── productionServices.ts    # Production mock data models and live endpoints
        └── seedData.ts              # Pre-seeded database profiles (projects, teams, users, etc.)
```

---

## 4. System Architecture

SkillCollab uses a high-performance, full-stack, single-entry architecture, detailed in the diagram below:

### 4.1 System Topology Diagram

```
+-----------------------------------------------------------------------------------------+
|                                    CLIENT BROWSER LAYER (React)                          |
|                                                                                         |
|  [App.tsx (Main Layout)]                                                                |
|      |                                                                                  |
|      +--> [Dashboard.tsx] [ProjectMarketplace.tsx] [WorkspaceChat.tsx] [AICareerSuite.tsx] |
|      |                                                                                  |
|      +--> [FirebaseAuthService (Firebase SDK Client)]                                   |
+-------------------------------------------------------------|---------------------------+
                                                              | HTTPS / REST
                                                              | WebSocket Simulation
                                                              v
+-----------------------------------------------------------------------------------------+
|                                      BACKEND APP ENGINE (Express)                        |
|                                                                                         |
|  [server.ts]                                                                            |
|      |                                                                                  |
|      +--> [Bearer JWT Validation (Firebase Admin Verification)]                         |
|      +--> [Express Middleware Gating / Routing Layers]                                  |
|      +--> [Gemini SDK Client - (@google/genai)]                                         |
+--------------------------|----------------------------------|---------------------------+
                           | Try Connect                      | Fallback
                           v                                  v
+----------------------------------------+ +----------------------------------------------+
|         CLOUD PERSISTENCE              | |             LOCAL OFFLINE ENGINE             |
|                                        | |                                              |
|  [MongoDB Atlas Database cluster]      | |  [Flat File Store: src/mock_db_store.json]   |
|      - Mongoose schema serialization   | |      - Full state serialization on write     |
|      - Relational reference maps       | |      - Instant in-memory thread mutations    |
+----------------------------------------+ +----------------------------------------------+
```

### 4.2 Architecture Highlights
- **Dynamic Database Bridge:** On boot, `server.ts` tries to connect to MongoDB. If successful, it seeds empty databases and switches to MongoDB document pipelines. If there is a connection timeout or resolve failure (e.g., local MongoDB is offline or unresolved), the system registers an **Offline Fallback**, running directly in-memory and syncing state variables dynamically to `/src/mock_db_store.json`.
- **Hybrid Authenticator Framework:** `FirebaseAuthService` checks if `firebaseConfig.apiKey` contains placeholders. If a custom configuration is provided, it handles real popup sign-ins. If not, it boots a **High-Fidelity Simulated Authentication Engine** that mimics standard token handshakes, maps realistic student parameters, and stores identifiers securely in `localStorage`.
- **Semantic Heuristics:** To avoid API rate-limit errors, the backend utilizes **Lazy-Evaluation Gemini Queries**. It automatically falls back to an offline heuristic scoring algorithm using multi-dimensional skill array intersections, ensuring uninterrupted operation.

---

## 5. User Roles, Permissions, & Workflows

SkillCollab maps permissions dynamically based on the `UserRole` enum declared in `types.ts`.

### 5.1 Student Role
- **Permissions:** Read/Write personal profiles, join/create open projects, participate in hackathons, book mentors, and request co-founders. Cannot delete others' projects or access direct admin configurations.
- **Features:** AI Resume Evaluator, Interactive Technical Mock Interviews, Custom Career Path Roadmap Creator, Real-time peer-to-peer Workspace DMs, Open Source Sync Logs.
- **Workflow (Project Join):**
  1. Student browses `ProjectMarketplace` and clicks a project card.
  2. Selects a role (e.g., "React Developer") and submits a cover letter.
  3. Action spawns a database `TeamApplication` in pending status.
  4. Project creator approves the application; system updates user fields, relocates the student into the core squad directory, and initializes a dedicated project chat channel.

### 5.2 Team Leader Role
- **Permissions:** Same as Student, with tambahan permission schema for complete project milestone management, team configuration modifications, and applicant approvals.
- **Features:** Milestone Builder, Member Management Dashboards, Task checklists.

### 5.3 Mentor Role
- **Permissions:** Manage personal credentials and review bookings. Cannot apply to student-only internship directories.
- **Features:** Scheduling logs, slot availability managers, mock review rating boards.
- **Workflow (Mentor Session):**
  1. Mentor logs in to set available slots (e.g., "Monday, 2:00 PM").
  2. Students discover the mentor profile and reserve an open slot.
  3. System sends a custom notification alert and registers a scheduled mentorship status.

### 5.4 Recruiter Role
- **Permissions:** Read recruitment pipelines, construct and post formal internships.
- **Features:** Resume view, applicant accept/reject status, pipeline boards.

### 5.5 Admin Role
- **Permissions:** Universal system access, moderation controls, database overrides, and direct analytics access.
- **Features:** Moderation console, analytical charts, system-wide database resets.

---

## 6. Detailed System Modules

### 6.1 Authentication Module
Provides secure multi-factor authentication, mapping third-party social tokens directly into internal user accounts.

```
[Social Popups (Google/GitHub)] ---> [Firebase JWT Fetch] ---> [/api/auth/sync Handshake] ---> [Local Session Cookie / State]
```

- **Features:** Automatic profile parsing (captures avatar assets, full names, emails), persistent state.
- **Flow:** Handles token handshakes, matches uid to database documents, creates user profiles if new, and updates local sessions.
- **Fallback:** Boots `SimulatedAuthManager` to emulate OAuth sequences using client-side caches.

### 6.2 User Profile Module
Allows students and mentors to manage their skills, experience, achievements, and connected accounts.
- **Features:** Inline biography editors, dynamic comma-delimited skill lists, professional experience timelines, and link logs (GitHub, LinkedIn).
- **APIs Used:** `GET /api/users/me`, `PUT /api/users/profile`.

### 6.3 Project Marketplace Module
The primary collaboration hub where students draft projects, recruit members, and log progress.
- **Features:** Project filter queries, difficulty level adjustments (Beginner/Intermediate/Advanced), member rosters, milestone checklists, and attachment links.
- **Milestone Process:** Project creators can add milestones with due dates. Any team member can check off a milestone, which triggers a project-wide milestone status update and updates the dashboard progress tracker.

### 6.4 Team Formation Module
Coordinates communication and team composition between project creators and applicants.
- **Invites & Requests:** Allows creators to invite specific students or review pending applications. Approving an applicant adds them to the team roster and updates the project's current team size.

### 6.5 Activity Feed Module
A micro-blogging social feed for campus-wide project updates and technical achievements.
- **Features:** Text updates, category tagging, post liking, and modular comment sections.

### 6.6 Real-Time Chat Module
Durable messaging system mapping multiple workspace models to real-time chats.
- **Features:** Dedicated project channels, direct message peer pools, and instant offline message caching.
- **Architecture:** Simulates instant WebSocket message relays using long-polling queries and local message caches.

### 6.7 Notification Module
Keeps users informed of critical updates across the platform.
- **Triggers:** New project applications, milestone updates, direct messages, and team invites.
- **Delivery:** Sends instant in-app alerts and updates the global notification count.
- **APIs Used:** `GET /api/notifications`, `POST /api/notifications/read-all`.

### 6.8 GitHub Integration Module
Syncs and displays GitHub repositories and active open-source contributions.
- **Features:** Connects GitHub accounts, fetches repos, and rewards users with platform reputation points for merged pull requests.

### 6.9 Hackathon Module
A campus-wide portal for discovering hackathons, managing rosters, and submitting entries.
- **Workflow:** Students can register a team, view rules, and submit project links and pitches.

### 6.10 Mentor Module
Connects students with industry experts for mock interviews, career guidance, and portfolio reviews.
- **Features:** Custom expertise filtering, calendar bookings, and interactive feedback boards.

### 6.11 Internship Module
A jobs board connecting students with startup internships.
- **Features:** Multi-criteria postings, pipeline boards, application portals, and resume attachments.

### 6.12 Startup Co-Founder Module
A launchpad for matching co-founders and pitching early-stage ideas.
- **Features:** Share pitch structures, specify target equity, and list required co-founder tech skills.

### 6.13 AI Project Generator
Generates ready-to-build dev blueprints based on user interests.
- **Input:** Project Domain, Target Difficulty, Team Size.
- **Processing:** Sends parameters to the Gemini API, requesting high-impact features, developmental milestones, and draft database schemas.
- **Output:** Returns a detailed project layout with an interactive dev timeline.

### 6.14 AI Resume Builder
Vets and scores student profiles against standard tech hiring filters.
- **Input:** Experience timelines, education collections, and target roles.
- **Output:** Returns an ATS score, professionally rewritten bullet points, and structure tips.

### 6.15 AI Career Roadmap Module
Maps out multi-week study roadmaps for technical roles.
- **Input:** Custom career goal.
- **Output:** Returns a 4-stage roadmap with topic timelines, study resources, sample projects, and common interview questions.

### 6.16 Search Module
Global search indexing across all active system collections.
- **Scope:** Matches queries against project titles, student skills, mentor expertise, and internship titles.

### 6.17 Payment / Subscription Module
A mockup payment pipeline model for billing plans.
- **Features:** Track active enterprise plans, generate PDF mock invoices, and log team subscription states.

### 6.18 Admin Module
Gives administrators full visibility and control over platform moderation and analytics.
- **Features:** System moderation lists, Daily Active Users (DAU) graphs, and system reset controls.

---

## 7. Database Schemas & Collection Documentation

Below is the complete document structure definition for all 20 Mongoose models configured in `src/services/mongodbService.ts`.

### 7.1 UserModel
Stores the student's or mentor's core identity, career profile, and achievements.
- **Purpose:** Primary user record.
- **Relationships:** Referenced by projects, applications, sessions, chats, and subscriptions.

| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `firebaseUid` | `String` | Unique Firebase Auth ID. System primary key index. |
| `email` | `String` | User email address. Required. |
| `fullName` | `String` | Core user name. |
| `role` | `String` | Must match one of the `UserRole` enum values. |
| `avatarUrl` | `String` | Cloudinary or unsplash asset URL. |
| `coverUrl` | `String` | Banner asset link. |
| `headline` | `String` | Brief career description (e.g., "React Developer"). |
| `bio` | `String` | Personal profile or career summary. |
| `location` | `String` | City, State, or campus location. |
| `skills` | `[String]` | Array of verified skill tags. |
| `education` | `[Object]` | Experience sub-documents (Institution, Degree, Years). |
| `experience` | `[Object]` | User past roles (Company, Title, Dates, Description). |
| `certifications`| `[String]` | List of certified certificates. |
| `achievements` | `[String]` | Verified platform achievements and badges. |
| `resumeUrl` | `String` | Linked PDF asset location. |
| `links` | `Object` | Object enclosing profiles (github, linkedin, portfolio). |
| `reputationPoints`| `Number` | Platform points earned from activities (Default: 100). |
| `badges` | `[String]` | Display badge awards. |
| `connectionsCount`| `Number` | Multi-peer connection count. |
| `followersCount`| `Number` | Platform follower count. |

*Example JSON Document:*
```json
{
  "_id": "647fa93bf2011b0021c1a931",
  "firebaseUid": "google_oauth_98213",
  "email": "ashishghadigaonkar85@gmail.com",
  "fullName": "Ashish Ghadigaonkar",
  "role": "Student",
  "skills": ["TypeScript", "React.js", "Express", "Node.js", "MongoDB"],
  "reputationPoints": 450,
  "badges": ["Open Source Ally", "Founding Squad Leader"],
  "links": {
    "github": "https://github.com/ashish",
    "linkedin": "https://linkedin.com/in/ashish"
  }
}
```

---

### 7.2 ProjectModel
Manages collaborative student project listings.
- **Purpose:** Tracks open project listings and milestones.

| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `title` | `String` | Project title. |
| `description` | `String` | In-depth description of the project. |
| `tagline` | `String` | Elevator pitch. |
| `creatorId` | `String` | Firebase Auth ID of the creator. |
| `creatorName` | `String` | Display name of the creator. |
| `creatorAvatar` | `String` | Avatar link of the creator. |
| `skillsNeeded` | `[String]` | Array of required tech skills. |
| `tags` | `[String]` | Category tags. |
| `difficulty` | `String` | Beginner, Intermediate, or Advanced. |
| `status` | `String` | Recruiting, In Progress, or Completed. |
| `teamSizeLimit`| `Number` | Max team size. |
| `currentTeamSize`| `Number` | Current active roster count. |
| `milestones` | `[Object]` | Project milestones (ID, Title, Description, Status, DueDate). |

*Example JSON Document:*
```json
{
  "_id": "647fa93bf2011b0021c1a932",
  "title": "Smart Campus Transit Tracker",
  "tagline": "Real-time AI transit scheduling",
  "creatorId": "google_oauth_98213",
  "skillsNeeded": ["React", "Express", "MongoDB"],
  "difficulty": "Intermediate",
  "status": "Recruiting",
  "teamSizeLimit": 4,
  "currentTeamSize": 1,
  "milestones": [
    {
      "id": "m_1",
      "title": "Database Schema Setup",
      "description": "Establish Mongoose model fields",
      "status": "Pending",
      "dueDate": "2026-06-20"
    }
  ]
}
```

---

### 7.3 TeamModel
Manages active, approved project rosters.
- **Purpose:** Tracks project team membership.

| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `projectId` | `String` | Target project ID. |
| `projectTitle` | `String` | Name of the project. |
| `leaderId` | `String` | Creator's user ID. |
| `members` | `[Object]` | Array of active member objects (userId, name, role, avatar). |
| `invitees` | `[String]` | Pending student invitations. |

---

### 7.4 ApplicationModel
Tracks team applications.
- **Purpose:** Manages applications for open project roles.

| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `projectId` | `String` | Target project ID. |
| `projectTitle` | `String` | Title of the target project. |
| `applicantId` | `String` | User ID of the applicant. |
| `applicantName`| `String` | Name of the applicant. |
| `applicantSkills`| `[String]`| Array of applicant skills. |
| `requestedRole`| `String` | Desired role name. |
| `coverLetter` | `String` | Cover letter text. |
| `status` | `String` | Pending, Approved, or Rejected. |

---

### 7.5 ActivityModel
Campus social feed posts.
- **Purpose:** Stores social activity posts.

| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `userId` | `String` | Creator's user ID. |
| `userName` | `String` | Creator's name. |
| `userAvatar` | `String` | Creator's avatar link. |
| `content` | `String` | Post content. |
| `likes` | `Number` | Likes count. |
| `commentsCount`| `Number` | Comments count. |

---

### 7.6 CommentModel
Comments on social feed posts.
- **Purpose:** Tracks post comments.

| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `postId` | `String` | Target Activity ID. |
| `userId` | `String` | Commenter's user ID. |
| `userName` | `String` | Commenter's name. |
| `content` | `String` | Comment text. |

---

### 7.7 LikeModel
Tracks feed post likes.
- **Purpose:** Prevents duplicate likes from a single user.

| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `postId` | `String` | Target Post ID. |
| `userId` | `String` | Liker's user ID. |

---

### 7.8 ChatModel
Thread registries for direct messages and team channels.
- **Purpose:** Direct and group chat index registry.

| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `threadId` | `String` | Unique connection thread ID. |
| `title` | `String` | Thread display title. |
| `avatar` | `String` | Thread display avatar. |
| `type` | `String` | Direct, Team, or Project. |

---

### 7.9 MessageModel
Durable log entries for chat threads.
- **Purpose:** Storage for all chat messages.

| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `threadId` | `String` | Parent thread ID. |
| `senderId` | `String` | Sender's user ID. |
| `senderName` | `String` | Sender's name.|
| `senderAvatar`| `String` | Sender's avatar asset. |
| `content` | `String` | Message content body. |
| `read` | `Boolean` | Read status. |

---

### 7.10 NotificationModel
Alert dispatch database.
- **Purpose:** Stores user alerts and notifications.

| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `userId` | `String` | Recipient user ID. |
| `title` | `String` | Alert title. |
| `message` | `String` | Notification description. |
| `type` | `String` | Message, Invite, Application, or Admin. |
| `read` | `Boolean` | Read status. |

---

### 7.11 HackathonModel
Hackathons lists database.
- **Purpose:** Stores hackathon entry rules and structures.

| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `title` | `String` | Organised event name. |
| `organizer` | `String` | Sponsor name. |
| `prizePool` | `String` | Prize pool structure. |
| `status` | `String` | Upcoming, Active, or Completed. |

---

### 7.12 MentorModel
Mentor expert indices.
- **Purpose:** Stores mentor expertise and schedule schemas.

| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `fullName` | `String` | Expert's full name. |
| `company` | `String` | Corporate affiliation. |
| `expertise` | `[String]` | Verified expert skills. |
| `rating` | `Number` | Out of 5. |

---

### 7.13 MentorBookingModel
Mentors meeting rosters.
- **Purpose:** Scheduled mentor sessions.

| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `mentorId` | `String` | Target mentor ID. |
| `menteeId` | `String` | Student user ID. |
| `topic` | `String` | Meeting topic. |
| `status` | `String` | Pending, Scheduled, or Completed. |

---

### 7.14 InternshipModel
Job catalog listings.
- **Purpose:** Stores internship details.

| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `title` | `String` | Position name. |
| `companyName` | `String` | Recruiter company name. |
| `stipend` | `String` | Monthly package. |
| `skillsRequired`| `[String]` | Prerequisites. |

---

### 7.15 StartupIdeaModel
Co-founder pitch profiles.
- **Purpose:** Matches student founders and early-stage ideas.

| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `title` | `String` | Idea name. |
| `tagline` | `String` | One-sentence summary. |
| `equityRange` | `String` | Equity allocation range. |

---

### 7.16 VerificationRequestModel
Verifying portfolio parameters.
- **Purpose:** Identity verification tracker.

| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `userId` | `String` | Applicant ID. |
| `status` | `String` | Pending, Approved, or Rejected. |

---

### 7.17 SubscriptionModel
Enterprise platform tier plans.
- **Purpose:** Tracking advanced user tiers.

| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `userId` | `String` | Student or Recruiter. |
| `plan` | `String` | Free, Professional, or Enterprise. |

---

### 7.18 PaymentModel
Logs payment records.
- **Purpose:** Payment register.

| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `userId` | `String` | User ID. |
| `amount` | `Number` | Charged in USD. |

---

### 7.19 InvoiceModel
Stores historical invoice documents.
- **Purpose:** Invoices archive.

| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `invoiceNo` | `String` | Generated INV key. |
| `amount` | `Number` | Total billed value. |

---

### 7.20 AuditLogModel
Logs administrative and system events.
- **Purpose:** Platform audits ledger.

| Field Name | Data Type | Description |
| :--- | :--- | :--- |
| `adminId` | `String` | Admin user ID. |
| `action` | `String` | Logged event. |

---

## 8. REST API Endpoint Catalog

SkillCollab uses a rest API architecture running entirely on Port 3000.

| Method | Route | Purpose | Payload Schema (JSON) | Response Success (JSON) | Auth Required |
| :---: | :--- | :--- | :--- | :--- | :---: |
| **GET** | `/api/users/me` | Fetch active profile | None | `{ id, email, fullName, role, skills ... }` | Yes |
| **PUT** | `/api/users/profile` | Update user profile | `{ fullName, bio, skills: [], links: {} }` | `{ status: "ok", user: { updatedUser } }` | Yes |
| **GET** | `/api/projects` | Fetch all open projects | None | `[{ id, title, description, milestones: [] }]` | No |
| **POST** | `/api/projects` | Create a new project | `{ title, description, tagline, skillsNeeded: [] }` | `{ success: true, project: { newProject } }` | Yes |
| **POST** | `/api/projects/:id/apply`| Submit application | `{ requestedRole, coverLetter }` | `{ success: true, application: { app } }` | Yes |
| **GET** | `/api/applications` | View recruitment queue | None | `[{ id, projectId, applicantName, status }]` | Yes |
| **POST**| `/api/applications/:appId/status`| Accept/Reject application | `{ status: "Approved" \| "Rejected" }`| `{ success: true, status: "Approved" }` | Yes |
| **POST**| `/api/projects/:id/milestones`| Create a milestone | `{ title, description, dueDate }` | `{ success: true, milestones: [...] }` | Yes |
| **PATCH**| `/api/projects/:id/milestones/:milestoneId`| Toggle milestone status | `{ status: "Done" \| "Pending" }` | `{ success: true, milestone: { updated } }` | Yes |
| **GET** | `/api/hackathons` | Fetch hackathons list | None | `[{ id, title, prizePool, submissions: [] }]` | No |
| **POST** | `/api/hackathons/:id/register`| Register for a hackathon | `{ teamName, projectTitle }` | `{ success: true, registered: true }` | Yes |
| **GET** | `/api/mentors` | Search active mentors | None | `[{ id, fullName, expertise: [] }]` | No |
| **POST** | `/api/mentors/:id/book`| Book a mentor slot | `{ topic, date, timeSlot }` | `{ success: true, session: { booking } }` | Yes |
| **GET** | `/api/chats` | Fetch chat messages | `Query: ?channelId=gen_collab` | `[{ id, senderName, content, createdAt }]` | Yes |
| **POST** | `/api/chats` | Send message to channel | `{ channelId, content }` | `[{ id, channelId, content, senderName }]` | Yes |
| **POST** | `/api/ai/resume-builder`| Analyze resume profiles | None | `{ atsScore: 84, accomplishments: [...] }` | Yes |
| **POST** | `/api/ai/mock-interview/start`| Start AI mock interview | `{ interviewType, targetRole }` | `{ question: "Challenging scenario..." }` | Yes |
| **POST** | `/api/ai/mock-interview/submit`| Score mock interview | `{ question, userAnswer }` | `{ score: 85, feedback: [], exemplarAnswer }` | Yes |
| **POST** | `/api/ai/career-roadmap`| Generate carrier path | `{ goal: "AI Researcher" }` | `{ goal: "...", stages: [{ stageName ... }] }` | Yes |
| **POST** | `/api/ai/project-generator`| Generate project ideas | `{ domain, difficulty, teamSize }` | `{ title: "...", tagline: "...", schema: "..." }`| Yes |
| **POST** | `/api/admin/reset` | Clear and seed database | None | `{ success: true }` | Admin Only |

---

## 9. Real-Time & Chat State Architecture

SkillCollab uses a high-performance **Synchronous Caching Channel Relay** to manage chat communications.

### 9.1 Channel Topologies
1. **Direct Message Channels (`dm_` prefix):** Peer-to-peer chats (e.g., `dm_ayesha` or `dm_nitin`).
2. **Global Collaboration Channels:** Open discussion channels (e.g., `gen_collab` or `gdsc_general`).
3. **Workspace Squad Channels:** Shared channels automatically created for approved teams.

### 9.2 Transaction Flow Diagram
```
[Client App Hook] (Typing message)
       |
       +---> Instant UI Append (optimistic rendering) 
       |
       +---> [POST /api/chats Payload] 
                   |
                   v
             [Express App Gateway]
                   |
                   +---> Real MongoDB: Write to MessageModel & update ChatModel
                   |
                   +---> Offline Fallback: Parse `dbState` in-memory & save to `mock_db_store.json`
```

---

## 10. AI Orchestration & Gemini Prompt Flows

The AI agent integration relies on the `@google/genai` TypeScript SDK and the `gemini-2.5-flash` model. Below are the key prompt flows and fallback mechanisms used by the platform.

### 10.1 AI Recommendation Prompt Flow
```
+---------------------------------------------------------+
|                  Student Parameters                     |
| Name, Bio, Listed Skills Portfolio                      |
+---------------------------|-----------------------------+
                            v
+---------------------------------------------------------+
|                  Active SaaS Database                   |
| Fetch Projects Catalog, Mentor Expert lists, Careers    |
+---------------------------|-----------------------------+
                            v
+---------------------------------------------------------+
|                    Gemini Engine                        |
| Computes multi-factor skill overlap and suitability     |
+---------------------------|-----------------------------+
                            v
+---------------------------------------------------------+
|                        JSON Output                      |
| Returns matched IDs, suitability %, and personalized     |
| reasons.                                                |
+---------------------------------------------------------+
```

### 10.2 Robust Fallbacks
If Gemini API services are unavailable or rate-limited, the platform automatically switches to a local heuristic fallback engine:
```typescript
const matches = skillsNeeded.filter(sk => student.skills.some(usk => usk.toLowerCase() === sk.toLowerCase()));
const overlapRate = skillsNeeded.length > 0 ? (matches.length / skillsNeeded.length) : 0.5;
const pct = Math.min(95, Math.max(50, Math.round(55 + overlapRate * 40)));
```
This ensures the platform remains fully functional independent of external service availability.

---

## 11. Security Architecture & RBAC

SkillCollab implements a comprehensive, multi-layered security module:

1. **Authentication:** Authenticates incoming requests using JWT tokens issued by Firebase Auth, validating the user's signature.
2. **Mongoose Validation:** Enforces strict data models, preventing SQL/NoSQL injection by validating types, lengths, and schemas before writing to the database.
3. **Role-Based Access Control (RBAC):** Restricts dangerous endpoints (e.g., admin actions and database resets) to authorized roles.
4. **Input Gating:** Cleans and processes user inputs to defend against XSS, ensuring HTML payloads are sanitized.

---

## 12. Setup and Deployment

### 12.1 Environment Variable Configuration
Define these environment variables in your server configuration or `.env` file:
```env
# Gemini API Key (Required for AI actions)
GEMINI_API_KEY="YOUR_OFFICIAL_API_KEY_HERE"

# App URL (Recommended for OAuth configurations)
APP_URL="https://skillcollab-prod-app-run.app/"
```

### 12.2 Local Installation
Get the platform up and running locally in three steps:
```bash
# 1. Install dependencies
npm install

# 2. Start the local server
npm run dev

# 3. Build for production (outputs static files in /dist and compiles backend server)
npm run build
```

---

## 13. Third-Party Integrations

### 13.1 Google Gemini
Provides context-aware AI recommendations, personalized career roadmaps, real-time resume score evaluations, and technical mock interviews.

### 13.2 Firebase Authentication
Handles secure campus sign-ins with Google and GitHub OAuth, enabling quick authentication across devices with secure local caching.

### 13.3 MongoDB Atlas & Mongoose
Durable, high-availability document database for tracking active projects, registrations, bookings, and messages with flexible data modeling.

---

## 14. Essential User Journeys

### 14.1 Workspace Team Joins
```
  [Browse Marketplace] ──> [Filter Skills] ──> [Apply to Project] ──> [Accept applications] ──> [Squad Chat channel opens]
```

---

## 15. Future System Enhancements

1. **Automated GitHub Issue Verification:** Link real GitHub webhooks to verify pull requests, rewarding verified status and reputation points directly to student profiles.
2. **WebRTC Video Channels:** Introduce built-in video rooms for hackathon squads and mentor sessions directly within workspaces.
3. **Smart Enterprise Matching:** Allow recruiting partners to filter candidates by verified project logs and skills.

---

## 16. Appendix: Architectural Glossary

- **ATS Score:** Applicant Tracking System index used to score technical resumes against target job filters.
- **Lazy Evaluation:** Pattern that initializes database connections or API clients on-demand rather than on boot, preventing startup crashes.
- **Offline Bridge:** Auto-switching pipeline that routes data queries to a local file database (`mock_db_store.json`) if live cloud databases are unreachable.
- **Reputation Register:** Dynamic gamification engine that rewards completed project milestones, merged pull requests, and verified skills with platform badges and points.
