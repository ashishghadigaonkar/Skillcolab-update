import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ArrowRight, Users, Trophy, GraduationCap, HelpCircle, 
  Star, Search, ArrowUpRight, CheckCircle, Code, Shield, Sparkles, ChevronDown,
  Sun, Moon
} from "lucide-react";
import { KrenzaLogo } from "../shared/components/KrenzaLogo";
import { useTheme } from "../theme/useTheme";

interface LandingPageProps {
  currentUser: any;
  onNavigateAuth: (step: "login" | "signup") => void;
  onEnterWorkspace: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  currentUser,
  onNavigateAuth,
  onEnterWorkspace
}) => {
  const { theme, toggleTheme } = useTheme();
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  
  // Interactive Demo Sandbox State
  const [demoRole, setDemoRole] = useState<"developer" | "designer" | "manager">("developer");
  const [demoSkillInput, setDemoSkillInput] = useState("");
  const [demoSkills, setDemoSkills] = useState<string[]>(["React", "Solidity"]);
  
  const faqs = [
    {
      q: "What is Krenza and who is it for?",
      a: "Krenza is a premium product designed specifically for college students, student developers, and student engineers to assemble interdisciplinary teams, find hackathon partners on-campus, book verified technical mentors, and discover real internship opportunities."
    },
    {
      q: "How does the academic peer verification work?",
      a: "Our verification engine connects directly to campus profiles and repositories. When you submit commits or PRs on GitHub, the system automatically runs checks to verify your contribution, granting you credentials and verified project skills."
    },
    {
      q: "How can I earn Reputation Points (PT)?",
      a: "You earn reputation points by helping on open-source repositories, completing college projects, assisting of other students as a mentor, or winning affiliated student hackathons. High reputation helps you filter through top-tier projects first."
    },
    {
      q: "Is Krenza free for university students?",
      a: "Yes, Krenza is 100% free of charge for college student organizations, university research developers, and individual student learners."
    }
  ];

  const valueProps = [
    {
      icon: <Users className="w-5 h-5 text-indigo-400" />,
      title: "Assembles Core Teams",
      desc: "Assemble teams based on verified skill graphs, matching developers with UI/UX designers and product managers seamlessly."
    },
    {
      icon: <Trophy className="w-5 h-5 text-emerald-400" />,
      title: "Affiliated Hackathons",
      desc: "Join student hackathons on-campus or globally and find complementary partner matches in minutes."
    },
    {
      icon: <GraduationCap className="w-5 h-5 text-cyan-400" />,
      title: "Verified Mentors",
      desc: "Schedule direct 1-on-1 audio/video sessions with experienced senior student mentors or alumni designers."
    }
  ];

  const testimonials = [
    {
      name: "Rohan Sharma",
      role: "Stanford '26 • Fullstack Dev",
      quote: "Krenza's reputation points helped me recruit a world-class UI designer for our Stanford Hackathon team. We ended up taking 1st place!",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80",
      rating: 5
    },
    {
      name: "Ananya Patel",
      role: "MIT '25 • Product Designer",
      quote: "The ability to look at peer verification profiles rather than just resumes was a game changer. I knew exactly who had real coding experience.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&h=120&q=80",
      rating: 5
    },
    {
      name: "Vikram Malhotra",
      role: "UC Berkeley '27 • System Engineer",
      quote: "Finding high-quality software internships without getting lost in applicant tracking networks is finally possible. Highly recommend Krenza!",
      avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&h=120&q=80",
      rating: 5
    }
  ];

  // Live Match Simulator Demo Logic
  const demoCandidates = [
    { name: "Saurav K.", college: "MIT", role: "developer", skills: ["Python", "Rust", "React"], rating: 4.9, avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=80&h=80&q=80" },
    { name: "Elena R.", college: "Stanford", role: "designer", skills: ["Figma", "UI Design", "Tailwind"], rating: 4.8, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80" },
    { name: "Justin M.", college: "UC Berkeley", role: "manager", skills: ["Agile", "Product Specs", "SaaS"], rating: 4.7, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=80&h=80&q=80" },
    { name: "Priyah N.", college: "Harvard", role: "developer", skills: ["Solidity", "React", "Go"], rating: 5.0, avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&h=80&q=80" },
    { name: "Aris T.", college: "CMU", role: "designer", skills: ["Figma", "Interaction Design", "Rive"], rating: 4.9, avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=80&h=80&q=80" }
  ];

  const filteredDemo = demoCandidates.filter(c => {
    // Match role
    if (c.role !== demoRole) return false;
    // Match any selected demoSkill
    if (demoSkills.length === 0) return true;
    return c.skills.some(s => demoSkills.map(ds => ds.toLowerCase()).includes(s.toLowerCase()));
  });

  const handleAddDemoSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (demoSkillInput.trim() && !demoSkills.includes(demoSkillInput.trim())) {
      setDemoSkills([...demoSkills, demoSkillInput.trim()]);
      setDemoSkillInput("");
    }
  };

  const handleRemoveDemoSkill = (skill: string) => {
    setDemoSkills(demoSkills.filter(s => s !== skill));
  };

  // Framer motion variant mappings
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 70,
        damping: 15,
        mass: 1
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans relative overflow-x-hidden selection:bg-indigo-600 selection:text-white">
      {/* Interactive Floating Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[650px] pointer-events-none opacity-40 select-none z-0">
        <motion.div 
          animate={{ 
            y: [0, -20, 10, -20, 0],
            scale: [1, 1.08, 0.95, 1.08, 1],
            rotate: [0, 10, -10, 10, 0]
          }}
          transition={{ 
            duration: 12, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute top-[-100px] left-[15%] w-[450px] h-[450px] bg-indigo-600/20 rounded-full blur-[120px]" 
        />
        <motion.div 
          animate={{ 
            y: [0, 20, -15, 20, 0],
            scale: [1, 0.92, 1.06, 0.92, 1],
            rotate: [0, -12, 12, -12, 0]
          }}
          transition={{ 
            duration: 15, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute top-[120px] right-[10%] w-[500px] h-[500px] bg-cyan-500/15 rounded-full blur-[150px]" 
        />
      </div>

      {/* STICKY GLASSMORPHIC NAVBAR WITH SUBTLE SLIDE-DOWN */}
      <motion.nav 
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        id="landing-navbar" 
        className="sticky top-0 z-50 w-full bg-slate-950/85 backdrop-blur-md border-b border-slate-850/60 transition-all duration-300"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <KrenzaLogo size={32} theme={theme} variant="full" />
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-indigo-400 transition-colors relative group py-2">
              Features
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-500 transition-all group-hover:w-full" />
            </a>
            <a href="#sandbox" className="hover:text-indigo-400 transition-colors relative group py-2">
              Interactive Sandbox
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-500 transition-all group-hover:w-full" />
            </a>
            <a href="#testimonials" className="hover:text-indigo-400 transition-colors relative group py-2">
              Alumni Stories
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-500 transition-all group-hover:w-full" />
            </a>
            <a href="#faqs" className="hover:text-indigo-400 transition-colors relative group py-2">
              FAQ
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-500 transition-all group-hover:w-full" />
            </a>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-slate-900/50 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white cursor-pointer transition-colors shadow-sm flex items-center justify-center"
              title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
            >
              {theme === "light" ? (
                <Moon className="w-4 h-4 text-indigo-600" />
              ) : (
                <Sun className="w-4 h-4 text-amber-400" />
              )}
            </motion.button>

            {currentUser ? (
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                id="navbar-workspace-btn"
                onClick={onEnterWorkspace}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center gap-2 cursor-pointer transition-all shadow-lg shadow-indigo-600/20"
              >
                Open Workspace <ArrowRight className="w-4 h-4" />
              </motion.button>
            ) : (
              <>
                <button 
                  id="navbar-login-btn"
                  onClick={() => onNavigateAuth("login")}
                  className="px-4 py-2.5 text-xs text-slate-300 hover:text-white font-semibold cursor-pointer"
                >
                  Sign In
                </button>
                <motion.button 
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  id="navbar-signup-btn"
                  onClick={() => onNavigateAuth("signup")}
                  className="px-4.5 py-2.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-indigo-400 hover:text-indigo-300 font-bold rounded-xl text-xs cursor-pointer transition-all shadow-sm"
                >
                  Create Account
                </motion.button>
              </>
            )}
          </div>
        </div>
      </motion.nav>

      {/* STAGGERED HERO SECTION */}
      <motion.section 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative pt-16 md:pt-28 pb-20 md:pb-32 px-4 max-w-7xl mx-auto text-center space-y-8 z-10"
      >
        <motion.div 
          variants={itemVariants}
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 bg-indigo-600/10 border border-indigo-500/20 ${theme === "light" ? "text-indigo-650" : "text-indigo-300"} text-[10px] sm:text-xs font-mono font-bold uppercase rounded-full tracking-wider shadow-inner`}
        >
          <Sparkles className={`w-3.5 h-3.5 ${theme === "light" ? "text-indigo-650" : "text-indigo-400"} animate-spin-slow`} /> Platform Redesigned For High-End Collaborations
        </motion.div>

        <motion.h1 
          variants={itemVariants}
          className="text-3xl sm:text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-tight max-w-4xl mx-auto font-sans"
        >
          The Premier Gateway for <span className={`bg-gradient-to-r ${theme === "light" ? "from-indigo-650 via-indigo-500 to-cyan-600" : "from-indigo-400 via-indigo-500 to-cyan-400"} bg-clip-text text-transparent`}>Collegiate Creators</span>
        </motion.h1>

        <motion.p 
          variants={itemVariants}
          className="text-sm sm:text-lg text-slate-400 leading-relaxed max-w-2xl mx-auto"
        >
          Assemble multidisciplinary project teams, get auto-verified via GitHub, win student hackathons, and book university technical mentors.
        </motion.p>

        <motion.div 
          variants={itemVariants}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
        >
          {currentUser ? (
            <motion.button 
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              id="hero-enter-workspace-btn"
              onClick={onEnterWorkspace}
              className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm justify-center flex items-center gap-2.5 cursor-pointer shadow-lg shadow-indigo-600/20 transition-all"
            >
              Enter Dashboard <ArrowRight className="w-4 h-4" />
            </motion.button>
          ) : (
            <>
              <motion.button 
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                id="hero-get-started-btn"
                onClick={() => onNavigateAuth("signup")}
                className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm justify-center flex items-center gap-2.5 cursor-pointer shadow-lg shadow-indigo-600/20 transition-all"
              >
                Get Started Free <ArrowRight className="w-4 h-4" />
              </motion.button>
              <button 
                id="hero-watch-demo-btn"
                onClick={() => {
                  const target = document.getElementById("sandbox");
                  if (target) target.scrollIntoView({ behavior: "smooth" });
                }}
                className="w-full sm:w-auto px-8 py-3.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white font-semibold rounded-xl text-sm justify-center flex items-center gap-2 cursor-pointer transition-all"
              >
                Try Active Sandbox
              </button>
            </>
          )}
        </motion.div>

        {/* Dynamic Trust Badges with Staggered Viewport Reveal */}
        <motion.div 
          variants={itemVariants}
          className="pt-10 text-[11px] font-mono uppercase tracking-[0.15em] text-slate-500 space-y-4"
        >
          <span>Trusted by builders standing across leading campuses</span>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 font-bold text-slate-400/70">
            {["STANFORD", "UC BERKELEY", "MIT", "CMU", "HARVARD"].map((uni, uiIndex) => (
              <motion.span 
                key={uni}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 + uiIndex * 0.1, duration: 0.4 }}
                className="hover:text-white transition-colors cursor-default"
              >
                {uni}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </motion.section>

      {/* CORE VALUE PROPOSITIONS BENTO GRID with individual scroll-reveal cards */}
      <section id="features" className="py-20 md:py-28 border-t border-slate-900 bg-slate-950 px-4 scroll-mt-18">
        <div className="max-w-7xl mx-auto space-y-12">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-3"
          >
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white font-sans">Full-Stack Collegiate Experience</h2>
            <p className="text-sm text-slate-400 max-w-lg mx-auto">No fluff, no placeholder mock data. A highly polished architecture built for growth.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {valueProps.map((p, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: idx * 0.15 }}
                whileHover={{ y: -6, borderColor: "rgba(99, 102, 241, 0.4)", backgroundColor: "rgba(15, 23, 42, 0.6)" }}
                className="p-6 rounded-2xl bg-slate-900/40 border border-slate-850 hover:border-slate-800 transition-all text-left relative overflow-hidden group"
              >
                <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center mb-4 shadow-inner group-hover:scale-110 transition-transform">
                  {p.icon}
                </div>
                <h3 className="text-md font-bold text-white mb-2">{p.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{p.desc}</p>
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-2xl pointer-events-none transition-opacity opacity-0 group-hover:opacity-100" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* INTERACTIVE MATCHING SANDBOX DEMO */}
      <section id="sandbox" className="py-20 md:py-28 border-t border-slate-900 bg-slate-900/10 px-4 scroll-mt-18">
        <div className="max-w-5xl mx-auto space-y-10">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-3"
          >
            <div className="mx-auto w-10 h-10 rounded-xl bg-indigo-600/15 flex items-center justify-center border border-indigo-500/20 text-indigo-400">
              <Code className="w-5 h-5 animate-pulse" />
            </div>
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white font-sans">Interactive Matching Sandbox</h2>
            <p className="text-sm text-slate-400 max-w-lg mx-auto">Test out Krenza's matchmaking pipeline live on the page! Filter by role or skills.</p>
          </motion.div>

          {/* Sandbox Workspace Card with custom entry motion */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ type: "spring", stiffness: 50, damping: 15 }}
            className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl grid grid-cols-1 md:grid-cols-3 hover:shadow-indigo-500/5 transition-all duration-500"
          >
            {/* Design Panel */}
            <div className="p-6 border-r border-slate-850 space-y-6 text-left">
              <h3 className="text-xs uppercase font-mono tracking-wider font-bold text-indigo-400">1. Define Target Match</h3>
              
              {/* Role Selection */}
              <div className="space-y-2">
                <label className="block text-[11px] text-slate-400 uppercase font-mono tracking-wide">Target Role</label>
                <div className="grid grid-cols-3 gap-2">
                  {(["developer", "designer", "manager"] as const).map(role => (
                    <button
                      key={role}
                      onClick={() => setDemoRole(role)}
                      className={`py-2 px-2 rounded-lg text-[10px] font-bold uppercase transition-all border cursor-pointer ${
                        demoRole === role 
                          ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/15" 
                          : "bg-slate-950 border-slate-850 text-slate-400 hover:text-white"
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </div>

              {/* Skill Tags */}
              <div className="space-y-2">
                <label className="block text-[11px] text-slate-400 uppercase font-mono tracking-wide">Target Skills</label>
                <form onSubmit={handleAddDemoSkill} className="flex gap-2">
                  <input
                    type="text"
                    value={demoSkillInput}
                    onChange={(e) => setDemoSkillInput(e.target.value)}
                    placeholder="e.g. React, Figma..."
                    className="flex-1 bg-slate-950 border border-slate-850 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500 placeholder:text-slate-600 leading-none"
                  />
                  <button 
                    type="submit"
                    className="px-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg cursor-pointer transition-all active:scale-95"
                  >
                    Add
                  </button>
                </form>

                {/* Tags container */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  <AnimatePresence>
                    {demoSkills.map(skill => (
                      <motion.span 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        key={skill}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-950 border border-slate-850 text-slate-300 text-[10px] rounded-lg cursor-pointer hover:border-red-500/30 hover:text-red-400 transition-colors"
                        onClick={() => handleRemoveDemoSkill(skill)}
                      >
                        {skill} <span className="text-[9px] text-slate-500 font-bold">×</span>
                      </motion.span>
                    ))}
                  </AnimatePresence>
                  {demoSkills.length === 0 && (
                    <span className="text-[10px] text-slate-500 italic">No skill filter active</span>
                  )}
                </div>
              </div>

              <div className="p-3 bg-indigo-950/20 rounded-xl border border-indigo-900/30 text-[10px] text-slate-400 leading-normal">
                💻 <strong className="text-white">Simulator Node:</strong> Adding skill tags queries corresponding member profiles instantly on client side.
              </div>
            </div>

            {/* Results Panel */}
            <div className="col-span-2 p-6 bg-slate-950 flex flex-col justify-between text-left min-h-[300px]">
              <div>
                <div className="flex justify-between items-center pb-3 border-b border-slate-850 mb-4">
                  <h3 className="text-xs uppercase font-mono tracking-wider font-bold text-slate-300">2. Matches Found ({filteredDemo.length})</h3>
                  <span className="text-[10px] text-indigo-400 font-mono flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> SIM TIME 2ms
                  </span>
                </div>

                <div className="space-y-3 max-h-[220px] overflow-y-auto custom-scrollbar pr-1">
                  <AnimatePresence mode="popLayout">
                    {filteredDemo.map((c, idx) => (
                      <motion.div
                        layout
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ type: "spring", stiffness: 100, damping: 15 }}
                        key={c.name}
                        className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-850 flex items-center justify-between hover:bg-slate-900 hover:border-slate-800 transition-colors group"
                      >
                        <div className="flex items-center gap-3">
                          <img 
                            src={c.avatar} 
                            alt={c.name} 
                            className="w-10 h-10 rounded-xl object-cover border border-slate-800 transition-transform group-hover:scale-105"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <strong className="text-xs text-white font-sans">{c.name}</strong>
                              <span className="px-1.5 py-0.5 bg-slate-950 text-slate-400 text-[8px] font-mono rounded">
                                {c.college}
                              </span>
                            </div>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {c.skills.map(s => (
                                <span key={s} className="px-1.5 py-0.5 bg-indigo-950/40 text-indigo-300 text-[8px] rounded border border-indigo-900/20">
                                  {s}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="text-[9px] font-mono text-slate-500 uppercase block font-bold">Matching Index</span>
                          <span className="text-xs font-mono font-bold text-indigo-400">{(c.rating * 20).toFixed(0)}% Match</span>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {filteredDemo.length === 0 && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-12 text-slate-500 text-xs italic space-y-2"
                    >
                      <p>No candidates match your chosen combination.</p>
                      <button 
                        onClick={() => { setDemoSkills([]); setDemoRole("developer"); }}
                        className="text-xs font-bold text-indigo-400 hover:underline cursor-pointer"
                      >
                        Reset filters
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-850/60 mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-slate-400 text-[10px]">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-indigo-500" /> Authenticated keys ensure full workspace features.
                </span>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigateAuth("signup")}
                  className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg cursor-pointer transition-all pr-7 relative overflow-hidden"
                >
                  Join Krenza Workspace & Write Code <ArrowRight className="w-3 h-3 absolute right-2.5 top-1/2 -translate-y-1/2 animate-pulse" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* STUDENT TESTIMONIALS */}
      <section id="testimonials" className="py-20 md:py-28 border-t border-slate-900 bg-slate-950 px-4 scroll-mt-18">
        <div className="max-w-7xl mx-auto space-y-12">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-3"
          >
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white font-sans">Tested On Campus</h2>
            <p className="text-sm text-slate-400 max-w-lg mx-auto">See how students are using Krenza to optimize their development pipelines.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                whileHover={{ y: -6, borderColor: "rgba(99, 102, 241, 0.3)" }}
                className="p-6 rounded-2xl bg-slate-900/30 border border-slate-850 flex flex-col justify-between text-left transition-colors hover:bg-slate-900/50"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-1">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-500" />
                    ))}
                  </div>
                  <p className="text-xs text-slate-300 italic leading-relaxed">
                    "{t.quote}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-6 mt-6 border-t border-slate-850">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-slate-800" referrerPolicy="no-referrer" />
                  <div>
                    <h4 className="text-xs font-bold text-white leading-tight">{t.name}</h4>
                    <span className="text-[10px] text-slate-500 font-mono block mt-0.5">{t.role}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ ACCORDION WITH ANIMATED CHEVRON TRIGGERS */}
      <section id="faqs" className="py-20 md:py-28 border-t border-slate-900 bg-slate-900/10 px-4 scroll-mt-18">
        <div className="max-w-3xl mx-auto space-y-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-3"
          >
            <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white flex items-center justify-center gap-2 font-sans">
              <HelpCircle className="w-6 h-6 text-indigo-400" /> Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-400 max-w-lg mx-auto">Everything you need to understand about the Krenza platform ecosystem.</p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = activeFaq === index;
              return (
                <motion.div 
                  key={index} 
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="rounded-xl border border-slate-850 bg-slate-900/40 overflow-hidden hover:bg-slate-900/60 transition-colors"
                >
                  <button
                    onClick={() => setActiveFaq(isOpen ? null : index)}
                    className="w-full py-4.5 px-5 text-left flex justify-between items-center text-xs sm:text-sm font-semibold text-white outline-none cursor-pointer group"
                  >
                    <span className="group-hover:text-indigo-300 transition-colors">{faq.q}</span>
                    <span className="text-indigo-400">
                      <motion.div
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ duration: 0.2, ease: "easeInOut" }}
                      >
                        <ChevronDown className="w-4 h-4 text-indigo-400" />
                      </motion.div>
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <div className="px-5 pb-5 pt-1 text-xs text-slate-400 border-t border-slate-850/40 leading-relaxed text-left">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CALL TO ACTION HUB SECTION */}
      <section className="py-20 px-4 max-w-4xl mx-auto text-center relative z-10 scroll-mt-18">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 60 }}
          className="p-8 sm:p-12 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 relative overflow-hidden text-center justify-center shadow-2xl"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 blur-[80px] rounded-full pointer-events-none select-none" />
          
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">Ready to assemble your dream team?</h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
            Create your account today and connect with software developers, product planners, and UI designers across your campus.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 max-w-md mx-auto">
            {currentUser ? (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={onEnterWorkspace}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex justify-center items-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/15"
              >
                Launch Krenza Workspace Feed <ArrowRight className="w-4 h-4" />
              </motion.button>
            ) : (
              <>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => onNavigateAuth("signup")}
                  className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex-1 justify-center flex items-center gap-2 cursor-pointer shadow-lg shadow-indigo-600/15"
                >
                  Create Academic Account
                </motion.button>
                <button
                  onClick={() => onNavigateAuth("login")}
                  className="w-full sm:w-auto px-6 py-3 bg-slate-950 hover:bg-slate-850 border border-slate-800 text-slate-350 hover:text-white font-semibold rounded-xl text-xs justify-center flex cursor-pointer transition-colors"
                >
                  Sign In to Profile
                </button>
              </>
            )}
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-slate-900 bg-slate-950 px-4 text-center">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <KrenzaLogo size={28} theme={theme} variant="full-horizontal" />
          </div>

          <p className="text-[10px] text-slate-500 font-mono tracking-wide">
            © {new Date().getFullYear()} Krenza Collab Network • Handshakes secured using on-campus TLS certificate authorizations.
          </p>

          <div className="flex gap-4 text-[10px] text-slate-400 font-semibold">
            <a href="#features" className="hover:text-indigo-400 transition-colors">Features</a>
            <a href="#sandbox" className="hover:text-indigo-400 transition-colors">Sandbox</a>
            <a href="#testimonials" className="hover:text-indigo-400 transition-colors">Stories</a>
            <a href="#faqs" className="hover:text-indigo-400 transition-colors">FAQ</a>
          </div>
        </div>
      </footer>
    </div>
  );
};
