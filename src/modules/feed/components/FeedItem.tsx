import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  Heart, MessageSquare, Share2, Bookmark, Send, Sparkles, MoreHorizontal,
  Briefcase, Calendar, MapPin, Award, GraduationCap, Users, ShieldAlert,
  Flame, ExternalLink, CheckCircle, PlusCircle, ArrowUpRight, Copy, BookOpen
} from "lucide-react";
import { UserProfileLink } from "../../../shared/components/UserProfileLink";

export interface FeedComment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  time: string;
}

export interface FeedPost {
  id: string;
  userId: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  type: string;
  content: string;
  skills?: string[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  likes: string[];
  saves: string[];
  comments: FeedComment[];
  projectMeta?: {
    id?: string;
    title: string;
    tagline: string;
    description?: string;
    difficulty?: string;
    currentTeamSize?: number;
    teamSizeLimit?: number;
  } | null;
  opportunityMeta?: {
    id?: string;
    title?: string;
    role?: string;
    companyName?: string;
    companyLogo?: string;
    opportunityType?: "hackathon" | "internship" | "mentor" | "startup" | "opensource";
    deadline?: string;
    location?: string;
    starsCount?: number;
    mentorAvailability?: string;
    price?: string;
    githubLink?: string;
    issueTitle?: string;
    description?: string;
  } | null;
  createdAt: string;
  likedByUser: boolean;
  savedByUser: boolean;
  timestamp: string;
}

interface FeedItemProps {
  post: FeedPost;
  currentUserId: string;
  followingIds: string[];
  onLike: (postId: string) => void;
  onComment: (postId: string, text: string) => void;
  onSave: (postId: string) => void;
  onShare: (postId: string) => void;
  onFollow: (authorId: string, authorName: string) => void;
  onConnect: (authorId: string, authorName: string) => void;
  onReport: (postId: string) => void;
  onViewProfile?: (userId: string) => void;
}

export const FeedItem: React.FC<FeedItemProps> = ({
  post,
  currentUserId,
  followingIds,
  onLike,
  onComment,
  onSave,
  onShare,
  onFollow,
  onConnect,
  onReport,
  onViewProfile
}) => {
  const [expandedComments, setExpandedComments] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [showMenu, setShowMenu] = useState(false);
  
  // Custom interactive CTA statuses to make opportunities work on-click
  const [actionStatus, setActionStatus] = useState<{
    booked?: boolean;
    applied?: boolean;
    joined?: boolean;
    registered?: boolean;
    saved?: boolean;
    loading?: boolean;
  }>({});

  const isFollowing = followingIds.includes(post.userId);

  // Type Styling Dict to convey distinct LinkedIn Professional Theme
  const typeMap: Record<string, { label: string; bg: string; text: string; border: string; icon: any }> = {
    SocialPost: { label: "Campus Update", bg: "bg-slate-950/40", text: "text-slate-300", border: "border-slate-800", icon: Sparkles },
    ProjectUpdate: { label: "Project Update", bg: "bg-indigo-950/40", text: "text-indigo-400", border: "border-indigo-500/20", icon: ArrowUpRight },
    TeamRecruitment: { label: "Teammate Needed", bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20", icon: Users },
    HackathonOpportunity: { label: "Hackathon", bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/20", icon: TrophyIcon },
    InternshipOpportunity: { label: "Internship", bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20", icon: Briefcase },
    MentorRecommendation: { label: "Mentorship Open", bg: "bg-sky-500/10", text: "text-sky-450", border: "border-sky-500/20", icon: GraduationCap },
    StartupOpportunity: { label: "Co-Founder Match", bg: "bg-violet-500/10", text: "text-violet-400", border: "border-violet-500/20", icon: Flame },
    OpenSourceOpportunity: { label: "Open Source Issue", bg: "bg-fuchsia-500/10", text: "text-fuchsia-400", border: "border-fuchsia-500/20", icon: GithubIcon },
    AchievementPost: { label: "Achievement", bg: "bg-yellow-500/10", text: "text-yellow-400", border: "border-yellow-500/20", icon: Award },
    CertificationPost: { label: "Certification", bg: "bg-teal-500/10", text: "text-teal-400", border: "border-teal-500/20", icon: BookOpen },
    ConnectionActivity: { label: "Connection Activity", bg: "bg-slate-900 border-slate-750", text: "text-indigo-300", border: "border-indigo-500/20", icon: Users },
    EventAnnouncement: { label: "Tech Event", bg: "bg-orange-500/10", text: "text-orange-400", border: "border-orange-500/20", icon: Calendar },
    AIInsight: { label: "AI Placement Coach", bg: "bg-indigo-950 border-indigo-500/30", text: "text-indigo-300", border: "border-indigo-500/30", icon: Sparkles }
  };

  const currentTypeMeta = typeMap[post.type] || typeMap.SocialPost;
  const BadgeIcon = currentTypeMeta.icon;

  const handleAction = (type: "book" | "apply" | "join" | "register" | "saveJob") => {
    setActionStatus({ loading: true });
    setTimeout(() => {
      if (type === "book") setActionStatus({ booked: true });
      if (type === "apply") setActionStatus({ applied: true });
      if (type === "join") setActionStatus({ joined: true });
      if (type === "register") setActionStatus({ registered: true });
      if (type === "saveJob") setActionStatus({ saved: true });
    }, 700);
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onComment(post.id, commentText);
    setCommentText("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className={`bg-slate-900 border rounded-2xl p-4 md:p-5 text-xs text-slate-100 flex flex-col justify-between gap-3 shadow-md hover:border-slate-800/80 transition-all ${
        isFollowing
          ? "border-indigo-500/35 bg-gradient-to-br from-indigo-950/10 via-slate-900 to-slate-900 shadow-indigo-950/5"
          : "border-slate-850"
      }`}
    >
      {/* HEADER SECTION */}
      <div className="flex justify-between items-start relative">
        <div className="flex gap-3">
          <UserProfileLink userId={post.userId}>
            <img
              src={post.authorAvatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80"}
              alt={post.authorName}
              className="w-10 h-10 rounded-full border border-slate-850 object-cover shrink-0 cursor-pointer hover:opacity-85 transition-opacity"
              referrerPolicy="no-referrer"
            />
          </UserProfileLink>
          <div>
            <div className="flex flex-wrap items-center gap-1.5">
              <UserProfileLink userId={post.userId} className="font-bold text-white text-xs hover:underline cursor-pointer">
                {post.authorName}
              </UserProfileLink>
              
              <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase flex items-center gap-1 ${currentTypeMeta.bg} ${currentTypeMeta.text} ${currentTypeMeta.border} border`}>
                <BadgeIcon className="w-2.5 h-2.5 shrink-0" />
                <span>{currentTypeMeta.label}</span>
              </span>

              {post.userId !== currentUserId && (
                <button
                  type="button"
                  onClick={() => onFollow(post.userId, post.authorName)}
                  className={`px-2 py-0.5 rounded-full font-bold font-sans text-[9px] transition-all cursor-pointer border ${
                    isFollowing
                      ? "bg-slate-950 text-indigo-300 border-indigo-500/20 hover:text-red-400 hover:border-red-500/20"
                      : "bg-indigo-600 text-white border-transparent hover:bg-indigo-500"
                  }`}
                >
                  {isFollowing ? "Following" : "+ Follow"}
                </button>
              )}
            </div>
            
            <span className="text-[10px] text-slate-400 block leading-tight mt-0.5">
              {post.authorRole}
            </span>
            <span className="text-[8.5px] text-slate-500 font-mono block mt-0.5">
              {post.timestamp}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {isFollowing && (
            <span className="flex items-center gap-0.5 text-indigo-400 bg-indigo-950/50 border border-indigo-500/25 px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase select-none">
              <Sparkles className="w-2.5 h-2.5 fill-indigo-400 text-indigo-100" />
              <span>Prioritized</span>
            </span>
          )}
          
          <div className="relative">
            <button 
              onClick={() => setShowMenu(!showMenu)}
              className="text-slate-500 hover:text-white cursor-pointer p-1 rounded hover:bg-slate-850"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-1 bg-slate-950 border border-slate-850 rounded-lg shadow-xl py-1 w-32 z-20">
                <button
                  onClick={() => { onConnect(post.userId, post.authorName); setShowMenu(false); }}
                  className="w-full text-left px-3 py-1.5 text-[10px] text-slate-300 hover:bg-slate-850 hover:text-white transition-all font-sans cursor-pointer"
                >
                  Connect with Author
                </button>
                <button
                  onClick={() => { onReport(post.id); setShowMenu(false); }}
                  className="w-full text-left px-3 py-1.5 text-[10px] text-red-400 hover:bg-red-950/20 hover:text-red-300 transition-all font-sans cursor-pointer"
                >
                  Report Post
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CONTENT PARAGRAPH */}
      <div className="space-y-3 font-sans text-slate-300 text-xs">
        <p className="leading-relaxed whitespace-pre-wrap">{post.content}</p>

        {/* RELATED SKILLS PILLS */}
        {post.skills && post.skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {post.skills.map((s, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 bg-slate-950 border border-slate-850 hover:border-indigo-500/30 rounded text-[9px] font-mono text-indigo-400 font-bold transition-all"
              >
                {s}
              </span>
            ))}
          </div>
        )}

        {/* 1. PROJECT SPECIFIC ATTACHMENTS (Project updates or recruitment threads) */}
        {post.projectMeta && (
          <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl space-y-1 mt-2 hover:border-slate-800 transition-all">
            <span className="text-[8px] font-mono font-bold text-indigo-400 uppercase tracking-widest block">
              Marketplace Reference Project
            </span>
            <h5 className="font-bold text-white text-[11px] leading-tight flex items-center gap-1.5">
              {post.projectMeta.title}
            </h5>
            <p className="text-[10.5px] text-slate-400 leading-snug">
              {post.projectMeta.tagline}
            </p>
            
            <div className="flex flex-wrap justify-between items-center gap-2 pt-2 border-t border-slate-900 mt-2 font-sans">
              <span className="font-mono text-[9px] text-slate-500">
                Difficulty: {post.projectMeta.difficulty || "Intermediate"} • Size: {post.projectMeta.currentTeamSize || 1}/{post.projectMeta.teamSizeLimit || 4}
              </span>
              
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => handleAction("join")}
                  disabled={actionStatus.joined || actionStatus.loading}
                  className={`px-3 py-1 rounded text-[10px] font-bold cursor-pointer transition-all ${
                    actionStatus.joined
                      ? "bg-slate-900 border border-emerald-500/30 text-emerald-400"
                      : "bg-indigo-600 hover:bg-indigo-550 text-white"
                  }`}
                >
                  {actionStatus.joined ? "Application Pending" : "Join Squad"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. SPECIFIC CONTEXT FOR OTHER ACTIONS (Hackathons, Mentorships, Jobs, Startups, Open Source) */}
        {post.opportunityMeta && (
          <div className="p-3.5 bg-slate-950 border border-slate-850 rounded-xl space-y-2 mt-2">
            <div className="flex gap-2 items-start justify-between">
              {post.opportunityMeta.companyLogo && (
                <img
                  src={post.opportunityMeta.companyLogo}
                  alt={post.opportunityMeta.companyName || "Logo"}
                  className="w-8 h-8 rounded border border-slate-850 object-cover shrink-0"
                />
              )}
              <div className="flex-1">
                <h6 className="font-bold text-white text-[11px] leading-tight">
                  {post.opportunityMeta.title || post.opportunityMeta.role || "Professional Opportunity"}
                </h6>
                <span className="text-[10px] text-slate-400 block mt-0.5 leading-none">
                  {post.opportunityMeta.companyName || post.opportunityMeta.companyLogo ? "Collaborated Offer" : "Community Hosted"}
                </span>
              </div>
            </div>

            {/* Render items specifically based on opportunity subtypes */}
            <div className="space-y-1 pt-1 border-t border-slate-900 mt-1 font-sans text-slate-400 text-[10.5px]">
              {post.opportunityMeta.location && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-slate-550 shrink-0" />
                  <span>{post.opportunityMeta.location}</span>
                </div>
              )}
              {post.opportunityMeta.deadline && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-slate-550 shrink-0" />
                  <span>Deadline: {post.opportunityMeta.deadline}</span>
                </div>
              )}
              {post.opportunityMeta.mentorAvailability && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-slate-550 shrink-0" />
                  <span>Available: {post.opportunityMeta.mentorAvailability} (Price: {post.opportunityMeta.price || "Free"})</span>
                </div>
              )}
              {post.opportunityMeta.githubLink && (
                <div className="flex items-center gap-1.5 text-indigo-400 font-mono text-[9px] truncate">
                  <ExternalLink className="w-3 h-3 text-slate-550 shrink-0" />
                  <span>Issue: {post.opportunityMeta.issueTitle || "Kubernetes Beginners Link"}</span>
                </div>
              )}
            </div>

            {/* ACTION TRIGGERS WITH LIVE IMMERSIVE CONFIRMATION BAITS */}
            <div className="flex justify-end pt-2 border-t border-slate-900 mt-1.5">
              {post.opportunityMeta.opportunityType === "hackathon" && (
                <button
                  type="button"
                  onClick={() => handleAction("register")}
                  disabled={actionStatus.registered}
                  className={`px-3 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                    actionStatus.registered
                      ? "bg-slate-900 border border-rose-500/30 text-rose-400"
                      : "bg-rose-600 hover:bg-rose-500 text-white"
                  }`}
                >
                  {actionStatus.registered ? "Registered! ✅" : "Register Team"}
                </button>
              )}

              {post.opportunityMeta.opportunityType === "internship" && (
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleAction("saveJob")}
                    disabled={actionStatus.saved}
                    className="px-2.5 py-1 rounded text-[10px] font-bold border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
                  >
                    {actionStatus.saved ? "Saved" : "Save Job"}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleAction("apply")}
                    disabled={actionStatus.applied}
                    className={`px-3 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                      actionStatus.applied
                        ? "bg-slate-900 border border-emerald-500/30 text-emerald-400"
                        : "bg-emerald-600 hover:bg-emerald-500 text-white"
                    }`}
                  >
                    {actionStatus.applied ? "Applied! 📨" : "Apply Now"}
                  </button>
                </div>
              )}

              {post.opportunityMeta.opportunityType === "mentor" && (
                <button
                  type="button"
                  onClick={() => handleAction("book")}
                  disabled={actionStatus.booked}
                  className={`px-3 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                    actionStatus.booked
                      ? "bg-slate-900 border border-sky-500/30 text-sky-400"
                      : "bg-sky-600 hover:bg-sky-550 text-white"
                  }`}
                >
                  {actionStatus.booked ? "Session Booked! 📅" : "Book Session"}
                </button>
              )}

              {post.opportunityMeta.opportunityType === "startup" && (
                <button
                  type="button"
                  onClick={() => handleAction("join")}
                  disabled={actionStatus.joined}
                  className={`px-3 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                    actionStatus.joined
                      ? "bg-slate-900 border border-indigo-500/20 text-indigo-400"
                      : "bg-indigo-600 hover:bg-indigo-500 text-white"
                  }`}
                >
                  {actionStatus.joined ? "Application Pending" : "Join Startup Match"}
                </button>
              )}

              {post.opportunityMeta.opportunityType === "opensource" && (
                <a
                  href={post.opportunityMeta.githubLink || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1 bg-slate-950 border border-slate-800 hover:border-slate-700 text-white rounded text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-all"
                >
                  <span>Claim Issue</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              )}
            </div>
          </div>
        )}
      </div>

      {/* FOOTER ENGAGEMENT STATISTICS BAR */}
      <div className="flex justify-between items-center border-t border-slate-850 pt-2.5 text-slate-400 font-mono text-[10px]">
        <button
          type="button"
          onClick={() => onLike(post.id)}
          className={`flex items-center gap-1.5 hover:text-red-400 cursor-pointer transition-colors ${
            post.likedByUser ? "text-red-400 font-bold" : ""
          }`}
        >
          <Heart className={`w-3.5 h-3.5 ${post.likedByUser ? "fill-red-400 text-red-500" : ""}`} />
          <span>{post.likesCount} <span className="hidden xs:inline">Likes</span></span>
        </button>

        <button
          type="button"
          onClick={() => setExpandedComments(!expandedComments)}
          className={`flex items-center gap-1.5 hover:text-indigo-400 cursor-pointer transition-colors ${
            expandedComments ? "text-indigo-400 font-bold" : ""
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>{post.comments?.length || post.commentsCount} <span className="hidden xs:inline">Comments</span></span>
        </button>

        <button
          type="button"
          onClick={() => onShare(post.id)}
          className="flex items-center gap-1.5 hover:text-emerald-400 cursor-pointer"
        >
          <Share2 className="w-3.5 h-3.5 shrink-0" />
          <span>{post.sharesCount} <span className="hidden xs:inline">Reposts</span></span>
        </button>

        <button
          type="button"
          onClick={() => onSave(post.id)}
          className={`flex items-center gap-1.5 hover:text-amber-400 cursor-pointer transition-colors ${
            post.savedByUser ? "text-amber-400 font-bold" : ""
          }`}
        >
          <Bookmark className={`w-3.5 h-3.5 ${post.savedByUser ? "fill-amber-400 text-amber-500" : ""}`} />
          <span><span className="hidden xs:inline">{post.savedByUser ? "Saved" : "Save"}</span></span>
        </button>
      </div>

      {/* EXPANDED FEED COMMENTS INLINE TRAY */}
      {expandedComments && (
        <div className="border-t border-slate-850 pt-3 mt-1 space-y-3 bg-slate-950/40 p-3 rounded-xl">
          {post.comments && post.comments.length > 0 && (
            <div className="space-y-2.5 max-h-56 overflow-y-auto scrollbar-none">
              {post.comments.map(c => {
                const commentUserId = c.userId || (c.author === "Rohan Sharma" ? "user_rohan" : c.author === "Sneha Nair" ? "user_sneha" : c.author === "Priya Patel" ? "user_priya" : "student_ashish");
                return (
                  <div key={c.id} className="flex gap-2 text-[11px] leading-relaxed">
                    <img
                      onClick={() => onViewProfile && onViewProfile(commentUserId)}
                      src={c.avatar || "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&h=100&q=80"}
                      alt={c.author}
                      className="w-6 h-6 rounded-full border border-slate-850 object-cover shrink-0 mt-0.5 cursor-pointer hover:opacity-85 transition-opacity"
                      referrerPolicy="no-referrer"
                    />
                    <div className="bg-slate-900 border border-slate-850/60 rounded-xl px-3 py-1.5 flex-1 text-slate-300">
                      <div className="flex justify-between items-center bg-transparent">
                        <strong 
                          onClick={() => onViewProfile && onViewProfile(commentUserId)}
                          className="text-white font-bold cursor-pointer hover:underline"
                        >
                          {c.author}
                        </strong>
                        <span className="text-[8px] text-slate-500 font-mono">{c.time}</span>
                      </div>
                      <p className="mt-0.5 font-sans break-words text-slate-400">{c.text}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Add reply Form */}
          <form onSubmit={handleCommentSubmit} className="flex items-center gap-2 pt-1 border-t border-slate-900">
            <input
              type="text"
              required
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Post a professional comment..."
              className="flex-1 bg-slate-950 border border-slate-800 text-slate-100 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
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
    </motion.div>
  );
};

// Dummy icons to compile easily with TypeScript
const TrophyIcon = (props: any) => <Award {...props} />;
const GithubIcon = (props: any) => <Users {...props} />;
