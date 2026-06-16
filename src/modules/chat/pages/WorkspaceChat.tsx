import React, { useState, useEffect, useRef } from "react";
import { 
  Users, Hash, Volume2, MessageSquare, Pin, ShieldCheck, 
  Send, Paperclip, Smile, Search, PhoneCall, Bell, MapPin, 
  ChevronDown, PlusCircle, HelpCircle, Flame, Star, ThumbsUp, PartyPopper,
  X, CornerDownRight, FileText, Download, ArrowRight, CornerRightDown, Menu,
  Check, Edit, Trash, Share2, ArrowLeft, ArrowUp, AlertCircle, Sparkles, CheckSquare,
  Play, Pause, RefreshCw, Layers, Zap, Info, Heart, Award, Plus
} from "lucide-react";

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
  createdAt?: string;
  reactions?: Record<string, number>;
  isPinned?: boolean;
  replyToMessageId?: string;
  isEdited?: boolean;
  isDeleted?: boolean;
  voiceNote?: boolean;
  attachment?: {
    name: string;
    size: string;
    type: string;
  };
}

interface ChatThread {
  id: string;
  title: string;
  avatar: string;
  type: "Connections" | "Teams" | "Projects" | "Mentors" | "Recruiters" | "Startup Teams" | "Direct" | "Project";
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  messages: ChatMessage[];
  senderId?: string;
  receiverId?: string;
}

interface ConnectionRequest {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderHeadline: string;
  receiverId: string;
  receiverName: string;
  receiverAvatar: string;
  receiverHeadline: string;
  note: string;
  status: "Pending" | "Accepted" | "Rejected" | "Withdrawn";
  sentDate: string;
}

interface WorkspaceChatProps {
  currentUser?: {
    id?: string;
    fullName?: string;
    avatarUrl?: string;
    role?: string;
    [key: string]: any;
  } | null;
}

export default function WorkspaceChat({ currentUser }: WorkspaceChatProps) {
  // Current user attributes
  const currentUserId = currentUser?.id || "student_ashish";
  const userFullName = currentUser?.fullName || "Ashish Ghadigaonkar";
  const userAvatarUrl = currentUser?.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80";
  const userRole = currentUser?.role || "Student Developer";

  // State hooks
  const [conversations, setConversations] = useState<ChatThread[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [connectionRequests, setConnectionRequests] = useState<ConnectionRequest[]>([]);
  const [acceptedConnections, setAcceptedConnections] = useState<any[]>([]);

  // Composer attachments and voice notes
  const [newText, setNewText] = useState("");
  const [replyTo, setReplyTo] = useState<ChatMessage | null>(null);
  const [selectedAttachment, setSelectedAttachment] = useState<{ name: string; size: string; type: string } | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [recordedVoicePayload, setRecordedVoicePayload] = useState<boolean>(false);

  // Search/Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [pinnedFilter, setPinnedFilter] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);

  // Typing simulator state
  const [typingUser, setTypingUser] = useState<string | null>(null);

  // Audio simulation state values
  const [activeVoicePlayId, setActiveVoicePlayId] = useState<string | null>(null);

  // Message Options Modal / Forward Modal Dialog
  const [messageToForward, setMessageToForward] = useState<ChatMessage | null>(null);
  const [showForwardDialog, setShowForwardDialog] = useState(false);

  // Connection block state triggers
  const [connBlockNote, setConnBlockNote] = useState("");
  const [blockActionLoading, setBlockActionLoading] = useState(false);

  // Sidebar Toggles for mobile
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(false);
  const [rightSidebarOpen, setRightSidebarOpen] = useState(false);

  // Inline Editing
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");

  // New Message Flow State
  const [isNewMessageMode, setIsNewMessageMode] = useState(false);
  const [newMessageSearch, setNewMessageSearch] = useState("");
  const [sendingInviteUserId, setSendingInviteUserId] = useState<string | null>(null);
  const [inviteNoteText, setInviteNoteText] = useState("");

  const chatEndRef = useRef<HTMLDivElement>(null);
  const recordingTimerRef = useRef<any>(null);

  // Unified directory containing all peers, project, team members and mentors for LinkedIn style network interaction
  const ALL_PEOPLE_DIRECTORY = [
    { id: "user_priya", fullName: "Priya Patel", role: "Fullstack Architect", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80", type: "Connections", group: "Connection", status: "online" },
    { id: "user_rohan", fullName: "Rohan Sharma", role: "Backend Architect", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80", type: "Teams", group: "Team member", status: "online" },
    { id: "user_sneha", fullName: "Sneha Nair", role: "UI/UX Designer", avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150&q=80", type: "Projects", group: "Project member", status: "online" },
    { id: "user_piyush", fullName: "Piyush Mehta", role: "System Lead Engineer", avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=150&h=150&q=80", type: "Connections", group: "Connection", status: "offline" },
    { id: "ment_1", fullName: "Nitin Kamath", role: "Google Cloud Advocate", avatarUrl: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=150&h=150&q=80", type: "Mentors", group: "Mentor", status: "online" },
    { id: "ment_ayesha", fullName: "Ayesha Qureshi", role: "Stripe Operations Director", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150&q=80", type: "Mentors", group: "Mentor", status: "offline" },
    { id: "recruiter_sarah", fullName: "Sarah Jenkins", role: "Google Recruiting Lead", avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&h=150&q=80", type: "Recruiters", group: "Recruiter", status: "online" },
    { id: "startup_aditya", fullName: "Aditya Sen", role: "Founder, EtherPulse", avatarUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=150&h=150&q=80", type: "Startup Teams", group: "Startup Founder", status: "offline" }
  ];

  const peerConnectionsList = ALL_PEOPLE_DIRECTORY;

  const getUserConnectionStatus = (userId: string) => {
    // Current seed state for defaults: Priya Patel, Rohan Sharma, Sneha Nair, Nitin Kamath are connected by design so conversations exist
    if (userId === "user_priya" || userId === "user_rohan" || userId === "user_sneha" || userId === "ment_1" || userId === "recruiter_sarah" || userId === "startup_aditya") {
      return "Connected";
    }

    const isConn = acceptedConnections.some(
      (c: any) => (c.user1Id === currentUserId && c.user2Id === userId) || (c.user2Id === currentUserId && c.user1Id === userId)
    );
    if (isConn) return "Connected";

    const req = connectionRequests.find(
      (r: any) =>
        (r.senderId === currentUserId && r.receiverId === userId) ||
        (r.senderId === userId && r.receiverId === currentUserId)
    );

    if (req) {
      if (req.status === "Accepted") return "Connected";
      if (req.status === "Pending") {
        return req.senderId === currentUserId ? "Requested_Out" : "Requested_In";
      }
      return req.status; // Rejected, Withdrawn, etc
    }

    return "None";
  };

  // Active top-level selection details
  const activeChatThread = conversations.find(c => c.id === selectedChannel);

  // Sync route URL pathname to show either "/messages" or "/messages/:conversationId"
  useEffect(() => {
    const route = selectedChannel ? `/messages/${selectedChannel}` : "/messages";
    window.history.pushState(null, "", route);
  }, [selectedChannel]);

  // Handle auto-triggering chat peer requested by Profiles
  useEffect(() => {
    fetchConversations();
    fetchConnectionsAndRequests();

    const targetPeerId = localStorage.getItem("selectedChatPeerId");
    if (targetPeerId) {
      localStorage.removeItem("selectedChatPeerId");
      handleSelectContact(targetPeerId);
    }

    // Long poll every 6 seconds to fetch new items safely is standard in web container setups
    const timer = setInterval(() => {
      fetchConversations(true);
      fetchConnectionsAndRequests(true);
    }, 6000);

    return () => {
      clearInterval(timer);
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [conversations, typingUser, selectedChannel]);

  // Handle typing trigger simulator on switching channel
  useEffect(() => {
    if (!selectedChannel) return;
    setTypingUser(null);
    const activeCh = conversations.find(c => c.id === selectedChannel);
    if (!activeCh) return;

    // Simulate passive typing
    const delay = Math.random() * 4000 + 1500;
    const typingTimer = setTimeout(() => {
      if (activeCh.type === "Connections") {
        setTypingUser("Priya Patel");
      } else if (activeCh.type === "Projects") {
        setTypingUser("Rohan Sharma");
      } else if (activeCh.type === "Teams") {
        setTypingUser("Ayesha Qureshi");
      }
      
      const stopTimer = setTimeout(() => {
        setTypingUser(null);
      }, 3500);

      return () => clearTimeout(stopTimer);
    }, delay);

    return () => clearTimeout(typingTimer);
  }, [selectedChannel]);

  // Voice note timer effect duration
  useEffect(() => {
    if (isRecording) {
      recordingTimerRef.current = setInterval(() => {
        setRecordingSeconds(sec => sec + 1);
      }, 1000);
    } else {
      clearInterval(recordingTimerRef.current);
      setRecordingSeconds(0);
    }
    return () => clearInterval(recordingTimerRef.current);
  }, [isRecording]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchConversations = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch("/api/messages/conversations");
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch (e) {
      console.warn("Muted background polling: ", e);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const fetchConnectionsAndRequests = async (silent = false) => {
    try {
      const res = await fetch("/api/connections");
      if (res.ok) {
        const data = await res.json();
        setConnectionRequests(data.requests || []);
        setAcceptedConnections(data.connections || []);
      }
    } catch (err) {
      console.warn("Connections read feedback bypassed:", err);
    }
  };

  const triggerManualSync = async () => {
    setIsSyncing(true);
    await fetchConversations();
    await fetchConnectionsAndRequests();
    setTimeout(() => setIsSyncing(false), 850);
  };

  // Get current peer connection eligibility
  const getConnectionStatus = () => {
    if (!activeChatThread) return { status: "None", isConnected: true };
    if (activeChatThread.type !== "Connections") return { status: "Connected", isConnected: true };

    const targetPeerId = activeChatThread.receiverId || (activeChatThread.id.includes("priya") ? "user_priya" : null);
    if (!targetPeerId) return { status: "Connected", isConnected: true };

    const isConn = acceptedConnections.some(
      (c: any) => (c.user1Id === currentUserId && c.user2Id === targetPeerId) || (c.user1Id === targetPeerId && c.user2Id === currentUserId)
    ) || targetPeerId === "user_priya" || targetPeerId === "user_rohan"; 

    if (isConn) {
      return { status: "Connected", isConnected: true };
    }

    const pendingReq = connectionRequests.find(
      (r: any) =>
        r.status === "Pending" &&
        ((r.senderId === currentUserId && r.receiverId === targetPeerId) ||
          (r.senderId === targetPeerId && r.receiverId === currentUserId))
    );

    if (pendingReq) {
      return { status: "Pending", isConnected: false, request: pendingReq };
    }

    return { status: "None", isConnected: false, targetUserId: targetPeerId };
  };

  const handleSendConnectionRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    const connState = getConnectionStatus();
    const targetUid = connState.targetUserId || "user_priya";

    setBlockActionLoading(true);
    try {
      const res = await fetch("/api/connections/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          receiverId: targetUid,
          note: connBlockNote
        })
      });

      if (res.ok) {
        setConnBlockNote("");
        await fetchConnectionsAndRequests();
        await fetchConversations();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setBlockActionLoading(false);
    }
  };

  const handleAcceptInvite = async (requestId: string) => {
    try {
      const res = await fetch("/api/connections/accept", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId })
      });
      if (res.ok) {
        await fetchConnectionsAndRequests();
        await fetchConversations();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleRejectInvite = async (requestId: string) => {
    try {
      const res = await fetch("/api/connections/reject", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId })
      });
      if (res.ok) {
        await fetchConnectionsAndRequests();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChannel) return;
    if (!newText.trim() && !selectedAttachment && !recordedVoicePayload) return;

    const attachmentPayload = selectedAttachment ? selectedAttachment : undefined;
    const isVoice = recordedVoicePayload ? true : undefined;

    const payload = {
      conversationId: selectedChannel,
      content: isVoice ? "Voice Note Message" : newText,
      replyToMessageId: replyTo?.id || undefined,
      attachments: attachmentPayload ? [attachmentPayload] : undefined
    };

    try {
      const res = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setNewText("");
        setReplyTo(null);
        setSelectedAttachment(null);
        setRecordedVoicePayload(false);
        await fetchConversations(true);

        setTimeout(() => {
          scrollToBottom();
        }, 100);
      }
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const handleSendMessageReaction = async (messageId: string, emoji: string) => {
    if (!selectedChannel) return;
    try {
      const res = await fetch("/api/messages/reaction", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageId,
          conversationId: selectedChannel,
          reaction: emoji
        })
      });
      if (res.ok) {
        await fetchConversations(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    if (!selectedChannel) return;
    try {
      const res = await fetch("/api/messages/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageId,
          conversationId: selectedChannel
        })
      });
      if (res.ok) {
        await fetchConversations(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleTogglePinMessage = async (messageId: string, currentPinStatus?: boolean) => {
    if (!selectedChannel) return;
    try {
      const res = await fetch("/api/messages/pin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageId,
          conversationId: selectedChannel,
          isPinned: !currentPinStatus
        })
      });
      if (res.ok) {
        await fetchConversations(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartRecording = () => {
    setIsRecording(true);
    setRecordedVoicePayload(false);
  };

  const handleStopRecording = () => {
    setIsRecording(false);
    setRecordedVoicePayload(true);
    setNewText("[Voice Note: Played 0:12]");
  };

  const handleCancelRecording = () => {
    setIsRecording(false);
    setRecordedVoicePayload(false);
    setNewText("");
  };

  const handleSimulateAttachmentSelect = (type: "png" | "pdf" | "zip") => {
    if (type === "png") {
      setSelectedAttachment({ name: "Figma-Grids-Layout-Proposal.png", size: "1.4 MB", type: "image/png" });
    } else if (type === "pdf") {
      setSelectedAttachment({ name: "MERN-Project-Architecture.pdf", size: "3.2 MB", type: "application/pdf" });
    } else {
      setSelectedAttachment({ name: "Production-Build-Configs.zip", size: "5.8 MB", type: "application/zip" });
    }
  };

  const handleForwardMessage = async (targetThreadId: string) => {
    if (!messageToForward) return;
    try {
      const res = await fetch("/api/messages/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: targetThreadId,
          content: `[Forwarded Message] : ${messageToForward.content}`
        })
      });

      if (res.ok) {
        setShowForwardDialog(false);
        setMessageToForward(null);
        setSelectedChannel(targetThreadId);
        await fetchConversations();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleStartEditing = (msg: ChatMessage) => {
    setEditingMessageId(msg.id);
    setEditingContent(msg.content);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedChannel || !editingMessageId || !editingContent.trim()) return;

    try {
      const res = await fetch("/api/messages/edit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messageId: editingMessageId,
          conversationId: selectedChannel,
          content: editingContent
        })
      });

      if (res.ok) {
        setEditingMessageId(null);
        setEditingContent("");
        await fetchConversations(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectContact = async (peerId: string) => {
    setLoading(true);
    try {
      const res = await fetch("/api/messages/conversations/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ peerId })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.chat) {
          // Refresh list and select the conversation
          const conversationsRes = await fetch("/api/messages/conversations");
          if (conversationsRes.ok) {
            const list = await conversationsRes.json();
            setConversations(list);
          }
          setSelectedChannel(data.chat.id);
          setIsNewMessageMode(false);
          setNewMessageSearch("");
        }
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Could not start thread with this peer contact.");
      }
    } catch (err) {
      console.warn(err);
    } finally {
      setLoading(false);
    }
  };

  // Filter conversations by category tab and search input
  const filteredThreads = conversations.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (t.lastMessage && t.lastMessage.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    const isOldDirect = t.type === "Direct";
    const isOldProject = t.type === "Project";

    if (activeCategory === "All") return true;
    if (activeCategory === "Connections") {
      return (t.type === "Connections" || isOldDirect);
    }
    if (activeCategory === "Teams") {
      return t.type === "Teams";
    }
    if (activeCategory === "Projects") {
      return (t.type === "Projects" || isOldProject);
    }
    if (activeCategory === "Mentors") {
      return t.type === "Mentors";
    }
    if (activeCategory === "Unread") {
      return t.unreadCount > 0;
    }
    return true;
  });

  // Allowed new message connections logic (Priya Patel, Rohan Sharma, Sneha Nair, Piyush Mehta)
  const availableConnectionPeers = peerConnectionsList.filter(peer => {
    // Only search matches by typing
    const matches = peer.fullName.toLowerCase().includes(newMessageSearch.toLowerCase()) || 
                    peer.role.toLowerCase().includes(newMessageSearch.toLowerCase());
    return matches;
  });

  // Calculate peer members
  const activeMembersList = [
    { name: "Priya Patel", role: "Fullstack Lead", status: "online", text: "Excited with AWS deployment" },
    { name: "Rohan Sharma", role: "Backend Architect", status: "online", text: "Optimizing telemetry loops" },
    { name: "Sneha Nair", role: "UX Designer", status: "online", text: "Tweak fonts to Outfit" },
    { name: "Ayesha Qureshi", role: "Stripe Ops", status: "offline", text: "Sleeping" }
  ];

  const totalUnreadMessages = conversations.reduce((acc, c) => acc + (c.unreadCount || 0), 0);

  return (
    <div className="bg-slate-900 border border-slate-850 rounded-2xl overflow-hidden shadow-2xl text-slate-100 font-sans h-[680px] flex relative" id="workspace-chat-pane">
      
      {/* MOBILE BACKDROP FOR LEFT MENU */}
      {leftSidebarOpen && (
        <div 
          className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs z-30 md:hidden transition-opacity duration-200 cursor-pointer"
          onClick={() => setLeftSidebarOpen(false)}
        />
      )}

      {/* 1. SEAMLESS UNIFIED INBOX SIDEBAR */}
      <div className={`${(!selectedChannel && !isNewMessageMode) || leftSidebarOpen ? "flex" : "hidden md:flex"} w-full md:w-80 bg-slate-950 border-r border-slate-850 flex-col shrink-0 text-left select-none absolute md:static inset-y-0 left-0 z-40 md:z-auto transition-transform duration-250 md:translate-x-0 ${(!selectedChannel && !isNewMessageMode) ? "translate-x-0" : (leftSidebarOpen ? "translate-x-0" : "-translate-x-full")}`}>
        
        {/* Workspace Hub Banner with LinkedIn-style New Message triggers */}
        <div className="p-4 border-b border-slate-855 flex items-center justify-between hover:bg-slate-900/30 cursor-default">
          <div className="flex items-center gap-1.5 min-w-0">
            <span className="w-2.1 h-2.1 rounded-full bg-indigo-500 shrink-0" />
            <span className="text-xs font-sans font-extrabold text-white tracking-wider truncate uppercase">
              Inbox
            </span>
            {totalUnreadMessages > 0 && (
              <span className="text-[9px] bg-indigo-650/30 border border-indigo-500/20 text-indigo-400 font-mono px-1.5 py-0.5 rounded-full font-bold ml-1">
                {totalUnreadMessages} unread
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              type="button" 
              onClick={() => {
                setIsNewMessageMode(true);
                setSelectedChannel(null);
                setLeftSidebarOpen(false);
              }}
              className="p-1 px-1.5 bg-indigo-600/10 hover:bg-indigo-600/30 border border-indigo-500/20 text-indigo-400 hover:text-white rounded-lg transition-all cursor-pointer flex items-center gap-1.5 text-[9.5px] font-mono font-bold font-sans"
              title="Start a new peer chat"
            >
              <Plus className="w-3.5 h-3.5 text-indigo-400" />
              <span>Compose</span>
            </button>

            <button 
              type="button" 
              onClick={triggerManualSync} 
              disabled={isSyncing}
              className="p-1 text-slate-505 hover:text-white rounded transition-colors cursor-pointer"
              title="Force sync inbox"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? "animate-spin text-indigo-400" : "text-slate-400"}`} />
            </button>
          </div>
        </div>

        {/* Search Bar matching both existing chats and accepted connections */}
        <div className="p-2.5 border-b border-slate-855 bg-slate-955/35">
          <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-slate-400">
            <Search className="w-3.5 h-3.5 shrink-0" />
            <input 
              type="text" 
              placeholder="Search chats, teams, peers..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent text-[10.5px] outline-none text-white w-full placeholder-slate-500"
            />
          </div>
        </div>

        {/* 6 requested category badges tags inside unified inbox list */}
        <div className="flex gap-1 overflow-x-auto p-2.5 scrollbar-none border-b border-slate-855 shrink-0 select-none bg-slate-950">
          {["All", "Connections", "Teams", "Projects", "Mentors", "Unread"].map(catName => (
            <button
              key={catName}
              onClick={() => setActiveCategory(catName)}
              className={`px-2 py-1 rounded-md text-[9px] font-mono font-bold snap-start shrink-0 cursor-pointer transition-all ${
                activeCategory === catName 
                  ? "bg-indigo-600/20 border border-indigo-400/40 text-indigo-300" 
                  : "bg-slate-900 border border-slate-855 text-slate-500 hover:text-slate-350"
              }`}
            >
              {catName}
            </button>
          ))}
        </div>

        {/* Dynamic Conversations List Stream */}
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          <div className="flex justify-between items-center px-1 mb-1">
            <span className="text-[9px] font-mono text-indigo-400/60 font-bold uppercase tracking-wider block">
              {activeCategory} Threads
            </span>
          </div>

          {filteredThreads.length === 0 ? (
            <div className="text-center py-10">
              <MessageSquare className="w-8 h-8 text-slate-650 mx-auto opacity-35 mb-1" />
              <p className="text-[10px] text-slate-500 italic">No threads found</p>
              <p className="text-[9px] text-slate-605 mt-1">Check another category tag</p>
            </div>
          ) : (
            filteredThreads.map(chat => {
              const isActive = selectedChannel === chat.id;
              
              // Map friendly label
              const readableType = chat.type === "Project" ? "Projects" : (chat.type === "Direct" ? "Connections" : chat.type);
              
              // Map badge color theme
              let badgeColor = "text-emerald-400 border-emerald-500/20 bg-emerald-500/5";
              if (chat.type === "Teams") badgeColor = "text-sky-400 border-sky-500/20 bg-sky-505/5";
              if (chat.type === "Projects" || chat.type === "Project") badgeColor = "text-indigo-450 border-indigo-500/20 bg-indigo-505/5";
              if (chat.type === "Mentors") badgeColor = "text-amber-400 border-amber-500/20 bg-amber-505/5";
              if (chat.type === "Recruiters") badgeColor = "text-purple-400 border-purple-500/20 bg-purple-505/5";
              if (chat.type === "Startup Teams") badgeColor = "text-rose-400 border-rose-500/20 bg-rose-505/5";

              // Fake Online state
              const isPeerOnline = chat.type === "Connections" || chat.id === "proj_1" || chat.id.includes("priya") || chat.id.includes("rohan");

              return (
                <div
                  key={chat.id}
                  onClick={() => {
                    setSelectedChannel(chat.id);
                    setIsNewMessageMode(false);
                    setLeftSidebarOpen(false);
                  }}
                  className={`p-2.5 rounded-xl cursor-pointer transition-all text-left flex gap-2.5 items-start border relative ${
                    isActive 
                      ? "bg-slate-900 border-indigo-500/30 text-white shadow" 
                      : "border-transparent text-slate-300 hover:bg-slate-905/40 hover:text-white"
                  }`}
                >
                  {/* Status Ring Avatar */}
                  <div className="w-8.5 h-8.5 rounded-xl shrink-0 overflow-hidden relative border border-slate-800">
                    <img src={chat.avatar} alt="logo" className="w-full h-full object-cover" />
                    {isPeerOnline && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border border-slate-950" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1 leading-snug">
                    <div className="flex justify-between items-center">
                      <h4 className="font-bold text-[11px] truncate">{chat.title}</h4>
                      <span className="text-[8px] font-mono text-slate-500">{chat.lastMessageTime?.startsWith("2026") ? "Just now" : chat.lastMessageTime}</span>
                    </div>
                    
                    <p className="text-[10px] text-slate-450 line-clamp-1 truncate pr-2 mt-0.5 font-sans leading-relaxed">
                      {chat.lastMessage || "Click to open peer message logs..."}
                    </p>
                    
                    {/* Category Label Badge */}
                    <span className={`inline-block mt-1 px-1.5 py-0.5 border rounded font-mono text-[7px] uppercase font-extrabold tracking-wider ${badgeColor}`}>
                      {readableType === "Startup Teams" ? "Startups" : readableType}
                    </span>
                  </div>

                  {/* Unread badge accounts */}
                  {chat.unreadCount > 0 && !isActive && (
                    <span className="absolute right-2.5 top-8 w-2 h-2 bg-indigo-550 rounded-full ring-2 ring-indigo-500/20 animate-pulse" />
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Verified User Account Footer */}
        <div className="p-3.5 bg-slate-955 border-t border-slate-855 flex gap-2.5 items-center shrink-0">
          <img src={userAvatarUrl} alt="me" className="w-8 h-8 rounded-full border border-slate-800 object-cover shrink-0" referrerPolicy="no-referrer" />
          <div className="text-[10px] truncate leading-tight flex-1 text-left min-w-0">
            <strong className="text-white block font-sans truncate">{userFullName}</strong>
            <span className="text-[9px] text-[#22c55e] font-mono italic flex items-center gap-0.5">
              ● Live • {userRole}
            </span>
          </div>
        </div>

      </div>

      {/* 2. CORE CONVERSATION SCREEN PANE */}
      <div className={`${selectedChannel || isNewMessageMode ? "flex" : "hidden md:flex"} flex-1 flex-col bg-slate-900/40 relative overflow-hidden`}>
        
        {isNewMessageMode ? (
          /* NEW MESSAGE MODE PANEL */
          <div className="flex-1 flex flex-col relative bg-slate-900">
            {/* Header specifying New Message */}
            <div className="h-14 border-b border-slate-850 px-4 flex items-center text-left justify-between shrink-0 bg-slate-950/40">
              <div className="flex items-center gap-2">
                <button onClick={() => setIsNewMessageMode(false)} className="text-slate-450 hover:text-white font-mono text-xs pr-1">← Cancel</button>
                <div className="w-px h-4 bg-slate-800 mx-1" />
                <h3 className="font-bold text-white text-xs">New Message</h3>
              </div>
              <span className="text-[9px] font-mono text-indigo-400">Accepted peers only</span>
            </div>

            {/* Address bar for peer connections lookup */}
            <div className="p-4 border-b border-slate-850 bg-slate-900 flex items-center gap-3">
              <span className="text-xs text-slate-400 font-medium font-sans">To:</span>
              <div className="flex-1 relative">
                <input 
                  type="text"
                  placeholder="Type name or headline of accepted student contact..."
                  value={newMessageSearch}
                  onChange={(e) => setNewMessageSearch(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 hover:border-slate-700/60 focus:border-indigo-500/40 rounded-xl px-3.5 py-1.5 text-xs text-slate-100 outline-none"
                  autoFocus
                />
              </div>
            </div>

            {/* Search items listing matches */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2 text-left">
              <span className="text-[9px] font-mono font-bold text-slate-500 uppercase tracking-widest block mb-2 px-1">
                Matched campus connection peers ({availableConnectionPeers.length})
              </span>

              {availableConnectionPeers.length === 0 ? (
                <div className="p-8 text-center text-slate-500 italic text-xs">
                  No accepted campus peer connections match "{newMessageSearch}". Verify connection requests on the Professional Network tab.
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2 max-w-xl">
                  {availableConnectionPeers.map(peer => (
                    <div 
                      key={peer.id}
                      onClick={() => handleSelectContact(peer.id)}
                      className="p-3 bg-slate-950 hover:bg-indigo-950/20 border border-slate-850 hover:border-indigo-550/30 rounded-xl cursor-pointer transition-all flex justify-between items-center"
                    >
                      <div className="flex gap-3 items-center min-w-0">
                        <img src={peer.avatarUrl} alt="peer" className="w-9 h-9 rounded-xl object-cover shrink-0 border border-slate-850" />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-white font-sans">{peer.fullName}</h4>
                          <span className="text-[10px] text-slate-400 font-mono truncate block">{peer.role}</span>
                        </div>
                      </div>
                      
                      <button className="px-3 py-1 bg-indigo-650 hover:bg-indigo-600 font-mono text-[9.5px] text-white rounded-lg font-bold">
                        Message Chat
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Instructions detail card */}
              <div className="p-4 bg-slate-950/60 border border-slate-850 rounded-2xl max-w-xl space-y-2 mt-6">
                <h5 className="text-[10px] font-mono text-indigo-400 font-extrabold uppercase tracking-wide">✦ Campus Collaboration Policy</h5>
                <p className="text-[10px] text-slate-450 leading-relaxed font-sans">
                  Only student peers with verified, mutually accepted connections are allowed to exchange direct peer-to-peer workspace chats. This helps guarantee student security and maintains a high-quality collaborative network.
                </p>
              </div>
            </div>
          </div>
        ) : activeChatThread ? (
          /* CONVERSATION STREAM PRESENT SATE */
          <div className="flex-1 flex flex-col min-h-0 relative">
            {/* Chat Title Header Section */}
            <div className="h-14 border-b border-slate-850 px-4 flex items-center justify-between text-left shrink-0 bg-slate-950/40">
              <div className="flex items-center gap-2.5 min-w-0">
                <button 
                  type="button"
                  onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
                  className="p-1.5 -ml-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white md:hidden transition-colors"
                  title="Toggle inbox"
                >
                  <Menu className="w-4 h-4" />
                </button>

                <div className="w-7.5 h-7.5 rounded-lg overflow-hidden shrink-0 border border-slate-800 relative">
                  <img src={activeChatThread.avatar} alt="ava" className="w-full h-full object-cover" />
                </div>

                <div className="min-w-0 leading-tight">
                  <h3 className="font-bold text-white text-xs truncate">
                    {activeChatThread.title}
                  </h3>
                  <span className="text-[8.5px] font-mono text-slate-450 uppercase tracking-widest block mt-0.5">
                    Category: {activeChatThread.type === "Project" ? "Projects" : activeChatThread.type} Thread
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3 text-slate-400">
                <button 
                  onClick={() => setPinnedFilter(!pinnedFilter)} 
                  title="See pinned messages"
                  className={`p-1.5 rounded-lg border transition-all relative cursor-pointer ${pinnedFilter ? "bg-indigo-600/30 border-indigo-500 text-white" : "border-slate-800 text-slate-450 hover:text-white hover:bg-slate-800"}`}
                >
                  <Pin className="w-3.5 h-3.5" />
                  {activeChatThread.messages?.filter(m => m.isPinned).length > 0 && (
                    <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  )}
                </button>

                <button 
                  onClick={() => setRightSidebarOpen(!rightSidebarOpen)}
                  title="Toggle server participants"
                  className={`p-1.5 rounded-lg border transition-all cursor-pointer ${rightSidebarOpen ? "bg-indigo-600/30 border-indigo-500 text-white" : "border-slate-800 text-slate-455 hover:text-white hover:bg-slate-800"}`}
                >
                  <Users className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* PINNED PANEL EXTREMELY VISUAL DROPDOWN BANNER */}
            {pinnedFilter && (
              <div className="absolute top-14 left-0 right-0 max-h-48 overflow-y-auto bg-slate-955/95 border-b border-slate-850 z-20 p-3.5 shadow-xl text-left text-xs font-sans backdrop-blur-md">
                <div className="flex justify-between items-center border-b border-slate-850 pb-1.5 mb-2">
                  <span className="font-mono text-amber-400 font-bold tracking-widest flex items-center gap-1">
                    <Pin className="w-3.5 h-3.5 shrink-0" /> Pinned Announcements ({activeChatThread.messages?.filter(m => m.isPinned).length || 0})
                  </span>
                  <button onClick={() => setPinnedFilter(false)} className="text-slate-400 hover:text-white cursor-pointer">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-2">
                  {activeChatThread.messages?.filter(msg => msg.isPinned).map(msg => (
                    <div key={msg.id} className="p-2 border border-slate-850 bg-slate-900/60 rounded-lg flex justify-between items-center gap-2">
                      <div className="min-w-0">
                        <strong className="text-indigo-300 block font-mono text-[9.5px]">{msg.senderName}</strong>
                        <p className="text-slate-350 mt-0.5 break-words">"{msg.content}"</p>
                      </div>
                      <button onClick={() => handleTogglePinMessage(msg.id, true)} className="text-[8.5px] text-red-400 hover:underline shrink-0">Unpin</button>
                    </div>
                  ))}
                  {(!activeChatThread.messages || activeChatThread.messages.filter(msg => msg.isPinned).length === 0) && (
                    <p className="text-slate-500 italic text-center py-2">No pinned announcements found inside this channel.</p>
                  )}
                </div>
              </div>
            )}

            {/* Chat Logs Window Panel */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {loading ? (
                <div className="flex flex-col justify-center items-center h-full space-y-1">
                  <RefreshCw className="animate-spin h-6 w-6 text-indigo-500" />
                  <span className="text-[10px] text-slate-500 font-mono">Decrypting secure channel message feeds...</span>
                </div>
              ) : (
                <div className="space-y-4 text-left font-sans">
                  
                  {/* Header card introducing conversation */}
                  <div className="p-4 bg-gradient-to-tr from-slate-950/70 to-indigo-950/20 border border-slate-850 rounded-2xl text-center max-w-md mx-auto space-y-2 py-5 shadow-lg select-none">
                    <img src={activeChatThread.avatar} alt="logo" className="w-12 h-12 rounded-2xl border border-slate-805 object-cover mx-auto" />
                    <div>
                      <h4 className="font-sans font-extrabold text-[12.5px] text-white">
                        {activeChatThread.title}
                      </h4>
                      <p className="text-[10px] text-slate-450 mt-1 font-mono uppercase tracking-widest">
                        SkillCollab Workspace Channel Thread
                      </p>
                    </div>
                    <div className="bg-slate-900/80 p-2.5 rounded-xl text-[9.5px] text-slate-300 space-y-1 leading-normal">
                      <span className="text-indigo-400 font-bold block">🛡️ Collaboration Scoped Sandbox</span>
                      <span>Peer-to-peer verification safeguards content logs, text editing outputs, message reactions, links sharing, and document deliveries.</span>
                    </div>
                  </div>

                  {/* Message List Loop */}
                  {activeChatThread.messages && activeChatThread.messages.map(msg => {
                    const isMyMessage = msg.senderId === currentUserId;
                    const isEdited = msg.isEdited;
                    const isDeleted = msg.isDeleted;
                    const parentMsg = msg.replyToMessageId ? activeChatThread.messages.find(m => m.id === msg.replyToMessageId) : null;
                    const isEditingThis = editingMessageId === msg.id;

                    return (
                      <div key={msg.id} className="group relative flex gap-3 hover:bg-slate-850/25 p-2 rounded-xl transition-all">
                        
                        <img src={msg.senderAvatar} alt="user" className="w-9 h-9 rounded-xl object-cover shrink-0 border border-slate-850" referrerPolicy="no-referrer" />

                        <div className="text-xs space-y-1 flex-1 min-w-0 pr-12">
                          <div className="flex items-center gap-2">
                            <strong className="text-white font-bold text-xs">{msg.senderName}</strong>
                            <span className="text-[8.5px] font-mono text-slate-500">{msg.timestamp || "Just Now"}</span>
                            
                            {msg.isPinned && (
                              <span className="bg-amber-400/5 text-amber-400 text-[8px] font-mono font-bold px-1 select-none border border-amber-400/25 rounded flex items-center gap-0.5">
                                <Pin className="w-2 h-2" /> PINNED
                              </span>
                            )}

                            {isEdited && !isDeleted && (
                              <span className="text-slate-600 font-mono text-[8.5px] font-thin select-none">(edited)</span>
                            )}
                          </div>

                          {/* Replied box helper */}
                          {parentMsg && (
                            <div className="border-l-2 border-indigo-550 bg-slate-950/50 p-2 rounded-lg text-[10px] text-slate-400 mb-1 max-w-sm flex items-center gap-1 pr-4">
                              <CornerDownRight className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                              <div className="truncate">
                                <strong className="text-slate-350 text-[9px] block">Replying to {parentMsg.senderName}</strong>
                                <span className="italic block truncate">"{parentMsg.content}"</span>
                              </div>
                            </div>
                          )}

                          {isEditingThis ? (
                            <form onSubmit={handleSaveEdit} className="mt-1 flex gap-2 items-center">
                              <input 
                                type="text" 
                                value={editingContent}
                                onChange={(e) => setEditingContent(e.target.value)}
                                className="flex-1 bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs text-white"
                              />
                              <button type="submit" className="p-1.5 bg-indigo-600 rounded text-white text-[9.5px]">Save</button>
                              <button type="button" onClick={() => setEditingMessageId(null)} className="p-1.5 bg-slate-800 rounded text-slate-450 text-[9.5px]">Cancel</button>
                            </form>
                          ) : (
                            <div className="space-y-1.5">
                              {isDeleted ? (
                                <p className="text-slate-605 italic font-mono text-[10.5px]">This message has been deleted.</p>
                              ) : (
                                <p className="text-slate-300 leading-relaxed font-sans font-medium text-[11px] break-words whitespace-pre-wrap">{msg.content}</p>
                              )}

                              {/* Attachment Box rendered if present */}
                              {msg.attachment && (
                                <div className="p-2.5 bg-slate-950 border border-slate-850 rounded-xl max-w-xs flex gap-3 items-center text-left">
                                  <FileText className="w-7 h-7 text-indigo-400 shrink-0" />
                                  <div className="min-w-0 flex-1">
                                    <strong className="text-white block font-mono text-[9.5px] truncate">{msg.attachment.name}</strong>
                                    <span className="text-[8.5px] text-slate-500 font-mono block">{msg.attachment.size} • Secured</span>
                                  </div>
                                  <button 
                                    onClick={() => alert(`Downloading spec ${msg.attachment?.name} from secure sandbox...`)}
                                    className="p-1.5 bg-slate-900 border border-slate-800 hover:text-indigo-400 rounded-lg text-slate-450 transition-colors"
                                  >
                                    <Download className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              )}

                              {/* Simulated Voice note playback bar */}
                              {msg.content.includes("Voice Note") && (
                                <div className="p-2 bg-slate-950 border border-slate-850 rounded-xl max-w-sm flex items-center gap-3">
                                  <button 
                                    onClick={() => setActiveVoicePlayId(activeVoicePlayId === msg.id ? null : msg.id)}
                                    className="p-2 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 rounded-full transition-colors shrink-0"
                                  >
                                    {activeVoicePlayId === msg.id ? <Pause className="w-4 h-4 fill-indigo-300 text-indigo-300" /> : <Play className="w-4 h-4 fill-indigo-300 text-indigo-300 ml-0.5" />}
                                  </button>
                                  
                                  <div className="flex-1 space-y-1">
                                    <div className="text-[9px] font-mono text-slate-455 flex justify-between">
                                      <span>{activeVoicePlayId === msg.id ? "Playing memorandum note..." : "Private Speech note"}</span>
                                      <span>0:12 Duration</span>
                                    </div>
                                    <div className="flex items-center gap-0.5 h-3">
                                      {[2, 4, 3, 5, 2, 8, 4, 3, 2, 6, 7, 3, 5, 2, 4, 3, 6, 8, 4, 2, 1, 5, 4, 2].map((h, i) => (
                                        <span 
                                          key={i} 
                                          className={`w-0.5 bg-indigo-500 rounded-full ${activeVoicePlayId === msg.id ? "animate-pulse" : "opacity-40"}`} 
                                          style={{ height: `${h * 1.5}px` }}
                                        />
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Reactions list with counts */}
                          {msg.reactions && Object.entries(msg.reactions).length > 0 && !isDeleted && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {Object.entries(msg.reactions).map(([emoji, count]) => {
                                if (count === 0) return null;
                                return (
                                  <button
                                    key={emoji}
                                    onClick={() => handleSendMessageReaction(msg.id, emoji)}
                                    className="px-2 py-0.5 bg-slate-950 hover:bg-slate-850 border border-slate-850 rounded-md text-[10px] font-mono font-bold text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer transition-colors"
                                  >
                                    <span>{emoji} {count}</span>
                                  </button>
                                );
                              })}
                            </div>
                          )}
                        </div>

                        {/* LinkedIn-style interactions hover header bar */}
                        {!isDeleted && (
                          <div className="absolute top-1.5 right-2 hidden group-hover:flex items-center gap-1 bg-slate-955 border border-slate-805 rounded-lg p-1 shadow-xl z-15 animate-fade-in select-none">
                            <button onClick={() => handleSendMessageReaction(msg.id, "👍")} title="React 👍" className="p-1 hover:bg-slate-800 text-[10.5px] rounded cursor-pointer">👍</button>
                            <button onClick={() => handleSendMessageReaction(msg.id, "🚀")} title="React 🚀" className="p-1 hover:bg-slate-800 text-[10.5px] rounded cursor-pointer">🚀</button>
                            <button onClick={() => handleSendMessageReaction(msg.id, "🔥")} title="React 🔥" className="p-1 hover:bg-slate-800 text-[10.5px] rounded cursor-pointer">🔥</button>
                            <button onClick={() => handleSendMessageReaction(msg.id, "💡")} title="React 💡" className="p-1 hover:bg-slate-800 text-[10.5px] rounded cursor-pointer">💡</button>

                            <div className="w-px h-4 bg-slate-800 mx-0.5" />

                            <button onClick={() => setReplyTo(msg)} title="Reply nested" className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white cursor-pointer">
                              <CornerDownRight className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => { setMessageToForward(msg); setShowForwardDialog(true); }} title="Forward message" className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white cursor-pointer">
                              <Share2 className="w-3.5 h-3.5" />
                            </button>
                            <button onClick={() => handleTogglePinMessage(msg.id, msg.isPinned)} title="Pin/Unpin memo" className="p-1 hover:bg-slate-800 rounded text-slate-455 hover:text-white cursor-pointer">
                              <Pin className="w-3.5 h-3.5 text-slate-400" />
                            </button>

                            {isMyMessage && (
                              <>
                                <button onClick={() => handleStartEditing(msg)} title="Edit Message" className="p-1 hover:bg-slate-805 rounded text-slate-400 hover:text-white cursor-pointer">
                                  <Edit className="w-3.5 h-3.5" />
                                </button>
                                <button onClick={() => handleDeleteMessage(msg.id)} title="Delete Message" className="p-1 hover:bg-slate-805 rounded text-slate-400 hover:text-red-400 cursor-pointer">
                                  <Trash className="w-3.5 h-3.5 text-red-500" />
                                </button>
                              </>
                            )}
                          </div>
                        )}

                      </div>
                    );
                  })}

                  {/* Typing Simulator info */}
                  {typingUser && (
                    <div className="flex gap-2 items-center text-[10.5px] text-slate-500 px-3 py-1 font-mono">
                      <div className="flex gap-1 shrink-0">
                        <span className="w-1.5 h-1.5 bg-indigo-505 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                        <span className="w-1.5 h-1.5 bg-indigo-505 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                        <span className="w-1.5 h-1.5 bg-indigo-505 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                      </div>
                      <span>{typingUser} is typing...</span>
                    </div>
                  )}

                  <div ref={chatEndRef} />
                </div>
              )}
            </div>

            {/* MESSAGE COMPOSER CONTAINER WITH CONNECTIONS VERIFICATION GATE */}
            {(() => {
              const connCheck = getConnectionStatus();

              // If NOT connected and type is Connections, block direct input
              if (!connCheck.isConnected) {
                return (
                  <div className="p-4 border-t border-slate-850 bg-slate-950 select-none">
                    <div className="bg-gradient-to-r from-indigo-950 to-slate-950 border border-indigo-500/20 p-4 rounded-xl text-center space-y-3">
                      <div className="flex gap-2 items-center justify-center text-indigo-400">
                        <AlertCircle className="w-4.5 h-4.5" />
                        <h5 className="font-bold text-[11.5px] tracking-wide">Connect to Message Peer</h5>
                      </div>
                      
                      <p className="text-[10px] text-slate-404 max-w-md mx-auto leading-normal">
                        Verify student credentials and accept professional connection requests to communicate inside direct channels. Keep your communication network productive.
                      </p>

                      {connCheck.status === "Pending" ? (
                        <div className="p-3 bg-slate-900 border border-slate-850 rounded-lg max-w-sm mx-auto text-left space-y-1.5">
                          <span className="text-[8.5px] font-mono text-amber-400 uppercase font-extrabold tracking-widest block">✦ Connection Request Pending Approval</span>
                          <p className="text-[10px] text-slate-350 italic">
                            "{connCheck.request?.note || "Sent without a note request"}"
                          </p>
                          <button 
                            disabled 
                            className="w-full py-1.5 bg-slate-800 cursor-not-allowed border border-slate-700 text-slate-400 rounded-lg text-[10px] font-bold"
                          >
                            Pending Acceptance
                          </button>
                        </div>
                      ) : (
                        <form onSubmit={handleSendConnectionRequest} className="space-y-2.5 max-w-sm mx-auto">
                          <div className="bg-slate-900 p-2 rounded-lg border border-slate-800 text-left">
                            <textarea
                              placeholder="Attach a professional note (Optional, e.g., 'Hi, I saw your project...')"
                              value={connBlockNote}
                              onChange={(e) => setConnBlockNote(e.target.value)}
                              rows={2}
                              className="w-full text-[10.5px] text-slate-300 placeholder-slate-500 bg-transparent outline-none resize-none leading-snug"
                            />
                          </div>
                          <button 
                            type="submit" 
                            disabled={blockActionLoading}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-mono font-bold text-[10.5px] py-2 rounded-xl transition-all cursor-pointer shadow flex items-center justify-center gap-1.5"
                          >
                            {blockActionLoading ? <RefreshCw className="w-3 mx-auto animate-spin" /> : "Send Connection Request"}
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                );
              }

              // Normal clean Composer Component
              return (
                <div className="p-3 border-t border-slate-850 bg-slate-950/70 select-none">
                  
                  {replyTo && (
                    <div className="p-2 bg-indigo-950/45 border border-indigo-500/20 rounded-xl mb-2 flex justify-between items-center text-xs animate-slide-in">
                      <span className="text-[10px] text-indigo-300 font-medium flex items-center gap-1">
                        <CornerDownRight className="w-4 h-4 text-indigo-400" /> Replying inline to <strong className="text-white">{replyTo.senderName}</strong> : "{replyTo.content.slice(0, 48)}..."
                      </span>
                      <button onClick={() => setReplyTo(null)} className="text-slate-550 hover:text-white cursor-pointer">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  {selectedAttachment && (
                    <div className="p-2 bg-slate-900 border border-slate-800 rounded-xl mb-2 flex justify-between items-center text-xs">
                      <span className="text-[10px] text-emerald-400 font-mono font-bold flex items-center gap-1">
                        <FileText className="w-4 h-4 text-emerald-400" /> Selected spec: {selectedAttachment.name} ({selectedAttachment.size})
                      </span>
                      <button onClick={() => setSelectedAttachment(null)} className="text-slate-550 hover:text-white cursor-pointer">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}

                  <form onSubmit={handleSendMessage} className="space-y-2">
                    <div className="bg-slate-950 border border-slate-850 p-2 rounded-xl flex items-center gap-3">
                      
                      <div className="relative group/att pointer-events-auto">
                        <button 
                          type="button" 
                          title="Upload spreadsheet or figma specification" 
                          className="p-1 px-1.5 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-white transition-colors cursor-pointer"
                        >
                          <Paperclip className="w-4.5 h-4.5 shrink-0" />
                        </button>
                        <div className="absolute bottom-8 left-0 hidden group-hover/att:block bg-slate-950 border border-slate-850 rounded-xl p-1.5 shadow-2xl z-55 min-w-[130px] font-mono text-[9px] font-bold">
                          <span className="px-1 py-1 text-slate-600 block text-[8px] tracking-wider font-extrabold">DOC SELECT</span>
                          <button type="button" onClick={() => handleSimulateAttachmentSelect("png")} className="w-full text-left p-1 text-slate-300 hover:bg-slate-900 hover:text-white block rounded">Figma Wireframes PNG</button>
                          <button type="button" onClick={() => handleSimulateAttachmentSelect("pdf")} className="w-full text-left p-1 text-slate-300 hover:bg-slate-900 hover:text-white block rounded">Structure blueprint PDF</button>
                          <button type="button" onClick={() => handleSimulateAttachmentSelect("zip")} className="w-full text-left p-1 text-slate-300 hover:bg-slate-900 hover:text-white block rounded">Source code bundle ZIP</button>
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <input 
                          type="text" 
                          value={newText}
                          onChange={(e) => setNewText(e.target.value)}
                          placeholder={isRecording ? "Capturing raw telemetry audio memo..." : `Write message directly to ${activeChatThread.title}...`}
                          disabled={isRecording}
                          className="w-full bg-transparent text-xs text-white placeholder-slate-500 outline-none leading-relaxed"
                        />
                      </div>

                      {isRecording ? (
                        <div className="flex items-center gap-1.5 bg-red-950/20 border border-red-500/25 px-2 py-1 rounded-lg text-red-400 font-mono text-[9.5px]">
                          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                          <span>Voice {recordingSeconds}s</span>
                          <button type="button" onClick={handleStopRecording} title="Send note" className="p-0.5 bg-red-650 hover:bg-red-500 text-white rounded cursor-pointer ml-1.5 text-[8px] font-bold">✓</button>
                          <button type="button" onClick={handleCancelRecording} title="Cancel" className="p-0.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded cursor-pointer"><X className="w-3 h-3" /></button>
                        </div>
                      ) : (
                        <button 
                          type="button" 
                          onClick={handleStartRecording} 
                          title="Simulate Speech note" 
                          className="p-1 px-1.5 hover:bg-slate-900 rounded-lg text-slate-400 hover:text-indigo-400 transition-colors cursor-pointer"
                        >
                          <Volume2 className="w-4.5 h-4.5 shrink-0" />
                        </button>
                      )}

                      <button type="submit" className="p-2 bg-indigo-650 hover:bg-indigo-600 rounded-lg text-white cursor-pointer transition-colors shrink-0">
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </form>

                </div>
              );
            })()}
          </div>
        ) : (
          /* PROFESSIONAL NETWORK DASHBOARD (LinkedIn professional peer-connection workspace) */
          <div className="flex-1 flex flex-col bg-slate-900 border-l border-slate-850 p-4 pb-6 sm:p-6 text-left select-none overflow-y-auto">
            <div className="border-b border-indigo-500/10 pb-4 mb-5">
              <h3 className="font-sans font-extrabold text-white text-xs sm:text-sm flex items-center gap-2">
                <Users className="w-4 h-4 text-indigo-400" /> Professional Collaboration Network
              </h3>
              <p className="text-[10px] sm:text-[10.5px] text-slate-400 mt-1 leading-normal font-sans">
                Only student peers with accepted connection requests can initiate direct private messages. Send and view pending professional invitations below to start collaborating on campus hackathons, open source builds, and mentors networks.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
              
              {/* LEFT COLUMN: PENDING CONNECTION INVITATIONS */}
              <div className="space-y-3">
                <h4 className="text-[9px] font-mono text-indigo-400 font-extrabold uppercase tracking-widest flex items-center gap-1.5">
                  📥 Pending Incoming Invites ({connectionRequests.filter(r => r.status === "Pending" && r.receiverId === currentUserId).length})
                </h4>

                <div className="space-y-2 max-h-[195px] overflow-y-auto custom-scrollbar pr-1">
                  {connectionRequests.filter(r => r.status === "Pending" && r.receiverId === currentUserId).map(req => (
                    <div key={req.id} className="p-3 bg-slate-950/80 border border-slate-855 rounded-xl space-y-2.5">
                      <div className="flex gap-2.5 items-center">
                        <img src={req.senderAvatar} alt="sender" className="w-[32px] h-[32px] rounded-lg object-cover" />
                        <div className="min-w-0">
                          <strong className="text-[11px] text-white block truncate leading-tight font-sans">{req.senderName}</strong>
                          <span className="text-[9px] text-slate-450 truncate block mt-0.5 font-mono">{req.senderHeadline || "Student Partner"}</span>
                        </div>
                      </div>

                      {req.note && (
                        <p className="text-[10px] text-slate-350 italic bg-indigo-950/20 border border-indigo-900/30 p-2 rounded-lg leading-relaxed font-sans">
                          "{req.note}"
                        </p>
                      )}

                      <div className="flex gap-1.5 justify-end">
                        <button
                          onClick={() => handleRejectInvite(req.id)}
                          className="px-2.5 py-1 text-[9px] font-mono font-bold rounded-lg border border-slate-800 text-slate-400 hover:text-white hover:bg-slate-900 transition-colors"
                        >
                          Ignore
                        </button>
                        <button
                          onClick={() => handleAcceptInvite(req.id)}
                          className="px-3 py-1 text-[9px] font-mono font-bold rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 transition-colors flex items-center gap-1"
                        >
                          <Check className="w-3 h-3" /> Approve
                        </button>
                      </div>
                    </div>
                  ))}

                  {connectionRequests.filter(r => r.status === "Pending" && r.receiverId === currentUserId).length === 0 && (
                    <p className="text-slate-500 italic text-[10px] py-4 bg-slate-950/20 border border-dashed border-slate-850 rounded-xl text-center">
                      No pending connection request invites. You are all caught up!
                    </p>
                  )}
                </div>

                {/* QUICK ACTIONS ROW */}
                <div className="pt-2">
                  <button
                    onClick={() => setIsNewMessageMode(true)}
                    className="w-full py-2 bg-indigo-650/10 hover:bg-indigo-600/30 border border-indigo-550/25 text-indigo-400 hover:text-white font-mono font-bold text-[10px] rounded-xl cursor-pointer shadow transition-all flex items-center justify-center gap-1.5 animate-pulse"
                  >
                    <PlusCircle className="w-3.5 h-3.5" />
                    <span>Compose New Message</span>
                  </button>
                </div>
              </div>

              {/* RIGHT COLUMN: CAMPUS PEERS & MENTORS DIRECTORY */}
              <div className="space-y-3">
                <h4 className="text-[9px] font-mono text-indigo-400 font-extrabold uppercase tracking-widest flex items-center gap-1.5">
                  🎓 Campus Peer Directory ({ALL_PEOPLE_DIRECTORY.length})
                </h4>

                <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar pr-1">
                  {ALL_PEOPLE_DIRECTORY.map(peer => {
                    const status = getUserConnectionStatus(peer.id);
                    return (
                      <div key={peer.id} className="p-2 px-3 bg-slate-955/40 hover:bg-slate-955/90 border border-slate-855 rounded-xl transition-all flex justify-between items-center gap-3">
                        <div className="flex gap-2.5 items-center min-w-0">
                          <div className="relative shrink-0 w-8.5 h-8.5 rounded-lg overflow-hidden border border-slate-800">
                            <img src={peer.avatarUrl} alt="ava" className="w-full h-full object-cover" />
                            {peer.status === "online" && (
                              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-slate-950" />
                            )}
                          </div>
                          <div className="min-w-0 leading-tight">
                            <h5 className="text-[11px] font-bold text-white truncate font-sans">{peer.fullName}</h5>
                            <span className="text-[8.5px] text-slate-550 font-mono truncate block mt-0.5">{peer.role}</span>
                          </div>
                        </div>

                        <div className="shrink-0">
                          {status === "Connected" ? (
                            <button
                              onClick={() => handleSelectContact(peer.id)}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 font-mono text-[9px] text-white rounded-lg font-bold transition-all cursor-pointer"
                            >
                              Message
                            </button>
                          ) : status === "Requested_Out" ? (
                            <span className="text-[8.9px] font-mono font-bold bg-slate-900 border border-slate-850 px-1.5 py-0.5 rounded text-slate-500">
                              Sent
                            </span>
                          ) : status === "Requested_In" ? (
                            <button
                              onClick={async () => {
                                const req = connectionRequests.find(r => r.senderId === peer.id && r.status === "Pending");
                                if (req) handleAcceptInvite(req.id);
                              }}
                              className="px-2.5 py-1 bg-indigo-650 hover:bg-indigo-500 font-mono text-[9px] text-white rounded-lg font-bold transition-all cursor-pointer"
                            >
                              Approve
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                setSendingInviteUserId(peer.id);
                              }}
                              className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-550 border border-indigo-400/20 font-mono text-[9px] text-slate-250 hover:text-white rounded-lg font-bold transition-all cursor-pointer"
                            >
                              Connect
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

      {/* 3. MULTI-LAYER DISCORD INFORMATION OVERLAY */}
      {rightSidebarOpen && activeChatThread && (
        <div 
          className="absolute inset-0 bg-slate-950/85 backdrop-blur-xs z-30 md:hidden transition-opacity duration-200 cursor-pointer"
          onClick={() => setRightSidebarOpen(false)}
        />
      )}

      {rightSidebarOpen && activeChatThread && (
        <div className={`w-60 bg-slate-955 border-l border-slate-850 flex flex-col shrink-0 text-left absolute md:static inset-y-0 right-0 z-40 md:z-auto transition-transform duration-250 md:translate-x-0 ${rightSidebarOpen ? "translate-x-0" : "translate-x-full"}`}>
          
          <div className="p-3 border-b border-slate-850 flex justify-between items-center shrink-0">
            <span className="font-mono text-[9.5px] text-indigo-400 font-extrabold uppercase tracking-widest flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5" /> Room Ledger
            </span>
            <button onClick={() => setRightSidebarOpen(false)} className="text-slate-500 hover:text-white cursor-pointer md:hidden">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
            
            <div>
              <span className="text-[9.2px] font-mono text-slate-505 font-extrabold uppercase tracking-widest block mb-2 px-1">
                Active group roster (4)
              </span>
              <div className="space-y-2">
                {activeMembersList.map(peer => (
                  <div key={peer.name} className="flex gap-2 p-1.5 rounded-lg hover:bg-slate-900/30 cursor-default">
                    <div className="w-7 h-7 rounded-lg overflow-hidden border border-slate-800 shrink-0 relative bg-slate-900">
                      <span className="w-full h-full flex items-center justify-center text-[10px] uppercase font-bold text-slate-505 font-mono">
                        {peer.name[0]}
                      </span>
                      {peer.status === "online" && (
                        <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 border border-slate-950" />
                      )}
                    </div>

                    <div className="min-w-0 flex-1 leading-tight text-left text-sans">
                      <strong className="text-slate-205 font-semibold block truncate text-[11px]">{peer.name}</strong>
                      <span className="text-[8.5px] text-slate-500 font-mono block truncate">{peer.role}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-slate-900 border border-slate-850 rounded-xl space-y-2 select-none">
              <span className="text-[8.5px] font-mono text-indigo-400 font-extrabold uppercase tracking-widest block">
                ✦ Channel Rules
              </span>
              <p className="text-[9.5px] text-slate-400 leading-normal font-sans">
                Professionalism and verification rules apply. Users can pin, react to, and copy message logs to team portfolios easily.
              </p>
            </div>

          </div>

          <div className="p-3 bg-slate-950/20 border-t border-slate-850 space-y-1.5 shrink-0 select-none">
            <span className="text-[9px] font-mono text-slate-500 font-bold uppercase tracking-widest block text-left">
              Task Deliverables
            </span>
            <div className="space-y-1">
              <div className="p-1.5 px-2 bg-slate-950 rounded border border-slate-850 flex justify-between items-center text-[9.5px] font-mono">
                <span className="text-slate-400 truncate text-[9px]">Figma wireframe file.png</span>
                <Download className="w-3.5 h-3.5 text-indigo-400 shrink-0 cursor-pointer" onClick={() => alert("Downloading Figma specification wireframe...")} />
              </div>
            </div>
          </div>

        </div>
      )}

      {/* COMPACT FORWARD DIALOG MODAL LAYOUT */}
      {showForwardDialog && messageToForward && (
        <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md z-99 flex justify-center items-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 w-full max-w-sm text-left space-y-4 animate-scale-in">
            <div className="flex justify-between items-center border-b border-slate-850 pb-2">
              <h4 className="font-bold text-white text-xs flex items-center gap-1.5 font-sans">
                <Share2 className="w-4 h-4 text-indigo-400 shrink-0" /> Forward Message Spec
              </h4>
              <button onClick={() => { setShowForwardDialog(false); setMessageToForward(null); }} className="text-slate-400 hover:text-white cursor-pointer">
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            <div className="p-3 bg-slate-950 border border-slate-855 rounded-xl space-y-1">
              <strong className="text-[9.5px] font-mono text-slate-500">SPECIFICATION PACK TO COPY</strong>
              <p className="text-[10.5px] text-slate-300 italic font-sans">"{messageToForward.content}"</p>
            </div>

            <div className="space-y-2">
              <span className="text-[9px] font-mono text-slate-550 block font-bold uppercase tracking-widest">Select Target Conversation category</span>
              <div className="max-h-36 overflow-y-auto space-y-1 bg-slate-955 p-1 rounded-xl border border-slate-850">
                {conversations.map(c => (
                  <button 
                    key={c.id}
                    onClick={() => handleForwardMessage(c.id)}
                    className="w-full p-2 hover:bg-slate-900 rounded-lg text-left text-[10.5px] font-medium text-slate-200 hover:text-white font-mono flex justify-between items-center cursor-pointer transition-all"
                  >
                    <span className="truncate">{c.title}</span>
                    <span className="text-[8px] bg-indigo-950 border border-indigo-900 rounded px-1 shrink-0 text-indigo-400 uppercase font-bold">{c.type === "Startup Teams" ? "Startups" : c.type}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LINKEDIN PERSONALIZED NOTES POPUP MODAL */}
      {sendingInviteUserId && (() => {
        const peer = ALL_PEOPLE_DIRECTORY.find(p => p.id === sendingInviteUserId);
        if (!peer) return null;
        return (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 max-w-sm w-full space-y-4 shadow-2xl text-left animate-in fade-in zoom-in duration-200">
              <div className="flex justify-between items-center pb-2 border-b border-slate-850">
                <span className="text-[10px] font-mono text-indigo-400 font-extrabold uppercase tracking-widest flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> Direct Invitation
                </span>
                <button onClick={() => setSendingInviteUserId(null)} className="text-slate-400 hover:text-white transition-colors cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex gap-3 items-center bg-slate-950/40 p-2.5 rounded-xl border border-slate-850">
                <img src={peer.avatarUrl} alt="ava" className="w-[36px] h-[36px] rounded-lg object-cover border border-slate-800" />
                <div>
                  <h4 className="text-[11px] font-bold text-white leading-normal font-sans">{peer.fullName}</h4>
                  <p className="text-[9.5px] text-slate-400 truncate max-w-[200px] font-mono">{peer.role}</p>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[9.5px] text-slate-400 font-medium">Add personal note (LinkedIn-style optional note):</label>
                <textarea
                  value={inviteNoteText}
                  onChange={(e) => setInviteNoteText(e.target.value)}
                  placeholder="Hi! I saw your profile and would love to collaborate on university projects..."
                  className="w-full bg-slate-955 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-600 outline-none focus:border-indigo-500/40 min-h-[70px] resize-none"
                />
              </div>
              <div className="flex gap-2 justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setSendingInviteUserId(null)}
                  className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-850 border border-slate-800 text-[10px] font-mono text-slate-400 font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    try {
                      const res = await fetch("/api/connections/request", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          receiverId: peer.id,
                          note: inviteNoteText
                        })
                      });
                      if (res.ok) {
                        setInviteNoteText("");
                        setSendingInviteUserId(null);
                        await fetchConnectionsAndRequests();
                        await fetchConversations();
                      } else {
                        const error = await res.json();
                        alert(error.error || "Failed sending connection request");
                      }
                    } catch (err) {
                      console.error(err);
                    }
                  }}
                  className="px-4 py-1.5 rounded-lg bg-indigo-650 hover:bg-indigo-600 text-[10px] font-mono text-white font-bold shadow transition-all cursor-pointer"
                >
                  Send Invite
                </button>
              </div>
            </div>
          </div>
        );
      })()}

    </div>
  );
}
