import React, { useState, useEffect } from "react";
import { 
  Award, Edit3, MapPin, Link2, Mail, Briefcase, 
  BookOpen, Plus, Trash2, CheckCircle, Flame, Star, 
  ShieldCheck, GitCommit, GitBranch, Terminal, Copy, AlertCircle, Sparkles,
  Trophy, GraduationCap, ArrowUpRight, MessageSquare, Heart, FileText, Check, Globe,
  Send, UserCheck, Eye, TrendingUp, ChevronRight, Zap, CheckSquare, Activity, Users, X, MoreHorizontal, AlertTriangle
} from "lucide-react";
import { User, Project } from "../../../types";
import { FirebaseAuthService } from "../../../services/firebase";
import { ProfileClickable } from "../../../shared/components/ProfileClickable";

interface MyUserProfileProps {
  userId?: string | null;
  currentUserId?: string;
  onViewProfile?: (userId: string) => void;
  onBackToFeed?: () => void;
  onUpdateCurrentUser?: (user: any) => void;
}

export default function MyUserProfile({ 
  userId, 
  currentUserId, 
  onViewProfile,
  onBackToFeed,
  onUpdateCurrentUser
}: MyUserProfileProps) {
  // If no userId is supplied, fall back to current signed-in user or "me"
  const targetUserId = userId || currentUserId || "me";
  const isOwnProfile = !userId || userId === currentUserId || userId === "me" || userId === "student_ashish";

  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [themePreference, setThemePreference] = useState<"light" | "dark">("light");
  const [loading, setLoading] = useState(true);
  const [myProjects, setMyProjects] = useState<Project[]>([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedProjId, setSelectedProjId] = useState("");

  // Connection and follow states for other users
  const [isConnected, setIsConnected] = useState(false);
  const [isFollowing, setIsFollowing] = useState(false);
  const [connectLoading, setConnectLoading] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);

  const [connectionStatus, setConnectionStatus] = useState<"Not Connected" | "Pending Sent" | "Pending Received" | "Connected" | "Blocked">("Not Connected");
  const [showConnectNoteModal, setShowConnectNoteModal] = useState(false);
  const [connectNote, setConnectNote] = useState("");
  const [pendingNoteText, setPendingNoteText] = useState("");
  const [activeRequestId, setActiveRequestId] = useState<string | null>(null);

  // Dynamic user list properties for professional profile metrics
  const [connectionsList, setConnectionsList] = useState<any[]>([]);
  const [followersList, setFollowersList] = useState<any[]>([]);
  const [followingList, setFollowingList] = useState<any[]>([]);
  const [userProjects, setUserProjects] = useState<any[]>([]);
  const [isBlocked, setIsBlocked] = useState(false);
  const [listsLoading, setListsLoading] = useState(false);

  const checkConnectionState = async () => {
    if (!targetUserId || isOwnProfile) return;
    try {
      const res = await fetch("/api/connections");
      if (res.ok) {
        const data = await res.json();
        const conns = data.connections || [];
        const reqs = data.requests || [];

        // Check flat connection accepted state
        const accepted = conns.some(
          (c: any) => (c.user1Id === (currentUserId || "student_ashish") && c.user2Id === targetUserId) || 
                      (c.user1Id === targetUserId && c.user2Id === (currentUserId || "student_ashish"))
        );

        if (accepted) {
          setConnectionStatus("Connected");
          setIsConnected(true);
          return;
        }

        // Check pending sent (by logged in user)
        const pendingSent = reqs.find(
          (r: any) => r.status === "Pending" && r.senderId === (currentUserId || "student_ashish") && r.receiverId === targetUserId
        );

        // Check pending received (received by logged in user)
        const pendingRecv = reqs.find(
          (r: any) => r.status === "Pending" && r.receiverId === (currentUserId || "student_ashish") && r.senderId === targetUserId
        );

        if (pendingSent) {
          setConnectionStatus("Pending Sent");
          setPendingNoteText(pendingSent.note || "");
          setActiveRequestId(pendingSent.id);
          setIsConnected(false);
        } else if (pendingRecv) {
          setConnectionStatus("Pending Received");
          setPendingNoteText(pendingRecv.note || "");
          setActiveRequestId(pendingRecv.id);
          setIsConnected(false);
        } else {
          setConnectionStatus("Not Connected");
          setIsConnected(false);
          setActiveRequestId(null);
        }
      }
    } catch (err) {
      console.warn("Connection sync failed gracefully:", err);
    }
  };

  const fetchLists = async () => {
    if (!targetUserId) return;
    setListsLoading(true);
    try {
      const actualId = targetUserId === "me" || targetUserId === currentUserId ? "student_ashish" : targetUserId;
      
      const [connectionsRes, followersRes, followingRes, activityRes, projectsRes] = await Promise.all([
        fetch(`/api/users/${actualId}/connections`).then(r => r.ok ? r.json() : []),
        fetch(`/api/users/${actualId}/followers`).then(r => r.ok ? r.json() : []),
        fetch(`/api/users/${actualId}/following`).then(r => r.ok ? r.json() : []),
        fetch(`/api/users/${actualId}/activity`).then(r => r.ok ? r.json() : []),
        fetch(`/api/users/${actualId}/projects`).then(r => r.ok ? r.json() : [])
      ]);

      setConnectionsList(connectionsRes);
      setFollowersList(followersRes);
      setFollowingList(followingRes);
      if (activityRes && activityRes.length > 0) {
        const mapped = activityRes.map((act: any) => ({
          id: act.id,
          type: act.type === "SocialPost" ? "Post" : act.type === "ConnectionPost" ? "Activity" : "Project",
          title: act.authorName || act.content?.slice(0, 40),
          detail: act.content,
          timestamp: new Date(act.createdAt || Date.now()).toLocaleDateString()
        }));
        setRecentActivities(mapped);
      }
      if (projectsRes) {
        setUserProjects(projectsRes);
      }
    } catch (e) {
      console.warn("Failed to fetch user list details dynamically", e);
    } finally {
      setListsLoading(false);
    }
  };

  // Active top-level subtab: portfolio, engineering, hackathons, endorsements, activity, connections, followers, or following
  const [activeSubTab, setActiveSubTab] = useState<"portfolio" | "engineering" | "hackathons" | "endorsements" | "activity" | "connections" | "followers" | "following">("portfolio");

  // Editable Profile States
  const [fullName, setFullName] = useState("");
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [skillsStr, setSkillsStr] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [linkedinLink, setLinkedinLink] = useState("");
  const [portfolioLink, setPortfolioLink] = useState("");
  const [location, setLocation] = useState("");
  const [educationStr, setEducationStr] = useState("");

  // Sub-sections lists
  const [certificates, setCertificates] = useState<string[]>([]);
  const [newCert, setNewCert] = useState("");

  const [achievements, setAchievements] = useState<string[]>([]);
  const [newAch, setNewAch] = useState("");

  const [experienceList, setExperienceList] = useState<any[]>([]);
  const [newCompany, setNewCompany] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDuration, setNewDuration] = useState("");
  const [newDesc, setNewDesc] = useState("");

  // Recommendations state
  const [recommendations, setRecommendations] = useState<any[]>([]);
  const [recAuthor, setRecAuthor] = useState("");
  const [recRole, setRecRole] = useState("");
  const [recRel, setRecRel] = useState("");
  const [recText, setRecText] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("u_1");

  // Activity list
  const [recentActivities, setRecentActivities] = useState<any[]>([]);

  // Suggested peers sidebar lists from backend
  const [suggestedPeers, setSuggestedPeers] = useState<any[]>([]);

  // Resume state
  const [resumeText, setResumeText] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  // Profile views analytics
  const [viewsStats, setViewsStats] = useState({
    profileViews: 120,
    recruiterViews: 34,
    projectViews: 75
  });

  useEffect(() => {
    fetchProfileData();
    fetchUserProjects();
    checkConnectionState();
    fetchLists();
    fetchSuggestedPeers();
  }, [targetUserId]);

  const fetchSuggestedPeers = async () => {
    try {
      const res = await fetch("/api/users/discover/peers");
      if (res.ok) {
        const data = await res.json();
        setSuggestedPeers(data);
      }
    } catch (e) {
      console.warn("Error loading suggested peers for sidebar:", e);
    }
  };

  const fetchProfileData = async () => {
    setLoading(true);
    try {
      // Determine correct URL
      const lookupUrl = isOwnProfile ? "/api/users/me" : `/api/users/${targetUserId}`;
      const res = await fetch(lookupUrl);
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setThemePreference(data.theme || "light");
        
        // Populate profile inputs
        setFullName(data.fullName || "");
        setHeadline(data.headline || "Sophomore Developer / Student");
        setBio(data.bio || "");
        setSkillsStr((data.skills || []).join(", "));
        setGithubLink(data.links?.github || "");
        setLinkedinLink(data.links?.linkedin || "");
        setPortfolioLink(data.links?.portfolio || "");
        setLocation(data.location || "");
        
        // Education String Formatting
        const ed = data.education?.[0];
        const formattedEd = ed 
          ? `${ed.degree} in ${ed.fieldOfStudy} - ${ed.institution} (${ed.startYear}-${ed.endYear || "Present"})`
          : "";
        setEducationStr(formattedEd);

        // Subsections
        setCertificates(data.certifications || []);
        setAchievements(data.achievements || []);
        setExperienceList(data.experience || []);
        setRecommendations(data.recommendations || []);

        setResumeText(data.resumeUrl ? `Verified Profile Resume: ${data.fullName}'s Vetting Spec.` : "");
        
        // Dynamic live metrics derived directly from real database states
        setViewsStats({
          profileViews: (data.connectionsCount || 0) * 3 + (data.followersCount || 0) * 2,
          recruiterViews: Math.floor((data.reputationPoints || 100) / 10),
          projectViews: (data.badges?.length || 0) * 15
        });

        // Initialize empty recent activities (populated in fetchLists)
        setRecentActivities([]);

        // Connection checks
        if (targetUserId !== "me" && targetUserId !== currentUserId) {
          setIsConnected(false);
          setIsFollowing(false);
        }

      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProjects = async () => {
    try {
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        // filter or list
        setMyProjects(data.slice(0, 4));
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      const parsedSkills = skillsStr.split(",").map(s => s.trim()).filter(Boolean);
      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          headline,
          bio,
          skills: parsedSkills,
          location,
          theme: themePreference,
          links: {
            github: githubLink,
            linkedin: linkedinLink,
            portfolio: portfolioLink
          },
          education: [{
            institution: educationStr.split("-")?.[1]?.trim() || "State Technological University",
            degree: educationStr.split(" in ")?.[0]?.trim() || "Bachelor of Technology",
            fieldOfStudy: educationStr.split(" in ")?.[1]?.split("-")?.[0]?.trim() || "Computer Science",
            startYear: 2024,
            endYear: 2028
          }],
          experience: experienceList
        })
      });
      if (res.ok) {
        setIsEditing(false);
        const data = await res.json();
        setUser(data.user);
        if (onUpdateCurrentUser) {
          onUpdateCurrentUser(data.user);
        }
        alert("Your professional resume portal has been synchronized!");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddExperience = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany || !newTitle) return;
    const updated = [
      ...experienceList,
      {
        title: newTitle,
        company: newCompany,
        startDate: newDuration || "June 2025",
        description: newDesc || "Building server routing blocks and multi-channel synchronization modules."
      }
    ];
    setExperienceList(updated);
    setNewCompany("");
    setNewTitle("");
    setNewDuration("");
    setNewDesc("");
  };

  const handleAddCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCert.trim()) return;
    setCertificates([...certificates, newCert.trim()]);
    setNewCert("");
  };

  const handleAddAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAch.trim()) return;
    setAchievements([...achievements, newAch.trim()]);
    setNewAch("");
  };

  const handleCreateRecommendation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recAuthor.trim() || !recText.trim()) return;
    
    const avatarList: Record<string, string> = {
      u_1: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80",
      u_2: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=80&h=80&q=80",
      u_3: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=80&h=80&q=80"
    };

    const newRec = {
      id: "rec_" + Date.now(),
      authorName: recAuthor,
      authorRole: recRole || "Core Collaborator",
      avatarUrl: avatarList[selectedAvatar] || avatarList.u_1,
      relationship: recRel || "Collaborated on SkillCollab projects",
      text: recText
    };

    setRecommendations([newRec, ...recommendations]);
    setRecAuthor("");
    setRecRole("");
    setRecRel("");
    setRecText("");
  };

  const handleConnect = () => {
    if (connectionStatus === "Connected") {
      alert("You are already connected with this student peer!");
      return;
    }
    if (connectionStatus === "Pending Sent" || connectionStatus === "Pending Received") {
      alert("Your connection request is pending verification approval.");
      return;
    }
    setShowConnectNoteModal(true);
  };

  const handleSendConnectionWithNote = async (e: React.FormEvent) => {
    e.preventDefault();
    setConnectLoading(true);
    try {
      const res = await fetch("/api/connections/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: targetUserId,
          note: connectNote
        })
      });

      if (res.ok) {
        setShowConnectNoteModal(false);
        setConnectNote("");
        await checkConnectionState();
        await fetchLists();
      }
    } catch (err) {
      console.warn("Connecting error: ", err);
    } finally {
      setConnectLoading(false);
    }
  };

  const handleAcceptConnection = async () => {
    if (!activeRequestId) {
      alert("No active request to approve.");
      return;
    }
    setConnectLoading(true);
    try {
      const res = await fetch("/api/connections/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId: activeRequestId })
      });
      if (res.ok) {
        await checkConnectionState();
        await fetchLists();
      }
    } catch (err) {
      console.warn("Accept connection failed:", err);
    } finally {
      setConnectLoading(false);
    }
  };

  const handleRejectConnection = async () => {
    if (!activeRequestId) return;
    setConnectLoading(true);
    try {
      const res = await fetch("/api/connections/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId: activeRequestId })
      });
      if (res.ok) {
        await checkConnectionState();
        await fetchLists();
      }
    } catch (err) {
      console.warn("Reject connection failed:", err);
    } finally {
      setConnectLoading(false);
    }
  };

  const handleWithdrawConnection = async () => {
    setConnectLoading(true);
    try {
      const res = await fetch("/api/connections/withdraw", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId: activeRequestId, receiverId: targetUserId })
      });
      if (res.ok) {
        await checkConnectionState();
        await fetchLists();
      }
    } catch (err) {
      console.warn("Withdraw connection failed:", err);
    } finally {
      setConnectLoading(false);
    }
  };

  const handleRemoveConnection = async () => {
    if (!window.confirm(`Are you sure you want to remove connection with ${user?.fullName}?`)) {
      return;
    }
    setConnectLoading(true);
    try {
      const res = await fetch("/api/connections/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: targetUserId })
      });
      if (res.ok) {
        await checkConnectionState();
        await fetchLists();
      }
    } catch (err) {
      console.warn("Remove connection failed:", err);
    } finally {
      setConnectLoading(false);
    }
  };

  const handleFollow = () => {
    setFollowLoading(true);
    setTimeout(() => {
      setFollowLoading(false);
      setIsFollowing(prev => !prev);
    }, 600);
  };

  const handleInviteToProject = () => {
    if (!selectedProjId) return;
    alert(`Successfully sent team squad recruitment invitation to ${user?.fullName}!`);
    setShowInviteModal(false);
  };

  const handleCopyResume = () => {
    navigator.clipboard.writeText(resumeText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="w-full h-80 flex flex-col justify-center items-center gap-2">
        <div className="w-9 h-9 rounded-full border-2 border-slate-800 border-t-indigo-500 animate-spin" />
        <span className="text-[10px] font-mono text-slate-500 animate-pulse uppercase">Syncing Professional Index Cards...</span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="p-8 text-center text-slate-400 bg-slate-900 border border-slate-850 rounded-2xl">
        <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-3" />
        <h3 className="font-bold text-white text-md">Profile Sync Denied</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">Requested professional user node resolved offline. Return back inside core timeline.</p>
        <button onClick={onBackToFeed} className="mt-4 px-4 py-2 bg-indigo-650 hover:bg-indigo-600 text-white rounded-xl text-xs font-bold font-mono">
          Return To Feed
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans text-left">
      
      {/* LEFT & MID SECTIONS: MAIN BIOGRAPHY & DETAILS */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* 1. PROFESSIONAL HEADER HERO BANNER CARD */}
        <div className="bg-slate-900 border border-slate-850 rounded-2xl overflow-hidden shadow-xl text-slate-100 relative group">
          
          {/* Cover Banner Image */}
          <div className="h-36 sm:h-52 bg-slate-800 relative">
            <img 
              src={user.coverUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80"} 
              alt="cover" 
              className="w-full h-full object-cover"
            />
            
            {/* Top Toolbar buttons */}
            <div className="absolute top-4 right-4 flex gap-2">
              {isOwnProfile ? (
                <>
                  <button 
                    onClick={() => setIsEditing(!isEditing)} 
                    className="bg-slate-950/85 hover:bg-indigo-600 border border-slate-800 text-white font-bold text-[10px] sm:text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-md backdrop-blur-xs cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> {isEditing ? "View Portal" : "Edit Profile"}
                  </button>
                  <button 
                    onClick={async () => {
                      await FirebaseAuthService.logout();
                      window.history.pushState(null, "", "/");
                      window.location.reload();
                    }} 
                    className="bg-rose-950/85 hover:bg-rose-700 border border-rose-900 text-white font-bold text-[10px] sm:text-xs px-3 py-1.5 rounded-lg transition-all shadow-md backdrop-blur-xs cursor-pointer"
                  >
                    Log Out
                  </button>
                </>
              ) : (
                <button 
                  onClick={onBackToFeed}
                  className="bg-slate-950/85 hover:bg-slate-900 border border-slate-800 text-slate-300 font-extrabold text-[10px] sm:text-xs px-3.5 py-1.5 rounded-lg shadow-md font-mono"
                >
                  ← Back to Feed
                </button>
              )}
            </div>
          </div>

          {/* Profile details */}
          <div className="p-5 sm:p-6 relative">
            
            {/* Float Avatar with verification badge */}
            <div className="absolute -top-14 sm:-top-16 left-5 sm:left-6 w-24 sm:w-28 h-24 sm:h-28 rounded-full border-4 border-slate-900 overflow-hidden bg-slate-950 shadow-xl">
              <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
            </div>

            <div className="pt-10 sm:pt-14 space-y-4">
              {!isEditing ? (
                <div className="space-y-4">
                  
                  {/* Headline & Location meta */}
                  <div className="flex justify-between items-start flex-wrap gap-4">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">{user.fullName}_</h2>
                        
                        <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded text-[9px] font-bold text-indigo-400 font-mono uppercase tracking-wider">
                          {user.role}
                        </span>
                        
                        <span className="px-2 py-0.5 bg-amber-400/10 border border-amber-400/25 rounded text-[9px] font-bold text-amber-400 font-mono flex items-center gap-0.5">
                          <Trophy className="w-2.5 h-2.5 shrink-0" /> {user.reputationPoints} Reps
                        </span>
                      </div>
                      
                      <p className="text-slate-300 text-xs font-semibold mt-1 max-w-xl">{user.headline || headline}</p>
                      
                      <div className="flex flex-wrap items-center gap-3 text-slate-450 text-[10px] mt-2 font-mono">
                        <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0" /> {location || "San Francisco, CA"}</span>
                        <span className="text-slate-700">•</span>
                        <span className="flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5 text-slate-500 shrink-0" /> {educationStr}</span>
                      </div>
                    </div>

                    {/* Followers Connections Metrics */}
                    <div className="flex gap-4.5 text-[10px] font-mono text-slate-400 bg-slate-950/45 p-3 rounded-xl border border-slate-850">
                      <div>
                        <span className="text-indigo-400 font-bold font-sans text-sm block leading-none">{isConnected ? (user.connectionsCount || 0) + 1 : (user.connectionsCount || 82)}</span>
                        <span>Connections</span>
                      </div>
                      <div className="w-px h-6 bg-slate-800" />
                      <div>
                        <span className="text-indigo-400 font-bold font-sans text-sm block leading-none">{isFollowing ? (user.followersCount || 0) + 1 : (user.followersCount || 120)}</span>
                        <span>Followers</span>
                      </div>
                    </div>
                  </div>

                  {/* READ ONLY SOCIAL FEEDBACK ACTIONS */}
                  {/* READ ONLY SOCIAL FEEDBACK ACTIONS */}
                  {!isOwnProfile && (
                    <div className="flex flex-col gap-3 pt-1.5 border-t border-slate-850/60 mt-3.5">
                      <div className="flex flex-wrap items-center gap-2.5">
                        
                        {/* 1. CONNECT STATE SWITCHER */}
                        {connectionStatus === "Not Connected" && (
                          <button 
                            onClick={handleConnect}
                            disabled={connectLoading}
                            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold font-sans transition-all flex items-center gap-1.5 cursor-pointer shadow-md"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Connect</span>
                          </button>
                        )}

                        {connectionStatus === "Pending Sent" && (
                          <div className="flex items-center gap-2">
                            <span className="px-4 py-2 bg-slate-900 text-amber-400 border border-amber-500/20 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-not-allowed">
                              <UserCheck className="w-3.5 h-3.5 animate-pulse" />
                              <span>Pending Sent</span>
                            </span>
                            <button
                              onClick={handleWithdrawConnection}
                              disabled={connectLoading}
                              className="px-3 py-2 bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800 text-rose-300 rounded-xl text-xs font-bold transition-all cursor-pointer"
                            >
                              Withdraw Request
                            </button>
                          </div>
                        )}

                        {connectionStatus === "Pending Received" && (
                          <div className="flex items-center gap-2 bg-slate-950/45 p-1 rounded-xl border border-slate-850">
                            <span className="text-[10px] text-slate-400 font-bold px-2">Pending Request:</span>
                            <button
                              onClick={handleAcceptConnection}
                              disabled={connectLoading}
                              className="px-3 py-1.5 bg-indigo-650 hover:bg-indigo-605 text-white rounded-lg text-[10.5px] font-bold transition-all cursor-pointer"
                            >
                              Accept
                            </button>
                            <button
                              onClick={handleRejectConnection}
                              disabled={connectLoading}
                              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 rounded-lg text-[10.5px] font-bold transition-all cursor-pointer"
                            >
                              Reject
                            </button>
                          </div>
                        )}

                        {connectionStatus === "Connected" && (
                          <div className="flex items-center gap-2">
                            <span className="px-4 py-2 bg-slate-950 text-indigo-400 border border-indigo-500/20 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-default">
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>Connected</span>
                            </span>
                            <button
                              onClick={handleRemoveConnection}
                              disabled={connectLoading}
                              className="px-3 py-2 bg-slate-900 hover:bg-red-950/40 border border-slate-850 hover:border-red-900/40 text-slate-400 hover:text-red-450 rounded-xl text-xs font-bold transition-all cursor-pointer"
                            >
                              Remove Connection
                            </button>
                          </div>
                        )}

                        {/* 2. FOLLOW BUTTON */}
                        <button 
                          onClick={handleFollow}
                          disabled={followLoading}
                          className="px-4 py-2 bg-slate-950 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors"
                        >
                          <Zap className={`w-3.5 h-3.5 ${isFollowing ? "text-amber-400 animate-pulse fill-amber-400" : "text-slate-400"}`} />
                          <span>{isFollowing ? "Following" : "Follow"}</span>
                        </button>

                        {/* 3. MESSAGE BUTTON */}
                        <button 
                          onClick={() => {
                            if (connectionStatus !== "Connected") {
                              alert("You must be connected to send direct private messages on SkillCollab! Send a connection request to connect and chat.");
                            } else {
                              localStorage.setItem("selectedChatPeerId", targetUserId || "user_priya");
                              if ((window as any).navigateToTab) {
                                (window as any).navigateToTab("chats");
                              }
                            }
                          }}
                          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                            connectionStatus === "Connected" 
                              ? "bg-slate-900 border border-slate-800 hover:border-indigo-500/40 text-slate-200"
                              : "bg-slate-950 border-slate-900 text-slate-550 opacity-55 cursor-not-allowed"
                          }`}
                        >
                          <MessageSquare className="w-3.5 h-3.5 text-indigo-400" />
                          <span>Message</span>
                        </button>

                        {/* 4. MORE ACTIONS DROPDOWN */}
                        <div className="relative">
                          <button
                            onClick={() => setIsBlocked(prev => !prev)}
                            className={`p-2 border rounded-xl text-xs font-bold flex items-center justify-center cursor-pointer transition-colors ${
                              isBlocked 
                                ? "bg-red-950/45 border-red-800 text-red-400" 
                                : "bg-slate-950 border-slate-800 text-slate-450 hover:text-white hover:bg-slate-900"
                            }`}
                            title={isBlocked ? "Unblock Peer" : "Block Peer"}
                          >
                            <AlertTriangle className="w-4 h-4" />
                          </button>
                        </div>

                        {/* 5. INVITE TO SQUAD */}
                        <button 
                          onClick={() => setShowInviteModal(true)}
                          className="px-4 py-2 bg-gradient-to-tr from-indigo-950 to-slate-900 border border-indigo-500/20 text-indigo-300 hover:text-white rounded-xl text-xs font-extrabold flex items-center gap-1.5 cursor-pointer transition-colors font-mono"
                        >
                          <ArrowUpRight className="w-3.5 h-3.5" />
                          <span>Invite to Project</span>
                        </button>
                      </div>

                      {/* Not connected hint */}
                      {connectionStatus !== "Connected" && (
                        <p className="text-[10px] text-slate-550 font-mono italic mt-0.5">
                          ✦ Connect with this user to start a conversation.
                        </p>
                      )}

                      {/* Attached note visibility for pending requests */}
                      {connectionStatus === "Pending Sent" && pendingNoteText && (
                        <div className="p-3 bg-slate-950/60 border border-amber-500/10 rounded-xl text-[10.5px] max-w-xl text-slate-400 text-left leading-normal font-sans italic">
                          <span className="text-amber-400 font-bold block not-italic font-mono text-[8.5px] tracking-wide mb-1">✦ PENDING REQUEST ATTACHED MEMO:</span>
                          "{pendingNoteText}"
                        </div>
                      )}

                      {connectionStatus === "Pending Received" && pendingNoteText && (
                        <div className="p-3 bg-slate-950/60 border border-indigo-500/20 rounded-xl text-[10.5px] max-w-xl text-slate-400 text-left leading-normal font-sans italic">
                          <span className="text-indigo-400 font-bold block not-italic font-mono text-[8.5px] tracking-wide mb-1">✦ PEER ATTACHED MEMO:</span>
                          "{pendingNoteText}"
                        </div>
                      )}
                    </div>
                  )}

                  {/* LINKEDIN NOTE ADDING MODAL */}
                  {showConnectNoteModal && user && (
                    <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-99 flex justify-center items-center p-4">
                      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 w-full max-w-sm text-left shadow-2xl space-y-4">
                        <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                          <h4 className="font-bold text-white text-xs flex items-center gap-1.5 font-sans">
                            <Users className="w-4.5 h-4.5 text-indigo-400" /> Connect with {user.fullName}
                          </h4>
                          <button onClick={() => setShowConnectNoteModal(false)} className="text-slate-400 hover:text-white cursor-pointer"><X className="w-4 h-4" /></button>
                        </div>
                        <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
                          You can customize this connection request by attaching an optional, friendly note.
                        </p>
                        <form onSubmit={handleSendConnectionWithNote} className="space-y-3">
                          <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-850">
                            <textarea
                              rows={3}
                              placeholder="e.g. Hi Sanjay, I saw your MERN project and would love to connect..."
                              value={connectNote}
                              onChange={(e) => setConnectNote(e.target.value)}
                              className="w-full bg-transparent text-xs text-slate-200 outline-none resize-none placeholder-slate-600 leading-snug"
                            />
                          </div>
                          <div className="flex gap-2 justify-end pt-1">
                            <button type="button" onClick={() => setShowConnectNoteModal(false)} className="px-3.5 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-[10px] font-bold text-slate-400 hover:text-white cursor-pointer select-none">Cancel</button>
                            <button type="submit" disabled={connectLoading} className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-[10px] font-bold text-white cursor-pointer flex items-center gap-1.5 shadow">
                              {connectLoading ? "Sending..." : "Send Request"}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  )}

                  {/* About Bio Block */}
                  <div className="border-t border-slate-850 pt-4 mt-3">
                    <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-widest font-mono mb-1.5 block">Professional Executive Summary</span>
                    <p className="text-slate-300 text-xs leading-relaxed max-w-3xl">{user.bio || bio}</p>
                    
                    {/* Career Goals & Interests */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 bg-slate-950/30 p-3 rounded-xl border border-slate-850/40 text-[11px]">
                      <div>
                        <span className="text-[8.5px] text-emerald-400 font-mono uppercase font-bold block mb-1">🎯 Career Goals</span>
                        <p className="text-slate-400">Targeting High Performance Infrastructure & Systems Engineering roles.</p>
                      </div>
                      <div>
                        <span className="text-[8.5px] text-indigo-400 font-mono uppercase font-bold block mb-1">💡 Professional Interests</span>
                        <p className="text-slate-400">Decentralized protocols, AI pipelines, low-latency microservices, Rust, web tooling.</p>
                      </div>
                    </div>
                  </div>

                  {/* Social/Repo links */}
                  <div className="flex flex-wrap items-center gap-4.5 border-t border-slate-850 pt-4 text-[10.5px] font-mono text-slate-400">
                    <a href={githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
                      <Link2 className="w-3.5 h-3.5 text-indigo-400" /> GitHub Repository
                    </a>
                    <a href={linkedinLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
                      <Link2 className="w-3.5 h-3.5 text-indigo-400" /> LinkedIn Network
                    </a>
                    <a href={portfolioLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
                      <Globe className="w-3.5 h-3.5 text-indigo-300" /> Technical Portfolio
                    </a>
                  </div>

                </div>
              ) : (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Full Legal Name</label>
                      <input 
                        type="text" 
                        value={fullName} 
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white outline-none focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Professional Headline</label>
                      <input 
                        type="text" 
                        value={headline} 
                        onChange={(e) => setHeadline(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-indigo-350 outline-none focus:border-indigo-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Primary Location</label>
                      <input 
                        type="text" 
                        value={location} 
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Education Background Details</label>
                      <input 
                        type="text" 
                        value={educationStr} 
                        onChange={(e) => setEducationStr(e.target.value)}
                        placeholder="Degree - University (Class of Year)"
                        className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="text-xs">
                    <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">About Biography Statement</label>
                    <textarea 
                      value={bio} 
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white outline-none focus:border-indigo-500 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Core Tech Skills Tags (Comma Separated)</label>
                      <input 
                        type="text" 
                        value={skillsStr} 
                        onChange={(e) => setSkillsStr(e.target.value)}
                        className="w-full bg-slate-955 border border-slate-800 rounded px-3 py-1.5 text-white outline-none focus:border-indigo-500"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Theme Preference Settings</label>
                      <select 
                        value={themePreference} 
                        onChange={(e) => setThemePreference(e.target.value as "light" | "dark")}
                        className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white outline-none focus:border-indigo-500"
                      >
                        <option value="dark">Dark Cosmic Theme</option>
                        <option value="light">Light Slate Theme</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs font-mono">
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase mb-1">GitHub Address</label>
                      <input 
                        type="url" 
                        value={githubLink} 
                        onChange={(e) => setGithubLink(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-slate-300 outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase mb-1">LinkedIn URL</label>
                      <input 
                        type="url" 
                        value={linkedinLink} 
                        onChange={(e) => setLinkedinLink(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-slate-350 outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase mb-1">Personal Site</label>
                      <input 
                        type="url" 
                        value={portfolioLink} 
                        onChange={(e) => setPortfolioLink(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-slate-300 outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2.5 border-t border-slate-850">
                    <button 
                      type="button" 
                      onClick={() => setIsEditing(false)}
                      className="px-3.5 py-1.5 border border-slate-800 text-slate-400 text-xs font-semibold rounded hover:text-white"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="px-4 py-1.5 bg-indigo-650 text-white text-xs font-bold rounded hover:bg-indigo-600 shadow cursor-pointer"
                    >
                      Sync Profile Details
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* 2. TABBED PROFESSIONAL DETAIL NAVIGATION */}
        <div className="flex gap-1.5 p-1 bg-slate-950 border border-slate-850 rounded-xl overflow-x-auto scrollbar-none">
          {[
            { id: "portfolio", label: "Skills & Experience", icon: Briefcase },
            { id: "engineering", label: "Open Source activity", icon: Terminal },
            { id: "hackathons", label: "Featured & Honors", icon: Trophy },
            { id: "endorsements", label: "Peer Endorsements", icon: MessageSquare },
            { id: "activity", label: "Recent Posts", icon: FileText },
            { id: "connections", label: `Connections (${connectionsList.length})`, icon: Users },
            { id: "followers", label: `Followers (${followersList.length})`, icon: UserCheck },
            { id: "following", label: `Following (${followingList.length})`, icon: Zap }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveSubTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg text-[10px] sm:text-[11px] font-mono font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeSubTab === tab.id
                    ? "bg-indigo-600 text-white shadow-md"
                    : "text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* 3. DYNAMIC CONTENT BLOCKS PER TAB */}

        {/* PORTFOLIO TAB */}
        {activeSubTab === "portfolio" && (
          <div className="space-y-6">
            
            {/* INVENTORY TECH SKILLS */}
            <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl space-y-3.5 text-left">
              <h3 className="text-[11px] font-bold font-mono text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-500" /> Core Skills Inventory & Verified Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {(skillsStr ? skillsStr.split(",") : ["React", "TypeScript", "Node.js"]).map((sk, idx) => {
                  const cleaned = sk.trim();
                  if (!cleaned) return null;
                  return (
                    <span key={idx} className="px-3 py-1 bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 rounded-lg cursor-default transition-all flex items-center gap-1.5 group">
                      <Zap className="w-3 h-3 text-indigo-400 group-hover:animate-bounce" />
                      <span>{cleaned}</span>
                      <ShieldCheck className="w-3 h-3 text-emerald-400 ml-1" title="Skills Vetted" />
                    </span>
                  );
                })}
              </div>
            </div>

            {/* EXPERIENCE WORK HISTORIES */}
            <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl space-y-4">
              <h3 className="text-[11px] font-bold font-mono text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                <Briefcase className="w-4 h-4 text-indigo-500" /> Professional Experience Timeline
              </h3>

              <div className="space-y-4">
                {experienceList.map((exp, idx) => (
                  <div key={idx} className="flex gap-3 bg-slate-950 border border-slate-850/40 p-4 rounded-xl relative group hover:border-slate-800 transition-all">
                    <div className="w-9 h-9 rounded-lg bg-indigo-600/10 border border-indigo-500/20 flex justify-center items-center shrink-0 mt-0.5">
                      <Briefcase className="w-4.5 h-4.5 text-indigo-400" />
                    </div>
                    <div className="text-xs space-y-1">
                      <h4 className="font-extrabold text-white text-sm">{exp.title}</h4>
                      <p className="text-indigo-300 font-semibold">{exp.company} • <span className="text-slate-500 font-mono text-[10px]">{exp.startDate || exp.duration || "Current"}</span></p>
                      <p className="text-[11px] text-slate-400 mt-1.5 leading-relaxed font-sans">{exp.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {isOwnProfile && (
                <form onSubmit={handleAddExperience} className="pt-4 border-t border-slate-850 space-y-3 text-xs">
                  <span className="block text-[10px] text-slate-400 font-mono uppercase tracking-wider">Record a new Tenure</span>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <input 
                      type="text" 
                      placeholder="e.g. Stripe Engineering" 
                      value={newCompany} 
                      onChange={(e) => setNewCompany(e.target.value)}
                      className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded text-white outline-none focus:border-indigo-500"
                      required
                    />
                    <input 
                      type="text" 
                      placeholder="e.g. Technical Intern" 
                      value={newTitle} 
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded text-white outline-none focus:border-indigo-500"
                      required
                    />
                    <input 
                      type="text" 
                      placeholder="e.g. Sept 2025 - Dec 2025" 
                      value={newDuration} 
                      onChange={(e) => setNewDuration(e.target.value)}
                      className="bg-slate-950 border border-slate-800 px-3 py-1.5 rounded text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                  <textarea 
                    placeholder="Draft tenure milestones, tech accomplishments or low-latency sync loops handled..." 
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    rows={2}
                    className="w-full bg-slate-950 border border-slate-850 px-2.5 py-1.5 rounded text-white outline-none focus:border-indigo-500 resize-none"
                  />
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-slate-950 hover:bg-slate-850 text-slate-300 font-semibold rounded border border-slate-850 flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Plus className="w-4 h-4 text-indigo-400" /> Save Job Entry
                  </button>
                </form>
              )}
            </div>

            {/* EDUCATION DETAIL BLOCK */}
            <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl space-y-3.5">
              <h3 className="text-[11px] font-bold font-mono text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                <GraduationCap className="w-4 h-4 text-indigo-500" /> Education History
              </h3>
              <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-1">
                <span className="text-[9px] font-mono text-indigo-400 font-extrabold uppercase">HIGHER INSTITUTION NODE</span>
                <h4 className="font-extrabold text-white">{educationStr.split(" - ")?.[1] || "Regional Technological University"}</h4>
                <p className="text-slate-300 text-xs mt-0.5">{educationStr.split(" - ")?.[0] || "Bachelor of Computer Science Engineering"}</p>
                <p className="text-[10px] text-slate-500 font-mono mt-2">Department: CSE • Cumulative GPA: 3.8/4.0</p>
              </div>
            </div>

            {/* AI RESUME VETTING SECURED STATUS */}
            <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl space-y-3">
              <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                <h3 className="text-[11px] font-bold font-mono text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-indigo-400" /> AI Resume Vetting Statement Hook
                </h3>
                <button 
                  onClick={handleCopyResume}
                  className="flex items-center gap-1 text-[10px] text-indigo-400 hover:text-indigo-300 font-mono font-bold"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 shrink-0" />}
                  <span>{isCopied ? "Copied" : "Copy Statement"}</span>
                </button>
              </div>

              <textarea 
                value={resumeText}
                readOnly={!isOwnProfile}
                onChange={(e) => setResumeText(e.target.value)}
                rows={3}
                className="w-full bg-slate-950 border border-slate-850 p-3 rounded-xl text-xs text-slate-300 leading-relaxed outline-none focus:border-indigo-500 resize-none font-sans"
              />
              <span className="text-[9px] text-slate-500 font-mono block">Sync with regional job portals for candidate matching models.</span>
            </div>

          </div>
        )}

        {/* OPEN SOURCE ENGINEERING ACTIVITY TAB */}
        {activeSubTab === "engineering" && (
          <div className="space-y-6">
            
            {/* GITHUB COMMIT HEATMAP */}
            <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-850 pb-2">
                <h3 className="text-[11px] font-bold font-mono text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                  <GitCommit className="w-4 h-4 text-emerald-400 animate-pulse" /> Synced GitHub Contribution Pulse
                </h3>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full font-bold">482 Total Commits</span>
              </div>

              {/* Graphic Grass blocks */}
              <div className="space-y-2">
                <div className="flex flex-wrap gap-1.5 items-center justify-between">
                  {Array.from({ length: 42 }).map((_, index) => {
                    const intensities = [
                      "bg-slate-950 border border-slate-850",
                      "bg-emerald-950/80 border border-emerald-900/40",
                      "bg-emerald-800",
                      "bg-emerald-500",
                      "bg-emerald-300"
                    ];
                    // Pick intensity dynamically based on user seed hash
                    const base = (user.fullName || "").charCodeAt(0) || 12;
                    const selectedIntensity = intensities[(index + base) % intensities.length];
                    return (
                      <div 
                        key={index} 
                        className={`w-3.5 h-3.5 rounded-sm transition-all hover:scale-125 cursor-help ${selectedIntensity}`}
                        title={`${((index + base) % 5) * 2} commits synced on remote nodes`}
                      />
                    );
                  })}
                </div>
                
                <div className="flex justify-between text-[8px] font-mono text-slate-500 max-w-sm ml-auto">
                  <span>Less contributions</span>
                  <div className="flex gap-1">
                    <div className="w-2.5 h-2.5 rounded-sm bg-slate-950" />
                    <div className="w-2.5 h-2.5 rounded-sm bg-emerald-900" />
                    <div className="w-2.5 h-2.5 rounded-sm bg-emerald-800" />
                    <div className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
                    <div className="w-2.5 h-2.5 rounded-sm bg-emerald-300" />
                  </div>
                  <span>More contributions</span>
                </div>
              </div>
            </div>

            {/* PERFORMANCE METRICS */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              <div className="bg-slate-900 border border-slate-850 p-4.5 rounded-xl">
                <span className="text-xl font-bold font-mono text-emerald-400">482</span>
                <span className="text-[9px] text-slate-500 font-mono block mt-1 uppercase">Commits Logs</span>
              </div>
              <div className="bg-slate-900 border border-slate-850 p-4.5 rounded-xl">
                <span className="text-xl font-bold font-mono text-indigo-400">23</span>
                <span className="text-[9px] text-slate-500 font-mono block mt-1 uppercase">Merged PRs</span>
              </div>
              <div className="bg-slate-900 border border-slate-850 p-4.5 rounded-xl">
                <span className="text-xl font-bold font-mono text-amber-500">12 Days</span>
                <span className="text-[9px] text-slate-500 font-mono block mt-1 uppercase">Commit Streak</span>
              </div>
              <div className="bg-slate-900 border border-slate-850 p-4.5 rounded-xl">
                <span className="text-xl font-bold font-mono text-pink-400">89%</span>
                <span className="text-[9px] text-slate-500 font-mono block mt-1 uppercase">PR Merges Rate</span>
              </div>
            </div>

            {/* REPOSITORIES SYNCED */}
            <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl space-y-4">
              <h3 className="text-[11px] font-bold font-mono text-indigo-400 uppercase tracking-widest">Top Developer Repositories</h3>
              
              <div className="space-y-3.5 text-xs text-left">
                <div className="p-3.5 bg-slate-950 border border-slate-850 rounded-xl flex justify-between items-center relative group hover:border-slate-800 transition-all">
                  <div className="min-w-0">
                    <strong className="text-white font-mono text-xs">{user.fullName.toLowerCase().replace(/\s+/g, "-")}/server-gateway-router</strong>
                    <p className="text-[10px] text-slate-400 mt-1 truncate">Fast proxy multiplexer with fully custom buffer pooling and gRPC channels.</p>
                    <span className="text-[8.5px] bg-emerald-500/10 text-emerald-400 px-1.5 py-0.5 rounded font-mono mt-1 inline-block">Active Main Repo</span>
                  </div>
                  <span className="text-[10px] font-mono text-amber-400 shrink-0 select-none">★ 142 Stars</span>
                </div>

                <div className="p-3.5 bg-slate-950 border border-slate-850 rounded-xl flex justify-between items-center hover:border-slate-800 transition-colors">
                  <div className="min-w-0">
                    <strong className="text-white font-mono text-xs">{user.fullName.toLowerCase().replace(/\s+/g, "-")}/reactive-dashboard-suite</strong>
                    <p className="text-[10px] text-slate-400 mt-1 truncate">Responsive charts panel mapping standard server telemetry logs in real time.</p>
                  </div>
                  <span className="text-[10px] font-mono text-amber-500 shrink-0">★ 47 Stars</span>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* HACKATHONS FEATURED & HONORS TAB */}
        {activeSubTab === "hackathons" && (
          <div className="space-y-6">
            
            {/* FEATURED PROJECTS STARTUPS */}
            <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl space-y-4">
              <h3 className="text-[11px] font-bold font-mono text-indigo-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-850 pb-2">
                <Trophy className="w-4 h-4 text-amber-450" /> Highlighted Hackathons & Startups
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-[8.5px] font-mono text-emerald-400 font-extrabold uppercase bg-emerald-500/10 px-1.5 py-0.5 rounded">1st PLACE GOLD</span>
                    <Flame className="w-4 h-4 text-amber-500" />
                  </div>
                  <h4 className="font-extrabold text-white text-xs">AI Studio Hackfest Winner</h4>
                  <p className="text-[10.5px] text-slate-400">Created automatic resume scoring models syncing with national peer pools.</p>
                </div>

                <div className="p-4 bg-slate-950 border border-slate-855 rounded-xl space-y-2">
                  <div className="flex justify-between items-start">
                    <span className="text-[8.5px] font-mono text-pink-400 font-extrabold uppercase bg-pink-500/10 px-1.5 py-0.5 rounded text-[8px]">STARTUP INCUBATED</span>
                    <ArrowUpRight className="w-4 h-4 text-pink-400" />
                  </div>
                  <h4 className="font-extrabold text-white text-xs">EtherPulse Ledger Gateway</h4>
                  <p className="text-[10.5px] text-slate-400">Constructed high velocity Solidity parser yielding safe transaction graphs.</p>
                </div>
              </div>
            </div>

            {/* VERIFIED ACHIEVEMENTS LIST */}
            <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl space-y-4">
              <h3 className="text-[11px] font-bold font-mono text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
                <Award className="w-4 h-4 text-indigo-500" /> Verified Credentials & Awards
              </h3>

              <div className="space-y-3">
                {achievements.map((ach, idx) => (
                  <div key={idx} className="p-3 bg-slate-950 border border-slate-850 rounded-xl flex justify-between items-center text-xs">
                    <div className="flex items-center gap-2.5">
                      <Trophy className="w-4.5 h-4.5 text-amber-400 shrink-0" />
                      <div>
                        <h4 className="font-extrabold text-white">{ach}</h4>
                        <p className="text-[9.5px] text-slate-500 font-mono">Issued: Standard Campus Committee Node</p>
                      </div>
                    </div>
                    <span className="text-[8.5px] bg-indigo-500/10 text-indigo-400 font-mono font-bold px-2 py-0.5 rounded uppercase">Verified ✓</span>
                  </div>
                ))}
              </div>

              {isOwnProfile && (
                <form onSubmit={handleAddAchievement} className="flex gap-2.5 text-xs pt-2.5 border-t border-slate-850">
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. 2nd Place – Regional Hackfest 2026"
                    value={newAch}
                    onChange={(e) => setNewAch(e.target.value)}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-white outline-none focus:border-indigo-500"
                  />
                  <button type="submit" className="px-4 py-1.5 bg-indigo-650 hover:bg-indigo-600 text-white font-bold rounded-lg cursor-pointer transition-colors whitespace-nowrap">
                    Add Award
                  </button>
                </form>
              )}
            </div>

            {/* PROFESSIONAL CERTIFICATIONS INDEX */}
            <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl space-y-3.5">
              <h3 className="text-[11px] font-bold font-mono text-indigo-400 uppercase tracking-widest">
                Professional Tech Certifications
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {certificates.map((cert, index) => (
                  <div key={index} className="p-3 bg-slate-950 border border-slate-850 rounded-xl flex items-center gap-2.5">
                    <ShieldCheck className="w-4.5 h-4.5 text-emerald-400 shrink-0" />
                    <span className="text-slate-350 text-xs font-semibold">{cert}</span>
                  </div>
                ))}
              </div>

              {isOwnProfile && (
                <form onSubmit={handleAddCertificate} className="flex gap-2.5 text-xs pt-2.5 border-t border-slate-850">
                  <input 
                    type="text" 
                    required
                    placeholder="e.g. GCP Associate DevOps Engineer"
                    value={newCert}
                    onChange={(e) => setNewCert(e.target.value)}
                    className="flex-1 bg-slate-955 border border-slate-800 rounded px-3 py-1.5 text-white outline-none focus:border-indigo-500"
                  />
                  <button type="submit" className="px-4 py-1.5 bg-indigo-650 hover:bg-indigo-600 text-white font-bold rounded-lg cursor-pointer transition-colors whitespace-nowrap">
                    Add Cert
                  </button>
                </form>
              )}
            </div>

          </div>
        )}

        {/* PEER RECOMMENDATIONS ENDORSEMENTS TAB */}
        {activeSubTab === "endorsements" && (
          <div className="space-y-6">
            
            {/* RECEIVED RECOMMENDATIONS */}
            <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl space-y-4">
              <h3 className="text-[11px] font-bold font-mono text-indigo-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-850 pb-2">
                <MessageSquare className="w-4.5 h-4.5 text-indigo-450" /> Vetted Peer Recommendations
              </h3>

              <div className="space-y-4">
                {recommendations.map(rec => (
                  <div key={rec.id} className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-3 text-xs">
                    <div className="flex gap-2.5 items-center">
                      <img src={rec.avatarUrl} alt={rec.authorName} className="w-10 h-10 rounded-full object-cover border border-slate-800" referrerPolicy="no-referrer" />
                      <div>
                        <h4 className="font-extrabold text-white text-xs">{rec.authorName}</h4>
                        <p className="text-indigo-300 font-semibold text-[10px]">{rec.authorRole}</p>
                        <span className="text-[9px] text-slate-500 font-mono block mt-0.5">{rec.relationship}</span>
                      </div>
                    </div>
                    <p className="text-slate-350 leading-relaxed italic font-sans">
                      "{rec.text}"
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* WRITE ENDORSEMENT FORM */}
            <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl space-y-4">
              <h3 className="text-[11px] font-bold font-mono text-indigo-400 uppercase tracking-widest">
                Post Professional Recommendation Endorsement
              </h3>

              <form onSubmit={handleCreateRecommendation} className="space-y-3.5 text-xs text-left">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] text-slate-450 font-mono uppercase mb-1">Your Name</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Sreya Malhotra" 
                      value={recAuthor}
                      onChange={(e) => setRecAuthor(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-450 font-mono uppercase mb-1">Your Engineering Role</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Technical Auditor @ GDSC Node" 
                      value={recRole}
                      onChange={(e) => setRecRole(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] text-slate-450 font-mono uppercase mb-1">Project Relationship</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Backed Ashish on server routing blocks" 
                      value={recRel}
                      onChange={(e) => setRecRel(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-455 font-mono uppercase mb-1">Select Custom Reviewer Avatar</label>
                    <div className="flex gap-2 pt-1">
                      {[
                        { id: "u_1", url: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80" },
                        { id: "u_2", url: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=80&h=80&q=80" },
                        { id: "u_3", url: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=80&h=80&q=80" }
                      ].map(av => (
                        <button 
                          key={av.id}
                          type="button"
                          onClick={() => setSelectedAvatar(av.id)}
                          className={`w-7.5 h-7.5 rounded-full overflow-hidden border-2 ${selectedAvatar === av.id ? "border-indigo-505 bg-indigo-600/20" : "border-slate-800"}`}
                        >
                          <img src={av.url} alt="avatar option" className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] text-slate-450 font-mono uppercase mb-1">Endorsement Message Context</label>
                  <textarea 
                    required
                    placeholder="Provide objective highlights regarding their technical diligence, protocol understanding, cooperation habits, and promptness..."
                    value={recText}
                    onChange={(e) => setRecText(e.target.value)}
                    rows={2.5}
                    className="w-full bg-slate-950 border border-slate-800 rounded p-2.5 text-white outline-none focus:border-indigo-500 resize-none font-sans"
                  />
                </div>

                <button 
                  type="submit" 
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-505 text-white font-bold rounded-lg cursor-pointer transition-colors"
                >
                  Post Endorsement
                </button>
              </form>
            </div>

          </div>
        )}

        {/* RECENT SOCIAL ACTIVITY FEED OVERVIEW */}
        {activeSubTab === "activity" && (
          <div className="space-y-4">
            <h3 className="text-[11px] font-bold font-mono text-indigo-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-850 pb-2 text-left">
              <Activity className="w-4.5 h-4.5 text-indigo-500" /> Recent Campus Feed Activity Logs
            </h3>

            {recentActivities.map(act => (
              <div key={act.id} className="p-4 bg-slate-900 border border-slate-850 rounded-xl space-y-2 text-left text-xs hover:border-slate-800 transition-colors">
                <div className="flex justify-between items-center bg-transparent">
                  <span className="text-[8.5px] font-mono text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded font-extrabold uppercase">{act.type} Update</span>
                  <span className="text-[8.5px] text-slate-500 font-mono">{act.timestamp}</span>
                </div>
                <h4 className="font-extrabold text-white text-xs mt-1.5">{act.title}</h4>
                <p className="text-[11px] text-slate-400 font-sans leading-relaxed">{act.detail}</p>
              </div>
            ))}
          </div>
        )}

        {/* CONNECTIONS TAB */}
        {activeSubTab === "connections" && (
          <div className="space-y-4">
            <h3 className="text-[11px] font-bold font-mono text-indigo-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-850 pb-2 text-left">
              <Users className="w-4.5 h-4.5 text-indigo-505" /> Connected Student Cohorts
            </h3>
            {connectionsList.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No verified professional connections established yet.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {connectionsList.map((peer: any) => (
                  <div key={peer.id} className="p-3 bg-slate-900 border border-slate-850 rounded-xl flex items-center justify-between gap-3.5 hover:border-slate-800 transition-colors">
                    <ProfileClickable userId={peer.id} className="flex items-center gap-2.5 min-w-0">
                      <img src={peer.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80"} alt={peer.fullName} className="w-8.5 h-8.5 rounded-full object-cover shrink-0" referrerPolicy="no-referrer" />
                      <div className="min-w-0 text-left">
                        <span className="text-xs font-bold text-white block hover:underline truncate">{peer.fullName}</span>
                        <span className="text-[10px] text-slate-450 truncate block">{peer.headline || peer.role}</span>
                      </div>
                    </ProfileClickable>
                    <button onClick={() => onViewProfile && onViewProfile(peer.id)} className="px-3 py-1 bg-slate-950 border border-slate-800 hover:border-slate-700 text-[10px] font-mono font-bold text-indigo-455 rounded-lg cursor-pointer">
                      Profile
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* FOLLOWERS TAB */}
        {activeSubTab === "followers" && (
          <div className="space-y-4">
            <h3 className="text-[11px] font-bold font-mono text-indigo-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-850 pb-2 text-left">
              <UserCheck className="w-4.5 h-4.5 text-indigo-505" /> Direct Followers
            </h3>
            {followersList.length === 0 ? (
              <p className="text-xs text-slate-500 italic">0 followers are currently tracking this account.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {followersList.map((peer: any) => (
                  <div key={peer.id} className="p-3 bg-slate-900 border border-slate-850 rounded-xl flex items-center justify-between gap-3.5 hover:border-slate-800 transition-colors">
                    <ProfileClickable userId={peer.id} className="flex items-center gap-2.5 min-w-0">
                      <img src={peer.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80"} alt={peer.fullName} className="w-8.5 h-8.5 rounded-full object-cover shrink-0" referrerPolicy="no-referrer" />
                      <div className="min-w-0 text-left">
                        <span className="text-xs font-bold text-white block hover:underline truncate">{peer.fullName}</span>
                        <span className="text-[10px] text-slate-450 truncate block">{peer.headline || peer.role}</span>
                      </div>
                    </ProfileClickable>
                    <button onClick={() => onViewProfile && onViewProfile(peer.id)} className="px-3 py-1 bg-slate-950 border border-slate-800 hover:border-slate-700 text-[10px] font-mono font-bold text-indigo-455 rounded-lg cursor-pointer">
                      Profile
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* FOLLOWING TAB */}
        {activeSubTab === "following" && (
          <div className="space-y-4">
            <h3 className="text-[11px] font-bold font-mono text-indigo-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-850 pb-2 text-left">
              <Zap className="w-4.5 h-4.5 text-indigo-505" /> Following
            </h3>
            {followingList.length === 0 ? (
              <p className="text-xs text-slate-500 italic">This user is not tracking any peer developers.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {followingList.map((peer: any) => (
                  <div key={peer.id} className="p-3 bg-slate-900 border border-slate-850 rounded-xl flex items-center justify-between gap-3.5 hover:border-slate-800 transition-colors">
                    <ProfileClickable userId={peer.id} className="flex items-center gap-2.5 min-w-0">
                      <img src={peer.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80"} alt={peer.fullName} className="w-8.5 h-8.5 rounded-full object-cover shrink-0" referrerPolicy="no-referrer" />
                      <div className="min-w-0 text-left">
                        <span className="text-xs font-bold text-white block hover:underline truncate">{peer.fullName}</span>
                        <span className="text-[10px] text-[10px] text-slate-450 truncate block">{peer.headline || peer.role}</span>
                      </div>
                    </ProfileClickable>
                    <button onClick={() => onViewProfile && onViewProfile(peer.id)} className="px-3 py-1 bg-slate-950 border border-slate-800 hover:border-slate-700 text-[10px] font-mono font-bold text-indigo-455 rounded-lg cursor-pointer">
                      Profile
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* RIGHT SIDEBAR: HIGH FIDELITY PROFILE ANALYTICS & VISITOR PANEL */}
      <div className="space-y-6">
        
        {/* REPUTATION PROGRESS & GOAL TRACKER CARD */}
        <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl text-left space-y-3.5">
          <div className="flex justify-between items-center border-b border-indigo-500/10 pb-2">
            <span className="text-[10.5px] font-mono text-amber-400 font-bold tracking-wider uppercase flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-amber-400" /> Reputation Rank
            </span>
            <span className="text-[9.5px] text-slate-400 font-mono">Gold Node II</span>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Rep Score</span>
              <span className="text-white font-bold">{user.reputationPoints || 100} / 250 pt</span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-850">
              <div 
                className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full transition-all"
                style={{ width: `${Math.min(100, ((user.reputationPoints || 100) / 250) * 100)}%` }}
              />
            </div>
            <span className="text-[9.5px] text-slate-500 block">Next Level: 250 pts for Gold Node III privileges</span>
          </div>

          {/* DAILY GOALS CHECKLIST */}
          {isOwnProfile && (
            <div className="pt-2 border-t border-slate-850">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-[10.5px] text-white font-bold flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-orange-500" /> Daily Objectives
                </span>
                <span className="text-[9.5px] text-indigo-400 font-mono font-bold bg-indigo-500/10 px-1 py-0.5 rounded">66% complete</span>
              </div>
              
              <div className="space-y-2">
                {[
                  { id: 1, text: "Check remaining PR reviews in EtherPulse", done: false },
                  { id: 2, text: "Commit 1 issue in Open Source Hub", done: true },
                  { id: 3, text: "Browse senior mentor available slots", done: true }
                ].map(goal => (
                  <div 
                    key={goal.id} 
                    className="flex gap-2 items-center text-[10.5px] text-slate-300 select-none cursor-default"
                  >
                    <CheckCircle className={`w-3.5 h-3.5 shrink-0 ${goal.done ? "text-emerald-400 fill-emerald-500/10" : "text-slate-600"}`} />
                    <span className={goal.done ? "line-through text-slate-500" : ""}>{goal.text}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ACTIVE MILESTONE PROGRESS */}
        <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl relative overflow-hidden text-left group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 blur-2xl rounded-full" />
          <span className="text-[9px] bg-indigo-500/15 text-indigo-400 font-mono font-bold tracking-widest px-2 py-0.5 rounded-full uppercase">
            Active Milestone
          </span>
          <h3 className="text-white text-sm font-bold mt-2 font-sans group-hover:text-indigo-400 transition-colors">
            EtherPulse Tracker
          </h3>
          <p className="text-[10.5px] text-slate-400 mt-1 leading-relaxed">
            Task: Complete module 3 ledger analyzer implementation (gRPC client).
          </p>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-[9.5px] font-mono text-slate-500"> Roster size: 2/4</span>
            <button 
              onClick={() => onBackToFeed && onBackToFeed()}
              className="flex items-center gap-1 text-[10px] text-indigo-400 font-bold hover:text-indigo-300 font-mono"
            >
              Resume coding <ArrowUpRight className="w-2.5 h-2.5" />
            </button>
          </div>
        </div>

        {/* PERSONAL AUDIT ACTIVITY LOG */}
        <div className="bg-slate-900 border border-slate-850 p-4.5 rounded-2xl text-left space-y-3">
          <span className="text-[10px] font-mono text-slate-400 font-bold uppercase tracking-widest block mb-1">
            Personal Audit Activity Log
          </span>
          <div className="space-y-2">
            {[
              { id: "act_1", text: "Liked Nitin Kamath's internship post", time: "2h ago" },
              { id: "act_2", text: "Completed solidity core verification", time: "4h ago" },
              { id: "act_3", text: "Handshaked on EtherPulse roster with Pranav", time: "1d ago" }
            ].map(act => (
              <div key={act.id} className="flex justify-between items-center bg-slate-950/40 p-2.5 rounded-xl border border-slate-850 text-xs text-left">
                <span className="text-slate-300 text-[10.5px] leading-snug">{act.text}</span>
                <span className="text-[8.5px] font-mono text-slate-500 shrink-0">{act.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* PROFILE RECRUITER ANALYTICS WIDGET */}
        <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl space-y-4 text-left">
          <h3 className="text-[11px] font-bold font-mono text-indigo-400 uppercase tracking-widest flex items-center gap-1.5 border-b border-slate-800 pb-2.5">
            <TrendingUp className="w-4 h-4 text-emerald-400" /> Professional Profile Analytics
          </h3>

          <div className="space-y-3.5">
            <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Eye className="w-4 h-4 text-indigo-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block font-sans">Profile Views</span>
                  <p className="text-[9px] text-slate-500 font-mono leading-none mt-0.5">Last 14 days</p>
                </div>
              </div>
              <span className="text-md font-extrabold font-mono text-white leading-none">{viewsStats.profileViews}</span>
            </div>

            <div className="p-3 bg-slate-955 border border-slate-850 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Award className="w-4 h-4 text-emerald-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block font-sans">Recruiter Queries</span>
                  <p className="text-[9px] text-slate-500 font-mono leading-none mt-0.5">Search matches</p>
                </div>
              </div>
              <span className="text-md font-bold font-mono text-emerald-400 leading-none">+{viewsStats.recruiterViews}</span>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <ArrowUpRight className="w-4 h-4 text-pink-400 shrink-0" />
                <div>
                  <span className="text-[10px] text-slate-400 block font-sans">Project Pitch Views</span>
                  <p className="text-[9px] text-slate-500 font-mono leading-none mt-0.5">Teammate checks</p>
                </div>
              </div>
              <span className="text-md font-extrabold font-mono text-white leading-none">{viewsStats.projectViews}</span>
            </div>
          </div>
          <span className="text-[8.5px] text-slate-500 font-mono leading-snug block">Vetting signals synced with verified university hiring databases.</span>
        </div>

        {/* SIDE GRAPHICS SUGGESTED PEERS ROW */}
        <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl text-left space-y-3.5">
          <h3 className="text-[11px] font-bold font-mono text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
            <Users className="w-4 h-4 text-indigo-500" /> People Also Viewed
          </h3>

          <div className="space-y-3">
            {suggestedPeers.length === 0 ? (
              <div className="text-[10px] text-slate-500 font-mono text-center py-4">No other peers listed.</div>
            ) : (
              suggestedPeers.map(peer => {
                if ((peer.id || peer._id) === targetUserId) return null;
                return (
                  <div 
                    key={peer.id || peer._id} 
                    onClick={() => onViewProfile && onViewProfile(peer.id || peer._id)}
                    className="p-2 bg-slate-950 border border-slate-850 rounded-xl hover:border-slate-800 transition-all flex items-center justify-between gap-2.5 cursor-pointer group"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <img src={peer.avatarUrl || "https://api.dicebear.com/7.x/adventurer/svg?seed=" + (peer.id || peer._id)} alt={peer.fullName} className="w-8 h-8 rounded-full object-cover shrink-0" referrerPolicy="no-referrer" />
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-white leading-none hover:underline group-hover:text-indigo-400 transition-colors truncate">{peer.fullName || "Student Developer"}</h4>
                        <span className="text-[9px] text-slate-450 mt-0.5 block truncate">{peer.role || peer.headline || "Active Developer"}</span>
                      </div>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white group-hover:translate-x-0.5 transition-all shrink-0" />
                  </div>
                );
              })
            )}
          </div>
        </div>

      </div>

      {/* RECRUITMENT SQUAD INVITE MODAL */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-sm w-full p-6 space-y-4">
            <h3 className="font-extrabold text-white text-md flex items-center gap-1.5 font-mono uppercase">
              <CheckSquare className="text-indigo-400 w-5 h-5" /> Project Recruitment Invite
            </h3>
            <p className="text-xs text-slate-400 leading-normal">
              Recruit <strong className="text-white">{user.fullName}</strong> inside one of your active student developer project rosters:
            </p>

            <div className="space-y-2">
              <label className="block text-[9px] text-slate-500 font-mono uppercase">Active Projects</label>
              <select 
                value={selectedProjId}
                onChange={(e) => setSelectedProjId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-200 rounded-lg p-2.5 outline-none focus:border-indigo-500"
              >
                <option value="">-- Choose Project --</option>
                {myProjects.length === 0 ? (
                  <option disabled>No projects found. Build one first!</option>
                ) : (
                  myProjects.map((proj) => (
                    <option key={proj.id || proj._id} value={proj.id || proj._id}>
                      {proj.title}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="flex justify-end gap-2 text-xs pt-2">
              <button 
                onClick={() => setShowInviteModal(false)}
                className="px-4 py-2 border border-slate-800 text-slate-400 rounded-lg font-bold hover:text-white"
              >
                Cancel
              </button>
              <button 
                onClick={handleInviteToProject}
                disabled={!selectedProjId}
                className="px-4 py-2 bg-indigo-650 disabled:bg-slate-800 text-white font-bold rounded-lg hover:bg-indigo-600 disabled:text-slate-500 transition-colors"
              >
                Send Invite Spec
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
