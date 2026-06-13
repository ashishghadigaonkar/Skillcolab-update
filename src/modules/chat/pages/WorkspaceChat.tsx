/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { 
  Send, Users, MessageSquare, Terminal, RefreshCw, 
  Hash, Circle, Laptop, UserCheck, ShieldClose 
} from "lucide-react";

interface ChatMessage {
  id: string;
  channelId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  createdAt: string;
}

export default function WorkspaceChat() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [channels, setChannels] = useState<{ id: string; name: string; type: "channel" | "dm"; lastMsg: string; unread: boolean }[]>([
    { id: "gen_collab", name: "study-buddy-squad", type: "channel", lastMsg: "Check the design specs in Figma!", unread: true },
    { id: "gdsc_general", name: "gdsc-campus-hack", type: "channel", lastMsg: "Submissions deadline is tonight, team!", unread: false },
    { id: "stripe_ops", name: "stripe-ops-workspace", type: "channel", lastMsg: "API credentials set in secrets tab.", unread: false },
    { id: "dm_ayesha", name: "Ayesha Qureshi (Stripe)", type: "dm", lastMsg: "Sure, let's connect tomorrow morning.", unread: true },
    { id: "dm_nitin", name: "Nitin Kamath (Google)", type: "dm", lastMsg: "Your ML model looks well-scoped.", unread: false }
  ]);
  const [selectedChannel, setSelectedChannel] = useState("gen_collab");
  const [newText, setNewText] = useState("");
  const [loading, setLoading] = useState(true);
  const [typingSim, setTypingSim] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
  }, [selectedChannel]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, typingSim]);

  const fetchMessages = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/chats?channelId=${selectedChannel}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (e) {
      console.error("Failed to fetch chat log:", e);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newText.trim()) return;

    const userMessagePayload = {
      channelId: selectedChannel,
      content: newText,
      senderName: "Ashish Roy", // Simulation default user
      senderAvatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
    };

    try {
      const res = await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userMessagePayload)
      });

      if (res.ok) {
        setNewText("");
        const data = await res.json();
        setMessages(data);

        // Update channels list last message representation
        setChannels(prev => prev.map(ch => {
          if (ch.id === selectedChannel) {
            return { ...ch, lastMsg: userMessagePayload.content, unread: false };
          }
          return ch;
        }));

        // Dynamic respond generator trigger
        triggerSimulatedTypingIndicator();
      }
    } catch (e) {
      console.error("Error dispatching message packet:", e);
    }
  };

  // Automated chatbot/peer simulator
  const triggerSimulatedTypingIndicator = () => {
    setTypingSim(true);
    setTimeout(async () => {
      setTypingSim(false);

      // Create simulated answers based on content
      const simReplies = [
        "Sounds like a good plan! Let's update the code tasks inside the Milestones tracker too.",
        "Got it! I will jump on the code branch right after our sync-up call.",
        "That's fantastic. Let's make sure we test the API endpoints inside the Developer Console before the presentation.",
        "Should we book a mentorship call with Nitin Kamath to confirm our database schema indices?",
        "Indeed. I will push the latest changes to the main repository fork!"
      ];
      const randomReply = simReplies[Math.floor(Math.random() * simReplies.length)];

      const botPayload = {
        channelId: selectedChannel,
        content: randomReply,
        senderName: selectedChannel.startsWith("dm_") 
          ? "Ayesha Qureshi (Stripe)" 
          : "Rahul Dev (Lead Dev)",
        senderAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
      };

      try {
        const res = await fetch("/api/chats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(botPayload)
        });
        if (res.ok) {
          const data = await res.json();
          setMessages(data);
          
          setChannels(prev => prev.map(ch => {
            if (ch.id === selectedChannel) {
              return { ...ch, lastMsg: botPayload.content };
            }
            return ch;
          }));
        }
      } catch (err) {
        console.error("Bots script reply error:", err);
      }
    }, 2000);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl text-slate-100 font-sans h-[600px] flex">
      {/* LEFT CHANNELS BAR */}
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
              <span className="text-[10px] font-mono text-slate-500 font-bold px-2.5 uppercase tracking-widest block">Channels</span>
              {channels.filter(c => c.type === "channel").map(ch => (
                <button 
                  key={ch.id} 
                  onClick={() => setSelectedChannel(ch.id)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between transition-colors cursor-pointer ${
                    selectedChannel === ch.id 
                      ? "bg-indigo-600/10 border border-indigo-500/20 text-indigo-300" 
                      : "text-slate-400 hover:bg-slate-900/60 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-1.5 truncate"><Hash className="w-3.5 h-3.5 text-slate-500" /> {ch.name}</span>
                  {ch.unread && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />}
                </button>
              ))}
            </div>

            {/* Direct Messages */}
            <div className="space-y-1">
              <span className="text-[10px] font-mono text-slate-505 font-bold px-2.5 uppercase tracking-widest block">Direct Members</span>
              {channels.filter(c => c.type === "dm").map(ch => (
                <button 
                  key={ch.id} 
                  onClick={() => setSelectedChannel(ch.id)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                    selectedChannel === ch.id 
                      ? "bg-indigo-600/10 border border-indigo-505/20 text-indigo-300" 
                      : "text-slate-400 hover:bg-slate-900/60 hover:text-white"
                  }`}
                >
                  <span className="flex items-center gap-1.5 truncate"><Circle className="w-2.5 h-2.5 text-emerald-500 fill-emerald-500 shrink-0" /> {ch.name}</span>
                  {ch.unread && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />}
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

      {/* RIGHT CHAT WINDOW AREA */}
      <div className="flex-1 flex flex-col justify-between bg-slate-900">
        
        {/* Header toolbar */}
        <div className="p-4 border-b border-slate-855 flex items-center justify-between bg-slate-905">
          <div className="flex items-center gap-2">
            <span className="text-sm font-extrabold text-white"># {channels.find(c => c.id === selectedChannel)?.name}</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>

          <button 
            onClick={fetchMessages}
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
                <div key={m.id} className="flex gap-3 text-xs flex-col md:flex-row">
                  <img src={m.senderAvatar} alt={m.senderName} className="w-8 h-8 rounded-full object-cover border border-slate-800 shrink-0" />
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-extrabold text-white">{m.senderName}</span>
                      <span className="text-[9px] text-slate-500 font-mono">{new Date(m.createdAt).toLocaleTimeString()}</span>
                    </div>
                    <p className="text-slate-300 mt-1.5 bg-slate-950/40 p-2.5 rounded-lg border border-slate-900 leading-relaxed max-w-lg">
                      {m.content}
                    </p>
                  </div>
                </div>
              ))}

              {/* Bot typing simulation overlay */}
              {typingSim && (
                <div className="flex gap-3 text-xs">
                  <div className="w-8 h-8 rounded-full bg-slate-800 flex justify-center items-center shrink-0 border border-slate-700 font-mono text-[9px] animate-pulse">
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
        <form onSubmit={handleSendMessage} className="p-4 border-t border-slate-850 bg-slate-950/45 flex gap-2">
          <input 
            type="text" 
            placeholder="Type your message, query or tech review here..." 
            value={newText} 
            onChange={(e) => setNewText(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-650 focus:outline-none focus:border-indigo-500 font-sans"
          />
          <button 
            type="submit" 
            className="px-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-colors shadow-lg flex items-center justify-center cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
