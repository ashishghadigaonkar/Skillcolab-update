import { Request, Response } from "express";
import mongoose from "mongoose";
import { FollowerModel, MentorModel, MentorBookingModel, NotificationModel } from "../../services/mongodbService";
import { dbState, saveDb } from "../../shared/database/dbState";
import { FollowerRelation, Notification } from "../../types";

export class MentorsController {
  // --- Follows ---
  async getFollows(req: Request, res: Response) {
    const userId = dbState.user.id || "student_ashish";

    if (mongoose.connection.readyState !== 1) {
      const list = dbState.followers.filter(f => f.followerId === userId);
      return res.json(list);
    }

    try {
      const list = await FollowerModel.find({ followerId: userId });
      const mapped = list.map(f => ({
        id: f._id.toString(),
        followerId: f.followerId,
        followingId: f.followingId,
        followingType: f.followingType
      }));
      return res.json(mapped);
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  async toggleFollow(req: Request, res: Response) {
    const userId = dbState.user.id || "student_ashish";
    const { followingId, followingType } = req.body;

    if (!followingId || !followingType) {
      return res.status(400).json({ error: "Missing followingId or followingType" });
    }

    if (mongoose.connection.readyState !== 1) {
      const existingIndex = dbState.followers.findIndex(
        f => f.followerId === userId && f.followingId === followingId
      );

      if (existingIndex > -1) {
        dbState.followers.splice(existingIndex, 1);
        saveDb();
        return res.json({ followed: false, followingId });
      } else {
        const newFollow: FollowerRelation = {
          id: `follow_${Date.now()}`,
          followerId: userId,
          followingId,
          followingType
        };
        dbState.followers.push(newFollow);
        saveDb();
        return res.json({ followed: true, followingId });
      }
    }

    try {
      const existing = await FollowerModel.findOne({ followerId: userId, followingId });
      if (existing) {
        await FollowerModel.deleteOne({ _id: existing._id });
        return res.json({ followed: false, followingId });
      } else {
        const newFollow = new FollowerModel({
          followerId: userId,
          followingId,
          followingType
        });
        await newFollow.save();
        return res.json({ followed: true, followingId, id: newFollow._id.toString() });
      }
    } catch (err: any) {
      return res.status(500).json({ error: err.message });
    }
  }

  // --- Mentors ---
  async getMentors(req: Request, res: Response) {
    if (mongoose.connection.readyState !== 1) {
      return res.json(dbState.mentors);
    }

    try {
      const mentors = await MentorModel.find();
      const mapped = mentors.map(m => ({
        id: m._id.toString(),
        fullName: m.fullName,
        avatarUrl: m.avatarUrl,
        title: (m as any).title || (m as any).role,
        company: m.company,
        expertise: m.expertise || (m as any).skills,
        bio: (m as any).bio || (m as any).biography,
        rating: m.rating,
        reviewsCount: (m as any).reviewsCount || (m as any).reviewCount,
        skills: (m as any).skills || m.expertise,
        pricing: m.pricing,
        availability: m.availability
      }));
      res.json(mapped);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async bookMentor(req: Request, res: Response) {
    const { id } = req.params;
    const { topic, date, timeSlot } = req.body;

    if (mongoose.connection.readyState !== 1) {
      const mentor = dbState.mentors.find(m => m.id === id);
      if (!mentor) return res.status(404).json({ error: "Mentor not found" });

      const newBooking = {
        id: `book_${Date.now()}`,
        mentorId: id,
        mentorName: mentor.fullName,
        mentorAvatar: mentor.avatarUrl,
        menteeId: dbState.user.id || "student_ashish",
        menteeName: dbState.user.fullName || "Ashish Ghadigaonkar",
        topic: topic || "General Career Mentorship Session",
        date: date || new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        timeSlot: timeSlot || "4:00 PM",
        status: "Scheduled" as any,
        meetingLink: `https://meet.google.com/meet-${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 5)}`
      };

      if (!dbState.sessions) dbState.sessions = [];
      dbState.sessions.unshift(newBooking as any);

      const newNotif: Notification = {
        id: `notif_${Date.now()}`,
        userId: dbState.user.id || "student_ashish",
        title: "Mentorship Reserved",
        message: `Session booked with ${mentor.fullName} on ${newBooking.date} at ${newBooking.timeSlot}.`,
        type: "Update" as const,
        read: false,
        createdAt: new Date().toISOString()
      };
      dbState.notifications.unshift(newNotif);
      saveDb();
      return res.json({ success: true, session: newBooking });
    }

    try {
      const mentor = await MentorModel.findById(id);
      if (!mentor) return res.status(404).json({ error: "Mentor not found" });

      const newBooking = new MentorBookingModel({
        mentorId: id,
        mentorName: mentor.fullName,
        mentorAvatar: mentor.avatarUrl,
        menteeId: dbState.user.id || "student_ashish",
        menteeName: dbState.user.fullName || "Ashish Ghadigaonkar",
        topic: topic || "General Career Mentorship Session",
        date: date || new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        timeSlot: timeSlot || "4:00 PM",
        status: "Scheduled",
        meetingLink: `https://meet.google.com/meet-${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 5)}`
      });

      await newBooking.save();

      const newNotif = new NotificationModel({
        userId: dbState.user.id || "student_ashish",
        title: "Mentorship Reserved",
        message: `Session booked with ${mentor.fullName} on ${newBooking.date} at ${newBooking.timeSlot}.`,
        type: "Update",
        read: false
      });
      await newNotif.save();

      const mappedSession = {
        id: newBooking._id.toString(),
        mentorId: newBooking.mentorId,
        mentorName: newBooking.mentorName,
        mentorAvatar: newBooking.mentorAvatar,
        menteeId: newBooking.menteeId,
        menteeName: newBooking.menteeName,
        topic: newBooking.topic,
        date: newBooking.date,
        timeSlot: newBooking.timeSlot,
        status: newBooking.status,
        meetingLink: newBooking.meetingLink
      };

      res.json({ success: true, session: mappedSession });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async getBookedSessions(req: Request, res: Response) {
    if (mongoose.connection.readyState !== 1) {
      const userId = dbState.user.id || "student_ashish";
      const bookings = (dbState.sessions || []).filter(b => b.menteeId === userId);
      return res.json(bookings);
    }

    try {
      const userId = dbState.user.id || "student_ashish";
      const bookings = await MentorBookingModel.find({ menteeId: userId }).sort({ date: -1 });
      const mapped = bookings.map(b => ({
        id: b._id.toString(),
        mentorId: b.mentorId,
        mentorName: b.mentorName,
        mentorAvatar: (b as any).avatarUrl || b.mentorAvatar,
        menteeId: b.menteeId,
        menteeName: b.menteeName,
        topic: b.topic,
        date: b.date,
        timeSlot: b.timeSlot,
        status: b.status,
        meetingLink: b.meetingLink
      }));
      res.json(mapped);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}
export const mentorsController = new MentorsController();
