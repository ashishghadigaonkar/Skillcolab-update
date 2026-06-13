/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Team, TeamApplication, Project 
} from "../../../types";
import { 
  Users, CheckCircle2, ShieldAlert, Plus, Calendar, CheckSquare, Clock, ArrowRight, UserCheck 
} from "lucide-react";

interface TeamBuilderProps {
  onRosterUpdated?: () => void;
  projects: Project[];
  fetchProjects: () => void;
}

export default function TeamBuilder({ onRosterUpdated, projects, fetchProjects }: TeamBuilderProps) {
  const [teams, setTeams] = useState<Team[]>([]);
  const [applications, setApplications] = useState<TeamApplication[]>([]);
  const [loading, setLoading] = useState(true);

  // New Milestone forms states
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [mTitle, setMTitle] = useState("");
  const [mDesc, setMDesc] = useState("");
  const [mDueDate, setMDueDate] = useState("");

  useEffect(() => {
    fetchTeamsAndApps();
  }, [projects]);

  const fetchTeamsAndApps = async () => {
    setLoading(true);
    try {
      const [resTeams, resApps] = await Promise.all([
        fetch("/api/teams"),
        fetch("/api/applications")
      ]);
      if (resTeams.ok && resApps.ok) {
        const teamsData = await resTeams.json();
        const appsData = await resApps.json();
        setTeams(teamsData);
        setApplications(appsData);
      }
    } catch (e) {
      console.error("Failed to fetch logs in workspace:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleApplicationStatus = async (appId: string, status: "Approved" | "Rejected") => {
    try {
      const res = await fetch(`/api/applications/${appId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        await fetchTeamsAndApps();
        fetchProjects();
        if (onRosterUpdated) onRosterUpdated();
      }
    } catch (e) {
      console.error("Error setting applicant status:", e);
    }
  };

  const handleAddMilestone = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId || !mTitle) return;

    try {
      const res = await fetch(`/api/projects/${selectedProjectId}/milestones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: mTitle,
          description: mDesc,
          dueDate: mDueDate
        })
      });
      if (res.ok) {
        setMTitle("");
        setMDesc("");
        setMDueDate("");
        fetchProjects();
      }
    } catch (e) {
      console.error("Error pushing milestone:", e);
    }
  };

  const handleToggleMilestone = async (projectId: string, milestoneId: string, currentStatus: "Pending" | "Done") => {
    const nextStatus = currentStatus === "Done" ? "Pending" : "Done";
    try {
      const res = await fetch(`/api/projects/${projectId}/milestones/${milestoneId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        fetchProjects();
      }
    } catch (e) {
      console.error("Error toggling milestone checkpoint:", e);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const pendingApps = applications.filter(a => a.status === "Pending");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans text-slate-100">
      {/* LEFT & CENTER: Team Rosters & Applicant screening */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Screening desk */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex border-b border-slate-800 pb-3 mb-4 justify-between items-center">
            <h3 className="text-md font-bold text-white flex items-center gap-2">
              <UserCheck className="text-indigo-400 w-4.5 h-4.5" /> Screening Desk (Pending Applications)
            </h3>
            <span className="px-2 py-0.5 bg-slate-800 border border-slate-700 rounded text-xs font-mono text-indigo-300">
              {pendingApps.length} Incoming
            </span>
          </div>

          <div className="space-y-4">
            {pendingApps.map((app) => (
              <div key={app.id} className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-3.5 hover:border-slate-800 transition-colors">
                <div className="flex items-start gap-3.5">
                  <img src={app.applicantAvatar} alt={app.applicantName} className="w-10 h-10 rounded-full object-cover shrink-0 border border-slate-800" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-white leading-snug">{app.applicantName}</h4>
                    <p className="text-[11px] text-indigo-305 font-medium truncate">{app.applicantHeadline}</p>
                    <p className="text-[10px] text-slate-500 font-mono mt-1">Project Squad: <span className="text-slate-350">{app.projectTitle}</span></p>
                  </div>
                </div>

                <div className="p-3 bg-slate-900 rounded-lg text-xs leading-relaxed text-slate-300 border border-slate-850">
                  <span className="font-bold text-indigo-300 block mb-1 font-mono text-[10px] uppercase">Requested Role: {app.requestedRole}</span>
                  <span className="font-mono text-[10px] text-slate-500 block">Cover Pitch:</span>
                  <p className="italic text-slate-400 mt-1">"{app.coverLetter}"</p>
                </div>

                {/* Applicant Skills array list */}
                <div className="flex flex-wrap gap-1">
                  {app.applicantSkills.map((sk, idx) => (
                    <span key={idx} className="px-1.5 py-0.5 bg-slate-900 border border-slate-850 text-[9px] text-slate-400 font-medium rounded">
                      {sk}
                    </span>
                  ))}
                </div>

                {/* Approve / decline actions */}
                <div className="flex gap-2 justify-end border-t border-slate-900 pt-3">
                  <button 
                    onClick={() => handleApplicationStatus(app.id, "Rejected")}
                    className="px-3 py-1.5 border border-slate-850 hover:bg-slate-850 text-slate-400 hover:text-rose-400 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                  >
                    Decline
                  </button>
                  <button 
                    onClick={() => handleApplicationStatus(app.id, "Approved")}
                    className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    Approve Teammate <CheckCircle2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}

            {pendingApps.length === 0 && (
              <div className="text-center py-8 text-slate-505 text-xs font-sans">
                No active candidate requests. Post project ideas or invite teammates to kickstart collaborations.
              </div>
            )}
          </div>
        </div>

        {/* Existing Team Assemblies */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="border-b border-slate-800 pb-3 mb-4 flex justify-between items-center">
            <h3 className="text-md font-bold text-white flex items-center gap-2">
              <Users className="text-indigo-400 w-4.5 h-4.5" /> Active Team Squads & Rosters
            </h3>
            <span className="text-xs font-mono text-slate-400">Total Teams: {teams.length}</span>
          </div>

          <div className="space-y-6">
            {teams.map((t) => (
              <div key={t.id} className="p-4 bg-slate-950 border border-slate-850 rounded-xl">
                <h4 className="text-sm font-bold text-indigo-400 tracking-tight flex items-center gap-1.5 mb-3">
                  👥 {t.projectTitle} Squad
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {t.members.map((m, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-2.5 bg-slate-900 border border-slate-850 rounded-lg">
                      <img src={m.avatarUrl} alt={m.fullName} className="w-9 h-9 rounded-full object-cover shrink-0 border border-slate-800" />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-white truncate leading-none">{m.fullName}</p>
                        <p className="text-[10px] text-indigo-300 font-semibold mt-1 truncate">{m.role}</p>
                        <span className="text-[9px] text-slate-500 font-mono">Joined {new Date(m.joinedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT SIDEBAR: Milestones managers & schedulers */}
      <div className="space-y-6">
        {/* Milestone form creation and toggling list */}
        <div className="bg-slate-905 border border-slate-800 rounded-2xl p-6 shadow-xl bg-gradient-to-br from-slate-900 to-slate-950">
          <h3 className="text-md font-bold text-white flex items-center gap-2 border-b border-slate-800 pb-3 mb-4">
            <CheckSquare className="text-indigo-400 w-4.5 h-4.5" /> Project Milestones
          </h3>

          {/* Quick-list of projects with milestones */}
          <div className="space-y-4 max-h-[300px] overflow-y-auto custom-scrollbar pr-1 mb-6">
            {projects.map((proj) => (
              <div key={proj.id} className="space-y-2.5 p-3 bg-slate-950 border border-slate-900 rounded-xl text-xs">
                <span className="font-bold text-indigo-300 border-b border-slate-900 pb-1.5 block font-mono text-[10px] truncate uppercase">{proj.title}</span>
                
                <div className="space-y-2">
                  {proj.milestones.map((ms) => (
                    <div key={ms.id} className="flex items-start justify-between gap-1.5 bg-slate-900 p-2 rounded-lg border border-slate-850 hover:border-slate-80">
                      <div className="flex gap-2 items-start min-w-0">
                        <button 
                          onClick={() => handleToggleMilestone(proj.id, ms.id, ms.status)}
                          className={`w-4.5 h-4.5 border rounded flex justify-center items-center shrink-0 mt-0.5 cursor-pointer transition-all ${
                            ms.status === "Done" 
                              ? "bg-indigo-600 border-indigo-500" 
                              : "border-slate-750 hover:border-indigo-500"
                          }`}
                        >
                          {ms.status === "Done" && <span className="text-[10px] text-white font-bold">✔</span>}
                        </button>
                        <div className="min-w-0">
                          <p className={`font-semibold truncate text-[11px] leading-tight ${ms.status === "Done" ? "line-through text-slate-500" : "text-white"}`}>{ms.title}</p>
                          <p className={`text-[10px] leading-relaxed truncate ${ms.status === "Done" ? "text-slate-650" : "text-slate-400"}`}>{ms.description}</p>
                        </div>
                      </div>
                      <span className="text-[9px] font-mono text-slate-500 font-semibold shrink-0 mt-0.5 flex items-center gap-0.5">
                        <Clock className="w-2.5 h-2.5" /> {ms.dueDate}
                      </span>
                    </div>
                  ))}

                  {proj.milestones.length === 0 && (
                    <p className="text-slate-500 text-[10px] italic">No milestones defined. Deploy a task card.</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Add milestone panel */}
          <form onSubmit={handleAddMilestone} className="border-t border-slate-800 pt-4 space-y-3">
            <h4 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-wider">Fast Deploy Milestone</h4>
            
            <div>
              <label className="block text-[9px] text-slate-400 mb-1 font-mono uppercase">Target Project</label>
              <select
                value={selectedProjectId}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
                required
              >
                <option value="">-- Choose Project --</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <label className="block text-[9px] text-slate-400 mb-0.5 font-mono">Task Name</label>
                <input 
                  type="text" 
                  placeholder="UI Setup" 
                  value={mTitle}
                  onChange={(e) => setMTitle(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-xs rounded px-2 py-1 text-white placeholder-slate-705 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label className="block text-[9px] text-slate-400 mb-0.5 font-mono">Target Date</label>
                <input 
                  type="text" 
                  placeholder="2026-06-25" 
                  value={mDueDate}
                  onChange={(e) => setMDueDate(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-xs rounded px-2 py-1 text-indigo-300 placeholder-slate-705 focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-[9px] text-slate-400 mb-0.5 font-mono">Short Description</label>
              <input 
                type="text" 
                placeholder="Stitch views with tailwind CSS" 
                value={mDesc}
                onChange={(e) => setMDesc(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 text-xs rounded px-2 py-1 text-slate-300 placeholder-slate-705 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <button 
              type="submit" 
              className="w-full py-1.5 bg-slate-850 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white rounded text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5 text-indigo-400" /> Push Milestone
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
