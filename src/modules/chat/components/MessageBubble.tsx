import React from "react";

interface ChatMessage {
  id: string;
  channelId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  createdAt: string;
}

interface MessageBubbleProps {
  message: ChatMessage;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  return (
    <div className="flex gap-3 text-xs flex-col md:flex-row text-left" id={`msg-bubble-${message.id}`}>
      <img 
        src={message.senderAvatar} 
        alt={message.senderName} 
        className="w-8 h-8 rounded-full object-cover border border-slate-800 shrink-0" 
        referrerPolicy="no-referrer"
      />
      <div>
        <div className="flex items-baseline gap-2">
          <span className="font-extrabold text-white">{message.senderName}</span>
          <span className="text-[9px] text-slate-500 font-mono">
            {new Date(message.createdAt).toLocaleTimeString()}
          </span>
        </div>
        <p className="text-slate-300 mt-1.5 bg-slate-950/40 p-2.5 rounded-lg border border-slate-900 leading-relaxed max-w-lg">
          {message.content}
        </p>
      </div>
    </div>
  );
};
