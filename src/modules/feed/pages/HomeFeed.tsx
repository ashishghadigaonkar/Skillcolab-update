import React, { useState, useEffect } from "react";
import { Sparkles, Sparkle, AlertCircle, RefreshCw } from "lucide-react";
import LoadingSkeleton from "../../../shared/components/LoadingSkeleton";
import { FollowService } from "../../../services/followService";
import { EngagementDashboard } from "../components/EngagementDashboard";
import { FeedItem, FeedPost } from "../components/FeedItem";
import { RecommendationWidget } from "../components/RecommendationWidget";

interface HomeFeedProps {
  navigateToTab?: (tabId: string) => void;
  currentUser?: any;
  onViewProfile?: (userId: string) => void;
}

export default function HomeFeed({ navigateToTab, currentUser, onViewProfile }: HomeFeedProps) {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  
  // Lazy Loading States
  const [lazyLoading, setLazyLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Composer variables
  const [showCreateComposer, setShowCreateComposer] = useState(false);
  const [newPostText, setNewPostText] = useState("");
  const [newPostType, setNewPostType] = useState<string>("SocialPost");
  const [newPostProjectTitle, setNewPostProjectTitle] = useState("");
  const [newPostSkills, setNewPostSkills] = useState("");

  const [followingIds, setFollowingIds] = useState<string[]>([]);
  const [notification, setNotification] = useState<{ text: string; success: boolean } | null>(null);

  // Load social feed and followed accounts with high-fidelity loading state
  const fetchFeedData = async (isSilent = false) => {
    if (!isSilent) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }
    try {
      const feedRes = await fetch("/api/feed");
      const feedData = await feedRes.json();
      if (feedData && Array.isArray(feedData.posts)) {
        setPosts(feedData.posts);
      }

      const backendFollows = await FollowService.getFollowing();
      setFollowingIds((backendFollows || []).map((f: any) => f.followingId));
    } catch (e) {
      console.error("[Feed] Error querying backend social graphs:", e);
    } finally {
      // Slight smooth delay to allow custom feed skeletons to display elegantly
      setTimeout(() => {
        setLoading(false);
        setRefreshing(false);
      }, 450);
    }
  };

  useEffect(() => {
    fetchFeedData();
  }, []);

  // Filter category selection with skeletal proxy loader
  const handleFilterClick = (filterId: string) => {
    if (activeFilter === filterId) return;
    setLoading(true);
    setActiveFilter(filterId);
    setTimeout(() => {
      setLoading(false);
    }, 380);
  };

  // Simulated bottom-feed lazy loading pagination handler
  const handleLoadMore = () => {
    if (lazyLoading || !hasMore) return;
    setLazyLoading(true);

    setTimeout(() => {
      const lazyLoadedPosts: FeedPost[] = [
        {
          id: `act_lazy_${Date.now()}_1`,
          userId: "student_neha",
          authorName: "Neha Verma",
          authorRole: "AI Resident @ IISc Research Labs",
          authorAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80",
          type: "ProjectUpdate",
          content: "Just finalized our project team specs for the decentralized compilation ledger! Recruiting one last expert with OAuth and Docker experience.",
          skills: ["Node.js", "OAuth", "API Security", "Docker"],
          likesCount: 16,
          commentsCount: 0,
          sharesCount: 1,
          likes: [],
          saves: [],
          comments: [],
          projectMeta: {
            id: "proj_proxy_gatekeeper",
            title: "API Proxy Gatekeeper",
            tagline: "Durable caching and rate-limit controls preserving client session context safely.",
            difficulty: "Advanced",
            currentTeamSize: 2,
            teamSizeLimit: 3
          },
          createdAt: new Date().toISOString(),
          likedByUser: false,
          savedByUser: false,
          timestamp: "Just now"
        },
        {
          id: `act_lazy_${Date.now()}_2`,
          userId: "comp_google",
          authorName: "Google Developer Campus Hub",
          authorRole: "Official Partnership Representative",
          authorAvatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&h=150&q=80",
          type: "HackathonOpportunity",
          content: "Submissions for the Virtual CleanTech Sandbox Hackathon 2026 are closing soon! Over $8k in cloud credits, custom badges, and mentorship access to select fast-tracked applicants.",
          skills: ["React & Tailwind", "FastAPI", "MongoDB"],
          likesCount: 64,
          commentsCount: 1,
          sharesCount: 12,
          likes: ["student_ashish"],
          saves: [],
          comments: [
            { id: "cm_lazy_1", author: "Ashish Ghadigaonkar", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80", text: "Excited for this clean sandbox launch session!", time: "Just now" }
          ],
          opportunityMeta: {
            id: "hack_cleantech_2026",
            title: "CleanTech Sandbox Hub-fest",
            opportunityType: "hackathon",
            deadline: "June 22, 2026",
            location: "Virtual Campus Partner Lobby",
            starsCount: 310
          },
          createdAt: new Date().toISOString(),
          likedByUser: true,
          savedByUser: false,
          timestamp: "Just now"
        }
      ];

      setPosts(prev => [...prev, ...lazyLoadedPosts]);
      setLazyLoading(false);
      setHasMore(false); // Only mock one pagination batch to avoid endless clutter
      showToast("Loaded newer campus highlights successfully! 📚");
    }, 750);
  };

  // Flash UI messages
  const showToast = (text: string, success = true) => {
    setNotification({ text, success });
    setTimeout(() => setNotification(null), 3000);
  };

  // POST: Create a fresh update
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    try {
      const skillsArray = newPostSkills
        .split(",")
        .map(s => s.trim())
        .filter(Boolean);

      let projectMeta = null;
      if (newPostType === "TeamRecruitment" && newPostProjectTitle.trim()) {
        projectMeta = {
          title: newPostProjectTitle.trim(),
          tagline: "Exciting new builder match hosted on SkillCollab marketplace",
          difficulty: "Intermediate",
          currentTeamSize: 1,
          teamSizeLimit: 4
        };
      }

      const res = await fetch("/api/feed/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: newPostType,
          content: newPostText,
          skills: skillsArray,
          projectMeta
        })
      });

      const data = await res.json();
      if (data.success && data.post) {
        setPosts(prev => [data.post, ...prev]);
        setNewPostText("");
        setNewPostProjectTitle("");
        setNewPostSkills("");
        setShowCreateComposer(false);
        showToast("Dynamic post published successfully! 🚀");
      }
    } catch (err) {
      console.error("[Feed] Failed drafting update:", err);
      showToast("Error publishing post. Please try again.", false);
    }
  };

  // POST: Toggle Liking
  const handleLike = async (postId: string) => {
    try {
      const res = await fetch(`/api/feed/posts/${postId}/like`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setPosts(prev => prev.map(p => {
          if (p.id === postId) {
            return { ...p, likesCount: data.likesCount, likedByUser: data.likedByUser };
          }
          return p;
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  // POST: Add Comment
  const handleComment = async (postId: string, text: string) => {
    try {
      const res = await fetch(`/api/feed/posts/${postId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      if (data.success) {
        setPosts(prev => prev.map(p => {
          if (p.id === postId) {
            return { ...p, comments: data.comments, commentsCount: data.comments.length };
          }
          return p;
        }));
        showToast("Professional comment submitted! 💬");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // POST: Save Post
  const handleSave = async (postId: string) => {
    try {
      const res = await fetch(`/api/feed/posts/${postId}/save`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setPosts(prev => prev.map(p => {
          if (p.id === postId) {
            return { ...p, savedByUser: data.savedByUser };
          }
          return p;
        }));
        showToast(data.savedByUser ? "Bookmarked post to saved items 📌" : "Removed bookmark from saved items");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // POST: Repost / Share
  const handleShare = async (postId: string) => {
    try {
      const res = await fetch(`/api/feed/posts/${postId}/share`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setPosts(prev => prev.map(p => {
          if (p.id === postId) {
            return { ...p, sharesCount: data.sharesCount };
          }
          return p;
        }));
        showToast("Reposted activity successfully to your feed!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // POST: Connect request
  const handleConnect = async (authorId: string, authorName: string) => {
    try {
      const res = await fetch(`/api/feed/posts/${authorId}/connect-author`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        showToast(`Sent professional connection match invitation to ${authorName}! 🤝`);
        fetchFeedData(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // POST: Report post
  const handleReport = async (postId: string) => {
    try {
      const res = await fetch(`/api/feed/posts/${postId}/report`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        showToast(data.message, true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // POST: Toggle Following
  const handleFollow = async (authorId: string, authorName: string) => {
    if (!authorId || authorId === "student_ashish") return;

    let type: "student" | "mentor" | "company" = "student";
    if (authorId === "org_gdsc" || authorId.startsWith("comp_")) {
      type = "company";
    } else if (authorId === "mentor_nitin" || authorId.startsWith("mentor_")) {
      type = "mentor";
    }

    try {
      const isNowFollowing = await FollowService.toggleFollow(authorId, type);
      if (isNowFollowing !== null) {
        if (isNowFollowing) {
          setFollowingIds(prev => [...prev, authorId]);
          showToast(`Now following ${authorName} feed updates`);
        } else {
          setFollowingIds(prev => prev.filter(id => id !== authorId));
          showToast(`Unfollowed ${authorName}`);
        }
        // reload feed to apply prioritized following algorithm rankings
        fetchFeedData(true);
      }
    } catch (e) {
      console.error("Error toggling follow from feed UI:", e);
    }
  };

  // Filter out posts depending on selected tab pill
  const filteredPosts = posts.filter(p => {
    if (activeFilter === "all") return true;
    if (activeFilter === "project") {
      return p.type === "ProjectUpdate" || p.type === "project";
    }
    if (activeFilter === "recruitment") {
      return p.type === "TeamRecruitment" || p.type === "recruitment";
    }
    if (activeFilter === "hackathon") {
      return p.type === "HackathonOpportunity" || p.type === "hackathon";
    }
    if (activeFilter === "internship") {
      return p.type === "InternshipOpportunity" || p.type === "internship";
    }
    if (activeFilter === "achievement") {
      return p.type === "AchievementPost" || p.type === "CertificationPost" || p.type === "achievement";
    }
    return true;
  });

  return (
    <div className="space-y-4 max-w-4xl mx-auto px-1 sm:px-4">
      {/* SUCCESS/ALERT NOTIFICATION TOAST BAR */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-4 py-2.5 rounded-xl border flex items-center gap-2 shadow-2xl text-[11px] font-sans antialiased font-semibold animate-in fade-in slide-in-from-top-4 duration-200 ${
          notification.success
            ? "bg-slate-900 border-emerald-500/35 text-emerald-400"
            : "bg-slate-900 border-red-500/35 text-red-400"
        }`}>
          <Sparkle className="w-4 h-4 shrink-0 animate-spin" />
          <span>{notification.text}</span>
        </div>
      )}

      {/* 1. CREATE POST COMPOSER */}
      <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl flex items-center gap-3 shadow-md">
        <img
          src={currentUser?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80"}
          alt="User Profile"
          className="w-10 h-10 rounded-full border border-slate-800 object-cover shrink-0"
          referrerPolicy="no-referrer"
        />
        <button
          onClick={() => setShowCreateComposer(true)}
          className="flex-1 bg-slate-950 hover:bg-slate-850 border border-slate-800 text-left text-xs text-slate-400 px-4 py-3 rounded-full transition-all cursor-pointer font-sans"
        >
          Share your progress, post an achievement or publish a team recruitment pitch...
        </button>
      </div>

      {/* COMPOSER EXPANSIVE MODAL */}
      {showCreateComposer && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden self-center animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center bg-slate-950/60 p-4 border-b border-slate-850">
              <span className="text-xs font-bold font-mono text-indigo-400 flex items-center gap-1.5 uppercase tracking-wide">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" /> Publish your student update
              </span>
              <button
                type="button"
                onClick={() => setShowCreateComposer(false)}
                className="text-xs text-slate-400 hover:text-white font-mono cursor-pointer border border-transparent px-2 py-1 rounded hover:bg-slate-800"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="p-5 space-y-4 text-xs font-sans">
              <div>
                <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1 font-semibold">Post Category</label>
                <select
                  value={newPostType}
                  onChange={(e) => setNewPostType(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white focus:border-indigo-500 font-sans outline-none"
                >
                  <option value="SocialPost">General Campus News</option>
                  <option value="ProjectUpdate">Project Milestone Update</option>
                  <option value="TeamRecruitment">Teammate Recruitment Pitch</option>
                  <option value="AchievementPost">Coding / Hackathon Achievement</option>
                  <option value="CertificationPost">Academic / Cloud Certification</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1 font-semibold">Post Description</label>
                <textarea
                  required
                  rows={4}
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                  placeholder="Review your paragraph details... e.g. 'Thrilled to initiate architectural scoping on our high-frequency compiler ledger! Recruiting react frontend devs.'"
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:border-indigo-500 outline-none resize-none font-sans"
                />
              </div>

              {newPostType === "TeamRecruitment" && (
                <div>
                  <label className="block text-[10px] text-slate-300 font-mono uppercase mb-1 font-semibold">Project Squad Pitch Title</label>
                  <input
                    type="text"
                    required
                    value={newPostProjectTitle}
                    onChange={(e) => setNewPostProjectTitle(e.target.value)}
                    placeholder="e.g. EtherPulse Ledger Analyser"
                    className="w-full bg-slate-950 border border-slate-850 rounded px-3 py-1.5 text-white focus:border-indigo-500 outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1 font-semibold">Required Tags / Stack (commas)</label>
                <input
                  type="text"
                  value={newPostSkills}
                  onChange={(e) => setNewPostSkills(e.target.value)}
                  placeholder="e.g. React, Mongoose, Docker, Solidity"
                  className="w-full bg-slate-950 border border-slate-850 rounded px-3 py-1.5 text-white focus:border-indigo-500 outline-none font-sans"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-550 text-white font-bold rounded-lg transition-all cursor-pointer shadow-md shadow-indigo-600/15"
                >
                  Post to Professional Feed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. FEED FILTERS */}
      <div className="bg-slate-900 border border-slate-850 p-2 rounded-xl flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none flex-1">
          {[
            { id: "all", label: "All Updates" },
            { id: "project", label: "Projects" },
            { id: "recruitment", label: "Squad Recruitment" },
            { id: "hackathon", label: "Hackathons" },
            { id: "internship", label: "Core Internships" },
            { id: "achievement", label: "Achievements & Certificates" }
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => handleFilterClick(filter.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeFilter === filter.id
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-slate-400 hover:text-white hover:bg-slate-850"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        <button
          onClick={() => { setRefreshing(true); fetchFeedData(true); }}
          disabled={refreshing}
          className="p-1 px-1.5 bg-slate-850 border border-slate-800 rounded-lg text-slate-400 hover:text-white hover:border-slate-750 transition-all cursor-pointer flex items-center gap-1 font-mono text-[9px]"
        >
          <RefreshCw className={`w-3 h-3 ${refreshing ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>

      {/* 3. COMMUNITY FEED */}
      {loading ? (
        <LoadingSkeleton type="feed" count={3} />
      ) : filteredPosts.length === 0 ? (
        <div className="bg-slate-900 border border-slate-850 rounded-2xl p-8 text-center space-y-3 shadow">
          <AlertCircle className="w-8 h-8 text-slate-500 mx-auto" />
          <h4 className="font-bold text-white text-xs lowercase font-mono">No matching updates found in feed segment</h4>
          <p className="text-[11px] text-slate-450 leading-relaxed max-w-md mx-auto">
            Try resetting your filters or use the composer above to publish your first professional student highlight.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPosts.map((post, index) => {
            return (
              <React.Fragment key={post.id}>
                <FeedItem
                  post={post}
                  currentUserId={currentUser?.id || "student_ashish"}
                  followingIds={followingIds}
                  onLike={handleLike}
                  onComment={handleComment}
                  onSave={handleSave}
                  onShare={handleShare}
                  onFollow={handleFollow}
                  onConnect={handleConnect}
                  onReport={handleReport}
                  onViewProfile={onViewProfile}
                />
                
                {/* Natural recommendation injections */}
                {index === 1 && (
                  <div className="animate-in fade-in slide-in-from-bottom duration-300">
                    <RecommendationWidget type="projects" />
                  </div>
                )}
                
                {index === 3 && (
                  <div className="animate-in fade-in slide-in-from-bottom duration-300">
                    <RecommendationWidget type="people" />
                  </div>
                )}
                
                {index === 5 && (
                  <div className="animate-in fade-in slide-in-from-bottom duration-300">
                    <RecommendationWidget type="hackathons" />
                  </div>
                )}
              </React.Fragment>
            );
          })}

          {/* 4. INFINITE SCROLL */}
          {lazyLoading && (
            <div className="pt-2 animate-in fade-in duration-300">
              <LoadingSkeleton type="feed" count={1} />
            </div>
          )}

          {hasMore && !lazyLoading && (
            <div className="flex justify-center pt-4 pb-8">
              <button
                type="button"
                onClick={handleLoadMore}
                className="px-6 py-2.5 bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-md hover:scale-[1.02] active:scale-[0.98] font-mono group"
              >
                <RefreshCw className="w-3.5 h-3.5 text-indigo-400 group-hover:rotate-180 transition-transform duration-500" />
                <span>Load More Campus Updates &amp; Squads</span>
              </button>
            </div>
          )}

          {!hasMore && (
            <div className="text-center py-6 text-[10px] text-slate-500 font-mono tracking-wider">
              --- You are fully up-to-date with all campus collaborations ---
            </div>
          )}
        </div>
      )}
    </div>
  );
}
