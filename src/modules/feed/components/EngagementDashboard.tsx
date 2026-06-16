import React, { useState } from "react";
import { 
  Flame, Award, FolderPlus, Trophy, Briefcase, GraduationCap, 
  Cpu, CheckCircle, ArrowRight, Play, Star, Plus, ShieldCheck 
} from "lucide-react";

interface EngagementDashboardProps {
  onNavigate: (tabId: string) => void;
  reputationPoints: number;
}

export const EngagementDashboard: React.FC<EngagementDashboardProps> = ({ 
  onNavigate,
  reputationPoints = 120 
}) => {
  // Goals Checklist state
  const [goals, setGoals] = useState([
    { id: 1, text: "Check remaining PR reviews in EtherPulse", done: false },
    { id: 2, text: "Commit 1 issue in Open Source Hub", done: true },
    { id: 3, text: "Browse senior mentor available slots", done: false }
  ]);

  const toggleGoal = (id: number) => {
    setGoals(goals.map(g => g.id === id ? { ...g, done: !g.done } : g));
  };

  const progressPercent = Math.min(100, Math.round((goals.filter(g => g.done).length / goals.length) * 100));

  // Daily recent activities
  const recentActivities = [
    { id: "act_1", text: "Liked Nitin Kamath's internship post", time: "2h ago" },
    { id: "act_2", text: "Completed solidity core verification", time: "4h ago" },
    { id: "act_3", text: "Handshaked on EtherPulse roster with Pranav", time: "1d ago" }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 rounded-2xl">
      
      {/* COLUMN 1: LEFT SIDEBAR HERO & STATS */}
      <div className="space-y-4">
        
        {/* CONTINUE WHERE YOU LEFT OFF CARD */}
        <div className="bg-slate-900 border border-slate-850 p-4.5 rounded-2xl relative overflow-hidden text-left group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 blur-2xl rounded-full" />
          <span className="text-[9px] bg-indigo-500/15 text-indigo-400 font-mono font-bold tracking-widest px-2 py-0.5 rounded-full uppercase">
            Active Milestone
          </span>
          <h3 className="text-white text-sm font-bold mt-2 font-sans group-hover:text-indigo-400 transition-colors">
            EtherPulse Tracker
          </h3>
          <p className="text-[10.5px] text-slate-400 mt-1">
            Task: Complete module 3 ledger analyzer implementation (gRPC client).
          </p>
          <div className="mt-4 flex items-center justify-between">
            <span className="text-[9.5px] font-mono text-slate-500"> Roster size: 2/4</span>
            <button 
              onClick={() => onNavigate("teams")}
              className="flex items-center gap-1 text-[10px] text-indigo-400 font-bold hover:text-indigo-300 font-mono"
            >
              Resume coding <Play className="w-2.5 h-2.5 fill-current" />
            </button>
          </div>
        </div>

        {/* REPUTATION PROGRESS & GOALS */}
        <div className="bg-slate-900 border border-slate-850 p-4.5 rounded-2xl text-left space-y-3.5">
          <div className="flex justify-between items-center border-b border-indigo-500/10 pb-2">
            <span className="text-[10.5px] font-mono text-amber-400 font-bold tracking-wider uppercase flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" /> Reputation Rank
            </span>
            <span className="text-[9.5px] text-slate-400 font-mono">Gold Node II</span>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-400">Rep Score</span>
              <span className="text-white font-bold">{reputationPoints} / 250 pt</span>
            </div>
            <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-850">
              <div 
                className="bg-gradient-to-r from-amber-500 to-yellow-400 h-full transition-all"
                style={{ width: `${Math.min(100, (reputationPoints / 250) * 100)}%` }}
              />
            </div>
            <span className="text-[9.5px] text-slate-500 block">Next Level: 250 pts for Gold Node III privileges</span>
          </div>

          {/* DAILY GOALS PROGRESS & CHECKLIST */}
          <div className="pt-2 border-t border-slate-850">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-[10.5px] text-white font-bold flex items-center gap-1"><Flame className="w-3.5 h-3.5 text-orange-500" /> Daily Objectives</span>
              <span className="text-[9.5px] text-indigo-400 font-mono font-bold bg-indigo-500/10 px-1 py-0.5 rounded">{progressPercent}% complete</span>
            </div>
            
            <div className="space-y-2">
              {goals.map(goal => (
                <div 
                  key={goal.id} 
                  onClick={() => toggleGoal(goal.id)}
                  className="flex gap-2 items-center text-[10.5px] text-slate-300 hover:text-white cursor-pointer select-none"
                >
                  <CheckCircle className={`w-3.5 h-3.5 shrink-0 ${goal.done ? "text-emerald-400 fill-emerald-500/10" : "text-slate-600"}`} />
                  <span className={goal.done ? "line-through text-slate-500" : ""}>{goal.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      {/* COLUMN 2: CENTER ACTION RECOMMENDED MODULES */}
      <div className="lg:col-span-2 space-y-4">
        
        {/* RECOMMENDED PORTALS & OFFERS */}
        <div className="bg-slate-900 border border-slate-850 p-4 md:p-5 rounded-2xl relative">
          <div className="flex justify-between items-center border-b border-slate-850 pb-2 mb-3">
            <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Dynamic Campus Matches
            </span>
            <span className="text-[9px] bg-emerald-500/10 text-emerald-400 font-mono font-bold py-0.5 px-2 rounded-full animate-pulse">
              AI Tailor-made
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* RECOMMENDED PROJECTS */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-2 text-left">
              <div className="flex justify-between items-center text-[9px] font-mono text-slate-500">
                <span>PROJECT RECON</span>
                <span className="text-indigo-400 font-bold flex items-center gap-0.5"><Star className="w-2.5 h-2.5 fill-current" /> 94% Match</span>
              </div>
              <h4 className="font-bold text-white text-[11px] leading-tight">Decentralized Voting Ledger</h4>
              <p className="text-[10px] text-slate-400 leading-snug">Solidity peer audit platform. Built for Solidity dev squads.</p>
              <button 
                onClick={() => onNavigate("projects")}
                className="text-[9px] text-indigo-400 font-bold uppercase mt-1 flex items-center gap-0.5 font-mono"
              >
                Inspect Pitch <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* TRENDING HACKATHONS */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-2 text-left">
              <div className="flex justify-between items-center text-[9px] font-mono text-slate-500">
                <span>HACKATHON EVENT</span>
                <span className="text-[#f59e0b] font-bold">120 teams</span>
              </div>
              <h4 className="font-bold text-white text-[11px] leading-tight">Superchain India Devfest</h4>
              <p className="text-[10px] text-slate-400 leading-snug">Multi-chain modular layer developer challenge with $20k pool.</p>
              <button 
                onClick={() => onNavigate("hackathons")}
                className="text-[9px] text-indigo-400 font-bold uppercase mt-1 flex items-center gap-0.5 font-mono"
              >
                Assemble Squad <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* INTERNSHIP ALERTS */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-2 text-left">
              <div className="flex justify-between items-center text-[9px] font-mono text-slate-500">
                <span>INTERNSHIP RECON</span>
                <span className="text-emerald-400 font-bold">Hot Lead</span>
              </div>
              <h4 className="font-bold text-white text-[11px] leading-tight">DevOps Intern @ CloudSecure</h4>
              <p className="text-[10px] text-slate-400 leading-snug">Kubernetes and AWS Cloud. Zero campus hierarchy. GitHub-focused vetting.</p>
              <button 
                onClick={() => onNavigate("internships")}
                className="text-[9px] text-indigo-400 font-bold uppercase mt-1 flex items-center gap-0.5 font-mono"
              >
                Apply Online <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* OPEN SOURCE OPPORTUNITIES */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-2 text-left">
              <div className="flex justify-between items-center text-[9px] font-mono text-slate-500">
                <span>OPEN SOURCE UNIT</span>
                <span className="text-indigo-300 font-bold">50 rep bonus</span>
              </div>
              <h4 className="font-bold text-white text-[11px] leading-tight">Issue #42: Solid Hydration Linker</h4>
              <p className="text-[10px] text-slate-400 leading-snug">Fix router lifecycle link hydration crash on server-rendered nodes.</p>
              <button 
                onClick={() => onNavigate("open_source")}
                className="text-[9px] text-indigo-400 font-bold uppercase mt-1 flex items-center gap-0.5 font-mono"
              >
                Claim Issue <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* MENTOR SUGGESTIONS */}
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 space-y-2 text-left sm:col-span-2 flex justify-between items-center">
              <div>
                <span className="text-[9px] font-mono text-slate-500 block mb-1">RECOMMENDED MENTOR SESSIONS</span>
                <h4 className="font-bold text-white text-[11px]">Vijay Krishnan — ML Engineer at Google</h4>
                <p className="text-[10px] text-slate-450 mt-0.5">Focus areas: PyTorch models, deep neural optimization.</p>
              </div>
              <button 
                onClick={() => onNavigate("mentors")}
                className="px-2.5 py-1.5 bg-indigo-650 hover:bg-indigo-600 rounded-lg text-[9px] font-mono font-bold text-white shrink-0 cursor-pointer"
              >
                Book Session
              </button>
            </div>

          </div>
        </div>

        {/* RECENT ACTIVITIES TICKER BOX */}
        <div className="bg-slate-900 border border-slate-850 p-3.5 rounded-2xl text-left">
          <span className="text-[10px] font-mono text-slate-500 font-extrabold uppercase tracking-widest block mb-2.5 px-0.5">
            Personal Audit Activity Log
          </span>
          <div className="space-y-2">
            {recentActivities.map(act => (
              <div key={act.id} className="flex justify-between items-center bg-slate-950/40 p-2 rounded-xl border border-slate-850 text-xs">
                <span className="text-slate-350">{act.text}</span>
                <span className="text-[8.5px] font-mono text-slate-500">{act.time}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
