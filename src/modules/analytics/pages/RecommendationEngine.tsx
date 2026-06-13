/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Sparkles, Award, User, Briefcase, ChevronRight, Activity, Cpu, RotateCw, CheckCircle2 
} from "lucide-react";

interface RecommendationData {
  projects: { id: string; matchPercentage: number; reason: string }[];
  mentors: { id: string; matchPercentage: number; reason: string }[];
  internships: { id: string; matchPercentage: number; reason: string }[];
}

export default function RecommendationEngine() {
  const [recs, setRecs] = useState<RecommendationData | null>(null);
  const [loading, setLoading] = useState(false);
  const [progressMsg, setProgressMsg] = useState("");

  const runRecommendationScan = async () => {
    setLoading(true);
    setRecs(null);
    
    // Smooth loader reassuring prompts
    const steps = [
      "Reading registered skills catalog...",
      "Analyzing biography for career alignment indices...",
      "Matching with 300+ university repositories...",
      "Querying Google GenAI model parameters...",
      "Finalizing scoring matches..."
    ];

    let stepIdx = 0;
    setProgressMsg(steps[0]);
    const timer = setInterval(() => {
      stepIdx += 1;
      if (stepIdx < steps.length) {
        setProgressMsg(steps[stepIdx]);
      } else {
        clearInterval(timer);
      }
    }, 900);

    try {
      const res = await fetch("/api/recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: "student_ashish" })
      });

      if (res.ok) {
        const data = await res.json();
        // Look inside .recommendations or root
        const result = data.recommendations || data;
        setRecs(result);
      }
    } catch (e) {
      console.error("AI matching scan failed:", e);
    } finally {
      clearInterval(timer);
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-850 rounded-2xl p-6 shadow-xl text-slate-100 font-sans">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-800/80 mb-6">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs font-semibold mb-1">
            <Cpu className="w-4 h-4 animate-pulse" /> ENGINE: LAZY-EVALUATION GEMINI ACTIVE
          </div>
          <h3 className="text-xl font-bold text-white flex items-center gap-2">
            🚀 SkillCollab AI Recommendation Center
          </h3>
          <p className="text-slate-400 text-xs mt-1">
            Recompute project rosters, mentor schedules, and jobs with advanced semantic cross-analysis.
          </p>
        </div>

        <button
          onClick={runRecommendationScan}
          disabled={loading}
          className="w-full md:w-auto px-5 py-2.5 bg-indigo-600 hover:bg-indigo-550 text-white rounded-xl text-xs font-bold shadow-lg shadow-indigo-600/15 transition-all text-center flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300/30" /> 
          {loading ? "Analyzing..." : "Compute AI Matches"}
        </button>
      </div>

      {loading && (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-950/40 border-t-indigo-500 animate-spin"></div>
            <Sparkles className="w-5 h-5 text-indigo-400 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-white">Generating Multi-Factor Recommendations</h4>
            <p className="text-xs text-indigo-205 font-mono animate-pulse">{progressMsg}</p>
          </div>
        </div>
      )}

      {/* No recommendations loaded stage */}
      {!recs && !loading && (
        <div className="text-center py-16 max-w-md mx-auto space-y-4">
          <div className="w-12 h-12 rounded-full bg-indigo-950/30 border border-indigo-900/30 flex justify-center items-center mx-auto text-indigo-400">
            <Sparkles className="w-6 h-6 animate-pulse" />
          </div>
          <div className="space-y-1">
            <h4 className="text-sm font-bold text-white">Your AI Feed is Ready to Compute</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              We leverage the powerful <code>gemini-3.5-flash</code> model to evaluate your biography and matching technical skills against 100+ active campus parameters in real-time.
            </p>
          </div>
          <button
            onClick={runRecommendationScan}
            className="px-4 py-2 bg-slate-850 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-350 hover:text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors"
          >
            Compute Live Recommendations
          </button>
        </div>
      )}

      {recs && !loading && (
        <div className="space-y-8 animate-fade-in">
          {/* Recommendations Projects */}
          <div className="space-y-4">
            <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" /> Recommended Team Projects
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recs.projects.map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-950 border border-indigo-900/20 hover:border-indigo-500/30 rounded-xl flex flex-col justify-between hover:shadow-lg transition-all text-xs">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center bg-slate-900 px-2 py-1 rounded-md border border-slate-850">
                      <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider">PROJECT ID {item.id}</span>
                      <span className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400 font-mono">
                        🎯 {item.matchPercentage}% Match
                      </span>
                    </div>
                    <p className="leading-relaxed text-slate-300 font-sans">{item.reason}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-indigo-400 font-semibold cursor-default mt-4 border-t border-slate-900 pt-2 bg-transparent">
                    View matching details <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations Internships */}
          <div className="space-y-4 border-t border-slate-850 pt-6">
            <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-indigo-400" /> Matched Corporate Jobs
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recs.internships.map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-950 border border-indigo-900/20 hover:border-indigo-500/30 rounded-xl flex flex-col justify-between hover:shadow-lg transition-all text-xs">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center bg-slate-900 px-2 py-1 rounded-md border border-slate-850">
                      <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider">JOB ID {item.id}</span>
                      <span className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400 font-mono">
                        💼 {item.matchPercentage}% Match
                      </span>
                    </div>
                    <p className="leading-relaxed text-slate-300 font-sans">{item.reason}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-indigo-400 font-semibold cursor-default mt-4 border-t border-slate-900 pt-2">
                    Open Job Description <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations Mentors */}
          <div className="space-y-4 border-t border-slate-850 pt-6">
            <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-400" /> Handpicked Technical Mentors
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recs.mentors.map((item, idx) => (
                <div key={idx} className="p-4 bg-slate-950 border border-indigo-900/20 hover:border-indigo-500/30 rounded-xl flex flex-col justify-between hover:shadow-lg transition-all text-xs">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center bg-slate-900 px-2 py-1 rounded-md border border-slate-850">
                      <span className="font-mono text-[10px] text-slate-500 uppercase tracking-wider">MENTOR ID {item.id}</span>
                      <span className="text-xs font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-indigo-400 font-mono">
                        🎓 {item.matchPercentage}% Match
                      </span>
                    </div>
                    <p className="leading-relaxed text-slate-300 font-sans">{item.reason}</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] text-indigo-400 font-semibold cursor-default mt-4 border-t border-slate-900 pt-2">
                    Review availability <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
