/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  BarChart3, Shield, Users, Server, Trash2, 
  CheckCircle2, RefreshCw, Layers, AlertOctagon, TrendingUp 
} from "lucide-react";

export default function AdminConsole() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [dbStatusMsg, setDbStatusMsg] = useState("");

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error("Failed to load admin stats:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleResetDatabase = async () => {
    if (!confirm("Are you sure you want to reset the mock database store back to default seeder records? This wipes out custom projects/bookings.")) {
      return;
    }
    setDbStatusMsg("Tearing down databases index...");
    try {
      const res = await fetch("/api/admin/reset", { method: "POST" });
      if (res.ok) {
        setDbStatusMsg("Mock Database Restored successfully!");
        setTimeout(() => setDbStatusMsg(""), 2005);
        fetchStats();
      }
    } catch (e) {
      console.log(e);
      setDbStatusMsg("Restoration failed.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 font-sans text-slate-100">
      
      {/* Overview Stat Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Users */}
        <div className="bg-slate-905 border border-slate-850 p-4 rounded-xl flex items-center justify-between shadow-lg text-slate-100">
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase font-mono block">Registered Users</span>
            <span className="text-2xl font-bold font-mono text-white">{stats?.userCount || 4}</span>
          </div>
          <Users className="w-8 h-8 text-indigo-400 opacity-60" />
        </div>

        {/* Projects */}
        <div className="bg-slate-905 border border-slate-850 p-4 rounded-xl flex items-center justify-between shadow-lg text-slate-100">
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase font-mono block">Project ideas</span>
            <span className="text-2xl font-bold font-mono text-white">{stats?.projectCount || 5}</span>
          </div>
          <Layers className="w-8 h-8 text-indigo-400 opacity-60" />
        </div>

        {/* Internships */}
        <div className="bg-slate-905 border border-slate-850 p-4 rounded-xl flex items-center justify-between shadow-lg text-slate-100">
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase font-mono block">Career job postings</span>
            <span className="text-2xl font-bold font-mono text-white">{stats?.internshipCount || 3}</span>
          </div>
          <AlertOctagon className="w-8 h-8 text-indigo-400 opacity-60" />
        </div>

        {/* Hackathon signups */}
        <div className="bg-slate-905 border border-slate-850 p-4 rounded-xl flex items-center justify-between shadow-lg text-slate-100">
          <div>
            <span className="text-[10px] text-slate-500 font-bold uppercase font-mono block">Hackathon Ranks</span>
            <span className="text-2xl font-bold font-mono text-white">{stats?.hackathonCount || 2}</span>
          </div>
          <TrendingUp className="w-8 h-8 text-indigo-400 opacity-60" />
        </div>
      </div>

      {/* CHARTS CONTAINER GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Custom native SVG chart for User Registrations timeline */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl lg:col-span-2">
          <div className="flex border-b border-slate-800 pb-3 mb-4 justify-between items-center text-xs">
            <h4 className="font-bold text-white uppercase font-mono flex items-center gap-1.5 text-slate-350">
              <BarChart3 className="text-indigo-400 w-4.5 h-4.5" /> User registrations timeline
            </h4>
            <span className="text-slate-500 font-mono">Simulated UTC (Weekly indices)</span>
          </div>

          <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-4">
            {/* Draw a gorgeous inline SVG chart to maintain complete desktop-first precision */}
            <svg viewBox="0 0 500 200" className="w-full h-44 text-indigo-500 overflow-visible">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid lines */}
              <line x1="10" y1="20" x2="490" y2="20" stroke="#1e293b" strokeDasharray="3,3" />
              <line x1="10" y1="70" x2="490" y2="70" stroke="#1e293b" strokeDasharray="3,3" />
              <line x1="10" y1="120" x2="490" y2="120" stroke="#1e293b" strokeDasharray="3,3" />
              <line x1="10" y1="170" x2="490" y2="170" stroke="#1e293b"  />

              {/* Chart Line Path */}
              <path 
                d="M 10 160 Q 90 140, 170 110 T 330 60 T 490 25" 
                fill="none" 
                stroke="#6366f1" 
                strokeWidth="3.5" 
              />

              {/* Area under the line */}
              <path 
                d="M 10 160 Q 90 140, 170 110 T 330 60 T 490 25 L 490 170 L 10 170 Z" 
                fill="url(#chartGrad)" 
              />

              {/* Interactive nodes */}
              <circle cx="170" cy="110" r="5" fill="#f59e0b" stroke="#000" strokeWidth="2" />
              <circle cx="330" cy="60" r="5" fill="#6366f1" stroke="#000" strokeWidth="2" />
              <circle cx="490" cy="25" r="5" fill="#10b981" stroke="#000" strokeWidth="2" />
            </svg>

            <div className="flex justify-between items-center text-[10px] font-mono text-slate-550 leading-none px-1">
              <span>Week 1: Sophomore Profile Setup</span>
              <span>Week 3: GDSC HackathonLaunch</span>
              <span>Week 5: Stripe/Google bookings Active</span>
            </div>
          </div>
        </div>

        {/* Database Diagnostic and Moderation Controls */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-3 block max-w-sm">
              🛡️ Moderation & Diagnostic Deck
            </h4>

            {dbStatusMsg && (
              <div className="p-3 bg-indigo-950/40 border border-indigo-900/30 text-indigo-300 font-mono text-[10px] rounded leading-relaxed animate-pulse">
                ⚙️ {dbStatusMsg}
              </div>
            )}

            <div className="space-y-3">
              <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl space-y-1">
                <span className="text-[10px] text-emerald-400 font-bold font-mono uppercase block">Active Server Port</span>
                <p className="text-xs text-slate-400">Node framework bound on <code>http://0.0.0.0:3000</code></p>
              </div>

              <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl space-y-1">
                <span className="text-[10px] text-amber-400 font-bold font-mono block uppercase">File Upload Module</span>
                <p className="text-xs text-slate-400">Cloudinary endpoints simulated internally within server repositories.</p>
              </div>
            </div>
          </div>

          <div className="space-y-3.5 pt-6 border-t border-slate-850 mt-6 md:mt-0">
            <button 
              onClick={handleResetDatabase}
              className="w-full py-2.5 bg-rose-950/[0.15] hover:bg-rose-955 hover:text-white border border-rose-900 text-rose-400 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Trash2 className="w-4 h-4" /> Hard Reset Mock Database
            </button>
            
            <p className="text-[9px] text-slate-600 font-mono leading-relaxed text-center">
              Re-initiates the `src/mock_db_store.json` back to default seed state containing GDSC, NITIN profiles, and prefilled candidate applications logs.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
