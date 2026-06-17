import React, { useState, useEffect } from "react";
import { 
  Project, TeamApplication 
} from "../../../types";
import { 
  FolderPlus, Search, Code, Users, Award, ShieldAlert, 
  Send, Layers, ExternalLink, SlidersHorizontal, CheckSquare, 
  GitBranch, GitCommit, GitPullRequest, LayoutDashboard, Plus, Check, Play, Trash2, CheckCircle2 
} from "lucide-react";
import LoadingSkeleton from "../../../shared/components/LoadingSkeleton";
import { celebrateMatch } from "../../../shared/components/ConfettiOverlay";

interface ProjectMarketplaceProps {
  onProjectCreated: () => void;
}

export default function ProjectMarketplace({ onProjectCreated }: ProjectMarketplaceProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");

  // Core Build Navigation: 'projects' refers to browsing / marketplace; 'workspace' refers to team workspace, repos & squad roster.
  const [buildSubTab, setBuildSubTab] = useState<"projects" | "workspace">("projects");

  // Project Creation fields
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [description, setDescription] = useState("");
  const [skillsNeeded, setSkillsNeeded] = useState("");
  const [tags, setTags] = useState("");
  const [difficulty, setDifficulty] = useState<"Beginner" | "Intermediate" | "Advanced">("Intermediate");
  const [teamSizeLimit, setTeamSizeLimit] = useState(4);

  // Application Modal state
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [requestedRole, setRequestedRole] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // INTERACTIVE COLLABORATION LOGIC STATES
  const [tasks, setTasks] = useState<any[]>([
    { id: "t1", text: "scaffold protobuf schemas and types specification", done: true },
    { id: "t2", text: "wire up database transaction rollbacks hook inside server.ts", done: false },
    { id: "t3", text: "integrate UI filters & micro-interactions with Framer Motion", done: false }
  ]);
  const [newTaskText, setNewTaskText] = useState("");

  const [applicants, setApplicants] = useState<any[]>([
    { id: "a1", name: "Sneha Nair", role: "UI/UX Designer", project: "EtherPulse Ledger Analyser" },
    { id: "a2", name: "Rohan Sharma", role: "Backend Architect", project: "gRPC Compiler Scaffold" }
  ]);

  const [isRepoConnected, setIsRepoConnected] = useState(true);
  const [repoName, setRepoName] = useState("student_ashish/etherpulse-ledger");
  const [commits, setCommits] = useState<any[]>([
    { id: "c1", hash: "a3f5b21", msg: "refactor: clean ledger verification engine (3 issues closed)", author: "Pranav Mistry", time: "2 hours ago" },
    { id: "c2", hash: "9d8e72f", msg: "feat: add gRPC handshake endpoint scaffolding", author: "Sneha Nair", time: "5 hours ago" },
    { id: "c3", hash: "1c2b3d4", msg: "docs: write standard collaboration blueprint", author: "Ashish Kumar", time: "1 day ago" }
  ]);
  const [newCommitText, setNewCommitText] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/projects");
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (e) {
      console.error("Failed to load project database state:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !tagline || !description) return;

    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          tagline,
          description,
          skillsNeeded: skillsNeeded.split(",").map(sk => sk.trim()).filter(Boolean),
          tags: tags.split(",").map(tg => tg.trim()).filter(Boolean),
          difficulty,
          teamSizeLimit
        })
      });

      if (res.ok) {
        setShowCreateModal(false);
        // Reset form
        setTitle("");
        setTagline("");
        setDescription("");
        setSkillsNeeded("");
        setTags("");
        setDifficulty("Intermediate");
        setTeamSizeLimit(4);
        
        fetchProjects();
        onProjectCreated();
      }
    } catch (e) {
      console.error("Failed to post project entry:", e);
    }
  };

  const handleOpenApplyModal = (projId: string) => {
    setSelectedProjectId(projId);
    setRequestedRole("");
    setCoverLetter("");
    setApplicationSuccess(false);
    setErrorMessage("");
  };

  const handleApplyToProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) return;

    try {
      const res = await fetch(`/api/projects/${selectedProjectId}/apply`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestedRole,
          coverLetter
        })
      });

      if (res.ok) {
        setApplicationSuccess(true);
        celebrateMatch("sides");
        setTimeout(() => {
          setSelectedProjectId(null);
        }, 1500);
      } else {
        const errData = await res.json();
        setErrorMessage(errData.error || "Failed to transmit application packet.");
      }
    } catch (e: any) {
      setErrorMessage("Network error: " + e.message);
    }
  };

  // Filter local logic
  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || 
                          p.skillsNeeded.some(sk => sk.toLowerCase().includes(search.toLowerCase())) ||
                          p.tagline.toLowerCase().includes(search.toLowerCase());
    const matchesDiff = difficultyFilter === "All" || p.difficulty === difficultyFilter;
    return matchesSearch && matchesDiff;
  });

  // Active collaboration task toggles
  const handleToggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;
    setTasks(prev => [
      ...prev,
      { id: `t_${Date.now()}`, text: newTaskText, done: false }
    ]);
    setNewTaskText("");
  };

  const handleDeleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  // Active commit addition
  const handleAddCommit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommitText.trim()) return;
    setCommits(prev => [
      {
        id: `c_${Date.now()}`,
        hash: Math.random().toString(16).substring(2, 9),
        msg: newCommitText,
        author: "Ashish Kumar (You)",
        time: "Just now"
      },
      ...prev
    ]);
    setNewCommitText("");
  };

  // Dismiss applicant
  const handleResolveApplicant = (id: string, accept: boolean) => {
    setApplicants(prev => prev.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* HEADER BUILD CONTROL BAR */}
      <div className="bg-gradient-to-br from-indigo-950/45 to-slate-900 border border-slate-850 p-5 rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-left">
        <div className="space-y-1">
          <span className="text-[9.5px] font-mono text-indigo-400 font-extrabold uppercase tracking-widest block">
            BUILD WORKSPACE
          </span>
          <h2 className="text-md md:text-lg font-extrabold text-white leading-tight">
            Squad Recruitment &amp; Repository Integrations
          </h2>
          <p className="text-xs text-slate-400 leading-normal max-w-xl">
            Pitch innovative college projects, look for developer co-founders, hook repositories, and orchestrate active collaboration.
          </p>
        </div>

        <button 
          onClick={() => setShowCreateModal(true)}
          className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-550 hover:from-indigo-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/15 transition-all shrink-0 cursor-pointer text-center"
        >
          <FolderPlus className="w-4 h-4 text-indigo-200" /> Pitch Innovation
        </button>
      </div>

      {/* CORE NAVIGATION BUILD SUBTABS */}
      <div className="flex border-b border-slate-850">
        <button
          onClick={() => setBuildSubTab("projects")}
          className={`px-5 py-3 text-xs font-bold font-mono tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            buildSubTab === "projects"
              ? "border-indigo-505 text-white bg-slate-900/40"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <Search className="w-4 h-4 text-indigo-400" /> Browse Initiatives
        </button>

        <button
          onClick={() => setBuildSubTab("workspace")}
          className={`px-5 py-3 text-xs font-bold font-mono tracking-wider flex items-center gap-2 border-b-2 transition-all cursor-pointer ${
            buildSubTab === "workspace"
              ? "border-indigo-505 text-white bg-slate-900/40"
              : "border-transparent text-slate-400 hover:text-white"
          }`}
        >
          <LayoutDashboard className="w-4 h-4 text-pink-400" /> Collaboration Workspace
        </button>
      </div>

      {/* 2. TAB PORTIONS */}
      {buildSubTab === "projects" ? (
        <>
          {/* SEARCH & FILTER CONTROLS */}
          <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-slate-900 border border-slate-850 p-4.5 rounded-xl shadow-md text-slate-100 text-left">
            <div className="flex-1 flex items-center gap-2 bg-slate-950 border border-slate-850 px-3 py-2 rounded-lg">
              <Search className="w-4 h-4 text-slate-500 shrink-0" />
              <input 
                type="text" 
                placeholder="Search projects by tech stack, keywords..." 
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent text-xs text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-0"
              />
            </div>
            
            <div className="flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-850 px-3 py-1.5 rounded-lg text-xs">
                <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
                <select 
                  value={difficultyFilter} 
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="bg-transparent text-slate-300 focus:outline-none cursor-pointer outline-none border-none pr-6"
                >
                  <option value="All">All Levels</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>
          </div>

          {/* PROJECT GRID RENDER */}
          {loading ? (
            <LoadingSkeleton type="card" count={3} />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
              {filteredProjects.map((p) => (
                <div key={p.id} className="bg-slate-900 border border-slate-850 rounded-2xl p-5 shadow-xl hover:shadow-2xl hover:border-slate-700/80 transition-all flex flex-col justify-between text-slate-100 group relative">
                  <div>
                    {/* Difficulty pill */}
                    <div className="flex justify-between items-start mb-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold tracking-wider ${
                        p.difficulty === "Advanced" 
                          ? "bg-rose-500/10 border border-rose-500/20 text-rose-400" 
                          : p.difficulty === "Intermediate"
                          ? "bg-indigo-500/10 border border-indigo-500/20 text-indigo-400"
                          : "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                      }`}>
                        {p.difficulty}
                      </span>
                      
                      <span className="text-[10px] text-slate-500 font-mono">
                        {p.createdAt ? new Date(p.createdAt).toLocaleDateString() : "Active Now"}
                      </span>
                    </div>

                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors leading-snug line-clamp-1">{p.title}</h4>
                      <p className="text-[11px] text-slate-400 leading-normal line-clamp-1">{p.tagline}</p>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-relaxed py-3 border-y border-slate-850/60 my-3.5 line-clamp-3 h-[72px]">
                      {p.description}
                    </p>
                  </div>

                  <div className="space-y-3.5">
                    <div className="space-y-1.5">
                      <span className="text-[9px] uppercase tracking-widest font-mono text-slate-500 font-bold block">Skills Required</span>
                      <div className="flex flex-wrap gap-1">
                        {(p.skillsNeeded || []).slice(0, 3).map((sk, idx) => (
                          <span key={idx} className="px-1.5 py-0.5 bg-slate-950 border border-slate-855 rounded text-[9.5px] font-medium text-slate-405">
                            {sk}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                        <Users className="w-3.5 h-3.5 text-slate-500" /> 
                        <span className="font-semibold text-white">{p.currentTeamSize || 1}</span> / {p.teamSizeLimit || 4} Members
                      </div>

                      <button 
                        onClick={() => handleOpenApplyModal(p.id)}
                        className="px-3 py-1 bg-slate-950 hover:bg-slate-855 border border-slate-850 hover:border-slate-750 text-indigo-300 hover:text-white rounded-lg text-[10.5px] font-mono font-bold flex items-center gap-1 transition-all cursor-pointer"
                      >
                        Join Squad <ExternalLink className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {filteredProjects.length === 0 && (
                <div className="col-span-full bg-slate-900 pb-8 text-center text-slate-500 font-sans py-12 border border-slate-850 rounded-2xl">
                  <ShieldAlert className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                  No matching projects listed. Pitch an idea to start your own!
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        /* INTERACTIVE COLLABORATION PANEL */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
          
          {/* LEFT: WORKSPACE STEER & CHECKLIST TASK BOX (Lg: 7) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* WORKSPACE TASK LIST */}
            <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-850 pb-3">
                <div>
                  <h3 className="text-xs font-bold font-mono text-pink-400 uppercase tracking-widest flex items-center gap-2">
                    <CheckSquare className="w-4 h-4 text-pink-400" /> Active Roster Workspace
                  </h3>
                  <p className="text-[10px] text-slate-500 font-sans mt-0.5">Maintain technical deliverables and checklists as a squad</p>
                </div>
                <span className="px-2 py-0.5 bg-pink-500/10 border border-pink-500/20 rounded text-[9px] font-mono font-bold text-pink-400">
                  Sprint cycle: Active
                </span>
              </div>

              {/* Add checklist item */}
              <form onSubmit={handleAddTask} className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Insert new technical milestone task item..."
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-700 focus:outline-none focus:border-indigo-500"
                />
                <button 
                  type="submit"
                  className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-550 text-white rounded-xl text-xs font-bold transition-transform active:scale-95 cursor-pointer flex items-center justify-center shrink-0"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </form>

              {/* Tasks mapping */}
              <div className="space-y-2 max-h-72 overflow-y-auto custom-scrollbar pr-1 pt-1">
                {tasks.map(task => (
                  <div 
                    key={task.id} 
                    className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                      task.done 
                        ? "bg-slate-955/35 border-slate-950 text-slate-500"
                        : "bg-slate-950 border-slate-850 text-slate-200"
                    }`}
                  >
                    <div 
                      onClick={() => handleToggleTask(task.id)}
                      className="flex items-center gap-2.5 cursor-pointer flex-1 select-none pr-4"
                    >
                      <button 
                        type="button" 
                        className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
                          task.done 
                            ? "bg-emerald-500 border-emerald-400 text-white" 
                            : "border-slate-700 hover:border-slate-500"
                        }`}
                      >
                        {task.done && <Check className="w-3 h-3 stroke-[3px]" />}
                      </button>
                      <span className={`text-xs font-sans font-medium break-all leading-normal ${task.done ? "line-through text-slate-500" : ""}`}>
                        {task.text}
                      </span>
                    </div>

                    <button 
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-slate-600 hover:text-rose-400 p-1 rounded hover:bg-slate-900 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                {tasks.length === 0 && (
                  <p className="text-center text-slate-500 text-xs py-4">No milestone chores remaining. Add tasks to scope deliverables.</p>
                )}
              </div>
            </div>

            {/* SQUAD RECRUITMENT REQUEST DETAILS */}
            <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl space-y-4">
              <div className="border-b border-slate-850 pb-3">
                <h3 className="text-xs font-bold font-mono text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                  <Users className="w-4 h-4 text-indigo-400" /> Incoming Squad Applications (Roster)
                </h3>
                <p className="text-[10px] text-slate-500 mt-0.5">Evaluate technical student applicants seeking to join your open pitches</p>
              </div>

              <div className="space-y-3">
                {applicants.map(app => (
                  <div key={app.id} className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 flex flex-col sm:flex-row gap-3 justify-between sm:items-center">
                    <div className="space-y-1">
                      <h4 className="font-bold text-white text-xs">{app.name}</h4>
                      <div className="flex gap-1.5 items-center">
                        <span className="text-[9.5px] font-mono text-[#f59e0b] bg-amber-500/10 px-1.5 py-0.5 rounded font-bold">{app.role}</span>
                        <span className="text-[9px] font-mono text-slate-500">for {app.project}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <button 
                        onClick={() => handleResolveApplicant(app.id, false)}
                        className="px-2.5 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 rounded-lg text-[10.5px] font-mono font-bold cursor-pointer transition-colors"
                      >
                        Decline
                      </button>
                      <button 
                        onClick={() => handleResolveApplicant(app.id, true)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[10.5px] font-mono font-bold cursor-pointer transition-colors"
                      >
                        Accept Squad
                      </button>
                    </div>
                  </div>
                ))}

                {applicants.length === 0 && (
                  <div className="text-center py-4 text-slate-500 text-xs font-mono">
                    --- No pending squad application checklists ---
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* RIGHT: CONNECTED GIT REPOSITORY SYNC BOX (Lg: 5) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl space-y-4">
              <div className="border-b border-slate-850 pb-3">
                <span className="text-[9px] bg-indigo-500/15 text-indigo-300 font-mono font-bold tracking-widest px-2 py-0.5 rounded-full uppercase">
                  Git Sync Status
                </span>
                <h3 className="text-white text-sm font-bold mt-2 font-sans flex items-center gap-1.5">
                  <GitBranch className="w-4.5 h-4.5 text-indigo-400" /> Repository Sync Board
                </h3>
              </div>

              {/* Repos connection status */}
              <div className="p-3 bg-slate-950 border border-indigo-500/10 rounded-xl flex items-center justify-between">
                <div>
                  <span className="text-[9px] font-mono text-slate-500 block uppercase font-bold">Connected Repository</span>
                  <span className="text-xs font-mono text-indigo-400 font-semibold">{repoName}</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              {/* Push a simulated git commit */}
              <form onSubmit={handleAddCommit} className="space-y-2">
                <label className="block text-[9.5px] font-mono text-slate-400 uppercase font-semibold">Stage &amp; Commit mock change</label>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="e.g. feat: secure gRPC sessions auth endpoint"
                    value={newCommitText}
                    onChange={(e) => setNewCommitText(e.target.value)}
                    className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-mono text-indigo-300 placeholder-slate-700 focus:outline-none"
                  />
                  <button 
                    type="submit"
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-mono font-bold rounded-lg transition-transform active:scale-95 cursor-pointer"
                  >
                    Commit
                  </button>
                </div>
              </form>

              {/* Commit history feed logs */}
              <div className="space-y-3 pt-2">
                <span className="text-[9.5px] font-mono text-slate-505 block uppercase tracking-wider font-bold">Latest Branch Commits (Verified)</span>
                
                <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-1 font-mono text-[10.5px]">
                  {commits.map(commit => (
                    <div key={commit.id} className="p-2.5 bg-slate-955 border border-slate-855 rounded-xl space-y-1 hover:bg-slate-950/20 transition-colors">
                      <div className="flex justify-between items-center text-slate-500 text-[10px]">
                        <span className="text-[#a855f7] font-semibold flex items-center gap-0.5">
                          <GitCommit className="w-3.5 h-3.5" /> hex_{commit.hash}
                        </span>
                        <span>{commit.time}</span>
                      </div>
                      <p className="text-slate-300 leading-snug">{commit.msg}</p>
                      <div className="text-[9px] text-slate-550 pt-0.5">Author: {commit.author}</div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* PITCH modal form popup */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs transition-opacity animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl p-6 text-slate-100">
            <h3 className="text-xl font-bold text-white mb-1 flex items-center gap-2 border-b border-slate-850 pb-3">
              <FolderPlus className="text-indigo-400" /> Pitch New Project Idea
            </h3>
            <p className="text-slate-400 text-xs mb-4">
              Enter details below. Pitching an idea auto-creates a project chat room and associates a professional team roster in our builder.
            </p>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1 leading-none uppercase">Project Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. AI Study Buddy" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-700 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1 leading-none uppercase">Short Tagline</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Automated quiz card generator" 
                    value={tagline} 
                    onChange={(e) => setTagline(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-indigo-305 placeholder-slate-700 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 mb-1 leading-none uppercase">Core Description</label>
                <textarea 
                  placeholder="Provide details about stack architecture, goals, code challenges, and what kind of engineers are needed..." 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-350 placeholder-slate-700 focus:outline-none focus:border-indigo-500 font-sans"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 mb-1 leading-none uppercase">Required Skills (Separated by commas)</label>
                <input 
                  type="text" 
                  placeholder="TypeScript, Python, Gemini API" 
                  value={skillsNeeded} 
                  onChange={(e) => setSkillsNeeded(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white placeholder-slate-700 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-mono text-slate-400 mb-1 leading-none uppercase">Secondary Tags (Separated by commas)</label>
                  <input 
                    type="text" 
                    placeholder="EdTech, Smart Utilities" 
                    value={tags} 
                    onChange={(e) => setTags(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-700 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1 leading-none uppercase">Difficulty tier</label>
                  <select 
                    value={difficulty} 
                    onChange={(e: any) => setDifficulty(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-350 focus:outline-none"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono text-slate-400 mb-1 leading-none uppercase">Team Size Limit (Includes Creator)</label>
                <input 
                  type="number" 
                  min={2} 
                  max={6} 
                  value={teamSizeLimit} 
                  onChange={(e) => setTeamSizeLimit(Number(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-855">
                <button 
                  type="button" 
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border border-slate-850 hover:bg-slate-850 text-slate-350 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-505 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Upload Idea
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* JOINT SQUAD COVER modal popup */}
      {selectedProjectId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs transition-opacity animate-fade-in">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl p-6 text-slate-100">
            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2 border-b border-slate-850 pb-3">
              <Send className="text-indigo-400 w-4.5 h-4.5" /> Submit Teammate Proposal
            </h3>
            
            {applicationSuccess ? (
              <div className="text-center py-6 space-y-2 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex justify-center items-center mx-auto">
                  <CheckSquare className="w-5 h-5 text-emerald-400" />
                </div>
                <h4 className="text-sm font-semibold text-emerald-400">Proposal Transmitted!</h4>
                <p className="text-xs text-slate-400">The project creator is reviewing your cover pitch and technical skills checklist.</p>
              </div>
            ) : (
              <form onSubmit={handleApplyToProject} className="space-y-4">
                {errorMessage && (
                  <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 text-rose-450 rounded text-xs leading-normal">
                    ⚠️ {errorMessage}
                  </div>
                )}

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1 leading-none uppercase">Requested Team Role</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Frontend Engineer, ML Specialist" 
                    value={requestedRole} 
                    onChange={(e) => setRequestedRole(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-indigo-305 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono text-slate-400 mb-1 leading-none uppercase">Pitch / Cover Letter</label>
                  <textarea 
                    placeholder="Briefly state your experience with this tech stack and what tasks you intend to handle..." 
                    value={coverLetter} 
                    onChange={(e) => setCoverLetter(e.target.value)}
                    rows={4}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs text-slate-300 placeholder-slate-700 focus:outline-none focus:border-indigo-500 font-sans"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-850">
                  <button 
                    type="button" 
                    onClick={() => setSelectedProjectId(null)}
                    className="px-4 py-2 border border-slate-850 hover:bg-slate-850 text-slate-350 rounded-lg text-[11px] font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[11px] font-semibold cursor-pointer"
                  >
                    Send Proposal
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
