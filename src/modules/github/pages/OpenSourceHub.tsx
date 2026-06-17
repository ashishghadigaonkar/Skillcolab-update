/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  GitBranch, GitPullRequest, Code, Award, CheckCircle, 
  Plus, AlertCircle, RefreshCw, Send, Sparkles, Star, 
  Users, Flame, ArrowUpRight, Check, ShieldAlert,
  Sliders, Link2, BookOpen, User, Eye, EyeOff, Pin, FolderPlus,
  Compass, BarChart3, Binary, Lock, Briefcase, Zap, Search
} from "lucide-react";

export default function OpenSourceHub() {
  // Original claim ticket states
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showLogForm, setShowLogForm] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState("");
  const [prUrl, setPrUrl] = useState("");
  const [commentText, setCommentText] = useState("");
  const [logSuccess, setLogSuccess] = useState(false);
  const [rewardedPoints, setRewardedPoints] = useState(0);

  // Score stats leaderboard state (Original)
  const [leaderboard, setLeaderboard] = useState<any[]>([
    { rank: 1, name: "Sneha Kapadia", points: 840, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80", badge: "Core Maintainer" },
    { rank: 2, name: "Ashish Ghadigaonkar", points: 450, avatar: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=80&h=80&q=80", badge: "Open Source Ally" },
    { rank: 3, name: "Pranav Shah", points: 320, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80", badge: "Local Contributor" },
    { rank: 4, name: "Juhi Chawla", points: 280, avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=80&h=80&q=80", badge: "Contributor" }
  ]);

  // Master GitHub Integration states
  const [githubData, setGithubData] = useState<any>(null);
  const [checkingConnection, setCheckingConnection] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [activeSubTab, setActiveSubTab] = useState<"tickets" | "portfolio" | "ai" | "matching">("tickets");
  
  // Project matching inputs
  const [techTargetQuery, setTechTargetQuery] = useState("React, TypeScript");
  const [matchingResults, setMatchingResults] = useState<any[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [importingRepo, setImportingRepo] = useState<string | null>(null);

  // Fetch verified profile
  const fetchGithubProfile = async () => {
    try {
      const res = await fetch("/api/github/profile");
      if (res.ok) {
        const data = await res.json();
        if (data.connected) {
          setGithubData(data);
          // Sync client user profile if needed
        } else {
          setGithubData(null);
        }
      }
    } catch (e) {
      console.error("[OpenSourceHub] Error fetching GitHub profile details:", e);
    } finally {
      setCheckingConnection(false);
    }
  };

  const loadIssues = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/open-source/issues");
      if (res.ok) {
        const data = await res.json();
        setIssues(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadIssues();
    fetchGithubProfile();
  }, []);

  // PostMessage popup listener for successful auth (Phase 1)
  useEffect(() => {
    const handleOauthMessage = (e: MessageEvent) => {
      if (e.data?.type === "GITHUB_OAUTH_SUCCESS") {
        fetchGithubProfile();
        setActiveSubTab("portfolio");
      }
    };
    window.addEventListener("message", handleOauthMessage);
    return () => window.removeEventListener("message", handleOauthMessage);
  }, []);

  // Sync developer matching on targets change
  useEffect(() => {
    if (activeSubTab === "matching") {
      handleLoadMatches();
    }
  }, [activeSubTab, techTargetQuery]);

  // Initiate Popup-based GitHub OAuth (Phase 1 / Skills Guideline)
  const handleConnectGithub = async () => {
    try {
      const redirect = `${window.location.origin}/api/github/callback`;
      const res = await fetch(`/api/github/auth-url?redirectUri=${encodeURIComponent(redirect)}`);
      if (res.ok) {
        const data = await res.json();
        const authWindow = window.open(data.url, "github_oauth_popup", "width=600,height=750");
        if (!authWindow) {
          alert("Please enable popups to sync your GitHub profile!");
        }
      }
    } catch (e) {
      console.error("[OpenSourceHub] Connect GitHub flow failed:", e);
    }
  };

  // Trigger manually updated synchronization (Phase 3)
  const handleManualSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch("/api/github/sync", { method: "POST" });
      if (res.ok) {
        await fetchGithubProfile();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSyncing(false);
    }
  };

  // Toggle repository visibility flags (Phase 6)
  const handleToggleRepoFlag = async (repoName: string, flag: "featured" | "pinned" | "hidden") => {
    try {
      const res = await fetch(`/api/github/repo/${encodeURIComponent(repoName)}/feature`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flag })
      });
      if (res.ok) {
        await fetchGithubProfile();
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Auto Project Import (Phase 7)
  const handleImportProject = async (repoName: string) => {
    setImportingRepo(repoName);
    try {
      const res = await fetch("/api/github/import-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoName })
      });
      if (res.ok) {
        alert(`Successfully imported repository "${repoName}" as an on-campus active SkillCollab task recruiting team members!`);
        await fetchGithubProfile();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setImportingRepo(null);
    }
  };

  // Load Developer Discovery results (Phase 12)
  const handleLoadMatches = async () => {
    setLoadingMatches(true);
    try {
      const res = await fetch(`/api/github/match?skills=${encodeURIComponent(techTargetQuery)}`);
      if (res.ok) {
        const data = await res.json();
        setMatchingResults(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingMatches(false);
    }
  };

  // Original log work contribution validation
  const handleLogContribution = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIssueId || !prUrl || !commentText.trim()) return;

    try {
      const res = await fetch("/api/open-source/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          issueId: selectedIssueId,
          pullRequestUrl: prUrl,
          comment: commentText
        })
      });

      if (res.ok) {
        const data = await res.json();
        setRewardedPoints(data.pointsEarned);
        setLogSuccess(true);
        setTimeout(() => {
          setLogSuccess(false);
          setShowLogForm(false);
          setPrUrl("");
          setCommentText("");
          // Update leaderboard locally
          setLeaderboard(prev => prev.map(p => {
            if (p.name === "Ashish Ghadigaonkar") {
              return { ...p, points: p.points + data.pointsEarned };
            }
            return p;
          }).sort((a, b) => b.points - a.points).map((p, index) => ({ ...p, rank: index + 1 })));
        }, 3000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // Heatmap helper: generate realistic contribution grid squares
  const renderHeatmapGrid = () => {
    const contributionWeeksNum = 14;
    const squares: any[] = [];
    // Set static mock contribution weights to look organic
    const weights = [
      0, 1, 0, 0, 3, 4, 1, 0, 2, 0, 0, 4, 2, 1, 0, 0, 0, 2, 3, 0,
      1, 2, 3, 0, 1, 0, 0, 4, 2, 0, 0, 1, 3, 4, 1, 2, 0, 0, 2, 0,
      0, 1, 0, 4, 3, 2, 0, 1, 0, 0, 1, 2, 4, 1, 0, 3, 2, 0, 1, 0,
      0, 4, 1, 0, 2, 3, 1, 0, 0, 1, 0, 2, 4, 3, 0, 1, 2, 0, 0, 0,
      0, 2, 0, 1, 3, 4, 2, 1, 0, 0, 1, 3, 4, 2, 0, 1, 0, 0, 3, 2
    ];

    for (let i = 0; i < 98; i++) {
      const w = weights[i % weights.length];
      let bg = "bg-slate-850";
      if (w === 1) bg = "bg-emerald-950/65";
      else if (w === 2) bg = "bg-emerald-900/60";
      else if (w === 3) bg = "bg-emerald-750";
      else if (w === 4) bg = "bg-emerald-500";

      squares.push(
        <div 
          key={i} 
          className={`w-[11px] h-[11px] rounded-[1.5px] ${bg} transition-all hover:scale-130`}
          title={`Contributions: ${w === 0 ? "None" : w * 3 + " commits"}`}
        />
      );
    }

    return (
      <div className="flex flex-col space-y-1.5 p-3.5 bg-slate-950 border border-slate-850 rounded-xl select-none">
        <div className="flex justify-between items-center text-[9px] font-mono text-slate-500 uppercase tracking-wider pb-1">
          <span>Past 90 Days activity status</span>
          <span className="flex items-center gap-1">
            <span>Less</span>
            <div className="w-2.5 h-2.5 bg-slate-850 rounded-sm" />
            <div className="w-2.5 h-2.5 bg-emerald-900/60 rounded-sm" />
            <div className="w-2.5 h-2.5 bg-emerald-750 rounded-sm" />
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-sm" />
            <span>More</span>
          </span>
        </div>
        <div className="grid grid-flow-col grid-rows-7 gap-[3.5px]">
          {squares}
        </div>
      </div>
    );
  };

  // Achievements design catalog of all system-supported badge layouts
  const systemAchievements = [
    { id: "github_verified", title: "GitHub Connected", desc: "Linked a verified external developer profile securely.", icon: Link2, style: "bg-indigo-500/10 border-indigo-500/25 text-indigo-400" },
    { id: "commits_100", title: "100 Commits Club", desc: "Committed 100+ production milestones.", icon: Binary, style: "bg-amber-500/10 border-amber-500/25 text-amber-400" },
    { id: "commits_1k", title: "1K Commit King", desc: "Landed 1,000+ granular system updates globally.", icon: Flame, style: "bg-red-500/10 border-red-500/25 text-red-500" },
    { id: "prs_10", title: "10 PRs Champion", desc: "Successfully merged 10+ open-source expansions.", icon: GitPullRequest, style: "bg-emerald-500/10 border-emerald-500/25 text-emerald-400" },
    { id: "os_maintainer", title: "OSS Maintainer", desc: "Hosts open public packages scoring star ratings.", icon: Award, style: "bg-fuchsia-500/10 border-fuchsia-500/25 text-fuchsia-400" },
    { id: "community_reviewer", title: "Trusted Reviewer", desc: "Raters reviewing third-party pull requests regularly.", icon: CheckCircle, style: "bg-cyan-500/10 border-cyan-500/25 text-cyan-400" }
  ];

  return (
    <div className="space-y-6">
      
      {/* HEADER SECTION WITH MOUNTED OAUTH TRIGGER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 border border-slate-850 p-5 rounded-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-indigo-400 font-mono text-xs font-semibold uppercase tracking-wider">
            <GitBranch className="w-3.5 h-3.5" /> Krenza Core Verification Module
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">GitHub Technical Portfolio Hub</h2>
          <p className="text-xs text-slate-400">Claim student issues, synchronize professional repositories, generate AI-scorecards, and discover vetting matches.</p>
        </div>

        {checkingConnection ? (
          <div className="px-4 py-2 bg-slate-850 text-slate-400 text-xs font-mono rounded-xl flex items-center gap-2">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" /> Verifying Connection...
          </div>
        ) : githubData ? (
          <div className="flex items-center gap-3">
            <button
              onClick={handleManualSync}
              disabled={syncing}
              className="px-3.5 py-1.5 bg-slate-850 hover:bg-slate-800 border border-slate-800 text-xs font-bold text-slate-300 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncing ? "animate-spin" : ""}`} /> 
              {syncing ? "Syncing..." : "Sync Profile"}
            </button>
            <div className="px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold rounded-xl flex items-center gap-1.5 select-none">
              <Check className="w-4 h-4 text-emerald-400" /> Active
            </div>
          </div>
        ) : (
          <button
            onClick={handleConnectGithub}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-indigo-600/15"
          >
            <Link2 className="w-4 h-4" /> Connect GitHub Workspace
          </button>
        )}
      </div>

      {/* SUB-TABS INTERFACE LAYER (PHASE 4) */}
      <div className="flex border-b border-slate-850 overflow-x-auto gap-2 scrollbar-none select-none">
        <button
          onClick={() => setActiveSubTab("tickets")}
          className={`px-4 py-2.5 text-xs font-mono font-bold uppercase border-b-2 tracking-wider transition-all cursor-pointer shrink-0 ${
            activeSubTab === "tickets" 
              ? "border-indigo-500 text-white" 
              : "border-transparent text-slate-450 hover:text-slate-300"
          }`}
        >
          Curated Campus Tickets
        </button>

        <button
          onClick={() => setActiveSubTab("portfolio")}
          className={`px-4 py-2.5 text-xs font-mono font-bold uppercase border-b-2 tracking-wider transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
            activeSubTab === "portfolio" 
              ? "border-indigo-500 text-white" 
              : "border-transparent text-slate-450 hover:text-slate-300"
          }`}
        >
          Technical Portfolio
          {githubData && (
            <span className="px-1.5 py-0.25 bg-indigo-500/20 text-indigo-400 text-[9px] rounded-full">
              Ranked
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveSubTab("ai")}
          className={`px-4 py-2.5 text-xs font-mono font-bold uppercase border-b-2 tracking-wider transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
            activeSubTab === "ai" 
              ? "border-indigo-500 text-white" 
              : "border-transparent text-slate-450 hover:text-slate-300"
          }`}
        >
          AI Vetting Scorecard
          <Sparkles className="w-3 h-3 text-amber-300" />
        </button>

        <button
          onClick={() => setActiveSubTab("matching")}
          className={`px-4 py-2.5 text-xs font-mono font-bold uppercase border-b-2 tracking-wider transition-all cursor-pointer shrink-0 flex items-center gap-1.5 ${
            activeSubTab === "matching" 
              ? "border-indigo-500 text-white" 
              : "border-transparent text-slate-450 hover:text-slate-300"
          }`}
        >
          Developer Discovery
        </button>
      </div>

      {/* SUB-TABS VIEWS */}
      
      {/* 1. TICKETS AND LEADERBOARD VIEW */}
      {activeSubTab === "tickets" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* CURATED TICKETS */}
          <div className="lg:col-span-8 space-y-4">
            {showLogForm && (
              <form onSubmit={handleLogContribution} className="bg-slate-900 border-2 border-indigo-500/25 p-5 rounded-2xl space-y-4">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <span className="text-xs font-bold font-mono text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                    <GitPullRequest className="w-4 h-4" /> Record Open Source Work
                  </span>
                  <button 
                    type="button" 
                    onClick={() => setShowLogForm(false)}
                    className="text-[10px] text-slate-400 hover:text-white font-mono cursor-pointer"
                  >
                    Close
                  </button>
                </div>

                {logSuccess ? (
                  <div className="p-6 bg-slate-950 border border-emerald-500/20 text-center rounded-xl space-y-2 animate-pulse">
                    <Flame className="w-10 h-10 text-amber-500 mx-auto" />
                    <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider leading-none">PR Gated Points Awarded!</h4>
                    <p className="text-xs text-slate-350 max-w-sm mx-auto leading-relaxed">
                      We verified your request. Earned <strong className="text-amber-400">+{rewardedPoints} Reputation Points</strong> and unlocked the <strong className="text-indigo-400 font-mono">Open Source Ally</strong> badge!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] text-slate-450 font-mono uppercase mb-1">Select Claimed Issue</label>
                        <select
                          required
                          value={selectedIssueId}
                          onChange={(e) => setSelectedIssueId(e.target.value)}
                          className="w-full bg-slate-950 border border-slate-850 px-2.5 py-2.5 text-white outline-none focus:border-indigo-500 font-mono rounded-xl"
                        >
                          <option value="">-- Choose Ticket --</option>
                          {issues.map((i) => (
                            <option key={i.id} value={i.id}>
                              #{i.issueNumber} [{i.difficulty}] - {i.repoName}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[10px] text-slate-450 font-mono uppercase mb-1">GitHub PR Link / Code Commit hash</label>
                        <input 
                          type="url"
                          required
                          value={prUrl}
                          onChange={(e) => setPrUrl(e.target.value)}
                          placeholder="e.g. https://github.com/facebook/react/pull/412"
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl px-2.5 py-2.5 text-white outline-none focus:border-indigo-500 font-mono"
                        />
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] text-slate-450 font-mono uppercase mb-1">Vetting Notes / Implementation Bio</label>
                        <textarea
                          required
                          rows={3}
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          placeholder="Describe which components were modified or tests added for reviewers to confirm points."
                          className="w-full bg-slate-950 border border-slate-850 rounded-xl px-2.5 py-2.5 text-white outline-none focus:border-indigo-500 resize-none font-sans"
                        />
                      </div>

                      <div className="flex justify-end pt-1">
                        <button
                          type="submit"
                          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-indigo-600/15"
                        >
                          <Send className="w-3.5 h-3.5" /> Submit Claim Request
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            )}

            <div className="space-y-3">
              <div className="flex justify-between items-center px-1">
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                  <Code className="w-4 h-4 text-indigo-400" /> Active Curated Starter Tickets
                </h3>
                <span className="text-[10px] text-slate-450 font-mono font-bold uppercase">Sync OK</span>
              </div>

              {loading ? (
                <div className="flex justify-center py-12">
                  <RefreshCw className="w-6 h-6 text-indigo-500 animate-spin" />
                </div>
              ) : (
                <div className="space-y-4">
                  {issues.map((issue) => (
                    <div key={issue.id} className="p-5 bg-slate-900 border border-slate-850 rounded-2xl hover:border-slate-800 transition-all flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div className="space-y-1.5 flex-1 select-none">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2 py-0.5 bg-slate-950 border border-slate-850 rounded text-[9px] font-mono text-indigo-400 font-semibold uppercase">
                            {issue.repoName}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-wide border ${
                            issue.difficulty === "Good First Issue" 
                              ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                              : issue.difficulty === "Intermediate"
                              ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400"
                              : "bg-red-500/10 border-red-500/20 text-red-500"
                          }`}>
                            {issue.difficulty}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-white tracking-tight flex items-center gap-1 leading-snug">
                          <span className="text-slate-450 font-mono">#{issue.issueNumber}</span>
                          {issue.issueTitle}
                        </h4>

                        <p className="text-[11.5px] text-slate-400 leading-relaxed font-sans line-clamp-2">
                          {issue.description}
                        </p>
                      </div>

                      <div className="flex md:flex-col items-end gap-3 md:gap-1.5 shrink-0 w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-slate-850/50 justify-between">
                        <span className="text-[11px] font-mono text-amber-400 font-bold flex items-center gap-1 self-start md:self-auto">
                          <Award className="w-3.5 h-3.5" /> 
                          +{issue.difficulty === "Good First Issue" ? 75 : issue.difficulty === "Intermediate" ? 150 : 250} Rep Points
                        </span>
                        
                        <button
                          onClick={() => {
                            setSelectedIssueId(issue.id);
                            setShowLogForm(true);
                            window.scrollTo({ top: 120, behavior: "smooth" });
                          }}
                          className="px-3.5 py-1.5 bg-slate-950 hover:bg-slate-850 border border-slate-850 text-[10px] text-slate-300 font-bold rounded-lg cursor-pointer transition-all flex items-center gap-1 animate-pulse"
                        >
                          Claim Ticket <Plus className="w-3 h-3 text-indigo-400" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* SIDEBAR OSS LEADERBOARD */}
          <div className="lg:col-span-4 bg-slate-900 border border-slate-850 p-5 rounded-2xl space-y-4 h-fit">
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <Users className="w-4 h-4 text-indigo-400 animate-pulse" />
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">OSS Leaderboard</h3>
                <p className="text-[10px] text-slate-400 mt-0.5">Top contributors sorted by verified points.</p>
              </div>
            </div>

            <div className="divide-y divide-slate-850/50">
              {leaderboard.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center py-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-slate-950 flex justify-center items-center font-mono font-bold text-xs text-slate-400 border border-slate-850 shrink-0">
                      {item.rank}
                    </div>
                    
                    <img 
                      src={item.avatar} 
                      alt="avatar" 
                      className="w-8 h-8 rounded-full border border-slate-800 object-cover"
                      referrerPolicy="no-referrer"
                    />

                    <div>
                      <span className="text-[11px] font-bold text-white block leading-none">{item.name}</span>
                      <span className="text-[9px] text-slate-400 uppercase tracking-widest font-mono font-semibold pt-0.5 inline-block">
                        {item.badge}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[11.5px] font-bold font-mono text-emerald-400">{item.points}</span>
                    <span className="text-[8px] text-slate-450 font-mono block">Points</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl space-y-1.5 text-[10px] text-slate-400 flex items-start gap-2">
              <Star className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <strong className="text-white block font-semibold font-mono text-[9px] uppercase">Gamer Rep Points</strong>
                Unlock badges (Open Source Ally, Core Maintainer) which sync directly to show up on resume/ATS.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. MY TECHNICAL PORTFOLIO DASHBOARD (PHASE 4 / 5 / 6) */}
      {activeSubTab === "portfolio" && (
        <div className="space-y-6">
          {githubData ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* LEFT SIDE: SUMMARY CARD, REPUTATION SCORES, BADGES */}
              <div className="lg:col-span-5 space-y-6">
                
                {/* PROFILE BOX */}
                <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl space-y-4">
                  <div className="flex items-start gap-4">
                    <img 
                      src={githubData.profile.avatarUrl} 
                      alt="avatar" 
                      className="w-16 h-16 rounded-xl border border-slate-800 object-cover shrink-0"
                      referrerPolicy="no-referrer"
                    />
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-white flex items-center gap-1.5 leading-none">
                        {githubData.profile.name}
                        <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/25 rounded text-[8px] text-indigo-400 font-mono uppercase">
                          {githubData.profile.rank}
                        </span>
                      </h3>
                      <p className="text-[11px] text-slate-400 font-mono">@{githubData.profile.username}</p>
                      {githubData.profile.location && (
                        <p className="text-[10px] text-slate-500 font-sans">{githubData.profile.location}</p>
                      )}
                    </div>
                  </div>

                  {githubData.profile.bio && (
                    <p className="text-xs text-slate-300 font-sans italic p-3 bg-slate-950 border border-slate-850 rounded-xl leading-relaxed">
                      "{githubData.profile.bio}"
                    </p>
                  )}

                  <div className="grid grid-cols-3 gap-2.5 text-center">
                    <div className="p-2.5 bg-slate-950 border border-slate-850 rounded-xl">
                      <span className="text-base font-bold font-mono text-white block leading-none">{githubData.profile.publicRepos}</span>
                      <span className="text-[9px] text-slate-450 uppercase font-mono tracking-wider pt-1 inline-block">Repos</span>
                    </div>
                    <div className="p-2.5 bg-slate-950 border border-slate-850 rounded-xl">
                      <span className="text-base font-bold font-mono text-indigo-400 block leading-none">{githubData.profile.followers}</span>
                      <span className="text-[9px] text-slate-450 uppercase font-mono tracking-wider pt-1 inline-block">Followers</span>
                    </div>
                    <div className="p-2.5 bg-slate-950 border border-slate-850 rounded-xl">
                      <span className="text-base font-bold font-mono text-emerald-400 block leading-none">{githubData.profile.contributionCount}</span>
                      <span className="text-[9px] text-slate-450 uppercase font-mono tracking-wider pt-1 inline-block">Commits</span>
                    </div>
                  </div>

                  <a 
                    href={githubData.profile.profileUrl} 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-full py-2 bg-slate-950 hover:bg-slate-850 border border-slate-800 text-[10px] text-slate-300 font-mono font-bold rounded-xl flex items-center justify-center gap-1 transition-all"
                  >
                    View Official GitHub Workspace <ArrowUpRight className="w-3.5 h-3.5" />
                  </a>
                </div>

                {/* REPUTATION SCORE METER (PHASE 9) */}
                <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-1.5">
                      <Sliders className="w-4 h-4 text-emerald-400 animate-pulse" />
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Open Source Reputation Index</h3>
                    </div>
                    <span className="text-base font-bold font-mono text-emerald-400">{githubData.profile.openSourceScore}/100</span>
                  </div>

                  <div className="space-y-1.5 select-none">
                    <div className="w-full bg-slate-950 h-3 rounded-full border border-slate-850 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-full rounded-full transition-all"
                        style={{ width: `${githubData.profile.openSourceScore}%` }}
                      />
                    </div>
                    <div className="flex justify-between items-center text-[10px] font-mono text-slate-500">
                      <span>Threshold index</span>
                      <span>Rank: {githubData.profile.rank}</span>
                    </div>
                  </div>

                  <p className="text-[10px] text-slate-400 leading-normal bg-slate-950/50 p-3 rounded-xl border border-slate-850">
                    Reputation scores are calculated using live indicators of repository stars, pull-requests ratios, and weekly code frequency weights. They feed direct search results for recruiters.
                  </p>
                </div>

                {/* CONTRIBUTIONS HEATMAP (PHASE 5) */}
                <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl space-y-4">
                  <div className="flex items-center gap-1.5 border-b border-slate-800 pb-3">
                    <Compass className="w-4 h-4 text-amber-400" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Weekly Contribution Matrix</h3>
                  </div>
                  {renderHeatmapGrid()}
                </div>

              </div>

              {/* RIGHT SIDE: REPOSITORIES AND IMPORT GATES */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* VERIFIED SKILLS ALGORITHMIC BADGES (PHASE 8) */}
                <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="w-4 h-4 text-indigo-400" />
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Algorithmic Verified Skills</h3>
                    </div>
                    <span className="text-[10px] text-indigo-400 font-mono font-bold uppercase">Dynamic analysis</span>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {githubData.verifiedSkills.map((vs: any, idx: number) => (
                      <div 
                        key={idx} 
                        className="p-3 bg-slate-950 border border-slate-850 rounded-xl flex items-center justify-between gap-4 flex-1 min-w-[140px] max-w-[200px]"
                      >
                        <div className="space-y-0.5">
                          <strong className="text-white block text-xs font-bold tracking-tight">{vs.skillName}</strong>
                          <span className="text-[9px] font-mono text-slate-400 uppercase tracking-wide">
                            {vs.evidenceCount} repository sources
                          </span>
                        </div>
                        <span className="px-2 py-0.5 bg-emerald-500/15 border border-emerald-500/20 rounded text-[8px] font-mono text-emerald-400 font-bold">
                          {vs.confidence}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* REPOSITORIES MANAGEMENT FRAME (PHASE 6) */}
                <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-1.5">
                      <Code className="w-4 h-4 text-white" />
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Public Repositories Settings</h3>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono uppercase">Control visibility</span>
                  </div>

                  <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
                    {githubData.repos.map((repo: any, idx: number) => (
                      <div 
                        key={idx} 
                        className={`p-4 bg-slate-950 border rounded-2xl transition-all space-y-3 ${
                          repo.isHidden ? "border-slate-850 opacity-40" : "border-slate-850"
                        }`}
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="space-y-1">
                            <h4 className="text-xs font-bold text-white flex items-center gap-1.5 leading-none">
                              {repo.name}
                              {repo.isFeatured && (
                                <span className="px-1.5 py-0.25 bg-amber-500/20 border border-amber-500/30 rounded text-[7.5px] font-mono text-amber-300 font-bold uppercase">
                                  Featured
                                </span>
                              )}
                              {repo.isImported && (
                                <span className="px-1.5 py-0.25 bg-indigo-500/20 border border-indigo-500/30 rounded text-[7.5px] font-mono text-indigo-400 font-bold uppercase">
                                  SkillCollab Project
                                </span>
                              )}
                            </h4>
                            <p className="text-[10.5px] text-slate-400 font-sans leading-relaxed">{repo.description}</p>
                          </div>

                          {/* REPO FLAGS CONTROLS */}
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => handleToggleRepoFlag(repo.name, "featured")}
                              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                repo.isFeatured 
                                  ? "bg-amber-500/10 border-amber-500/20 text-amber-400" 
                                  : "bg-slate-900 border-slate-800 text-slate-500 hover:text-white"
                              }`}
                              title="Toggles Featured indicator"
                            >
                              <Star className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleToggleRepoFlag(repo.name, "hidden")}
                              className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                                repo.isHidden 
                                  ? "bg-red-500/10 border-red-500/20 text-red-400" 
                                  : "bg-slate-900 border-slate-800 text-slate-500 hover:text-white"
                              }`}
                              title="Hide Repository"
                            >
                              {repo.isHidden ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                            </button>
                          </div>
                        </div>

                        <div className="flex justify-between items-center text-[10px] font-mono pt-1">
                          <div className="flex items-center gap-3 text-slate-500">
                            <span>{repo.language}</span>
                            <span className="flex items-center gap-0.5"><Star className="w-3 h-3 text-amber-400" /> {repo.stars}</span>
                            <span>Forks: {repo.forks}</span>
                          </div>

                          {!repo.isImported && (
                            <button
                              onClick={() => handleImportProject(repo.name)}
                              disabled={importingRepo === repo.name}
                              className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-[10px] text-white font-bold rounded-lg cursor-pointer transition-all flex items-center gap-1 disabled:opacity-55"
                            >
                              <FolderPlus className="w-3.5 h-3.5" /> 
                              {importingRepo === repo.name ? "Importing..." : "Import as Project"}
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* HISTORIC ACTIVITY TIMELINE (PHASE 16) */}
                <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-1.5">
                      <Sliders className="w-4 h-4 text-amber-400" />
                      <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Historic Campus Workspace Log</h3>
                    </div>
                    <span className="text-[10px] text-slate-450 font-mono font-bold uppercase">Real data feed</span>
                  </div>

                  <div className="space-y-4 font-mono text-xs">
                    {githubData.activities && githubData.activities.length > 0 ? (
                      githubData.activities.map((act: any, idx: number) => (
                        <div key={idx} className="flex gap-3">
                          <div className="shrink-0 text-slate-500">[{new Date(act.createdAt).toLocaleDateString()}]</div>
                          <div className="text-slate-300">
                            User @{githubData.profile.username} <span className="text-slate-450">{act.title}</span>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-6 text-slate-500 italic">No actions recorded in audit logs.</div>
                    )}
                  </div>
                </div>

              </div>

            </div>
          ) : (
            <div className="p-12 text-center bg-slate-900 border border-slate-850 rounded-2xl max-w-xl mx-auto space-y-4">
              <Lock className="w-12 h-12 text-slate-500 mx-auto animate-bounce" />
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">Workspace Connection Required</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                Connect your secure external GitHub repository workspace to showcase public development work, verify computer science specialties, and unlock reputation ranks.
              </p>
              <button 
                onClick={handleConnectGithub}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-all inline-flex items-center gap-2 shadow-lg"
              >
                <Link2 className="w-4 h-4" /> Link Secure Profile Now
              </button>
            </div>
          )}
        </div>
      )}

      {/* 3. AI SCORES AND RECRUITER INSIGHTS VIEW (PHASE 13 / 14) */}
      {activeSubTab === "ai" && (
        <div className="space-y-6">
          {githubData ? (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* PRIMARY RECOMMENDATIONS CARD */}
              <div className="lg:col-span-8 bg-slate-900 border border-slate-850 p-6 rounded-2xl space-y-5">
                <div className="flex items-center gap-1.5 border-b border-slate-800 pb-3.5">
                  <Sparkles className="w-4.5 h-4.5 text-amber-300" />
                  <div>
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Gemini Technical Assessment Report</h3>
                    <p className="text-[10px] text-slate-400 mt-0.5">Automated career path summary and architectural insights.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <h4 className="text-[10px] text-slate-450 uppercase font-mono tracking-wider">Executive Analysis Summary</h4>
                    <p className="text-xs text-slate-200 leading-relaxed font-sans bg-slate-950 p-4 rounded-xl border border-slate-850">
                      {githubData.aiScorecard ? githubData.aiScorecard.executiveSummary : "Generating metrics report..."}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <h4 className="text-[10px] text-slate-450 uppercase font-mono tracking-wider flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5 text-amber-400" /> Architectural Strengths
                      </h4>
                      <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl space-y-2 text-xs">
                        {githubData.aiScorecard?.architecturalStrengths.map((str: string, index: number) => (
                          <div key={index} className="flex gap-2 text-slate-350 select-none">
                            <span className="text-indigo-400">⚡</span>
                            <span>{str}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-[10px] text-slate-450 uppercase font-mono tracking-wider flex items-center gap-1">
                        <Briefcase className="w-3.5 h-3.5 text-indigo-400" /> Suggested Progression Paths
                      </h4>
                      <div className="bg-slate-950 p-4 border border-slate-850 rounded-xl space-y-2 text-xs">
                        {githubData.aiScorecard?.suggestedCareerPaths.map((pth: string, index: number) => (
                          <div key={index} className="flex gap-2 text-slate-350 select-none">
                            <span className="text-emerald-400">✔</span>
                            <span>{pth}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* RECRUITER INSIGHTS SCORECARD DIAL RANGE */}
              <div className="lg:col-span-4 space-y-6">
                
                {/* DYNAMIC SCORES GRID */}
                <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl space-y-4">
                  <div className="flex items-center gap-1.5 border-b border-slate-800 pb-3">
                    <BarChart3 className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Core Talent Scorecard</h3>
                  </div>

                  {githubData.aiScorecard ? (
                    <div className="space-y-4 select-none">
                      
                      {/* SUB SCORE COMPONENT */}
                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between font-mono">
                          <span className="text-slate-400">Code Quality & Design</span>
                          <span className="text-emerald-400 font-bold">{githubData.aiScorecard.scorecard.codeQuality}/10</span>
                        </div>
                        <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-850">
                          <div className="bg-emerald-400 h-full rounded-full" style={{ width: `${githubData.aiScorecard.scorecard.codeQuality * 10}%` }} />
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between font-mono">
                          <span className="text-slate-400">System Scalability</span>
                          <span className="text-indigo-400 font-bold">{githubData.aiScorecard.scorecard.scalability}/10</span>
                        </div>
                        <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-850">
                          <div className="bg-indigo-400 h-full rounded-full" style={{ width: `${githubData.aiScorecard.scorecard.scalability * 10}%` }} />
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between font-mono">
                          <span className="text-slate-400">PR Collaboration Index</span>
                          <span className="text-fuchsia-400 font-bold">{githubData.aiScorecard.scorecard.collaboration}/10</span>
                        </div>
                        <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-850">
                          <div className="bg-fuchsia-400 h-full rounded-full" style={{ width: `${githubData.aiScorecard.scorecard.collaboration * 10}%` }} />
                        </div>
                      </div>

                      <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between font-mono">
                          <span className="text-slate-400">Codebase Documentation</span>
                          <span className="text-amber-400 font-bold">{githubData.aiScorecard.scorecard.documentation}/10</span>
                        </div>
                        <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-850">
                          <div className="bg-amber-400 h-full rounded-full" style={{ width: `${githubData.aiScorecard.scorecard.documentation * 10}%` }} />
                        </div>
                      </div>

                    </div>
                  ) : null}
                </div>

                {/* LANGUAGES BREAKDOWN MAPPING */}
                <div className="bg-slate-900 border border-slate-850 p-5 rounded-2xl space-y-4">
                  <div className="flex items-center gap-1.5 border-b border-slate-800 pb-3">
                    <Binary className="w-4 h-4 text-indigo-400" />
                    <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Languages Distribution</h3>
                  </div>

                  <div className="space-y-3 font-mono text-xs select-none">
                    {githubData.aiScorecard?.languagesBreakdown.map((lang: any, index: number) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between">
                          <span className="text-slate-350">{lang.name}</span>
                          <span className="text-slate-450">{lang.percentage}%</span>
                        </div>
                        <div className="w-full bg-slate-950 h-1 rounded-full overflow-hidden border border-slate-850">
                          <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${lang.percentage}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          ) : (
            <div className="p-12 text-center bg-slate-900 border border-slate-850 rounded-2xl max-w-xl mx-auto space-y-4">
              <Lock className="w-12 h-12 text-slate-500 mx-auto" />
              <h3 className="text-sm font-bold text-white font-mono uppercase tracking-wider">Recruiter Assessment Locked</h3>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm mx-auto">
                Connect your secure external GitHub repository workspace to initiate the AI Career Suite parsing evaluations.
              </p>
              <button 
                onClick={handleConnectGithub}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold cursor-pointer transition-all inline-flex items-center gap-2"
              >
                <Link2 className="w-4 h-4" /> Link Secure Profile Now
              </button>
            </div>
          )}
        </div>
      )}

      {/* 4. DEVELOPER DISCOVERY MATCHING (PHASE 12 / 17) */}
      {activeSubTab === "matching" && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-850 p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-1.5">
                <Search className="w-4.5 h-4.5 text-indigo-400 animate-pulse" />
                <div>
                  <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">Campus Technical Matching Index</h3>
                  <p className="text-[10px] text-slate-400 mt-0.5">Discover vetted peer specialists using robust GitHub skills verification arrays.</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <input 
                type="text"
                value={techTargetQuery}
                onChange={(e) => setTechTargetQuery(e.target.value)}
                placeholder="e.g. React, TypeScript, Solidity, Python"
                className="flex-1 bg-slate-950 border border-slate-850 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-indigo-500 font-mono"
              />
              <button
                onClick={handleLoadMatches}
                disabled={loadingMatches}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
              >
                <Search className="w-4.5 h-4.5" /> 
                {loadingMatches ? "Evaluating Match percentage..." : "Run Matching Engine"}
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono px-1 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-indigo-400" /> Discovered Vetted Candidates Profiles
            </h3>

            {loadingMatches ? (
              <div className="flex justify-center py-12">
                <RefreshCw className="w-6 h-6 text-indigo-500 animate-spin" />
              </div>
            ) : matchingResults && matchingResults.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {matchingResults.map((dev: any, index: number) => (
                  <div key={index} className="p-5 bg-slate-900 border border-slate-850 rounded-2xl hover:border-slate-800 transition-all flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start gap-3">
                        <div className="flex items-center gap-3">
                          <img 
                            src={dev.avatarUrl} 
                            alt="avatar" 
                            className="w-12 h-12 rounded-xl object-cover border border-slate-800 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div className="space-y-0.5">
                            <strong className="text-sm font-bold text-white block leading-snug">{dev.name}</strong>
                            <span className="text-[10px] font-mono text-indigo-450 block">@{dev.username}</span>
                            <span className="inline-block px-1.5 py-0.25 bg-slate-950 border border-slate-850 text-[8px] font-mono text-slate-400 rounded">
                              {dev.rank}
                            </span>
                          </div>
                        </div>

                        {/* MATCH PERCENTAGE ROUND CIRCLE METER */}
                        <div className="text-right space-y-0.5">
                          <span className="text-base font-bold font-mono text-emerald-400 block leading-none">{dev.matchPercentage}%</span>
                          <span className="text-[8px] text-slate-450 uppercase font-mono tracking-wider block">Match Score</span>
                        </div>
                      </div>

                      {/* VERIFIED SKILLS ALIGNED */}
                      <div className="space-y-1">
                        <span className="text-[9px] text-slate-450 uppercase font-mono">Matched Technologies:</span>
                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                          {dev.matchingSkills.map((sk: string, skIdx: number) => (
                            <span key={skIdx} className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded text-[9px] font-mono text-indigo-300 font-semibold uppercase">
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-2.5 border-t border-slate-850 text-[10px] font-mono text-slate-450">
                      <span>OSS Score: <strong className="text-emerald-400 font-bold">{dev.openSourceScore}/100</strong></span>
                      <a 
                        href={`https://github.com/${dev.username}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-indigo-400 hover:underline flex items-center gap-0.5 font-bold"
                      >
                        Technical Resume <ArrowUpRight className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center bg-slate-900 border border-slate-850 rounded-2xl max-w-md mx-auto text-slate-500 italic text-xs">
                No verified developer matching targets "{techTargetQuery}" and showing connected workspaces yet. Ensure profile connections is synchronized!
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
