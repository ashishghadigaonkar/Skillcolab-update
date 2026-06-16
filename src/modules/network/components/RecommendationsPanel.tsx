import React from "react";
import { Award, Mail, CheckCircle2 } from "lucide-react";
import { LinkedInRecommendation } from "../../../types";

interface RecommendationsPanelProps {
  recommendations: LinkedInRecommendation[];
  onApproveRecommendation: (recId: string) => void;
  onRequestRecommendation: (e: React.FormEvent) => void;
  recTargetName: string;
  setRecTargetName: (val: string) => void;
  recText: string;
  setRecText: (val: string) => void;
  successMessage: string;
}

export const RecommendationsPanel: React.FC<RecommendationsPanelProps> = ({
  recommendations,
  onApproveRecommendation,
  onRequestRecommendation,
  recTargetName,
  setRecTargetName,
  recText,
  setRecText,
  successMessage
}) => {
  const approvedRecs = recommendations.filter(r => r.status === "Approved");
  const pendingRecs = recommendations.filter(r => r.status === "Pending");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="recommendations-panel-container">
      
      {/* Request Recommendation Form */}
      <div className="bg-slate-900 border border-slate-850 rounded-2xl p-4 md:p-5 space-y-4">
        <div>
          <h3 className="font-sans font-bold text-white text-xs flex items-center gap-1.5">
            <Mail className="w-4 h-4 text-indigo-400" /> Request LinkedIn Peer Recommendation
          </h3>
          <p className="text-[10px] text-slate-450 font-mono">Ask a senior mentor, alumnus or student classmate to write a verified recommendation of your engineering work.</p>
        </div>

        {successMessage && (
          <div className="p-2 bg-emerald-950/20 border border-emerald-500/20 rounded-xl text-center text-emerald-400 font-mono text-[10px]">
            {successMessage}
          </div>
        )}

        <form onSubmit={onRequestRecommendation} className="space-y-3 text-xs text-left">
          <div className="space-y-1">
            <label className="text-[10px] text-slate-500 font-mono block">Peer / Mentor Name:</label>
            <input
              type="text"
              required
              value={recTargetName}
              onChange={(e) => setRecTargetName(e.target.value)}
              placeholder="e.g. Kartik Singhal (Google)"
              className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] text-slate-500 font-mono block">What did you build together?</label>
            <textarea
              required
              rows={3}
              value={recText}
              onChange={(e) => setRecText(e.target.value)}
              placeholder="Detail your shared technical sprint, project contributions or hackathon win..."
              className="w-full bg-slate-950 border border-slate-850 rounded-lg p-2 text-slate-200 focus:outline-none focus:border-indigo-500 resize-none font-sans"
            />
          </div>

          <button
            type="submit"
            className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold rounded-lg text-xs transition-colors cursor-pointer"
          >
            Submit Request Invitation
          </button>
        </form>
      </div>

      {/* Recommendations Feed & Pending Approvals */}
      <div className="lg:col-span-2 space-y-6">
        
        {/* Pending approvals */}
        {pendingRecs.length > 0 && (
          <div className="bg-slate-900 border border-amber-500/20 rounded-2xl p-4 md:p-5">
            <h3 className="font-sans font-bold text-amber-400 text-xs mb-3 flex items-center gap-1.5">
              ⚠️ Recommendations Awaiting Your Approval ({pendingRecs.length})
            </h3>

            <div className="space-y-3">
              {pendingRecs.map(rec => (
                <div key={rec.id} className="p-3 bg-slate-950 rounded-xl border border-slate-850 space-y-2.5 text-xs text-left">
                  <div className="flex gap-2.5 items-center">
                    <img src={rec.senderAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80"} alt={rec.senderName} className="w-8 h-8 rounded-full object-cover" referrerPolicy="no-referrer" />
                    <div>
                      <h4 className="font-bold text-white leading-none">{rec.senderName}</h4>
                      <span className="text-[9.5px] text-amber-400 mt-1 block font-mono leading-none">{rec.senderRole}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-300 italic font-sans leading-relaxed">"{rec.text}"</p>

                  <div className="flex justify-between items-center pt-2 border-t border-slate-900">
                    <span className="text-[8px] text-slate-500 uppercase font-mono">Sent on {rec.createdAt}</span>
                    <button
                      onClick={() => onApproveRecommendation(rec.id)}
                      className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 rounded text-white font-mono text-[9px] font-bold"
                    >
                      Approve & Publish to Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Published recommendations */}
        <div className="bg-slate-900 border border-slate-850 rounded-2xl p-4 md:p-5">
          <h3 className="font-sans font-bold text-white text-xs mb-3 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-emerald-400" /> Endorsed Recommendations Portfolio ({approvedRecs.length})
          </h3>

          {approvedRecs.length === 0 ? (
            <p className="text-slate-500 font-mono text-[10px] text-center py-6 bg-slate-950 border border-slate-850 rounded-xl">No published recommendation reviews on your profile yet.</p>
          ) : (
            <div className="space-y-4">
              {approvedRecs.map(rec => (
                <div key={rec.id} className="p-3.5 bg-slate-950 rounded-xl border border-slate-850 space-y-2 text-[11px] text-left">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-2.5 items-center">
                      <img src={rec.senderAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&h=100&q=80"} alt={rec.senderName} className="w-8 h-8 rounded-full object-cover" referrerPolicy="no-referrer" />
                      <div>
                        <h4 className="font-bold text-white leading-none">{rec.senderName}</h4>
                        <span className="text-[9.5px] text-indigo-400 font-mono block mt-0.5">{rec.senderRole}</span>
                      </div>
                    </div>

                    <span className="px-1.5 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 font-mono text-[8px] uppercase rounded flex items-center gap-0.5">
                      <CheckCircle2 className="w-2.5 h-2.5 text-indigo-400" /> Verified
                    </span>
                  </div>

                  <p className="text-slate-300 italic font-sans leading-relaxed pt-1">"{rec.text}"</p>
                  
                  <div className="text-[8px] text-slate-500 font-mono pt-1 text-right">
                    Published: {rec.createdAt}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
