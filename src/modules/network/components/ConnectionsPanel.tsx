import React from "react";
import { Users, UserPlus } from "lucide-react";
import { ProfessionalConnection } from "../../../types";

interface ConnectionsPanelProps {
  connections: ProfessionalConnection[];
  onAcceptConnection: (connId: string) => void;
  onRejectConnection: (connId: string) => void;
  onSendConnection: (targetUser: any) => void;
  peopleYouMayKnow: any[];
}

export const ConnectionsPanel: React.FC<ConnectionsPanelProps> = ({
  connections,
  onAcceptConnection,
  onRejectConnection,
  onSendConnection,
  peopleYouMayKnow
}) => {
  const pendingConnections = connections.filter(c => c.status === "Pending");
  const acceptedConnections = connections.filter(c => c.status === "Accepted");

  return (
    <div className="space-y-6" id="connections-panel-container">
      {/* Pending Room requests */}
      <div className="bg-slate-900 border border-slate-850 rounded-2xl p-4 md:p-5">
        <h3 className="font-sans font-bold text-white text-xs mb-3 flex items-center gap-2">
          <Users className="w-4 h-4 text-indigo-400" /> Pending Peer Connection Requests
        </h3>
        
        {pendingConnections.length === 0 ? (
          <div className="text-center py-6 bg-slate-950 border border-slate-850 rounded-xl">
            <p className="text-slate-500 font-mono text-xs">No pending peer connection requests.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {pendingConnections.map(conn => (
              <div key={conn.id} className="flex flex-col sm:flex-row gap-3 justify-between sm:items-center p-3 bg-slate-950 rounded-xl border border-slate-850">
                <div className="flex gap-3 items-center">
                  <img src={conn.senderAvatar} alt={conn.senderName} className="w-10 h-10 rounded-full object-cover border border-slate-800" referrerPolicy="no-referrer" />
                  <div>
                    <h5 className="font-bold text-white text-xs">{conn.senderName}</h5>
                    <span className="text-[9.5px] text-slate-400 block font-mono">{conn.senderHeadline}</span>
                    <span className="text-[8px] text-slate-500 block">Requested on {conn.createdAt}</span>
                    {conn.note && (
                      <div className="mt-1.5 p-1.5 bg-indigo-950/20 rounded border border-indigo-500/10 text-[9.5px] text-indigo-300 italic max-w-sm">
                        "{conn.note}"
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => onAcceptConnection(conn.id)}
                    className="p-1 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded font-mono font-bold text-[10px] transition-colors cursor-pointer"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => onRejectConnection(conn.id)}
                    className="p-1 px-3 bg-slate-900 hover:bg-slate-850 text-slate-400 rounded font-mono font-bold text-[10px] transition-colors cursor-pointer"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* People you may know recommendations */}
      <div className="bg-slate-900 border border-slate-850 rounded-2xl p-4 md:p-5">
        <h4 className="font-sans font-bold text-white text-xs mb-3 flex items-center gap-1.5">
          <UserPlus className="w-4 h-4 text-emerald-400" /> Discover Student Collaborators
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {peopleYouMayKnow.map(pymk => {
            const hasRequested = connections.some(c => c.receiverId === pymk.id);
            return (
              <div key={pymk.id} className="flex gap-3 items-center justify-between p-3 bg-slate-950 rounded-xl border border-slate-850">
                <img src={pymk.avatar} alt={pymk.name} className="w-9 h-9 rounded-full object-cover shrink-0 border border-slate-800" referrerPolicy="no-referrer" />
                <div className="flex-1 min-w-0 pr-1 text-left">
                  <h5 className="text-[11px] font-bold text-white truncate">{pymk.name}</h5>
                  <span className="text-[9px] text-slate-400 block truncate leading-tight">{pymk.role}</span>
                  <span className="text-[8px] text-indigo-400 block mt-0.5 font-mono">{pymk.mutual} mutual connections</span>
                </div>
                <button
                  onClick={() => onSendConnection(pymk)}
                  disabled={hasRequested}
                  className={`p-1 px-2.5 rounded text-[9px] font-mono font-bold transition-all shrink-0 cursor-pointer ${
                    hasRequested 
                      ? "bg-slate-900 text-slate-500 border border-slate-850" 
                      : "bg-indigo-600 hover:bg-indigo-500 text-white"
                  }`}
                >
                  {hasRequested ? "Pending" : "Connect"}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active connections list */}
      <div className="bg-slate-900 border border-slate-850 rounded-2xl p-4 md:p-5">
        <h3 className="font-sans font-bold text-white text-xs mb-3">
          Your Core Network ({acceptedConnections.length + 2} Verified Peers)
        </h3>
        {acceptedConnections.length === 0 ? (
          <p className="text-slate-500 font-mono text-[10px]">No accepted peer connections yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {acceptedConnections.map(conn => {
              const isSender = conn.senderId !== "student_ashish";
              const imgVal = isSender ? conn.senderAvatar : conn.receiverAvatar;
              const nameVal = isSender ? conn.senderName : conn.receiverName;
              const headVal = isSender ? conn.senderHeadline : conn.receiverHeadline;
              return (
                <div key={conn.id} className="p-3 bg-slate-950 rounded-xl border border-slate-850 flex items-center gap-3">
                  <img src={imgVal} alt={nameVal} className="w-8 h-8 rounded-full object-cover border border-slate-800" referrerPolicy="no-referrer" />
                  <div className="text-left min-w-0">
                    <h5 className="text-white font-bold text-xs truncate">{nameVal}</h5>
                    <p className="text-[9.5px] text-slate-400 truncate font-mono">{headVal}</p>
                    <span className="text-[8px] text-emerald-400 font-mono">✓ Active Connection</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
