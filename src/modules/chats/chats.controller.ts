import { Request, Response } from "express";
import { dbState, saveDb } from "../../shared/database/dbState";
import { LoggerService } from "../../shared/logger";

export class ChatsController {
  async getConversations(req: Request, res: Response) {
    try {
      res.json(dbState.chats);
    } catch (err: any) {
      LoggerService.error("getConversations failed", err);
      res.status(500).json({ error: err.message });
    }
  }

  async createConversation(req: Request, res: Response) {
    try {
      const { peerId } = req.body;
      const currentId = dbState.user.id || "student_ashish";

      if (!peerId) {
        return res.status(400).json({ error: "Missing peerId" });
      }

      const isConnected = dbState.connections.some(
        (c: any) => (c.user1Id === currentId && c.user2Id === peerId) || (c.user1Id === peerId && c.user2Id === currentId)
      ) || dbState.connectionRequests.some(
        (r: any) => r.status === "Accepted" && ((r.senderId === currentId && r.receiverId === peerId) || (r.senderId === peerId && r.receiverId === currentId))
      );

      const isDefaultPeer = peerId === "user_priya" || peerId === "user_rohan" || peerId === "user_sneha";

      if (!isConnected && !isDefaultPeer) {
        return res.status(403).json({ error: "You can only start direct conversations with accepted connections." });
      }

      let chat = dbState.chats.find(
        (c: any) =>
          (c.type === "Connections" || c.type === "Direct") &&
          ((c.senderId === currentId && c.receiverId === peerId) ||
            (c.senderId === peerId && c.receiverId === currentId) ||
            c.id === `conn_chat_${peerId}` ||
            c.id === `conn_chat_${peerId}_${currentId}` ||
            c.id === `conn_chat_${currentId}_${peerId}` ||
            (peerId === "user_priya" && c.id === "conn_chat_user_priya"))
      );

      if (!chat) {
        const profiles: any = {
          user_rohan: { fullName: "Rohan Sharma", role: "Backend Architect", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80" },
          user_sneha: { fullName: "Sneha Nair", role: "UI/UX Designer", avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100&q=80" },
          user_priya: { fullName: "Priya Patel", role: "Fullstack Architect", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80" },
          user_piyush: { fullName: "Piyush Mehta", role: "Final Year CS | System Lead", avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&h=100&q=80" }
        };
        const peer = profiles[peerId] || { fullName: "Student Peer", role: "Student Developer", avatarUrl: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100&q=80" };

        chat = {
          id: `conn_chat_${currentId}_${peerId}`,
          title: peer.fullName,
          avatar: peer.avatarUrl,
          type: "Connections" as any,
          senderId: currentId,
          receiverId: peerId,
          unreadCount: 0,
          lastMessage: "Direct conversation started.",
          lastMessageTime: new Date().toISOString(),
          messages: [
            {
              id: `msg_init_${Date.now()}`,
              senderId: "system",
              senderName: "SkillCollab Bot",
              senderAvatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&h=150&q=80",
              content: `Hi both! Say hello and start collaborating!`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]
        };
        dbState.chats.unshift(chat);
        saveDb();
      }

      res.json({ success: true, chat });
    } catch (err: any) {
      LoggerService.error("createConversation failed", err);
      res.status(500).json({ error: err.message });
    }
  }

  async getConversationById(req: Request, res: Response) {
    try {
      const { conversationId } = req.params;
      const chat = dbState.chats.find((c: any) => c.id === conversationId);
      if (!chat) {
        return res.status(404).json({ error: "Conversation thread not found." });
      }
      res.json(chat);
    } catch (err: any) {
      LoggerService.error("getConversationById failed", err);
      res.status(500).json({ error: err.message });
    }
  }

  async sendMessage(req: Request, res: Response) {
    try {
      const { conversationId, content, replyToMessageId, attachments } = req.body;
      const senderId = dbState.user.id || "student_ashish";

      if (!conversationId || !content) {
        return res.status(400).json({ error: "Missing conversationId or content stream parameters." });
      }

      const chat = dbState.chats.find((c: any) => c.id === conversationId);
      if (!chat) {
        return res.status(404).json({ error: "Conversation thread not found." });
      }

      const newMessage = {
        id: `msg_${Date.now()}`,
        senderId,
        senderName: dbState.user.fullName || "Ashish Ghadigaonkar",
        senderAvatar: dbState.user.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
        content,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        createdAt: new Date().toISOString(),
        replyToMessageId,
        attachments,
        reactions: {} as any
      };

      if (!chat.messages) chat.messages = [];
      chat.messages.push(newMessage);

      chat.lastMessage = `${(dbState.user.fullName || "Ashish").split(" ")[0]}: ${content}`;
      chat.lastMessageTime = new Date().toISOString();

      saveDb();
      res.json({ success: true, message: newMessage, chat });
    } catch (err: any) {
      LoggerService.error("sendMessage failed", err);
      res.status(500).json({ error: err.message });
    }
  }

  async addReaction(req: Request, res: Response) {
    try {
      const { messageId, conversationId, reaction } = req.body;

      const chat = dbState.chats.find((c: any) => c.id === conversationId);
      if (!chat) return res.status(404).json({ error: "Conversation of message reaction not found." });

      const message = chat.messages?.find((m: any) => m.id === messageId);
      if (!message) return res.status(404).json({ error: "Message targeted for reaction not found." });

      if (!message.reactions) message.reactions = {};
      const currentCount = message.reactions[reaction] || 0;
      message.reactions[reaction] = currentCount + 1;

      saveDb();
      res.json({ success: true, reactions: message.reactions });
    } catch (err: any) {
      LoggerService.error("addReaction failed", err);
      res.status(500).json({ error: err.message });
    }
  }

  async editMessage(req: Request, res: Response) {
    try {
      const { messageId, conversationId, content } = req.body;
      const chat = dbState.chats.find((c: any) => c.id === conversationId);
      if (!chat) return res.status(404).json({ error: "Conversation not found." });
      const message = chat.messages?.find((m: any) => m.id === messageId);
      if (!message) return res.status(404).json({ error: "Message not found." });

      message.content = content;
      message.isEdited = true;
      saveDb();
      res.json({ success: true, message });
    } catch (err: any) {
      LoggerService.error("editMessage failed", err);
      res.status(500).json({ error: err.message });
    }
  }

  async deleteMessage(req: Request, res: Response) {
    try {
      const { messageId, conversationId } = req.body;
      const chat = dbState.chats.find((c: any) => c.id === conversationId);
      if (!chat) return res.status(404).json({ error: "Conversation not found." });
      const message = chat.messages?.find((m: any) => m.id === messageId);
      if (!message) return res.status(404).json({ error: "Message not found." });

      message.content = "This message has been deleted.";
      message.isDeleted = true;
      saveDb();
      res.json({ success: true, message });
    } catch (err: any) {
      LoggerService.error("deleteMessage failed", err);
      res.status(500).json({ error: err.message });
    }
  }

  async pinMessage(req: Request, res: Response) {
    try {
      const { messageId, conversationId, isPinned } = req.body;
      const chat = dbState.chats.find((c: any) => c.id === conversationId);
      if (!chat) return res.status(404).json({ error: "Conversation not found." });
      const message = chat.messages?.find((m: any) => m.id === messageId);
      if (!message) return res.status(404).json({ error: "Message not found." });

      message.isPinned = isPinned;
      saveDb();
      res.json({ success: true, message });
    } catch (err: any) {
      LoggerService.error("pinMessage failed", err);
      res.status(500).json({ error: err.message });
    }
  }
}
export const chatsController = new ChatsController();
