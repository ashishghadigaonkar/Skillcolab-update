import React from "react";
import { Building, Landmark, X } from "lucide-react";

interface FollowingPanelProps {
  following: string[];
  onToggleFollow: (targetId: string, type: "student" | "mentor" | "company") => void;
  companies: any[];
  organizations: any[];
}

export const FollowingPanel: React.FC<FollowingPanelProps> = ({
  following,
  onToggleFollow,
  companies,
  organizations
}) => {
  const followedCompanies = companies.filter(c => following.includes(c.id));
  const followedOrgs = organizations.filter(o => following.includes(o.id));

  return (
    <div className="space-y-6" id="following-panel-container">
      <div className="bg-slate-900 border border-slate-850 rounded-2xl p-4 md:p-5">
        <h3 className="font-sans font-bold text-white text-xs mb-3 flex items-center gap-1.5">
          <Building className="w-4 h-4 text-indigo-400" /> Following Company Channels ({followedCompanies.length})
        </h3>
        
        {followedCompanies.length === 0 ? (
          <p className="text-slate-500 font-mono text-[10px] text-center py-4 bg-slate-950 border border-slate-850 rounded-xl">
            You aren't following any corporate pages yet.
          </p>
        ) : (
          <div className="space-y-3">
            {followedCompanies.map(comp => (
              <div key={comp.id} className="p-3 bg-slate-950 rounded-xl border border-slate-850 flex justify-between items-center text-xs">
                <div className="flex gap-2.5 items-center">
                  <img src={comp.logo} alt={comp.name} className="w-8 h-8 rounded-lg object-cover" />
                  <div className="text-left">
                    <h4 className="font-bold text-white text-xs">{comp.name}</h4>
                    <span className="text-[9.5px] text-indigo-300 font-mono block">{comp.industry}</span>
                  </div>
                </div>

                <button
                  onClick={() => onToggleFollow(comp.id, "company")}
                  className="p-1 text-slate-400 hover:text-red-400 font-mono text-[10px] flex items-center gap-1 cursor-pointer"
                >
                  <X className="w-3 h-3" /> Unfollow
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-slate-900 border border-slate-850 rounded-2xl p-4 md:p-5">
        <h3 className="font-sans font-bold text-white text-xs mb-3 flex items-center gap-1.5">
          <Landmark className="w-4 h-4 text-emerald-400" /> Member Chapters & Clubs ({followedOrgs.length})
        </h3>

        {followedOrgs.length === 0 ? (
          <p className="text-slate-500 font-mono text-[10px] text-center py-4 bg-slate-950 border border-slate-850 rounded-xl">
            You haven't joined any campus chapters yet.
          </p>
        ) : (
          <div className="space-y-3">
            {followedOrgs.map(org => (
              <div key={org.id} className="p-3 bg-slate-950 rounded-xl border border-slate-850 flex justify-between items-center text-xs">
                <div className="flex gap-2.5 items-center">
                  <img src={org.logo} alt={org.name} className="w-8 h-8 rounded-lg object-cover" />
                  <div className="text-left">
                    <h4 className="font-bold text-white text-xs">{org.name}</h4>
                    <span className="text-[9.5px] text-emerald-400 font-mono block">{org.type}</span>
                  </div>
                </div>

                <button
                  onClick={() => onToggleFollow(org.id, "company")}
                  className="p-1 text-slate-400 hover:text-red-400 font-mono text-[10px] flex items-center gap-1 cursor-pointer"
                >
                  <X className="w-3 h-3" /> Leave Chapter
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
