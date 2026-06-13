/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Award, Edit3, MapPin, Link2, Mail, Briefcase, 
  BookOpen, Plus, Trash2, CheckCircle, Flame, Star, 
  ShieldCheck, GitCommit, GitBranch, Terminal, Copy, AlertCircle, Sparkles
} from "lucide-react";
import { User } from "../types";
import { FirebaseAuthService } from "../services/firebase";

export default function MyUserProfile() {
  const [user, setUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form states
  const [fullName, setFullName] = useState("");
  const [headline, setHeadline] = useState("");
  const [bio, setBio] = useState("");
  const [skillsStr, setSkillsStr] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [linkedinLink, setLinkedinLink] = useState("");
  const [portfolioLink, setPortfolioLink] = useState("");

  // Certificates list
  const [certificates, setCertificates] = useState<string[]>([
    "AWS Certified Cloud Practitioner (A-4122)",
    "Google Generative AI Specialization (G-903)",
    "Meta Frontend Software Engineer Certificate (M-771)"
  ]);
  const [newCert, setNewCert] = useState("");

  // Achievements list
  const [achievements, setAchievements] = useState<string[]>([
    "1st Place Winner - AI Studio Hackathon 2026",
    "Open Source Ally Badge - 150 commit points",
    "Completed 6-Month Fullstack Roadmap Milestone"
  ]);
  const [newAch, setNewAch] = useState("");

  // Experience state
  const [newCompany, setNewCompany] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDuration, setNewDuration] = useState("");
  const [newDesc, setNewDesc] = useState("");

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users/me");
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        setFullName(data.fullName || "Ashish Ghadigaonkar");
        setHeadline(data.headline || "Fullstack Software Engineer & AI Builder");
        setBio(data.bio || "B.Tech Computer Science Sophomore. Passionate about building decentralized systems, native mobile applications, and proxy gateway systems.");
        setSkillsStr((data.skills || ["React", "TypeScript", "Node.js", "Python"]).join(", "));
        setGithubLink(data.links?.github || "https://github.com/developer-hero");
        setLinkedinLink(data.links?.linkedin || "https://linkedin.com/in/campus-developer");
        setPortfolioLink(data.links?.portfolio || "https://skillcollab.edu/portfolio");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      const parsedSkills = skillsStr.split(",").map(s => s.trim()).filter(Boolean);
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
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany || !newTitle || !user) return;
    try {
      const updatedExp = [
        ...user.experience,
        {
          title: newTitle,
          company: newCompany,
          startDate: newDuration || "June 2025",
          description: newDesc || "Building server routing blocks"
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
      console.error(e);
    }
  };

  const handleAddCertificate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCert.trim()) return;
    setCertificates([...certificates, newCert.trim()]);
    setNewCert("");
  };

  const handleAddAchievement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAch.trim()) return;
    setAchievements([...achievements, newAch.trim()]);
    setNewAch("");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!user) return <div className="text-white p-4">Profile loading failure</div>;

  return (
    <div className="space-y-6 font-sans">
      
      {/* 1. PROFILE HEADER CARD */}
      <div className="bg-slate-900 border border-slate-850 rounded-2xl overflow-hidden shadow-xl text-slate-100">
        
        {/* Banner Cover image */}
        <div className="h-32 xs:h-40 bg-slate-800 relative">
          <img 
            src={user.coverUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=850&q=80"} 
            alt="cover" 
            className="w-full h-full object-cover"
          />
          <div className="absolute top-4 right-4 flex gap-2">
            <button 
              onClick={() => setIsEditing(!isEditing)} 
              className="bg-slate-950/80 hover:bg-indigo-600 border border-slate-700 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-md backdrop-blur-xs cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" /> {isEditing ? "View Profile" : "Edit Profile"}
            </button>
            <button 
              onClick={async () => {
                await FirebaseAuthService.logout();
                window.location.reload();
              }} 
              className="bg-rose-950/85 hover:bg-rose-700 border border-rose-900 text-white font-bold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-all shadow-md backdrop-blur-xs cursor-pointer animate-fade-in"
            >
              Log Out
            </button>
          </div>
        </div>

        {/* Profile Stats metadata */}
        <div className="p-5 xs:p-6 relative">
          {/* Circular float avatar */}
          <div className="absolute -top-12 left-5 xs:left-6 w-24 h-24 rounded-full border-4 border-slate-900 overflow-hidden bg-slate-900 shadow-lg">
            <img src={user.avatarUrl} alt={user.fullName} className="w-full h-full object-cover" />
          </div>

          <div className="pt-12 space-y-4">
            {!isEditing ? (
              <div className="space-y-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-bold text-white tracking-tight">{user.fullName}</h3>
                    <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded text-[9px] font-bold text-indigo-400 font-mono tracking-wider">
                      {user.role}
                    </span>
                    <span className="px-2 py-0.5 bg-amber-400/10 border border-amber-400/25 rounded text-[9px] font-bold text-amber-400 font-mono flex items-center gap-0.5">
                      🏆 {user.reputationPoints} Reps
                    </span>
                  </div>
                  <p className="text-indigo-300 text-xs font-semibold mt-1 font-sans">{user.headline}</p>
                  <div className="flex items-center gap-1.5 text-slate-400 text-xs mt-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-500" /> {user.location || "State Tech Campus, block B"}
                  </div>
                </div>

                {/* About Bio Section */}
                <div className="border-t border-slate-850/60 pt-3">
                  <h4 className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest font-mono mb-1">About Biography</h4>
                  <p className="text-slate-350 text-xs leading-relaxed font-sans">{user.bio || bio}</p>
                </div>

                {/* Connection Quick Metrics */}
                <div className="flex gap-4 border-t border-slate-850/60 pt-3 text-[10px] font-mono text-slate-400">
                  <div>
                    <span className="text-white font-bold font-sans text-xs block">{user.connectionsCount || 142}</span>
                    <span>Connections</span>
                  </div>
                  <div>
                    <span className="text-white font-bold font-sans text-xs block">{user.followersCount || 238}</span>
                    <span>Followers</span>
                  </div>
                </div>

                {/* Links Row */}
                <div className="flex flex-wrap items-center gap-3 border-t border-slate-850/60 pt-3 text-[10px] font-mono text-slate-400">
                  <a href={githubLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white transition-colors">
                    <Link2 className="w-3 h-3 text-indigo-400" /> GitHub Repo
                  </a>
                  <a href={linkedinLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white transition-colors">
                    <Link2 className="w-3 h-3 text-indigo-400" /> LinkedIn Profile
                  </a>
                  <a href={portfolioLink} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-white transition-colors">
                    <Link2 className="w-3 h-3 text-indigo-400" /> personal Site
                  </a>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Full Name</label>
                    <input 
                      type="text" 
                      value={fullName} 
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Headline Bio</label>
                    <input 
                      type="text" 
                      value={headline} 
                      onChange={(e) => setHeadline(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-indigo-300 outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="text-xs">
                  <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Biography Statement</label>
                  <textarea 
                    value={bio} 
                    onChange={(e) => setBio(e.target.value)}
                    rows={3}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-2 text-white outline-none focus:border-indigo-500 resize-none"
                  />
                </div>

                <div className="text-xs">
                  <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Skills Tags (commas)</label>
                  <input 
                    type="text" 
                    value={skillsStr} 
                    onChange={(e) => setSkillsStr(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-white outline-none focus:border-indigo-500"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-xs">
                  <div>
                    <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">GitHub URL</label>
                    <input 
                      type="url" 
                      value={githubLink} 
                      onChange={(e) => setGithubLink(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-slate-300 outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">LinkedIn URL</label>
                    <input 
                      type="url" 
                      value={linkedinLink} 
                      onChange={(e) => setLinkedinLink(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-indigo-300 outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">portfolio URL</label>
                    <input 
                      type="url" 
                      value={portfolioLink} 
                      onChange={(e) => setPortfolioLink(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-slate-300 outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-850">
                  <button 
                    type="button" 
                    onClick={() => setIsEditing(false)}
                    className="px-3.5 py-1.5 border border-slate-800 text-slate-400 text-xs font-semibold rounded hover:text-white"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="px-4 py-1.5 bg-indigo-600 text-white text-xs font-bold rounded hover:bg-indigo-500 shadow"
                  >
                    Save Biography
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* 2. SKILLS INVENTORY */}
      <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl space-y-3">
        <h3 className="text-xs font-bold font-mono text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
          <BookOpen className="w-4 h-4" /> Core Technical Skills Inventory
        </h3>
        <div className="flex flex-wrap gap-2">
          {(user.skills || ["React", "TypeScript", "Node.js", "Python"]).map((skill, index) => (
            <span key={index} className="px-3 py-1 bg-slate-950 border border-slate-800 hover:border-slate-700 text-xs font-semibold text-slate-300 rounded-lg cursor-default transition-all">
              ⚡ {skill}
            </span>
          ))}
        </div>
      </div>

      {/* 3. EXPERIENCE TIMELINE COLLAPSIBLE */}
      <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl space-y-4">
        <h3 className="text-xs font-bold font-mono text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
          <Briefcase className="w-4 h-4" /> Professional Work Timeline
        </h3>

        <div className="space-y-3.5">
          {user.experience && user.experience.map((exp, idx) => (
            <div key={idx} className="flex gap-3 bg-slate-950 border border-slate-850/50 p-3 rounded-xl relative">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/10 border border-indigo-500/20 flex justify-center items-center shrink-0">
                <Briefcase className="w-4.5 h-4.5 text-indigo-400" />
              </div>
              <div className="text-xs">
                <h4 className="font-bold text-white">{exp.title}</h4>
                <p className="text-indigo-300 font-medium">{exp.company} • <span className="text-slate-500 font-mono text-[10px]">{exp.startDate || "Current"}</span></p>
                <p className="text-[11px] text-slate-450 mt-1 leading-normal font-sans">{exp.description}</p>
              </div>
            </div>
          ))}

          {(!user.experience || user.experience.length === 0) && (
            <div className="text-center py-4 text-slate-500 text-xs italic">No job records listed yet. Draft one below!</div>
          )}
        </div>

        {/* Add job experience sub-form */}
        <form onSubmit={handleAddExperience} className="pt-3 border-t border-slate-850/70 space-y-3 text-xs">
          <span className="block text-[10px] text-slate-400 font-semibold uppercase tracking-wider font-mono">Record a new tenure</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input 
              type="text" 
              placeholder="e.g. Google GCP" 
              value={newCompany} 
              onChange={(e) => setNewCompany(e.target.value)}
              className="bg-slate-950 border border-slate-850 px-2 rounded py-1.5 text-white outline-none focus:border-indigo-500"
              required
            />
            <input 
              type="text" 
              placeholder="e.g. Lead Software Architect" 
              value={newTitle} 
              onChange={(e) => setNewTitle(e.target.value)}
              className="bg-slate-950 border border-slate-850 px-2 rounded py-1.5 text-white outline-none focus:border-indigo-500"
              required
            />
            <input 
              type="text" 
              placeholder="e.g. Sept 2025 - Dec 2025" 
              value={newDuration} 
              onChange={(e) => setNewDuration(e.target.value)}
              className="bg-slate-950 border border-slate-850 px-2 rounded py-1.5 text-white outline-none focus:border-indigo-500"
            />
          </div>
          <textarea 
            placeholder="Draft core responsibilities or tech stacks handled..." 
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            rows={1}
            className="w-full bg-slate-950 border border-slate-850 px-2.5 py-1.5 rounded text-white outline-none focus:border-indigo-500 resize-none"
          />
          <button 
            type="submit" 
            className="px-3.5 py-1.5 bg-slate-950 hover:bg-slate-850 text-slate-300 font-semibold rounded border border-slate-850 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <Plus className="w-4 h-4 text-indigo-400" /> Save Job Entry
          </button>
        </form>
      </div>

      {/* 4. CERTIFICATES & AWARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* CERTIFICATES */}
        <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl space-y-3.5">
          <h3 className="text-xs font-bold font-mono text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Professional Certifications
          </h3>
          <div className="space-y-2">
            {certificates.map((cert, index) => (
              <div key={index} className="p-2.5 bg-slate-950 border border-slate-850/50 rounded-xl flex items-center gap-2 text-xs">
                <span className="text-emerald-400 font-mono text-xs">🏆</span>
                <span className="text-slate-300 leading-snug">{cert}</span>
              </div>
            ))}
          </div>
          <form onSubmit={handleAddCertificate} className="flex gap-2 text-xs">
            <input 
              type="text" 
              required
              placeholder="e.g. Azure Architect Cert (Z-14)"
              value={newCert}
              onChange={(e) => setNewCert(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-white outline-none focus:border-indigo-500"
            />
            <button type="submit" className="px-3.5 bg-indigo-650 hover:bg-indigo-600 font-bold text-white rounded cursor-pointer transition-colors">
              Add
            </button>
          </form>
        </div>

        {/* ACHIEVEMENTS */}
        <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl space-y-3.5">
          <h3 className="text-xs font-bold font-mono text-indigo-400 uppercase tracking-widest flex items-center gap-1.5">
            <Award className="w-4 h-4" /> Academic & Extracurricular Feats
          </h3>
          <div className="space-y-2">
            {achievements.map((ach, index) => (
              <div key={index} className="p-2.5 bg-slate-950 border border-slate-850/50 rounded-xl flex items-center gap-2 text-xs">
                <span className="text-amber-400">🔥</span>
                <span className="text-slate-300 leading-snug">{ach}</span>
              </div>
            ))}
          </div>
          <form onSubmit={handleAddAchievement} className="flex gap-2 text-xs">
            <input 
              type="text" 
              required
              placeholder="e.g. 500+ LeetCode problems solved"
              value={newAch}
              onChange={(e) => setNewAch(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-white outline-none focus:border-indigo-500"
            />
            <button type="submit" className="px-3.5 bg-indigo-650 hover:bg-indigo-600 font-bold text-white rounded cursor-pointer transition-colors">
              Add
            </button>
          </form>
        </div>

      </div>

      {/* 5. GITHUB STATS SPEC (Beautiful wireframe metrics) */}
      <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl space-y-4">
        <h3 className="text-xs font-bold font-mono text-indigo-400 uppercase tracking-widest flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-emerald-400 animate-pulse" /> Verified GitHub Developer Metrics
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-slate-955 border border-slate-850 rounded-xl">
            <span className="text-xl font-bold font-mono text-emerald-400">482</span>
            <span className="text-[9px] text-slate-500 font-mono block mt-1 uppercase">Total Commits</span>
          </div>
          <div className="p-3 bg-slate-955 border border-slate-850 rounded-xl">
            <span className="text-xl font-bold font-mono text-indigo-400">23</span>
            <span className="text-[9px] text-slate-500 font-mono block mt-1 uppercase">Merged PRs</span>
          </div>
          <div className="p-3 bg-slate-955 border border-slate-850 rounded-xl">
            <span className="text-xl font-bold font-mono text-amber-500">12 Days</span>
            <span className="text-[9px] text-slate-500 font-mono block mt-1 uppercase">Current Streak</span>
          </div>
          <div className="p-3 bg-slate-955 border border-slate-850 rounded-xl">
            <span className="text-xl font-bold font-mono text-pink-400">89%</span>
            <span className="text-[9px] text-slate-500 font-mono block mt-1 uppercase">PR Approval Rate</span>
          </div>
        </div>

        {/* Repo items */}
        <div className="space-y-2 pt-2 text-xs">
          <span className="block text-[9px] text-slate-400 font-mono uppercase tracking-wider">Top Synced Repositories</span>
          
          <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl flex justify-between items-center">
            <div>
              <strong className="text-white font-mono text-xs">super-router-gateway</strong>
              <p className="text-[10px] text-slate-450 mt-0.5">High performance HTTP proxy with native multiplexing routines in Rust.</p>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">★ 182 Stars</span>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl flex justify-between items-center">
            <div>
              <strong className="text-white font-mono text-xs">skillcollab-mobile-sdk</strong>
              <p className="text-[10px] text-slate-450 mt-0.5">Framer and swift transitions for iOS responsive widget rendering.</p>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 font-bold">★ 42 Stars</span>
          </div>
        </div>
      </div>

    </div>
  );
}
