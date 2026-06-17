/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { Hackathon } from "../../../types";
import { 
  Award, Trophy, Calendar, CheckCircle2, Terminal, Code, Plus, ExternalLink, ShieldAlert 
} from "lucide-react";

interface HackathonHubProps {
  onSubmissionSuccess?: () => void;
}

export default function HackathonHub({ onSubmissionSuccess }: HackathonHubProps) {
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"challenges" | "leaderboard">("challenges");

  // Submission form states
  const [selectedHackId, setSelectedHackId] = useState<string | null>(null);
  const [teamName, setTeamName] = useState("");
  const [projectTitle, setProjectTitle] = useState("");
  const [demoUrl, setDemoUrl] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    fetchHackathons();
  }, []);

  const fetchHackathons = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/hackathons");
      if (res.ok) {
        const data = await res.json();
        setHackathons(data);
      }
    } catch (e) {
      console.error("Failed to fetch hackathons state:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (hackId: string) => {
    try {
      const res = await fetch(`/api/hackathons/${hackId}/register`, {
        method: "POST"
      });
      if (res.ok) {
        fetchHackathons();
        alert("Registration Successful! You can now prepare your project deliverables.");
      }
    } catch (e) {
      console.error("Error registering team:", e);
    }
  };

  const handleSubmitProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHackId) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/hackathons/${selectedHackId}/submit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teamName,
          projectTitle,
          demoUrl,
          githubUrl
        })
      });

      if (res.ok) {
        setSuccessMsg("Delvirable Submitted! Evaluating results...");
        setTimeout(() => {
          setSelectedHackId(null);
          setTeamName("");
          setProjectTitle("");
          setDemoUrl("");
          setGithubUrl("");
          setSuccessMsg("");
          fetchHackathons();
          if (onSubmissionSuccess) onSubmissionSuccess();
        }, 1500);
      }
    } catch (e) {
      console.error("Error pushing hack submissions:", e);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  // Flatten submissions across active hacks for leaderboard
  const allSubmissions = hackathons
    .flatMap(h => (h.submissions || []).map(s => ({ ...s, hackathonTitle: h.title })))
    .sort((a, b) => (b.score || 0) - (a.score || 0));

  return (
    <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 shadow-xl text-slate-100 font-sans">
      
      {/* Tab Selector */}
      <div className="flex justify-between items-center border-b border-slate-800 pb-4 mb-6">
        <div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            <Trophy className="text-indigo-400 w-5 h-5" /> Krenza Hackathon Hub
          </h3>
          <p className="text-slate-400 text-xs mt-1">Participate in university level hack challenges, win prizes, and build credentials.</p>
        </div>

        <div className="flex bg-slate-950 p-1 border border-slate-850 rounded-lg">
          <button 
            onClick={() => setActiveTab("challenges")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
              activeTab === "challenges" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            Challenges
          </button>
          <button 
            onClick={() => setActiveTab("leaderboard")}
            className={`px-3 py-1.5 rounded-md text-xs font-semibold cursor-pointer transition-colors ${
              activeTab === "leaderboard" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-white"
            }`}
          >
            Leaderboard
          </button>
        </div>
      </div>

      {activeTab === "challenges" ? (
        <div className="space-y-6">
          {hackathons.map((h) => (
            <div key={h.id} className="p-5 bg-slate-950 border border-slate-850 rounded-xl flex flex-col md:flex-row gap-5 hover:border-slate-800 transition-colors">
              <img 
                src={h.bannerUrl} 
                alt={h.title} 
                className="w-full md:w-44 h-28 object-cover rounded-lg shrink-0 border border-slate-900"
              />
              
              <div className="flex-1 space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <h4 className="text-md font-bold text-white leading-tight">{h.title}</h4>
                    <p className="text-xs text-indigo-300 font-medium">By {h.organizer}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono font-bold tracking-wider ${
                    h.status === "Active" 
                      ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400"
                      : "bg-amber-400/10 border border-amber-400/20 text-amber-300"
                  }`}>
                    {h.status}
                  </span>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed text-ellipsis overflow-hidden h-10">
                  {h.description}
                </p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs bg-slate-900 p-3 rounded-lg border border-slate-850">
                  <div>
                    <span className="text-[10px] text-slate-500 font-mono block uppercase">Prize Pool</span>
                    <span className="font-semibold text-amber-400 font-sans">{h.prizePool}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-mono block uppercase">Start date</span>
                    <span className="text-slate-300 flex items-center gap-1 mt-0.5"><Calendar className="w-3.5 h-3.5" /> {new Date(h.startDate).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-mono block uppercase">Rosters Join</span>
                    <span className="text-slate-300 font-semibold">{h.registeredTeamsCount} Registered</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 font-mono block uppercase">Categories</span>
                    <span className="text-indigo-300 truncate block font-medium">{h.categories.slice(0, 2).join(", ")}</span>
                  </div>
                </div>

                {/* Challenge triggers */}
                <div className="flex gap-2 justify-end pt-2 border-t border-slate-900">
                  <button 
                    onClick={() => handleRegister(h.id)}
                    className="px-4 py-2 border border-slate-850 hover:bg-slate-850 hover:text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Register Team
                  </button>
                  <button 
                    onClick={() => setSelectedHackId(h.id)}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold shadow-md cursor-pointer transition-colors flex items-center gap-1"
                  >
                    Submit Deliverables <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="p-3 bg-slate-950 rounded-lg border border-slate-850 text-xs font-mono text-slate-400 font-bold tracking-wider grid grid-cols-4 text-left">
            <span>Rank & Submitter</span>
            <span>Project Title</span>
            <span>Host Challenge</span>
            <span className="text-right">Evaluator Score</span>
          </div>

          <div className="divide-y divide-slate-850 max-h-[450px] overflow-y-auto custom-scrollbar">
            {allSubmissions.map((sub, idx) => {
              const ranks = ["🥇 1st", "🥈 2nd", "🥉 3rd"];
              const rankStr = idx < 3 ? ranks[idx] : `#${idx + 1}`;
              return (
                <div key={idx} className="p-4 grid grid-cols-4 text-xs items-center hover:bg-slate-950/40">
                  <div className="flex items-center gap-2">
                    <span className={`font-mono font-bold ${idx < 3 ? "text-amber-400 text-sm" : "text-slate-400"}`}>{rankStr}</span>
                    <span className="font-bold text-white text-ellipsis overflow-hidden">{sub.teamName}</span>
                  </div>
                  <span className="text-slate-300 font-medium truncate">{sub.projectTitle}</span>
                  <span className="text-slate-405 truncate text-indigo-305">{sub.hackathonTitle}</span>
                  <span className="text-right font-mono font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400 text-sm">
                    {sub.score || 85}/100
                  </span>
                </div>
              );
            })}

            {allSubmissions.length === 0 && (
              <div className="text-center py-10 text-slate-500 text-xs">No project submissions turned in yet.</div>
            )}
          </div>
        </div>
      )}

      {/* SUBMISSION MODAL popup */}
      {selectedHackId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs transition-opacity">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl shadow-2xl p-6 text-slate-100">
            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2 border-b border-slate-850 pb-3">
              <Terminal className="text-indigo-400 w-4.5 h-4.5" /> Submit Hackathon Deliverables
            </h3>

            {successMsg ? (
              <div className="text-center py-8 space-y-3">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
                <h4 className="text-sm font-semibold text-emerald-400">{successMsg}</h4>
                <p className="text-[11px] text-slate-400 font-medium mt-1">Auto-rewarding platform points (+150 pts)...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmitProject} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[9px] font-mono text-slate-400 mb-1 leading-none uppercase">Team Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Neural Builders" 
                      value={teamName} 
                      onChange={(e) => setTeamName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-705 focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-mono text-slate-400 mb-1 leading-none uppercase">Project Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. AI Study Buddy" 
                      value={projectTitle} 
                      onChange={(e) => setProjectTitle(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-indigo-300 placeholder-slate-705 focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[9px] font-mono text-slate-400 mb-1 leading-none uppercase">Live Working Demo URL</label>
                  <input 
                    type="url" 
                    placeholder="https://my-demo-squad.vercel.app" 
                    value={demoUrl} 
                    onChange={(e) => setDemoUrl(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[9px] font-mono text-slate-400 mb-1 leading-none uppercase">GitHub Code Repository</label>
                  <input 
                    type="url" 
                    placeholder="https://github.com/myusername/myrepo" 
                    value={githubUrl} 
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-slate-850">
                  <button 
                    type="button" 
                    onClick={() => setSelectedHackId(null)}
                    className="px-4 py-2 border border-slate-850 hover:bg-slate-850 text-slate-350 rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold cursor-pointer"
                  >
                    Transmit Deliverables
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
