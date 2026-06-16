import mongoose from "mongoose";
import { FollowerModel } from "../../services/mongodbService";
import { dbState, saveDb } from "../../shared/database/dbState";
import { FollowerRelation } from "../../types";

export class ConnectionsRepository {
  async getFollows(userId: string) {
    if (mongoose.connection.readyState !== 1) {
      return dbState.followers.filter(f => f.followerId === userId);
    }
    const list = await FollowerModel.find({ followerId: userId });
    return list.map(f => ({
      id: f._id.toString(),
      followerId: f.followerId,
      followingId: f.followingId,
      followingType: f.followingType
    }));
  }

  async toggleFollow(userId: string, followingId: string, followingType: string) {
    if (mongoose.connection.readyState !== 1) {
      const existingIndex = dbState.followers.findIndex(
        f => f.followerId === userId && f.followingId === followingId
      );

      if (existingIndex > -1) {
        dbState.followers.splice(existingIndex, 1);
        saveDb();
        return { followed: false, followingId };
      } else {
        const newFollow: FollowerRelation = {
          id: `follow_${Date.now()}`,
          followerId: userId,
          followingId,
          followingType: followingType as any
        };
        dbState.followers.push(newFollow);
        saveDb();
        return { followed: true, followingId };
      }
    }

    const existing = await FollowerModel.findOne({ followerId: userId, followingId });
    if (existing) {
      await FollowerModel.deleteOne({ _id: existing._id });
      return { followed: false, followingId };
    } else {
      const newFollow = new FollowerModel({
        followerId: userId,
        followingId,
        followingType
      });
      await newFollow.save();
      return { followed: true, followingId, id: newFollow._id.toString() };
    }
  }

  async getConnectionsAndRequests(userId: string) {
    const userConns = dbState.connections.filter((c: any) => c.user1Id === userId || c.user2Id === userId);
    const userReqs = dbState.connectionRequests.filter((r: any) => r.senderId === userId || r.receiverId === userId);
    return {
      connections: userConns,
      requests: userReqs
    };
  }
}
export const connectionsRepository = new ConnectionsRepository();
