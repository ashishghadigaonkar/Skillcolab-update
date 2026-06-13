/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  GitBranch, GitPullRequest, Code, Award, CheckCircle, 
  Plus, AlertCircle, RefreshCw, Send, Sparkles, Star, 
  Users, Flame, ArrowUpRight, Check 
} from "lucide-react";

export default function OpenSourceHub() {
  const [issues, setIssues] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Submit state
  const [showLogForm, setShowLogForm] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState("");
  const [prUrl, setPrUrl] = useState("");
  const [commentText, setCommentText] = useState("");
  const [logSuccess, setLogSuccess] = useState(false);
  const [rewardedPoints, setRewardedPoints] = useState(0);

  // Score stats state
  const [leaderboard, setLeaderboard] = useState<any[]>([
    { rank: 1, name: "Sneha Kapadia", points: 840, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80", badge: "Core Maintainer" },
    { rank: 2, name: "Ashish Ghadigaonkar", points: 450, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80", badge: "Open Source Ally" },
    { rank: 3, name: "Pranav Shah", points: 320, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80", badge: "Local Contributor" },
    { rank: 4, name: "Juhi Chawla", points: 280, avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=80&h=80&q=80", badge: "Contributor" }
  ]);

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
  }, []);

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
          // Increment locally on leaderboard
          setLeaderboard(prev => prev.map(p => {
            if (p.name === "Ashish Ghadigaonkar") {
              return { ...p, points: p.points + data.pointsEarned, badge: "Open Source Ally" };
            }
            return p;
          }).sort((a, b) => b.points - a.points).map((p, index) => ({ ...p, rank: index + 1 })));
        }, 4000);
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 border border-slate-850 p-4 rounded-2xl">
        <div>
          <div className="flex items-center gap-1.5 text-indigo-400 font-mono text-xs font-semibold mb-1 uppercase tracking-wider">
            <GitBranch className="w-3.5 h-3.5 text-indigo-400" /> SkillCollab Open Source Initiative
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Open Source Collaboration Hub</h2>
          <p className="text-xs text-slate-400">Claim beginner-friendly issues, commit code directly, and earn profile reputation points.</p>
        </div>

        <button
          onClick={() => setShowLogForm(!showLogForm)}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer self-stretch md:self-auto justify-center"
        >
          <GitPullRequest className="w-4 h-4" /> Log Merged Pull Request
        </button>
      </div>

      {/* THREE PANELS CONFIGURATION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: ISSUES SEARCH */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* LOG CONTRIBUTION EXPANDABLE SHEET */}
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
                <div className="p-6 bg-slate-950 border border-emerald-500/20 text-center rounded-xl space-y-2">
                  <Flame className="w-10 h-10 text-amber-500 mx-auto animate-bounce" />
                  <h4 className="text-sm font-bold text-white font-mono uppercase tracking-wider leading-none">PR Gated Points Awarded!</h4>
                  <p className="text-xs text-slate-350 max-w-sm mx-auto leading-relaxed">
                    We verified your request. Earned <strong className="text-amber-400">+{rewardedPoints} Reputation Points</strong> and unlocked the <strong className="text-indigo-400 font-mono">Open Source Ally</strong> badge!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Select Claimed Issue</label>
                      <select
                        required
                        value={selectedIssueId}
                        onChange={(e) => setSelectedIssueId(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-850 px-2.5 py-1.5 text-white outline-none focus:border-indigo-500 font-mono"
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
                      <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">GitHub PR Link / Code Commit hash</label>
                      <input 
                        type="url"
                        required
                        value={prUrl}
                        onChange={(e) => setPrUrl(e.target.value)}
                        placeholder="e.g. https://github.com/facebook/react/pull/412"
                        className="w-full bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-white outline-none focus:border-indigo-500 font-mono"
                      />
                    </div>
                  </div>

                  <div className="space-y-3.5">
                    <div>
                      <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Vetting Notes / Implementation Bio</label>
                      <textarea
                        required
                        rows={3}
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Describe which components were modified or tests added for reviewers to confirm points."
                        className="w-full bg-slate-950 border border-slate-850 rounded px-2.5 py-1.5 text-white outline-none focus:border-indigo-500 resize-none font-sans"
                      />
                    </div>

                    <div className="flex justify-end pt-1">
                      <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-indigo-600/15"
                      >
                        <Send className="w-3.5 h-3.5" /> Submit Claim Request
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </form>
          )}

          {/* ISSUES FEED LIST */}
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
                          // scroll smooth
                          window.scrollTo({ top: 120, behavior: "smooth" });
                        }}
                        className="px-3.5 py-1.5 bg-slate-950 hover:bg-slate-850 border border-slate-850 text-[10px] text-slate-300 font-bold rounded-lg cursor-pointer transition-all flex items-center gap-1"
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

        {/* RIGHT COLUMN: REPUTATION LEADERBOARD */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-850 p-5 rounded-2xl space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
            <Users className="w-4 h-4 text-indigo-400 animate-pulse" />
            <div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-mono">OSS Leaderboard</h3>
              <p className="text-[10px] text-slate-400 mt-0.5">Top contributors sorted by verified commit points.</p>
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

    </div>
  );
}
