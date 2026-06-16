import { Request, Response } from "express";
import mongoose from "mongoose";
import { NotificationModel } from "../../services/mongodbService";
import { dbState, saveDb } from "../../shared/database/dbState";

export class NotificationsController {
  async getNotifications(req: Request, res: Response) {
    if (mongoose.connection.readyState !== 1) {
      return res.json(dbState.notifications);
    }

    try {
      const userId = dbState.user.id || "student_ashish";
      const notifs = await NotificationModel.find({ userId }).sort({ createdAt: -1 });
      const mapped = notifs.map(n => ({
        id: n._id.toString(),
        userId: n.userId,
        title: n.title,
        message: n.message,
        type: n.type,
        read: n.read,
        createdAt: (n as any).createdAt ? (n as any).createdAt.toISOString() : new Date().toISOString()
      }));
      res.json(mapped);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async markAsRead(req: Request, res: Response) {
    const { id } = req.params;

    if (mongoose.connection.readyState !== 1) {
      const notif = dbState.notifications.find(n => n.id === id);
      if (notif) {
        notif.read = true;
        saveDb();
      }
      return res.json({ success: true, notif: notif || null });
    }

    try {
      const notif = await NotificationModel.findById(id);
      if (notif) {
        notif.read = true;
        await notif.save();
      }
      res.json({ success: true, notif: notif ? { ...notif.toObject(), id: notif._id.toString() } : null });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async markAllAsRead(req: Request, res: Response) {
    if (mongoose.connection.readyState !== 1) {
      dbState.notifications.forEach(n => {
        n.read = true;
      });
      saveDb();
      return res.json({ success: true });
    }

    try {
      const userId = dbState.user.id || "student_ashish";
      await NotificationModel.updateMany({ userId }, { $set: { read: true } });
      res.json({ success: true });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}
export const notificationsController = new NotificationsController();
