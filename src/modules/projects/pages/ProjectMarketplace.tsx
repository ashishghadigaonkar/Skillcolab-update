/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Project, TeamApplication 
} from "../../../types";
import { 
  FolderPlus, Search, Code, Users, Award, ShieldAlert, 
  Send, Layers, ExternalLink, SlidersHorizontal, CheckSquare 
} from "lucide-react";
import LoadingSkeleton from "../../../shared/components/LoadingSkeleton";

interface ProjectMarketplaceProps {
  onProjectCreated: () => void;
}

export default function ProjectMarketplace({ onProjectCreated }: ProjectMarketplaceProps) {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("All");

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

  return (
    <div className="space-y-6 font-sans">
      {/* Search & Action Controls */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-slate-900 border border-slate-800 p-4 rounded-xl shadow-md text-slate-100">
        <div className="flex-1 flex items-center gap-2 bg-slate-950 border border-slate-850 px-3 py-2 rounded-lg">
          <Search className="w-4 h-4 text-slate-500 shrink-0" />
          <input 
            type="text" 
            placeholder="Search projects by tech stack, keywords..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-200 placeholder-slate-600 focus:outline-none"
          />
        </div>
        
        <div className="flex items-center gap-3">
          {/* Difficulty Dropdown */}
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-850 px-3 py-1.5 rounded-lg text-xs">
            <SlidersHorizontal className="w-3.5 h-3.5 text-indigo-400" />
            <select 
              value={difficultyFilter} 
              onChange={(e) => setDifficultyFilter(e.target.value)}
              className="bg-transparent text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="All">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <button 
            onClick={() => setShowCreateModal(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 shadow-lg shadow-indigo-600/15 transition-all text-center shrink-0 cursor-pointer"
          >
            <FolderPlus className="w-4 h-4" /> Pitch Project Idea
          </button>
        </div>
      </div>

      {/* Projects Grid */}
      {loading ? (
        <LoadingSkeleton type="card" count={3} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((p) => (
            <div key={p.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl hover:shadow-2xl hover:border-slate-700/80 transition-all flex flex-col justify-between text-slate-100 group relative">
              {/* Difficulty pill top item */}
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
                  {new Date(p.createdAt).toLocaleDateString()}
                </span>
              </div>

              {/* Title group */}
              <div className="space-y-1">
                <h4 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors leading-snug">{p.title}</h4>
                <p className="text-xs text-slate-400 leading-normal">{p.tagline}</p>
              </div>

              {/* Large desc block */}
              <p className="text-xs text-slate-400 leading-relaxed py-3 border-y border-slate-850/60 my-3.5 text-ellipsis overflow-hidden h-20">
                {p.description}
              </p>

              {/* Skills required tag lines */}
              <div className="space-y-3.5">
                <div className="space-y-1.5">
                  <span className="text-[9px] uppercase tracking-widest font-mono text-slate-500 font-bold block">Skills Required</span>
                  <div className="flex flex-wrap gap-1">
                    {p.skillsNeeded.map((sk, idx) => (
                      <span key={idx} className="px-1.5 py-0.5 bg-slate-950 border border-slate-850 rounded text-[10px] font-medium text-slate-300">
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Roster levels & click button */}
                <div className="flex justify-between items-center pt-2">
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                    <Users className="w-3.5 h-3.5 text-slate-500" /> 
                    <span className="font-semibold text-white">{p.currentTeamSize}</span> / {p.teamSizeLimit} Members
                  </div>

                  <button 
                    onClick={() => handleOpenApplyModal(p.id)}
                    className="px-3.5 py-1.5 bg-slate-850 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-indigo-300 hover:text-white rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-all cursor-pointer"
                  >
                    Send Request <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {filteredProjects.length === 0 && (
            <div className="col-span-full bg-slate-90 pb-8 text-center text-slate-500 font-sans py-12">
              <ShieldAlert className="w-8 h-8 text-slate-600 mx-auto mb-2" />
              No matching projects listed. Check other level criteria or add your own!
            </div>
          )}
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
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-indigo-300 placeholder-slate-700 focus:outline-none focus:border-indigo-500"
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
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-300 placeholder-slate-700 focus:outline-none focus:border-indigo-500 font-sans"
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
