import { Request, Response } from "express";
import mongoose from "mongoose";
import { ActivityModel, FollowerModel, NotificationModel } from "../../services/mongodbService";
import { dbState, saveDb } from "../../shared/database/dbState";
import { LoggerService } from "../../shared/logger";

function formatPostTimestamp(isoString: string): string {
  try {
    const elapsed = Date.now() - new Date(isoString).getTime();
    if (elapsed < 60000) return "Just now";
    const mins = Math.floor(elapsed / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  } catch (e) {
    return "Recently";
  }
}

export class FeedController {
  async getFeed(req: Request, res: Response) {
    const currentUserId = dbState.user.id || "student_ashish";
    try {
      const userSkills = dbState.user.skills || ["React", "TypeScript", "Node.js", "Solidity"];

      let followedIds: string[] = [];
      if (mongoose.connection.readyState === 1) {
        try {
          const list = await FollowerModel.find({ followerId: currentUserId });
          followedIds = list.map(f => f.followingId);
        } catch (e) {
          LoggerService.error("[Feed] Error querying MongoDB follows", e);
        }
      } else {
        followedIds = dbState.followers
          .filter(f => f.followerId === currentUserId)
          .map(f => f.followingId);
      }

      let allActivities: any[] = [];
      if (mongoose.connection.readyState === 1) {
        try {
          const dbList = await ActivityModel.find({}).sort({ createdAt: -1 });
          allActivities = dbList.map(a => ({
            id: a._id ? a._id.toString() : a.id,
            userId: a.userId,
            authorName: a.authorName,
            authorRole: a.authorRole,
            authorAvatar: a.authorAvatar,
            type: a.type,
            content: a.content,
            skills: a.skills || [],
            likesCount: a.likesCount,
            commentsCount: a.commentsCount || 0,
            sharesCount: a.sharesCount || 0,
            likes: a.likes || [],
            saves: a.saves || [],
            comments: a.comments || [],
            projectMeta: a.projectMeta,
            opportunityMeta: a.opportunityMeta,
            createdAt: a.createdAt ? a.createdAt.toISOString() : new Date().toISOString()
          }));
        } catch (e) {
          LoggerService.error("[Feed] Error loading activities from MongoDB", e);
          allActivities = JSON.parse(JSON.stringify(dbState.activities));
        }
      } else {
        allActivities = JSON.parse(JSON.stringify(dbState.activities));
      }

      const rankedFeed = allActivities.map(post => {
        let score = 100;

        if (followedIds.includes(post.userId)) {
          score += 150;
        }
        if (post.userId === currentUserId) {
          score += 80;
        }

        score += (post.likesCount || 0) * 3;
        score += (post.commentsCount || post.comments?.length || 0) * 8;
        score += (post.sharesCount || 0) * 10;

        if (post.skills && post.skills.length > 0) {
          const overlap = post.skills.filter((s: string) => 
            userSkills.some((us: string) => us.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(us.toLowerCase()))
          );
          score += overlap.length * 25;
        }

        const hoursElapsed = Math.max(0, (Date.now() - new Date(post.createdAt).getTime()) / (1000 * 60 * 60));
        score -= hoursElapsed * 5;

        if (post.type === "ProjectUpdate" || post.type === "TeamRecruitment") {
          score += 12;
        } else if (post.type === "HackathonOpportunity") {
          score += 8;
        } else if (post.type === "InternshipOpportunity") {
          score += 8;
        } else if (post.type === "MentorRecommendation") {
          score += 4;
        } else if (post.type === "OpenSourceOpportunity") {
          score += 4;
        } else if (post.type === "AIInsight") {
          score += 4;
        }

        return { ...post, score };
      });

      rankedFeed.sort((a, b) => b.score - a.score);

      const decoratedFeed = rankedFeed.map(post => ({
        ...post,
        likedByUser: Array.isArray(post.likes) ? post.likes.includes(currentUserId) : false,
        savedByUser: Array.isArray(post.saves) ? post.saves.includes(currentUserId) : false,
        timestamp: formatPostTimestamp(post.createdAt)
      }));

      return res.json({ posts: decoratedFeed });
    } catch (err: any) {
      LoggerService.error("[Feed Fatal] Falling back to memory store config", err);
      try {
        const fallbackFeed = dbState.activities.map(post => ({
          ...post,
          likedByUser: Array.isArray(post.likes) ? post.likes.includes(currentUserId) : false,
          savedByUser: Array.isArray(post.saves) ? post.saves.includes(currentUserId) : false,
          timestamp: "Recently"
        }));
        return res.json({ posts: fallbackFeed });
      } catch (fallbackErr: any) {
        return res.status(500).json({ error: err.message, posts: [] });
      }
    }
  }

  async createPost(req: Request, res: Response) {
    try {
      const currentUserId = dbState.user.id || "student_ashish";
      const userDetails = dbState.user;

      const { type, content, skills, projectMeta, opportunityMeta } = req.body;
      if (!content) return res.status(400).json({ error: "Post content cannot be empty" });

      const activeType = type || "SocialPost";
      const parsedSkills = Array.isArray(skills) ? skills : (typeof skills === "string" ? skills.split(",").map(s => s.trim()).filter(Boolean) : []);

      const freshPost: any = {
        id: `act_${Date.now()}`,
        userId: currentUserId,
        authorName: userDetails.fullName || "Ashish Ghadigaonkar",
        authorRole: userDetails.headline || "Fullstack Core builder",
        authorAvatar: userDetails.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
        type: activeType,
        content,
        skills: parsedSkills,
        likesCount: 0,
        commentsCount: 0,
        sharesCount: 0,
        likes: [],
        saves: [],
        comments: [],
        projectMeta: projectMeta || null,
        opportunityMeta: opportunityMeta || null,
        createdAt: new Date().toISOString()
      };

      dbState.activities.unshift(freshPost);
      saveDb();

      if (mongoose.connection.readyState === 1) {
        try {
          const dbAct = new ActivityModel({
            _id: freshPost.id,
            userId: freshPost.userId,
            authorName: freshPost.authorName,
            authorRole: freshPost.authorRole,
            authorAvatar: freshPost.authorAvatar,
            type: freshPost.type,
            content: freshPost.content,
            skills: freshPost.skills,
            likesCount: 0,
            commentsCount: 0,
            sharesCount: 0,
            likes: [],
            saves: [],
            comments: [],
            projectMeta: freshPost.projectMeta,
            opportunityMeta: freshPost.opportunityMeta,
            createdAt: new Date()
          });
          await dbAct.save();
        } catch (e) {
          LoggerService.error("[Feed] MongoDB save failed - proceeding mock mode", e);
        }
      }

      res.json({ success: true, post: { ...freshPost, timestamp: "Just now", likedByUser: false, savedByUser: false } });
    } catch (err: any) {
      LoggerService.error("createPost failed", err);
      res.status(500).json({ error: err.message });
    }
  }

  async toggleLike(req: Request, res: Response) {
    try {
      const currentUserId = dbState.user.id || "student_ashish";
      const { id } = req.params;

      let postToUpdate: any = null;
      let isLiked = false;

      const memoryIndex = dbState.activities.findIndex(a => a.id === id);
      if (memoryIndex > -1) {
        postToUpdate = dbState.activities[memoryIndex];
        if (!Array.isArray(postToUpdate.likes)) {
          postToUpdate.likes = [];
        }
        const userLikeIndex = postToUpdate.likes.indexOf(currentUserId);
        if (userLikeIndex > -1) {
          postToUpdate.likes.splice(userLikeIndex, 1);
          isLiked = false;
        } else {
          postToUpdate.likes.push(currentUserId);
          isLiked = true;
        }
        postToUpdate.likesCount = postToUpdate.likes.length;
        saveDb();
      }

      if (mongoose.connection.readyState === 1) {
        try {
          const dbAct = await ActivityModel.findById(id);
          if (dbAct) {
            if (!Array.isArray(dbAct.likes)) {
              dbAct.likes = [];
            }
            const uIdx = dbAct.likes.indexOf(currentUserId);
            if (uIdx > -1) {
              dbAct.likes.splice(uIdx, 1);
              isLiked = false;
            } else {
              dbAct.likes.push(currentUserId);
              isLiked = true;
            }
            dbAct.likesCount = dbAct.likes.length;
            await dbAct.save();
            postToUpdate = dbAct;
          }
        } catch (e) {
          LoggerService.error("[Feed] MongoDB like error", e);
        }
      }

      if (!postToUpdate) return res.status(404).json({ error: "Post not found" });

      if (isLiked && postToUpdate.userId !== currentUserId) {
        const notif = {
          id: `notif_${Date.now()}`,
          userId: postToUpdate.userId,
          title: "New Like Received",
          message: `${dbState.user.fullName || "Someone"} liked your post about "${postToUpdate.content.slice(0, 30)}...".`,
          type: "Engagement" as any,
          read: false,
          createdAt: new Date().toISOString()
        };
        dbState.notifications.unshift(notif);
        saveDb();

        if (mongoose.connection.readyState === 1) {
          try {
            const dbNotif = new NotificationModel({
              userId: notif.userId,
              title: notif.title,
              message: notif.message,
              type: notif.type,
              read: false
            });
            await dbNotif.save();
          } catch (err) {
            LoggerService.warn("Failed saving notification in Mongo", err);
          }
        }
      }

      res.json({ success: true, likesCount: postToUpdate.likesCount, likedByUser: isLiked });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async addComment(req: Request, res: Response) {
    try {
      const currentUserId = dbState.user.id || "student_ashish";
      const { id } = req.params;
      const { text } = req.body;

      if (!text || !text.trim()) return res.status(400).json({ error: "Comment text cannot be empty" });

      const freshComment = {
        id: `cm_${Date.now()}`,
        author: dbState.user.fullName || "Ashish Ghadigaonkar",
        avatar: dbState.user.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
        text: text.trim(),
        time: "Just now",
        createdAt: new Date().toISOString()
      };

      let postToUpdate: any = null;

      const memoryIndex = dbState.activities.findIndex(a => a.id === id);
      if (memoryIndex > -1) {
        postToUpdate = dbState.activities[memoryIndex];
        if (!Array.isArray(postToUpdate.comments)) {
          postToUpdate.comments = [];
        }
        postToUpdate.comments.push(freshComment);
        postToUpdate.commentsCount = postToUpdate.comments.length;
        saveDb();
      }

      if (mongoose.connection.readyState === 1) {
        try {
          const dbAct = await ActivityModel.findById(id);
          if (dbAct) {
            if (!Array.isArray(dbAct.comments)) {
              dbAct.comments = [];
            }
            dbAct.comments.push(freshComment);
            dbAct.commentsCount = dbAct.comments.length;
            await dbAct.save();
            postToUpdate = dbAct;
          }
        } catch (e) {
          LoggerService.error("[Feed] MongoDB comment error", e);
        }
      }

      if (!postToUpdate) return res.status(404).json({ error: "Post not found" });

      if (postToUpdate.userId !== currentUserId) {
        const notif = {
          id: `notif_${Date.now()}`,
          userId: postToUpdate.userId,
          title: "New Comment Received",
          message: `${dbState.user.fullName || "Someone"} commented on your post: "${text.slice(0, 25)}..."`,
          type: "Comment" as any,
          read: false,
          createdAt: new Date().toISOString()
        };
        dbState.notifications.unshift(notif);
        saveDb();
      }

      res.json({ success: true, comments: postToUpdate.comments, commentsCount: postToUpdate.comments.length });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async savePost(req: Request, res: Response) {
    try {
      const currentUserId = dbState.user.id || "student_ashish";
      const { id } = req.params;

      let postToUpdate: any = null;
      let isSaved = false;

      const memoryIndex = dbState.activities.findIndex(a => a.id === id);
      if (memoryIndex > -1) {
        postToUpdate = dbState.activities[memoryIndex];
        if (!Array.isArray(postToUpdate.saves)) {
          postToUpdate.saves = [];
        }
        const idx = postToUpdate.saves.indexOf(currentUserId);
        if (idx > -1) {
          postToUpdate.saves.splice(idx, 1);
          isSaved = false;
        } else {
          postToUpdate.saves.push(currentUserId);
          isSaved = true;
        }
        saveDb();
      }

      if (mongoose.connection.readyState === 1) {
        try {
          const dbAct = await ActivityModel.findById(id);
          if (dbAct) {
            if (!Array.isArray(dbAct.saves)) {
              dbAct.saves = [];
            }
            const idx = dbAct.saves.indexOf(currentUserId);
            if (idx > -1) {
              dbAct.saves.splice(idx, 1);
              isSaved = false;
            } else {
              dbAct.saves.push(currentUserId);
              isSaved = true;
            }
            await dbAct.save();
            postToUpdate = dbAct;
          }
        } catch (e) {
          LoggerService.error("[Feed] MongoDB save error", e);
        }
      }

      if (!postToUpdate) return res.status(404).json({ error: "Post not found" });

      res.json({ success: true, savedByUser: isSaved });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async sharePost(req: Request, res: Response) {
    try {
      const currentUserId = dbState.user.id || "student_ashish";
      const { id } = req.params;

      let postToUpdate: any = null;

      const memoryIndex = dbState.activities.findIndex(a => a.id === id);
      if (memoryIndex > -1) {
        postToUpdate = dbState.activities[memoryIndex];
        postToUpdate.sharesCount = (postToUpdate.sharesCount || 0) + 1;
        saveDb();
      }

      if (mongoose.connection.readyState === 1) {
        try {
          const dbAct = await ActivityModel.findById(id);
          if (dbAct) {
            dbAct.sharesCount = (dbAct.sharesCount || 0) + 1;
            await dbAct.save();
            postToUpdate = dbAct;
          }
        } catch (e) {
          LoggerService.error("MongoDB share activity incremental error", e);
        }
      }

      if (!postToUpdate) return res.status(404).json({ error: "Post not found" });

      if (postToUpdate.userId !== currentUserId) {
        const notif = {
          id: `notif_${Date.now()}`,
          userId: postToUpdate.userId,
          title: "Shared Your Achievement",
          message: `${dbState.user.fullName || "Someone"} shared/reposted your activity to their local feed.`,
          type: "Engagement" as any,
          read: false,
          createdAt: new Date().toISOString()
        };
        dbState.notifications.unshift(notif);
        saveDb();
      }

      res.json({ success: true, sharesCount: postToUpdate.sharesCount });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async reportPost(req: Request, res: Response) {
    try {
      const { id } = req.params;
      let postToUpdate: any = null;

      const memoryIndex = dbState.activities.findIndex(a => a.id === id);
      if (memoryIndex > -1) {
        postToUpdate = dbState.activities[memoryIndex];
        postToUpdate.reportsCount = (postToUpdate.reportsCount || 0) + 1;
        saveDb();
      }

      if (mongoose.connection.readyState === 1) {
        try {
          const dbAct = await ActivityModel.findById(id);
          if (dbAct) {
            dbAct.reportsCount = (dbAct.reportsCount || 0) + 1;
            await dbAct.save();
            postToUpdate = dbAct;
          }
        } catch (e) {
          LoggerService.error("MongoDB reporting error", e);
        }
      }

      if (!postToUpdate) return res.status(404).json({ error: "Post not found" });

      res.json({ success: true, reportsCount: postToUpdate.reportsCount, message: "Thank you for flagging this content. Our moderation core will review it within 2 hours." });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async connectAuthor(req: Request, res: Response) {
    try {
      const currentUserId = dbState.user.id || "student_ashish";
      const { id } = req.params;

      let authorId = "";
      let authorName = "";

      const memoryPost = dbState.activities.find(a => a.id === id);
      if (memoryPost) {
        authorId = memoryPost.userId;
        authorName = memoryPost.authorName;
      }

      if (!authorId) return res.status(404).json({ error: "Author not found" });

      const userToAuthorExists = dbState.followers.find(f => f.followerId === currentUserId && f.followingId === authorId);
      if (!userToAuthorExists) {
        dbState.followers.push({
          id: `conn_${Date.now()}_1`,
          followerId: currentUserId,
          followingId: authorId,
          followingType: "student"
        });
      }

      const authorToUserExists = dbState.followers.find(f => f.followerId === authorId && f.followingId === currentUserId);
      if (!authorToUserExists) {
        dbState.followers.push({
          id: `conn_${Date.now()}_2`,
          followerId: authorId,
          followingId: currentUserId,
          followingType: "student"
        });
      }

      const checkReq = dbState.connectionRequests.find(r => 
        (r.senderId === currentUserId && r.receiverId === authorId) ||
        (r.senderId === authorId && r.receiverId === currentUserId)
      );

      if (!checkReq) {
        dbState.connectionRequests.push({
          id: `req_feed_${Date.now()}`,
          senderId: currentUserId,
          senderName: dbState.user.fullName || "Ashish Ghadigaonkar",
          senderAvatar: dbState.user.avatarUrl || "",
          senderHeadline: dbState.user.headline || "",
          receiverId: authorId,
          receiverName: authorName,
          receiverAvatar: memoryPost?.authorAvatar || "",
          receiverHeadline: memoryPost?.authorRole || "",
          status: "Accepted",
          note: "Connected directly from social feed post highlight context.",
          sentDate: new Date().toISOString()
        });

        dbState.connections.push({
          id: `conn_feed_${Date.now()}`,
          user1Id: currentUserId,
          user2Id: authorId,
          createdAt: new Date().toISOString()
        });

        dbState.user.connectionsCount = (dbState.user.connectionsCount || 0) + 1;
      }

      const notif = {
        id: `notif_${Date.now()}`,
        userId: authorId,
        title: "New Contact Connected",
        message: `${dbState.user.fullName || "Ashish"} connected with you directly from your post about "${memoryPost?.content.slice(0, 30)}...".`,
        type: "Invite" as any,
        read: false,
        createdAt: new Date().toISOString()
      };
      dbState.notifications.unshift(notif);
      saveDb();

      res.json({ success: true, message: `Successfully connected with author ${authorName}!` });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}
export const feedController = new FeedController();
