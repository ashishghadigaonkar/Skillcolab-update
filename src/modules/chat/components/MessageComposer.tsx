import React from "react";
import { Send } from "lucide-react";

interface MessageComposerProps {
  text: string;
  onChangeText: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const MessageComposer: React.FC<MessageComposerProps> = ({
  text,
  onChangeText,
  onSubmit
}) => {
  return (
    <form onSubmit={onSubmit} className="p-4 border-t border-slate-850 bg-slate-950/45 flex gap-2" id="msg-composer-form">
      <input 
        type="text" 
        placeholder="Type your message, query or tech review here..." 
        value={text} 
        onChange={(e) => onChangeText(e.target.value)}
        className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-650 focus:outline-none focus:border-indigo-500 font-sans"
      />
      <button 
        type="submit" 
        className="px-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors shadow-lg flex items-center justify-center cursor-pointer"
      >
        <Send className="w-4 h-4" />
      </button>
    </form>
  );
};
