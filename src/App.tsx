import React, { useState, useEffect } from "react";
import { Trophy, Mail, Lock, User, Check, AlertCircle, ArrowLeft, Send, Sparkles, Building2, GraduationCap, Briefcase, Compass, ExternalLink, Zap } from "lucide-react";
import { Providers } from "./app/providers/Providers";
import { DashboardLayout } from "./app/layouts/DashboardLayout";
import { AppRouter } from "./app/router/AppRouter";
import { Project } from "./types";
import { FirebaseAuthService } from "./services/firebase";
import { ThemeProvider } from "./theme/ThemeProvider";
import { useTheme } from "./theme/useTheme";
import { ConfettiOverlay } from "./shared/components/ConfettiOverlay";
import { LandingPage } from "./components/LandingPage";
import { KrenzaLogo } from "./shared/components/KrenzaLogo";

export default function App() {
  return (
    <ThemeProvider>
      <Providers>
        <AppContent />
      </Providers>
    </ThemeProvider>
  );
}

function AppContent() {
  const { theme, themeMode, toggleTheme, setTheme, setThemeMode } = useTheme();
  const [activeTab, setActiveTab] = useState<string>("home");
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  const [authChecking, setAuthChecking] = useState(true);
  const [syncingUser, setSyncingUser] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Expanded local auth properties
  const [authStep, setAuthStep] = useState<"login" | "signup" | "verify" | "forgot" | "reset">("login");
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authConfirmPassword, setAuthConfirmPassword] = useState("");
  const [authUsername, setAuthUsername] = useState("");
  const [authFirstName, setAuthFirstName] = useState("");
  const [authLastName, setAuthLastName] = useState("");
  const [authTermsAccepted, setAuthTermsAccepted] = useState(false);
  const [authRememberMe, setAuthRememberMe] = useState(false);
  const [authVerificationCode, setAuthVerificationCode] = useState("");
  const [authResetCode, setAuthResetCode] = useState("");
  const [authNewPassword, setAuthNewPassword] = useState("");
  const [authSuccess, setAuthSuccess] = useState("");
  const [authError, setAuthError] = useState("");
  const [authSubmitting, setAuthSubmitting] = useState(false);
  const [simCodeHelp, setSimCodeHelp] = useState("");

  // Onboarding Wizard Properties
  const [onboardCollege, setOnboardCollege] = useState("");
  const [onboardBranch, setOnboardBranch] = useState("");
  const [onboardGradYear, setOnboardGradYear] = useState<number>(2028);
  const [onboardSkills, setOnboardSkills] = useState("");
  const [onboardInterests, setOnboardInterests] = useState("");
  const [onboardGoals, setOnboardGoals] = useState("");
  const [onboardAvatar, setOnboardAvatar] = useState("");
  const [onboardSubmitting, setOnboardSubmitting] = useState(false);

  // Sync user object theme preferences on login or initial load
  useEffect(() => {
    const userTheme = currentUser?.settings?.theme || currentUser?.theme;
    if (userTheme && userTheme !== themeMode) {
      setThemeMode(userTheme);
    }
  }, [currentUser?.id]);

  const handleSetThemeMode = async (newMode: "light" | "dark" | "system") => {
    setThemeMode(newMode);
    
    if (currentUser) {
      const computedTheme = newMode === "system"
        ? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
        : newMode;

      setCurrentUser((prev: any) => prev ? {
        ...prev,
        theme: computedTheme,
        settings: { ...prev.settings, theme: newMode }
      } : null);

      try {
        const res = await fetch("/api/users/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            theme: computedTheme,
            settings: { theme: newMode }
          })
        });
        if (res.ok) {
          const result = await res.json();
          setCurrentUser(result.user);
        }
      } catch (err) {
        console.error("Failed to sync theme settings to backend database:", err);
      }
    }
  };

  const viewUserProfile = (userId: string) => {
    setSelectedProfileId(userId);
    setActiveTab("profile");
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    // Bind to window for absolute safety across deeply nested widgets
    (window as any).viewUserProfile = viewUserProfile;
    (window as any).navigateToTab = (tabId: string) => {
      setSelectedProfileId(null);
      setActiveTab(tabId);
      setSidebarOpen(false);
      window.scrollTo({ top: 0, behavior: "smooth" });
    };
  }, []);

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
            if (result.user?.onboardingCompleted) {
              localStorage.setItem("scholar_onboarding_completed", "true");
            }
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
      const [projectsData, notificationsData] = await Promise.all([
        fetch("/api/projects").then(r => r.ok ? r.json() : []).catch(() => []),
        fetch("/api/notifications").then(r => r.ok ? r.json() : []).catch(() => [])
      ]);

      setProjects(projectsData);
      setNotifications(notificationsData);
      const unread = notificationsData.filter((msg: any) => !msg.read).length;
      setUnreadNotificationsCount(unread);
    } catch (e) {
      console.error("Failed to initialize system core resources:", e);
    }
  };

  const fetchMainState = async () => {
    try {
      const [u, p, n] = await Promise.all([
        fetch("/api/users/me").then(r => r.ok ? r.json() : null).catch(() => null),
        fetch("/api/projects").then(r => r.ok ? r.json() : []).catch(() => []),
        fetch("/api/notifications").then(r => r.ok ? r.json() : []).catch(() => [])
      ]);

      if (u) {
        setCurrentUser(u);
      }
      setProjects(p);
      setNotifications(n);
      const unread = n.filter((msg: any) => !msg.read).length;
      setUnreadNotificationsCount(unread);
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
    if (tabId !== "profile") {
      setSelectedProfileId(null);
    }
    setActiveTab(tabId);
    
    // Sync browser URL
    let path = "/home";
    if (tabId === "home" || tabId === "dashboard") path = "/home";
    else if (tabId === "projects" || tabId === "teams" || tabId === "open_source" || tabId === "build" || tabId === "applications") path = "/build";
    else if (tabId === "explore" || tabId === "hackathons" || tabId === "internships" || tabId === "mentors") path = "/explore";
    else if (tabId === "chats") path = "/chats";
    else if (tabId === "profile") path = "/profile";

    window.history.pushState(null, "", path);
    setCurrentPath(path);
    
    setSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const syncRouteWithState = () => {
      const path = window.location.pathname;
      setCurrentPath(path);

      if (currentUser) {
        if (path === "/" || path === "/login" || path === "/signup") {
          if (path === "/login" || path === "/signup") {
            window.history.replaceState(null, "", "/home");
            setCurrentPath("/home");
            setActiveTab("home");
          }
        } else {
          if (path === "/home") setActiveTab("home");
          else if (path === "/build") setActiveTab("projects");
          else if (path === "/explore") setActiveTab("explore");
          else if (path === "/chats") setActiveTab("chats");
          else if (path === "/profile") setActiveTab("profile");
        }
      } else {
        if (path !== "/" && path !== "/login" && path !== "/signup") {
          window.history.replaceState(null, "", "/");
          setCurrentPath("/");
        } else if (path === "/login") {
          setAuthStep("login");
        } else if (path === "/signup") {
          setAuthStep("signup");
        }
      }
    };

    window.addEventListener("popstate", syncRouteWithState);
    syncRouteWithState();
    return () => window.removeEventListener("popstate", syncRouteWithState);
  }, [currentUser]);

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
    if (currentPath === "/login" || currentPath === "/signup") {
      // Standard validation actions
      const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault();
      setAuthError("");
      setAuthSuccess("");
      if (!authEmail) {
        setAuthError("Email address or username is required.");
        return;
      }
      if (!authPassword) {
        setAuthError("Password entry cannot be empty.");
        return;
      }
      setAuthSubmitting(true);
      try {
        const result = await FirebaseAuthService.signInWithEmailAndPassword(authEmail, authPassword);
        // Successful login triggers the subscription listener automatically
        setAuthSuccess("Authenticated successfully. Access granted.");
      } catch (err: any) {
        if (err.message && err.message.includes("complete email verification")) {
          setSimCodeHelp(err.message.includes("pin is:") ? err.message : "");
          setAuthStep("verify");
        }
        setAuthError(err.message || "Credential authentication failed.");
      } finally {
        setAuthSubmitting(false);
      }
    };

    const handleSignup = async (e: React.FormEvent) => {
      e.preventDefault();
      setAuthError("");
      setAuthSuccess("");

      if (!authFirstName.trim() || !authLastName.trim()) {
        setAuthError("Please provide your real first and last names.");
        return;
      }
      if (!authUsername.trim()) {
        setAuthError("A unique username is required for your profile.");
        return;
      }
      if (!authEmail.trim()) {
        setAuthError("Email address is required.");
        return;
      }
      if (!authPassword) {
        setAuthError("Please create a secure password.");
        return;
      }
      if (authPassword !== authConfirmPassword) {
        setAuthError("Passwords do not match.");
        return;
      }
      if (!authTermsAccepted) {
        setAuthError("You must read and accept the Krenza academic terms & guidelines.");
        return;
      }

      setAuthSubmitting(true);
      try {
        const result: any = await FirebaseAuthService.signUpWithEmailAndPassword(
          authEmail,
          authPassword,
          authUsername,
          authFirstName,
          authLastName
        );
        setAuthSuccess("Account created successfully. A verification code has been dispatched.");
        if (result.verificationCode) {
          setSimCodeHelp(result.verificationCode);
        }
        setAuthStep("verify");
      } catch (err: any) {
        setAuthError(err.message || "Failed to create standard profile.");
      } finally {
        setAuthSubmitting(false);
      }
    };

    const handleVerify = async (e: React.FormEvent) => {
      e.preventDefault();
      setAuthError("");
      setAuthSuccess("");
      if (!authVerificationCode.trim()) {
        setAuthError("Please enter the 6-digit confirmation pin.");
        return;
      }

      setAuthSubmitting(true);
      try {
        await FirebaseAuthService.verifyEmailCode(authEmail, authVerificationCode);
        setAuthSuccess("Campus email verified! Access granted.");
      } catch (err: any) {
        setAuthError(err.message || "Invalid pin code entered.");
      } finally {
        setAuthSubmitting(false);
      }
    };

    const handleForgotPassword = async (e: React.FormEvent) => {
      e.preventDefault();
      setAuthError("");
      setAuthSuccess("");
      if (!authEmail.trim()) {
        setAuthError("Please input your registered email address.");
        return;
      }

      setAuthSubmitting(true);
      try {
        const result: any = await FirebaseAuthService.sendPasswordResetEmail(authEmail);
        setAuthSuccess("Password recovery code generated successfully.");
        if (result?.resetCode) {
          setSimCodeHelp(result.resetCode);
        }
        setAuthStep("reset");
      } catch (err: any) {
        setAuthError(err.message || "Unable to dispatch recovery request.");
      } finally {
        setAuthSubmitting(false);
      }
    };

    const handleResetPassword = async (e: React.FormEvent) => {
      e.preventDefault();
      setAuthError("");
      setAuthSuccess("");
      if (!authResetCode.trim()) {
        setAuthError("Verification reset code is required.");
        return;
      }
      if (!authNewPassword) {
        setAuthError("Please enter a new password.");
        return;
      }

      setAuthSubmitting(true);
      try {
        await FirebaseAuthService.resetPasswordWithCode(authEmail, authResetCode, authNewPassword);
        setAuthSuccess("Password updated beautifully! Please sign in with your new credentials.");
        setAuthStep("login");
        setAuthPassword("");
        setAuthNewPassword("");
        setSimCodeHelp("");
      } catch (err: any) {
        setAuthError(err.message || "Verification code expired or invalid.");
      } finally {
        setAuthSubmitting(false);
      }
    };

    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 font-sans relative overflow-hidden">
        {/* Sleek background ambiance lights */}
        <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-indigo-600/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-violet-600/5 blur-[150px] rounded-full pointer-events-none" />

        <div className="w-full max-w-md bg-slate-900/90 border border-slate-800 p-6 xs:p-8 rounded-3xl shadow-2xl relative z-10 space-y-6 backdrop-blur-md">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="mx-auto flex justify-center items-center py-2">
              <KrenzaLogo theme="dark" variant="icon-only" size={48} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">Krenza Gateway</h2>
              <p className="text-[11px] text-slate-400">Campus Project Collaborations & Smart Verifications</p>
            </div>
          </div>

          <div className="h-px bg-slate-800/60 w-full" />

          {/* Alert Messages */}
          {authError && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          {authSuccess && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-200 text-xs flex items-start gap-2.5">
              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{authSuccess}</span>
            </div>
          )}

          {/* Form Step Router */}
          {authStep === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">Username or Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Enter email or username..."
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setAuthError("");
                      setAuthSuccess("");
                      setAuthStep("forgot");
                    }}
                    className="text-[10px] text-indigo-400 hover:underline cursor-pointer"
                  >
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    placeholder="Enter security password..."
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-400 select-none">
                  <input
                    type="checkbox"
                    checked={authRememberMe}
                    onChange={(e) => setAuthRememberMe(e.target.checked)}
                    className="rounded border-slate-800 text-indigo-600 focus:ring-0 w-3.5 h-3.5 bg-slate-950"
                  />
                  Remember my session
                </label>
              </div>

              <button
                type="submit"
                disabled={authSubmitting}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex justify-center items-center gap-2 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
              >
                {authSubmitting ? "Verifying Credentials..." : "Authenticate Profile"}
              </button>

              <div className="text-center pt-1 text-xs text-slate-400">
                Don't have an account on Krenza?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setAuthError("");
                    setAuthSuccess("");
                    setAuthStep("signup");
                  }}
                  className="text-indigo-400 font-bold hover:underline cursor-pointer"
                >
                  Create Profile
                </button>
              </div>
            </form>
          )}

          {authStep === "signup" && (
            <form onSubmit={handleSignup} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">First Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Ashish"
                    value={authFirstName}
                    onChange={(e) => setAuthFirstName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">Last Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Ghadigaonkar"
                    value={authLastName}
                    onChange={(e) => setAuthLastName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">Username</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. ashish_dev"
                      value={authUsername}
                      onChange={(e) => setAuthUsername(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                    <input
                      type="email"
                      required
                      placeholder="ashish@college.edu"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Min 8 chars, 1 uppercase..."
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">Confirm Password</label>
                  <input
                    type="password"
                    required
                    placeholder="Repeat password..."
                    value={authConfirmPassword}
                    onChange={(e) => setAuthConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600"
                  />
                </div>
              </div>

              <label className="flex items-start gap-2.5 cursor-pointer text-[11px] text-slate-400 select-none pb-1">
                <input
                  type="checkbox"
                  checked={authTermsAccepted}
                  onChange={(e) => setAuthTermsAccepted(e.target.checked)}
                  className="rounded border-slate-800 text-indigo-600 focus:ring-0 w-3.5 h-3.5 mt-0.5 bg-slate-950"
                />
                <span>I accept and acknowledge the academic code of honor, peer collaboration policies, and verification standards.</span>
              </label>

              <button
                type="submit"
                disabled={authSubmitting}
                className="w-full py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold rounded-xl text-xs flex justify-center items-center gap-2 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
              >
                {authSubmitting ? "Creating Academic Account..." : "Create Free Account"}
              </button>

              <div className="text-center pt-1 text-xs text-slate-400">
                Already registered with Krenza?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setAuthError("");
                    setAuthSuccess("");
                    setAuthStep("login");
                  }}
                  className="text-indigo-400 font-bold hover:underline cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            </form>
          )}

          {authStep === "verify" && (
            <form onSubmit={handleVerify} className="space-y-4">
              <div className="space-y-2 text-center">
                <p className="text-[11px] text-slate-400 leading-normal">
                  We've sent a 6-digit verification code to <span className="text-white font-bold">{authEmail || "your register mailbox"}</span>. Please enter it below to unlock your campus credentials.
                </p>

                {simCodeHelp && (
                  <div className="p-2 bg-slate-950 border border-emerald-500/20 text-emerald-300 rounded-lg text-[10px] font-mono text-center select-all">
                    🔑 Sandbox Helper: Code is <span className="font-bold underline">{simCodeHelp}</span>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase block text-center">6-Digit Confirmation Pin</label>
                <input
                  type="text"
                  maxLength={6}
                  required
                  placeholder="123456"
                  value={authVerificationCode}
                  onChange={(e) => setAuthVerificationCode(e.target.value)}
                  className="w-36 mx-auto tracking-widest text-center text-lg font-bold py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-indigo-500 block leading-none"
                />
              </div>

              <button
                type="submit"
                disabled={authSubmitting}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex justify-center items-center gap-2 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
              >
                {authSubmitting ? "Verifying..." : "Verify & Sign In"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthError("");
                  setAuthSuccess("");
                  setAuthStep("login");
                }}
                className="w-full text-slate-400 hover:text-white transition-colors text-xs text-center flex justify-center items-center gap-1.5 cursor-pointer font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
              </button>
            </form>
          )}

          {authStep === "forgot" && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <p className="text-[11px] text-slate-400 text-center leading-normal">
                Enter your academic email address below and we will automatically dispatch a dynamic password-recovery confirmation code.
              </p>

              <div className="space-y-1">
                <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">Account Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    placeholder="e.g. rohan@college.edu"
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={authSubmitting}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex justify-center items-center gap-2 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" /> Dispatched Reset Code
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthError("");
                  setAuthSuccess("");
                  setAuthStep("login");
                }}
                className="w-full text-slate-400 hover:text-white transition-colors text-xs text-center flex justify-center items-center gap-1.5 cursor-pointer font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
              </button>
            </form>
          )}

          {authStep === "reset" && (
            <form onSubmit={handleResetPassword} className="space-y-4">
              <p className="text-[11px] text-slate-400 text-center leading-normal">
                An instant resetting pin has been generated. Use it along with your new password below.
              </p>

              {simCodeHelp && (
                <div className="p-2 bg-slate-950 border border-amber-500/20 text-amber-300 rounded-lg text-[10px] font-mono text-center select-all">
                  🔑 Sandbox Helper: Reset Code is <span className="font-bold underline">{simCodeHelp}</span>
                </div>
              )}

              <div className="space-y-1">
                <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">Verification Code</label>
                <input
                  type="text"
                  required
                  placeholder="Enter 6-digit code..."
                  value={authResetCode}
                  onChange={(e) => setAuthResetCode(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">New Security Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    placeholder="Enter new 8+ character password..."
                    value={authNewPassword}
                    onChange={(e) => setAuthNewPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={authSubmitting}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex justify-center items-center gap-2 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50"
              >
                Reset Password Profile
              </button>

              <button
                type="button"
                onClick={() => {
                  setAuthError("");
                  setAuthSuccess("");
                  setAuthStep("login");
                }}
                className="w-full text-slate-400 hover:text-white transition-colors text-xs text-center flex justify-center items-center gap-1.5 cursor-pointer font-medium"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
              </button>
            </form>
          )}

          {/* Social login divider line */}
          {["login", "signup"].includes(authStep) && (
            <>
              <div className="flex items-center gap-3 py-1">
                <div className="h-px bg-slate-800 flex-1" />
                <span className="text-[9px] font-mono text-slate-500 uppercase tracking-widest">or federated login</span>
                <div className="h-px bg-slate-800 flex-1" />
              </div>

              <div className="grid grid-cols-2 gap-3 pb-1">
                <button
                  onClick={async () => {
                    setAuthError("");
                    try {
                      await FirebaseAuthService.signInWithGoogle();
                    } catch (e: any) {
                      setAuthError(e.message || "Failed to sign in with Google.");
                    }
                  }}
                  className="py-2.5 px-3 bg-white hover:bg-slate-100 text-slate-950 font-bold rounded-xl text-[11px] flex justify-center items-center gap-1.5 shadow transition-all active:scale-[0.98] cursor-pointer"
                >
                  Google Login
                </button>

                <button
                  onClick={async () => {
                    setAuthError("");
                    try {
                      await FirebaseAuthService.signInWithGithub();
                    } catch (e: any) {
                      setAuthError(e.message || "Failed to sign in with GitHub.");
                    }
                  }}
                  className="py-2.5 px-3 bg-slate-950 hover:bg-slate-850 text-white border border-slate-800 font-bold rounded-xl text-[11px] flex justify-center items-center gap-1.5 shadow transition-all active:scale-[0.98] cursor-pointer"
                >
                  GitHub Login
                </button>
              </div>
            </>
          )}

          <div className="pt-2 text-[8.5px] text-slate-500 font-mono tracking-wider text-center">
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
      <LandingPage
        currentUser={currentUser}
        onNavigateAuth={(step) => {
          window.history.pushState(null, "", `/${step}`);
          setCurrentPath(`/${step}`);
          setAuthStep(step);
          setAuthError("");
          setAuthSuccess("");
        }}
        onEnterWorkspace={() => {
          window.history.pushState(null, "", "/login");
          setCurrentPath("/login");
          setAuthStep("login");
        }}
      />
    );
  }

  // Intercept logged in user on the landing page
  if (currentUser && currentPath === "/") {
    return (
      <LandingPage
        currentUser={currentUser}
        onNavigateAuth={(step) => {
          window.history.pushState(null, "", `/${step}`);
          setCurrentPath(`/${step}`);
        }}
        onEnterWorkspace={() => {
          window.history.pushState(null, "", "/home");
          setCurrentPath("/home");
          setActiveTab("home");
        }}
      />
    );
  }

  // Intercept profile onboarding completion state
  // Check if onboardingCompleted belongs to user, if not enforce full-fledged profile Wizard setup!
  if (currentUser && !currentUser.onboardingCompleted && localStorage.getItem("scholar_onboarding_completed") !== "true") {
    const handleCompletedOnboarding = async (e: React.FormEvent) => {
      e.preventDefault();
      setAuthError("");
      if (!onboardCollege.trim()) {
        setAuthError("Please input your current college or institute affiliation.");
        return;
      }
      if (!onboardBranch.trim()) {
        setAuthError("Department or major specialization is required.");
        return;
      }

      setOnboardSubmitting(true);
      try {
        const payload = {
          college: onboardCollege.trim(),
          branch: onboardBranch.trim(),
          graduationYear: Number(onboardGradYear),
          skills: onboardSkills.split(",").map(val => val.trim()).filter(Boolean),
          interests: onboardInterests.split(",").map(val => val.trim()).filter(Boolean),
          careerGoals: onboardGoals.trim(),
          onboardingCompleted: true,
          avatarUrl: onboardAvatar.trim() || currentUser.photoURL || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(currentUser.fullName)}`
        };

        const res = await fetch("/api/users/profile", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });

        if (res.ok) {
          const result = await res.json();
          // Update local status with verified completion
          setCurrentUser(result.user);
          // Sync completion status to simulated firebase authentication instance to survive page refresh
          FirebaseAuthService.updateSimulatedUserOnboarding(true);
          localStorage.setItem("scholar_onboarding_completed", "true");
          setAuthSuccess("Profile onboarding completed perfectly!");
        } else {
          setAuthError("Warning: Handshake update rejected by backend server.");
        }
      } catch (err: any) {
        setAuthError(err?.message || "Verification network pipeline failure.");
      } finally {
        setOnboardSubmitting(false);
      }
    };

    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 font-sans relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[450px] h-[450px] bg-indigo-600/10 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-emerald-600/5 blur-[150px] rounded-full pointer-events-none" />

        <div className="w-full max-w-lg bg-slate-900/95 border border-slate-800 p-6 sm:p-8 rounded-3xl shadow-2xl relative z-10 space-y-6 backdrop-blur-md">
          {/* Onboarding Wizard Header */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 border border-indigo-500/30 flex justify-center items-center shrink-0">
              <Sparkles className="w-6 h-6 text-indigo-400 animate-pulse" />
            </div>
            <div>
              <span className="text-[9px] font-mono font-bold text-indigo-400 uppercase tracking-widest">Awaiting Handshake</span>
              <h2 className="text-lg font-bold text-white tracking-tight">Complete Scholar Onboarding</h2>
              <p className="text-[11px] text-slate-400">Establish your unique academic details & coordinate with peers</p>
            </div>
          </div>

          <div className="h-px bg-slate-800/60 w-full" />

          {authError && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-200 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleCompletedOnboarding} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase flex items-center gap-1">
                  <Building2 className="w-3.5 h-3.5" /> College / University Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. State Institute of Technology"
                  value={onboardCollege}
                  onChange={(e) => setOnboardCollege(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase flex items-center gap-1">
                  <GraduationCap className="w-3.5 h-3.5" /> Branch / Specialization
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Computer Science Engineering"
                  value={onboardBranch}
                  onChange={(e) => setOnboardBranch(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase flex items-center gap-1">
                  Year of Graduation
                </label>
                <select
                  value={onboardGradYear}
                  onChange={(e) => setOnboardGradYear(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  <option value={2025}>2025</option>
                  <option value={2026}>2026</option>
                  <option value={2027}>2027</option>
                  <option value={2028}>2028</option>
                  <option value={2029}>2029</option>
                  <option value={2030}>2030</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase flex items-center gap-1">
                  Custom Avatar Image Link (Optional)
                </label>
                <input
                  type="url"
                  placeholder="Insert image url link..."
                  value={onboardAvatar}
                  onChange={(e) => setOnboardAvatar(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" /> Technical Skills Set (comma separated)
              </label>
              <input
                type="text"
                placeholder="React.js, Node.js, Express, MongoDB, Tailwind, Python"
                value={onboardSkills}
                onChange={(e) => setOnboardSkills(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase">
                Collaboration Interests (comma separated)
              </label>
              <input
                type="text"
                placeholder="Fullstack Dev, Cloud Systems, Open Source, UI/UX Micro-interactions"
                value={onboardInterests}
                onChange={(e) => setOnboardInterests(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-mono tracking-wider text-slate-400 uppercase flex items-center gap-1">
                <Briefcase className="w-3.5 h-3.5" /> Core Career Objective / Pitch bio
              </label>
              <textarea
                rows={2}
                placeholder="Describe your active team projects, experience, or what challenges you hope to solve..."
                value={onboardGoals}
                onChange={(e) => setOnboardGoals(e.target.value)}
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600"
              />
            </div>

            <button
              type="submit"
              disabled={onboardSubmitting}
              className="w-full py-3 bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs flex justify-center items-center gap-2 transition-all active:scale-[0.98] cursor-pointer disabled:opacity-50 mt-2"
            >
              {onboardSubmitting ? "Finalizing Scholar Verification..." : "Complete Peer Collaboration Handshake"}
            </button>

            <button
              type="button"
              onClick={async () => {
                await FirebaseAuthService.logout();
                setCurrentUser(null);
                setAuthStep("login");
              }}
              className="w-full text-rose-600 hover:text-rose-700 font-bold transition-all text-xs text-center block hover:underline cursor-pointer mt-3"
            >
              Disconnect Session & Log Out
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <>
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
        theme={theme}
        themeMode={themeMode}
        onSetThemeMode={handleSetThemeMode}
        onLogout={async () => {
          await FirebaseAuthService.logout();
          setCurrentUser(null);
          setAuthStep("login");
        }}
      >
        <AppRouter
          activeTab={activeTab}
          navigateToTab={navigateToTab}
          currentUser={currentUser}
          onUpdateCurrentUser={setCurrentUser}
          projects={projects}
          handleProjectSuccess={handleProjectSuccess}
          selectedProfileId={selectedProfileId}
          viewUserProfile={viewUserProfile}
        />
      </DashboardLayout>
      <ConfettiOverlay />
    </>
  );
}
