/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Rocket, Users, Sparkles, Plus, Send, CheckCircle, 
  Map, Award, RefreshCw, Star, ArrowRight, ShieldCheck, 
  Database, Milestone, Terminal, MessageSquare, Briefcase 
} from "lucide-react";

export default function StartupLaunchpad() {
  const [activeTab, setActiveTab] = useState<"matching" | "generator">("matching");

  // === COFOUNDERS LIST STATE ===
  const [posts, setPosts] = useState<any[]>([]);
  const [listLoading, setListLoading] = useState(false);
  const [applySuccessId, setApplySuccessId] = useState<string | null>(null);

  // === NEW IDEA FORM STATE ===
  const [showPostForm, setShowPostForm] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formTagline, setFormTagline] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formEquity, setFormEquity] = useState("15% - 25%");
  const [formSkills, setFormSkills] = useState("");

  // === PROJECT GENERATOR STATE ===
  const [genDomain, setGenDomain] = useState("Decentralized Finance");
  const [genDifficulty, setGenDifficulty] = useState("Intermediate");
  const [genTeamSize, setGenTeamSize] = useState(3);
  const [genLoading, setGenLoading] = useState(false);
  const [generatedProject, setGeneratedProject] = useState<any>(null);

  // --- ACTIONS ---

  // Load cofounder posts
  const loadPosts = async () => {
    setListLoading(true);
    try {
      const res = await fetch("/api/co-founders/posts");
      if (res.ok) {
        const data = await res.json();
        setPosts(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    loadPosts();
  }, []);

  const handleApplyCofounder = async (postId: string) => {
    try {
      const res = await fetch(`/api/co-founders/posts/${postId}/apply`, {
        method: "POST"
      });
      if (res.ok) {
        setApplySuccessId(postId);
        setTimeout(() => setApplySuccessId(null), 3000);
        loadPosts(); // reload for updated count
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formTagline.trim() || !formDesc.trim()) return;

    try {
      const res = await fetch("/api/co-founders/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formTitle,
          tagline: formTagline,
          description: formDesc,
          equityOffer: formEquity,
          skillsNeeded: formSkills.split(",").map(s => s.trim()).filter(Boolean)
        })
      });
      if (res.ok) {
        setFormTitle("");
        setFormTagline("");
        setFormDesc("");
        setFormSkills("");
        setShowPostForm(false);
        loadPosts();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Run AI Project generator
  const handleGenerateProject = async () => {
    setGenLoading(true);
    setGeneratedProject(null);
    try {
      const res = await fetch("/api/ai/project-generator", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: genDomain, difficulty: genDifficulty, teamSize: genTeamSize })
      });
      if (res.ok) {
        const data = await res.json();
        setGeneratedProject(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setGenLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* SECTION HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 border border-slate-850 p-4 rounded-2xl">
        <div>
          <div className="flex items-center gap-1.5 text-indigo-400 font-mono text-xs font-semibold mb-1 uppercase tracking-wider">
            <Rocket className="w-3.5 h-3.5 text-indigo-400" /> SkillCollab Startup Launchpad
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Co-Founder Matching & AI Project Suite</h2>
          <p className="text-xs text-slate-400">Match with prospective university ventures, post startup cards, or dynamically author product MVPs.</p>
        </div>

        {/* Tab Controls */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 self-stretch md:self-auto text-xs">
          <button 
            onClick={() => setActiveTab("matching")}
            className={`flex-1 md:flex-none px-4 py-1.5 rounded-lg font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
              activeTab === "matching" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10" : "text-slate-400 hover:text-white"
            }`}
          >
            <Users className="w-3.5 h-3.5" /> Co-Founder Board
          </button>
          <button 
            onClick={() => setActiveTab("generator")}
            className={`flex-1 md:flex-none px-4 py-1.5 rounded-lg font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
              activeTab === "generator" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10" : "text-slate-400 hover:text-white"
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" /> AI Project Generator
          </button>
        </div>
      </div>

      {/* ==================================================== */}
      {/* T1. CO-FOUNDER MATCHING BOARD */}
      {/* ==================================================== */}
      {activeTab === "matching" && (
        <div className="space-y-6">
          <div className="flex justify-between items-center bg-slate-900 border border-slate-850 p-4 rounded-xl">
            <div className="text-xs text-slate-300">
              <strong className="text-white block font-semibold mb-0.5">Venture Discovery Pool</strong>
              Found active student leaders forming core product squads. Filter by equity, expertise, or size.
            </div>
            
            <button
              onClick={() => setShowPostForm(!showPostForm)}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" /> Post Startup Venture
            </button>
          </div>

          {/* New Post Form Drawer */}
          {showPostForm && (
            <form onSubmit={handleCreatePost} className="bg-slate-900 border-2 border-indigo-500/25 p-5 rounded-2xl relative space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                <span className="text-xs font-bold font-mono text-indigo-400 uppercase tracking-wider flex items-center gap-1">
                  <Plus className="w-4 h-4" /> Standard Venture Card details
                </span>
                <button 
                  type="button" 
                  onClick={() => setShowPostForm(false)} 
                  className="text-[10px] text-slate-400 hover:text-white font-mono cursor-pointer"
                >
                  Cancel
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Startup Title</label>
                    <input 
                      type="text" 
                      required
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      placeholder="e.g. EduLogix"
                      className="w-full bg-slate-950 border border-slate-850 rounded px-3 py-2 text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Catchy Tagline</label>
                    <input 
                      type="text" 
                      required
                      value={formTagline}
                      onChange={(e) => setFormTagline(e.target.value)}
                      placeholder="e.g. Auditing carbon flows using NextJS APIs"
                      className="w-full bg-slate-950 border border-slate-850 rounded px-3 py-2 text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Co-founder Equity Share Range</label>
                    <input 
                      type="text" 
                      required
                      value={formEquity}
                      onChange={(e) => setFormEquity(e.target.value)}
                      placeholder="e.g. 15% - 25%"
                      className="w-full bg-slate-950 border border-slate-850 rounded px-3 py-2 text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Description & Target Pitch</label>
                    <textarea 
                      required
                      rows={4}
                      value={formDesc}
                      onChange={(e) => setFormDesc(e.target.value)}
                      placeholder="Outline your startup proposal, Figma milestones, prototype tech details, and investor pitches..."
                      className="w-full bg-slate-950 border border-slate-850 rounded px-3 py-2 text-white outline-none focus:border-indigo-500 resize-none font-sans"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Key Co-founder Skills Required (Comma-separated)</label>
                    <input 
                      type="text" 
                      value={formSkills}
                      onChange={(e) => setFormSkills(e.target.value)}
                      placeholder="React.js, Node.js, Stripe, Redis"
                      className="w-full bg-slate-950 border border-slate-850 rounded px-3 py-2 text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-550 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-md shadow-indigo-600/10"
                >
                  <Send className="w-3.5 h-3.5" /> Dispatch Venture Card
                </button>
              </div>
            </form>
          )}

          {/* LISTS OF VENTURES */}
          {listLoading ? (
            <div className="flex justify-center py-12">
              <RefreshCw className="w-6 h-6 text-indigo-500 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {posts.map((post) => (
                <div key={post.id} className="bg-slate-900 border border-slate-850 rounded-2xl p-5 hover:border-slate-800 transition-all flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    
                    {/* Author credit line */}
                    <div className="flex items-center gap-2">
                      <img 
                        src={post.authorAvatar} 
                        alt="Author" 
                        className="w-7 h-7 rounded-full border border-slate-800 object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <span className="text-[11px] font-bold text-white block leading-none">{post.authorName}</span>
                        <span className="text-[9px] text-slate-400 font-mono">{post.authorRole}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-bold text-white tracking-tight">{post.title}</h4>
                      <p className="text-xs text-indigo-400 font-medium tracking-tight leading-snug mt-0.5">{post.tagline}</p>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed font-sans mt-2 line-clamp-3">
                      {post.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 pt-1 border-t border-slate-850/60">
                      {post.skillsNeeded.map((s: string) => (
                        <span key={s} className="px-2 py-0.5 bg-slate-950 border border-slate-850 rounded text-[9px] font-mono text-slate-400">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Pricing matching buttons */}
                  <div className="flex justify-between items-center pt-3 border-t border-slate-850/65">
                    <div>
                      <span className="text-[10px] text-slate-450 font-mono uppercase block">Equity Compensation</span>
                      <span className="text-[11px] font-bold font-mono text-amber-400 leading-none">{post.equityOffer}</span>
                    </div>

                    <button
                      onClick={() => handleApplyCofounder(post.id)}
                      disabled={applySuccessId === post.id}
                      className={`px-3 py-2 rounded-lg text-[10px] font-extrabold font-mono flex items-center gap-1 cursor-pointer transition-all ${
                        applySuccessId === post.id 
                          ? "bg-emerald-600/10 border border-emerald-500 text-emerald-400" 
                          : "bg-indigo-600 hover:bg-indigo-500 text-white shadow shadow-indigo-650/10"
                      }`}
                    >
                      {applySuccessId === post.id ? (
                        <>
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Pitched!
                        </>
                      ) : (
                        <>
                          <MessageSquare className="w-3.5 h-3.5" /> Pitch Co-founder Invite ({post.applicantsCount})
                        </>
                      )}
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* T2. AI PROJECT GENERATOR MODULE */}
      {/* ==================================================== */}
      {activeTab === "generator" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 bg-slate-900 border border-slate-850 p-5 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">MVP Configurations</h3>
            
            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Target Venture Domain</label>
                <input 
                  type="text"
                  value={genDomain}
                  onChange={(e) => setGenDomain(e.target.value)}
                  placeholder="e.g. Carbon Accounting, Health diagnostics"
                  className="w-full bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-white placeholder-slate-705 outline-none focus:border-indigo-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Benchmark Difficulty</label>
                <select
                  value={genDifficulty}
                  onChange={(e) => setGenDifficulty(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-white outline-none focus:border-indigo-500 font-mono"
                >
                  <option value="Beginner">Beginner: Simple client modules</option>
                  <option value="Intermediate">Intermediate: Multi-tier REST, caches</option>
                  <option value="Advanced">Advanced: Distributed architecture models</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Agile Target Team Size</label>
                <input 
                  type="number"
                  min={1} 
                  max={7}
                  value={genTeamSize}
                  onChange={(e) => setGenTeamSize(Math.max(1, parseInt(e.target.value) || 3))}
                  className="w-full bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-white outline-none focus:border-indigo-500 font-mono"
                />
              </div>
            </div>

            <button
              onClick={handleGenerateProject}
              disabled={genLoading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-550 text-white rounded-xl text-xs font-bold font-sans cursor-pointer transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/15 disabled:opacity-50"
            >
              {genLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 text-amber-350 fill-amber-300/10" />}
              {genLoading ? "Consulting AI Architect..." : "Generate MVP Scaffolding"}
            </button>
            
            <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl text-[10px] text-slate-400 leading-relaxed font-sans">
              Matches your ideas with secure Mongoose schemes, full system micro-routes, timeline bounds, and modular layouts automatically.
            </div>
          </div>

          <div className="lg:col-span-8 bg-slate-900 border border-slate-850 p-6 rounded-2xl min-h-[420px] flex flex-col justify-between">
            {genLoading ? (
              <div className="flex flex-col justify-center items-center flex-1 py-12 space-y-4">
                <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
                <div className="text-center space-y-1">
                  <p className="text-sm font-semibold text-white">Drafting Database Schemas & Key Milestones</p>
                  <p className="text-xs text-slate-450 font-mono">Powered by Gemini-3.5-Flash Server-Side Engine</p>
                </div>
              </div>
            ) : generatedProject ? (
              <div className="space-y-6">
                
                {/* Title outline */}
                <div className="border-b border-slate-800 pb-3 flex justify-between items-start">
                  <div>
                    <h4 className="text-base font-extrabold text-white tracking-tight">{generatedProject.title}</h4>
                    <p className="text-xs text-indigo-400 font-medium">{generatedProject.tagline}</p>
                  </div>
                  <span className="px-2 py-0.5 bg-slate-950 border border-slate-850 rounded text-[9px] font-mono text-emerald-400 font-bold uppercase">
                    Architecture Setup OK
                  </span>
                </div>

                <div className="p-3.5 bg-slate-950 border border-slate-850 rounded-xl">
                  <span className="text-[9px] text-slate-400 font-mono uppercase block mb-1">Startup Product Summary Proposal</span>
                  <p className="text-xs text-slate-350 leading-relaxed font-sans">
                    {generatedProject.summary}
                  </p>
                </div>

                {/* Grid Modules & Tech */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  
                  {/* Features */}
                  <div className="space-y-2">
                    <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-indigo-400" /> High-Impact Features
                    </span>
                    <ul className="space-y-1 text-slate-350 text-[11.5px] leading-relaxed">
                      {generatedProject.keyFeatures.map((f: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-1">
                          <span className="text-indigo-400 font-bold">•</span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Schema proposed block */}
                  <div className="space-y-2">
                    <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest flex items-center gap-1">
                      <Database className="w-3.5 h-3.5 text-amber-400" /> Proposed Mongoose Schema
                    </span>
                    <pre className="p-3 bg-slate-950 border border-slate-850 rounded-xl text-[10px] font-mono text-indigo-350 overflow-x-auto text-left leading-relaxed">
                      {generatedProject.proposedSchema}
                    </pre>
                  </div>

                </div>

                {/* Timeline and Technology grids */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-800 pt-4">
                  
                  {/* Milestones */}
                  <div className="space-y-2.5">
                    <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest flex items-center gap-1">
                      <Milestone className="w-3.5 h-3.5 text-emerald-400" /> Project Roster Milestones
                    </span>
                    <div className="space-y-2">
                      {generatedProject.milestones.map((m: any, idx: number) => (
                        <div key={idx} className="p-2 bg-slate-950 rounded border border-slate-855 text-[10.5px]">
                          <div className="flex justify-between items-center font-bold">
                            <span className="text-white font-mono">{idx + 1}. {m.title}</span>
                            <span className="text-indigo-400 text-[9px] font-mono font-semibold">{m.timeline}</span>
                          </div>
                          <p className="text-slate-450 mt-1">{m.aim}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Tech stack lists */}
                  <div className="space-y-2">
                    <span className="text-[10px] text-slate-400 font-mono uppercase tracking-widest flex items-center gap-1 text-indigo-400">
                      <Terminal className="w-3.5 h-3.5 text-indigo-400" /> Standard Stack Requirements
                    </span>
                    <table className="w-full text-left text-[11px] border-collapse">
                      <tbody>
                        <tr className="border-b border-slate-850/50">
                          <td className="py-2 font-mono text-[10px] text-indigo-455">Database:</td>
                          <td className="py-2 text-white font-semibold">{generatedProject.techStack.db}</td>
                        </tr>
                        <tr className="border-b border-slate-850/50">
                          <td className="py-2 font-mono text-[10px] text-indigo-455">Frontend Framework:</td>
                          <td className="py-2 text-white font-semibold">{generatedProject.techStack.frontend}</td>
                        </tr>
                        <tr className="border-b border-slate-850/50">
                          <td className="py-2 font-mono text-[10px] text-indigo-455">Express Server:</td>
                          <td className="py-2 text-white font-semibold">{generatedProject.techStack.server}</td>
                        </tr>
                        <tr>
                          <td className="py-2 font-mono text-[10px] text-indigo-455">Extra Packages:</td>
                          <td className="py-2 text-indigo-300 font-semibold font-mono text-[10px]">{generatedProject.techStack.extra || "google/genai"}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                </div>

              </div>
            ) : (
              <div className="flex flex-col justify-center items-center flex-1 text-center py-12 p-4">
                <Sparkles className="w-8 h-8 text-indigo-500/80 mb-3" />
                <h4 className="text-xs font-extrabold text-white uppercase tracking-widest mb-1.5 font-mono">Roster Blueprint Empty</h4>
                <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                  Supply a project field description (e.g. Healthcare smart-alerts, Peer note logs, decentralized logistics) and generate an end-to-end spec blueprint.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
