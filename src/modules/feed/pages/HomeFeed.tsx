/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Heart, MessageSquare, Share2, Bookmark, Send, Sparkles, 
  Image, Video, Link2, MoreHorizontal, MessageCircle, AlertCircle,
  Trophy, BadgeAlert, Laptop, Briefcase, PlusCircle, CheckCircle, Flame,
  UserPlus, UserMinus, UserCheck, Star
} from "lucide-react";
import LoadingSkeleton from "../../../shared/components/LoadingSkeleton";
import { FollowService } from "../../../services/followService";

export interface FeedPost {
  id: string;
  authorId?: string;
  type: "project" | "recruitment" | "internship" | "hackathon" | "achievement" | "general";
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  timestamp: string;
  content: string;
  skills?: string[];
  likesCount: number;
  comments: { id: string; author: string; avatar: string; text: string; time: string }[];
  likedByUser: boolean;
  savedByUser: boolean;
  projectMeta?: {
    id?: string;
    title: string;
    tagline: string;
    teamSizeLimit?: number;
    currentTeamSize?: number;
    difficulty?: string;
  };
}

export default function HomeFeed() {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [newPostText, setNewPostText] = useState("");
  const [newPostType, setNewPostType] = useState<FeedPost["type"]>("general");
  const [newPostProjectTitle, setNewPostProjectTitle] = useState("");
  const [newPostSkills, setNewPostSkills] = useState("");
  const [showCreateComposer, setShowCreateComposer] = useState(false);
  const [shareToastId, setShareToastId] = useState<string | null>(null);
  
  // Expanded comments section state
  const [expandedCommentsPostId, setExpandedCommentsPostId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<{ [postId: string]: string }>({});

  const [followingIds, setFollowingIds] = useState<string[]>([]);

  useEffect(() => {
    const loadFollowing = async () => {
      try {
        const backendFollows = await FollowService.getFollowing();
        setFollowingIds(backendFollows.map(f => f.followingId));
      } catch (e) {
        console.error("Error setting follow states in HomeFeed:", e);
      }
    };
    loadFollowing();
  }, []);

  // Seed default feed posts
  useEffect(() => {
    setLoading(true);
    const defaultPosts: FeedPost[] = [
      {
        id: "post_1",
        authorId: "student_ashish",
        type: "recruitment",
        authorName: "Ashish Ghadigaonkar",
        authorRole: "Fullstack Lead Developer",
        authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
        timestamp: "2 hours ago",
        content: "Drafting the core microservice framework for our Solidity portfolio tracker! We need an ML Expert / Python wizard to integrate deep neural models for crypto price trend validation. Apply via Projects marketplace!",
        skills: ["Solidity", "Python", "PyTorch", "gRPC"],
        likesCount: 14,
        likedByUser: false,
        savedByUser: false,
        comments: [
          { id: "c1", author: "Pranav Shah", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80", text: "This architecture is extremely clean. Messaging you on direct chats!", time: "1 hour ago" }
        ],
        projectMeta: {
          title: "EtherPulse Tracker",
          tagline: "High-frequency Solidity ledger analyzer with real-time portfolio scorecards",
          teamSizeLimit: 4,
          currentTeamSize: 2,
          difficulty: "Advanced"
        }
      },
      {
        id: "post_2",
        authorId: "org_gdsc",
        type: "hackathon",
        authorName: "Google GDSC Tech Team",
        authorRole: "Official Campus Organizer",
        authorAvatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&h=150&q=80",
        timestamp: "5 hours ago",
        content: "🚨 NEXT GENERATION GENAI HACKATHON IS NOW LIVE! Register your teams in the Hackathons portal. Over $15K in prize pool, fast-track interviews with Google engineers, and a custom Gemini Developer badge for all verified submissions.",
        skills: ["Gemini API", "FastAPI", "React", "Next.js"],
        likesCount: 52,
        likedByUser: false,
        savedByUser: true,
        comments: [
          { id: "c2", author: "Juhi Chawla", avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&h=100&q=80", text: "Registration completed! Let's build something phenomenal.", time: "4 hours ago" }
        ],
        projectMeta: {
          title: "AI Studio Hackathon 2026",
          tagline: "Build native Android & Web apps with Gemini Multimodal Models",
          difficulty: "Intermediate"
        }
      },
      {
        id: "post_3",
        authorId: "student_sneha",
        type: "achievement",
        authorName: "Sneha Kapadia",
        authorRole: "Lead Product Designer",
        authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80",
        timestamp: "1 day ago",
        content: "Thrilled to announce that our team just took 1st place at the National Fintech Challenge! Big thanks to my co-collaborators Rohan Sharma and Priya Patel. We merged 42 pull requests, designed a seamless bento UX grid, and successfully pitched to 12 angel VCs! 🏆 Hard work pays off.",
        likesCount: 89,
        likedByUser: true,
        savedByUser: false,
        comments: [
          { id: "c3", author: "Ayesha Qureshi", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100&q=80", text: "Outstanding design specs! The Figma blueprint tab you built is incredible.", time: "18 mins ago" }
        ]
      },
      {
        id: "post_4",
        authorId: "mentor_nitin",
        type: "internship",
        authorName: "Nitin Kamath",
        authorRole: "VP of Engineering at CloudSecure",
        authorAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80",
        timestamp: "2 days ago",
        content: "We're hiring 3 Cloud DevOps Interns at CloudSecure! If you have hands-on familiarity with Kubernetes clusters, AWS S3 buckets, and bash scripting, apply today. We care strictly about your active GitHub project milestones, not college name plates.",
        skills: ["Kubernetes", "AWS Cloud", "Linux Bash", "GitHub Actions"],
        likesCount: 41,
        likedByUser: false,
        savedByUser: false,
        comments: [],
        projectMeta: {
          title: "Kubernetes Cloud Integration",
          tagline: "Auto-scalable infrastructure setup for multi-tenant microservices",
          difficulty: "Advanced"
        }
      }
    ];

    const timer = setTimeout(() => {
      // Load from local storage if available for instant state
      const cached = localStorage.getItem("skillcollab_social_feed");
      if (cached) {
        try {
          setPosts(JSON.parse(cached));
        } catch (e) {
          setPosts(defaultPosts);
        }
      } else {
        setPosts(defaultPosts);
      }
      setLoading(false);
    }, 750);

    return () => clearTimeout(timer);
  }, []);

  const savePosts = (updatedList: FeedPost[]) => {
    setPosts(updatedList);
    localStorage.setItem("skillcollab_social_feed", JSON.stringify(updatedList));
  };

  const handleLike = (postId: string) => {
    const updated = posts.map(p => {
      if (p.id === postId) {
        const liked = !p.likedByUser;
        return {
          ...p,
          likedByUser: liked,
          likesCount: liked ? p.likesCount + 1 : p.likesCount - 1
        };
      }
      return p;
    });
    savePosts(updated);
  };

  const handleSaveToggle = (postId: string) => {
    const updated = posts.map(p => {
      if (p.id === postId) {
        return { ...p, savedByUser: !p.savedByUser };
      }
      return p;
    });
    savePosts(updated);
  };

  const handleShare = (postId: string) => {
    setShareToastId(postId);
    navigator.clipboard.writeText(`https://skillcollab.edu/posts/${postId}`);
    setTimeout(() => {
      setShareToastId(null);
    }, 2500);
  };

  const handleAddComment = (postId: string, e: React.FormEvent) => {
    e.preventDefault();
    const commentText = commentInputs[postId]?.trim();
    if (!commentText) return;

    const newComment = {
      id: "comment_" + Date.now(),
      author: "Ashish Ghadigaonkar",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
      text: commentText,
      time: "Just now"
    };

    const updated = posts.map(p => {
      if (p.id === postId) {
        return { ...p, comments: [...p.comments, newComment] };
      }
      return p;
    });

    savePosts(updated);
    setCommentInputs({ ...commentInputs, [postId]: "" });
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim()) return;

    const parsedSkills = newPostSkills
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);

    const newlyCreatedPost: FeedPost = {
      id: "post_" + Date.now(),
      type: newPostType,
      authorName: "Ashish Ghadigaonkar",
      authorRole: "Student • Web Specialist",
      authorAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
      timestamp: "Just now",
      content: newPostText,
      skills: parsedSkills.length > 0 ? parsedSkills : undefined,
      likesCount: 0,
      likedByUser: false,
      savedByUser: false,
      comments: [],
      projectMeta: newPostProjectTitle ? {
        title: newPostProjectTitle,
        tagline: "Active student pitch hosted on SkillCollab Marketplace",
        difficulty: "Intermediate",
        currentTeamSize: 1,
        teamSizeLimit: 4
      } : undefined
    };

    savePosts([newlyCreatedPost, ...posts]);
    setNewPostText("");
    setNewPostProjectTitle("");
    setNewPostSkills("");
    setShowCreateComposer(false);
  };

  const handleToggleFeedFollow = async (authorId: string, authorName: string) => {
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
        } else {
          setFollowingIds(prev => prev.filter(id => id !== authorId));
        }
      }
    } catch (e) {
      console.error("Error toggling follow from feed UI:", e);
    }
  };

  const filteredPosts = posts.filter(p => {
    if (activeFilter === "all") return true;
    return p.type === activeFilter;
  });

  const sortedAndPrioritizedPosts = [...filteredPosts].sort((a, b) => {
    const aId = a.authorId || "";
    const bId = b.authorId || "";
    const aFollowed = aId ? followingIds.includes(aId) : false;
    const bFollowed = bId ? followingIds.includes(bId) : false;

    if (aFollowed && !bFollowed) return -1;
    if (!aFollowed && bFollowed) return 1;
    return 0;
  });

  return (
    <div className="space-y-4">
      {/* Feed Filters Segment (Sleek pill options on reach heights) */}
      <div className="bg-slate-900 border border-slate-850 p-2 rounded-xl flex items-center gap-1.5 overflow-x-auto scrollbar-none">
        {[
          { id: "all", label: "All Posts" },
          { id: "project", label: "Projects" },
          { id: "recruitment", label: "Recruitment" },
          { id: "hackathon", label: "Hackathons" },
          { id: "internship", label: "Internships" },
          { id: "achievement", label: "Achievements" }
        ].map(filter => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
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

      {/* COMPOSER BUTTON TRIGGER */}
      <div className="bg-slate-900 border border-slate-850 p-4 rounded-xl flex items-center gap-3">
        <img
          src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80"
          alt="avatar"
          className="w-10 h-10 rounded-full border border-slate-800 object-cover"
          referrerPolicy="no-referrer"
        />
        <button
          onClick={() => setShowCreateComposer(true)}
          className="flex-1 bg-slate-950 hover:bg-slate-850 border border-slate-800 text-left text-xs text-slate-400 px-4 py-3 rounded-full transition-all cursor-pointer"
        >
          Share a project update, host a recruitment pitch or post an achievement...
        </button>
      </div>

      {/* COMPOSER EXPANSIVE MODAL */}
      {showCreateComposer && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden self-center animate-in zoom-in-95 duration-150">
            <div className="flex justify-between items-center bg-slate-950/60 p-4 border-b border-slate-850">
              <span className="text-xs font-bold font-mono text-indigo-400 flex items-center gap-1.5 uppercase">
                <Sparkles className="w-4 h-4 text-amber-400" /> Share your student story
              </span>
              <button
                type="button"
                onClick={() => setShowCreateComposer(false)}
                className="text-xs text-slate-400 hover:text-white font-mono cursor-pointer"
              >
                Cancel
              </button>
            </div>

            <form onSubmit={handleCreatePost} className="p-5 space-y-4 text-xs font-sans">
              <div>
                <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Post Theme</label>
                <select
                  value={newPostType}
                  onChange={(e) => setNewPostType(e.target.value as FeedPost["type"])}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white focus:border-indigo-500 font-sans outline-none"
                >
                  <option value="general">General Campus Update</option>
                  <option value="project">Project Progress Milestone</option>
                  <option value="recruitment">University Teammate Recruitment</option>
                  <option value="achievement">Academic / Coding Achievement</option>
                  <option value="internship">Internship / Job Listing</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1 font-semibold">Post Content description</label>
                <textarea
                  required
                  rows={4}
                  value={newPostText}
                  onChange={(e) => setNewPostText(e.target.value)}
                  placeholder="Draft your paragraph details... e.g. 'We just kicked off development on our peer-to-peer tutoring board.'"
                  className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white focus:border-indigo-500 outline-none resize-none"
                />
              </div>

              {newPostType === "recruitment" && (
                <div>
                  <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1 text-slate-300">Project / Squad Pitch Title</label>
                  <input
                    type="text"
                    value={newPostProjectTitle}
                    onChange={(e) => setNewPostProjectTitle(e.target.value)}
                    placeholder="e.g. MetaVerse Campus Maps"
                    className="w-full bg-slate-950 border border-slate-850 rounded px-3 py-1.5 text-white focus:border-indigo-500 outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Required Tags / Stack (commas)</label>
                <input
                  type="text"
                  value={newPostSkills}
                  onChange={(e) => setNewPostSkills(e.target.value)}
                  placeholder="e.g. Next.js, Redux, PostgreSQL"
                  className="w-full bg-slate-950 border border-slate-850 rounded px-3 py-1.5 text-white focus:border-indigo-500 outline-none"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-550 text-white font-bold rounded-lg transition-all cursor-pointer shadow-md shadow-indigo-600/15"
                >
                  Post to SkillCollab Feed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FEED TIMELINE ITEMS */}
      {loading ? (
        <LoadingSkeleton type="feed" count={3} />
      ) : (
        <div className="space-y-4">
          {sortedAndPrioritizedPosts.map(post => {
            const isCommentsExpanded = expandedCommentsPostId === post.id;
            return (
              <div
                key={post.id}
                className={`bg-slate-900 border rounded-2xl p-4 md:p-5 text-xs text-slate-100 flex flex-col justify-between gap-3 shadow-md hover:border-slate-800/80 transition-all ${
                  post.authorId && followingIds.includes(post.authorId)
                    ? "border-indigo-500/40 bg-gradient-to-br from-indigo-950/10 via-slate-900 to-slate-900 shadow-indigo-950/10"
                    : "border-slate-850"
                }`}
              >
                {/* TOP HEADER */}
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <img
                      src={post.authorAvatar}
                      alt={post.authorName}
                      className="w-10 h-10 rounded-full border border-slate-800 object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <div>
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="font-bold text-white text-xs hover:underline cursor-pointer">{post.authorName}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase ${
                          post.type === "recruitment"
                            ? "bg-amber-500/12 border border-amber-500/20 text-amber-400"
                            : post.type === "hackathon"
                            ? "bg-red-500/12 border border-red-500/20 text-red-400"
                            : post.type === "achievement"
                            ? "bg-emerald-500/12 border border-emerald-500/20 text-emerald-400"
                            : post.type === "internship"
                            ? "bg-indigo-500/12 border border-indigo-500/20 text-indigo-400"
                            : "bg-slate-800 text-slate-300"
                        }`}>
                          {post.type}
                        </span>
                        {post.authorId && post.authorId !== "student_ashish" && (
                          <button
                            onClick={() => handleToggleFeedFollow(post.authorId!, post.authorName)}
                            className={`px-2 py-0.5 rounded-full font-bold font-sans text-[9px] transition-all cursor-pointer flex items-center gap-0.5 border ${
                              followingIds.includes(post.authorId)
                                ? "bg-slate-950 text-indigo-300 border-indigo-500/20 hover:bg-red-950/20 hover:text-red-400 hover:border-red-500/20"
                                : "bg-indigo-600 text-white border-transparent hover:bg-indigo-500"
                            }`}
                          >
                            {followingIds.includes(post.authorId) ? (
                              <>
                                <UserCheck className="w-2.5 h-2.5" />
                                <span>Following</span>
                              </>
                            ) : (
                              <>
                                <UserPlus className="w-2.5 h-2.5" />
                                <span>Follow</span>
                              </>
                            )}
                          </button>
                        )}
                      </div>
                      <span className="text-[10px] text-slate-450 block leading-tight">{post.authorRole}</span>
                      <span className="text-[9px] text-slate-500 font-mono block mt-0.5">{post.timestamp}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {post.authorId && followingIds.includes(post.authorId) && (
                      <span className="flex items-center gap-0.5 text-indigo-400 bg-indigo-950/50 border border-indigo-500/20 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase select-none">
                        <Star className="w-2.5 h-2.5 fill-indigo-400 text-indigo-400" />
                        <span>Prioritized</span>
                      </span>
                    )}
                    <button className="text-slate-500 hover:text-white cursor-pointer p-1">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* POST BODY */}
                <div className="space-y-3 font-sans text-slate-300 text-xs">
                  <p className="leading-relaxed whitespace-pre-wrap">{post.content}</p>

                  {/* SKILLS CONTAINER */}
                  {post.skills && post.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {post.skills.map((s, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 bg-slate-950 border border-slate-850 rounded text-[9px] font-mono text-indigo-400 font-bold"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* PROJECT ATTACHMENTS FOR SOCIAL TIMELINES */}
                  {post.projectMeta && (
                    <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl space-y-1 mt-2">
                      <span className="text-[8px] font-mono font-bold text-indigo-400 uppercase tracking-widest block">
                        Marketplace Reference Pitch
                      </span>
                      <h5 className="font-bold text-white text-[11px] leading-tight flex items-center gap-1.5">
                        {post.projectMeta.title}
                      </h5>
                      <p className="text-[10.5px] text-slate-400 leading-snug">{post.projectMeta.tagline}</p>
                      {post.projectMeta.difficulty && (
                        <div className="flex items-center gap-2 pt-1 font-mono text-[9px] text-slate-450">
                          <span>Difficulty: {post.projectMeta.difficulty}</span>
                          {post.projectMeta.teamSizeLimit && (
                            <span>• Roster: {post.projectMeta.currentTeamSize}/{post.projectMeta.teamSizeLimit}</span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* FEEDBACK BUTTON BAR */}
                <div className="flex justify-between items-center border-t border-slate-850 pt-3 text-slate-400 font-mono text-[10px]">
                  <button
                    onClick={() => handleLike(post.id)}
                    className={`flex items-center gap-1.5 hover:text-red-400 cursor-pointer transition-colors ${
                      post.likedByUser ? "text-red-400 font-bold" : ""
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${post.likedByUser ? "fill-red-400 text-red-0" : ""}`} />
                    <span>{post.likesCount} <span className="hidden xs:inline">Likes</span></span>
                  </button>

                  <button
                    onClick={() => setExpandedCommentsPostId(isCommentsExpanded ? null : post.id)}
                    className={`flex items-center gap-1.5 hover:text-indigo-400 cursor-pointer transition-colors ${
                      isCommentsExpanded ? "text-indigo-400 font-bold" : ""
                    }`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{post.comments.length} <span className="hidden xs:inline">Comments</span></span>
                  </button>

                  <button
                    onClick={() => handleShare(post.id)}
                    className="flex items-center gap-1.5 hover:text-emerald-400 cursor-pointer relative"
                  >
                    <Share2 className="w-4 h-4" />
                    <span><span className="hidden xs:inline">Share</span></span>
                    {shareToastId === post.id && (
                      <span className="absolute bottom-6 right-0 bg-emerald-600 text-white font-sans text-[8px] font-bold px-1.5 py-0.5 rounded shadow whitespace-nowrap animate-bounce z-10">
                        Link Copied!
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => handleSaveToggle(post.id)}
                    className={`flex items-center gap-1.5 hover:text-amber-400 cursor-pointer transition-colors ${
                      post.savedByUser ? "text-amber-400 font-bold" : ""
                    }`}
                  >
                    <Bookmark className={`w-4 h-4 ${post.savedByUser ? "fill-amber-400 text-amber-0" : ""}`} />
                    <span><span className="hidden xs:inline">{post.savedByUser ? "Saved" : "Save"}</span></span>
                  </button>
                </div>

                {/* COLLAPSIBLE COMMENTS TRAY */}
                {isCommentsExpanded && (
                  <div className="border-t border-slate-850 pt-3 mt-1 space-y-3 bg-slate-950/40 p-3 rounded-xl">
                    {/* List of comments */}
                    {post.comments.length > 0 && (
                      <div className="space-y-2.5">
                        {post.comments.map(c => (
                          <div key={c.id} className="flex gap-2 text-[11px] leading-relaxed">
                            <img
                              src={c.avatar}
                              alt={c.author}
                              className="w-6 h-6 rounded-full border border-slate-800 object-cover shrink-0 mt-0.5"
                              referrerPolicy="no-referrer"
                            />
                            <div className="bg-slate-900 border border-slate-850 rounded-xl px-3 py-1.5 flex-1 text-slate-300">
                              <div className="flex justify-between items-center">
                                <strong className="text-white font-bold">{c.author}</strong>
                                <span className="text-[8px] text-slate-500 font-mono">{c.time}</span>
                              </div>
                              <p className="mt-0.5 font-sans break-words">{c.text}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Comment Input tool */}
                    <form onSubmit={(e) => handleAddComment(post.id, e)} className="flex items-center gap-2">
                      <input
                        type="text"
                        required
                        value={commentInputs[post.id] || ""}
                        onChange={(e) => setCommentInputs({ ...commentInputs, [post.id]: e.target.value })}
                        placeholder="Post a reply..."
                        className="flex-1 bg-slate-900 border border-slate-800 text-slate-100 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                      />
                      <button
                        type="submit"
                        className="p-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg cursor-pointer transition-colors"
                      >
                        <Send className="w-3.5 h-3.5 text-white" />
                      </button>
                    </form>
                  </div>
                )}

              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
