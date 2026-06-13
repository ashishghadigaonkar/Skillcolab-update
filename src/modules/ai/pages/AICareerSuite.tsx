/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  FileText, BrainCircuit, Goal, Sparkles, Send, CheckCircle, 
  Award, RefreshCw, Star, Clipboard, AlertCircle, Play, 
  ArrowRight, ShieldCheck, Bookmark, Download, GraduationCap 
} from "lucide-react";

export default function AICareerSuite() {
  const [activeTool, setActiveTool] = useState<"resume" | "interview" | "roadmap">("resume");

  // === RESUME BUILDER STATE ===
  const [resumeLoading, setResumeLoading] = useState(false);
  const [resumeData, setResumeData] = useState<any>(null);
  const [copySuccess, setCopySuccess] = useState(false);

  // === MOCK INTERVIEW STATE ===
  const [interviewType, setInterviewType] = useState<"Technical" | "DSA" | "HR">("Technical");
  const [targetRole, setTargetRole] = useState("Fullstack Developer");
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [interviewLoading, setInterviewLoading] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [userAnswer, setUserAnswer] = useState("");
  const [evalResult, setEvalResult] = useState<any>(null);

  // === CAREER ROADMAP STATE ===
  const [careerGoal, setCareerGoal] = useState("MERN Developer");
  const [roadmapLoading, setRoadmapLoading] = useState(false);
  const [roadmapData, setRoadmapData] = useState<any>(null);

  // --- ACTIONS ---
  
  // 1. Resume Builder
  const handleAnalyzeResume = async () => {
    setResumeLoading(true);
    setResumeData(null);
    try {
      const res = await fetch("/api/ai/resume-builder", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      if (res.ok) {
        const data = await res.json();
        setResumeData(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setResumeLoading(false);
    }
  };

  const handleCopyResume = () => {
    if (!resumeData) return;
    const bulletPoints = resumeData.accomplishments.join("\n");
    navigator.clipboard.writeText(bulletPoints);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // 2. Mock Interview
  const handleStartInterview = async () => {
    setInterviewLoading(true);
    setEvalResult(null);
    try {
      const res = await fetch("/api/ai/mock-interview/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ interviewType, targetRole })
      });
      if (res.ok) {
        const data = await res.json();
        setCurrentQuestion(data.question);
        setInterviewStarted(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setInterviewLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!userAnswer.trim()) return;
    setInterviewLoading(true);
    try {
      const res = await fetch("/api/ai/mock-interview/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: currentQuestion, userAnswer, interviewType })
      });
      if (res.ok) {
        const data = await res.json();
        setEvalResult(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setInterviewLoading(false);
    }
  };

  // 3. Career Roadmap
  const handleGenerateRoadmap = async () => {
    setRoadmapLoading(true);
    setRoadmapData(null);
    try {
      const res = await fetch("/api/ai/career-roadmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ goal: careerGoal })
      });
      if (res.ok) {
        const data = await res.json();
        setRoadmapData(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setRoadmapLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER CONTROLS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-slate-900 border border-slate-850 p-4 rounded-2xl">
        <div>
          <div className="flex items-center gap-1.5 text-indigo-400 font-mono text-xs font-semibold mb-1 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-amber-400/25" /> SkillCollab AI Engine
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">AI Career & Professional Suite</h2>
          <p className="text-xs text-slate-400">Startup-scale ATS builders, technical diagnostic mocks, and tailored roadmap structures.</p>
        </div>

        {/* Toggle Tools */}
        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 self-stretch md:self-auto text-xs">
          <button 
            onClick={() => setActiveTool("resume")}
            className={`flex-1 md:flex-none px-3.5 py-1.5 rounded-lg font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
              activeTool === "resume" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10" : "text-slate-400 hover:text-white"
            }`}
          >
            <FileText className="w-3.5 h-3.5" /> Resume ATS Score
          </button>
          <button 
            onClick={() => setActiveTool("interview")}
            className={`flex-1 md:flex-none px-3.5 py-1.5 rounded-lg font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
              activeTool === "interview" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10" : "text-slate-400 hover:text-white"
            }`}
          >
            <BrainCircuit className="w-3.5 h-3.5" /> Mock Interviews
          </button>
          <button 
            onClick={() => setActiveTool("roadmap")}
            className={`flex-1 md:flex-none px-3.5 py-1.5 rounded-lg font-semibold flex items-center justify-center gap-1.5 cursor-pointer transition-all ${
              activeTool === "roadmap" ? "bg-indigo-600 text-white shadow-md shadow-indigo-600/10" : "text-slate-400 hover:text-white"
            }`}
          >
            <Goal className="w-3.5 h-3.5" /> Roadmaps
          </button>
        </div>
      </div>

      {/* ==================================================== */}
      {/* 1. RESUME BUILDER PANEL */}
      {/* ==================================================== */}
      {activeTool === "resume" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-5 bg-slate-900 border border-slate-850 p-5 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">1. Profile Data Restructuring</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              We extract metrics and history directly from your **Student Professional Profile** on SkillCollab and feed them into our Gemini-powered ATS validation gateway.
            </p>
            
            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2.5 text-xs">
              <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono">
                <span>Verified Source Profile</span>
                <span className="text-emerald-400 font-bold">● Active</span>
              </div>
              <p className="font-bold text-white leading-none">Ashish Ghadigaonkar</p>
              <p className="text-slate-400 text-[11px] font-semibold leading-relaxed">
                Computer Science | B.Tech Sophomore State Technological University
              </p>
              <div className="flex flex-wrap gap-1 pt-1.5 border-t border-slate-850">
                {["React.js", "Node.js", "Express.js", "TypeScript", "Tailwind", "MongoDB"].map((t) => (
                  <span key={t} className="px-2 py-0.5 bg-slate-900 text-indigo-400 font-mono text-[9px] rounded-md border border-indigo-500/10">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <button
              onClick={handleAnalyzeResume}
              disabled={resumeLoading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-550 text-white rounded-xl text-xs font-bold font-sans cursor-pointer transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/10 disabled:opacity-50"
            >
              {resumeLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Formulating ATS Scoring Recommendations...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300 fill-amber-300/10" />
                  Process & Build ATS Perfect Resume
                </>
              )}
            </button>
          </div>

          <div className="lg:col-span-7 bg-slate-900 border border-slate-850 p-6 rounded-2xl flex flex-col justify-between min-h-[400px]">
            {resumeLoading ? (
              <div className="flex flex-col justify-center items-center flex-1 py-12 space-y-4">
                <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
                <div className="text-center space-y-1">
                  <p className="text-sm font-semibold text-white">Aggregating Profile Accomplishments</p>
                  <p className="text-xs text-slate-400 font-mono">Running Gemini-3.5-Flash parser via server.ts</p>
                </div>
              </div>
            ) : resumeData ? (
              <div className="space-y-6">
                
                {/* Score badge indicator */}
                <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex flex-col justify-center items-center">
                      <span className="text-xl font-extrabold text-white font-mono leading-none">{resumeData.atsScore}</span>
                      <span className="text-[7px] text-slate-400 font-mono uppercase font-bold mt-0.5">Score</span>
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-white uppercase tracking-wider font-mono">ATS Gating Match Score</h4>
                      <p className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1 mt-0.5">
                        <CheckCircle className="w-3 h-3" /> Fully Optimized for Startup-scale ATS
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button 
                      onClick={handleCopyResume}
                      className="px-3 py-1.5 bg-slate-950 hover:bg-slate-850 text-indigo-400 border border-slate-850 rounded-lg text-[10px] font-mono flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      {copySuccess ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> : <Clipboard className="w-3.5 h-3.5" />}
                      {copySuccess ? "Copied!" : "Copy Bullet Points"}
                    </button>
                    <button className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-semibold flex items-center gap-1.5 transition-all cursor-pointer">
                      <Download className="w-3.5 h-3.5" /> PDF Template Export
                    </button>
                  </div>
                </div>

                {/* Optimizations Accomplishments */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-amber-400" /> Redesigned Professional Accomplishments (XYZ Formula)
                  </h4>
                  <div className="space-y-2.5">
                    {resumeData.accomplishments.map((bullet: string, idx: number) => (
                      <div key={idx} className="p-3 bg-slate-950 border border-slate-850 rounded-xl text-xs text-slate-300 leading-relaxed font-sans shadow-sm">
                        • {bullet}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Suggestions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-800 pt-4">
                  <div className="space-y-2.5">
                    <span className="text-[10px] font-bold text-red-400 font-mono uppercase tracking-widest block">Structural Failings & Fixes</span>
                    <ul className="space-y-1.5 text-[11px] text-slate-400 leading-relaxed">
                      {resumeData.structuralImprovements.map((s: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <span className="text-red-450 mt-1 font-bold">•</span>
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2.5">
                    <span className="text-[10px] font-bold text-indigo-300 font-mono uppercase tracking-widest block">Compliant Recommended Formats</span>
                    <div className="flex flex-wrap gap-1.5">
                      {resumeData.suggestedTemplates.map((tpl: string, idx: number) => (
                        <span key={tpl} className="px-2.5 py-1 bg-slate-950 border border-slate-850 rounded-lg text-[10px] text-slate-300 font-semibold flex items-center gap-1">
                          <Bookmark className="w-3 h-3 text-indigo-400" /> {tpl}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

              </div>
            ) : (
              <div className="flex flex-col justify-center items-center flex-1 text-center py-12 p-4">
                <AlertCircle className="w-8 h-8 text-indigo-500/80 mb-3" />
                <h4 className="text-xs font-extrabold text-white uppercase tracking-widest mb-1.5 font-mono">No Active Vetting File</h4>
                <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                  Trigger our resume scanning interface by executing the Process on the left side to compile student career metrics.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 2. MOCK INTERVIEWS PANEL */}
      {/* ==================================================== */}
      {activeTool === "interview" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 bg-slate-900 border border-slate-850 p-5 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Interview Settings</h3>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Target Application Role</label>
                <input 
                  type="text" 
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Fullstack Developer"
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white placeholder-slate-700 outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Select Interview Spec</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(["Technical", "HR", "DSA"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setInterviewType(t)}
                      className={`py-1.5 border px-1 rounded font-mono text-[10px] font-bold cursor-pointer text-center transition-all ${
                        interviewType === t 
                          ? "bg-indigo-600/10 border-indigo-500 text-indigo-400 font-extrabold" 
                          : "bg-slate-950 border-slate-850 text-slate-400 hover:text-white"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={handleStartInterview}
              disabled={interviewLoading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-550 text-white rounded-xl text-xs font-bold font-sans cursor-pointer transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/15 disabled:opacity-50"
            >
              {interviewLoading ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              {interviewStarted ? "Generate New Scenario Question" : "Initiate Simulated Interview Session"}
            </button>

            <div className="p-3 bg-slate-950 border border-slate-855 rounded-xl text-[10px] text-slate-400 leading-relaxed space-y-1">
              <p className="font-extrabold text-slate-350 flex items-center gap-1 font-mono uppercase tracking-wider text-[9px]">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Platform Rating Security
              </p>
              <p>Simulates real-world recruiters using high-pressure questions. Answer in detail to increase candidate scoring.</p>
            </div>
          </div>

          <div className="lg:col-span-8 bg-slate-900 border border-slate-850 p-6 rounded-2xl flex flex-col justify-between min-h-[420px]">
            {interviewStarted ? (
              <div className="space-y-4 flex-1 flex flex-col justify-between">
                
                {/* Active Question Box */}
                <div className="p-4 bg-slate-950 border border-indigo-500/10 rounded-xl space-y-2">
                  <div className="flex justify-between items-center text-[10px] text-slate-450 font-mono font-bold uppercase tracking-wider">
                    <span>Active Scenario Stage Question</span>
                    <span className="text-amber-400">Rating Gated</span>
                  </div>
                  <p className="text-xs font-semibold text-white leading-relaxed font-sans italic">
                    "{currentQuestion || "Formulating specialized prompt question..."}"
                  </p>
                </div>

                {/* Evaluation Results Overlay */}
                {evalResult && (
                  <div className="p-4 bg-slate-950 border border-slate-850 rounded-xl space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-indigo-400 block">Candidate Evaluation Check</span>
                        <span className="px-2 py-0.5 bg-indigo-500/15 text-[9px] font-mono text-indigo-300 font-bold rounded">
                          Score: {evalResult.score}/100
                        </span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" /> Fully Assessed
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="text-[9px] text-slate-400 font-mono uppercase block mb-1">Evaluator Feedback</span>
                        <ul className="space-y-1 text-slate-300 text-[11px] leading-relaxed">
                          {evalResult.feedback.map((f: string, idx: number) => (
                            <li key={idx} className="flex items-start gap-1">
                              <span className="text-indigo-400 font-bold">•</span>
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <span className="text-[9px] text-slate-400 font-mono uppercase block mb-1">Model Exemplar Answer</span>
                        <p className="text-[11px] text-indigo-300 leading-relaxed font-mono font-medium italic">
                          {evalResult.exemplarAnswer}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Form Input answer */}
                <div className="space-y-3 pt-2">
                  <label className="block text-[10px] text-slate-400 font-mono uppercase">Provide Your Professional Answer</label>
                  <textarea
                    rows={3}
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    placeholder="Provide your technical / behavioral thoughts here in depth to gain assessment feedback..."
                    className="w-full bg-slate-950 border border-slate-800 text-xs text-slate-100 rounded-xl p-3 placeholder-slate-705 outline-none focus:border-indigo-500 resize-none font-mono"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={interviewLoading || !userAnswer.trim()}
                      className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shadow-md shadow-indigo-600/15 disabled:opacity-50"
                    >
                      {interviewLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                      Evaluate Response
                    </button>
                  </div>
                </div>

              </div>
            ) : (
              <div className="flex flex-col justify-center items-center flex-1 text-center py-12 p-4">
                <BrainCircuit className="w-8 h-8 text-indigo-500/80 mb-3" />
                <h4 className="text-xs font-extrabold text-white uppercase tracking-widest mb-1.5 font-mono">Interview Simulator Offline</h4>
                <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                  Select your targeted application role on the left configuration pane and initiate the mock dialogue session.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* 3. CAREER ROADMAP PANEL */}
      {/* ==================================================== */}
      {activeTool === "roadmap" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-4 bg-slate-900 border border-slate-850 p-5 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">Goal Settings</h3>
            
            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[10px] text-slate-400 font-mono uppercase mb-1">Target Tech Specialization</label>
                <select
                  value={careerGoal}
                  onChange={(e) => setCareerGoal(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white outline-none focus:border-indigo-500 font-mono"
                >
                  <option value="MERN Developer">MERN Stack Developer</option>
                  <option value="Data Scientist">Data Scientist & Quantitative Analyst</option>
                  <option value="DevOps Engineer">Kubernetes & DevOps Engineer</option>
                  <option value="AI Engineer">AI / NLP Engineer (@google/genai)</option>
                  <option value="Cloud Architect">Cloud Ingress & Storage Architect</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerateRoadmap}
              disabled={roadmapLoading}
              className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-550 text-white rounded-xl text-xs font-bold font-sans cursor-pointer transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/15 disabled:opacity-50"
            >
              {roadmapLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Generating Roadmap Blueprint...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-amber-350 fill-amber-350/5" />
                  Create Interactive Roadmaps
                </>
              )}
            </button>
            
            <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl text-[10px] text-slate-400 font-sans leading-relaxed space-y-1">
              <span className="font-bold text-slate-300 font-mono text-[9px] block uppercase">Continuous Assessment Core</span>
              Our career engine structures sequential phases complete with actionable micro-projects and diagnostic interview triggers.
            </div>
          </div>

          <div className="lg:col-span-8 bg-slate-900 border border-slate-850 p-6 rounded-2xl flex flex-col justify-between min-h-[420px]">
            {roadmapLoading ? (
              <div className="flex flex-col justify-center items-center flex-1 py-12 space-y-4">
                <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
                <div className="text-center space-y-1">
                  <p className="text-sm font-semibold text-white">Synthesizing Course curriculum</p>
                  <p className="text-xs text-slate-450 font-mono text-[10px]">Calling Gemini LLM via server.ts</p>
                </div>
              </div>
            ) : roadmapData ? (
              <div className="space-y-6">
                
                <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Structured 6-Month Guide: {roadmapData.goal}
                  </h4>
                  <span className="px-2.5 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded font-mono text-[9px] font-bold text-amber-400 uppercase">
                    AI Curated
                  </span>
                </div>

                {/* Timeline display */}
                <div className="space-y-4">
                  {roadmapData.stages.map((stg: any, idx: number) => (
                    <div key={idx} className="relative group pl-5 border-l-2 border-indigo-650 space-y-2">
                      {/* circle */}
                      <div className="absolute -left-[6px] top-1 w-2.5 h-2.5 rounded-full bg-indigo-500 group-hover:scale-125 transition-all" />
                      
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <h5 className="text-[11px] font-bold text-white hover:text-indigo-400 transition-all font-mono leading-none">
                            {idx + 1}. {stg.stageName}
                          </h5>
                          <span className="text-[9px] text-[10px] text-slate-450 font-mono block mt-1">{stg.duration}</span>
                        </div>
                        <span className="px-2 py-0.5 bg-slate-950 border border-slate-85D rounded text-[8px] font-mono text-indigo-300 font-semibold shrink-0">
                          🎓 {stg.certificates}
                        </span>
                      </div>

                      <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl space-y-2 text-[11px]">
                        <div className="flex flex-wrap gap-1">
                          {stg.topics.map((t: string) => (
                            <span key={t} className="px-1.5 py-0.5 bg-slate-900 border border-slate-800/60 rounded text-[9px] font-mono text-slate-350">{t}</span>
                          ))}
                        </div>
                        <div className="text-[10px] text-slate-400 group-hover:text-slate-300 transition-all leading-relaxed">
                          <strong className="text-indigo-300 font-semibold font-mono text-[9px] uppercase mr-1">Project:</strong>{stg.project}
                        </div>
                        <div className="text-[10px] text-slate-450 border-t border-slate-850/60 pt-1.5">
                          <strong className="text-amber-400 font-semibold font-mono text-[9px] uppercase mr-1">Interview Prep Q:</strong>"{stg.interviewQuestion}"
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            ) : (
              <div className="flex flex-col justify-center items-center flex-1 text-center py-12 p-4">
                <Goal className="w-8 h-8 text-indigo-500/80 mb-3" />
                <h4 className="text-xs font-extrabold text-white uppercase tracking-widest mb-1.5 font-mono">Roadmap Center Empty</h4>
                <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
                  Choose your career discipline on the left side configuration pane and press the roadmap generation button.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
