import React, { useState, useEffect } from "react";
import { 
  Compass, Star, Flame, Users, Calendar, Award, ExternalLink, 
  UserCheck, UserPlus, ShieldAlert, Cpu, Heart, ChevronRight, GraduationCap, Briefcase, Sparkles 
} from "lucide-react";

interface ExploreHubProps {
  onNavigate: (tabId: string) => void;
  currentUser?: any;
}

export default function ExploreHub({ onNavigate, currentUser }: ExploreHubProps) {
  // State live data from backend
  const [projectsList, setProjectsList] = useState<any[]>([]);
  const [teamsList, setTeamsList] = useState<any[]>([]);
  const [startupPitchesList, setStartupPitchesList] = useState<any[]>([]);
  const [openSourceIssuesList, setOpenSourceIssuesList] = useState<any[]>([]);
  const [mentorsOnlineList, setMentorsOnlineList] = useState<any[]>([]);
  const [upcomingEventsList, setUpcomingEventsList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [starredProjects, setStarredProjects] = useState<string[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<string[]>([]);

  useEffect(() => {
    let active = true;
    const fetchAllExploreData = async () => {
      try {
        const [resProj, resTeams, resPitches, resOS, resMentors, resEvents] = await Promise.all([
          fetch("/api/projects").then(r => r.ok ? r.json() : []).catch(() => []),
          fetch("/api/teams").then(r => r.ok ? r.json() : []).catch(() => []),
          fetch("/api/co-founders/posts").then(r => r.ok ? r.json() : []).catch(() => []),
          fetch("/api/open-source/issues").then(r => r.ok ? r.json() : []).catch(() => []),
          fetch("/api/mentors").then(r => r.ok ? r.json() : []).catch(() => []),
          fetch("/api/hackathons").then(r => r.ok ? r.json() : []).catch(() => [])
        ]);

        if (active) {
          setProjectsList(Array.isArray(resProj) ? resProj : []);
          setTeamsList(Array.isArray(resTeams) ? resTeams : []);
          setStartupPitchesList(Array.isArray(resPitches) ? resPitches : []);
          setOpenSourceIssuesList(Array.isArray(resOS) ? resOS : []);
          setMentorsOnlineList(Array.isArray(resMentors) ? resMentors : []);
          setUpcomingEventsList(Array.isArray(resEvents) ? resEvents : []);
          setLoading(false);
        }
      } catch (err) {
        console.error("Error loading explore dynamic profiles:", err);
        if (active) setLoading(false);
      }
    };

    fetchAllExploreData();
    return () => {
      active = false;
    };
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

  // Convert real live lists or use high-fidelity placeholders for empty states:
  const trendingProjects = projectsList.length > 0 ? projectsList.slice(0, 6) : [
    { id: "p1", title: "EtherPulse Decentralized Ledger", description: "High performance ledger client written in Rust with gRPC sync hooks.", skillsRequired: ["Rust", "gRPC", "Solidity"], starsCount: 42 },
    { id: "p2", title: "Campus Roommate AI Matcher", description: "Vector databases combined with preferences profiling for safe peer matching.", skillsRequired: ["Python", "Pinecone", "React"], starsCount: 28 },
    { id: "p3", title: "Automated smart compiler", description: "LLM-based parsing and compilation assistance tool featuring absolute type-checks.", skillsRequired: ["TypeScript", "Gemini API", "Esbuild"], starsCount: 35 }
  ];

  const campusHackathons = upcomingEventsList.length > 0 ? upcomingEventsList.slice(0, 6) : [
    { id: "h1", title: "AI Studio National Hackathon 2026", date: "June 20-22, 2026", category: "AI & ML", prize: "$15K Pool" },
    { id: "h2", title: "Superchain Bangalore Devfest", date: "July 04-06, 2026", category: "Web3 Infrastructure", prize: "$10K Pool" },
    { id: "h3", title: "Innovate India Academic Summit", date: "August 12-14, 2026", category: "Sustainability Tech", prize: "$5K Pool" }
  ];

  const expertMentors = mentorsOnlineList.length > 0 ? mentorsOnlineList.slice(0, 6) : [
    { id: "m1", fullName: "Pranav Mistry", headline: "Lead Staff Architect @ Stripe", focusArea: "System Scaling & Payment Scopes", avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80" },
    { id: "m2", fullName: "Rohan Khanna", headline: "Senior Engineer @ Google DeepMind", focusArea: "Large Language Models & Optimization", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80" },
    { id: "m3", fullName: "Kriti Sharma", headline: "Principal Scientist @ Microsoft Research", focusArea: "Secure Cryptography & ZK Rollups", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80" }
  ];

  const openSourceOpportunities = openSourceIssuesList.length > 0 ? openSourceIssuesList.slice(0, 6) : [
    { id: "o1", repository: "google/genai-js", title: "Add token counting support to interactions agent", pointsReward: 70, difficulty: "Medium" },
    { id: "o2", repository: "skillcollab/core-api", title: "Optimize redis cache sync locks for infinite query scroll", pointsReward: 40, difficulty: "Easy" },
    { id: "o3", repository: "tailwind-labs/tailwindcss", title: "Resolve absolute border alignment on responsive dynamic sidebars", pointsReward: 120, difficulty: "Hard" }
  ];

  const startupsList = startupPitchesList.length > 0 ? startupPitchesList.slice(0, 6) : [
    { id: "s1", title: "PayPulse Ledger Inc.", tagline: "Instant invoice discounting via blockchain liquidity routing pools.", roleNeeded: "Fullstack Lead", fundingStage: "Pre-seed" },
    { id: "s2", title: "EduVector Systems", tagline: "Semantic vector engines maps out custom computer science homework curations.", roleNeeded: "ML Engineer", fundingStage: "Bootstrapped" },
    { id: "s3", title: "HealthPulse Diagnostics", tagline: "On-demands edge analytics for medical imaging monitors on IoT.", roleNeeded: "Embedded Systems Specialist", fundingStage: "Seed Round" }
  ];

  const campusEventsList = [
    { id: "e1", title: "Smart Contracts Solidity Scrutiny Session", location: "Block C Seminar Hall, IIT Delhi", date: "June 24, 2026", speaker: "Shashank Gupta (Security Lead)" },
    { id: "e2", title: "Figma UX Micro-Animations Masterclass", location: "Design Auditorium, NID Bangalore", date: "June 28, 2026", speaker: "Prachi Verma (Senior Designer)" },
    { id: "e3", title: "Deploying Edge ML Models with TensorFlow Lite", location: "Computer Labs, Bits Pilani Goas", date: "July 02, 2026", speaker: "Aditya Roy (Intel Innovator)" }
  ];

  if (loading) {
    return (
      <div className="w-full h-80 flex flex-col justify-center items-center gap-3">
        <div className="w-8 h-8 rounded-full border border-slate-800 border-t-indigo-400 animate-spin" />
        <span className="text-[9.5px] font-mono text-indigo-400 font-bold uppercase tracking-wider animate-pulse">Syncing Campus Ecosystem...</span>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-left font-sans">
      
      {/* 1. HERO HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950/30 to-slate-900 border border-slate-850 p-6 rounded-2xl relative overflow-hidden">
        <div className="absolute -right-12 -bottom-12 w-48 h-48 bg-indigo-500/10 blur-3xl rounded-full" />
        <span className="text-[10px] font-mono text-indigo-400 font-extrabold uppercase tracking-widest block mb-1">
          Explore Hub
        </span>
        <h2 className="text-md md:text-lg font-extrabold text-white">Discovery &amp; Campus Innovations</h2>
        <p className="text-xs text-slate-400 mt-1.5 leading-relaxed max-w-xl">
          Swipe through campus-wide active initiatives, registered live hackathons, expert professional connections, OSS issues, startup teams, and tech seminars.
        </p>
      </div>

      {/* CAROUSEL 1: TRENDING PROJECTS */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <h3 className="text-xs font-bold font-mono text-emerald-400 uppercase tracking-wider">
              Trending Projects
            </h3>
          </div>
          <button 
            onClick={() => onNavigate("projects")}
            className="text-[10px] text-indigo-400 hover:text-indigo-300 font-mono font-bold flex items-center gap-0.5 cursor-pointer"
          >
            All Projects →
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 snap-x scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent pr-1">
          {trendingProjects.map((proj: any) => (
            <div 
              key={proj.id} 
              className="w-72 sm:w-80 shrink-0 snap-start bg-slate-900 border border-slate-850 p-4 rounded-xl flex flex-col justify-between hover:border-slate-750 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <h4 className="font-bold text-white text-xs leading-snug tracking-tight font-sans line-clamp-1">{proj.title}</h4>
                  <button 
                    onClick={() => handleToggleStar(proj.id)}
                    className="p-1 rounded-lg bg-slate-950 border border-slate-850 text-slate-450 hover:text-white transition-all scale-90"
                  >
                    <Star className={`w-3 h-3 ${starredProjects.includes(proj.id) ? "text-amber-400 fill-amber-400" : ""}`} />
                  </button>
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed h-8">
                  {proj.description || "Active student developer team collaboration initiative."}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-850 flex justify-between items-center">
                <div className="flex gap-1 overflow-hidden max-w-44">
                  {(proj.skillsRequired || proj.skillsNeeded || []).slice(0, 2).map((skill: string) => (
                    <span key={skill} className="px-2 py-0.5 bg-slate-950 border border-slate-850 text-slate-500 rounded text-[9px] font-mono whitespace-nowrap">
                      {skill}
                    </span>
                  ))}
                </div>
                <span className="text-[10px] font-mono text-indigo-400 font-bold">★ {proj.starsCount || 10} Stars</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CAROUSEL 2: HACKATHONS */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <h3 className="text-xs font-bold font-mono text-amber-500 uppercase tracking-wider">
              Ecosystem Hackathons
            </h3>
          </div>
          <button 
            onClick={() => onNavigate("hackathons")}
            className="text-[10px] text-indigo-400 hover:text-indigo-300 font-mono font-bold flex items-center gap-0.5 cursor-pointer"
          >
            Ecosystem Board →
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 snap-x scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent pr-1">
          {campusHackathons.map((hack: any) => (
            <div 
              key={hack.id} 
              className="w-72 sm:w-80 shrink-0 snap-start bg-slate-900 border border-slate-850 p-4 rounded-xl flex flex-col justify-between hover:border-slate-800 transition-all relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-amber-500/5 blur-xl rounded-full" />
              <div className="space-y-2">
                <span className="text-[8.5px] font-mono text-amber-500 font-extrabold bg-amber-500/10 px-2 py-0.5 rounded-full uppercase">
                  {hack.category || "Hack-Fest"}
                </span>
                <h4 className="font-bold text-white text-xs leading-snug line-clamp-1">{hack.title}</h4>
                <p className="text-[10.5px] text-slate-500 font-mono flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-600" /> {hack.date || "June 25, 2026"}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-850/80 flex justify-between items-center">
                <div className="text-left">
                  <span className="text-[8.5px] text-slate-500 block uppercase font-mono">Prize Pool</span>
                  <span className="text-xs font-mono font-bold text-emerald-400">{hack.prize || "$5K POOL"}</span>
                </div>
                <button 
                  onClick={() => onNavigate("hackathons")}
                  className="px-3 py-1 bg-indigo-650 hover:bg-indigo-600 text-white rounded-lg text-[10px] font-mono font-bold tracking-wide cursor-pointer active:scale-95 transition-all"
                >
                  Join Squads
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CAROUSEL 3: MENTORS */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            <h3 className="text-xs font-bold font-mono text-indigo-400 uppercase tracking-wider">
              Expert Mentors
            </h3>
          </div>
          <button 
            onClick={() => onNavigate("mentors")}
            className="text-[10px] text-indigo-400 hover:text-indigo-300 font-mono font-bold flex items-center gap-0.5 cursor-pointer"
          >
            Mentors Net →
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 snap-x scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent pr-1">
          {expertMentors.map((mentor: any) => (
            <div 
              key={mentor.id} 
              className="w-72 sm:w-80 shrink-0 snap-start bg-slate-900 border border-slate-850 p-4 rounded-xl flex items-center gap-3.5 hover:border-slate-800 transition-colors"
            >
              <img 
                src={mentor.avatarUrl} 
                alt={mentor.fullName} 
                className="w-12 h-12 rounded-full object-cover border border-slate-800 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="space-y-1 min-w-0">
                <h4 className="font-bold text-white text-xs truncate flex items-center gap-1.5 leading-none">
                  {mentor.fullName}
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </h4>
                <p className="text-[10px] text-slate-400 truncate leading-tight font-sans">{mentor.headline}</p>
                <div className="flex items-center gap-1 pt-1.5">
                  <span className="text-[8.5px] bg-orange-500/10 text-orange-400 px-1.5 py-0.5 rounded font-mono truncate max-w-full">
                    Focus: {mentor.focusArea || "Scoping"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CAROUSEL 4: OPEN SOURCE OPPORTUNITIES */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-violet-500" />
            <h3 className="text-xs font-bold font-mono text-violet-400 uppercase tracking-wider">
              Open Source Opportunities
            </h3>
          </div>
          <button 
            onClick={() => onNavigate("open_source")}
            className="text-[10px] text-indigo-400 hover:text-indigo-300 font-mono font-bold flex items-center gap-0.5 cursor-pointer"
          >
            OS Suite →
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 snap-x scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent pr-1">
          {openSourceOpportunities.map((issue: any) => (
            <div 
              key={issue.id} 
              className="w-72 sm:w-80 shrink-0 snap-start bg-slate-900 border border-slate-850 p-4 rounded-xl flex flex-col justify-between hover:border-slate-800 transition-all relative overflow-hidden"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-[9px] font-mono text-slate-500 truncate max-w-44 block">{issue.repository}</span>
                  <span className="text-[8px] font-mono px-1 py-0.5 bg-violet-500/10 text-violet-400 rounded uppercase font-bold">{issue.difficulty}</span>
                </div>
                <h4 className="font-bold text-white text-[11px] leading-snug line-clamp-2 h-9">{issue.title}</h4>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-850 flex justify-between items-center">
                <span className="text-[10px] font-mono text-emerald-400 font-bold">+{issue.pointsReward || 50} Rep Bonus</span>
                <button 
                  onClick={() => onNavigate("open_source")}
                  className="px-2.5 py-1 bg-slate-950 hover:bg-slate-855 border border-slate-800 text-[10px] font-mono font-bold text-indigo-300 flex items-center gap-1 rounded transition-colors cursor-pointer"
                >
                  Resolve issue <ExternalLink className="w-2.5 h-2.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CAROUSEL 5: STARTUPS */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-500" />
            <h3 className="text-xs font-bold font-mono text-cyan-400 uppercase tracking-wider">
              Startup Launchpad
            </h3>
          </div>
          <button 
            onClick={() => onNavigate("startup_launchpad")}
            className="text-[10px] text-indigo-400 hover:text-indigo-300 font-mono font-bold flex items-center gap-0.5 cursor-pointer"
          >
            Launchpad →
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 snap-x scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent pr-1">
          {startupsList.map((startup: any) => (
            <div 
              key={startup.id} 
              className="w-72 sm:w-80 shrink-0 snap-start bg-slate-900 border border-slate-850 p-4 rounded-xl flex flex-col justify-between hover:border-slate-800 transition-colors"
            >
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-white text-xs leading-none">{startup.title}</h4>
                  <span className="text-[8px] bg-[#a855f7]/10 text-[#c084fc] px-1.5 py-0.5 rounded uppercase font-bold font-mono">{startup.fundingStage || "Pre-seed"}</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-2 h-8">{startup.tagline}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-850 flex justify-between items-center">
                <span className="text-[9.5px] font-mono text-slate-500">Recruiting: <strong className="text-indigo-400 font-semibold">{startup.roleNeeded}</strong></span>
                <button 
                  onClick={() => onNavigate("startup_launchpad")}
                  className="px-3 py-1 bg-indigo-650 hover:bg-indigo-600 text-white rounded text-[10px] font-mono font-bold font-semibold transition-colors cursor-pointer"
                >
                  Join Build
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CAROUSEL 6: CAMPUS EVENTS */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-pink-500" />
            <h3 className="text-xs font-bold font-mono text-pink-400 uppercase tracking-wider">
              Campus Events &amp; Seminars
            </h3>
          </div>
          <button 
            onClick={() => onNavigate("home")}
            className="text-[10px] text-indigo-400 hover:text-indigo-300 font-mono font-bold flex items-center gap-0.5 cursor-pointer"
          >
            Schedules →
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 snap-x scrollbar-thin scrollbar-thumb-slate-800 scrollbar-track-transparent pr-1">
          {campusEventsList.map((event: any) => (
            <div 
              key={event.id} 
              className="w-72 sm:w-80 shrink-0 snap-start bg-slate-900 border border-slate-850 p-4 rounded-xl flex flex-col justify-between hover:border-slate-800 transition-colors"
            >
              <div className="space-y-2">
                <span className="text-[8.5px] font-mono text-pink-400 font-extrabold bg-pink-500/10 px-2 py-0.5 rounded-full uppercase">
                  Seminar
                </span>
                <h4 className="font-bold text-white text-xs leading-snug line-clamp-1">{event.title}</h4>
                <div className="text-[10px] text-slate-500 leading-none">Speaker: {event.speaker}</div>
                <p className="text-[10px] text-slate-400 font-mono pt-1">📍 {event.location}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-850 flex justify-between items-center">
                <span className="text-[9.5px] font-mono text-slate-500">{event.date}</span>
                <button 
                  onClick={() => handleRegisterEvent(event.id)}
                  className={`px-3 py-1.5 rounded-lg text-[9.5px] font-mono font-bold transition-all cursor-pointer ${
                    registeredEvents.includes(event.id)
                      ? "bg-emerald-650 text-white"
                      : "bg-indigo-650 hover:bg-indigo-600 text-white"
                  }`}
                >
                  {registeredEvents.includes(event.id) ? "RSVP'd ✓" : "RSVP Seat"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
