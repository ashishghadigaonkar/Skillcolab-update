/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { InternshipPost } from "../types";
import { 
  Briefcase, Search, MapPin, Sparkles, Send, 
  Layers, Plus, Trash2, CheckCircle2, ShieldAlert, ListFilter 
} from "lucide-react";

interface InternshipBoardProps {
  onApplicationSuccess?: () => void;
}

export default function InternshipBoard({ onApplicationSuccess }: InternshipBoardProps) {
  const [internships, setInternships] = useState<InternshipPost[]>([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  // Recruiter Post fields
  const [showPostField, setShowPostField] = useState(false);
  const [title, setTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState<"Remote" | "Hybrid" | "In-office">("Remote");
  const [duration, setDuration] = useState("3 Months");
  const [stipend, setStipend] = useState("");
  const [skillsRequired, setSkillsRequired] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    fetchInternships();
  }, []);

  const fetchInternships = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/internships");
      if (res.ok) {
        const data = await res.json();
        setInternships(data);
      }
    } catch (e) {
      console.error("Failed to load internship posts:", e);
    } finally {
      setLoading(false);
    }
  };

  const handlePostInternship = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !companyName) return;

    try {
      const res = await fetch("/api/internships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          companyName,
          location: location || "Remote",
          type,
          duration,
          stipend: stipend || "Competitive",
          skillsRequired: skillsRequired.split(",").map(sk => sk.trim()).filter(Boolean),
          description
        })
      });

      if (res.ok) {
        setShowPostField(false);
        // Reset form
        setTitle("");
        setCompanyName("");
        setLocation("");
        setType("Remote");
        setDuration("3 Months");
        setStipend("");
        setSkillsRequired("");
        setDescription("");
        
        fetchInternships();
      }
    } catch (e) {
      console.error("Failed to deliver job posting:", e);
    }
  };

  const handleApply = async (internId: string) => {
    try {
      const res = await fetch(`/api/internships/${internId}/apply`, {
        method: "POST"
      });
      if (res.ok) {
        fetchInternships();
        alert("Application Submitted Successfully! Recruiter has been alerted.");
        if (onApplicationSuccess) onApplicationSuccess();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to deliver application.");
      }
    } catch (e) {
      console.error("Failed to post job application draft:", e);
    }
  };

  const filteredInternships = internships.filter(i => {
    const matchesSearch = i.title.toLowerCase().includes(search.toLowerCase()) || 
                          i.companyName.toLowerCase().includes(search.toLowerCase()) ||
                          i.skillsRequired.some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchesType = typeFilter === "All" || i.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 font-sans text-slate-100">
      
      {/* Controls panel */}
      <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-4 bg-slate-900 border border-slate-850 p-4 rounded-xl shadow-md">
        <div className="flex-1 flex items-center gap-2 bg-slate-950 border border-slate-850 px-3 py-2 rounded-lg">
          <Search className="w-4 h-4 text-slate-500 shrink-0" />
          <input 
            type="text" 
            placeholder="Search internships by company name, skills, title..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent text-sm text-slate-200 placeholder-slate-650 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-850 px-3 py-1.5 rounded-lg text-xs">
            <ListFilter className="w-3.5 h-3.5 text-indigo-400" />
            <select 
              value={typeFilter} 
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-transparent text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="All">All Formats</option>
              <option value="Remote">Remote</option>
              <option value="Hybrid">Hybrid</option>
              <option value="In-office">In-office</option>
            </select>
          </div>

          <button 
            onClick={() => setShowPostField(!showPostField)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-505 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4" /> Post Internship
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* List panel */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest pl-1">Available Openings ({filteredInternships.length})</h4>
            
            {filteredInternships.map((job) => (
              <div key={job.id} className="p-5 bg-slate-905 border border-slate-850 hover:border-slate-800 rounded-2xl shadow-lg hover:shadow-xl transition-all flex flex-col justify-between text-xs space-y-3 relative overflow-hidden">
                <div className="flex justify-between items-start gap-3">
                  <div className="flex gap-3">
                    <img src={job.companyLogo} alt={job.companyName} className="w-10 h-10 rounded-lg object-cover border border-slate-800" />
                    <div>
                      <h4 className="text-sm font-extrabold text-white">{job.title}</h4>
                      <p className="text-indigo-305 font-medium">{job.companyName}</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 bg-indigo-950/40 border border-indigo-900/30 text-indigo-300 rounded-[4px] font-mono font-semibold text-[9px] uppercase tracking-wider">{job.type}</span>
                </div>

                <div className="text-slate-400 flex flex-wrap gap-x-4 gap-y-2 py-2 border-t border-b border-slate-850/60 font-medium">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-slate-550" /> {job.location}</span>
                  <span>💰 stipend: <strong className="text-slate-200">{job.stipend}</strong></span>
                  <span>🗓️ duration: <strong className="text-slate-200">{job.duration}</strong></span>
                </div>

                <p className="text-slate-400 leading-relaxed text-[11px] h-10 overflow-hidden text-ellipsis mb-2">
                  {job.description}
                </p>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-mono text-slate-500 block uppercase">Required Skillset</span>
                  <div className="flex flex-wrap gap-1">
                    {job.skillsRequired.map((s, idx) => (
                      <span key={idx} className="px-2 py-0.5 bg-slate-950 border border-slate-850 text-[10px] text-slate-350 rounded font-medium">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-slate-850/60 mt-2">
                  <span className="font-mono text-[10px] text-emerald-450 font-bold">🎯 {job.applicantsCount} Applicants</span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleApply(job.id)}
                      className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-lg transition-colors cursor-pointer"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredInternships.length === 0 && (
              <div className="text-center py-10 text-slate-500 text-xs">No matching job posts. Update queries.</div>
            )}
          </div>

          {/* Right tracking dashboard */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex border-b border-slate-800 pb-3 mb-4 justify-between items-center">
                <h3 className="text-md font-bold text-white flex items-center gap-2">
                  <Layers className="text-indigo-400 w-4.5 h-4.5" /> Recruiter Applications Desk
                </h3>
              </div>

              <div className="space-y-4 max-h-[450px] overflow-y-auto custom-scrollbar pr-1">
                {internships.map((iPost) => (
                  <div key={iPost.id} className="p-3 bg-slate-950 border border-slate-850 rounded-xl space-y-2.5">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-900">
                      <div>
                        <span className="text-[11px] font-bold text-white block">{iPost.title}</span>
                        <span className="text-[9px] text-slate-500 font-medium">{iPost.companyName}</span>
                      </div>
                      <span className="text-[10px] bg-indigo-950/30 text-indigo-300 font-mono font-bold px-1.5 py-0.5 rounded">
                        {iPost.applicants.length} applied
                      </span>
                    </div>

                    <div className="space-y-2">
                      {iPost.applicants.map((cand, idx) => (
                        <div key={idx} className="p-2 bg-slate-900 border border-slate-850/50 rounded-lg flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <img src={cand.avatarUrl} alt={cand.fullName} className="w-6 h-6 rounded-full object-cover" />
                            <div>
                              <p className="font-bold text-white text-[11px]">{cand.fullName}</p>
                              <span className="text-[9px] text-slate-500">Applied June 12</span>
                            </div>
                          </div>
                          
                          <span className="px-2 py-0.5 bg-amber-400/10 border border-amber-400/30 text-[9px] font-bold text-amber-305 rounded-md uppercase">
                            {cand.status}
                          </span>
                        </div>
                      ))}

                      {iPost.applicants.length === 0 && (
                        <span className="text-slate-600 block text-center text-[10px] italic py-3">No candidates listed yet.</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 bg-transparent text-[10px] text-slate-500 font-mono text-center leading-relaxed">
              Verify student credentials and connect with them in the direct peer chats.
            </div>
          </div>
        </div>
      )}

      {/* CREATE POST MODAL form */}
      {showPostField && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs transition-opacity">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl shadow-2xl p-6 text-slate-100">
            <h3 className="text-lg font-bold text-white mb-1 flex items-center gap-2 border-b border-slate-850 pb-3">
              <Briefcase className="text-indigo-400" /> Post New Startup Internship
            </h3>

            <form onSubmit={handlePostInternship} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] font-mono text-slate-400 mb-1 leading-none uppercase">Internship Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. AI Dev Intern" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-mono text-slate-400 mb-1 leading-none uppercase">Company Name</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Stripe Hub" 
                    value={companyName} 
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-indigo-300 focus:outline-none focus:border-indigo-500"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[9px] font-mono text-slate-400 mb-1 leading-none uppercase">Physical location</label>
                  <input 
                    type="text" 
                    placeholder="Mumbai, IN" 
                    value={location} 
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-[9px] font-mono text-slate-400 mb-1 leading-none uppercase">Format</label>
                  <select 
                    value={type} 
                    onChange={(e: any) => setType(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-350 focus:outline-none"
                  >
                    <option value="Remote">Remote</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="In-office">In-office</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[9px] font-mono text-slate-400 mb-1 leading-none uppercase">stipend / month</label>
                  <input 
                    type="text" 
                    placeholder="INR 20,000" 
                    value={stipend} 
                    onChange={(e) => setStipend(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[9px] font-mono text-slate-400 mb-1 leading-none uppercase">Required Skillset Keywords (Separated by commas)</label>
                <input 
                  type="text" 
                  placeholder="React.js, Node.js, Express.js" 
                  value={skillsRequired} 
                  onChange={(e) => setSkillsRequired(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[9px] font-mono text-slate-400 mb-1 leading-none uppercase">stochastic description Duties</label>
                <textarea 
                  placeholder="Outline internship targets, daily workspace routines, and expected skills achievements..." 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 font-sans"
                  required
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-855">
                <button 
                  type="button" 
                  onClick={() => setShowPostField(false)}
                  className="px-4 py-2 border border-slate-850 hover:bg-slate-850 text-slate-350 rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-505 text-white rounded-lg text-xs font-semibold cursor-pointer"
                >
                  Post Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
