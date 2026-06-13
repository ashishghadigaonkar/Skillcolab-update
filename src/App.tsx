import React, { useState, useEffect } from "react";
import { Trophy } from "lucide-react";
import { Providers } from "./app/providers/Providers";
import { DashboardLayout } from "./app/layouts/DashboardLayout";
import { AppRouter } from "./app/router/AppRouter";
import { Project } from "./types";
import { FirebaseAuthService } from "./services/firebase";

export default function App() {
  return (
    <Providers>
      <AppContent />
    </Providers>
  );
}

function AppContent() {
  const [activeTab, setActiveTab] = useState<string>("home");
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  const [authChecking, setAuthChecking] = useState(true);
  const [syncingUser, setSyncingUser] = useState(false);

  useEffect(() => {
    // Sync with Firebase auth state alterations
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

    // Fetch core resources
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

  const navigateToTab = (tabId: string) => {
    setActiveTab(tabId);
    setSidebarOpen(false);
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
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="w-full max-w-sm bg-slate-900/90 border border-slate-850 p-6 xs:p-8 rounded-3xl shadow-2xl relative z-10 space-y-6 text-center backdrop-blur-md">
          <div className="space-y-3">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-500 border border-indigo-400/25 flex justify-center items-center shadow-md shadow-indigo-600/15">
              <Trophy className="w-6 h-6 text-indigo-100 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-mono font-extrabold text-white tracking-widest uppercase">SkillCollab</h2>
              <p className="text-[10px] text-slate-400 mt-1">Campus Project Collaborations & Verifications</p>
            </div>
          </div>

          <div className="h-px bg-slate-800/60 w-full" />

          <div className="space-y-1.5">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest font-mono">Gateway Interface</h3>
            <p className="text-[11px] text-slate-400 leading-normal">
              Authorize with verified identity to join student hackathons, post technical profiles, and match dynamically with engineering teammates.
            </p>
          </div>

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
    <DashboardLayout
      currentUser={currentUser}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      unreadNotificationsCount={unreadNotificationsCount}
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
      notifications={notifications}
      handleMarkNotificationsRead={handleMarkNotificationsRead}
      navigateToTab={navigateToTab}
    >
      <AppRouter
        activeTab={activeTab}
        navigateToTab={navigateToTab}
        currentUser={currentUser}
        onUpdateCurrentUser={setCurrentUser}
        projects={projects}
        handleProjectSuccess={handleProjectSuccess}
      />
    </DashboardLayout>
  );
}
