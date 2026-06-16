/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Users, UserPlus, Heart, MessageSquare, Share2, Briefcase, Building, Landmark, 
  Award, ThumbsUp, FileText, Mail, Radio, BarChart3, Image, Video, Eye, Globe, 
  Sparkles, Zap, Flame, Calendar, MapPin, Search, ChevronRight, CheckCircle, 
  Bookmark, Plus, X, ArrowUpRight, Send, Filter, Settings, ShieldCheck, Check, Info
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { FollowService } from "../../../services/followService";
import { 
  UserRole, ProfessionalConnection, CompanyPage, OrganizationPage, 
  SkillEndorsement, LinkedInRecommendation, ContentArticle, Newsletter, 
  EventItem, ExtendedJobItem, AlumniRecord, ProfileViewLog, RecruiterCandidatePipeline, 
  StreakTracker 
} from "../../../types";

// Phase 4 Modular Component Imports
import { ConnectionsPanel } from "../components/ConnectionsPanel";
import { FollowersPanel } from "../components/FollowersPanel";
import { FollowingPanel } from "../components/FollowingPanel";
import { RecommendationsPanel } from "../components/RecommendationsPanel";
import { NetworkAnalytics } from "../components/NetworkAnalytics";

interface ProfessionalNetworkSuiteProps {
  currentUser: any;
  onUpdateCurrentUser: (updated: any) => void;
}

export default function ProfessionalNetworkSuite({ currentUser, onUpdateCurrentUser }: ProfessionalNetworkSuiteProps) {
  const [activeSubTab, setActiveSubTab] = useState<string>("network");

  // LOCAL / DEMO STATES FOR DUAL-ENGINE OPERATION
  const [connections, setConnections] = useState<ProfessionalConnection[]>([]);
  const [followers, setFollowers] = useState<string[]>([]);
  const [following, setFollowing] = useState<string[]>([]);
  const [endorsements, setEndorsements] = useState<SkillEndorsement[]>([]);
  const [recommendations, setRecommendations] = useState<LinkedInRecommendation[]>([]);
  const [articles, setArticles] = useState<ContentArticle[]>([]);
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [extJobs, setExtJobs] = useState<ExtendedJobItem[]>([]);
  const [alumni, setAlumni] = useState<AlumniRecord[]>([]);
  const [profileViews, setProfileViews] = useState<ProfileViewLog[]>([]);
  const [candidatePipelines, setCandidatePipelines] = useState<RecruiterCandidatePipeline[]>([]);
  const [companies, setCompanies] = useState<CompanyPage[]>([]);
  const [organizations, setOrganizations] = useState<OrganizationPage[]>([]);

  // AI-ASSISTANT STATES
  const [aiPostPrompt, setAiPostPrompt] = useState("");
  const [aiPostResult, setAiPostResult] = useState("");
  const [aiOptimizing, setAiOptimizing] = useState(false);
  const [aiOptimizationResult, setAiOptimizationResult] = useState("");
  const [skillGapAnalysis, setSkillGapAnalysis] = useState<{ gap: string[]; suggestions: string[] } | null>(null);

  // VIRAL LOOPS & MONETIZATION
  const [streak, setStreak] = useState<StreakTracker>({ streak: 5, lastActive: "2026-06-12" });
  const [premiumActive, setPremiumActive] = useState(false);
  const [aiCredits, setAiCredits] = useState(50);
  const [customUrl, setCustomUrl] = useState("ashish-ghadigaonkar");
  const [referrals, setReferrals] = useState<string[]>(["amit-sharma@college.edu"]);

  // CREATOR FORM STATE
  const [newArticleTitle, setNewArticleTitle] = useState("");
  const [newArticleSummary, setNewArticleSummary] = useState("");
  const [newArticleBody, setNewArticleBody] = useState("");
  const [articleSuccessMsg, setArticleSuccessMsg] = useState("");

  // NEWSLETTER STATE
  const [nlTitle, setNlTitle] = useState("");
  const [nlFreq, setNlFreq] = useState<"Weekly" | "Monthly">("Weekly");
  const [nlDesc, setNlDesc] = useState("");

  // RECOMMENDATION FORM STATE
  const [recTargetName, setRecTargetName] = useState("");
  const [recText, setRecText] = useState("");
  const [recSuccessMsg, setRecSuccessMsg] = useState("");

  // NEW MESSAGING STATE (IMPROVEMENT OVER COREG REGS)
  const [messagesList, setMessagesList] = useState<{ id: string; sender: string; content: string; reaction?: string; replies?: string[] }[]>([
    { id: "m_1", sender: "Priya Patel", content: "Great work on that smart campus tracker! Would love to connect about co-authoring an article for GDSC." },
    { id: "m_2", sender: "Vijay Kumar (Alumni)", content: "Hey! Just saw your GitHub highlight of the server routing setup. Send over your resume, my startup is hiring in Bangalore." }
  ]);
  const [newMessageText, setNewMessageText] = useState("");

  // RECRUITER SEARCH
  const [recSearchQuery, setRecSearchQuery] = useState("");
  const [pipelineFilter, setPipelineFilter] = useState("Sourcing");

  // SEED STATIC DEMO DATA FOR OFFLINE / INSTANT LOADING
  useEffect(() => {
    // Check local caches
    const cachedConn = localStorage.getItem("sc_professional_connections");
    const cachedArticles = localStorage.getItem("sc_professional_articles");
    const cachedEvents = localStorage.getItem("sc_professional_events");
    const cachedJobs = localStorage.getItem("sc_professional_extjobs");
    const cachedAlumni = localStorage.getItem("sc_professional_alumni");
    const cachedViews = localStorage.getItem("sc_professional_profileviews");
    const cachedNl = localStorage.getItem("sc_professional_newsletters");
    const cachedFoll = localStorage.getItem("sc_professional_following");
    const cachedEndo = localStorage.getItem("sc_professional_endorsements");
    const cachedRec = localStorage.getItem("sc_professional_recommendations");

    if (cachedConn) setConnections(JSON.parse(cachedConn));
    else {
      const initialConns: ProfessionalConnection[] = [
        {
          id: "conn_1",
          senderId: "user_piyush",
          senderName: "Piyush Mehta",
          senderAvatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&h=100&q=80",
          senderHeadline: "Final Year CS | System Lead",
          receiverId: currentUser?.id || "student_ashish",
          receiverName: currentUser?.fullName || "Ashish Ghadigaonkar",
          receiverAvatar: currentUser?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
          receiverHeadline: currentUser?.headline || "Full-Stack Engineer",
          status: "Pending",
          createdAt: "2026-06-12"
        },
        {
          id: "conn_2",
          senderId: currentUser?.id || "student_ashish",
          senderName: currentUser?.fullName || "Ashish Ghadigaonkar",
          senderAvatar: currentUser?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
          senderHeadline: currentUser?.headline || "Full-Stack Engineer",
          receiverId: "user_arnav",
          receiverName: "Arnav Gupta",
          receiverAvatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=100&h=100&q=80",
          receiverHeadline: "Startup Architect | Ex-Flipkart",
          status: "Accepted",
          createdAt: "2026-06-08"
        }
      ];
      setConnections(initialConns);
      localStorage.setItem("sc_professional_connections", JSON.stringify(initialConns));
    }

    if (cachedFoll) setFollowing(JSON.parse(cachedFoll));
    else setFollowing(["comp_microsoft", "mentor_kartik", "org_gdsc"]);

    const syncFollowingState = async () => {
      try {
        const backendFollows = await FollowService.getFollowing();
        if (backendFollows && backendFollows.length > 0) {
          const ids = backendFollows.map(f => f.followingId);
          setFollowing(prev => Array.from(new Set([...prev, ...ids])));
        }
      } catch (e) {
        console.warn("Follow state sync bypassed:", e);
      }
    };
    syncFollowingState();

    if (cachedEndo) setEndorsements(JSON.parse(cachedEndo));
    else {
      const defaultEndo: SkillEndorsement[] = [
        { id: "endo_1", skillName: "TypeScript", endorsedUserId: currentUser?.id || "student_ashish", endorserId: "mentor_kartik", endorserName: "Kartik Singhal", endorserRole: "Staff Engineer @ Google", createdAt: "2026-06-10" },
        { id: "endo_2", skillName: "React.js", endorsedUserId: currentUser?.id || "student_ashish", endorserId: "user_arnav", endorserName: "Arnav Gupta", endorserRole: "Co-Founder", createdAt: "2026-06-11" }
      ];
      setEndorsements(defaultEndo);
      localStorage.setItem("sc_professional_endorsements", JSON.stringify(defaultEndo));
    }

    if (cachedRec) setRecommendations(JSON.parse(cachedRec));
    else {
      const defaultRecs: LinkedInRecommendation[] = [
        { id: "rec_1", receiverId: currentUser?.id || "student_ashish", senderId: "mentor_kartik", senderName: "Kartik Singhal", senderAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100&q=80", senderRole: "Google Staff Engineer", text: "Ashish is an outstanding full-stack talent. During our hackathon sprint, he designed a decoupled proxy route cluster in minutes. Highly recommended!", status: "Approved", createdAt: "2026-06-05" }
      ];
      setRecommendations(defaultRecs);
      localStorage.setItem("sc_professional_recommendations", JSON.stringify(defaultRecs));
    }

    if (cachedArticles) setArticles(JSON.parse(cachedArticles));
    else {
      const defaultArticles: ContentArticle[] = [
        { id: "art_1", authorId: currentUser?.id || "student_ashish", authorName: currentUser?.fullName || "Ashish Ghadigaonkar", authorAvatar: currentUser?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80", title: "Decoding the 120ms Latency Mock Pipeline in Node.js", summary: "How we decoupled our database queries and structured in-memory caches to secure outstanding system responsiveness.", content: "A deep dive writeup concerning robust full stack architecture optimization...", views: 247, likes: 45, shares: 12, status: "Published", createdAt: "2026-06-11" }
      ];
      setArticles(defaultArticles);
      localStorage.setItem("sc_professional_articles", JSON.stringify(defaultArticles));
    }

    if (cachedNl) setNewsletters(JSON.parse(cachedNl));
    else {
      const defaultNl: Newsletter[] = [
        { id: "nl_1", title: "Campus Devs Digest", frequency: "Weekly", description: "Collegiate tech stacks, verified startup projects, and top collegiate careers digests.", subscribersCount: 184, authorId: currentUser?.id || "student_ashish", authorName: currentUser?.fullName || "Ashish G.", archive: [{ title: "Edition 1: Securing High-Volume Hackathons", sendDate: "2026-06-01", content: "Newsletter content here..." }] }
      ];
      setNewsletters(defaultNl);
      localStorage.setItem("sc_professional_newsletters", JSON.stringify(defaultNl));
    }

    if (cachedEvents) setEvents(JSON.parse(cachedEvents));
    else {
      const defaultEvents: EventItem[] = [
        { id: "evt_1", title: "Cracking System Design with Staff Engineer Kartik", organizerName: "GDSC Chapter North Campus", type: "Online Webinar", date: "2026-06-18", time: "6:00 PM - 7:30 PM", linkOrLocation: "Google Meet (Premium Match Link)", attendeesCount: 89, isRegistered: false },
        { id: "evt_2", title: "Local Startup Matchmaking & Tea Meetup", organizerName: "Invention Club Campus", type: "Matchmaking Meetup", date: "2026-06-25", time: "2:00 PM", linkOrLocation: "Campus Central Amphitheatre", attendeesCount: 42, isRegistered: true }
      ];
      setEvents(defaultEvents);
      localStorage.setItem("sc_professional_events", JSON.stringify(defaultEvents));
    }

    if (cachedJobs) setExtJobs(JSON.parse(cachedJobs));
    else {
      const defaultJobs: ExtendedJobItem[] = [
        { id: "job_ex1", title: "Staff Backend Engineer (Full-Time)", companyName: "Hyperion SaaS Inc.", type: "Full-Time", stipendOrSalary: "$90,000 - $120,000 / Yr", skills: ["TypeScript", "Node.js", "MongoDB", "gRPC"], description: "Join our rapid-deployment core crew and scale college-professional solutions.", applyBy: "2026-07-15", applicantsCount: 14 },
        { id: "job_ex2", title: "Startup Full-Stack Generalist (Part-Time)", companyName: "Antigravity Labs", type: "Part-Time", stipendOrSalary: "$35 - $50 / Hr", skills: ["React", "Express", "Tailwind CSS"], description: "Help us prototype full-stack interactive client layouts and canvas models.", applyBy: "2026-06-30", applicantsCount: 8 }
      ];
      setExtJobs(defaultJobs);
      localStorage.setItem("sc_professional_extjobs", JSON.stringify(defaultJobs));
    }

    if (cachedAlumni) setAlumni(JSON.parse(cachedAlumni));
    else {
      const defaultAlumni: AlumniRecord[] = [
        { id: "alum_1", name: "Siddharth Roy", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80", gradYear: 2024, department: "Computer Science", currentCompany: "Amazon AWS", currentRole: "SDE-2 Cloud Routing", skills: ["Go", "Kubernetes", "AWS Systems"] },
        { id: "alum_2", name: "Neha Deshmukh", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100&q=80", gradYear: 2022, department: "Electronics & Communication", currentCompany: "Microsoft India", currentRole: "Senior Hardware Lead", skills: ["Embedded Systems", "C++", "Power Grid Analytics"] }
      ];
      setAlumni(defaultAlumni);
      localStorage.setItem("sc_professional_alumni", JSON.stringify(defaultAlumni));
    }

    if (cachedViews) setProfileViews(JSON.parse(cachedViews));
    else {
      const defaultViews: ProfileViewLog[] = [
        { id: "view_1", profileOwnerId: currentUser?.id || "student_ashish", viewerId: "rec_rahul", viewerName: "Rahul Dravid (Recruiter)", viewerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100&q=80", viewerHeadline: "VP of Engineering @ Swiggy", viewedAt: "2026-06-13 14:02:44" },
        { id: "view_2", profileOwnerId: currentUser?.id || "student_ashish", viewerId: "mentor_kartik", viewerName: "Kartik Singhal (Mentor)", viewerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=100&h=100&q=80", viewerHeadline: "Staff Software Engineer @ Google", viewedAt: "2026-06-12 11:32:00" }
      ];
      setProfileViews(defaultViews);
      localStorage.setItem("sc_professional_profileviews", JSON.stringify(defaultViews));
    }

    setCandidatePipelines([
      { candidateId: "cand_1", candidateName: "Ashish Ghadigaonkar", candidateAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80", tag: "Shortlisted", notes: ["Outstanding TypeScript verification score", "Has open-source merged components on GDSC"] },
      { candidateId: "cand_2", candidateName: "Piyush Mehta", candidateAvatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&h=100&q=80", tag: "Interviewing", notes: ["Solid system-level understanding", "Scheduled with Mentor Kartik"] }
    ]);

    setCompanies([
      { id: "comp_microsoft", name: "Microsoft India", tagline: "Empowering every student to achieve more", description: "Global technology hub accelerating innovations across enterprise cloud, AI architectures, and developer ecosystems.", logo: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=100&h=100&q=80", banner: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=300&h=100&q=80", industry: "Enterprise SaaS & Cloud", size: "10,000+ employees", foundedYear: 1975, website: "https://microsoft.com", location: "Bangalore & Hyderabad", socialLinks: { twitter: "@Microsoft", linkedin: "company/microsoft" }, followersCount: 1450, employeesCount: 412, openJobs: [] },
      { id: "comp_hyperion", name: "Hyperion SaaS Inc.", tagline: "Low-latency systems for student micro-coops", description: "Leading software ecosystem delivering decoupled caching proxies and robust file-based backups.", logo: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=100&h=100&q=80", banner: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=300&h=100&q=80", industry: "Infrastructure & Tools", size: "11-50 employees", foundedYear: 2023, website: "https://hyperionsaas.co", location: "New Delhi Tech Center", socialLinks: { twitter: "@HyperionTech", github: "hyperion-saas" }, followersCount: 320, employeesCount: 14, openJobs: ["job_ex1"] }
    ]);

    setOrganizations([
      { id: "org_gdsc", name: "Google Developer Student Clubs (GDSC)", type: "GDSC Chapter", tagline: "Bridging the gap between theory and practice", description: "Dynamic campus cohort powered by industrial peer collaborations, technical meetups, and real open-source integrations.", logo: "https://images.unsplash.com/photo-1516321318423-f06f85e554b3?auto=format&fit=crop&w=100&h=100&q=80", membersCount: 340, eventsCount: 12 },
      { id: "org_startup", name: "Campus Founders Club", type: "Startup Community", tagline: "Incubating early-stage co-founder dreams", description: "Professional co-founding playground providing legal templates, investor briefings, and AI-powered idea accelerators.", logo: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=100&h=100&q=80", membersCount: 142, eventsCount: 4 }
    ]);
  }, [currentUser]);

  // MODULE 1 WORKFLOWS
  const handleAcceptConnection = (connId: string) => {
    const updated = connections.map(c => c.id === connId ? { ...c, status: "Accepted" as const } : c);
    setConnections(updated);
    localStorage.setItem("sc_professional_connections", JSON.stringify(updated));

    // Increase connection count
    if (currentUser) {
      onUpdateCurrentUser({
        ...currentUser,
        connectionsCount: (currentUser.connectionsCount || 0) + 1,
        reputationPoints: (currentUser.reputationPoints || 100) + 15
      });
    }
  };

  const handleRejectConnection = (connId: string) => {
    const updated = connections.map(c => c.id === connId ? { ...c, status: "Rejected" as const } : c);
    setConnections(updated);
    localStorage.setItem("sc_professional_connections", JSON.stringify(updated));
  };

  const handleSendConnection = (targetUser: any) => {
    const newConn: ProfessionalConnection = {
      id: `conn_${Date.now()}`,
      senderId: currentUser?.id || "student_ashish",
      senderName: currentUser?.fullName || "Ashish Ghadigaonkar",
      senderAvatar: currentUser?.avatarUrl || "",
      senderHeadline: currentUser?.headline || "Tech Student",
      receiverId: targetUser.id,
      receiverName: targetUser.name,
      receiverAvatar: targetUser.avatar,
      receiverHeadline: targetUser.role,
      status: "Pending",
      createdAt: new Date().toISOString().split("T")[0]
    };
    const updated = [newConn, ...connections];
    setConnections(updated);
    localStorage.setItem("sc_professional_connections", JSON.stringify(updated));
  };

  // MODULE 2 FALLOW MECHANISMS
  const handleToggleFollow = async (targetId: string, followingType: "student" | "mentor" | "company" = "company") => {
    let nowFollowing = false;
    if (following.includes(targetId)) {
      const updated = following.filter(id => id !== targetId);
      setFollowing(updated);
      localStorage.setItem("sc_professional_following", JSON.stringify(updated));
      nowFollowing = false;
    } else {
      const updated = [...following, targetId];
      setFollowing(updated);
      localStorage.setItem("sc_professional_following", JSON.stringify(updated));
      nowFollowing = true;
    }

    try {
      await FollowService.toggleFollow(targetId, followingType);
    } catch (e) {
      console.error("Failed to sync follow state with backend:", e);
    }
  };

  // MODULE 5 SKILL ENDORSEMENT
  const handleEndorseSkill = (skillName: string) => {
    const endorserName = "Juhi Chawla"; // simulated active peer user
    const endorserRole = "ML Researcher";

    const alreadyEndorsed = endorsements.some(e => e.skillName === skillName && e.endorserId === "user_juhi");
    if (alreadyEndorsed) return;

    const newEndo: SkillEndorsement = {
      id: `endo_${Date.now()}`,
      skillName,
      endorsedUserId: currentUser?.id || "student_ashish",
      endorserId: "user_juhi",
      endorserName,
      endorserRole,
      createdAt: new Date().toISOString().split("T")[0]
    };
    const updated = [...endorsements, newEndo];
    setEndorsements(updated);
    localStorage.setItem("sc_professional_endorsements", JSON.stringify(updated));
  };

  // MODULE 6 RECOMMENDATIONS
  const handleRequestRecommendation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!recTargetName || !recText) return;

    const newRec: LinkedInRecommendation = {
      id: `rec_${Date.now()}`,
      receiverId: currentUser?.id || "student_ashish",
      senderId: `sim_sender_${Date.now()}`,
      senderName: recTargetName,
      senderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80",
      senderRole: "Colleague / Mentor",
      text: recText,
      status: "Pending",
      createdAt: new Date().toISOString().split("T")[0]
    };

    const updated = [newRec, ...recommendations];
    setRecommendations(updated);
    localStorage.setItem("sc_professional_recommendations", JSON.stringify(updated));

    setRecSuccessMsg(`Recommendation requested successfully!`);
    setRecTargetName("");
    setRecText("");
    setTimeout(() => setRecSuccessMsg(""), 3000);
  };

  const handleApproveRecommendation = (recId: string) => {
    const updated = recommendations.map(r => r.id === recId ? { ...r, status: "Approved" as const } : r);
    setRecommendations(updated);
    localStorage.setItem("sc_professional_recommendations", JSON.stringify(updated));
  };

  // MODULE 7 CREATOR MODE / LONG SECTION
  const handlePublishArticle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newArticleTitle || !newArticleBody) return;

    const newArticle: ContentArticle = {
      id: `art_${Date.now()}`,
      authorId: currentUser?.id || "student_ashish",
      authorName: currentUser?.fullName || "Ashish Ghadigaonkar",
      authorAvatar: currentUser?.avatarUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100&q=80",
      title: newArticleTitle,
      summary: newArticleSummary || newArticleBody.slice(0, 100) + "...",
      content: newArticleBody,
      views: 1,
      likes: 0,
      shares: 0,
      status: "Published",
      createdAt: new Date().toISOString().split("T")[0]
    };

    const updated = [newArticle, ...articles];
    setArticles(updated);
    localStorage.setItem("sc_professional_articles", JSON.stringify(updated));

    // Grant content badge / points
    if (currentUser) {
      onUpdateCurrentUser({
        ...currentUser,
        reputationPoints: (currentUser.reputationPoints || 100) + 30,
        badges: currentUser.badges.includes("Publishing Genius") ? currentUser.badges : [...currentUser.badges, "Publishing Genius"]
      });
    }

    setArticleSuccessMsg("LinkedIn-style Article published successfully onto SkillCollab Creator Network!");
    setNewArticleTitle("");
    setNewArticleSummary("");
    setNewArticleBody("");
    setTimeout(() => setArticleSuccessMsg(""), 4000);
  };

  // MODULE 8 NEWSLETTER ARCHIVE
  const handleCreateNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nlTitle) return;

    const newNl: Newsletter = {
      id: `nl_${Date.now()}`,
      title: nlTitle,
      frequency: nlFreq,
      description: nlDesc,
      subscribersCount: 1,
      authorId: currentUser?.id || "student_ashish",
      authorName: currentUser?.fullName || "Ashish G.",
      archive: []
    };

    const updated = [newNl, ...newsletters];
    setNewsletters(updated);
    localStorage.setItem("sc_professional_newsletters", JSON.stringify(updated));

    setNlTitle("");
    setNlDesc("");
    alert(`Success: Your LinkedIn Newsletter '${nlTitle}' is online!`);
  };

  // MODULE 12 WEBINAR EVENTS
  const handleRegisterEvent = (eventId: string) => {
    const updated = events.map(evt => {
      if (evt.id === eventId) {
        return {
          ...evt,
          isRegistered: !evt.isRegistered,
          attendeesCount: evt.isRegistered ? evt.attendeesCount - 1 : evt.attendeesCount + 1
        };
      }
      return evt;
    });
    setEvents(updated);
    localStorage.setItem("sc_professional_events", JSON.stringify(updated));
  };

  // MODULE 13 CONNECTION MESSAGE RELAY
  const handleSendSuiteMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText) return;

    const newMsg = {
      id: `m_${Date.now()}`,
      sender: currentUser?.fullName || "Ashish Ghadigaonkar",
      content: newMessageText,
      replies: []
    };

    setMessagesList([...messagesList, newMsg]);
    setNewMessageText("");
  };

  const handleReactToMessage = (msgId: string, emoji: string) => {
    setMessagesList(messagesList.map(m => m.id === msgId ? { ...m, reaction: m.reaction === emoji ? undefined : emoji } : m));
  };

  const handleThreadReply = (msgId: string, replyContent: string) => {
    setMessagesList(messagesList.map(m => {
      if (m.id === msgId) {
        return { ...m, replies: [...(m.replies || []), replyContent] };
      }
      return m;
    }));
  };

  // MODULE 19 BACKEND WORKSHOP FOR AI ASSISTANT LAYOUT
  const handleAIGeneratePost = async () => {
    if (!aiPostPrompt) return;
    setAiOptimizing(true);
    setAiPostResult("");

    try {
      const response = await fetch("/api/professional/ai-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: aiPostPrompt })
      });

      if (response.ok) {
        const data = await response.ok ? await response.json() : null;
        if (data && data.text) {
          setAiPostResult(data.text);
          setAiCredits(prev => Math.max(0, prev - 5));
          return;
        }
      }

      // Offline High-Fidelity Intelligent Prompt Builder Fallback
      setTimeout(() => {
        const templates = [
          `🚀 EXTREMELY thrilled to announce that we have just built a robust decoupled file-fallback data routing synchronization framework for SkillCollab! \n\nBy leveraging Node/Express caching pipelines and MongoDB indices, we isolated transaction latency to under 120ms.\n\nBig thanks to Google AI Studio for the stellar developer workspace. \n\n#SoftwareEngineering #DeveloperCommunity #TypeScript #SaaS`,
          `💡 Here is an essential career framework I've formulated for CS Undergrads aiming to land startup roles:\n\n1️⃣ Prioritize high-impact full-stack mock prototypes instead of simple toy applications.\n2️⃣ Leverage official @google/genai APIs directly on decoupled servers to protect credential signatures.\n3️⃣ Contribute aggressively to GDSC open source hubs.\n\n#Careers #CollegeFounders #OpenSource #React`
        ];
        setAiPostResult(templates[Math.floor(Math.random() * templates.length)]);
        setAiCredits(prev => Math.max(0, prev - 5));
        setAiOptimizing(false);
      }, 1000);

    } catch (err) {
      console.error(err);
      setAiOptimizing(false);
    } finally {
      setAiOptimizing(false);
    }
  };

  const handleAIOptimizeProfile = () => {
    setAiOptimizing(true);
    setTimeout(() => {
      setAiOptimizationResult(
        `✅ PROFESSIONAL HEADLINE OPTIMIZED:\n"Full-Stack Engineer | Peer Coordination Lead | Open Source Developer (GDSC Core)"\n\n🎯 SUGGESTED BIO HIGHLIGHTS:\n- Integrated decoupled low-latency Node/Express servers processing campus telemetry metrics.\n- Increased student co-founding connections by 140% via automated heuristic engines.`
      );
      setSkillGapAnalysis({
        gap: ["Docker / Cloud Run Ingress routing", "Kubernetes Clustering", "Redux Toolkit Memoization"],
        suggestions: ["Study the DeveloperBlueprint module's network container documentation.", "Deploy your current Express proxy directly server-side.", "Familiarize yourself with Vite's client proxy routes."]
      });
      setAiCredits(prev => Math.max(0, prev - 10));
      setAiOptimizing(false);
    }, 1200);
  };

  // VIRAL LOOPS REF
  const handleClaimStreakBonus = () => {
    if (streak.streak > 0) {
      onUpdateCurrentUser({
        ...currentUser,
        reputationPoints: (currentUser?.reputationPoints || 100) + (streak.streak * 10)
      });
      alert(`Success: Claimed Daily Streak bonus points! Your reputation points increased by ${streak.streak * 10}!`);
    }
  };

  const handleGenerateInvoice = () => {
    alert("Invoice generated: INV-2026-009A | Amount: $0.00 (Premium Developer Free Tier) | Status: Paid");
  };

  const peopleYouMayKnow = [
    { id: "pymk_1", name: "Nikita Seth", role: "GDSC Cloud Lead | AWS Certified", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80", mutual: 4 },
    { id: "pymk_2", name: "Vikram Malhotra", role: "Principal Architect @ Swiggy", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80", mutual: 9 }
  ];

  return (
    <div className="space-y-6" id="professional-network-suite-dashboard">
      
      {/* MONETIZATION & PREMIUM PROFILE TOP BANNER */}
      <div className="bg-slate-900 border border-slate-850 rounded-2xl p-4 md:p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="space-y-2 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 bg-indigo-500/12 text-indigo-400 border border-indigo-500/20 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider flex items-center gap-1">
              <Zap className="w-3 h-3 fill-indigo-400" /> Professional Hub Engine
            </span>
            {premiumActive ? (
              <span className="px-2.5 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-[10px] font-mono font-bold uppercase flex items-center gap-1">
                <Award className="w-3 h-3 fill-amber-300 text-amber-400" /> Premium Member
              </span>
            ) : (
              <button 
                onClick={() => {
                  setPremiumActive(true);
                  if (currentUser) {
                    onUpdateCurrentUser({
                      ...currentUser,
                      badges: [...(currentUser.badges || []), "Premium Elite"]
                    });
                  }
                }} 
                className="px-2 py-0.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded text-[9px] font-bold uppercase transition-colors"
              >
                Go Premium
              </button>
            )}
          </div>
          <h2 className="text-xl font-sans font-bold text-white tracking-tight flex items-center gap-2">
            Professional Network Workspace
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
            Increase your professional and technical presence by syncing skill endorsements, hiring articles, GDSC club chapters, and LinkedIn certifications.
          </p>
        </div>

        {/* VIRAL CHECKS & STATS */}
        <div className="flex flex-wrap md:flex-nowrap gap-4 shrink-0 bg-slate-950/60 p-3 rounded-xl border border-slate-850/60 items-center">
          <div className="text-center font-mono px-3 border-r border-slate-850">
            <span className="text-[10px] text-slate-500 uppercase block">Daily Streak</span>
            <div className="flex items-center justify-center gap-1 text-amber-400 mt-1">
              <Flame className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span className="text-sm font-bold">{streak.streak} Days</span>
            </div>
          </div>
          <div className="text-center font-mono px-3">
            <span className="text-[10px] text-slate-500 uppercase block">AI Generation Credits</span>
            <span className="text-sm font-semibold text-emerald-400 block mt-1">{aiCredits} left</span>
          </div>
          <button 
            onClick={handleClaimStreakBonus}
            className="px-2.5 py-1.5 bg-gradient-to-r from-amber-500 to-indigo-600 hover:from-amber-400 hover:to-indigo-500 text-white rounded-lg text-[10px] font-bold transition-all shrink-0 cursor-pointer"
          >
            Claim Streak Bonus
          </button>
        </div>
      </div>

      {/* HORIZONTAL EXPANSION NAVIGATION TABS */}
      <div className="flex items-center overflow-x-auto pb-1 gap-2 border-b border-slate-850 font-mono text-[11px] scrollbar-thin">
        <button
          onClick={() => setActiveSubTab("network")}
          className={`px-4 py-2 rounded-t-xl transition-all border-t border-x ${
            activeSubTab === "network"
              ? "bg-slate-900 border-slate-850 text-indigo-400 font-bold"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          My Network Graph
        </button>
        <button
          onClick={() => setActiveSubTab("recommendations")}
          className={`px-4 py-2 rounded-t-xl transition-all border-t border-x ${
            activeSubTab === "recommendations"
              ? "bg-slate-900 border-slate-850 text-indigo-400 font-bold"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          Recommendations
        </button>
        <button
          onClick={() => setActiveSubTab("articles")}
          className={`px-4 py-2 rounded-t-xl transition-all border-t border-x ${
            activeSubTab === "articles"
              ? "bg-slate-900 border-slate-850 text-indigo-400 font-bold"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          Creator Platform
        </button>
        <button
          onClick={() => setActiveSubTab("pages")}
          className={`px-4 py-2 rounded-t-xl transition-all border-t border-x ${
            activeSubTab === "pages"
              ? "bg-slate-900 border-slate-850 text-indigo-400 font-bold"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          Company & Org Pages
        </button>
        <button
          onClick={() => setActiveSubTab("jobs")}
          className={`px-4 py-2 rounded-t-xl transition-all border-t border-x ${
            activeSubTab === "jobs"
              ? "bg-slate-900 border-slate-850 text-indigo-400 font-bold"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          Extended Job Board
        </button>
        <button
          onClick={() => setActiveSubTab("webinars")}
          className={`px-4 py-2 rounded-t-xl transition-all border-t border-x ${
            activeSubTab === "webinars"
              ? "bg-slate-900 border-slate-850 text-indigo-400 font-bold"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          Events Suite
        </button>
        <button
          onClick={() => setActiveSubTab("expert_recruits")}
          className={`px-4 py-2 rounded-t-xl transition-all border-t border-x ${
            activeSubTab === "expert_recruits"
              ? "bg-slate-900 border-slate-850 text-indigo-400 font-bold"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          Recruiter Suite
        </button>
        <button
          onClick={() => setActiveSubTab("personal_ai")}
          className={`px-4 py-2 rounded-t-xl transition-all border-t border-x ${
            activeSubTab === "personal_ai"
              ? "bg-slate-900 border-slate-850 text-indigo-400 font-bold"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          AI Pro Advisor
        </button>
      </div>

      {/* DYNAMIC SUBTABS RENDERING */}
      <div className="bg-slate-950/20 rounded-2xl">
        <AnimatePresence mode="wait">
          
          {/* TAB 1: WORKSPACE NETWORK GRAPH */}
          {activeSubTab === "network" && (
            <motion.div
              key="network-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <NetworkAnalytics 
                connectionsCount={connections.filter(c => c.status === "Accepted").length}
                profileViews={profileViews}
                referrals={referrals}
                reputationPoints={currentUser?.reputationPoints || 100}
              />

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <ConnectionsPanel 
                    connections={connections}
                    onAcceptConnection={handleAcceptConnection}
                    onRejectConnection={handleRejectConnection}
                    onSendConnection={handleSendConnection}
                    peopleYouMayKnow={peopleYouMayKnow}
                  />
                </div>
                <div className="space-y-6">
                  <FollowersPanel followers={followers} />
                  <FollowingPanel 
                    following={following}
                    onToggleFollow={handleToggleFollow}
                    companies={companies}
                    organizations={organizations}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB: RECOMMENDATIONS PORTFOLIO */}
          {activeSubTab === "recommendations" && (
            <motion.div
              key="recommendations-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="p-1"
            >
              <RecommendationsPanel
                recommendations={recommendations}
                onApproveRecommendation={handleApproveRecommendation}
                onRequestRecommendation={handleRequestRecommendation}
                recTargetName={recTargetName}
                setRecTargetName={setRecTargetName}
                recText={recText}
                setRecText={setRecText}
                successMessage={recSuccessMsg}
              />
            </motion.div>
          )}

          {/* TAB 2: CREATOR PLATFORM & NEWSLETTER (Module 7 & 8) */}
          {activeSubTab === "articles" && (
            <motion.div
              key="articles-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Creator Publishing Area */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* Publish LinkedIn-style Long-Form Technical Article */}
                <div className="bg-slate-900 border border-slate-850 rounded-2xl p-4 md:p-5">
                  <h3 className="font-sans font-bold text-white text-xs mb-1.5 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-400" /> Write Long-Form Technical Article
                  </h3>
                  <p className="text-[10.5px] text-slate-400 mb-4 font-mono leading-tight">
                    Establish authority by sharing case studies, architecture patterns, and post-hackathon build strategies.
                  </p>

                  {articleSuccessMsg && (
                    <div className="bg-emerald-500/12 text-emerald-400 border border-emerald-500/20 rounded-xl p-3 mb-4 text-xs">
                      {articleSuccessMsg}
                    </div>
                  )}

                  <form onSubmit={handlePublishArticle} className="space-y-3">
                    <input
                      type="text"
                      required
                      value={newArticleTitle}
                      onChange={(e) => setNewArticleTitle(e.target.value)}
                      placeholder="Title: e.g., Resolving Decoupled Mongoose Handshakes Across Sandbox Environments"
                      className="w-full bg-slate-950 border border-slate-850 text-white rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500"
                    />
                    
                    <input
                      type="text"
                      value={newArticleSummary}
                      onChange={(e) => setNewArticleSummary(e.target.value)}
                      placeholder="Summary: Brief summary describing the primary takeaways..."
                      className="w-full bg-slate-950 border border-slate-850 text-slate-300 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:border-indigo-500"
                    />

                    <textarea
                      required
                      rows={6}
                      value={newArticleBody}
                      onChange={(e) => setNewArticleBody(e.target.value)}
                      placeholder="Markdown Body: Write detailed technical findings, architecture diagrams, and schema definitions..."
                      className="w-full bg-slate-950 border border-slate-850 text-slate-200 rounded-lg p-3 text-xs font-mono focus:outline-none focus:border-indigo-500 resize-y"
                    />

                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-500 uppercase font-mono">Article will publish to Collegiate Feed</span>
                      <button
                        type="submit"
                        className="p-1.5 px-4 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white font-mono font-bold text-[11px] transition-colors cursor-pointer"
                      >
                        Publish Article
                      </button>
                    </div>
                  </form>
                </div>

                {/* Published Articles Feed with analytic charts */}
                <div className="bg-slate-900 border border-slate-850 rounded-2xl p-4 md:p-5">
                  <h3 className="font-sans font-bold text-white text-xs mb-3 flex items-center gap-1.5">
                    <Radio className="w-4 h-4 text-emerald-400" /> Published Technical Blogs & Analytics
                  </h3>

                  <div className="space-y-4">
                    {articles.map(art => (
                      <div key={art.id} className="p-3.5 bg-slate-950 rounded-xl border border-slate-850 text-xs text-slate-300 space-y-2">
                        <div className="flex justify-between items-start">
                          <h4 className="font-sans font-bold text-white text-[13px] leading-tight hover:text-indigo-400 cursor-pointer">{art.title}</h4>
                          <span className="px-1.5 py-0.5 bg-slate-900 rounded font-mono text-[8px] border border-slate-850 text-indigo-400 uppercase font-bold">{art.status}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 leading-normal">{art.summary}</p>
                        
                        {/* Live metrics (views, likes, shares) */}
                        <div className="pt-2 border-t border-slate-900/60 flex items-center justify-between font-mono text-[10px] text-slate-450">
                          <div className="flex gap-4">
                            <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {art.views} Views</span>
                            <span className="flex items-center gap-1"><ThumbsUp className="w-3.5 h-3.5" /> {art.likes} Likes</span>
                            <span className="flex items-center gap-1"><Share2 className="w-3.5 h-3.5" /> {art.shares} Shares</span>
                          </div>
                          <span>Published on {art.createdAt}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Newsletter Subscribed System (Module 8) */}
              <div className="space-y-6">
                
                <div className="bg-slate-900 border border-slate-850 rounded-2xl p-4 md:p-5 space-y-4">
                  <div className="space-y-1">
                    <h3 className="font-sans font-bold text-white text-xs flex items-center gap-1.5">
                      <Mail className="w-4 h-4 text-indigo-400" /> LinkedIn Newsletter Engine
                    </h3>
                    <p className="text-[10px] text-slate-450 font-mono leading-snug">
                      Schedule technical updates directly to subscribers on campus.
                    </p>
                  </div>

                  <form onSubmit={handleCreateNewsletter} className="space-y-3 text-xs">
                    <div>
                      <label className="text-[10px] text-slate-450 font-mono block mb-1">Newsletter Name:</label>
                      <input
                        type="text"
                        required
                        value={nlTitle}
                        onChange={(e) => setNlTitle(e.target.value)}
                        placeholder="e.g. Next-Gen FullStack Labs"
                        className="w-full bg-slate-950 border border-slate-850 text-white rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    
                    <div>
                      <label className="text-[10px] text-slate-450 font-mono block mb-1">Delivery Cadence:</label>
                      <select
                        value={nlFreq}
                        onChange={(e: any) => setNlFreq(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="Weekly">Weekly Digest</option>
                        <option value="Monthly">Monthly Digest</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] text-slate-450 font-mono block mb-1">Overview Description:</label>
                      <textarea
                        rows={2}
                        value={nlDesc}
                        onChange={(e) => setNlDesc(e.target.value)}
                        placeholder="Draft describing core technology digests..."
                        className="w-full bg-slate-950 border border-slate-850 text-slate-300 rounded-lg p-2 font-mono focus:outline-none focus:border-indigo-500 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white font-mono font-bold text-[10.5px] transition-colors cursor-pointer"
                    >
                      Establish LinkedIn Newsletter
                    </button>
                  </form>
                </div>

                <div className="bg-slate-900 border border-slate-850 rounded-2xl p-4 md:p-5">
                  <h4 className="font-sans font-bold text-white text-xs mb-3 flex items-center gap-1.5">
                    <Users className="w-4 h-4 text-emerald-400" /> Newsletter Subscribers
                  </h4>

                  <div className="space-y-4">
                    {newsletters.map(nl => (
                      <div key={nl.id} className="p-3 bg-slate-950 rounded-xl border border-slate-850 space-y-2 text-xs">
                        <div className="flex justify-between items-center">
                          <strong className="text-white font-sans text-xs">{nl.title}</strong>
                          <span className="px-2 py-0.5 bg-indigo-500/12 rounded-full font-mono text-[9px] text-indigo-400 font-bold">{nl.subscribersCount} SUBSCRIBERS</span>
                        </div>
                        <p className="text-[11px] text-slate-400">{nl.description}</p>
                        
                        <div className="bg-slate-900 rounded p-2 border border-slate-850 font-mono text-[9px] text-slate-500">
                          <span>Archive List size: {nl.archive.length} updates sent</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 3: COMPANY & ORG PAGES (Module 3 & 4) */}
          {activeSubTab === "pages" && (
            <motion.div
              key="pages-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Companies Section */}
                <div className="bg-slate-900 border border-slate-850 rounded-2xl p-4 md:p-5 space-y-4">
                  <div className="space-y-1">
                    <h3 className="font-sans font-bold text-white text-xs flex items-center gap-1.5">
                      <Building className="w-4 h-4 text-indigo-400" /> LinkedIn-Style Company Pages
                    </h3>
                    <p className="text-[10px] text-slate-450 font-mono leading-tight">
                      Follow corporate startup pages, apply for full-range jobs and track employees.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {companies.map(comp => (
                      <div key={comp.id} className="p-3.5 bg-slate-950 rounded-xl border border-slate-850 space-y-2 text-xs text-slate-300">
                        {/* Banner & Logo */}
                        <div className="relative h-16 rounded-xl overflow-hidden border border-slate-900">
                          <img src={comp.banner} alt={comp.name} className="w-full h-full object-cover" />
                          <div className="absolute left-3 top-2 bg-slate-950/80 backdrop-blur px-2 py-0.5 rounded border border-slate-850 flex items-center gap-1 text-[9px] font-mono text-indigo-400 font-bold">
                            Founded: {comp.foundedYear}
                          </div>
                        </div>

                        <div className="flex justify-between items-start pt-1.5">
                          <div>
                            <h4 className="font-bold text-white text-[13px] leading-tight">{comp.name}</h4>
                            <span className="text-[9.5px] text-indigo-300 block font-mono">{comp.tagline}</span>
                          </div>
                          
                          <button
                            onClick={() => {
                              handleToggleFollow(comp.id);
                              alert(`${following.includes(comp.id) ? "Unfollowed" : "Following"} ${comp.name}`);
                            }}
                            className={`p-1 px-3 ${
                              following.includes(comp.id) 
                                ? "bg-slate-900 border border-slate-800 text-slate-450 hover:bg-slate-800" 
                                : "bg-indigo-600 hover:bg-indigo-500 text-white"
                            } rounded text-[10px] font-mono font-bold transition-all cursor-pointer`}
                          >
                            {following.includes(comp.id) ? "Following" : "Follow Page"}
                          </button>
                        </div>

                        <p className="text-[11px] text-slate-400 leading-snug">{comp.description}</p>

                        <div className="grid grid-cols-3 gap-2 font-mono text-[9px] text-slate-450 pt-1.5 border-t border-slate-900/60">
                          <div>
                            <span className="block text-[8px] uppercase text-slate-500">Industry</span>
                            <span className="text-white">{comp.industry}</span>
                          </div>
                          <div>
                            <span className="block text-[8px] uppercase text-slate-500">Size</span>
                            <span className="text-white">{comp.size}</span>
                          </div>
                          <div>
                            <span className="block text-[8px] uppercase text-slate-500">Employees</span>
                            <span className="text-white">{comp.employeesCount} registered</span>
                          </div>
                        </div>

                        <div className="flex gap-2 text-[10px] font-mono pt-1">
                          <a href={comp.website} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:underline">Official Site</a>
                          <span className="text-slate-700">•</span>
                          <span className="text-emerald-400">{comp.followersCount} Followers</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Organization Chapters Section */}
                <div className="bg-slate-900 border border-slate-850 rounded-2xl p-4 md:p-5 space-y-4">
                  <div className="space-y-1">
                    <h3 className="font-sans font-bold text-white text-xs flex items-center gap-1.5">
                      <Landmark className="w-4 h-4 text-emerald-400" /> Campus Clubs, JDSC, & Communities
                    </h3>
                    <p className="text-[10px] text-slate-450 font-mono leading-tight">
                      Follow technical clubs, check GDSC announcements, and list community memberships.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {organizations.map(org => (
                      <div key={org.id} className="p-3.5 bg-slate-950 rounded-xl border border-slate-850 space-y-2 text-xs text-slate-300">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="px-1.5 py-0.5 bg-emerald-500/12 text-emerald-400 border border-emerald-500/20 font-mono text-[8px] font-bold rounded uppercase">
                              {org.type}
                            </span>
                            <h4 className="font-bold text-white text-[13px] leading-tight mt-1.5">{org.name}</h4>
                            <span className="text-[10px] text-slate-450 font-mono block italic">"{org.tagline}"</span>
                          </div>

                          <button
                            onClick={() => {
                              handleToggleFollow(org.id);
                              alert(`${following.includes(org.id) ? "Unfollowed" : "Following"} ${org.name}`);
                            }}
                            className={`p-1 px-3 ${
                              following.includes(org.id) 
                                ? "bg-slate-900 border border-slate-800 text-slate-450 hover:bg-slate-800" 
                                : "bg-indigo-600 hover:bg-indigo-500 text-white"
                            } rounded text-[10px] font-mono font-bold transition-all cursor-pointer`}
                          >
                            {following.includes(org.id) ? "Joined Chapter" : "Join Chapter"}
                          </button>
                        </div>

                        <p className="text-[11px] text-slate-400 leading-snug">{org.description}</p>

                        <div className="flex gap-4 font-mono text-[10px] pt-1.5 border-t border-slate-900/60 text-slate-450">
                          <span>Members: <strong className="text-white">{org.membersCount} devs</strong></span>
                          <span>Upcoming Events: <strong className="text-indigo-400">{org.eventsCount} scheduled</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 4: EXTENDED JOB BOARD (Module 14) */}
          {activeSubTab === "jobs" && (
            <motion.div
              key="jobs-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-slate-900 border border-slate-850 rounded-2xl p-4 md:p-5 space-y-4"
            >
              <div className="space-y-1">
                <span className="px-2 py-0.5 bg-indigo-500/12 text-indigo-400 border border-indigo-500/20 rounded-full font-mono text-[9px] uppercase font-bold">
                  Employment Search Cluster
                </span>
                <h3 className="font-sans font-bold text-white text-xs">
                  Full-Time, Part-Time, & Remote Extended Job Board
                </h3>
                <p className="text-[10.5px] text-slate-400">
                  Search filtered professional listings, save bookmarks, and view application tracking milestones.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {extJobs.map(job => (
                  <div key={job.id} className="p-4 bg-slate-950 rounded-xl border border-slate-850 flex flex-col justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex justify-between items-start">
                        <span className="px-2 py-0.5 bg-slate-900 rounded font-mono text-[9px] text-indigo-300 border border-slate-800 uppercase font-bold">{job.type}</span>
                        <span className="text-[10px] text-emerald-400 font-mono font-bold">{job.stipendOrSalary}</span>
                      </div>
                      <h4 className="font-bold text-white text-[13px] leading-tight pt-1">{job.title}</h4>
                      <strong className="text-indigo-400 font-mono text-[11px] block">{job.companyName}</strong>
                      <p className="text-[10.5px] text-slate-400 leading-normal font-sans pt-1.5">{job.description}</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1">
                        {job.skills.map((s, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 bg-slate-900 text-slate-300 font-mono text-[8.5px] border border-slate-850 rounded">
                            {s}
                          </span>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-slate-900 flex justify-between items-center text-[10px] font-mono text-slate-500">
                        <span>Apply by: {job.applyBy}</span>
                        <span className="text-indigo-400">{job.applicantsCount} student applicants</span>
                      </div>

                      <button
                        onClick={() => alert(`Application submitted for ${job.title} @ ${job.companyName}!`)}
                        className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded text-white font-mono font-bold transition-colors cursor-pointer"
                      >
                        Apply for Job
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 5: EVENTS PLATFORM & WEBINARS (Module 12) */}
          {activeSubTab === "webinars" && (
            <motion.div
              key="webinars-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="bg-slate-900 border border-slate-850 rounded-2xl p-4 md:p-5 space-y-4"
            >
              <div className="space-y-1">
                <h3 className="font-sans font-bold text-white text-xs flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-indigo-400" /> Dynamic Campus Tech Talks & Events Platform
                </h3>
                <p className="text-[10.5px] text-slate-400 leading-snug">
                  Register for exclusive webinars, track attendance schedules, and book meeting reminders.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {events.map(evt => (
                  <div key={evt.id} className="p-4 bg-slate-950 rounded-xl border border-slate-850 space-y-3 text-xs text-slate-300">
                    <div className="flex justify-between items-start">
                      <span className="px-2 py-0.5 bg-slate-900 border border-slate-800 rounded font-mono text-[8.5px] uppercase font-bold text-indigo-400">
                        {evt.type}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono flex items-center gap-1">
                        <Users className="w-3 h-3" /> {evt.attendeesCount} RSVPs
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-white text-xs leading-normal">{evt.title}</h4>
                      <span className="text-[9.5px] text-slate-400 font-mono block mt-0.5">Organized by: {evt.organizerName}</span>
                    </div>

                    <div className="p-2 bg-slate-900 border border-slate-850 rounded-lg text-[10px] font-mono space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Date:</span>
                        <span className="text-white font-semibold">{evt.date}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Time Slot:</span>
                        <span className="text-white font-semibold">{evt.time}</span>
                      </div>
                      <div className="flex justify-between truncate">
                        <span className="text-slate-500 shrink-0">Harness: </span>
                        <span className="text-indigo-300 truncate">{evt.linkOrLocation}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRegisterEvent(evt.id)}
                      className={`w-full py-1.5 ${
                        evt.isRegistered 
                          ? "bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800" 
                          : "bg-indigo-600 hover:bg-indigo-500 text-white"
                      } rounded font-mono font-bold transition-all cursor-pointer`}
                    >
                      {evt.isRegistered ? "Remove Registration" : "RSVP & Register for Event"}
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* TAB 6: RECRUITER SUITE (Module 18) */}
          {activeSubTab === "expert_recruits" && (
            <motion.div
              key="expert-recruits-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="bg-slate-900 border border-slate-850 rounded-2xl p-4 md:p-5 space-y-4">
                <div className="space-y-1">
                  <span className="px-2 py-0.5 bg-amber-500/12 text-amber-400 border border-amber-500/20 rounded-full font-mono text-[9px] uppercase font-bold">
                    Active Recruiter Interface
                  </span>
                  <h3 className="font-sans font-bold text-white text-xs">
                    Enterprise Talent Sourcing & Match Pipeline
                  </h3>
                  <p className="text-[10.5px] text-slate-400">
                    Acquire elite student portfolios, sort candidate suitability scores, and move applicants down the pipeline board.
                  </p>
                </div>

                {/* Sourcing filters */}
                <div className="flex flex-col sm:flex-row gap-3 bg-slate-950 p-3 rounded-xl border border-slate-850">
                  <div className="flex-1 relative">
                    <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-slate-500" />
                    <input 
                      type="text" 
                      value={recSearchQuery}
                      onChange={(e) => setRecSearchQuery(e.target.value)}
                      placeholder="Global semantic candidate skills search (e.g., TS, PyTorch)..."
                      className="w-full bg-slate-900 border border-slate-800 text-slate-200 rounded-lg pl-8 pr-3 py-1 text-xs focus:outline-none focus:border-indigo-500 font-mono"
                    />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-500 font-mono">Stage:</span>
                    <select
                      value={pipelineFilter}
                      onChange={(e) => setPipelineFilter(e.target.value)}
                      className="bg-slate-900 border border-slate-800 text-slate-200 rounded px-2 py-1 text-[11px] focus:outline-none"
                    >
                      <option value="Sourcing">Sourcing</option>
                      <option value="Interviewing">Interviewing</option>
                      <option value="Shortlisted">Shortlisted</option>
                      <option value="Offered">Offered</option>
                    </select>
                  </div>
                </div>

                {/* Pipeline Board list representation */}
                <div className="space-y-3">
                  {candidatePipelines.map(cand => (
                    <div key={cand.candidateId} className="p-3 bg-slate-950 rounded-xl border border-slate-850 flex flex-col sm:flex-row justify-between sm:items-center gap-3 text-xs text-slate-300">
                      <div className="flex gap-3 items-center">
                        <img src={cand.candidateAvatar} alt={cand.candidateName} className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-800" />
                        <div>
                          <strong className="text-white font-sans text-xs">{cand.candidateName}</strong>
                          <span className="text-[10px] text-slate-500 font-mono block">Candidate Tag: {cand.tag}</span>
                          <div className="flex flex-wrap gap-1 mt-1 leading-none">
                            {cand.notes.map((note, idx) => (
                              <span key={idx} className="bg-slate-900 text-slate-400 text-[8.5px] px-1.5 py-0.5 rounded italic">
                                "{note}"
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 font-mono text-[10px] shrink-0">
                        <button 
                          onClick={() => {
                            setCandidatePipelines(candidatePipelines.map(c => c.candidateId === cand.candidateId ? { ...c, tag: "Offered" } : c));
                            alert(`${cand.candidateName} moved to Offered stage.`);
                          }}
                          className="px-2 py-1 bg-green-600/20 text-green-400 border border-green-600/30 rounded font-bold hover:bg-green-600/30 transition-colors"
                        >
                          Offer
                        </button>
                        <button 
                          onClick={() => {
                            setCandidatePipelines(candidatePipelines.map(c => c.candidateId === cand.candidateId ? { ...c, tag: "Interviewing" } : c));
                            alert(`${cand.candidateName} moved to Interviewing stage.`);
                          }}
                          className="px-2 py-1 bg-indigo-600/20 text-indigo-400 border border-indigo-600/30 rounded font-bold hover:bg-indigo-600/30 transition-colors"
                        >
                          Interview
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 7: AI PROFESSIONAL ADVISOR (Module 19) */}
          {activeSubTab === "personal_ai" && (
            <motion.div
              key="personal-ai-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-6"
            >
              {/* Creator Generator Panel */}
              <div className="lg:col-span-2 space-y-6 bg-slate-900 border border-slate-850 rounded-2xl p-4 md:p-5">
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 bg-gradient-to-r from-amber-500 to-indigo-600 text-white rounded-full text-[9px] font-mono font-bold uppercase tracking-wider inline-flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-white fill-white" /> @google/genai Flash Engine
                  </span>
                  <h3 className="font-sans font-bold text-white text-xs">
                    AI LinkedIn Post & Long-Form Compiler
                  </h3>
                  <p className="text-[10.5px] text-slate-400 leading-snug">
                    Generate outstanding structured posts based on recent milestones or open-source pull requests.
                  </p>
                </div>

                <div className="space-y-3 text-xs">
                  <textarea
                    rows={3}
                    value={aiPostPrompt}
                    onChange={(e) => setAiPostPrompt(e.target.value)}
                    placeholder="Enter what you accomplished... e.g., Just deployed a low-latency proxy layer with decoupled local-database backups, reducing loading delay to under 120ms."
                    className="w-full bg-slate-950 border border-slate-850 rounded-lg p-3 text-slate-200 font-sans focus:outline-none focus:border-indigo-500"
                  />

                  <div className="flex justify-between items-center">
                    <span className="text-[9.5px] text-slate-500 font-mono">Consumes 5 AI Credits</span>
                    <button
                      onClick={handleAIGeneratePost}
                      disabled={aiOptimizing}
                      className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-mono font-bold rounded-lg transition-all cursor-pointer flex items-center gap-2"
                    >
                      {aiOptimizing ? "Processing..." : "Generate LinkedIn Post"}
                    </button>
                  </div>

                  {aiPostResult && (
                    <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl space-y-2 mt-2">
                      <div className="flex justify-between items-center border-b border-slate-900 pb-1.5">
                        <span className="text-[9px] text-emerald-400 uppercase font-mono tracking-widest block font-bold">Suggested AI Output</span>
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(aiPostResult);
                            alert("Copied post draft to clipboard!");
                          }}
                          className="text-[9px] text-indigo-400 hover:underline"
                        >
                          Copy Draft
                        </button>
                      </div>
                      <p className="whitespace-pre-wrap font-sans text-slate-200 leading-relaxed text-[11px]">{aiPostResult}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Skill Gap Optimizer */}
              <div className="space-y-6">
                <div className="bg-slate-900 border border-slate-850 rounded-2xl p-4 md:p-5 space-y-4">
                  <h3 className="font-sans font-bold text-white text-xs flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-400" /> AI Profile Optimizer & Skill Gap Analyzer
                  </h3>
                  <p className="text-[10px] text-slate-400 font-mono leading-tight">
                    Optimize your display headlines and check missing course parameters before applying.
                  </p>

                  <button
                    onClick={handleAIOptimizeProfile}
                    className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Analyze Missing Tech Gaps
                  </button>

                  {aiOptimizationResult && (
                    <div className="space-y-3.5 text-xs">
                      <div className="bg-slate-950 border border-slate-850 p-2.5 rounded-xl space-y-1.5">
                        <strong className="text-white block font-mono text-[10px] uppercase text-emerald-400">Heuristics Outline</strong>
                        <p className="whitespace-pre-wrap text-[10px] text-slate-300 font-mono leading-normal">{aiOptimizationResult}</p>
                      </div>

                      {skillGapAnalysis && (
                        <div className="space-y-2">
                          <span className="text-[9.5px] text-slate-500 font-mono block uppercase">Detected Language Gap:</span>
                          <div className="flex flex-wrap gap-1 leading-none">
                            {skillGapAnalysis.gap.map((g, idx) => (
                              <span key={idx} className="bg-red-500/12 text-red-400 border border-red-500/20 px-1.5 py-0.5 rounded font-mono text-[8.5px] font-bold">
                                {g}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* SKILL ENDORSEMENTS LIST BOX (Module 5) */}
                <div className="bg-slate-900 border border-slate-850 rounded-2xl p-4 md:p-5 space-y-3">
                  <h4 className="font-sans font-bold text-white text-xs flex items-center gap-1.5">
                    <ThumbsUp className="w-4 h-4 text-indigo-400" /> Skill Endorsements
                  </h4>

                  <div className="space-y-2 text-xs">
                    {(currentUser?.skills || ["TypeScript", "React.js", "Express"]).map((skill: string) => {
                      const countForSkill = endorsements.filter(e => e.skillName === skill).length;
                      return (
                        <div key={skill} className="flex justify-between items-center p-2 bg-slate-950 border border-slate-850 rounded-lg">
                          <div>
                            <span className="text-white font-mono text-[11px]">{skill}</span>
                            <span className="text-[9px] text-slate-500 block">
                              {countForSkill > 0 ? `Endorsed by ${endorsements.find(e => e.skillName === skill)?.endorserName} and others` : `No endorsements yet`}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-indigo-400 font-mono text-[11px]">{countForSkill}</span>
                            <button
                              onClick={() => {
                                handleEndorseSkill(skill);
                                alert(`Simulated peer endorsed your skill: ${skill}`);
                              }}
                              className="px-1.5 py-0.5 bg-slate-900 hover:bg-slate-850 rounded text-[9.5px] font-mono text-slate-300 border border-slate-800 transition-colors shrink-0"
                            >
                              + Endorse
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

    </div>
  );
}
