/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Award, Edit3, MapPin, Link2, Mail, Briefcase, 
  BookOpen, Plus, Trash2, CheckCircle2, Bell, BellOff, ArrowRight, UserCheck 
} from "lucide-react";
import { User } from "../types";

interface DashboardProps {
  onProfileUpdated?: () => void;
  activeProjectCount: number;
}

export default function Dashboard({ onProfileUpdated, activeProjectCount }: DashboardProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);

  // Edit fields
  const [fullName, setFullName] = useState("");
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [skillsStr, setSkillsStr] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [linkedinLink, setLinkedinLink] = useState("");
  const [portfolioLink, setPortfolioLink] = useState("");

  // Experience edit temp state
  const [newCompany, setNewCompany] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDuration, setNewDuration] = useState("");
  const [newDesc, setNewDesc] = useState("");

  useEffect(() => {
    fetchProfile();
    fetchNotifications();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setFullName(data.fullName || "");
        setHeadline(data.headline || "");
        setBio(data.bio || "");
        setSkillsStr((data.skills || []).join(", "));
        setGithubLink(data.links?.github || "");
        setLinkedinLink(data.links?.linkedin || "");
        setPortfolioLink(data.links?.portfolio || "");
      }
    } catch (e) {
      console.error("Failed to load user profile:", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const res = await fetch("/api/notifications");
      if (res.ok) {
        const data = await res.json();
        setNotifications(data);
      }
    } catch (e) {
      console.error("Failed to fetch notification logs:", e);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsedSkills = skillsStr.split(",").map(s => s.trim()).filter(s => s.length > 0);
      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          headline,
          bio,
          skills: parsedSkills,
          links: {
            github: githubLink,
            linkedin: linkedinLink,
            portfolio: portfolioLink
          }
        })
      });
      if (res.ok) {
        setIsEditing(false);
        const data = await res.json();
        setUser(data.user);
        if (onProfileUpdated) onProfileUpdated();
      }
    } catch (e) {
      console.error("Error saving profile modifications:", e);
    }
  };

  const handleAddExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany || !newTitle) return;
    if (!user) return;
    try {
      const updatedExp = [
        ...user.experience,
        {
          title: newTitle,
          company: newCompany,
          startDate: newDuration,
          description: newDesc
        }
      ];
      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ experience: updatedExp })
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setNewCompany("");
        setNewTitle("");
        setNewDuration("");
        setNewDesc("");
      }
    } catch (e) {
      console.error("Failed to add CV experience:", e);
    }
  };

  const handleMarkNotificationsRead = async () => {
    try {
      const res = await fetch("/api/notifications/read-all", { method: "POST" });
      if (res.ok) {
        fetchNotifications();
      }
    } catch (e) {
      console.error("Error clearing notify indicators:", e);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) return <div className="text-white">Profile initialization error.</div>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 font-sans">
      {/* LEFT & CENTER COLS: Profile Details & CV logs */}
      <div className="lg:col-span-2 space-y-6">
        {/* Profile Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl text-slate-100">
          {/* Cover photo banner */}
          <div className="h-44 bg-slate-800 relative">
            <img 
              src={user.coverUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=850&q=80"} 
              alt="cover" 
              className="w-full h-full object-cover"
            />
            <button 
              onClick={() => setIsEditing(!isEditing)} 
              className="absolute top-4 right-4 bg-slate-950/80 hover:bg-indigo-600 border border-slate-700 hover:border-indigo-500 text-white font-medium text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-md backdrop-blur-xs"
            >
              <Edit3 className="w-3.5 h-3.5" /> {isEditing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          {/* User Bio and Credentials */}
          <div className="p-6 relative">
            {/* Avatar positioning */}
            <div className="absolute -top-16 left-6 w-28 h-28 rounded-full border-4 border-slate-900 overflow-hidden bg-slate-900 shadow-lg">
              <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
            </div>

            <div className="pt-12">
              {!isEditing ? (
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="text-2xl font-bold tracking-tight text-white">{user.fullName}</h3>
                      <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/30 rounded-md text-indigo-400 font-mono text-[10px] font-bold">
                        {user.role}
                      </span>
                    </div>
                    <p className="text-indigo-300 text-sm font-medium mt-1">{user.headline}</p>
                    <div className="flex items-center gap-2 text-slate-400 text-xs mt-2">
                      <MapPin className="w-3.5 h-3.5 text-slate-500" /> {user.location || "State Tech, Campus Roster"}
                    </div>
                  </div>

                  <div className="border-t border-slate-800/60 pt-4">
                    <h4 className="text-slate-300 font-semibold text-xs uppercase font-mono tracking-wider mb-2">Biography</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">{user.bio || "No biography updated yet. Click edit to write one!"}</p>
                  </div>

                  {/* Skills tags */}
                  <div className="border-t border-slate-800/60 pt-4">
                    <h4 className="text-slate-300 font-semibold text-xs uppercase font-mono tracking-wider mb-2">Skills Inventory</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {user.skills.map((skill, i) => (
                        <span key={i} className="px-2.5 py-1 bg-slate-850 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 rounded-md transition-colors cursor-default">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Portfolio links */}
                  <div className="flex flex-wrap items-center gap-4 text-slate-400 text-xs border-t border-slate-800/60 pt-4">
                    {user.links?.github && (
                      <a href={user.links.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
                        <Link2 className="w-3.5 h-3.5 text-indigo-400" /> GitHub Repo
                      </a>
                    )}
                    {user.links?.linkedin && (
                      <a href={user.links.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
                        <UserCheck className="w-3.5 h-3.5 text-indigo-400" /> LinkedIn
                      </a>
                    )}
                    {user.links?.portfolio && (
                      <a href={user.links.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 hover:text-white transition-colors">
                        <Mail className="w-3.5 h-3.5 text-indigo-400" /> My Website
                      </a>
                    )}
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSaveProfile} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">Full Name</label>
                      <input 
                        type="text" 
                        value={fullName} 
                        onChange={(e) => setFullName(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">Professional Headline</label>
                      <input 
                        type="text" 
                        value={headline} 
                        onChange={(e) => setHeadline(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-indigo-300 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Bio Description</label>
                    <textarea 
                      value={bio} 
                      onChange={(e) => setBio(e.target.value)}
                      rows={3}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-indigo-500 font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Skills (Separated by commas)</label>
                    <input 
                      type="text" 
                      value={skillsStr} 
                      onChange={(e) => setSkillsStr(e.target.value)}
                      placeholder="React.js, Node.js, Python, Figma"
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">GitHub Link</label>
                      <input 
                        type="text" 
                        value={githubLink} 
                        onChange={(e) => setGithubLink(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">LinkedIn Link</label>
                      <input 
                        type="text" 
                        value={linkedinLink} 
                        onChange={(e) => setLinkedinLink(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-mono text-slate-400 mb-1">Portfolio Web Link</label>
                      <input 
                        type="text" 
                        value={portfolioLink} 
                        onChange={(e) => setPortfolioLink(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2 border-t border-slate-850">
                    <button 
                      type="button" 
                      onClick={() => setIsEditing(false)} 
                      className="px-4 py-2 border border-slate-850 hover:bg-slate-850 text-slate-300 rounded-lg text-xs font-medium transition-colors"
                    >
                      Cancel
                    </button>
                    <button 
                      type="submit" 
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-md transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Professional Experience CV Blocks */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-slate-100">
          <div className="flex justify-between items-center border-b border-slate-800 pb-3 mb-4">
            <h3 className="text-md font-bold text-white flex items-center gap-2">
              <Briefcase className="text-indigo-400 w-4.5 h-4.5" /> Working Experience
            </h3>
            <span className="text-[11px] font-mono text-slate-400">Total Entries: {user.experience.length}</span>
          </div>

          {/* Render Experience list */}
          <div className="space-y-4">
            {user.experience.map((exp, idx) => (
              <div key={idx} className="flex gap-4 p-4 bg-slate-950 border border-slate-850 rounded-xl relative">
                <div className="w-10 h-10 rounded-lg bg-indigo-600/10 border border-indigo-500/20 flex justify-center items-center shrink-0">
                  <Briefcase className="w-5 h-5 text-indigo-400" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{exp.title}</h4>
                  <p className="text-xs text-indigo-300 font-medium">{exp.company} • <span className="text-slate-500">{exp.startDate || "Current"}</span></p>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{exp.description}</p>
                </div>
              </div>
            ))}

            {user.experience.length === 0 && (
              <div className="text-center py-6 text-slate-500 text-xs">No corporate listings posted yet. Add experience details below.</div>
            )}
          </div>

          {/* Add experience inputs */}
          <form onSubmit={handleAddExperience} className="mt-6 pt-6 border-t border-slate-800/60 space-y-3">
            <h4 className="text-xs font-mono font-bold text-indigo-400 uppercase tracking-widest mb-1">Add Experience Entry</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <input 
                type="text" 
                placeholder="Company Name (e.g. Google GCP)" 
                value={newCompany} 
                onChange={(e) => setNewCompany(e.target.value)}
                className="bg-slate-950 border border-slate-850 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                required
              />
              <input 
                type="text" 
                placeholder="Role (e.g. Lead Software Architect)" 
                value={newTitle} 
                onChange={(e) => setNewTitle(e.target.value)}
                className="bg-slate-950 border border-slate-850 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
                required
              />
              <input 
                type="text" 
                placeholder="Timeline (e.g. June 2025 - Present)" 
                value={newDuration} 
                onChange={(e) => setNewDuration(e.target.value)}
                className="bg-slate-950 border border-slate-850 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <textarea 
              placeholder="Primary duties and technologies handled during tenure..." 
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              rows={2}
              className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2.5 text-xs text-slate-300 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
            />
            <button 
              type="submit" 
              className="w-full md:w-auto px-4 py-2 bg-slate-850 hover:bg-slate-850 hover:text-white border border-slate-800 hover:border-slate-700 text-slate-300 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-indigo-400" /> Save Work Node
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT SIDEBAR: Platform Reputation & Live Notifications Panel */}
      <div className="space-y-6">
        {/* Reputation Score & Badges card */}
        <div className="bg-slate-905 border border-slate-800 rounded-2xl p-6 shadow-xl text-slate-100 bg-gradient-to-br from-slate-900 to-slate-950">
          <div className="flex border-b border-slate-800/80 pb-3 mb-4 justify-between items-center">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-widest">Platform Reputation</h4>
            <Award className="text-amber-400 w-4.5 h-4.5" />
          </div>

          <div className="text-center py-4">
            <span className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-indigo-400 font-mono">
              {user.reputationPoints}
            </span>
            <p className="text-xs text-slate-400 mt-2 font-medium">Reputation Points Accumulation</p>
            <p className="text-[10px] text-slate-500 mt-2 max-w-sm mx-auto">
              Points are auto-awarded upon successful project applications, milestone approvals, hackathon submissions (+150 pts), and verified bookings.
            </p>
          </div>

          <div className="border-t border-slate-850 pt-4 mt-2">
            <h4 className="text-xs font-semibold text-slate-300 font-mono tracking-wider mb-2">My Badges</h4>
            <div className="flex flex-wrap gap-1.5">
              {user.badges.map((badge, i) => (
                <span key={i} className="px-2 py-1 bg-amber-400/10 border border-amber-400/30 text-[10px] font-bold text-amber-300 rounded-md">
                  🏆 {badge}
                </span>
              ))}
              {user.badges.length === 0 && (
                <span className="text-slate-500 text-[11px]">Deploy first project to earn a badge.</span>
              )}
            </div>
          </div>
        </div>

        {/* Live Notifications */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl text-slate-100">
          <div className="flex justify-between items-center border-b border-slate-800/80 pb-3 mb-4">
            <h3 className="text-md font-bold text-white flex items-center gap-2">
              <Bell className="text-indigo-400 w-4.5 h-4.5" /> Inbox Indicators
            </h3>
            {notifications.some(n => !n.read) && (
              <button 
                onClick={handleMarkNotificationsRead} 
                className="text-[10px] text-indigo-400 hover:text-indigo-300 font-semibold font-mono underline"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="space-y-3 max-h-[350px] overflow-y-auto custom-scrollbar pr-1">
            {notifications.map((notif) => (
              <div 
                key={notif.id} 
                className={`p-3 rounded-lg border text-xs transition-all ${
                  notif.read 
                    ? "bg-slate-950/40 border-slate-900 text-slate-400" 
                    : "bg-indigo-950/20 border-indigo-900/40 text-slate-200 shadow-md"
                }`}
              >
                <div className="flex justify-between items-start gap-2">
                  <span className={`font-semibold ${notif.read ? "text-slate-300" : "text-white"}`}>{notif.title}</span>
                  {!notif.read && <span className="w-1.5 h-1.5 h-1.5 rounded-full bg-indigo-500 shrink-0 mt-1" />}
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">{notif.message}</p>
                <span className="text-[9px] text-slate-500 font-mono mt-2 block">{new Date(notif.createdAt).toLocaleDateString()}</span>
              </div>
            ))}

            {notifications.length === 0 && (
              <div className="text-center py-8 text-slate-500 text-xs">No system alerts in list.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
