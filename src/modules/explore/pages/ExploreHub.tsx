import React, { useState, useEffect } from "react";
import { 
  Compass, Star, Flame, Users, Calendar, Award, ExternalLink, 
  UserCheck, UserPlus, ShieldAlert, Cpu, Heart, ChevronRight, GraduationCap, Briefcase, Sparkles, Search, SlidersHorizontal, RefreshCw
} from "lucide-react";
import { UserProfileLink } from "../../../shared/components/UserProfileLink";

interface ExploreHubProps {
  onNavigate: (tabId: string) => void;
  currentUser?: any;
}

type SearchCategory = "All" | "People" | "Projects" | "Mentors" | "Hackathons" | "Startups" | "Open Source" | "Internships";

export default function ExploreHub({ onNavigate, currentUser }: ExploreHubProps) {
  // Live data lists fetched dynamically from the database
  const [projectsList, setProjectsList] = useState<any[]>([]);
  const [teamsList, setTeamsList] = useState<any[]>([]);
  const [startupPitchesList, setStartupPitchesList] = useState<any[]>([]);
  const [openSourceIssuesList, setOpenSourceIssuesList] = useState<any[]>([]);
  const [mentorsOnlineList, setMentorsOnlineList] = useState<any[]>([]);
  const [upcomingEventsList, setUpcomingEventsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Search Engine & Filters State
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<SearchCategory>("All");
  const [starredProjects, setStarredProjects] = useState<string[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);

  const fetchAllExploreData = async () => {
    setLoading(true);
    try {
      const [resProj, resTeams, resPitches, resOS, resMentors, resEvents] = await Promise.all([
        fetch("/api/projects").then(r => r.ok ? r.json() : []).catch(() => []),
        fetch("/api/teams").then(r => r.ok ? r.json() : []).catch(() => []),
        fetch("/api/co-founders/posts").then(r => r.ok ? r.json() : []).catch(() => []),
        fetch("/api/open-source/issues").then(r => r.ok ? r.json() : []).catch(() => []),
        fetch("/api/mentors").then(r => r.ok ? r.json() : []).catch(() => []),
        fetch("/api/hackathons").then(r => r.ok ? r.json() : []).catch(() => [])
      ]);

      setProjectsList(Array.isArray(resProj) ? resProj : []);
      setTeamsList(Array.isArray(resTeams) ? resTeams : []);
      setStartupPitchesList(Array.isArray(resPitches) ? resPitches : []);
      setOpenSourceIssuesList(Array.isArray(resOS) ? resOS : []);
      setMentorsOnlineList(Array.isArray(resMentors) ? resMentors : []);
      setUpcomingEventsList(Array.isArray(resEvents) ? resEvents : []);
    } catch (err) {
      console.error("Error loading explore dynamic profiles:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllExploreData();
  }, []);

  const handleToggleStar = (id: string) => {
    setStarredProjects(prev => 
      prev.includes(id) ? prev.filter(sid => sid !== id) : [...prev, id]
    );
  };

  const handleRegisterEvent = (id: string) => {
    setRegisteredEvents(prev => 
      prev.includes(id) ? prev.filter(eid => eid !== id) : [...prev, id]
    );
  };

  // Modern structured placeholder lists for high-fidelity rendering if DB is empty
  const defaultProjects = projectsList.length > 0 ? projectsList : [
    { id: "p1", title: "EtherPulse Decentralized Ledger", description: "High performance ledger client written in Rust with gRPC sync hooks.", skillsRequired: ["Rust", "gRPC", "Solidity"], starsCount: 42 },
    { id: "p2", title: "Campus Roommate AI Matcher", description: "Vector databases combined with preferences profiling for safe peer matching.", skillsRequired: ["Python", "Pinecone", "React"], starsCount: 28 },
    { id: "p3", title: "Automated Typesmart Compiler", description: "LLM-based parsing and compilation assistance tool featuring absolute type-checks.", skillsRequired: ["TypeScript", "Gemini API", "Esbuild"], starsCount: 35 },
    { id: "p4", title: "VibeSync Spotify Rooms", description: "Real-time socket-based audio sync and voting boards for dynamic user rooms.", skillsRequired: ["JavaScript", "Sockets.io", "React"], starsCount: 19 }
  ];

  const defaultHackathons = upcomingEventsList.length > 0 ? upcomingEventsList : [
    { id: "h1", title: "AI Studio National Hackathon 2026", date: "June 20-22, 2026", category: "AI & ML", prize: "$15K Pool" },
    { id: "h2", title: "Superchain Bangalore Devfest", date: "July 04-06, 2026", category: "Web3 Infrastructure", prize: "$10K Pool" },
    { id: "h3", title: "Innovate India Academic Summit", date: "August 12-14, 2026", category: "Sustainability Tech", prize: "$5K Pool" }
  ];

  const defaultMentors = mentorsOnlineList.length > 0 ? mentorsOnlineList : [
    { id: "senior_shekhar", fullName: "Shekhar Iyer", headline: "Enterprise SaaS Consultant & Lead Coach", focusArea: "Enterprise Architecture & Scale", avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80" },
    { id: "m1", fullName: "Pranav Mistry", headline: "Lead Staff Architect @ Stripe", focusArea: "System Scaling & Payment Scopes", avatarUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80" },
    { id: "m2", fullName: "Rohan Khanna", headline: "Senior Engineer @ Google DeepMind", focusArea: "Large Language Models & Optimization", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80" },
    { id: "m3", fullName: "Kriti Sharma", headline: "Principal Scientist @ Microsoft Research", focusArea: "Secure Cryptography & ZK Rollups", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80" }
  ];

  const defaultOSOpportunities = openSourceIssuesList.length > 0 ? openSourceIssuesList : [
    { id: "o1", repository: "google/genai-js", title: "Add token counting support to interactions agent", pointsReward: 70, difficulty: "Medium" },
    { id: "o2", repository: "skillcollab/core-api", title: "Optimize redis cache sync locks for infinite query scroll", pointsReward: 40, difficulty: "Easy" },
    { id: "o3", repository: "tailwind-labs/tailwindcss", title: "Resolve absolute border alignment on responsive dynamic sidebars", pointsReward: 120, difficulty: "Hard" }
  ];

  const defaultStartups = startupPitchesList.length > 0 ? startupPitchesList : [
    { id: "s1", title: "PayPulse Ledger Inc.", tagline: "Instant invoice discounting via blockchain liquidity routing pools.", roleNeeded: "Fullstack Lead", fundingStage: "Pre-seed" },
    { id: "s2", title: "EduVector Systems", tagline: "Semantic vector engines maps out custom computer science homework curations.", roleNeeded: "ML Engineer", fundingStage: "Bootstrapped" },
    { id: "s3", title: "HealthPulse Diagnostics", tagline: "On-demands edge analytics for medical imaging monitors on IoT.", roleNeeded: "Embedded Systems Specialist", fundingStage: "Seed Round" }
  ];

  const defaultPeople = [
    { id: "senior_shekhar", name: "Shekhar Iyer", headline: "Enterprise SaaS Consultant & Coach", skills: ["SaaS", "Postgres", "Relational Databases", "Cloud Run"], avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&h=150&q=80", match: "System Match" },
    { id: "student_ashish", name: "Ashish Ghadigaonkar", headline: "Fullstack Developer (You)", skills: ["React", "Express", "Node.js", "Firebase"], avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80", match: "Verified" },
    { id: "user_sneha", name: "Sneha Nair", headline: "Senior UI Architect", skills: ["Tailwind", "Figma", "Interaction Design", "Motion"], avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100&q=80", match: "91% Skill Match" },
    { id: "user_priya", name: "Priya Patel", headline: "Fullstack Generalist", skills: ["TypeScript", "MongoDB", "Express", "System Design"], avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80", match: "86% Skill Match" },
    { id: "user_rohan", name: "Rohan Sharma", headline: "Backend & Systems Lead", skills: ["Go", "Redis", "Kafka", "Data Engineering"], avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80", match: "94% Skill Match" },
    { id: "user_piyush", name: "Piyush Mehta", headline: "Infrastructure DevOps Engineer", skills: ["Docker", "Kubernetes", "AWS", "CI/CD"], avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&h=100&q=80", match: "78% Skill Match" }
  ];

  const defaultInternships = [
    { id: "i1", title: "Developer Relation Intern", company: "Google Developers", location: "Remote / Bengaluru", duration: "6 Months", stipend: "₹45,000/mo", skillsRequired: ["TypeScript", "Community Eng", "Technical Writing"] },
    { id: "i2", title: "Software Engineer Intern", company: "Stripe India", location: "Bengaluru Office", duration: "3 Months", stipend: "₹65,000/mo", skillsRequired: ["Ruby", "React", "Financial APIs"] },
    { id: "i3", title: "Front-End Engineering Intern", company: "NASA Space Apps Team", location: "Remote", duration: "4 Months", stipend: "Verified Credits", skillsRequired: ["React", "D3.js", "Geospatial Data"] }
  ];

  // Filters Matching Query
  const matchesQuery = (text: string) => {
    if (!text) return false;
    return text.toLowerCase().includes(searchQuery.toLowerCase());
  };

  const getFilteredData = () => {
    const term = searchQuery.trim().toLowerCase();

    const matches = (item: any, fields: string[]) => {
      if (!term) return true;
      return fields.some(field => {
        const val = item[field];
        if (Array.isArray(val)) {
          return val.some(v => v.toLowerCase().includes(term));
        }
        return val && typeof val === "string" && val.toLowerCase().includes(term);
      });
    };

    const results: { category: SearchCategory; data: any[]; renderCard: (item: any) => React.ReactNode }[] = [
      {
        category: "People",
        data: defaultPeople.filter(p => matches(p, ["name", "headline", "skills"])),
        renderCard: (item) => (
          <div key={item.id} className="bg-slate-900 border border-slate-850 p-4 rounded-xl flex items-center justify-between gap-3 hover:border-slate-800 transition-colors">
            <div className="flex gap-3 items-center min-w-0">
              <UserProfileLink userId={item.id}>
                <img src={item.avatar} alt={item.name} className="w-11 h-11 rounded-full object-cover border border-slate-800 shrink-0" referrerPolicy="no-referrer" />
              </UserProfileLink>
              <div className="min-w-0">
                <UserProfileLink userId={item.id} className="font-bold text-white text-xs leading-none truncate hover:underline block mb-1">
                  {item.name}
                </UserProfileLink>
                <p className="text-[10px] text-slate-400 truncate leading-snug">{item.headline}</p>
                <div className="flex flex-wrap gap-1 mt-1.5 max-h-5 overflow-hidden">
                  {item.skills.slice(0, 2).map((s: string) => (
                    <span key={s} className="px-1.5 py-0.5 bg-slate-950 border border-slate-850/60 rounded text-[8px] font-mono text-slate-500">{s}</span>
                  ))}
                </div>
              </div>
            </div>
            <span className="text-[9px] shrink-0 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 font-mono px-2 py-0.5 rounded-full font-bold">
              {item.match}
            </span>
          </div>
        )
      },
      {
        category: "Projects",
        data: defaultProjects.filter(p => matches(p, ["title", "description", "skillsRequired"])),
        renderCard: (item) => (
          <div key={item.id} className="bg-slate-900 border border-slate-850 p-4 rounded-xl flex flex-col justify-between hover:border-slate-800 transition-colors">
            <div className="space-y-1.5">
              <div className="flex justify-between items-start gap-2">
                <h4 className="font-bold text-white text-xs leading-tight line-clamp-1">{item.title}</h4>
                <button onClick={() => handleToggleStar(item.id)} className="p-1 rounded-md bg-slate-950 border border-slate-850 text-slate-450 hover:text-white transition-all scale-90">
                  <Star className={`w-3 h-3 ${starredProjects.includes(item.id) ? "text-amber-400 fill-amber-400" : ""}`} />
                </button>
              </div>
              <p className="text-[10.5px] text-slate-400 line-clamp-2 leading-relaxed">{item.description}</p>
            </div>
            <div className="mt-4 pt-3.5 border-t border-slate-850 flex justify-between items-center">
              <div className="flex gap-1">
                {(item.skillsRequired || []).slice(0, 2).map((s: string) => (
                  <span key={s} className="px-1.5 py-0.5 bg-slate-950 border border-slate-850 rounded text-[8.5px] font-mono text-slate-500">{s}</span>
                ))}
              </div>
              <button onClick={() => onNavigate("build")} className="text-[9.5px] font-mono font-bold text-indigo-400 hover:underline">View Docs →</button>
            </div>
          </div>
        )
      },
      {
        category: "Mentors",
        data: defaultMentors.filter(m => matches(m, ["fullName", "headline", "focusArea"])),
        renderCard: (item) => (
          <div key={item.id} className="bg-slate-900 border border-slate-850 p-4 rounded-xl flex items-center justify-between gap-3 hover:border-slate-800 transition-colors">
            <div className="flex gap-3 items-center min-w-0">
              <UserProfileLink userId={item.id}>
                <img src={item.avatarUrl} alt={item.fullName} className="w-11 h-11 rounded-full object-cover border border-slate-800 shrink-0" referrerPolicy="no-referrer" />
              </UserProfileLink>
              <div className="min-w-0">
                <UserProfileLink userId={item.id} className="font-bold text-white text-xs truncate hover:underline block leading-none mb-1">
                  {item.fullName}
                </UserProfileLink>
                <p className="text-[10px] text-slate-400 truncate leading-snug">{item.headline}</p>
                <p className="text-[9px] text-orange-400 font-mono mt-1">Focus: {item.focusArea}</p>
              </div>
            </div>
            <button onClick={() => onNavigate("profile")} className="px-3 py-1 bg-slate-950 hover:bg-slate-850 border border-slate-850 text-slate-300 rounded-lg text-[10px] font-mono font-bold whitespace-nowrap">
              Book Tech Slot
            </button>
          </div>
        )
      },
      {
        category: "Hackathons",
        data: defaultHackathons.filter(h => matches(h, ["title", "category", "prize"])),
        renderCard: (item) => (
          <div key={item.id} className="bg-slate-900 border border-slate-850 p-4 rounded-xl flex flex-col justify-between hover:border-slate-800 transition-colors relative overflow-hidden">
            <div className="space-y-1.5">
              <span className="text-[8px] font-mono bg-amber-500/10 text-amber-400 border border-amber-500/15 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                {item.category}
              </span>
              <h4 className="font-bold text-white text-xs line-clamp-1">{item.title}</h4>
              <p className="text-[9.5px] font-mono text-slate-500">Date: {item.date}</p>
            </div>
            <div className="pt-3 border-t border-slate-850 mt-4 flex justify-between items-center text-[10px] font-mono">
              <div>
                <span className="block text-[8px] text-slate-500">PRIZE POOL</span>
                <span className="text-emerald-400 font-bold">{item.prize}</span>
              </div>
              <button onClick={() => onNavigate("home")} className="px-2.5 py-1 bg-slate-950 hover:bg-slate-850 border border-slate-850 text-white rounded text-[9.5px] font-semibold">Join Squad</button>
            </div>
          </div>
        )
      },
      {
        category: "Startups",
        data: defaultStartups.filter(s => matches(s, ["title", "tagline", "roleNeeded"])),
        renderCard: (item) => (
          <div key={item.id} className="bg-slate-900 border border-slate-850 p-4 rounded-xl flex flex-col justify-between hover:border-slate-800 transition-colors">
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <h4 className="font-bold text-white text-xs line-clamp-1">{item.title}</h4>
                <span className="text-[9px] font-mono bg-violet-500/10 text-violet-400 border border-violet-500/20 px-2 py-0.5 rounded-full">{item.fundingStage}</span>
              </div>
              <p className="text-[10.5px] text-slate-400 line-clamp-2 leading-relaxed">{item.tagline}</p>
            </div>
            <p className="text-[9.5px] font-mono text-indigo-400 pt-3 border-t border-slate-850/60 mt-3">Requisite: <span className="text-white font-medium">{item.roleNeeded}</span></p>
          </div>
        )
      },
      {
        category: "Open Source",
        data: defaultOSOpportunities.filter(o => matches(o, ["repository", "title", "difficulty"])),
        renderCard: (item) => (
          <div key={item.id} className="bg-slate-900 border border-slate-850 p-4 rounded-xl flex flex-col justify-between hover:border-slate-800 transition-colors">
            <div className="space-y-1.5">
              <span className="px-1.5 py-0.5 bg-slate-950 border border-slate-850/60 font-mono text-[8px] text-indigo-400 font-bold block w-fit rounded leading-none">{item.repository}</span>
              <h4 className="font-bold text-white text-xs line-clamp-2 leading-snug">{item.title}</h4>
            </div>
            <div className="pt-3 mt-4 border-t border-slate-850 flex justify-between items-center text-[10px] font-mono">
              <span className="text-slate-500">Points: <span className="text-amber-400 font-extrabold">{item.pointsReward} pts</span></span>
              <span className={`px-2 py-0.5 rounded-full text-[9px] ${item.difficulty === "Easy" ? "text-emerald-400 bg-emerald-500/10" : item.difficulty === "Medium" ? "text-amber-400 bg-amber-500/10" : "text-rose-400 bg-rose-500/10"}`}>{item.difficulty}</span>
            </div>
          </div>
        )
      },
      {
        category: "Internships",
        data: defaultInternships.filter(i => matches(i, ["title", "company", "location", "skillsRequired"])),
        renderCard: (item) => (
          <div key={item.id} className="bg-slate-900 border border-slate-850 p-4 rounded-xl flex flex-col justify-between hover:border-slate-800 transition-colors relative overflow-hidden">
            <div className="space-y-1.5">
              <h4 className="font-bold text-white text-xs line-clamp-1">{item.title}</h4>
              <p className="text-[10px] text-indigo-400 font-sans font-medium">{item.company} • <span className="text-slate-450 font-mono">{item.location}</span></p>
              <div className="flex flex-wrap gap-1 pt-1">
                {item.skillsRequired.map((s: string) => (
                  <span key={s} className="px-1.5 py-0.5 bg-slate-950 border border-slate-850/60 rounded text-[8px] text-slate-500 font-mono">{s}</span>
                ))}
              </div>
            </div>
            <div className="pt-3 border-t border-slate-850/80 mt-4 flex justify-between items-center text-[10px] font-mono">
              <span className="text-slate-500">{item.duration}</span>
              <span className="text-emerald-400 font-bold">{item.stipend}</span>
            </div>
          </div>
        )
      }
    ];

    if (activeCategory === "All") {
      return results;
    }
    return results.filter(r => r.category === activeCategory);
  };

  const filteredResults = getFilteredData();
  const totalResultsCount = filteredResults.reduce((sum, current) => sum + current.data.length, 0);

  return (
    <div className="space-y-6 text-left font-sans">
      
      {/* 1. HERO HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-slate-850 p-6 rounded-2xl relative overflow-hidden flex flex-col md:flex-row justify-between md:items-center gap-6">
        <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-indigo-500/10 blur-3xl rounded-full" />
        <div className="max-w-xl">
          <span className="text-[10px] font-mono text-indigo-400 font-extrabold uppercase tracking-widest block mb-1">
            Discovery Suite
          </span>
          <h2 className="text-md md:text-lg font-extrabold text-white">Full-Stack Campus Discovery Engine</h2>
          <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
            Discover peer engineers, project teams, mentors, seed-stage startups, live hackathons, research slots, and open positions in a unified interface.
          </p>
        </div>
        
        <button
          onClick={fetchAllExploreData}
          disabled={loading}
          className="p-3 bg-slate-950 border border-slate-850 hover:bg-slate-900 rounded-xl text-slate-400 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2 font-mono text-[10px] shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Sync Database</span>
        </button>
      </div>

      {/* 2. DYNAMIC DISCOVERY ENGINE SEARCH BAR */}
      <div className="bg-slate-900/50 border border-slate-850/70 p-4 rounded-2xl space-y-3.5 shadow">
        <div className="relative">
          <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search credentials, projects, taglines, hackathons, skills, mentors, or companies..."
            className="w-full pl-10.5 pr-4 py-2.5 bg-slate-950 border border-slate-850 focus:border-indigo-500 text-xs font-sans text-white placeholder-slate-550 rounded-xl focus:outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
          />
        </div>

        {/* Faceted filter pills segment */}
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none pb-0.5 pt-0.5">
          <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-mono pr-2 border-r border-slate-850 uppercase shrink-0">
            <SlidersHorizontal className="w-3 h-3 text-slate-500 shrink-0" />
            <span>Facets:</span>
          </div>

          {(["All", "People", "Projects", "Mentors", "Hackathons", "Startups", "Open Source", "Internships"] as SearchCategory[]).map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-[10.5px] font-mono font-bold tracking-wide transition-all whitespace-nowrap cursor-pointer hover:border-slate-750 ${
                activeCategory === cat
                  ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/15"
                  : "bg-slate-950 border border-slate-850 text-slate-400 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* RENDER CONTENT SECTION BASED ON SEARCH ENGINE QUERY */}
      {loading ? (
        <div className="w-full h-48 flex flex-col justify-center items-center gap-2">
          <div className="w-7 h-7 rounded-full border border-slate-800 border-t-indigo-400 animate-spin" />
          <span className="text-[10px] font-mono text-slate-500 animate-pulse">Syncing Explore parameters...</span>
        </div>
      ) : (searchQuery.trim() !== "" || activeCategory !== "All") ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center text-[10px] font-mono px-1">
            <span className="text-slate-450 uppercase">Search Results ({totalResultsCount} found)</span>
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="text-indigo-400 font-bold hover:underline">Clear Search</button>
            )}
          </div>

          {totalResultsCount === 0 ? (
            <div className="bg-slate-900 border border-slate-850 p-12 rounded-2xl text-center space-y-3.5">
              <ShieldAlert className="w-8 h-8 text-amber-500 mx-auto" />
              <h4 className="font-bold text-white text-xs font-mono lowercase">No ecosystem results matched your parameters</h4>
              <p className="text-[11px] text-slate-500 max-w-sm mx-auto leading-relaxed">
                Refine the query or check are other facet categories. Try searching for skills like "Rust", "React", "TypeScript", or "Figma".
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {filteredResults.map(section => {
                if (section.data.length === 0) return null;
                return (
                  <div key={section.category} className="space-y-3 text-left">
                    <div className="flex items-center gap-2 px-1 border-b border-slate-850 pb-1.5">
                      <h3 className="text-xs font-bold font-mono text-white tracking-widest uppercase">
                        {section.category}
                      </h3>
                      <span className="text-[9px] font-mono bg-slate-950 text-indigo-400 px-2 py-0.5 rounded-full font-bold">{section.data.length}</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {section.data.map(item => section.renderCard(item))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* STANDARD EMPTY STATE / EXPLORE PRESETS CAROUSELS HOME HUB */
        <div className="space-y-8 animate-in fade-in duration-200">
          
          {/* CAROUSEL 1: PROJECTS */}
          <div className="space-y-3">
            <div className="flex justify-between items-center px-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <h3 className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-widest">
                  Trending Projects
                </h3>
              </div>
              <button 
                onClick={() => onNavigate("build")} 
                className="text-[10px] text-indigo-400 hover:text-indigo-300 font-mono font-bold flex items-center gap-0.5 cursor-pointer"
              >
                All Projects →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {defaultProjects.slice(0, 4).map(proj => (
                <div key={proj.id} className="bg-slate-900 border border-slate-850 p-4.5 rounded-xl flex flex-col justify-between gap-3 hover:border-slate-800 transition-colors">
                  <div className="space-y-1.5">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-bold text-white text-xs line-clamp-1">{proj.title}</h4>
                      <button onClick={() => handleToggleStar(proj.id)} className="p-1 rounded bg-slate-950 border border-slate-850 text-slate-450 hover:text-white transition-all scale-95 shrink-0">
                        <Star className={`w-3 h-3 ${starredProjects.includes(proj.id) ? "text-amber-400 fill-amber-400" : ""}`} />
                      </button>
                    </div>
                    <p className="text-[10.5px] text-slate-450 line-clamp-2 leading-relaxed">{proj.description}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-850/80 flex justify-between items-center">
                    <div className="flex gap-1 overflow-hidden">
                      {(proj.skillsRequired || ["React", "CSS"]).slice(0, 2).map((s: string) => (
                        <span key={s} className="px-1.5 py-0.5 bg-slate-950 border border-slate-850 rounded text-[8.5px] text-slate-550 font-mono">{s}</span>
                      ))}
                    </div>
                    <span className="text-[10px] font-bold font-mono text-indigo-400">★ {proj.starsCount || 23} Stars</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CAROUSEL 2: MENTORS */}
          <div className="space-y-3">
            <div className="flex justify-between items-center px-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-500" />
                <h3 className="text-xs font-bold font-mono text-orange-400 uppercase tracking-widest">
                  Active Tech Mentors
                </h3>
              </div>
              <button 
                onClick={() => { setActiveCategory("Mentors"); }}
                className="text-[10px] text-indigo-400 hover:text-indigo-300 font-mono font-bold flex items-center gap-0.5 cursor-pointer"
              >
                Mentors Network →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {defaultMentors.slice(0, 4).map(mentor => (
                <div key={mentor.id} className="bg-slate-900 border border-slate-850 p-4.5 rounded-xl flex items-center justify-between gap-3.5 hover:border-slate-800 transition-colors">
                  <div className="flex gap-3 items-center min-w-0">
                    <UserProfileLink userId={mentor.id}>
                      <img src={mentor.avatarUrl} alt={mentor.fullName} className="w-11 h-11 rounded-full object-cover border border-slate-800 shrink-0" referrerPolicy="no-referrer" />
                    </UserProfileLink>
                    <div className="min-w-0">
                      <UserProfileLink userId={mentor.id} className="font-bold text-white text-xs truncate hover:underline block leading-none mb-1">
                        {mentor.fullName}
                      </UserProfileLink>
                      <p className="text-[10px] text-slate-450 truncate leading-snug">{mentor.headline}</p>
                      <span className="inline-block text-[8px] tracking-wide font-bold bg-orange-500/10 text-orange-400 border border-orange-500/15 px-1.5 py-0.5 rounded font-mono mt-1">
                        Focus: {mentor.focusArea}
                      </span>
                    </div>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" title="Online" />
                </div>
              ))}
            </div>
          </div>

          {/* CAROUSEL 3: ECOSYSTEM HACKATHONS */}
          <div className="space-y-3">
            <div className="flex justify-between items-center px-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <h3 className="text-xs font-bold font-mono text-amber-400 uppercase tracking-widest">
                  Live Campus Hackathons
                </h3>
              </div>
              <button 
                onClick={() => { setActiveCategory("Hackathons"); }}
                className="text-[10px] text-indigo-400 hover:text-indigo-300 font-mono font-bold flex items-center gap-0.5 cursor-pointer"
              >
                Calendar Index →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {defaultHackathons.slice(0, 3).map(hack => (
                <div key={hack.id} className="bg-slate-900 border border-slate-850 p-4 rounded-xl flex flex-col justify-between hover:border-slate-800 transition-colors">
                  <div className="space-y-1.5">
                    <span className="text-[8px] font-mono bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide inline-block">
                      {hack.category}
                    </span>
                    <h4 className="font-bold text-white text-xs line-clamp-1">{hack.title}</h4>
                    <p className="text-[9px] font-mono text-slate-500">{hack.date}</p>
                  </div>
                  <div className="pt-3 border-t border-slate-850/60 flex justify-between items-center text-[10px] font-mono mt-4">
                    <span className="text-emerald-400 font-bold">{hack.prize}</span>
                    <button onClick={() => onNavigate("home")} className="text-indigo-400 font-bold hover:underline">Form Squad</button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RETRO CAMPUS TECH SEMINARS PREVIEW */}
          <div className="space-y-3">
            <div className="flex justify-between items-center px-1">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-pink-500" />
                <h3 className="text-xs font-bold font-mono text-pink-400 uppercase tracking-widest">
                  Upcoming Tech Seminars
                </h3>
              </div>
              <span className="text-[9px] font-mono text-slate-500 uppercase lowercase">Auditorium sessions</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-sans text-xs">
              {[
                { id: "e1", title: "Solidity Auditing & Scrutiny", location: "Seminar Block, Delhi", date: "June 24, 2026", speaker: "Shashank Gupta (Security)" },
                { id: "e2", title: "Figma UX Micro-Animations", location: "Design Hall, Bangalore", date: "June 28, 2026", speaker: "Prachi Verma (UX Lead)" },
                { id: "e3", title: "Edge ML models on IoT Edge", location: "Computer Labs, Bits Goa", date: "July 02, 2026", speaker: "Aditya Roy (Intel Corp)" }
              ].map(event => (
                <div key={event.id} className="bg-slate-900 border border-slate-850 p-4 rounded-xl flex flex-col justify-between hover:border-slate-800 transition-all">
                  <div className="space-y-1">
                    <h4 className="font-bold text-white text-[11px] tracking-tight">{event.title}</h4>
                    <span className="text-[9.5px] text-indigo-400 font-mono block">{event.speaker}</span>
                  </div>
                  <div className="pt-2.5 mt-3 border-t border-slate-850/60 flex justify-between items-center text-[9px] font-mono text-slate-500">
                    <span>{event.location}</span>
                    <span className="text-slate-450 italic">{event.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
