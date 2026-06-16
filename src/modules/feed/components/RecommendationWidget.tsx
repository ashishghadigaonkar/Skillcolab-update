import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  UserPlus, Check, Star, ArrowRight, Flame, Trophy, ExternalLink,
  Laptop, Cpu, Terminal, Users, Sparkles
} from "lucide-react";

interface RecommendationWidgetProps {
  type: "people" | "projects" | "hackathons";
  onAction?: (data: any) => void;
}

export const RecommendationWidget: React.FC<RecommendationWidgetProps> = ({ type, onAction }) => {
  const [completedActions, setCompletedActions] = useState<Record<string, boolean>>({});
  const [loadingActionId, setLoadingActionId] = useState<string | null>(null);

  const triggerAction = (itemId: string, itemType: string) => {
    setLoadingActionId(itemId);
    setTimeout(() => {
      setCompletedActions(prev => ({ ...prev, [itemId]: true }));
      setLoadingActionId(null);
      if (onAction) {
        onAction({ itemId, itemType });
      }
    }, 600);
  };

  if (type === "people") {
    const localPeople = [
      { id: "rec_p1", name: "Anish Gupta", role: "AI Research Fellow @ IISc", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80", match: "94% Skill Match" },
      { id: "rec_p2", name: "Tanya Sen", role: "Blockchain Arch @ Polygon", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80", match: "88% Skill Overlap" }
    ];

    return (
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950/40 border border-slate-800 rounded-2xl p-4.5 space-y-3.5 my-4">
        <div className="flex justify-between items-center bg-transparent">
          <div className="flex items-center gap-1.5 bg-transparent">
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
            <h4 className="font-bold text-white text-xs uppercase tracking-wider font-mono">People You May Know</h4>
          </div>
          <span className="text-[9px] text-slate-550 lowercase font-mono">Suggested matching graph</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {localPeople.map(person => (
            <div key={person.id} className="bg-slate-950 border border-slate-850/60 p-3 rounded-xl flex items-center justify-between gap-2.5">
              <div className="flex gap-2.5 items-center">
                <img src={person.avatar} alt={person.name} className="w-9 h-9 rounded-full object-cover border border-slate-800" />
                <div>
                  <h5 className="font-bold text-white text-[11px] leading-tight hover:underline cursor-pointer">{person.name}</h5>
                  <span className="text-[9px] text-slate-400 block mt-0.5 max-w-[130px] truncate">{person.role}</span>
                  <span className="text-[8px] text-indigo-400 font-mono font-bold block mt-0.5">{person.match}</span>
                </div>
              </div>

              <button
                onClick={() => triggerAction(person.id, "connect")}
                disabled={completedActions[person.id] || loadingActionId === person.id}
                className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                  completedActions[person.id]
                    ? "bg-slate-900 border-indigo-500/30 text-indigo-400"
                    : "bg-indigo-600 hover:bg-indigo-550 text-white border-transparent"
                }`}
              >
                {loadingActionId === person.id ? (
                  <span className="animate-pulse text-[9px] px-1 block font-mono">...</span>
                ) : completedActions[person.id] ? (
                  <Check className="w-3.5 h-3.5" />
                ) : (
                  <UserPlus className="w-3.5 h-3.5" />
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (type === "projects") {
    const localProjects = [
      { id: "rec_pr1", title: "Defi Lending Vaults", stack: ["Solidity", "REST APIs"], roster: "2/4 members", level: "Advanced" },
      { id: "rec_pr2", title: "Carbon Auditing App", stack: ["Tailwind", "Mongoose"], roster: "1/3 members", level: "Intermediate" }
    ];

    return (
      <div className="bg-gradient-to-r from-slate-900 to-amber-950/20 border border-slate-800 rounded-2xl p-4.5 space-y-3.5 my-4">
        <div className="flex justify-between items-center bg-transparent">
          <div className="flex items-center gap-1.5 bg-transparent">
            <Flame className="w-4 h-4 text-amber-500 shrink-0" />
            <h4 className="font-bold text-white text-xs uppercase tracking-wider font-mono">Projects Matching Your Stack</h4>
          </div>
          <span className="text-[9px] text-amber-400 font-mono">Based on your skills</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {localProjects.map(proj => (
            <div key={proj.id} className="bg-slate-950 border border-slate-850/60 p-3.5 rounded-xl flex flex-col justify-between gap-3 text-left">
              <div>
                <h5 className="font-bold text-white text-[11px] leading-tight">{proj.title}</h5>
                <span className="text-[8.5px] text-slate-500 block font-mono mt-1">Difficulty: {proj.level}</span>
                <span className="text-[9px] text-slate-400 block mt-1.5">{proj.roster} recruiting</span>
              </div>

              <div className="flex flex-wrap gap-1 font-mono text-[8px]">
                {proj.stack.map(s => (
                  <span key={s} className="px-1.5 py-0.5 bg-slate-900 rounded border border-slate-850 text-indigo-400">{s}</span>
                ))}
              </div>

              <button
                onClick={() => triggerAction(proj.id, "apply_project")}
                disabled={completedActions[proj.id] || loadingActionId === proj.id}
                className={`w-full py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
                  completedActions[proj.id]
                    ? "bg-slate-900 border border-emerald-500/30 text-emerald-400"
                    : "bg-amber-600 hover:bg-amber-550 text-white"
                }`}
              >
                {loadingActionId === proj.id ? "Submitting application..." : completedActions[proj.id] ? "Application Pending" : "Join Squad"}
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // default: hackathons
  const localHacks = [
    { id: "rec_h1", title: "NASA Astro Spacehack", date: "June 29, 2026", prizes: "$20,000 Pool", platform: "Virtual / Campus Hub" }
  ];

  return (
    <div className="bg-gradient-to-r from-slate-900 to-rose-950/20 border border-slate-800 rounded-2xl p-4.5 space-y-3.5 my-4">
      <div className="flex justify-between items-center bg-transparent">
        <div className="flex items-center gap-1.5 bg-transparent">
          <Trophy className="w-4 h-4 text-rose-500 shrink-0" />
          <h4 className="font-bold text-white text-xs uppercase tracking-wider font-mono">Trending Campus Opportunities</h4>
        </div>
        <span className="text-[9px] text-rose-400 font-mono">Fast closing</span>
      </div>

      {localHacks.map(hack => (
        <div key={hack.id} className="bg-slate-950 border border-slate-850/60 p-3.5 rounded-xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <span className="text-[8px] uppercase tracking-widest font-mono text-rose-400 font-bold block">NASA Sandbox Spotlight</span>
            <h5 className="font-bold text-white text-[11px] leading-tight mt-0.5">{hack.title}</h5>
            <span className="text-[9px] text-slate-450 block font-mono mt-1">{hack.date} • {hack.platform} • {hack.prizes}</span>
          </div>

          <button
            onClick={() => triggerAction(hack.id, "register_hack")}
            disabled={completedActions[hack.id] || loadingActionId === hack.id}
            className={`w-full sm:w-auto px-4 py-2 rounded-lg text-[10px] font-bold cursor-pointer transition-all ${
              completedActions[hack.id]
                ? "bg-slate-900 border border-emerald-500/30 text-emerald-400"
                : "bg-rose-600 hover:bg-rose-550 text-white"
            }`}
          >
            {loadingActionId === hack.id ? "Registering..." : completedActions[hack.id] ? "Registered! ✅" : "Quick Register"}
          </button>
        </div>
      ))}
    </div>
  );
};
