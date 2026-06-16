import { Request, Response } from "express";
import mongoose from "mongoose";
import { InternshipModel, StartupIdeaModel, UserModel, NotificationModel } from "../../services/mongodbService";
import { dbState, saveDb } from "../../shared/database/dbState";
import { Notification } from "../../types";

export class OpportunitiesController {
  // --- Internships ---
  async getInternships(req: Request, res: Response) {
    if (mongoose.connection.readyState !== 1) {
      return res.json(dbState.internships);
    }

    try {
      const internships = await InternshipModel.find().sort({ createdAt: -1 });
      const mapped = internships.map(i => ({
        id: i._id.toString(),
        title: i.title,
        companyName: i.companyName,
        companyLogo: i.companyLogo,
        location: i.location,
        type: i.type,
        duration: i.duration,
        stipend: i.stipend,
        skillsRequired: i.skillsRequired,
        description: i.description,
        applyBy: i.applyBy,
        applicantsCount: i.applicantsCount,
        applicants: i.applicants
      }));
      res.json(mapped);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async createInternship(req: Request, res: Response) {
    const { title, companyName, stipend, skillsRequired, location, type, duration, description } = req.body;
    if (!title || !companyName) {
      return res.status(400).json({ error: "Missing company or title details" });
    }

    if (mongoose.connection.readyState !== 1) {
      const newInter = {
        id: `intern_${Date.now()}`,
        title,
        companyName,
        companyLogo: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=100&h=100&q=80",
        stipend: stipend || "Competitive Stipend",
        skillsRequired: skillsRequired || ["ReactJS"],
        location: location || "Remote",
        type: type || "Remote",
        duration: duration || "3 Months",
        description: description || "Looking for eager front-end developer wizards.",
        applyBy: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        applicantsCount: 0,
        applicants: []
      };

      dbState.internships.unshift(newInter as any);
      saveDb();
      return res.json({ success: true, internship: newInter });
    }

    try {
      const newInternship = new InternshipModel({
        title,
        companyName,
        companyLogo: "https://images.unsplash.com/photo-1542744094-3a31f103e35f?auto=format&fit=crop&w=100&h=100&q=80",
        stipend: stipend || "Competitive Stipend",
        skillsRequired: skillsRequired || ["ReactJS"],
        location: location || "Remote",
        type: type || "Remote",
        duration: duration || "3 Months",
        description: description || "Looking for eager front-end developer wizards.",
        applyBy: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
        applicantsCount: 0,
        applicants: []
      });

      const saved = await newInternship.save();
      res.json({ success: true, internship: { ...saved.toObject(), id: saved._id.toString() } });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async applyInternship(req: Request, res: Response) {
    const { id } = req.params;

    if (mongoose.connection.readyState !== 1) {
      const internship = dbState.internships.find(i => i.id === id);
      if (!internship) return res.status(404).json({ error: "Internship post not found" });

      const alreadyApplied = (internship.applicants || []).some(a => a.userId === (dbState.user.id || "student_ashish"));
      if (alreadyApplied) {
        return res.status(400).json({ error: "You've already applied for this slot" });
      }

      if (!internship.applicants) internship.applicants = [];
      internship.applicants.push({
        userId: dbState.user.id || "student_ashish",
        fullName: dbState.user.fullName || "Ashish Ghadigaonkar",
        avatarUrl: dbState.user.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
        resumeUrl: dbState.user.resumeUrl || "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        status: "Applied" as any,
        appliedAt: new Date().toISOString() as any
      });

      internship.applicantsCount = internship.applicants.length;

      const newNotif: Notification = {
        id: `notif_${Date.now()}`,
        userId: dbState.user.id || "student_ashish",
        title: "Internship Application Sent",
        message: `Your credentials was successfully submitted to '${internship.companyName}' for '${internship.title}'.`,
        type: "Update" as const,
        read: false,
        createdAt: new Date().toISOString()
      };
      dbState.notifications.unshift(newNotif);
      saveDb();
      return res.json({ success: true, internship });
    }

    try {
      const internship = await InternshipModel.findById(id);
      if (!internship) return res.status(404).json({ error: "Internship post not found" });

      const alreadyApplied = internship.applicants.some(a => a.userId === (dbState.user.id || "student_ashish"));
      if (alreadyApplied) {
        return res.status(400).json({ error: "You've already applied for this slot" });
      }

      const applicantUser = await UserModel.findOne({ firebaseUid: dbState.user.id });

      internship.applicants.push({
        userId: dbState.user.id || "student_ashish",
        fullName: dbState.user.fullName || "Ashish Ghadigaonkar",
        avatarUrl: dbState.user.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
        resumeUrl: applicantUser?.resumeUrl || dbState.user.resumeUrl || "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        status: "Applied",
        appliedAt: new Date()
      });

      internship.applicantsCount = internship.applicants.length;
      await internship.save();

      const newNotif = new NotificationModel({
        userId: dbState.user.id || "student_ashish",
        title: "Internship Application Sent",
        message: `Your credentials was successfully submitted to '${internship.companyName}' for '${internship.title}'.`,
        type: "Update",
        read: false
      });
      await newNotif.save();

      res.json({ success: true, internship: { ...internship.toObject(), id: internship._id.toString() } });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  // --- Co-Founder Posts ---
  async getCofounderPosts(req: Request, res: Response) {
    if (mongoose.connection.readyState !== 1) {
      return res.json((dbState as any).cofounderPosts || []);
    }

    try {
      const posts = await StartupIdeaModel.find().sort({ createdAt: -1 });
      const mapped = posts.map(p => ({
        id: p._id.toString(),
        title: p.title,
        tagline: p.problem,
        description: p.description,
        authorName: p.authorName,
        authorRole: p.authorRole,
        authorAvatar: p.authorAvatar,
        skillsNeeded: p.tags,
        equityOffer: p.equityOffer || "15% - 25%",
        applicantsCount: p.neededRoles.length || 0,
        createdAt: (p as any).createdAt ? (p as any).createdAt.toISOString() : new Date().toISOString()
      }));
      res.json(mapped);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async createCofounderPost(req: Request, res: Response) {
    const { title, tagline, description, authorName, authorRole, skillsNeeded, equityOffer } = req.body;
    if (!title || !description || !tagline) {
      return res.status(400).json({ error: "Missing required co-founder posting fields" });
    }

    if (mongoose.connection.readyState !== 1) {
      const newPost = {
        id: `cf_${Date.now()}`,
        title,
        tagline,
        description,
        authorName: authorName || dbState.user.fullName,
        authorRole: authorRole || "Lead Founder",
        authorAvatar: dbState.user.avatarUrl,
        skillsNeeded: skillsNeeded || ["React", "Node.js"],
        equityOffer: equityOffer || "10% - 20%",
        applicantsCount: 0,
        createdAt: new Date().toISOString()
      };

      if (!(dbState as any).cofounderPosts) (dbState as any).cofounderPosts = [];
      (dbState as any).cofounderPosts.unshift(newPost);
      saveDb();
      return res.json({ success: true, post: newPost });
    }

    try {
      const newPostDoc = new StartupIdeaModel({
        title,
        description: description,
        problem: tagline,
        solution: "General automated MVP platform setup",
        tags: skillsNeeded || ["React", "Node.js"],
        authorId: dbState.user.id || "student_ashish",
        authorName: authorName || dbState.user.fullName || "Ashish Ghadigaonkar",
        authorRole: authorRole || "Lead Founder",
        authorAvatar: dbState.user.avatarUrl || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=100&h=100&q=80",
        neededRoles: skillsNeeded || [],
        equityOffer: equityOffer || "10% - 20%"
      });

      const saved = await newPostDoc.save();
      
      const mapped = {
        id: saved._id.toString(),
        title: saved.title,
        tagline: saved.problem,
        description: saved.description,
        authorName: saved.authorName,
        authorRole: saved.authorRole,
        authorAvatar: saved.authorAvatar,
        skillsNeeded: saved.tags,
        equityOffer: saved.equityOffer,
        applicantsCount: 0,
        createdAt: (saved as any).createdAt ? (saved as any).createdAt.toISOString() : new Date().toISOString()
      };

      res.json({ success: true, post: mapped });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async applyCofounderPost(req: Request, res: Response) {
    const { id } = req.params;

    if (mongoose.connection.readyState !== 1) {
      const posts = (dbState as any).cofounderPosts || [];
      const post = posts.find((p: any) => p.id === id);
      if (!post) return res.status(404).json({ error: "Post not found" });

      post.applicantsCount += 1;

      const newNotif: Notification = {
        id: `notif_${Date.now()}`,
        userId: dbState.user.id,
        title: "New Co-Founder Pitch!",
        message: `${dbState.user.fullName} pitched for your idea: "${post.title}". High skills match score!`,
        type: "Application" as const,
        read: false,
        createdAt: new Date().toISOString()
      };
      dbState.notifications.unshift(newNotif);
      saveDb();
      return res.json({ success: true, post });
    }

    try {
      const post = await StartupIdeaModel.findById(id);
      if (!post) return res.status(404).json({ error: "Post not found" });

      const newNotif = new NotificationModel({
        userId: post.authorId,
        title: "New Co-Founder Pitch!",
        message: `${dbState.user.fullName || "Someone"} pitched for your idea: "${post.title}". High skills match score!`,
        type: "Application",
        read: false
      });
      await newNotif.save();

      res.json({ success: true, post: { ...post.toObject(), id: post._id.toString(), tagline: post.problem, skillsNeeded: post.tags, applicantsCount: 1 } });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  // --- Open Source Hub ---
  async getOpenSourceIssues(req: Request, res: Response) {
    const sampleIssues = [
      {
        id: "os_1",
        repoName: "react-ui-accessible-flyout",
        issueTitle: "accessibility: support keyboard focus and high-contrast styling inside drawer modal",
        issueNumber: 64,
        difficulty: "Good First Issue",
        languages: ["React", "CSS", "TypeScript"],
        stars: 480,
        description: "Ensure that flyout cards handle keyboard focus transitions cleanly and respect standard contrast benchmarks."
      },
      {
        id: "os_2",
        repoName: "express-rate-limit-redis",
        issueTitle: "bug: optimize redis connection pool release during high-frequency server recycles",
        issueNumber: 119,
        difficulty: "Intermediate",
        languages: ["TypeScript", "Node.js", "Redis"],
        stars: 1450,
        description: "Connection pool leaks threads if express server undergoing massive Docker container cold starts."
      },
      {
        id: "os_3",
        repoName: "d3-analytics-dashboard",
        issueTitle: "feature: implement responsive container width triggers to redraw canvas on resize",
        issueNumber: 247,
        difficulty: "Advanced",
        languages: ["React", "D3.js", "SVG"],
        stars: 890,
        description: "Charts currently overlap frame margins on tablet devices. Use ResizeObserver to trigger custom canvas layouts."
      }
    ];
    res.json(sampleIssues);
  }

  async logOpenSourceContribution(req: Request, res: Response) {
    const { issueId, pullRequestUrl, comment } = req.body;
    if (!issueId || !pullRequestUrl) {
      return res.status(400).json({ error: "Missing contribution data" });
    }

    const pointsEarned = issueId === "os_1" ? 75 : issueId === "os_2" ? 150 : 250;

    if (mongoose.connection.readyState !== 1) {
      dbState.user.reputationPoints += pointsEarned;
      if (!dbState.user.badges.includes("Open Source Ally")) {
        dbState.user.badges.push("Open Source Ally");
      }

      const notification: Notification = {
        id: `notif_${Date.now()}`,
        userId: dbState.user.id || "student_ashish",
        title: "Points Awarded!",
        message: `Logged contribution. Earned +${pointsEarned} Rep Points!`,
        type: "Update" as const,
        read: false,
        createdAt: new Date().toISOString()
      };
      dbState.notifications.unshift(notification);
      saveDb();
      return res.json({ success: true, pointsEarned, user: dbState.user });
    }

    try {
      const user = await UserModel.findOne({ firebaseUid: dbState.user.id });
      if (user) {
        user.reputationPoints += pointsEarned;
        if (!user.badges.includes("Open Source Ally")) {
          user.badges.push("Open Source Ally");
        }
        await user.save();
        
        dbState.user.reputationPoints = user.reputationPoints;
        dbState.user.badges = user.badges;
      }

      const notification = new NotificationModel({
        userId: dbState.user.id || "student_ashish",
        title: "Points Awarded!",
        message: `Logged contribution. Earned +${pointsEarned} Rep Points!`,
        type: "Update",
        read: false
      });
      await notification.save();

      res.json({ success: true, pointsEarned, user: dbState.user });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}
export const opportunitiesController = new OpportunitiesController();
