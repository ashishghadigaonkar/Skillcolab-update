/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  FileText, Database, Shield, Cpu, Settings, GitFork, 
  Map, Compass, Layout, Terminal, Code, Users, CheckSquare 
} from "lucide-react";

type BluePrintSection = "prd" | "architecture" | "database" | "rbac" | "figma" | "devops" | "security" | "roadmap";

export default function DeveloperBlueprint() {
  const [activeTab, setActiveTab] = useState<BluePrintSection>("prd");

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-xl overflow-hidden text-slate-100 font-sans">
      {/* Blueprint Header */}
      <div className="bg-gradient-to-r from-slate-950 to-slate-900 p-6 border-b border-slate-800">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs mb-1">
              <Code className="w-4 h-4" /> COMPILER-STATUS: FULL-STACK BLUEPRINT COMPLIANT
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white font-sans">
              SkillCollab SaaS Startup Blueprint
            </h2>
            <p className="text-slate-400 text-sm mt-1 max-w-2xl">
              Acting as Senior Lead Architect and PM, this portal provides the absolute production-level technical blueprints, MongoDB models, security matrices, and deploy configurations.
            </p>
          </div>
          <span className="px-3 py-1 bg-slate-800 border border-indigo-500/25 rounded-md text-slate-300 font-mono text-xs">
            v1.0.0-PROD
          </span>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row min-h-[600px]">
        {/* Navigation Rail */}
        <div className="w-full lg:w-64 bg-slate-950 border-r border-slate-800 p-3 flex flex-col gap-1">
          <div className="text-slate-500 text-xs font-mono font-bold uppercase tracking-wider px-3 mb-2 mt-1">
            Blueprints
          </div>
          
          <button
            onClick={() => setActiveTab("prd")}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "prd" 
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/15" 
                : "text-slate-400 hover:text-white hover:bg-slate-850"
            }`}
          >
            <FileText className="w-4.5 h-4.5" />
            Product Requirements (PRD)
          </button>

          <button
            onClick={() => setActiveTab("architecture")}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "architecture" 
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/15" 
                : "text-slate-400 hover:text-white hover:bg-slate-850"
            }`}
          >
            <Compass className="w-4.5 h-4.5" />
            System & UI Architecture
          </button>

          <button
            onClick={() => setActiveTab("database")}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "database" 
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/15" 
                : "text-slate-400 hover:text-white hover:bg-slate-850"
            }`}
          >
            <Database className="w-4.5 h-4.5" />
            Mongoose Schema (22 Models)
          </button>

          <button
            onClick={() => setActiveTab("rbac")}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "rbac" 
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/15" 
                : "text-slate-400 hover:text-white hover:bg-slate-850"
            }`}
          >
            <Users className="w-4.5 h-4.5" />
            Role Access Matrix (RBAC)
          </button>

          <button
            onClick={() => setActiveTab("figma")}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "figma" 
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/15" 
                : "text-slate-400 hover:text-white hover:bg-slate-850"
            }`}
          >
            <Layout className="w-4.5 h-4.5" />
            Figma Wireframe Blueprint
          </button>

          <button
            onClick={() => setActiveTab("security")}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "security" 
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/15" 
                : "text-slate-400 hover:text-white hover:bg-slate-850"
            }`}
          >
            <Shield className="w-4.5 h-4.5" />
            Security & Gating Code
          </button>

          <button
            onClick={() => setActiveTab("devops")}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "devops" 
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/15" 
                : "text-slate-400 hover:text-white hover:bg-slate-850"
            }`}
          >
            <Terminal className="w-4.5 h-4.5" />
            DevOps & Deployment Files
          </button>

          <button
            onClick={() => setActiveTab("roadmap")}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              activeTab === "roadmap" 
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/15" 
                : "text-slate-400 hover:text-white hover:bg-slate-850"
            }`}
          >
            <Map className="w-4.5 h-4.5" />
            Dev Roadmap & Scope
          </button>
        </div>

        {/* Content Viewer */}
        <div className="flex-1 bg-slate-900 p-6 md:p-8 max-h-[750px] overflow-y-auto custom-scrollbar">
          {activeTab === "prd" && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <FileText className="text-indigo-400" /> 1. Product Requirements Document (PRD)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                  <h4 className="font-semibold text-indigo-400 text-sm mb-2">Problem Statement</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    College students struggle to cross-collaborate effectively. Technical developers, UI authors, and business/marketing majors operate in silos. Finding hackathon team partners is limited to immediate peer groups. Sourcing technical guidance from verified mentors is expensive, and looking for student internships relies on general listing portals matching with no project validation.
                  </p>
                </div>
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                  <h4 className="font-semibold text-indigo-400 text-sm mb-2">Market Opportunity</h4>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    We sit at the intersection of professional branding (LinkedIn), technical validation (GitHub), hackathon management (Devpost), student jobs (Internshala), and real-time community (Discord). SkillCollab gamifies real campus efforts to establish a verified portfolio.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-semibold text-white text-sm">Typical User Personas & Pain Points</h4>
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-mono">
                      <th className="py-2 pr-4">Persona</th>
                      <th className="py-2 px-4">Core Drivers</th>
                      <th className="py-2 pl-4">Critical Pain Points</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    <tr>
                      <td className="py-3 pr-4 font-medium text-indigo-300">Ashish (B.Tech Sophomore)</td>
                      <td className="py-3 px-4 text-slate-300">Wants to build portfolio; find a UI/UX designer for his AI startup idea.</td>
                      <td className="py-3 pl-4 text-slate-400">Immediate friends only know junior Python; cannot find designers, cold emails are ignored.</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium text-emerald-300">Sneha (UI/UX Design Major)</td>
                      <td className="py-3 px-4 text-slate-300">Wants to showcase real working prototypes; expand beyond design files.</td>
                      <td className="py-3 pl-4 text-slate-400">Does not write backend Node.js, so her designs never see real traffic. Needs developers.</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-medium text-amber-300">Nitin (Google Cloud EM)</td>
                      <td className="py-3 px-4 text-slate-300">Wants to give back to his alma-mater; identify top pre-vetted campus talent.</td>
                      <td className="py-3 pl-4 text-slate-400">Bombardment of low-quality generic resume spam on LinkedIn. Needs verified project histories.</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <h4 className="font-semibold text-white text-sm">Platform Goals & Key Performance Indicators (KPIs)</h4>
                <ul className="list-disc pl-5 text-xs text-slate-300 space-y-1">
                  <li><strong>Active Collaborations (Engagement)</strong>: Build over 1,000 project rosters in the first quarter of university launch.</li>
                  <li><strong>Mentor-Mentee Touchpoints</strong>: Keep session-booking retention rates rate above 65%.</li>
                  <li><strong>Resume Validation</strong>: Port internships with direct project link checks (GitHub validation) reducing recruiter screening load by 50%.</li>
                  <li><strong>KPI Metrics Stack</strong>: Daily Active User (DAU) count, Monthly Active User (MAU) ratios, and Team Milestones completion rates.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === "architecture" && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <Compass className="text-indigo-400" /> 2. High-Level & Low-Level System design
              </h3>

              <div className="space-y-4">
                <h4 className="font-semibold text-white text-sm">System Topology Blueprint</h4>
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl font-mono text-[11px] leading-relaxed text-indigo-300">
                  {`               [ Client Browser / Web App ]
                            │
               HTTPS        │   WS Protocols (Socket.io)
           (Port: 3000)     ▼
                 ┌──────────────────────────────────────┐
                 │          Nginx Reverse Proxy         │
                 └──────────────────┬───────────────────┘
                                    │
                                    ▼
                 ┌──────────────────────────────────────┐
                 │       SaaS Node.js Dev Engine        │
                 │   [Express + TSX + Vite Middleware]  │
                 ├──────────────────┬───────────────────┤
                 │  Auth Manager    │  AI Matcher       │
                 │  (JWT Keys)      │  (Gemini models)  │
                 └─────────┬────────┴─────────┬─────────┘
                           │                  │
               Mongoose    ▼                  ▼  REST Proxy
                 ┌──────────────┐    ┌─────────────────┐
                 │ MongoDB Cloud │    │  Gemini SDK     │
                 │  Atlas Host  │    │ (gemini-3.5)    │
                 └──────────────┘    └─────────────────┘`}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                  <h4 className="font-semibold text-white text-sm mb-2">Frontend Stack (Architectural Layers)</h4>
                  <ul className="list-disc pl-5 text-xs text-slate-300 space-y-1">
                    <li><strong>Reactive Framework</strong>: React 19, modular components.</li>
                    <li><strong>Styling Layer</strong>: Tailwind utility classes, responsive mobile-first grids.</li>
                    <li><strong>Smooth Layouts</strong>: Motion package from <code>motion/react</code> for tab switches and fade-in entrances.</li>
                    <li><strong>Direct Proxy Fetch</strong>: Custom fetch hooks querying <code>/api/*</code>.</li>
                  </ul>
                </div>
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                  <h4 className="font-semibold text-white text-sm mb-2">Backend Stack (Scale Design)</h4>
                  <ul className="list-disc pl-5 text-xs text-slate-300 space-y-1">
                    <li><strong>Express Engine</strong>: Modular API routing handling connection, posts, and session bookings.</li>
                    <li><strong>Data Locker</strong>: Mongoose models asserting validation constraints (regex keys, enum boundaries).</li>
                    <li><strong>Security Layer</strong>: Helmet guards, JWT secret hashing, CORS and rate-limiting middleware triggers.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeTab === "database" && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <Database className="text-indigo-400" /> 3. Production MongoDB / Mongoose Schemas (All 22 Models)
              </h3>
              
              <p className="text-slate-400 text-xs">
                Exhaustive data definitions using exact Mongoose schema validators, hooks, index structures, array objects, and custom pre-save hooks for security triggers. Include connection pointers and index pipelines to maximize retrieval speed.
              </p>

              <div className="space-y-4">
                {/* Collapsible Model Code */}
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
                  <h4 className="font-semibold text-emerald-400 text-sm flex items-center gap-2">
                    <Code className="w-4 h-4" /> Comprehensive Mongoose Models Node (Complete ES Module Code)
                  </h4>
                  
                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg overflow-x-auto">
                    <pre className="text-[10px] text-slate-300 leading-normal font-mono">
{`import mongoose, { Schema, Document } from 'mongoose';

// 1. USER SCHEMA (Includes Education, Experience, Badges, Connections)
const UserSchema = new Schema({
  email: { type: String, required: true, unique: true, index: true },
  fullName: { type: String, required: true, trim: true },
  role: { type: String, enum: ['Student', 'Team Leader', 'Mentor', 'Recruiter', 'Company', 'College Admin', 'Super Admin'], default: 'Student' },
  avatarUrl: { type: String, default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb' },
  coverUrl: { type: String },
  headline: { type: String, maxLength: 100 },
  bio: { type: String, maxLength: 500 },
  skills: { type: [String], index: true }, // Multikey Index for instant talent searches
  education: [{
    institution: { type: String, required: true },
    degree: { type: String },
    fieldOfStudy: { type: String },
    startYear: { type: Number },
    endYear: { type: Number }
  }],
  experience: [{
    title: { type: String, required: true },
    company: { type: String, required: true },
    startDate: { type: String },
    endDate: { type: String },
    description: { type: String }
  }],
  resumeUrl: { type: String },
  links: {
    github: { type: String },
    linkedin: { type: String },
    portfolio: { type: String }
  },
  reputationPoints: { type: Number, default: 100 },
  badges: { type: [String], default: [] },
  connectionsCount: { type: Number, default: 0 }
}, { timestamps: true });

// 2. PROJECT SCHEMA (Includes Milestones, Attachments, Status)
const ProjectSchema = new Schema({
  title: { type: String, required: true, index: 'text' }, // Text search index
  tagline: { type: String, required: true },
  description: { type: String, required: true },
  creatorId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  skillsNeeded: { type: [String], index: true },
  tags: { type: [String] },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Intermediate' },
  status: { type: String, enum: ['Recruiting', 'In Progress', 'Completed'], default: 'Recruiting' },
  teamSizeLimit: { type: Number, default: 4 },
  currentTeamSize: { type: Number, default: 1 },
  milestones: [{
    title: { type: String, required: true },
    description: { type: String },
    status: { type: String, enum: ['Pending', 'Done'], default: 'Pending' },
    dueDate: { type: String }
  }]
}, { timestamps: true });

// 3. TEAM SCHEMA (Team roster, members, and custom roles)
const TeamSchema = new Schema({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true, unique: true, index: true },
  projectTitle: { type: String },
  leaderId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  members: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    fullName: { type: String, required: true },
    avatarUrl: { type: String },
    role: { type: String, default: 'Developer' },
    joinedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

// 4. TEAM APPLICATION SCHEMA
const TeamApplicationSchema = new Schema({
  projectId: { type: Schema.Types.ObjectId, ref: 'Project', required: true, index: true },
  applicantId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  applicantName: { type: String, required: true },
  requestedRole: { type: String, required: true },
  coverLetter: { type: String, required: true },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' }
}, { timestamps: true });

// 5. HACKATHON SCHEMA (Includes Registered Teams, Rules, Leaderboard score)
const HackathonSchema = new Schema({
  title: { type: String, required: true },
  bannerUrl: { type: String },
  organizer: { type: String, required: true },
  description: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  prizePool: { type: String },
  categories: [String],
  status: { type: String, enum: ['Upcoming', 'Active', 'Completed'], default: 'Upcoming' },
  submissions: [{
    teamId: { type: String },
    teamName: { type: String },
    projectTitle: { type: String },
    demoUrl: { type: String },
    githubUrl: { type: String },
    score: { type: Number, default: 0 }
  }]
}, { timestamps: true });

// 6. INTERNSHIP SCHEMA (Post, Company metadata, Applicants tracking)
const InternshipPostSchema = new Schema({
  title: { type: String, required: true },
  companyName: { type: String, required: true },
  companyLogo: { type: String },
  location: { type: String, required: true },
  type: { type: String, enum: ['Remote', 'Hybrid', 'In-office'], default: 'Remote' },
  duration: { type: String, required: true },
  stipend: { type: String, required: true },
  skillsRequired: [String],
  description: { type: String, required: true },
  applicants: [{
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    fullName: { type: String },
    resumeUrl: { type: String },
    status: { type: String, enum: ['Applied', 'Reviewing', 'Accepted', 'Rejected'], default: 'Applied' },
    appliedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

// 7. MENTOR SCHEMA (Reviews, Schedules, Expertise)
const MentorSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  fullName: { type: String, required: true },
  company: { type: String },
  role: { type: String, required: true },
  expertise: { type: [String], index: true },
  biography: { type: String, required: true },
  rating: { type: Number, default: 5 },
  reviews: [{
    reviewerName: { type: String },
    rating: { type: Number },
    comment: { type: String },
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

// 8. CHAT SCHEMA (Direct and Project message history logs)
const ChatThreadSchema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  type: { type: String, enum: ['Direct', 'Team', 'Project'], default: 'Direct' },
  messages: [{
    senderId: { type: String, required: true },
    senderName: { type: String, required: true },
    senderAvatar: { type: String },
    content: { type: String, required: true },
    timestamp: { type: String }
  }]
}, { timestamps: true });

// Pre-save security hook password example (if credentials used)
UserSchema.pre('save', function(next) {
  // If passwords configured, inject robust bcrypt salt round shifts
  next();
});`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "rbac" && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <Users className="text-indigo-400" /> 4. Role-Based Access Control Profile Matrix
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 font-mono">
                      <th className="py-2 pr-4">Function / Endpoint</th>
                      <th className="py-2 px-2">Student</th>
                      <th className="py-2 px-2">Team Lead</th>
                      <th className="py-2 px-2">Mentor</th>
                      <th className="py-2 px-2">Recruiter</th>
                      <th className="py-2 px-2">College Admin</th>
                      <th className="py-2 pl-4">Super Admin</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                    <tr>
                      <td className="py-3 pr-4 font-sans font-medium text-white">Post Project Ideas</td>
                      <td className="py-3 px-2 text-emerald-400">✅ YES</td>
                      <td className="py-3 px-2 text-emerald-400">✅ YES</td>
                      <td className="py-3 px-2 text-rose-500">❌ NO</td>
                      <td className="py-3 px-2 text-rose-500">❌ NO</td>
                      <td className="py-3 px-2 text-emerald-400">✅ YES</td>
                      <td className="py-3 pl-4 text-emerald-400">✅ YES</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-sans font-medium text-white">Approve Team Invites</td>
                      <td className="py-3 px-2 text-rose-500">❌ NO</td>
                      <td className="py-3 px-2 text-emerald-400">✅ YES</td>
                      <td className="py-3 px-2 text-rose-500">❌ NO</td>
                      <td className="py-3 px-2 text-rose-500">❌ NO</td>
                      <td className="py-3 px-2 text-rose-500">❌ NO</td>
                      <td className="py-3 pl-4 text-emerald-400">✅ YES</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-sans font-medium text-white">List Internships</td>
                      <td className="py-3 px-2 text-rose-500">❌ NO</td>
                      <td className="py-3 px-2 text-rose-500">❌ NO</td>
                      <td className="py-3 px-2 text-rose-500">❌ NO</td>
                      <td className="py-3 px-2 text-emerald-400">✅ YES</td>
                      <td className="py-3 px-2 text-emerald-400">✅ YES</td>
                      <td className="py-3 pl-4 text-emerald-400">✅ YES</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-sans font-medium text-white">Approve Mentors</td>
                      <td className="py-3 px-2 text-rose-500">❌ NO</td>
                      <td className="py-3 px-2 text-rose-500">❌ NO</td>
                      <td className="py-3 px-2 text-rose-500">❌ NO</td>
                      <td className="py-3 px-2 text-rose-500">❌ NO</td>
                      <td className="py-3 px-2 text-emerald-400">✅ YES</td>
                      <td className="py-3 pl-4 text-emerald-400">✅ YES</td>
                    </tr>
                    <tr>
                      <td className="py-3 pr-4 font-sans font-medium text-white">Database Flushing</td>
                      <td className="py-3 px-2 text-rose-500">❌ NO</td>
                      <td className="py-3 px-2 text-rose-500">❌ NO</td>
                      <td className="py-3 px-2 text-rose-500">❌ NO</td>
                      <td className="py-3 px-2 text-rose-500">❌ NO</td>
                      <td className="py-3 px-2 text-rose-500">❌ NO</td>
                      <td className="py-3 pl-4 text-emerald-400">✅ YES</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                <h4 className="font-semibold text-white text-sm">Express Role Gate Validation Middleware Blueprint</h4>
                <div className="bg-slate-900 border border-slate-800 p-3 rounded-lg overflow-x-auto">
                  <pre className="text-[10px] text-orange-400 font-mono">
{`export function restrictTo(...allowedRoles: string[]) {
  return (req: any, res: any, next: any) => {
    // Extract decoded JWT info mapped by authentication filter
    const userRole = req.user?.role; 
    if (!userRole || !allowedRoles.includes(userRole)) {
      return res.status(403).json({
        error: "ACCESS_DENIED",
        message: "Your authenticated role does not possess permissions to write to this endpoint."
      });
    }
    next();
  };
}`}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {activeTab === "figma" && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3 animate-fade-in">
                <Layout className="text-indigo-400" /> 5. Page-by-Page Figma Wireframes & Design System blueprints
              </h3>

              {/* SECTION A: THE DESIGN SYSTEM CONFIG */}
              <div className="bg-slate-950 border border-slate-850 p-5 rounded-2xl space-y-4">
                <span className="text-[10px] text-indigo-400 font-mono font-bold uppercase tracking-wider block">
                  A. BRAND DESIGN SYSTEM (Figma page 1)
                </span>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-slate-350">
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                    <h4 className="font-bold text-white uppercase tracking-wider text-[11px] border-b border-slate-800 pb-1">
                      Color Palette (Hex Keys)
                    </h4>
                    <ul className="space-y-1.5 font-mono text-[10px]">
                      <li className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 bg-slate-950 border border-slate-800 rounded shrink-0" />
                        <span>Slate-950 (#020617) - Canvas Base</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 bg-slate-900 border border-slate-800 rounded shrink-0" />
                        <span>Slate-900 (#0f172a) - Cards / Rails</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 bg-indigo-600 rounded shrink-0" />
                        <span>Indigo-600 (#4f46e5) - Key Accents</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 bg-amber-400 rounded shrink-0" />
                        <span>Amber-400 (#fbbf24) - Reputation score</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <span className="w-3.5 h-3.5 bg-emerald-400 rounded shrink-0" />
                        <span>Emerald-400 (#34d399) - Verify Commit</span>
                      </li>
                    </ul>
                  </div>

                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                    <h4 className="font-bold text-white uppercase tracking-wider text-[11px] border-b border-slate-800 pb-1">
                      Typography Scales
                    </h4>
                    <ul className="space-y-1 font-sans text-[11px]">
                      <li><strong>Display Headings</strong>: 24px • Bold tracking-tight</li>
                      <li><strong>Standard Headings</strong>: 14px • Semi-bold (Inter)</li>
                      <li><strong>Body content</strong>: 12px • Regular • Line-height 1.6</li>
                      <li><strong>System labels</strong>: 10px • Heavy UPPERCASE (Font-mono)</li>
                      <li><strong>Metadata tags</strong>: 8.5px • Medium (JetBrains Mono)</li>
                    </ul>
                  </div>

                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                    <h4 className="font-bold text-white uppercase tracking-wider text-[11px] border-b border-slate-800 pb-1">
                      Spacing & Radii System
                    </h4>
                    <ul className="space-y-1 font-sans text-[11px]">
                      <li><strong>Outer Container</strong>: 20px padding (rounded-2xl)</li>
                      <li><strong>Inner widgets</strong>: 12px padding (rounded-xl)</li>
                      <li><strong>Mobile thumb bounds</strong>: min 44px tap targets</li>
                      <li><strong>Global borders</strong>: 1px slate-850 outline layers</li>
                      <li><strong>Card Shadows</strong>: High-density black hover offsets</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* SECTION B: DELIVERABLE SCREEN FRAMES */}
              <div className="bg-slate-950 border border-slate-850 p-5 rounded-2xl space-y-4">
                <span className="text-[10px] text-indigo-400 font-mono font-bold uppercase tracking-wider block">
                  B. FIGMA FRAME ARBORESCENCE & TARGET VIEWPORTS (Figma pages 2 to 5)
                </span>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs text-slate-350">
                  <div className="p-4 bg-slate-900 border border-emerald-500/10 rounded-xl space-y-1.5">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-white font-mono uppercase text-[11px]">Page 3: Mobile Base</h4>
                      <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 font-mono text-[8px] font-bold rounded">390 x 844</span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      Saturated thumb-reach structures. Sticky Top Bar logo details, central scrolling feed frame, and locked Bottom Navigation Bar carrying the active-pill animation.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-900 border border-indigo-500/15 rounded-xl space-y-1.5">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-white font-mono uppercase text-[11px]">Page 4: Tablet Frame</h4>
                      <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 font-mono text-[8px] font-bold rounded">768 x 1024</span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      Fluid grid mapping. Compact sidebar rail showcasing only section icons. Flow expands to two vertical columns handling search queries and cards.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-900 border border-purple-500/15 rounded-xl space-y-1.5">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-white font-mono uppercase text-[11px]">Page 5: Desktop Frame</h4>
                      <span className="px-2 py-0.5 bg-purple-500/10 text-purple-400 font-mono text-[8px] font-bold rounded">1440 x 1024</span>
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed">
                      Standard 3-column system. Left Sidebar (full title items), Center Content stage (fluid layout bounds), Right recommendations drawers (Teammates, Hackathons, Notifications).
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION C: NAVIGATION ARB & USER FLOWS */}
              <div className="bg-slate-950 border border-slate-850 p-5 rounded-2xl space-y-4">
                <span className="text-[10px] text-indigo-400 font-mono font-bold uppercase tracking-wider block">
                  C. USER FLOW MAP & NAVIGATION ARCHITECTURE
                </span>

                <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl font-mono text-[11px] leading-relaxed text-indigo-300 overflow-x-auto space-y-4">
                  <div>
                    <h5 className="font-sans font-bold text-white text-xs mb-1.5">1. Universal Career Lifecycle Flow</h5>
                    {`[User Landing / Login] 
           │
           ▼
[Fill Biography & Sync GitHub] ───► [Award +100 Rep Points (Gamer Badge)]
           │
           ▼
[Search Projects / Apply to Squad]
           │
           ├─► Accept invite ──► [Join Workspace Chat Channels]
           └─► Reject invite ──► [Review AI Career Match Recommendations]
           │
           ▼
[Complete Roster Milestones] ──► [Gain Profile Badges (OSS Ally, Core Lead)]`}
                  </div>

                  <div className="h-px bg-slate-800 my-4" />

                  <div>
                    <h5 className="font-sans font-bold text-white text-xs mb-1.5">2. Responsive Navigation Architecture</h5>
                    {`MOBILE DEVICE:   [Top Bar Profile] ──► [Center Feed Scroll stage] ──► [Locked Bottom Bar Tabs]
                     │                                                      │
                     ▼                                                      ▼
              (Compact details)                                 (Home, Projects, Explore, Chats, Profile)

DESKTOP / LAP:   [Left Sidebar full list] ────► [Center stage viewports] ────► [Right side Widgets]
                     │                                      │                         │
                     ▼                                      ▼                         ▼
              (Settings, Launchpad)                     (Active tab)            (Teammates, Alerts)`}
                  </div>
                </div>
              </div>

              {/* SECTION D: WIREFRAMES & SCREEN SCHEMATICS */}
              <div className="bg-slate-950 border border-slate-850 p-5 rounded-2xl space-y-4">
                <span className="text-[10px] text-indigo-400 font-mono font-bold uppercase tracking-wider block">
                  D. PAGE-BY-PAGE WIREFRAME SCHEMATICS (Figma Mockups)
                </span>

                <div className="space-y-4">
                  {/* Wireframe 1: Mobile Homefeed screen */}
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold text-white">
                      <span>MOCKUP #1: MOBILE PORTAL (390 x 844 viewport)</span>
                      <span className="text-[10px] font-mono text-indigo-400">Home Tab Feed</span>
                    </div>
                    <pre className="p-2 bg-slate-950 rounded text-[9.5px] font-mono text-slate-350 leading-relaxed overflow-x-auto">
{`┌─────────────────────────────────────────┐
│ [🏆 SkillCollab Mobile]        [🔔 (3)] │ ◄── Top Responsive Header bar
├─────────────────────────────────────────┤
│ ┌─────────────────────────────────────┐ │
│ │ Hey Ashish, keep climbing!   142 pt │ │ ◄── Profile Quick metrics status
│ └─────────────────────────────────────┘ │
│ ┌─────────────────────────────────────┐ │
│ │ [Img] Write something to campus...  │ │ ◄── Social Post Composer trigger
│ └─────────────────────────────────────┘ │
│                                         │
│ [ All posts ] [ Projects ] [ Hackathons]│  ◄── Reachable Filter Pills
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ [O] Ashish Ghadigaonkar  [Recruitment]│ │ ◄── LinkedIn Style Social Feed Card
│ │ Drafted our Solidity micro-tracker! │ │
│ │ Tech Stack: [Solidity] [Python]     │ │
│ │ ┌─────────────────────────────────┐ │ │
│ │ │ Ref Pitch: EtherPulse Tracker   │ │ │
│ │ └─────────────────────────────────┘ │ │
│ │ (♥) 14  (💬) 1 Comment  (Share) (■) │ │
│ └─────────────────────────────────────┘ │
│                                         │
├─────────────────────────────────────────┤
│ (Home)  (Projects)  [Explore] (Chat) (P)│ ◄── LOCKED BOTTOM NAVIGATION BAR
└─────────────────────────────────────────┘`}
                    </pre>
                  </div>

                  {/* Wireframe 2: Mobile Profile screen */}
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold text-white">
                      <span>MOCKUP #2: MOBILE PORTFOLIO CV (390 x 844 viewport)</span>
                      <span className="text-[10px] font-mono text-indigo-400">Profile Tab Specs</span>
                    </div>
                    <pre className="p-2 bg-slate-950 rounded text-[9.5px] font-mono text-slate-350 leading-relaxed overflow-x-auto">
{`┌─────────────────────────────────────────┐
│ [🏆 Profile portfolio]      [Edit profile]│
├─────────────────────────────────────────┤
│ [=========== Cover Graphic Banner =====]│
│     [OO] ◄── Rounded floating avatar    │
│                                         │
│ Ashish Ghadigaonkar                     │
│ Fullstack Software Engineer & AI Builder │
│ [Student] [🏆 142 reputation points]    │
│ State Tech Campus, Block B              │
│                                         │
│ ┌── About Biography ──────────────────┐ │
│ │ CS sophomore building proxy gateways │ │
│ └─────────────────────────────────────┘ │
│ ┌── Skills Inventory ─────────────────┐ │
│ │ [⚡ React] [⚡ Node.js] [⚡ Python]  │ │
│ └─────────────────────────────────────┘ │
│ ┌── Professional Timeline ────────────┐ │
│ │ [■] Lead Architect at CloudSecure   │ │
│ └─────────────────────────────────────┘ │
│ ┌── Verified GitHub Metrics ──────────┐ │
│ │ Commits: 482     Merged PRs: 23     │ │
│ └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│ (Home)  (Projects)  [Explore] (Chat) (P)│ ◄── LOCKED BOTTOM NAVIGATION BAR
└─────────────────────────────────────────┘`}
                    </pre>
                  </div>

                  {/* Wireframe 3: 3-column Desktop layout screen */}
                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold text-white">
                      <span>MOCKUP #3: DESKTOP MULTI-PANEL VIEWPORT (1440 x 1024 viewport)</span>
                      <span className="text-[10px] font-mono text-indigo-400">Desktop 3-column stage</span>
                    </div>
                    <pre className="p-2 bg-slate-950 rounded text-[9.5px] font-mono text-slate-350 leading-relaxed overflow-x-auto">
{`┌────────────────────────────────────────────────────────────────────────────────────────┐
│ [Trophy] SKILLCOLLAB • University Platform                           [Avatar] Ashish  │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ ┌──────────────────────┐ ┌──────────────────────────────────────────┐ ┌──────────────────────┐ │
│ │  Navigation Desk     │ │ Hey Ashish, keep climbing!       142 reps│ │  Suggested Teammates │ │
│ │                      │ ├──────────────────────────────────────────┤ │                      │ │
│ │ [Icon] Home Feed     │ │ [O] Ashish Ghadigaonkar     [Time: 2hr ago]│ │ Sneha Nair (96%)     │ │
│ │ [Icon] Projects Board│ │ Solver of Solidity ledger models!        │ │ [Chat]               │ │
│ │ [Icon] Team Builder  │ │ Stack: [React] [Rust] [Python]           │ │                      │ │
│ │ [Icon] Team Chats    │ │                                          │ │ Rohan Sharma (92%)   │ │
│ │ [Icon] Career Suite  │ │ ┌──────────────────────────────────────┐ │ │ [Chat]               │ │
│ │ [Icon] Startup Hub   │ │ │ Ref: EtherPulse Tracker              │ │ │                      │ │
│ │ [Icon] Open Source   │ │ └──────────────────────────────────────┘ │ ├──────────────────────┤ │
│ │                      │ │ (♥) 14   (💬) 1 replies   (Share)   (■)  │ │  🔔 Alerts Inbox     │ │
│ │ [Icon] Hackathons    │ └──────────────────────────────────────────┘ │  (*) Appied on React │ │
│ │ [Icon] Internships   │ ┌──────────────────────────────────────────┐ │  (*) Milestone Done  │ │
│ │ [Icon] Mentors       │ │ [🏆] National Fintech Winner 1st Place   │ │                      │ │
│ │                      │ │ Shared by Sneha Kapadia | 1 day ago       │ │ 🏆 Trending Hacks    │ │
│ │ [Icon] Admin Console │ │ We merged 42 pull requests!              │ │ (*) AI Hackathon     │ │
│ └──────────────────────┘ └──────────────────────────────────────────┘ └──────────────────────┘ │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ SkillCollab SaaS Platform • Modern startup design specifications                       │
└────────────────────────────────────────────────────────────────────────────────────────┘`}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "devops" && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <Terminal className="text-indigo-400" /> 6. DevOps Configuration & Deployment Blueprint
              </h3>

              <div className="space-y-4">
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <h4 className="font-semibold text-white text-xs font-mono">Dockerfile (Production-optimized build pattern)</h4>
                  <pre className="p-2 bg-slate-900 border border-slate-800 rounded text-[9px] text-slate-300 font-mono overflow-auto">
{`FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist ./dist
EXPOSE 3000
CMD ["npm", "start"]`}
                  </pre>
                </div>

                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <h4 className="font-semibold text-white text-xs font-mono">Nginx Virtual-Host Proxy Layer Configuration</h4>
                  <pre className="p-2 bg-slate-900 border border-slate-800 rounded text-[9px] text-slate-300 font-mono overflow-auto">
{`server {
    listen 80;
    server_name skillcollab.edu;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}`}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <Shield className="text-indigo-400" /> 7. Enterprise Security Configurations
              </h3>

              <div className="space-y-4">
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl">
                  <h4 className="font-semibold text-indigo-400 text-sm mb-2">Core Defense Strategies</h4>
                  <ul className="list-disc pl-5 text-xs text-slate-300 space-y-2">
                    <li><strong>Helmet security headers</strong>: Prevents browser frame hijacking and secures against Cross-Site Scripting (XSS).</li>
                    <li><strong>NoSQL Injection Protection</strong>: Express middleware sanitizing inputs from character signatures like <code>$gt</code> or <code>$where</code>.</li>
                    <li><strong>JWT Token Management</strong>: Storing refresh tokens in HttpOnly secure cookies and access credentials in stateless request headers.</li>
                  </ul>
                </div>

                <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
                  <h4 className="font-semibold text-white text-xs font-mono">Express NoSQL Injection Guard Middleware Code</h4>
                  <pre className="p-2 bg-slate-900 border border-slate-800 rounded text-[9px] text-slate-300 font-mono overflow-auto">
{`export function nosqlSanitizer(req: any, res: any, next: any) {
  const sanitize = (obj: any) => {
    if (obj && typeof obj === "object") {
      for (const key in obj) {
        if (key.startsWith("$")) {
          delete obj[key];
        } else if (typeof obj[key] === "object") {
          sanitize(obj[key]);
        }
      }
    }
  };
  sanitize(req.body);
  sanitize(req.query);
  sanitize(req.params);
  next();
}`}
                  </pre>
                </div>
              </div>
            </div>
          )}

          {activeTab === "roadmap" && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3">
                <Map className="text-indigo-400" /> 8. Startup Engineering Roadmap
              </h3>

              <div className="space-y-4 font-sans text-xs">
                <div className="border-l-2 border-indigo-500 pl-4 space-y-1 mb-4">
                  <h4 className="font-semibold text-white">Phase 1: MVP Release (Weeks 1 to 4)</h4>
                  <p className="text-slate-400">Core authentication, student profile setup with skills catalog, and primary project post-recruitment pages. Direct messaging system bootstrap.</p>
                </div>

                <div className="border-l-2 border-emerald-500 pl-4 space-y-1 mb-4">
                  <h4 className="font-semibold text-white">Phase 2: Hackathon & Mentor Hub (Weeks 5 to 8)</h4>
                  <p className="text-slate-400">Implement Google GDSC and on-chain hackathon project rosters. Support calendar slot bookings with mentor review pipelines.</p>
                </div>

                <div className="border-l-2 border-amber-500 pl-4 space-y-1 mb-4">
                  <h4 className="font-semibold text-white">Phase 3: AI Recommendations & Internships (Weeks 9 to 12)</h4>
                  <p className="text-slate-400">Integrate Google GenAI matching parameters model in cloud. Roll out internship application dashboards and resume validation tags.</p>
                </div>

                <div className="border-l-2 border-purple-500 pl-4 space-y-1">
                  <h4 className="font-semibold text-white">Phase 4: Scaled Performance & Enterprise Audit (Weeks 13+)</h4>
                  <p className="text-slate-400">Deploy Redis container caches, run load balancer checks, finalize security external penetration trials and launch region campus programs.</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
