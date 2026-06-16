import React from "react";
import { Users, Hash, Circle, Laptop } from "lucide-react";

interface Channel {
  id: string;
  name: string;
  type: "channel" | "dm";
  lastMsg: string;
  unread: boolean;
}

interface ConversationListProps {
  channels: Channel[];
  selectedChannel: string;
  onSelectChannel: (channelId: string) => void;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  channels,
  selectedChannel,
  onSelectChannel,
}) => {
  return (
    <div className="w-64 bg-slate-950 border-r border-slate-850 flex flex-col justify-between hidden md:flex shrink-0">
      <div>
        {/* Header */}
        <div className="p-4 border-b border-slate-850 flex items-center justify-between">
          <span className="text-xs font-mono font-extrabold tracking-wider text-slate-400">COLLAB WORKSPACE</span>
          <Users className="w-4 h-4 text-indigo-400" />
        </div>

        <div className="p-2 space-y-4">
          {/* Channels */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-505 font-bold px-2.5 uppercase tracking-widest block">Channels</span>
            {channels.filter(c => c.type === "channel").map(ch => (
              <button 
                key={ch.id} 
                onClick={() => onSelectChannel(ch.id)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                  selectedChannel === ch.id 
                    ? "bg-indigo-600/10 border border-indigo-500/20 text-indigo-300" 
                    : "text-slate-400 hover:bg-slate-900/60 hover:text-white"
                }`}
              >
                <span className="flex items-center gap-1.5 truncate"><Hash className="w-3.5 h-3.5 text-slate-500" /> {ch.name}</span>
                {ch.unread && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 font-sans" />}
              </button>
            ))}
          </div>

          {/* Direct Messages */}
          <div className="space-y-1">
            <span className="text-[10px] font-mono text-slate-505 font-bold px-2.5 uppercase tracking-widest block">Direct Members</span>
            {channels.filter(c => c.type === "dm").map(ch => (
              <button 
                key={ch.id} 
                onClick={() => onSelectChannel(ch.id)}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                  selectedChannel === ch.id 
                    ? "bg-indigo-600/10 border border-indigo-505/20 text-indigo-300" 
                    : "text-slate-400 hover:bg-slate-900/60 hover:text-white"
                }`}
              >
                <span className="flex items-center gap-1.5 truncate"><Circle className="w-2.5 h-2.5 text-emerald-500 fill-emerald-500 shrink-0" /> {ch.name}</span>
                {ch.unread && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 font-sans" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Live connections status overlay bottom */}
      <div className="p-3 border-t border-slate-850 text-[10px] text-slate-500 font-mono text-center flex items-center justify-center gap-1.5">
        <Laptop className="w-3 h-3 text-emerald-500" /> 
        SYNCED TO MONGO ATLAS MOCK
      </div>
    </div>
  );
};
