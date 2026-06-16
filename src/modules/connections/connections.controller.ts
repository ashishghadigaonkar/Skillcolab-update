import { Request, Response } from "express";
import { connectionsRepository } from "./connections.repository";
import { dbState, saveDb } from "../../shared/database/dbState";
import { LoggerService } from "../../shared/logger";

export class ConnectionsController {
  async getFollows(req: Request, res: Response) {
    try {
      const userId = dbState.user.id || "student_ashish";
      const list = await connectionsRepository.getFollows(userId);
      res.json(list);
    } catch (err: any) {
      LoggerService.error("getFollows failed", err);
      res.status(500).json({ error: err.message });
    }
  }

  async toggleFollow(req: Request, res: Response) {
    try {
      const userId = dbState.user.id || "student_ashish";
      const { followingId, followingType } = req.body;
      if (!followingId || !followingType) {
        return res.status(400).json({ error: "Missing followingId or followingType" });
      }
      const result = await connectionsRepository.toggleFollow(userId, followingId, followingType);
      res.json(result);
    } catch (err: any) {
      LoggerService.error("toggleFollow failed", err);
      res.status(500).json({ error: err.message });
    }
  }

  async getConnectionsAndRequests(req: Request, res: Response) {
    try {
      const userId = dbState.user.id || "student_ashish";
      const result = await connectionsRepository.getConnectionsAndRequests(userId);
      res.json(result);
    } catch (err: any) {
      LoggerService.error("getConnectionsAndRequests failed", err);
      res.status(500).json({ error: err.message });
    }
  }

  async sendRequest(req: Request, res: Response) {
    try {
      const { receiverId, note } = req.body;
      const senderId = dbState.user.id || "student_ashish";

      if (!receiverId) {
        return res.status(400).json({ error: "Missing receiverId parameter." });
      }

      const existing = dbState.connectionRequests.find(
        (r: any) => (r.senderId === senderId && r.receiverId === receiverId) || (r.senderId === receiverId && r.receiverId === senderId)
      );

      if (existing) {
        if (existing.status === "Withdrawn" || existing.status === "Rejected") {
          existing.status = "Pending";
          existing.note = note || "";
          existing.sentDate = new Date().toISOString();
          saveDb();
          return res.json({ success: true, request: existing });
        }
        return res.json({ success: true, request: existing, message: "Existing request found" });
      }

      let recName = "Student Collaborator";
      let recHeadline = "CS Sophomore";
      let recAvatar = "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100&q=80";

      const profiles: any = {
        user_rohan: { fullName: "Rohan Sharma", role: "Backend Architect", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80" },
        user_sneha: { fullName: "Sneha Nair", role: "UI/UX Designer", avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100&q=80" },
        user_priya: { fullName: "Priya Patel", role: "Fullstack Architect", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80" },
        user_piyush: { fullName: "Piyush Mehta", role: "Final Year CS | System Lead", avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&h=100&q=80" }
      };

      const matched = profiles[receiverId];
      if (matched) {
        recName = matched.fullName;
        recHeadline = matched.role;
        recAvatar = matched.avatarUrl;
      }

      const newRequest = {
        id: `req_${Date.now()}`,
        senderId,
        senderName: dbState.user.fullName || "Ashish Ghadigaonkar",
        senderAvatar: dbState.user.avatarUrl || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80",
        senderHeadline: dbState.user.headline || "Fullstack Lead Developer (You)",
        receiverId,
        receiverName: recName,
        receiverAvatar: recAvatar,
        receiverHeadline: recHeadline,
        note: note || "",
        status: "Pending",
        sentDate: new Date().toISOString()
      };

      dbState.connectionRequests.unshift(newRequest);

      const newNotif = {
        id: `notif_${Date.now()}`,
        userId: receiverId,
        title: "New Connection Request",
        message: `${dbState.user.fullName || "Ashish"} wants to connect with you. ${note ? `Note: "${note}"` : ""}`,
        type: "Invite" as const,
        read: false,
        createdAt: new Date().toISOString()
      };
      dbState.notifications.unshift(newNotif);

      saveDb();
      res.json({ success: true, request: newRequest });
    } catch (err: any) {
      LoggerService.error("sendRequest failed", err);
      res.status(500).json({ error: err.message });
    }
  }

  async acceptRequest(req: Request, res: Response) {
    try {
      const { requestId } = req.body;
      const currentId = dbState.user.id || "student_ashish";

      const request = dbState.connectionRequests.find((r: any) => r.id === requestId && r.receiverId === currentId);
      if (!request) {
        return res.status(404).json({ error: "Connection request not found or unauthorized." });
      }

      request.status = "Accepted";

      const newConn = {
        id: `conn_${Date.now()}`,
        user1Id: request.senderId,
        user2Id: request.receiverId,
        createdAt: new Date().toISOString()
      };
      dbState.connections.push(newConn);

      dbState.user.connectionsCount = (dbState.user.connectionsCount || 0) + 1;

      let chat = dbState.chats.find(
        (c: any) =>
          c.type === "Connections" &&
          ((c.senderId === request.senderId && c.receiverId === request.receiverId) ||
            (c.senderId === request.receiverId && c.receiverId === request.senderId))
      );

      if (!chat) {
        chat = {
          id: `conn_chat_${request.senderId}_${request.receiverId}`,
          title: request.senderName,
          avatar: request.senderAvatar,
          type: "Connections" as any,
          senderId: request.senderId,
          receiverId: request.receiverId,
          unreadCount: 0,
          lastMessage: "Connection created! You can now send messages directly.",
          lastMessageTime: new Date().toISOString(),
          messages: [
            {
              id: `msg_init_${Date.now()}`,
              senderId: "system",
              senderName: "SkillCollab Bot",
              senderAvatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=150&h=150&q=80",
              content: `Hi both! You are now connected on SkillCollab. Say hello to each other!`,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
          ]
        } as any;
        dbState.chats.unshift(chat);
      }

      const activity1 = {
        id: `act_conn_${Date.now()}`,
        userId: request.senderId,
        authorName: request.senderName,
        authorRole: request.senderHeadline,
        authorAvatar: request.senderAvatar,
        type: "ConnectionPost",
        content: `${request.senderName} is now connected with ${request.receiverName}.`,
        likesCount: 0,
        commentsCount: 0,
        sharesCount: 0,
        likes: [],
        comments: [],
        createdAt: new Date().toISOString()
      };
      dbState.activities.unshift(activity1);

      const newNotif = {
        id: `notif_${Date.now()}`,
        userId: request.senderId,
        title: "Connection Request Accepted",
        message: `${dbState.user.fullName || "Ashish"} accepted your connection request!`,
        type: "Invite" as const,
        read: false,
        createdAt: new Date().toISOString()
      };
      dbState.notifications.unshift(newNotif);

      saveDb();
      res.json({ success: true, request, connection: newConn });
    } catch (err: any) {
      LoggerService.error("acceptRequest failed", err);
      res.status(500).json({ error: err.message });
    }
  }

  async rejectRequest(req: Request, res: Response) {
    try {
      const { requestId } = req.body;
      const currentId = dbState.user.id || "student_ashish";

      const request = dbState.connectionRequests.find((r: any) => r.id === requestId && r.receiverId === currentId);
      if (!request) {
        return res.status(404).json({ error: "Connection request not found or unauthorized." });
      }

      request.status = "Rejected";
      saveDb();
      res.json({ success: true, request });
    } catch (err: any) {
      LoggerService.error("rejectRequest failed", err);
      res.status(500).json({ error: err.message });
    }
  }

  async withdrawRequest(req: Request, res: Response) {
    try {
      const { requestId, receiverId } = req.body;
      const currentId = dbState.user.id || "student_ashish";

      let request = null;
      if (requestId) {
        request = dbState.connectionRequests.find((r: any) => r.id === requestId && r.senderId === currentId);
      } else if (receiverId) {
        request = dbState.connectionRequests.find((r: any) => r.receiverId === receiverId && r.senderId === currentId && r.status === "Pending");
      }

      if (!request) {
        return res.status(404).json({ error: "Connection request not found or unauthorized." });
      }

      request.status = "Withdrawn";
      saveDb();
      res.json({ success: true, request });
    } catch (err: any) {
      LoggerService.error("withdrawRequest failed", err);
      res.status(500).json({ error: err.message });
    }
  }

  async removeConnection(req: Request, res: Response) {
    try {
      const { userId } = req.body;
      const currentId = dbState.user.id || "student_ashish";

      if (!userId) {
        return res.status(400).json({ error: "Missing userId parameter." });
      }

      dbState.connections = dbState.connections.filter(
        (c: any) => !((c.user1Id === currentId && c.user2Id === userId) || (c.user1Id === userId && c.user2Id === currentId))
      );

      if (dbState.user.connectionsCount && dbState.user.connectionsCount > 0) {
        dbState.user.connectionsCount -= 1;
      }

      const reqIndex = dbState.connectionRequests.findIndex(
        (r: any) => (r.senderId === currentId && r.receiverId === userId) || (r.senderId === userId && r.receiverId === currentId)
      );
      if (reqIndex > -1) {
        dbState.connectionRequests.splice(reqIndex, 1);
      }

      saveDb();
      res.json({ success: true });
    } catch (err: any) {
      LoggerService.error("removeConnection failed", err);
      res.status(500).json({ error: err.message });
    }
  }
}
export const connectionsController = new ConnectionsController();
