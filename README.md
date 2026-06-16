# SkillCollab: Campus Developer Peer Collaboration Platform

SkillCollab is an immersive, high-fidelity peer collaboration marketplace and project workspace designed specifically for college scholars and student developers. It replaces traditional disjointed tools (messagers, wikis, and job boards) with a single, highly integrated campus innovation network.

---

## 🚀 Key Modules & Capabilities

### 1. Unified Social Hub (Home Feed)
* **Post Composer**: Features an intuitive, category-specific update generator supporting General News, Project Milestones, Teammate Recruitment, Achievements, and Certifications.
* **Smart Filter System**: Instantly filter updates by categorization pill tags with fluid responsive layouts.
* **Engaged Feedback Loop**: Embedded discussions allow scholars to comment, like, share, and save timeline events natively.

### 2. Build Workspace (Recruitment & Collaboration)
* **Project Marketplace**: Pitch college project structures, state difficulty levels, and detail specialized technical skill prerequisites.
* **Teammate Proposals**: Active student applicants can send cover letter pitches requesting specific project roles.
* **Workspace Task Board**: Inside the collaboration center, squad members organize sprint deliverables with live milestone checklists.
* **Incoming Applicants solver**: Review candidate proposals, evaluate tech indices, and recruit peers to the project roster.
* **Git Repository Sync Indicator**: A mock command-line repository interface with real-time sync telemetry, listing interactive commit histories to model student contributions.

### 3. Discovery Deck (Explore Hub)
* **Interactive Carousel Boards**: A horizontal, swipe-friendly discovery catalog displaying campus initiatives.
* **Ecosystem Hackathons**: Active listings of forthcoming student developer jams with prize scope and category breakdown.
* **Verified Scholar Mentors**: Reach staffs, professional engineers, and principal scientists offering focused booking slots.
* **Startup Launchpad & OSS Opportunities**: Promotes active collegiate incubators and open source issues from top college repositories.
* **Seminars RSVP Tracker**: RSVP to campus tech lectures and UX design workshops with instant visual state feedback.

### 4. Interactive Collaboration Messenger (Chats)
* **Multi-category Filter**: Isolate chat channels under direct connections, team networks, or professional recruiters.
* **Conversational Rich Media**: Pin, reply, reaction-stamp. or retract chat messages. Includes support for styled mock attachments (PDF, Zip) and interactive voice notes.
* **Typing Handshakes**: Fluid loading states communicating active peers typing context.

### 5. Verified Professional Portfolio (Profiles)
* **Portfolio Health Indicator**: Monitors profile strength indicators, follower counts, and overall scholar levels.
* **Technical Evidence Area**: Pinned skills, connected GitHub branches, and contribution timelines.
* **Peer Endorsement Engine**: Solicits structural feedback, written credentials recommendations, and skills endorsements to highlight academic credibility.

---

## 🛠️ Architecture & Tech Stack

```
   ┌─────────────────────────────────────────────────────────────────┐
   │                        React Clients [Vite]                     │
   │      (Inter, JetBrains Mono Displays / Tailwinds Midnight UI)   │
   └────────────────────────────────┬────────────────────────────────┘
                                    │ Http Proxies [/api/*]
   ┌────────────────────────────────▼────────────────────────────────┐
   │                           Node Server                           │
   │               (Express Routing Controllers Model)               │
   └────────────────────────────────┬────────────────────────────────┘
                                    │ Connect Stream
   ┌────────────────────────────────▼────────────────────────────────┐
   │                         Database Pool                           │
   │     (MongoDB Atlas / Fail-safe Simulated Local Storage System)  │
   └─────────────────────────────────────────────────────────────────┘
```

* **Frontend**: React (18+), Vite Bundler, Tailwind CSS, Lucide icons, Motion animations. Styled on an aesthetic premium twilight canvas featuring spacious negative structures.
* **Backend**: Node.js, Express framework, typescript runner execution.
* **Database**: MongoDB driver integration supported by an automated local key-value file fallback mechanism (`mock_db_store.json`) to persist state dynamically.

---

## 💻 Local Setup & Development

### Prerequisites
* **Node.js**: Ensure you have Node.js v18 or later installed.
* **Package Manager**: npm (v9+) or yarn.

### 1. Installation
Clone the repository and install dependencies:
```bash
npm install
```

### 2. Environment Configuration
Create an environment variables configuration file by copying the template:
```bash
cp .env.example .env
```
Key parameters to include:
```env
PORT=3000
MONGODB_URI=your_mongodb_connection_uri_here
```
*Note: If no MONGODB_URI is provided, SkillCollab falls back to its robust simulated key-value engine automatically, maintaining system stability offline.*

### 3. Run Development Server
Bring up the Express server and Vite development environment in tandem:
```bash
npm run dev
```
The server bounds automatically to `http://localhost:3000`.

### 4. Build Configuration
Compile the high-performance clients bundle and modular backend server structure for production:
```bash
npm run build
```

### 5. Running Production Release
Start the production-ready build:
```bash
npm run start
```
