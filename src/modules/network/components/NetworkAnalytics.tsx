import React from "react";
import { BarChart3, Eye, Calendar, Award } from "lucide-react";
import { ProfileViewLog } from "../../../types";

interface NetworkAnalyticsProps {
  connectionsCount: number;
  profileViews: ProfileViewLog[];
  referrals: string[];
  reputationPoints: number;
}

export const NetworkAnalytics: React.FC<NetworkAnalyticsProps> = ({
  connectionsCount,
  profileViews,
  referrals,
  reputationPoints
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="network-analytics-container">
      
      {/* 1. Core Profile Stats */}
      <div className="bg-slate-900 border border-slate-850 rounded-2xl p-4 md:p-5 text-left flex flex-col justify-between">
        <div className="space-y-2">
          <h3 className="font-sans font-bold text-white text-xs flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-500" /> Reputation & Impact Metrics
          </h3>
          <p className="text-[10px] text-slate-450 font-mono">Score compiled based on code reviews, mentor feedback, and team hack contributions.</p>
        </div>

        <div className="py-4 space-y-3.5">
          <div className="flex justify-between items-center font-mono text-xs">
            <span className="text-slate-400">Reputation Total</span>
            <span className="text-xl font-bold font-mono text-amber-400">{reputationPoints} pt</span>
          </div>

          <div className="flex justify-between items-center font-mono text-xs">
            <span className="text-slate-400">Total Connections</span>
            <span className="text-white font-bold">{connectionsCount || 2} peers</span>
          </div>

          <div className="flex justify-between items-center font-mono text-xs">
            <span className="text-slate-400">Active Referrals</span>
            <span className="text-indigo-400 font-bold">{referrals.length} shared</span>
          </div>
        </div>

        <div className="p-2.5 bg-slate-950 border border-slate-850 rounded-xl font-mono text-[9px] text-slate-500">
          Rank: <strong className="text-indigo-400">Campus Elite Node</strong>
        </div>
      </div>

      {/* 2. Profile Views (Module 17) */}
      <div className="bg-slate-900 border border-slate-850 rounded-2xl p-4 md:p-5 text-left md:col-span-2 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-sans font-bold text-white text-xs flex items-center gap-1.5">
            <Eye className="w-4 h-4 text-indigo-400" /> Recent Profile Views Log ({profileViews.length})
          </h3>
          <span className="px-1.5 py-0.5 bg-indigo-500/10 text-indigo-400 font-mono text-[9px] rounded font-bold border border-indigo-500/25">Recruiter Views</span>
        </div>

        {profileViews.length === 0 ? (
          <p className="text-slate-500 font-mono text-[10px] py-6 text-center bg-slate-950 rounded-xl border border-slate-850">No recent recruiter or student profile views.</p>
        ) : (
          <div className="space-y-2.5">
            {profileViews.map(view => (
              <div key={view.id} className="p-2.5 bg-slate-950 rounded-xl border border-slate-850 flex items-center justify-between text-xs font-mono">
                <div className="flex gap-2.5 items-center">
                  <img src={view.viewerAvatar} alt={view.viewerName} className="w-8 h-8 rounded-full object-cover border border-slate-800" referrerPolicy="no-referrer" />
                  <div className="text-left">
                    <strong className="text-white font-sans text-[11px] block">{view.viewerName}</strong>
                    <span className="text-[9px] text-slate-450 block truncate leading-none mt-0.5">{view.viewerHeadline}</span>
                  </div>
                </div>

                <div className="text-right text-[8.5px] text-slate-500 flex items-center gap-1 shrink-0">
                  <Calendar className="w-3 h-3" /> {view.viewedAt.split(" ")[0]}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
