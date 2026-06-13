/**
 * @license
 * SPDX-License-Identifier: Apache-2.5
 */

import React, { useState, useEffect } from "react";
import { 
  Trophy, BookOpen, Users, FolderPlus, Compass, 
  MessageSquare, LayoutGrid, Cpu, Bell, Shield, 
  Layers, HelpCircle, GraduationCap, MapPin, Sparkles, 
  User, Star, Menu, X, ArrowUpRight, Award, Plus, CheckCircle
} from "lucide-react";

import Dashboard from "./components/Dashboard";
import ProjectMarketplace from "./components/ProjectMarketplace";
import TeamBuilder from "./components/TeamBuilder";
import RecommendationEngine from "./components/RecommendationEngine";
import HackathonHub from "./components/HackathonHub";
import InternshipBoard from "./components/InternshipBoard";
import MentorNetwork from "./components/MentorNetwork";
import WorkspaceChat from "./components/WorkspaceChat";
import AdminConsole from "./components/AdminConsole";
import DeveloperBlueprint from "./components/DeveloperBlueprint";
import AICareerSuite from "./components/AICareerSuite";
import StartupLaunchpad from "./components/StartupLaunchpad";
import OpenSourceHub from "./components/OpenSourceHub";
import HomeFeed from "./components/HomeFeed";
import MyUserProfile from "./components/MyUserProfile";
import ProfessionalNetworkSuite from "./components/ProfessionalNetworkSuite";
import { Project } from "./types";
import { FirebaseAuthService } from "./services/firebase";

export default function App() {
  // Mobile active tabs mapping: "home" | "projects" | "explore" | "chat" | "profile"
  // Desktop active tabs can also hold values like "hackathons" | "mentors" | "internships" | "teams" | "startup_launchpad" | "open_source" | "ai_matcher" | "admin" | "blueprint"
  const [activeTab, setActiveTab] = useState<string>("home");
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Suggested partners block
  const [suggestedTeammates] = useState([
    { id: "suggest_1", name: "Sneha Nair", role: "UI/UX Designer", matchRate: "96%", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80", stack: ["Figma", "Swift", "Tailwind"] },
    { id: "suggest_2", name: "Rohan Sharma", role: "Backend Architect", matchRate: "92%", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80", stack: ["Node.js", "Docker", "Rust"] },
    { id: "suggest_3", name: "Juhi Chawla", role: "ML Researcher", matchRate: "88%", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&h=100&q=80", stack: ["Python", "PyTorch", "gRPC"] }
  ]);

  // Suggested Project matching
  const [trendingHackathons] = useState([
    { id: "hack_1", title: "AI Studio Hackathon 2026", prize: "$15K Pool", daysLeft: "4 days left" },
    { id: "hack_2", title: "Superchain India Devfest", prize: "$20K Pool", daysLeft: "12 days left" }
  ]);

  const [authChecking, setAuthChecking] = useState(true);
  const [syncingUser, setSyncingUser] = useState(false);

  useEffect(() => {
    // Sync with Firebase auth state changes
    const unsubscribe = FirebaseAuthService.onAuthStateChangedListener(async (userObj) => {
      setAuthChecking(true);
      if (userObj) {
        setSyncingUser(true);
        try {
          const response = await fetch("/api/auth/sync", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              ...(userObj.idToken ? { "Authorization": `Bearer ${userObj.idToken}` } : {})
            },
            body: JSON.stringify({ user: userObj })
          });

          if (response.ok) {
            const result = await response.json();
            setCurrentUser(result.user);
          } else {
            console.error("Auth persistent synchronization handshake rejected.");
          }
        } catch (err) {
          console.error("Network error during auth synchronization:", err);
        } finally {
          setSyncingUser(false);
        }
      } else {
        setCurrentUser(null);
      }
      setAuthChecking(false);
    });

    // Fetch non-authenticated core dependencies
    fetchSecondaryData();

    return () => {
      unsubscribe();
    };
  }, []);

  const fetchSecondaryData = async () => {
    try {
      const [resProj, resNotif] = await Promise.all([
        fetch("/api/projects"),
        fetch("/api/notifications")
      ]);

      if (resProj.ok) {
        const p = await resProj.json();
        setProjects(p);
      }
      if (resNotif.ok) {
        const n = await resNotif.json();
        setNotifications(n);
        const unread = n.filter((msg: any) => !msg.read).length;
        setUnreadNotificationsCount(unread);
      }
    } catch (e) {
      console.error("Failed to initialize system core resources:", e);
    }
  };

  const fetchMainState = async () => {
    try {
      const [resUser, resProj, resNotif] = await Promise.all([
        fetch("/api/users/me"),
        fetch("/api/projects"),
        fetch("/api/notifications")
      ]);

      if (resUser.ok) {
        const u = await resUser.json();
        setCurrentUser(u);
      }
      if (resProj.ok) {
        const p = await resProj.json();
        setProjects(p);
      }
      if (resNotif.ok) {
        const n = await resNotif.json();
        setNotifications(n);
        const unread = n.filter((msg: any) => !msg.read).length;
        setUnreadNotificationsCount(unread);
      }
    } catch (e) {
      console.error("Failed to re-sync profile state parameters:", e);
    }
  };

  const handleProjectSuccess = () => {
    fetchMainState();
  };

  const dashboardActiveProjectCount = projects.filter(p => 
    p.creatorId === currentUser?.id || (p as any).members?.some((m: any) => m.fullName === currentUser?.fullName)
  ).length;

  const handleMarkNotificationsRead = async () => {
    try {
      const res = await fetch("/api/notifications/read-all", { method: "POST" });
      if (res.ok) {
        fetchMainState();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Switch to specific tab from clicking explore cards on mobile or right sidebars
  const navigateToTab = (tabId: string) => {
    setActiveTab(tabId);
    setSidebarOpen(false);
    // Smooth scroll page back top
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (authChecking) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center font-sans">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex justify-center items-center shadow-lg animate-pulse mb-4">
          <Trophy className="w-8 h-8 text-indigo-500 animate-spin" style={{ animationDuration: "3s" }} />
        </div>
        <p className="text-[10px] font-mono text-slate-500 tracking-wider">AUTHENTICATING SECURE HANDSHAKE...</p>
        {syncingUser && <span className="text-[9px] text-indigo-400 mt-1.5 font-mono animate-pulse">MATCHING DATABASE PROFILE...</span>}
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 font-sans relative overflow-hidden">
        {/* Starry highlight cosmic vector behind */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="w-full max-w-sm bg-slate-900/90 border border-slate-850 p-6 xs:p-8 rounded-3xl shadow-2xl relative z-10 space-y-6 text-center backdrop-blur-md">
          {/* Brand Logo Header */}
          <div className="space-y-3">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 border border-indigo-400/25 flex justify-center items-center shadow-md shadow-indigo-600/15">
              <Trophy className="w-6 h-6 text-indigo-100 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-mono font-extrabold text-white tracking-widest uppercase">SkillCollab</h2>
              <p className="text-[10px] text-slate-400 mt-1">Campus Project Collaborations & Verifications</p>
            </div>
          </div>

          <div className="h-px bg-slate-805/60 w-full" />

          {/* Context Explainer */}
          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest font-mono">Gateway Interface</h3>
            <p className="text-[11px] text-slate-450 leading-normal">
              Authorize with verified identity to join student hackathons, post technical profiles, and match dynamically with engineering teammates.
            </p>
          </div>

          {/* Identity Providers Actions */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={async () => {
                try {
                  await FirebaseAuthService.signInWithGoogle();
                } catch (e) {
                  console.error(e);
                }
              }}
              className="w-full py-3 px-4 bg-white hover:bg-slate-100 text-slate-950 font-bold rounded-xl text-xs flex justify-center items-center gap-2 shadow-md transition-all active:scale-[0.98] cursor-pointer"
            >
              Sign In with Google Account
            </button>

            <button
              onClick={async () => {
                try {
                  await FirebaseAuthService.signInWithGithub();
                } catch (e) {
                  console.error(e);
                }
              }}
              className="w-full py-3 px-4 bg-slate-950 hover:bg-slate-850 text-white font-bold border border-slate-800 rounded-xl text-xs flex justify-center items-center gap-2 shadow-md transition-all active:scale-[0.98] cursor-pointer"
            >
              Sign In with GitHub Developer
            </button>
          </div>

          <div className="pt-2 text-[8.5px] text-slate-500 font-mono tracking-wider">
            {FirebaseAuthService.isSimulation ? (
              <span className="text-indigo-400 flex items-center justify-center gap-1 font-bold">
                ⚙️ ACTIVE SYSTEM SIMULATOR ENVIRONMENT
              </span>
            ) : (
              "🔒 ENTERPRISE SECURED OAUTH ENVELOPE"
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/35 selection:text-white pb-16 md:pb-0">
      
      {/* 1. TOP RESPONSIVE HEADER BAR */}
      <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-lg border-b border-slate-900/80 px-4 py-3 md:px-6 flex justify-between items-center">
        {/* Left corner branding */}
        <div className="flex items-center gap-2.5">
          {/* Menu button for mobile/tablet sidebar list */}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-slate-450 hover:text-white p-1.5 rounded-lg hover:bg-slate-900 active:scale-95 transition-all cursor-pointer"
          >
            {sidebarOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5" />}
          </button>

          <div
            onClick={() => navigateToTab("home")}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <div className="w-8.5 h-8.5 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 border border-indigo-400/25 flex justify-center items-center shadow-md shadow-indigo-600/15">
              <Trophy className="w-4.5 h-4.5 text-indigo-100" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 leading-none">
                <h1 className="text-sm font-extrabold tracking-tight text-white uppercase font-mono">SkillCollab</h1>
                <span className="px-1.5 py-0.5 bg-indigo-500/10 border border-indigo-500/25 rounded text-[7.5px] font-bold text-indigo-400 font-mono tracking-wider">
                  MOBILE-FIRST
                </span>
              </div>
              <p className="text-[9px] text-slate-500 font-medium italic mt-0.5 leading-none hidden xs:block">LinkedIn for Engineering Projects</p>
            </div>
          </div>
        </div>

        {/* Right corner indicators */}
        <div className="flex items-center gap-3">
          {currentUser && (
            <div 
              onClick={() => navigateToTab("profile")}
              className="flex items-center gap-2 bg-slate-900/50 hover:bg-slate-900 border border-slate-900 px-2.5 py-1.5 rounded-xl text-xs cursor-pointer select-none transition-colors"
            >
              <img 
                src={currentUser.avatarUrl} 
                alt={currentUser.fullName} 
                className="w-6.5 h-6.5 rounded-full object-cover border border-indigo-500/20"
                referrerPolicy="no-referrer"
              />
              <div className="hidden sm:block text-left">
                <p className="font-extrabold text-white text-[11px] leading-none">{currentUser.fullName.split(" ")[0]}</p>
                <p className="text-[8px] text-indigo-400 mt-0.5 font-mono leading-none flex items-center gap-0.5">
                  🏆 {currentUser.reputationPoints} pt
                </p>
              </div>
            </div>
          )}

          {/* Quick notifications bell count */}
          <div className="relative">
            <button 
              onClick={() => navigateToTab("home")} 
              className="p-1.5 rounded-lg border border-slate-900 hover:bg-slate-900 transition-colors cursor-pointer relative"
            >
              <Bell className="w-4 h-4 text-slate-400" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-indigo-600 text-[8px] font-bold flex justify-center items-center text-white border border-slate-950">
                  {unreadNotificationsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 2. MAIN HUB INTERFACE WITH RESPONSIVE LAYOUT COLUMNS */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex">
        
        {/* LEFT COLUMN SIDEBAR: Locked on Desktop/Tablet, Expandable sliding drawer on Mobile */}
        <aside 
          className={`
            fixed md:sticky top-0 md:top-15 z-30 h-[calc(100vh-50px)] md:h-[calc(100vh-65px)]
            bg-slate-950/95 md:bg-transparent border-r md:border-r-0 border-slate-900 md:border-none p-4
            w-64 shrink-0 transition-all duration-200 ease-in-out md:block
            ${sidebarOpen ? "left-0" : "-left-64 md:left-0"}
          `}
        >
          <div className="bg-slate-900 border border-slate-850 rounded-2xl p-4 h-full flex flex-col justify-between overflow-y-auto custom-scrollbar">
            
            {/* Top Navigation Options list */}
            <div className="space-y-4">
              <div className="text-slate-500 text-[10px] font-mono font-bold uppercase tracking-widest px-1.5">
                Navigation Desk
              </div>
              
              <nav className="space-y-1 text-xs">
                {/* Home social timeline */}
                <button
                  onClick={() => navigateToTab("home")}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                    activeTab === "home" || activeTab === "dashboard"
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                      : "text-slate-400 hover:text-white hover:bg-slate-855"
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" /> Home Feed
                </button>

                {/* Projects board */}
                <button
                  onClick={() => navigateToTab("projects")}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                    activeTab === "projects"
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                      : "text-slate-400 hover:text-white hover:bg-slate-855"
                  }`}
                >
                  <FolderPlus className="w-4 h-4 text-emerald-400" /> Projects Board
                </button>

                {/* Teams recruitment */}
                <button
                  onClick={() => navigateToTab("teams")}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                    activeTab === "teams"
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-slate-400 hover:text-white hover:bg-slate-855"
                  }`}
                >
                  <Users className="w-4 h-4 text-indigo-400" /> Team Builder
                </button>

                {/* System chats (Discord Whatsapp hybrid) */}
                <button
                  onClick={() => navigateToTab("chats")}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                    activeTab === "chats"
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-slate-400 hover:text-white hover:bg-slate-855"
                  }`}
                >
                  <MessageSquare className="w-4 h-4 text-pink-400" /> Team Chats
                </button>

                {/* AI Career Suite */}
                <button
                  onClick={() => navigateToTab("ai_career_suite")}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                    activeTab === "ai_career_suite"
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-slate-400 hover:text-white hover:bg-slate-855"
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-amber-300" /> AI Career Suite
                </button>

                {/* Professional LinkedIn Suite */}
                <button
                  onClick={() => navigateToTab("professional_suite")}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                    activeTab === "professional_suite"
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                      : "text-slate-400 hover:text-white hover:bg-slate-855"
                  }`}
                >
                  <Award className="w-4 h-4 text-emerald-400" /> Career & Network Hub
                </button>

                {/* Startups Hub generator */}
                <button
                  onClick={() => navigateToTab("startup_launchpad")}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                    activeTab === "startup_launchpad"
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-slate-400 hover:text-white hover:bg-slate-855"
                  }`}
                >
                  <Layers className="w-4 h-4 text-violet-400" /> Startup Hub
                </button>

                {/* Open source tasks */}
                <button
                  onClick={() => navigateToTab("open_source")}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                    activeTab === "open_source"
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-slate-400 hover:text-white hover:bg-slate-855"
                  }`}
                >
                  <Cpu className="w-4 h-4 text-emerald-300" /> Open Source Hub
                </button>

                <div className="h-px bg-slate-850/60 my-2" />

                {/* University Hackathons */}
                <button
                  onClick={() => navigateToTab("hackathons")}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                    activeTab === "hackathons"
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-slate-400 hover:text-white hover:bg-slate-855"
                  }`}
                >
                  <Trophy className="w-4 h-4 text-amber-400" /> Hackathons Hub
                </button>

                {/* Internships board */}
                <button
                  onClick={() => navigateToTab("internships")}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                    activeTab === "internships"
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-slate-400 hover:text-white hover:bg-slate-855"
                  }`}
                >
                  <BookOpen className="w-4 h-4 text-cyan-400" /> Internships
                </button>

                {/* Mentorship Nodes */}
                <button
                  onClick={() => navigateToTab("mentors")}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                    activeTab === "mentors"
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-slate-400 hover:text-white hover:bg-slate-855"
                  }`}
                >
                  <GraduationCap className="w-4 h-4 text-orange-400" /> Mentors Network
                </button>

                {/* Analytics engine */}
                <button
                  onClick={() => navigateToTab("ai_matcher")}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                    activeTab === "ai_matcher"
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-slate-400 hover:text-white hover:bg-slate-855"
                  }`}
                >
                  <Cpu className="w-4 h-4 text-fuchsia-400 fill-fuchsia-400/10" /> AI Matcher
                </button>

                {/* Settings Admin and Blueprint PRD */}
                <div className="h-px bg-slate-850/60 my-2" />

                <button
                  onClick={() => navigateToTab("admin")}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                    activeTab === "admin"
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-slate-400 hover:text-white hover:bg-slate-855"
                  }`}
                >
                  <Shield className="w-4 h-4" /> Admin Console
                </button>

                <button
                  onClick={() => navigateToTab("blueprint")}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl font-bold transition-all cursor-pointer ${
                    activeTab === "blueprint"
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-slate-400 hover:text-white hover:bg-slate-855"
                  }`}
                >
                  <Compass className="w-4 h-4 text-sky-400" /> Figma PRD
                </button>
              </nav>
            </div>

            <div className="pt-4 border-t border-slate-850/60 text-slate-500 font-mono text-[9px] text-center leading-normal">
              SkillCollab v1.4 • Mobile First Design
            </div>
          </div>
        </aside>

        {/* MIDDLE COLUMN WORKSPACE: Main scrolling interface */}
        <main className="flex-1 w-full min-w-0 p-3 md:p-5 transition-all overflow-hidden">
          
          {/* MOBILE MAIN DASHBOARD WELCOME CARD */}
          {(activeTab === "home" || activeTab === "dashboard") && (
            <div className="space-y-4">
              {/* Profile welcome summary banner at the topmost home layer */}
              <div className="bg-gradient-to-br from-indigo-950/50 to-slate-900 border border-slate-850 p-4 rounded-2xl flex items-center justify-between gap-4">
                <div className="space-y-1">
                  <span className="text-[9.5px] font-mono text-indigo-400 font-bold uppercase tracking-wider block">
                    Welcome Back, Student Developer
                  </span>
                  <h2 className="text-md md:text-lg font-extrabold text-white leading-tight">
                    Hey {currentUser ? currentUser.fullName : "Ashish"}! Keep climbing.
                  </h2>
                  <p className="text-[10.5px] text-slate-400 leading-normal max-w-md">
                    Apply to join local hackathon squads, commit code to claim verified OSS prizes, or consult senior mentors.
                  </p>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-2xl font-extrabold font-mono text-amber-400 leading-none block">
                    {currentUser ? currentUser.reputationPoints : 100}
                  </span>
                  <span className="text-[9px] text-slate-500 font-mono block uppercase">Rep Points</span>
                </div>
              </div>

              {/* Home Timeline Social feeds */}
              <HomeFeed />
            </div>
          )}

          {/* Core modules routes */}
          {activeTab === "projects" && (
            <ProjectMarketplace onProjectCreated={handleProjectSuccess} />
          )}

          {activeTab === "teams" && (
            <TeamBuilder 
              projects={projects}
              fetchProjects={handleProjectSuccess}
              onRosterUpdated={handleProjectSuccess}
            />
          )}

          {/* Explore Hub list for Mobile viewports */}
          {activeTab === "explore" && (
            <div className="space-y-5">
              <div className="bg-slate-900 border border-slate-850 p-4 rounded-2xl">
                <span className="text-xs font-bold font-mono text-indigo-400 uppercase tracking-widest block mb-1">
                  University Ecosystem
                </span>
                <h2 className="text-md font-bold text-white">Explore Campus Collaboration Channels</h2>
                <p className="text-[11px] text-slate-400 mt-0.5 mt-0.5">Instant matching portals for hackathons, technical advisories, internship recruitments, and open-source.</p>
              </div>

              {/* Bento category selection grid */}
              <div className="grid grid-cols-2 gap-3.5 text-xs">
                
                <div 
                  onClick={() => navigateToTab("teams")}
                  className="bg-slate-900 hover:bg-slate-850 border border-slate-850 p-4 rounded-2xl space-y-2 cursor-pointer transition-all active:scale-95 text-center sm:text-left select-none"
                >
                  <Users className="w-7 h-7 text-indigo-400 mx-auto sm:mx-0" />
                  <h4 className="font-bold text-white">Team Builder</h4>
                  <p className="text-[10px] text-slate-500 leading-normal">Solve recruiting hurdles; pair with B.Tech, business development and marketing rosters.</p>
                </div>

                <div 
                  onClick={() => navigateToTab("ai_career_suite")}
                  className="bg-slate-900 hover:bg-slate-850 border border-slate-850 p-4 rounded-2xl space-y-2 cursor-pointer transition-all active:scale-95 text-center sm:text-left select-none"
                >
                  <Sparkles className="w-7 h-7 text-amber-300" />
                  <h4 className="font-bold text-white">AI Career Suite</h4>
                  <p className="text-[10px] text-slate-500 leading-normal">Score resumes, pass real mock technical scenario sim panels, find specialization roadmaps.</p>
                </div>

                <div 
                  onClick={() => navigateToTab("startup_launchpad")}
                  className="bg-slate-900 hover:bg-slate-850 border border-slate-850 p-4 rounded-2xl space-y-2 cursor-pointer transition-all active:scale-95 text-center sm:text-left select-none"
                >
                  <Layers className="w-7 h-7 text-indigo-400" />
                  <h4 className="font-bold text-white">Startup Launchpad</h4>
                  <p className="text-[10px] text-slate-500 leading-normal">Pitch product ideas, auto-generate AI MVPs, seek corporate co-founders.</p>
                </div>

                <div 
                  onClick={() => navigateToTab("open_source")}
                  className="bg-slate-900 hover:bg-slate-850 border border-slate-850 p-4 rounded-2xl space-y-2 cursor-pointer transition-all active:scale-95 text-center sm:text-left select-none"
                >
                  <Cpu className="w-7 h-7 text-emerald-400" />
                  <h4 className="font-bold text-white">Open Source Hub</h4>
                  <p className="text-[10px] text-slate-500 leading-normal">Claim beginner first-issues on active campus repositories & earn score points.</p>
                </div>

                <div 
                  onClick={() => navigateToTab("hackathons")}
                  className="bg-slate-900 hover:bg-slate-850 border border-slate-850 p-4 rounded-2xl space-y-2 cursor-pointer transition-all active:scale-95 text-center sm:text-left select-none"
                >
                  <Trophy className="w-7 h-7 text-amber-400 mx-auto sm:mx-0" />
                  <h4 className="font-bold text-white">Hackathons Hub</h4>
                  <p className="text-[10px] text-slate-500 leading-normal">Form GDSC squads and register for international tech developer runnings.</p>
                </div>

                <div 
                  onClick={() => navigateToTab("internships")}
                  className="bg-slate-900 hover:bg-slate-850 border border-slate-850 p-4 rounded-2xl space-y-2 cursor-pointer transition-all active:scale-95 text-center sm:text-left select-none"
                >
                  <BookOpen className="w-7 h-7 text-cyan-400 mx-auto sm:mx-0" />
                  <h4 className="font-bold text-white">Internships</h4>
                  <p className="text-[10px] text-slate-500 leading-normal">Apply to tech roles backed by verified milestone and portfolio checks.</p>
                </div>

                <div 
                  onClick={() => navigateToTab("mentors")}
                  className="bg-slate-900 hover:bg-slate-850 border border-slate-850 p-4 rounded-2xl space-y-2 cursor-pointer transition-all active:scale-95 text-center sm:text-left select-none"
                >
                  <GraduationCap className="w-7 h-7 text-orange-400 mx-auto sm:mx-0" />
                  <h4 className="font-bold text-white">Mentors Network</h4>
                  <p className="text-[10px] text-slate-500 leading-normal">Book live whiteboard review slots from Google, Amazon, and Stripe developers.</p>
                </div>

                <div 
                  onClick={() => navigateToTab("ai_matcher")}
                  className="bg-slate-900 hover:bg-slate-850 border border-slate-850 p-4 rounded-2xl space-y-2 cursor-pointer transition-all active:scale-95 text-center sm:text-left select-none"
                >
                  <Cpu className="w-7 h-7 text-fuchsia-400" />
                  <h4 className="font-bold text-white">AI Match Matcher</h4>
                  <p className="text-[10px] text-slate-500 leading-normal">Review advanced matching results pointing to projects, teams, or mentors.</p>
                </div>

              </div>
              
              {/* Compact reputation details for explore page footer */}
              <div 
                onClick={() => navigateToTab("blueprint")}
                className="bg-slate-900 border border-slate-850 p-4 rounded-2xl flex items-center justify-between text-xs cursor-pointer hover:border-slate-800"
              >
                <div className="flex items-center gap-2.5">
                  <Compass className="w-5 h-5 text-indigo-400" />
                  <div>
                    <strong className="text-white font-bold text-xs block">Vetting Blueprint & Figma specifications</strong>
                    <span className="text-[10px] text-slate-450">Review system models, security guards, frame grids, and wireflows.</span>
                  </div>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          )}

          {/* Other core channels mapped for active drawer renders */}
          {activeTab === "chats" && <WorkspaceChat />}
          {activeTab === "ai_career_suite" && <AICareerSuite />}
          {activeTab === "startup_launchpad" && <StartupLaunchpad />}
          {activeTab === "open_source" && <OpenSourceHub />}
          {activeTab === "hackathons" && (
            <HackathonHub onSubmissionSuccess={handleProjectSuccess} />
          )}
          {activeTab === "internships" && (
            <InternshipBoard onApplicationSuccess={handleProjectSuccess} />
          )}
          {activeTab === "mentors" && <MentorNetwork />}
          {activeTab === "ai_matcher" && <RecommendationEngine />}
          {activeTab === "admin" && <AdminConsole />}
          {activeTab === "blueprint" && <DeveloperBlueprint />}
          
          {activeTab === "professional_suite" && (
            <ProfessionalNetworkSuite 
              currentUser={currentUser} 
              onUpdateCurrentUser={(updated) => setCurrentUser(updated)} 
            />
          )}
          
          {/* Main customized LinkedIn Profile screen */}
          {activeTab === "profile" && <MyUserProfile />}
        </main>

        {/* RIGHT COLUMN SIDEBAR: Suggested partners/Trending Hackathons widgets (Locked on Desktop, Hidden on mobile/tablets) */}
        <aside className="hidden xl:block w-76 p-4 shrink-0 h-[calc(100vh-65px)] sticky top-15 overflow-y-auto custom-scrollbar">
          <div className="space-y-5">
            
            {/* Suggested Partners widget */}
            <div className="bg-slate-900 border border-slate-850 p-4.5 rounded-2xl space-y-3.5">
              <div className="flex justify-between items-center border-b border-slate-850/60 pb-2">
                <span className="text-[10px] text-indigo-400 font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" /> Suggested Partners
                </span>
                <span className="text-[8.5px] bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-mono px-1 py-0.5 rounded">
                  AI Fit
                </span>
              </div>

              <div className="space-y-3 text-xs">
                {suggestedTeammates.map(collab => (
                  <div key={collab.id} className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <img 
                        src={collab.avatar} 
                        alt={collab.name} 
                        className="w-7.5 h-7.5 rounded-full border border-slate-800 object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <span className="font-bold text-white text-[11px] block leading-none">{collab.name}</span>
                        <span className="text-[9px] text-slate-400 mt-1 block leading-none">{collab.role}</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => navigateToTab("chats")}
                      className="px-2 py-1 bg-slate-950 hover:bg-slate-850 border border-slate-850 rounded text-[9px] text-slate-300 font-mono font-bold active:scale-95 transition-all cursor-pointer"
                    >
                      Chat ({collab.matchRate})
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending Hackathons widget */}
            <div className="bg-slate-900 border border-slate-850 p-4.5 rounded-2xl space-y-3">
              <div className="flex justify-between items-center border-b border-slate-850/60 pb-2">
                <span className="text-[10px] text-amber-400 font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5" /> Campus Hackathons
                </span>
                <span className="text-[8.5px] text-amber-400 font-mono">Live</span>
              </div>

              <div className="space-y-3.5 text-xs">
                {trendingHackathons.map(hack => (
                  <div key={hack.id} className="space-y-1 hover:bg-slate-850/30 p-1 rounded-lg transition-colors cursor-pointer" onClick={() => navigateToTab("hackathons")}>
                    <div className="flex justify-between items-center leading-none">
                      <span className="font-bold text-white text-[11px] truncate w-4/5">{hack.title}</span>
                      <span className="text-[9px] font-mono text-emerald-400 font-bold">{hack.prize}</span>
                    </div>
                    <p className="text-[9.5px] text-slate-500 font-mono">{hack.daysLeft}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Inbox Indicator Logs Widget */}
            <div className="bg-slate-900 border border-slate-850 p-4.5 rounded-2xl space-y-3">
              <div className="flex justify-between items-center border-b border-slate-850/60 pb-2">
                <span className="text-[10px] text-pink-400 font-mono font-bold uppercase tracking-wider flex items-center gap-1">
                  <Bell className="w-3.5 h-3.5" /> Recent Alerts Inbox
                </span>
                {notifications.some(n => !n.read) && (
                  <button 
                    onClick={handleMarkNotificationsRead}
                    className="text-[8.5px] text-indigo-400 font-semibold font-mono underline hover:text-indigo-300 cursor-pointer"
                  >
                    Clear All
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-[160px] overflow-y-auto custom-scrollbar pr-1 text-[11px] leading-relaxed">
                {notifications.slice(0, 3).map(notif => (
                  <div 
                    key={notif.id} 
                    className={`p-2 rounded-xl border text-[10px] transition-colors ${
                      notif.read 
                        ? "bg-slate-950/40 border-slate-900 text-slate-400" 
                        : "bg-indigo-950/20 border-indigo-900/40 text-slate-200"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <strong className="text-white font-bold leading-tight truncate w-11/12">{notif.title}</strong>
                      {!notif.read && <span className="w-1.5 h-1.5 rounded-full bg-indigo-505" />}
                    </div>
                    <p className="text-slate-400 text-[10px] mt-0.5 leading-normal">{notif.message}</p>
                  </div>
                ))}

                {notifications.length === 0 && (
                  <p className="text-center text-slate-500 text-[10px] py-2">No active indicator alerts.</p>
                )}
              </div>
            </div>

          </div>
        </aside>

      </div>

      {/* 3. LOCKED BOTTOM BAR FOR MOBILE PORTAL (Disappears from tablet up) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-slate-950/90 backdrop-blur-lg border-t border-slate-900 flex justify-around items-center py-2 px-1 text-center select-none shadow-2xl">
        
        {/* T1. HOME FEED */}
        <button
          onClick={() => navigateToTab("home")}
          className={`flex flex-col items-center justify-center gap-0.5 min-w-12 py-1 relative cursor-pointer active:scale-90 transition-all ${
            activeTab === "home" || activeTab === "dashboard" ? "text-indigo-400" : "text-slate-450"
          }`}
        >
          <LayoutGrid className="w-5 h-5" />
          <span className="text-[9px] font-semibold leading-none">Home</span>
          {(activeTab === "home" || activeTab === "dashboard") && (
            <span className="w-1 h-1 rounded-full bg-indigo-400 mt-0.5" />
          )}
        </button>

        {/* T2. PROJECTS MARKET */}
        <button
          onClick={() => navigateToTab("projects")}
          className={`flex flex-col items-center justify-center gap-0.5 min-w-12 py-1 relative cursor-pointer active:scale-90 transition-all ${
            activeTab === "projects" ? "text-indigo-400" : "text-slate-450"
          }`}
        >
          <FolderPlus className="w-5 h-5 text-emerald-400" />
          <span className="text-[9px] font-semibold leading-none">Projects</span>
          {activeTab === "projects" && (
            <span className="w-1 h-1 rounded-full bg-indigo-400 mt-0.5" />
          )}
        </button>

        {/* T3. EXPLORE CATEGORIES */}
        <button
          onClick={() => navigateToTab("explore")}
          className={`flex flex-col items-center justify-center gap-0.5 min-w-12 py-1 relative cursor-pointer active:scale-90 transition-all ${
            activeTab === "explore" ? "text-indigo-400" : "text-slate-450"
          }`}
        >
          <div className="w-7 h-7 rounded-full bg-indigo-600 border border-indigo-400/20 shadow flex items-center justify-center -mt-4 animate-pulse">
            <Compass className="w-4 h-4 text-white" />
          </div>
          <span className="text-[9px] font-semibold leading-none mt-0.5">Explore</span>
          {activeTab === "explore" && (
            <span className="w-1 h-1 rounded-full bg-indigo-400 mt-0.5" />
          )}
        </button>

        {/* T4. DISCORD CHATS */}
        <button
          onClick={() => navigateToTab("chats")}
          className={`flex flex-col items-center justify-center gap-0.5 min-w-12 py-1 relative cursor-pointer active:scale-90 transition-all ${
            activeTab === "chats" ? "text-indigo-400" : "text-slate-450"
          }`}
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5 text-pink-400" />
          </div>
          <span className="text-[9px] font-semibold leading-none">Chats</span>
          {activeTab === "chats" && (
            <span className="w-1 h-1 rounded-full bg-indigo-400 mt-0.5" />
          )}
        </button>

        {/* T5. LINKEDIN PROFILE */}
        <button
          onClick={() => navigateToTab("profile")}
          className={`flex flex-col items-center justify-center gap-0.5 min-w-12 py-1 relative cursor-pointer active:scale-90 transition-all ${
            activeTab === "profile" ? "text-indigo-400" : "text-slate-450"
          }`}
        >
          <User className="w-5 h-5 text-indigo-300" />
          <span className="text-[9px] font-semibold leading-none">Profile</span>
          {activeTab === "profile" && (
            <span className="w-1 h-1 rounded-full bg-indigo-400 mt-0.5" />
          )}
        </button>

      </nav>

    </div>
  );
}
