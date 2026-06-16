import React from "react";
import { Users, Send } from "lucide-react";

interface FollowersPanelProps {
  followers: string[];
}

export const FollowersPanel: React.FC<FollowersPanelProps> = ({ followers }) => {
  const dummyFollowers = [
    { id: "f_1", name: "Rohan Sharma", role: "Backend Architect | Dev", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80", followedAt: "2 days ago" },
    { id: "f_2", name: "Sneha Nair", role: "UI/UX Practitioner", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80", followedAt: "5 days ago" },
    { id: "f_3", name: "Vijay Kumar", role: "Alumni Leader @ Amazon AWS", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80", followedAt: "1 week ago" }
  ];

  return (
    <div className="bg-slate-900 border border-slate-850 rounded-2xl p-4 md:p-5 space-y-4" id="followers-panel-container">
      <div>
        <h3 className="font-sans font-bold text-white text-xs flex items-center gap-2">
          <Users className="w-4 h-4 text-emerald-400" /> Professional Followers ({followers.length + dummyFollowers.length})
        </h3>
        <p className="text-[10px] text-slate-450 font-mono">Students, alumni and recruiters following your Open-Source commits and project posts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dummyFollowers.map(fol => (
          <div key={fol.id} className="p-3 bg-slate-950 rounded-xl border border-slate-850 flex items-center justify-between gap-3 text-xs">
            <div className="flex gap-2.5 items-center text-left">
              <img src={fol.avatar} alt={fol.name} className="w-8 h-8 rounded-full object-cover border border-slate-800" referrerPolicy="no-referrer" />
              <div>
                <h5 className="font-bold text-white text-xs">{fol.name}</h5>
                <span className="text-[9.5px] text-slate-400 block font-mono leading-none">{fol.role}</span>
                <span className="text-[8.5px] text-slate-500 block font-mono mt-0.5">Followed {fol.followedAt}</span>
              </div>
            </div>
            
            <button
              onClick={() => alert(`Initiating prompt handshake with ${fol.name}`)}
              className="px-2 py-1 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded font-mono text-[9px] text-slate-300 flex items-center gap-1 cursor-pointer"
            >
              <Send className="w-2.5 h-2.5" /> Chat
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
