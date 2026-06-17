import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Trophy, FolderPlus, Users, MessageSquare, LayoutGrid, 
  Compass, Shield, Bell, X, Menu, ArrowUpRight, User,
  Sun, Moon, Laptop, Settings, HelpCircle, LogOut, ChevronDown, 
  BookOpen, Sparkles, Heart, Bookmark, CheckCircle, GraduationCap, Clock,
  Link2, RefreshCw, GitBranch
} from "lucide-react";
import { KrenzaLogo } from "../../shared/components/KrenzaLogo";

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
  // Account/Theme extension properties:
  themeMode?: "light" | "dark" | "system";
  onSetThemeMode?: (mode: "light" | "dark" | "system") => void;
  onLogout?: () => void;
  children: React.ReactNode;
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  currentUser,
  activeTab,
  setActiveTab,
  unreadNotificationsCount,
  sidebarOpen,
  setSidebarOpen,
  notifications: initialNotifications,
  handleMarkNotificationsRead,
  navigateToTab,
  theme = "light",
  onToggleTheme,
  themeMode = "light",
  onSetThemeMode,
  onLogout,
  children
}) => {
  // Overlays and Modals State:
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [accountMenuOpen, setAccountMenuOpen] = useState(false);
  
  // Modal states:
  const [docModalOpen, setDocModalOpen] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);

  // GitHub Settings states
  const [githubSyncData, setGithubSyncData] = useState<any>(null);
  const [checkingGithub, setCheckingGithub] = useState(false);
  const [disconnectingGithub, setDisconnectingGithub] = useState(false);

  const fetchGithubStatus = async () => {
    setCheckingGithub(true);
    try {
      const res = await fetch("/api/github/profile");
      if (res.ok) {
        const data = await res.json();
        if (data.connected) {
          setGithubSyncData(data);
        } else {
          setGithubSyncData(null);
        }
      }
    } catch (e) {
      console.error("[Settings] Error fetching GitHub details:", e);
    } finally {
      setCheckingGithub(false);
    }
  };

  useEffect(() => {
    if (aboutModalOpen) {
      fetchGithubStatus();
    }
  }, [aboutModalOpen]);

  // Listen for OAuth Success messages to reload the Github status inside settings
  useEffect(() => {
    const handleOauthMessage = (e: MessageEvent) => {
      if (e.data?.type === "GITHUB_OAUTH_SUCCESS") {
        fetchGithubStatus();
      }
    };
    window.addEventListener("message", handleOauthMessage);
    return () => window.removeEventListener("message", handleOauthMessage);
  }, []);

  const handleDisconnectGithub = async () => {
    if (!window.confirm("Are you sure you want to disconnect your GitHub profile? This will hide your parsed repositories, scores, and developer discovery rankings.")) {
      return;
    }
    setDisconnectingGithub(true);
    try {
      const res = await fetch("/api/github/disconnect", { method: "POST" });
      if (res.ok) {
        setGithubSyncData(null);
        alert("GitHub profile successfully disconnected!");
      }
    } catch (e) {
      console.error("[Settings] Disconnect failed:", e);
    } finally {
      setDisconnectingGithub(false);
    }
  };

  const handleConnectGithubInSettings = async () => {
    try {
      const redirect = `${window.location.origin}/api/github/callback`;
      const res = await fetch(`/api/github/auth-url?redirectUri=${encodeURIComponent(redirect)}`);
      if (res.ok) {
        const data = await res.json();
        const authWindow = window.open(data.url, "github_oauth_popup", "width=600,height=750");
        if (!authWindow) {
          alert("Please enable popups to sync your GitHub profile!");
        }
      }
    } catch (e) {
      console.error("[Settings] Connect GitHub flow failed:", e);
    }
  };

  // Dynamic notifications state to support read and dismiss behavior
  const [localNotifications, setLocalNotifications] = useState<any[]>(() => {
    // Inject mock items matching: Mentions, Connection Requests, Team Invites, Mentor Messages, Project Updates, Application Updates
    return [
      { id: "notif_1", type: "Mention", title: "Mentioned in Feed", message: "Sneha Nair tagged you in EtherPulse Ledger Analyser roadmap discussion.", read: false, time: "2 mins ago" },
      { id: "notif_2", type: "ConnectionRequest", title: "Connection Request", message: "Rohan Sharma requested to connect - 92% AI Collaboration Match.", read: false, time: "1 hour ago" },
      { id: "notif_3", type: "TeamInvite", title: "Team Invitation", message: "GDSC Web Squad invited you to join Hackathon Squad Beta.", read: false, time: "4 hours ago" },
      { id: "notif_4", type: "MentorMessage", title: "Mentor Message", message: "Mentor Nitin Verma: Let's review your TypeScript project tomorrow.", read: true, time: "1 day ago" },
      { id: "notif_5", type: "ProjectUpdate", title: "Project Update", message: "AI Study Buddy project status updated: Recruiting Frontend Builders.", read: true, time: "2 days ago" },
      { id: "notif_6", type: "ApplicationUpdate", title: "Application Update", message: "Your application to Decentralized Collab was APPROVED! 🎉", read: true, time: "3 days ago" }
    ];
  });

  const unreadCount = localNotifications.filter(n => !n.read).length;

  const handleMarkAllRead = () => {
    setLocalNotifications(prev => prev.map(n => ({ ...n, read: true })));
    handleMarkNotificationsRead();
  };

  const handleToggleRead = (id: string) => {
    setLocalNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  // Helper inside workspace Drawer routing to prevent boilerplates
  const handleWorkspaceItemClick = (tabId: string, subtabId?: string) => {
    setSidebarOpen(false);
    
    if (tabId === "build" && subtabId) {
      navigateToTab("build");
      // Wait for build workspace route update then trigger sub tab via window helper or immediate layout state modifications
      setTimeout(() => {
        const buildTabButton = document.querySelector(`button[onClick*="${subtabId}"]`) as HTMLElement;
        if (buildTabButton) buildTabButton.click();
      }, 50);
    } else {
      navigateToTab(tabId);
    }
  };

  const handleSavedItemsClick = () => {
    setSidebarOpen(false);
    alert("Saved Items: Saved projects & posts can be viewed in your professional bookmarks portfolio inside the Settings soon!");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/35 selection:text-white pb-20 md:pb-24">
      
      {/* 1. PROFESSIONAL SAAS HEADER LAYOUT */}
      <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-lg border-b border-slate-900 px-4 py-3 md:px-6 flex justify-between items-center select-none">
        
        {/* Left Side: Hamburger Menu & BRAND */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-slate-400 hover:text-white p-2 rounded-xl hover:bg-slate-900/60 active:scale-95 transition-all cursor-pointer"
            id="hamburgeMenuBtn"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div
            onClick={() => navigateToTab("home")}
            className="flex items-center gap-2 cursor-pointer select-none"
          >
            <KrenzaLogo size={28} theme="dark" variant="full-horizontal" />
          </div>
        </div>

        {/* Right Side: Notifications & Profile Avatar */}
        <div className="flex items-center gap-4 relative">
          
          {/* Notifications Dropdown Trigger */}
          <div className="relative">
            <button 
              onClick={() => {
                setNotificationsOpen(!notificationsOpen);
                setAccountMenuOpen(false);
              }}
              className={`p-2 rounded-xl border transition-all cursor-pointer relative flex items-center justify-center ${
                notificationsOpen 
                  ? "bg-slate-900 border-indigo-500/30 text-white" 
                  : "border-slate-900 bg-slate-900/35 text-slate-400 hover:text-white"
              }`}
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-indigo-600 text-[8.5px] font-bold flex justify-center items-center text-white border border-slate-950">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown Panel */}
            <AnimatePresence>
              {notificationsOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                  <motion.div 
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-2.5 w-80 md:w-96 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 text-xs overflow-hidden text-left"
                  >
                    <div className="p-3.5 border-b border-slate-850 flex justify-between items-center">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-indigo-500" />
                        <span className="font-bold text-white font-sans uppercase text-[10px] tracking-wider">Alerts Notification Inbox</span>
                      </div>
                      {unreadCount > 0 && (
                        <button 
                          onClick={handleMarkAllRead}
                          className="text-[10px] text-indigo-400 font-bold hover:underline cursor-pointer"
                        >
                          Mark All Read
                        </button>
                      )}
                    </div>

                    <div className="max-h-[340px] overflow-y-auto divide-y divide-slate-850/60 custom-scrollbar">
                      {localNotifications.map((notif) => (
                        <div 
                          key={notif.id} 
                          onClick={() => handleToggleRead(notif.id)}
                          className={`p-3.5 transition-all hover:bg-slate-850/30 cursor-pointer flex gap-3 items-start ${
                            notif.read ? "opacity-60" : "bg-indigo-950/10"
                          }`}
                        >
                          <div className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
                            notif.read ? "bg-slate-700" : "bg-indigo-500 animate-pulse"
                          }`} />
                          
                          <div className="space-y-1 flex-1">
                            <div className="flex justify-between items-center leading-none">
                              <span className="font-bold text-white text-[11px] font-mono tracking-tight">
                                {notif.type.replace(/([A-Z])/g, ' $1').trim()}
                              </span>
                              <span className="text-[9px] text-slate-500 font-mono">{notif.time}</span>
                            </div>
                            <p className="text-slate-450 leading-relaxed text-[10.5px]">{notif.message}</p>
                          </div>
                        </div>
                      ))}

                      {localNotifications.length === 0 && (
                        <div className="p-8 text-center text-slate-500 text-[11px] font-mono leading-relaxed">
                          No active indicator alerts.
                        </div>
                      )}
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Account Profile Dropdown Trigger */}
          {currentUser && (
            <div className="relative">
              <button 
                onClick={() => {
                  setAccountMenuOpen(!accountMenuOpen);
                  setNotificationsOpen(false);
                }}
                className={`flex items-center gap-1 bg-slate-900/50 hover:bg-slate-900 border border-slate-900 p-1.5 rounded-xl text-xs cursor-pointer select-none transition-all ${
                  accountMenuOpen ? "border-indigo-500/30" : ""
                }`}
              >
                <img 
                  src={currentUser.avatarUrl} 
                  alt={currentUser.fullName} 
                  className="w-7 h-7 rounded-full object-cover border border-indigo-500/20 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${accountMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {/* Account Profile Menu Dropdown Overlay */}
              <AnimatePresence>
                {accountMenuOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setAccountMenuOpen(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 15, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2.5 w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl z-50 text-xs overflow-hidden text-left"
                    >
                      <div className="p-3.5 bg-slate-950/40 border-b border-slate-850 flex items-center gap-2.5">
                        <img 
                          src={currentUser.avatarUrl} 
                          alt={currentUser.fullName} 
                          className="w-10 h-10 rounded-full object-cover border border-indigo-500/25 shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div className="leading-tight">
                          <h4 className="font-bold text-white font-sans text-xs">{currentUser.fullName}</h4>
                          <span className="text-[9px] text-indigo-400 tracking-wider font-mono">🏆 {currentUser.reputationPoints || 100} REPUTATION</span>
                        </div>
                      </div>

                      <div className="p-1 space-y-0.5">
                        {/* Section 1: Profiles */}
                        <button 
                          onClick={() => {
                            setAccountMenuOpen(false);
                            navigateToTab("profile");
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] font-bold text-slate-300 hover:text-white hover:bg-slate-850"
                        >
                          <User className="w-4 h-4 text-teal-400" />
                          <span>View Profile</span>
                        </button>

                        <button 
                          onClick={() => {
                            setAccountMenuOpen(false);
                            navigateToTab("profile");
                            // Triggers edit modal or panel inside profile section
                            setTimeout(() => {
                              const editBtn = document.querySelector('[id*="editProfileBtn"]') as HTMLElement;
                              if (editBtn) editBtn.click();
                            }, 100);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] font-bold text-slate-300 hover:text-white hover:bg-slate-850"
                        >
                          <Settings className="w-4 h-4 text-indigo-400" />
                          <span>Edit Profile</span>
                        </button>

                        <div className="h-px bg-slate-850/60 my-1 mx-2" />

                        {/* Section 2: Layout & Themes */}
                        {/* Interactive Appearance expansion panel inside dropdown */}
                        <div className="px-1 py-1">
                          <span className="text-[9px] text-slate-500 font-mono font-extrabold px-2.5 block uppercase tracking-wider mb-1">Appearance & preferences</span>
                          
                          <div className="grid grid-cols-3 gap-1 px-1">
                            {[
                              { id: "light", label: "Light", icon: Sun },
                              { id: "dark", label: "Dark", icon: Moon },
                              { id: "system", label: "System", icon: Laptop }
                            ].map((opt) => {
                              const Icon = opt.icon;
                              const isSelected = themeMode === opt.id;
                              return (
                                <button
                                  key={opt.id}
                                  onClick={() => {
                                    if (onSetThemeMode) onSetThemeMode(opt.id as any);
                                  }}
                                  className={`py-1.5 px-1 rounded-lg flex flex-col items-center gap-1 cursor-pointer transition-all border ${
                                    isSelected 
                                      ? "bg-indigo-650/15 border-indigo-500/40 text-indigo-400" 
                                      : "bg-slate-950/20 border-slate-850 text-slate-400 hover:text-white hover:bg-slate-850"
                                  }`}
                                >
                                  <Icon className="w-3.5 h-3.5" />
                                  <span className="text-[9px] font-mono">{opt.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        <button 
                          onClick={() => {
                            setAccountMenuOpen(false);
                            setNotificationsOpen(true);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] font-bold text-slate-300 hover:text-white hover:bg-slate-850"
                        >
                          <Bell className="w-4 h-4 text-pink-400" />
                          <span>Notifications Settings</span>
                        </button>

                        <button 
                          onClick={() => {
                            setAccountMenuOpen(false);
                            alert("Privacy & Security: Session credentials, OAuth scopes, and MongoDB verification handshakes are secured using campus TLS certificates.");
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] font-bold text-slate-300 hover:text-white hover:bg-slate-850"
                        >
                          <Shield className="w-4 h-4 text-emerald-400" />
                          <span>Privacy & Security</span>
                        </button>

                        <button 
                          onClick={() => {
                            setAccountMenuOpen(false);
                            setAboutModalOpen(true);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] font-bold text-slate-300 hover:text-white hover:bg-slate-850"
                        >
                          <Settings className="w-4 h-4 text-blue-400" />
                          <span>Settings</span>
                        </button>

                        <div className="h-px bg-slate-850/60 my-1 mx-2" />

                        {/* Section 3: Help & Exit */}
                        <button 
                          onClick={() => {
                            setAccountMenuOpen(false);
                            setSupportModalOpen(true);
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] font-bold text-slate-300 hover:text-white hover:bg-slate-850"
                        >
                          <HelpCircle className="w-4 h-4 text-amber-400" />
                          <span>Help & Support Center</span>
                        </button>

                        <button 
                          onClick={() => {
                            setAccountMenuOpen(false);
                            if (onLogout) onLogout();
                          }}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[11px] font-bold text-rose-500 hover:text-white hover:bg-rose-950/25"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Log Out</span>
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          )}

        </div>
      </header>

      {/* 2. SLIDING LEFT DRAWER (Workspace Drawer) - BOTH MOBILE AND DESKTOP */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            {/* Backdrop Blur overlay */}
            <div 
              className="fixed inset-0 z-30 bg-slate-950/70 backdrop-blur-sm transition-all" 
              onClick={() => setSidebarOpen(false)}
            />
            
            {/* Sliding Drawer Body Container */}
            <motion.aside 
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 210 }}
              className="fixed top-0 bottom-0 left-0 z-40 bg-slate-900 border-r border-slate-800 w-72 p-5 flex flex-col justify-between h-full select-none"
            >
              <div className="space-y-6 overflow-y-auto max-h-[calc(100vh-100px)] custom-scrollbar pr-1 text-left">
                
                {/* Drawer Branding & Header Close */}
                <div className="flex justify-between items-center pb-2 border-b border-slate-850">
                  <div className="flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-indigo-500" />
                    <span className="font-extrabold text-sm tracking-widest text-white uppercase font-mono">Workspace</span>
                  </div>
                  <button 
                    onClick={() => setSidebarOpen(false)}
                    className="p-1 px-1.5 rounded-lg bg-slate-950 border border-slate-850 text-slate-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Drawer Sections: ONLY Secondary Platform Features */}
                
                {/* SECTION 1: WORKSPACE */}
                <div className="space-y-1.5">
                  <span className="text-[9px] text-slate-500 font-mono font-extrabold uppercase tracking-widest block px-1">Workspace</span>
                  
                  <button
                    onClick={() => handleWorkspaceItemClick("build", "projects")}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-850 text-left transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <FolderPlus className="w-4 h-4 text-emerald-400" />
                      <span>My Projects</span>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                  </button>

                  <button
                    onClick={() => handleWorkspaceItemClick("build", "teams")}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-850 text-left transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Users className="w-4 h-4 text-sky-400" />
                      <span>My Teams</span>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                  </button>

                  <button
                    onClick={() => handleWorkspaceItemClick("build", "open_source")}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-850 text-left transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <BookOpen className="w-4 h-4 text-amber-400" />
                      <span>Open Source Contributions</span>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                  </button>

                  <button
                    onClick={() => handleWorkspaceItemClick("hackathons")}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-850 text-left transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Sparkles className="w-4 h-4 text-pink-400" />
                      <span>Hackathons</span>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                  </button>

                  <button
                    onClick={() => handleWorkspaceItemClick("mentors")}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-850 text-left transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <GraduationCap className="w-4 h-4 text-teal-400" />
                      <span>Mentorship</span>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                  </button>

                  <button
                    onClick={() => handleWorkspaceItemClick("build", "applications")}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-850 text-left transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <CheckCircle className="w-4 h-4 text-indigo-400" />
                      <span>Applications</span>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                  </button>

                  <button
                    onClick={handleSavedItemsClick}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-850 text-left transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Bookmark className="w-4 h-4 text-rose-400" />
                      <span>Saved Items</span>
                    </div>
                    <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                  </button>
                </div>

                <div className="h-px bg-slate-850/60 my-2" />

                {/* SECTION 2: RESOURCES */}
                <div className="space-y-1">
                  <span className="text-[9px] text-slate-500 font-mono font-extrabold uppercase tracking-widest block px-1">Resources</span>
                  
                  <button
                    onClick={() => { setSidebarOpen(false); setDocModalOpen(true); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-850 text-left transition-colors cursor-pointer"
                  >
                    <BookOpen className="w-4 h-4 text-slate-500" />
                    <span>Documentation</span>
                  </button>

                  <button
                    onClick={() => { setSidebarOpen(false); setSupportModalOpen(true); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-850 text-left transition-colors cursor-pointer"
                  >
                    <HelpCircle className="w-4 h-4 text-slate-500" />
                    <span>Support Center</span>
                  </button>

                  <button
                    onClick={() => { setSidebarOpen(false); setFeedbackModalOpen(true); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-slate-850 text-left transition-colors cursor-pointer"
                  >
                    <Heart className="w-4 h-4 text-slate-500" />
                    <span>Feedback</span>
                  </button>
                </div>

                {/* SECTION 3: ADMINISTRATION */}
                {currentUser && (currentUser.isAdmin || currentUser.role === "Administrator" || currentUser.email?.includes("admin")) && (
                  <>
                    <div className="h-px bg-slate-850/60 my-2" />
                    <div className="space-y-1">
                      <span className="text-[9px] text-slate-500 font-mono font-extrabold uppercase tracking-widest block px-1">Administration</span>
                      <button
                        onClick={() => { setSidebarOpen(false); navigateToTab("admin"); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-bold text-indigo-400 hover:text-indigo-300 hover:bg-slate-850 text-left transition-colors cursor-pointer"
                      >
                        <Shield className="w-4 h-4 text-indigo-500" />
                        <span>Admin Console</span>
                      </button>
                    </div>
                  </>
                )}

              </div>

              {/* EMPTY FOOTER - DEV / VERSION INFO HAS BEEN SECURELY REMOVED TO PREVENT TECH LARPING AT PAGE MARGINS */}
              <div className="pt-4 border-t border-slate-850 text-[10px] text-slate-500 font-medium text-center italic">
                Secure Enterprise Node
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* 3. MIDDLE COLUMN WORKSPACE */}
      <div className="flex-1 max-w-4xl w-full mx-auto px-4 py-6">
        <main className="min-w-0 transition-all overflow-hidden">
          {children}
        </main>
      </div>

      {/* 4. EXQUISITE PRIMARY BOTTOM NAVIGATION SYSTEM - BOTH MOBILE AND DESKTOP */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-slate-900/90 backdrop-blur-md border-t border-slate-800 shadow-[0_-8px_30px_rgba(0,0,0,0.25)] select-none">
        <div className="max-w-xl mx-auto grid grid-cols-5 h-16 px-2">
          {(() => {
            const isHomeActive = activeTab === "home" || activeTab === "dashboard";
            return (
              <button
                onClick={() => navigateToTab("home")}
                className={`w-full h-full flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                  isHomeActive 
                    ? "bg-indigo-500/10 text-indigo-400 font-bold" 
                    : "text-slate-450 hover:text-white"
                }`}
              >
                <LayoutGrid className="w-4.5 h-4.5" />
                <span className="text-[10px] tracking-tight leading-none">Home</span>
              </button>
            );
          })()}

          {(() => {
            const isBuildActive = activeTab === "build" || activeTab === "projects" || activeTab === "teams" || activeTab === "open_source" || activeTab === "applications";
            return (
              <button
                onClick={() => navigateToTab("build")}
                className={`w-full h-full flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                  isBuildActive 
                    ? "bg-indigo-500/10 text-indigo-400 font-bold" 
                    : "text-slate-450 hover:text-white"
                }`}
              >
                <FolderPlus className="w-4.5 h-4.5" />
                <span className="text-[10px] tracking-tight leading-none">Build</span>
              </button>
            );
          })()}

          {(() => {
            const isExploreActive = activeTab === "explore" || activeTab === "hackathons" || activeTab === "internships" || activeTab === "mentors";
            return (
              <button
                onClick={() => navigateToTab("explore")}
                className={`w-full h-full flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                  isExploreActive 
                    ? "bg-indigo-500/10 text-indigo-400 font-bold" 
                    : "text-slate-450 hover:text-white"
                }`}
              >
                <Compass className="w-4.5 h-4.5" />
                <span className="text-[10px] tracking-tight leading-none">Explore</span>
              </button>
            );
          })()}

          {(() => {
            const isChatsActive = activeTab === "chats";
            return (
              <button
                onClick={() => navigateToTab("chats")}
                className={`w-full h-full flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                  isChatsActive 
                    ? "bg-indigo-500/10 text-indigo-400 font-bold" 
                    : "text-slate-450 hover:text-white"
                }`}
              >
                <MessageSquare className="w-4.5 h-4.5" />
                <span className="text-[10px] tracking-tight leading-none">Chats</span>
              </button>
            );
          })()}

          {(() => {
            const isProfileActive = activeTab === "profile";
            return (
              <button
                onClick={() => navigateToTab("profile")}
                className={`w-full h-full flex flex-col items-center justify-center gap-1 cursor-pointer transition-all ${
                  isProfileActive 
                    ? "bg-indigo-500/10 text-indigo-400 font-bold" 
                    : "text-slate-450 hover:text-white"
                }`}
              >
                <User className="w-4.5 h-4.5" />
                <span className="text-[10px] tracking-tight leading-none">Profile</span>
              </button>
            );
          })()}
        </div>
      </nav>

      {/* =========================================================================
                     SECONDARY SYSTEM UTILITY MODALS (Resources & Settings)
          ========================================================================= */}

      {/* 1. DOCUMENTATION RESOURCE MODAL */}
      <AnimatePresence>
        {docModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full overflow-hidden text-left"
            >
              <div className="p-4 border-b border-slate-850 flex justify-between items-center bg-slate-950/40">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4.5 h-4.5 text-indigo-400" />
                  <strong className="text-white text-xs uppercase font-mono tracking-wider">Krenza System Documentation</strong>
                </div>
                <button onClick={() => setDocModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-5 space-y-4 text-xs text-slate-350 leading-relaxed max-h-[380px] overflow-y-auto custom-scrollbar">
                <div className="space-y-1.5">
                  <h4 className="font-bold text-white text-[11px] font-mono">1. SYSTEM INTENT & SCOPE</h4>
                  <p>Krenza is an enterprise collegiate platform built to bridge the gap between student engineers, developers, and designers. It serves as a centralized hub to build robust client applications and assemble interdisciplinary hackathon teams.</p>
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-bold text-white text-[11px] font-mono">2. CORE COLLABORATION PIPELINES</h4>
                  <p>Build Workspace aggregates project marketplace submissions, team builder directories, and open-source contributions. Use our direct chat systems with custom encryption triggers to reach out to suggested peer matches.</p>
                </div>
                <div className="space-y-1.5">
                  <h4 className="font-bold text-white text-[11px] font-mono">3. REPUTATION ENGINE</h4>
                  <p>Reputation points (PT) are verified by campus mentors and open-source contributions. High reputation metrics unlock advanced filter tools on the Hackathon Boards.</p>
                </div>
              </div>
              <div className="p-3.5 bg-slate-950/60 flex justify-end">
                <button 
                  onClick={() => setDocModalOpen(false)}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg cursor-pointer"
                >
                  I Understand
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 2. SUPPORT CENTER MODAL */}
      <AnimatePresence>
        {supportModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full overflow-hidden text-left py-1"
            >
              <div className="p-4 border-b border-slate-850 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <HelpCircle className="w-4.5 h-4.5 text-amber-400" />
                  <strong className="text-white text-xs uppercase font-mono tracking-wider">Krenza Support Center</strong>
                </div>
                <button onClick={() => setSupportModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-5 space-y-3.5 text-xs text-slate-350">
                <p>Have issues with peer verification profiles, system certificates, or hackathon matching pipelines? Open a ticket directly with campus administrators.</p>
                <div className="space-y-1.5">
                  <label className="block text-[9px] text-slate-400 uppercase font-mono font-bold">Issue Category</label>
                  <select className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 outline-none text-white">
                    <option>Profile & Reputation Points Verification</option>
                    <option>Team Recruitment & Workspace Chat Bugs</option>
                    <option>University Email Linkages & SSO Auth</option>
                    <option>Other inquiries</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[9px] text-slate-400 uppercase font-mono font-bold">Inquiry Message</label>
                  <textarea rows={3} placeholder="Provide precise bug context or questions..." className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 outline-none text-white resize-none" />
                </div>
              </div>
              <div className="p-4 bg-slate-950/60 flex justify-end gap-2 text-xs">
                <button onClick={() => setSupportModalOpen(false)} className="px-3.5 py-1.5 text-slate-400 hover:text-white font-semibold">Cancel</button>
                <button 
                  onClick={() => { setSupportModalOpen(false); alert("Ticket Submitted: Campus support squads will verify this enquiry soon!"); }}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg cursor-pointer"
                >
                  Submit Support Ticket
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 3. FEEDBACK RESOURCE MODAL */}
      <AnimatePresence>
        {feedbackModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full overflow-hidden text-left"
            >
              <div className="p-4 border-b border-slate-850 flex justify-between items-center bg-slate-950/40">
                <div className="flex items-center gap-2">
                  <Heart className="w-4.5 h-4.5 text-rose-500" />
                  <strong className="text-white text-xs uppercase font-mono tracking-wider">Share your platform experience</strong>
                </div>
                <button onClick={() => setFeedbackModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-5 space-y-4 text-xs text-slate-350">
                <p>Help us perfect Krenza! Share rating feedback on your matching experience.</p>
                <div className="flex justify-around items-center py-2 bg-slate-950/20 rounded-xl border border-slate-850/50">
                  {["😞", "😐", "🙂", "🚀", "🔥"].map((emoji, idx) => (
                    <button 
                      key={idx} 
                      onClick={() => { setFeedbackModalOpen(false); alert("Thank you so much! We have recorded your positive rating feedback."); }}
                      className="text-2xl hover:scale-125 transition-transform cursor-pointer"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
              <div className="p-3 bg-slate-950/40 text-center text-[10px] text-slate-500 font-mono italic">
                Feedback directly fuels our matching models.
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 4. SETTINGS -> ACCOUNT INTEGRATIONS & ABOUT MODAL */}
      <AnimatePresence>
        {aboutModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full overflow-hidden text-left"
            >
              <div className="p-4 border-b border-slate-850 flex justify-between items-center bg-slate-950/40">
                <div className="flex items-center gap-2">
                  <Settings className="w-4.5 h-4.5 text-indigo-400" />
                  <strong className="text-white text-xs uppercase font-mono tracking-wider">Account Settings & Integrations</strong>
                </div>
                <button onClick={() => setAboutModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-5 space-y-5 text-xs text-slate-300">
                
                {/* GITHUB WORKSPACE INTEGRATION SECTION */}
                <div className="space-y-3">
                  <h4 className="text-[10px] text-slate-450 uppercase font-mono font-bold tracking-wider">Third-Party Connections</h4>
                  
                  <div className="p-4 bg-slate-950 rounded-xl border border-slate-850 space-y-4">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-850/60">
                      <div className="flex items-center gap-2">
                        <GitBranch className="w-4 h-4 text-indigo-400" />
                        <span className="font-sans font-bold text-white text-xs">GitHub Workspace Connection</span>
                      </div>
                      
                      {checkingGithub ? (
                        <span className="px-2 py-0.5 bg-slate-900 border border-slate-850 text-slate-500 text-[9px] font-mono rounded flex items-center gap-1.5">
                          <RefreshCw className="w-2.5 h-2.5 animate-spin text-slate-500" /> Wait...
                        </span>
                      ) : githubSyncData ? (
                        <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-450 text-[9px] font-mono font-bold rounded">
                          Connected
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-slate-900 border border-slate-850 text-slate-450 text-[9px] font-mono rounded">
                          Not Linked
                        </span>
                      )}
                    </div>

                    {checkingGithub ? (
                      <div className="flex justify-center py-4">
                        <RefreshCw className="w-6 h-6 text-indigo-500 animate-spin" />
                      </div>
                    ) : githubSyncData ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3 bg-slate-900/50 p-2.5 rounded-lg border border-slate-850/50">
                          <img 
                            src={githubSyncData.profile.avatarUrl} 
                            alt="github user avatar" 
                            className="w-10 h-10 rounded-lg border border-slate-850 object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="leading-snug">
                            <strong className="text-white font-sans text-xs block">{githubSyncData.profile.name || githubSyncData.profile.username}</strong>
                            <span className="text-[10px] text-slate-400 font-mono">@{githubSyncData.profile.username}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-center text-[10px] font-mono">
                          <div className="bg-slate-900 py-1.5 px-2 rounded-lg border border-slate-850/50 text-slate-350">
                            <strong>{githubSyncData.profile.publicRepos}</strong>
                            <span className="block text-[8px] text-slate-500 uppercase mt-0.5">Repos</span>
                          </div>
                          <div className="bg-slate-900 py-1.5 px-2 rounded-lg border border-slate-850/50 text-slate-350">
                            <strong>{githubSyncData.profile.openSourceScore}</strong>
                            <span className="block text-[8px] text-slate-500 uppercase mt-0.5">Rep Rank</span>
                          </div>
                          <div className="bg-slate-900 py-1.5 px-2 rounded-lg border border-slate-850/50 text-slate-350">
                            <strong>{githubSyncData.profile.contributionCount}</strong>
                            <span className="block text-[8px] text-slate-500 uppercase mt-0.5">Commits</span>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-1 font-mono">
                          <button
                            onClick={() => {
                              setAboutModalOpen(false);
                              navigateToTab("open_source");
                            }}
                            className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-[10px] text-indigo-400 font-bold rounded-lg cursor-pointer transition-all"
                          >
                            Manage Portfolio
                          </button>
                          
                          <button
                            disabled={disconnectingGithub}
                            onClick={handleDisconnectGithub}
                            className="flex-1 py-1.5 bg-rose-950/20 hover:bg-rose-950/40 border border-rose-900/30 text-[10px] text-rose-400 font-bold rounded-lg cursor-pointer transition-all"
                          >
                            {disconnectingGithub ? "Clearing..." : "Disconnect Link"}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <p className="text-[10.5px] text-slate-400 leading-normal">
                          Synchronize your external public GitHub profile to generate AI tech reports, display repositories inside campus squads, and receive invitations.
                        </p>
                        <button
                          onClick={handleConnectGithubInSettings}
                          className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[10px] font-bold tracking-wide font-sans transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-indigo-600/15"
                        >
                          <Link2 className="w-3.5 h-3.5" /> Integrate Secure GitHub Profile
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* APP BUILD METRIC AND ENVIRONMENT */}
                <div className="space-y-2">
                  <h4 className="text-[10px] text-slate-450 uppercase font-mono font-bold tracking-wider">Platform Details</h4>
                  
                  <div className="space-y-2 bg-slate-950 p-3.5 rounded-xl border border-slate-850">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[9px] text-slate-500 uppercase font-bold">App Version</span>
                      <strong className="text-white font-mono text-xs">Krenza v1.4</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[9px] text-slate-500 uppercase font-bold">Build Number</span>
                      <strong className="text-slate-300 font-mono text-xs">SC-2026-0616</strong>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-[9px] text-slate-500 uppercase font-bold">Environment</span>
                      <strong className="text-indigo-400 font-mono text-xs">production (Cloud Run)</strong>
                    </div>
                  </div>
                </div>

                <p className="text-[10px] leading-relaxed text-slate-500 text-center select-none pt-1">
                  All rights reserved • Handshakes secured using on-campus TLS certificate authorizations.
                </p>
              </div>
              <div className="p-3.5 bg-slate-950/60 flex justify-end">
                <button 
                  onClick={() => setAboutModalOpen(false)}
                  className="px-4 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 hover:text-white text-xs font-bold rounded-lg cursor-pointer font-mono"
                >
                  Close Settings
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
