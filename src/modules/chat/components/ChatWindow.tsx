import React from "react";
import { RefreshCw } from "lucide-react";
import { MessageBubble } from "./MessageBubble";
import { MessageComposer } from "./MessageComposer";

interface ChatMessage {
  id: string;
  channelId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  createdAt: string;
}

interface ChatWindowProps {
  channelName: string;
  messages: ChatMessage[];
  loading: boolean;
  typingSim: boolean;
  newText: string;
  onChangeText: (val: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  onRefresh: () => void;
  chatEndRef: React.RefObject<HTMLDivElement | null>;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  channelName,
  messages,
  loading,
  typingSim,
  newText,
  onChangeText,
  onSendMessage,
  onRefresh,
  chatEndRef
}) => {
  return (
    <div className="flex-1 flex flex-col justify-between bg-slate-900" id="chat-window-dashboard">
      
      {/* Header toolbar */}
      <div className="p-4 border-b border-slate-855 flex items-center justify-between bg-slate-905">
        <div className="flex items-center gap-2">
          <span className="text-sm font-extrabold text-white"># {channelName}</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        <button 
          onClick={onRefresh}
          className="p-1.5 hover:bg-slate-850 rounded-lg text-slate-400 hover:text-white transition-colors"
          title="Refresh stream logs"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Messages Stream bubble feed */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 custom-scrollbar">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <>
            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} />
            ))}

            {/* Bot typing simulation overlay */}
            {typingSim && (
              <div className="flex gap-3 text-xs text-left" id="bot-typing-simulation">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex justify-center items-center shrink-0 border border-slate-700 font-mono text-[9px] animate-pulse text-white">
                  Typing
                </div>
                <div>
                  <div className="flex items-center gap-2 font-mono text-[9px] text-slate-500">
                    <span>Roster squad teammate typing...</span>
                  </div>
                  <div className="mt-1 bg-slate-950/25 p-2 rounded-lg border border-slate-900 flex items-center gap-1 text-[11px] text-slate-450 italic">
                    Rahul Dev is compiling comments...
                  </div>
                </div>
              </div>
            )}

            {messages.length === 0 && (
              <div className="text-center py-20 text-slate-500 font-sans italic text-xs">
                No conversation logs yet. Toss an introductory remark!
              </div>
            )}
            <div ref={chatEndRef} />
          </>
        )}
      </div>

      {/* Text area post input bar */}
      <MessageComposer 
        text={newText}
        onChangeText={onChangeText}
        onSubmit={onSendMessage}
      />
    </div>
  );
};
