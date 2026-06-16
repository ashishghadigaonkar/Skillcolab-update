import React from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Trophy, FolderPlus, Users, MessageSquare, LayoutGrid, 
  Sparkles, Award, Layers, Cpu, BookOpen, GraduationCap, 
  Shield, Compass, Bell, BellOff, X, Menu, ArrowUpRight, User,
  Sun, Moon
} from "lucide-react";

interface DashboardLayoutProps {
  currentUser: any;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  unreadNotificationsCount: number;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  notifications: any[];
  handleMarkNotificationsRead: () => void;
  navigateToTab: (tabId: string) => void;
  theme?: "light" | "dark";
  onToggleTheme?: () => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  unreadNotificationsCount,
  sidebarOpen,
  setSidebarOpen,
  notifications,
  handleMarkNotificationsRead,
  navigateToTab,
  theme = "dark",
  onToggleTheme,
  children
}) => {
  // Static state placeholders to feed widgets perfectly:
  const suggestedTeammates = [
    { id: "suggest_1", name: "Sneha Nair", role: "UI/UX Designer", matchRate: "96%", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80" },
    { id: "suggest_2", name: "Rohan Sharma", role: "Backend Architect", matchRate: "92%", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80" },
    { id: "suggest_3", name: "Juhi Chawla", role: "ML Researcher", matchRate: "88%", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&h=100&q=80" }
  ];

  const trendingHackathons = [
    { id: "hack_1", title: "AI Studio Hackathon 2026", prize: "$15K Pool", daysLeft: "4 days left" },
    { id: "hack_2", title: "Superchain India Devfest", prize: "$20K Pool", daysLeft: "12 days left" }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/35 selection:text-white pb-16 md:pb-0">
      
      {/* 1. TOP RESPONSIVE HEADER BAR */}
      <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-lg border-b border-slate-900/80 px-4 py-3 md:px-6 flex justify-between items-center">
        <div className="flex items-center gap-2.5">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-900 active:scale-95 transition-all cursor-pointer"
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
                  SaaS Enterprise
                </span>
              </div>
              <p className="text-[9px] text-slate-500 font-medium italic mt-0.5 leading-none hidden xs:block">LinkedIn for Engineering Projects</p>
            </div>
          </div>
        </div>

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
                  🏆 {currentUser.reputationPoints || 100} pt
                </p>
              </div>
            </div>
          )}

          {onToggleTheme && (
            <button 
              onClick={onToggleTheme}
              className="p-1.5 rounded-lg border border-slate-900 hover:bg-slate-900 transition-colors cursor-pointer relative flex items-center justify-center text-slate-400 hover:text-white"
              title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
            >
              {theme === "light" ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4 text-amber-400" />}
            </button>
          )}

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
        
        {/* LEFT COLUMN SIDEBAR */}
        <aside 
          className={`
            fixed md:sticky top-0 md:top-15 z-30 h-[calc(100vh-50px)] md:h-[calc(100vh-65px)]
            bg-slate-950/95 md:bg-transparent border-r md:border-r-0 border-slate-900 md:border-none p-4
            w-64 shrink-0 transition-all duration-200 ease-in-out md:block
            ${sidebarOpen ? "left-0" : "-left-64 md:left-0"}
          `}
        >
          <div className="bg-slate-900 border border-slate-850 rounded-2xl p-4 h-full flex flex-col justify-between overflow-y-auto custom-scrollbar">
            <div className="space-y-5">
              <div className="text-slate-500 text-[10px] font-mono font-extrabold uppercase tracking-widest px-1.5 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Navigation Hub
              </div>
              
              <nav className="space-y-4 text-xs">
                {/* HOME */}
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 font-mono font-extrabold uppercase tracking-wider block px-1.5">Home</span>
                  <button
                    onClick={() => navigateToTab("home")}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold text-left transition-all cursor-pointer ${
                      activeTab === "home" || activeTab === "dashboard"
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                        : "text-slate-400 hover:text-white hover:bg-slate-850"
                    }`}
                  >
                    <LayoutGrid className="w-4 h-4" /> Home Feed
                  </button>
                </div>

                {/* COMMUNITY */}
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 font-mono font-extrabold uppercase tracking-wider block px-1.5">Community</span>
                  
                  <button
                    onClick={() => navigateToTab("professional_suite")}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold text-left transition-all cursor-pointer ${
                      activeTab === "professional_suite"
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                        : "text-slate-400 hover:text-white hover:bg-slate-850"
                    }`}
                  >
                    <Award className="w-4 h-4 text-pink-400" /> Peer Network
                  </button>

                  <button
                    onClick={() => navigateToTab("open_source")}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold text-left transition-all cursor-pointer ${
                      activeTab === "open_source"
                        ? "bg-indigo-600 text-white shadow-md"
                        : "text-slate-400 hover:text-white hover:bg-slate-855"
                    }`}
                  >
                    <Cpu className="w-4 h-4 text-emerald-300" /> Open Source Hub
                  </button>

                  <button
                    onClick={() => navigateToTab("hackathons")}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold text-left transition-all cursor-pointer ${
                      activeTab === "hackathons"
                        ? "bg-indigo-600 text-white shadow-md"
                        : "text-slate-400 hover:text-white hover:bg-slate-850"
                    }`}
                  >
                    <Trophy className="w-4 h-4 text-amber-400" /> Hackathons Hub
                  </button>
                </div>

                {/* BUILD */}
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 font-mono font-extrabold uppercase tracking-wider block px-1.5">Build</span>

                  <button
                    onClick={() => navigateToTab("projects")}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold text-left transition-all cursor-pointer ${
                      activeTab === "projects"
                        ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10"
                        : "text-slate-400 hover:text-white hover:bg-slate-850"
                    }`}
                  >
                    <FolderPlus className="w-4 h-4 text-emerald-400" /> Projects Board
                  </button>

                  <button
                    onClick={() => navigateToTab("teams")}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold text-left transition-all cursor-pointer ${
                      activeTab === "teams"
                        ? "bg-indigo-600 text-white shadow-md"
                        : "text-slate-400 hover:text-white hover:bg-slate-850"
                    }`}
                  >
                    <Users className="w-4 h-4 text-indigo-400" /> Team Builder
                  </button>

                  <button
                    onClick={() => navigateToTab("startup_launchpad")}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold text-left transition-all cursor-pointer ${
                      activeTab === "startup_launchpad"
                        ? "bg-indigo-600 text-white shadow-md"
                        : "text-slate-400 hover:text-white hover:bg-slate-850"
                    }`}
                  >
                    <Layers className="w-4 h-4 text-violet-400" /> Startup Launchpad
                  </button>
                </div>

                {/* CAREER */}
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 font-mono font-extrabold uppercase tracking-wider block px-1.5">Career</span>

                  <button
                    onClick={() => navigateToTab("ai_career_suite")}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold text-left transition-all cursor-pointer ${
                      activeTab === "ai_career_suite"
                        ? "bg-indigo-600 text-white shadow-md"
                        : "text-slate-400 hover:text-white hover:bg-slate-850"
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-amber-300" /> AI Career Suite
                  </button>

                  <button
                    onClick={() => navigateToTab("internships")}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold text-left transition-all cursor-pointer ${
                      activeTab === "internships"
                        ? "bg-indigo-600 text-white shadow-md"
                        : "text-slate-400 hover:text-white hover:bg-slate-850"
                    }`}
                  >
                    <BookOpen className="w-4 h-4 text-cyan-400" /> Internships Board
                  </button>

                  <button
                    onClick={() => navigateToTab("mentors")}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold text-left transition-all cursor-pointer ${
                      activeTab === "mentors"
                        ? "bg-indigo-600 text-white shadow-md"
                        : "text-slate-400 hover:text-white hover:bg-slate-850"
                    }`}
                  >
                    <GraduationCap className="w-4 h-4 text-orange-400" /> Mentors Network
                  </button>

                  <button
                    onClick={() => navigateToTab("ai_matcher")}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold text-left transition-all cursor-pointer ${
                      activeTab === "ai_matcher"
                        ? "bg-indigo-650 text-white shadow-md"
                        : "text-slate-400 hover:text-white hover:bg-slate-850"
                    }`}
                  >
                    <Cpu className="w-4 h-4 text-fuchsia-400" /> AI Matcher
                  </button>
                </div>

                {/* MESSAGES */}
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 font-mono font-extrabold uppercase tracking-wider block px-1.5">Messages</span>
                  <button
                    onClick={() => navigateToTab("chats")}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold text-left transition-all cursor-pointer ${
                      activeTab === "chats"
                        ? "bg-indigo-600 text-white shadow-md"
                        : "text-slate-400 hover:text-white hover:bg-slate-850"
                    }`}
                  >
                    <MessageSquare className="w-4 h-4 text-indigo-400" /> Collaboration Chats
                  </button>
                </div>

                {/* PROFILE */}
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-500 font-mono font-extrabold uppercase tracking-wider block px-1.5">Profile</span>
                  <button
                    onClick={() => navigateToTab("profile")}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold text-left transition-all cursor-pointer ${
                      activeTab === "profile"
                        ? "bg-indigo-600 text-white shadow-md"
                        : "text-slate-400 hover:text-white hover:bg-slate-850"
                    }`}
                  >
                    <User className="w-4 h-4 text-teal-400" /> My Professional Profile
                  </button>
                </div>

                <div className="h-px bg-slate-850/60 my-2" />

                {/* UTILITY */}
                <button
                  onClick={() => navigateToTab("admin")}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold text-left transition-all cursor-pointer text-xs ${
                    activeTab === "admin"
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-slate-500 hover:text-white hover:bg-slate-850"
                  }`}
                >
                  <Shield className="w-4 h-4" /> Admin Console
                </button>

                <button
                  onClick={() => navigateToTab("blueprint")}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl font-bold text-left transition-all cursor-pointer text-xs ${
                    activeTab === "blueprint"
                      ? "bg-indigo-600 text-white shadow-md"
                      : "text-slate-500 hover:text-white hover:bg-slate-850"
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

        {/* MIDDLE COLUMN WORKSPACE */}
        <main className="flex-1 w-full min-w-0 p-3 md:p-5 transition-all overflow-hidden">
          {children}
        </main>

        {/* RIGHT COLUMN SIDEBAR */}
        <aside className="hidden xl:block w-76 p-4 shrink-0 h-[calc(100vh-65px)] sticky top-15 overflow-y-auto custom-scrollbar">
          <div className="space-y-5">
            
            {/* Suggested Partners widget */}
            <div className="bg-slate-900 border border-slate-850 p-4.5 rounded-2xl space-y-3.5 text-left">
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
                      className="px-2 py-1 bg-slate-950 hover:bg-slate-855 border border-slate-850 rounded text-[9px] text-slate-300 font-mono font-bold active:scale-95 transition-all cursor-pointer"
                    >
                      Chat ({collab.matchRate})
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending Hackathons widget */}
            <div className="bg-slate-900 border border-slate-850 p-4.5 rounded-2xl space-y-3 text-left">
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
            <div className="bg-slate-900 border border-slate-850 p-4.5 rounded-2xl space-y-3 text-left">
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
                        ? "bg-slate-950/40 border-slate-950 text-slate-500" 
                        : "bg-indigo-950/20 border-indigo-900/40 text-slate-200"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <strong className="text-white font-bold leading-tight truncate w-11/12">{notif.title}</strong>
                      {!notif.read && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />}
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

      {/* 3. LOCKED BOTTOM BAR FOR MOBILE PORTAL */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[var(--surface)] backdrop-blur-md border-t border-[var(--border)] grid grid-cols-5 h-16 pb-2.5 pt-2 px-1 select-none shadow-[0_-8px_30px_rgba(0,0,0,0.1)] transition-all">
        {(() => {
          const isHomeActive = activeTab === "home" || activeTab === "dashboard";
          return (
            <button
              onClick={() => navigateToTab("home")}
              className={`w-full h-full flex flex-col items-center justify-center gap-1 relative cursor-pointer active:scale-95 duration-150 transition-all ${
                isHomeActive ? "text-[var(--accent)] font-semibold" : "text-[var(--text-muted)] hover:text-[var(--text-secondary)] font-medium"
              }`}
            >
              {isHomeActive && (
                <motion.div
                  layoutId="bottomNavActivePill"
                  className="absolute inset-y-[2px] inset-x-[4px] bg-[var(--accent)]/5 rounded-xl -z-10 border border-[var(--accent)]/10"
                  transition={{ type: "spring", stiffness: 380, damping: 28 }}
                />
              )}
              <motion.div
                className="flex items-center justify-center"
                animate={{ scale: isHomeActive ? 1.1 : 1, y: isHomeActive ? -1 : 0 }}
                transition={{ type: "spring", stiffness: 440, damping: 20 }}
              >
                <LayoutGrid className="w-5 h-5" />
              </motion.div>
              <span className="text-[9.5px] tracking-tight leading-none font-sans text-center">Home</span>
              {isHomeActive && (
                <motion.span
                  layoutId="bottomNavDot"
                  className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] absolute bottom-0.5"
                  transition={{ type: "spring", stiffness: 380, damping: 28 }}
                />
              )}
            </button>
          );
        })()}

        {(() => {
          const isProjectsActive = activeTab === "projects";
          return (
            <button
              onClick={() => navigateToTab("projects")}
              className={`w-full h-full flex flex-col items-center justify-center gap-1 relative cursor-pointer active:scale-95 duration-150 transition-all ${
                isProjectsActive ? "text-[var(--accent)] font-semibold" : "text-[var(--text-muted)] hover:text-[var(--text-secondary)] font-medium"
              }`}
            >
              {isProjectsActive && (
                <motion.div
                  layoutId="bottomNavActivePill"
                  className="absolute inset-y-[2px] inset-x-[4px] bg-[var(--accent)]/5 rounded-xl -z-10 border border-[var(--accent)]/10"
                  transition={{ type: "spring", stiffness: 380, damping: 28 }}
                />
              )}
              <motion.div
                className="flex items-center justify-center"
                animate={{ scale: isProjectsActive ? 1.1 : 1, y: isProjectsActive ? -1 : 0 }}
                transition={{ type: "spring", stiffness: 440, damping: 20 }}
              >
                <FolderPlus className="w-5 h-5" />
              </motion.div>
              <span className="text-[9.5px] tracking-tight leading-none font-sans text-center">Build</span>
              {isProjectsActive && (
                <motion.span
                  layoutId="bottomNavDot"
                  className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] absolute bottom-0.5"
                  transition={{ type: "spring", stiffness: 380, damping: 28 }}
                />
              )}
            </button>
          );
        })()}

        {(() => {
          const isExploreActive = activeTab === "explore";
          return (
            <button
              onClick={() => navigateToTab("explore")}
              className={`w-full h-full flex flex-col items-center justify-center gap-1 relative cursor-pointer active:scale-95 duration-150 transition-all ${
                isExploreActive ? "text-[var(--accent)] font-semibold" : "text-[var(--text-muted)] hover:text-[var(--text-secondary)] font-medium"
              }`}
            >
              {isExploreActive && (
                <motion.div
                  layoutId="bottomNavActivePill"
                  className="absolute inset-y-[2px] inset-x-[4px] bg-[var(--accent)]/5 rounded-xl -z-10 border border-[var(--accent)]/10"
                  transition={{ type: "spring", stiffness: 380, damping: 28 }}
                />
              )}
              <motion.div
                className="flex items-center justify-center"
                animate={{ scale: isExploreActive ? 1.1 : 1, y: isExploreActive ? -1 : 0 }}
                transition={{ type: "spring", stiffness: 440, damping: 20 }}
              >
                <Compass className="w-5 h-5" />
              </motion.div>
              <span className="text-[9.5px] tracking-tight leading-none font-sans text-center">Explore</span>
              {isExploreActive && (
                <motion.span
                  layoutId="bottomNavDot"
                  className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] absolute bottom-0.5"
                  transition={{ type: "spring", stiffness: 380, damping: 28 }}
                />
              )}
            </button>
          );
        })()}

        {(() => {
          const isChatsActive = activeTab === "chats";
          return (
            <button
              onClick={() => navigateToTab("chats")}
              className={`w-full h-full flex flex-col items-center justify-center gap-1 relative cursor-pointer active:scale-95 duration-150 transition-all ${
                isChatsActive ? "text-[var(--accent)] font-semibold" : "text-[var(--text-muted)] hover:text-[var(--text-secondary)] font-medium"
              }`}
            >
              {isChatsActive && (
                <motion.div
                  layoutId="bottomNavActivePill"
                  className="absolute inset-y-[2px] inset-x-[4px] bg-[var(--accent)]/5 rounded-xl -z-10 border border-[var(--accent)]/10"
                  transition={{ type: "spring", stiffness: 380, damping: 28 }}
                />
              )}
              <motion.div
                className="flex items-center justify-center"
                animate={{ scale: isChatsActive ? 1.1 : 1, y: isChatsActive ? -1 : 0 }}
                transition={{ type: "spring", stiffness: 440, damping: 20 }}
              >
                <MessageSquare className="w-5 h-5" />
              </motion.div>
              <span className="text-[9.5px] tracking-tight leading-none font-sans text-center">Chats</span>
              {isChatsActive && (
                <motion.span
                  layoutId="bottomNavDot"
                  className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] absolute bottom-0.5"
                  transition={{ type: "spring", stiffness: 380, damping: 28 }}
                />
              )}
            </button>
          );
        })()}

        {(() => {
          const isProfileActive = activeTab === "profile";
          return (
            <button
              onClick={() => navigateToTab("profile")}
              className={`w-full h-full flex flex-col items-center justify-center gap-1 relative cursor-pointer active:scale-95 duration-150 transition-all ${
                isProfileActive ? "text-[var(--accent)] font-semibold" : "text-[var(--text-muted)] hover:text-[var(--text-secondary)] font-medium"
              }`}
            >
              {isProfileActive && (
                <motion.div
                  layoutId="bottomNavActivePill"
                  className="absolute inset-y-[2px] inset-x-[4px] bg-[var(--accent)]/5 rounded-xl -z-10 border border-[var(--accent)]/10"
                  transition={{ type: "spring", stiffness: 380, damping: 28 }}
                />
              )}
              <motion.div
                className="flex items-center justify-center"
                animate={{ scale: isProfileActive ? 1.1 : 1, y: isProfileActive ? -1 : 0 }}
                transition={{ type: "spring", stiffness: 440, damping: 20 }}
              >
                <User className="w-5 h-5" />
              </motion.div>
              <span className="text-[9.5px] tracking-tight leading-none font-sans text-center">Profile</span>
              {isProfileActive && (
                <motion.span
                  layoutId="bottomNavDot"
                  className="w-1.5 h-1.5 rounded-full bg-[var(--accent)] absolute bottom-0.5"
                  transition={{ type: "spring", stiffness: 380, damping: 28 }}
                />
              )}
            </button>
          );
        })()}
      </nav>

    </div>
  );
};
