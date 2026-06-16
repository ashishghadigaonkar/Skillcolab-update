import { Request, Response } from "express";
import mongoose from "mongoose";
import { HackathonModel, UserModel, NotificationModel } from "../../services/mongodbService";
import { dbState, saveDb } from "../../shared/database/dbState";
import { Notification } from "../../types";

export class HackathonsController {
  async getHackathons(req: Request, res: Response) {
    if (mongoose.connection.readyState !== 1) {
      return res.json(dbState.hackathons);
    }

    try {
      const hacks = await HackathonModel.find();
      const mapped = hacks.map(h => ({
        id: h._id.toString(),
        title: h.title,
        bannerUrl: h.bannerUrl,
        organizer: h.organizer,
        description: h.description,
        startDate: h.startDate,
        endDate: h.endDate,
        prizePool: h.prizePool,
        categories: h.categories,
        status: h.status,
        registeredTeamsCount: h.registeredTeamsCount,
        rules: h.rules,
        submissions: []
      }));
      res.json(mapped);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async register(req: Request, res: Response) {
    const { id } = req.params;

    if (mongoose.connection.readyState !== 1) {
      const hackathon = dbState.hackathons.find(h => h.id === id);
      if (!hackathon) return res.status(404).json({ error: "Hackathon not found" });

      hackathon.registeredTeamsCount += 1;

      const newNotif: Notification = {
        id: `notif_${Date.now()}`,
        userId: dbState.user.id || "student_ashish",
        title: "Registered for Hackathon",
        message: `You registered for the '${hackathon.title}' challenge. Prepare your submission!`,
        type: "Update" as const,
        read: false,
        createdAt: new Date().toISOString()
      };
      dbState.notifications.unshift(newNotif);
      saveDb();
      return res.json({ success: true, hackathon });
    }

    try {
      const hackathon = await HackathonModel.findById(id);
      if (!hackathon) return res.status(404).json({ error: "Hackathon not found" });

      hackathon.registeredTeamsCount += 1;
      await hackathon.save();

      const newNotif = new NotificationModel({
        userId: dbState.user.id || "student_ashish",
        title: "Registered for Hackathon",
        message: `You registered for the '${hackathon.title}' challenge. Prepare your submission!`,
        type: "Update",
        read: false
      });
      await newNotif.save();

      res.json({ success: true, hackathon: { ...hackathon.toObject(), id: hackathon._id.toString() } });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async submit(req: Request, res: Response) {
    const { id } = req.params;
    const { teamName, projectTitle, demoUrl, githubUrl } = req.body;

    if (mongoose.connection.readyState !== 1) {
      const hackathon = dbState.hackathons.find(h => h.id === id);
      if (!hackathon) return res.status(404).json({ error: "Hackathon not found" });

      hackathon.registeredTeamsCount += 1;

      dbState.user.reputationPoints += 150;
      if (!dbState.user.badges.includes("Hackathon Submit!")) {
        dbState.user.badges.push("Hackathon Submit!");
      }
      saveDb();
      return res.json({ 
        success: true, 
        submission: { teamName, projectTitle, demoUrl, githubUrl },
        user: dbState.user 
      });
    }

    try {
      const hackathon = await HackathonModel.findById(id);
      if (!hackathon) return res.status(404).json({ error: "Hackathon not found" });

      hackathon.registeredTeamsCount += 1;
      await hackathon.save();

      const studentUser = await UserModel.findOne({ firebaseUid: dbState.user.id });
      if (studentUser) {
        studentUser.reputationPoints += 150;
        if (!studentUser.badges.includes("Hackathon Submit!")) {
          studentUser.badges.push("Hackathon Submit!");
        }
        await studentUser.save();
        
        dbState.user.reputationPoints = studentUser.reputationPoints;
        dbState.user.badges = studentUser.badges;
      }

      res.json({ 
        success: true, 
        submission: { teamName, projectTitle, demoUrl, githubUrl },
        user: dbState.user 
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}
export const hackathonsController = new HackathonsController();
