import { Request, Response } from "express";
import mongoose from "mongoose";
import { ProjectModel, TeamModel, ChatModel, MessageModel, ApplicationModel, NotificationModel } from "../../services/mongodbService";
import { dbState, saveDb } from "../../shared/database/dbState";
import { Project, Team, TeamApplication, Notification, ChatThread } from "../../types";

export class ProjectsController {
  async getProjects(req: Request, res: Response) {
    if (mongoose.connection.readyState !== 1) {
      return res.json(dbState.projects);
    }

    try {
      const projects = await ProjectModel.find().sort({ createdAt: -1 });
      const mappedProjects = projects.map(p => ({
        id: p._id.toString(),
        title: p.title,
        tagline: p.tagline,
        description: p.description,
        creatorId: p.creatorId,
        creatorName: p.creatorName,
        creatorAvatar: p.creatorAvatar,
        skillsNeeded: p.skillsNeeded,
        tags: p.tags,
        difficulty: p.difficulty,
        status: p.status,
        teamSizeLimit: p.teamSizeLimit,
        currentTeamSize: p.currentTeamSize,
        createdAt: p.createdAt.toISOString(),
        milestones: p.milestones,
        attachments: p.attachments
      }));
      res.json(mappedProjects);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async createProject(req: Request, res: Response) {
    const { title, tagline, description, skillsNeeded, tags, difficulty, teamSizeLimit } = req.body;
    
    if (!title || !tagline || !description) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    if (mongoose.connection.readyState !== 1) {
      const projectId = `proj_${Date.now()}`;
      const newProject: Project = {
        id: projectId,
        title,
        tagline,
        description,
        creatorId: dbState.user.id || "student_ashish",
        creatorName: dbState.user.fullName || "Ashish Ghadigaonkar",
        creatorAvatar: dbState.user.avatarUrl || "",
        skillsNeeded: skillsNeeded || [],
        tags: tags || [],
        difficulty: difficulty || "Intermediate",
        status: "Recruiting",
        teamSizeLimit: Number(teamSizeLimit) || 4,
        currentTeamSize: 1,
        createdAt: new Date().toISOString(),
        milestones: [
          { id: `ml_1`, title: "Project Inception", description: "Define task schedules and system designs.", status: "Pending", dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10) }
        ],
        attachments: []
      };
      dbState.projects.unshift(newProject);
      
      const newTeam: Team = {
        id: `team_${Date.now()}`,
        projectId,
        projectTitle: title,
        leaderId: dbState.user.id || "student_ashish",
        members: [
          {
            userId: dbState.user.id || "student_ashish",
            fullName: dbState.user.fullName || "Ashish Ghadigaonkar",
            avatarUrl: dbState.user.avatarUrl || "",
            role: "Project Lead / Entrepreneur",
            joinedAt: new Date().toISOString()
          }
        ],
        invitees: []
      };
      dbState.teams.unshift(newTeam);

      const newChat: ChatThread = {
        id: projectId,
        title: `${title} - Workspace`,
        avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=100&h=100&q=80",
        type: "Project" as const,
        lastMessage: "System: Team channel created.",
        lastMessageTime: new Date().toISOString(),
        unreadCount: 0,
        messages: []
      };
      dbState.chats.unshift(newChat);
      saveDb();
      return res.json({ success: true, project: newProject, team: newTeam });
    }

    try {
      const newProjectDoc = new ProjectModel({
        title,
        tagline,
        description,
        creatorId: dbState.user.id || "student_ashish",
        creatorName: dbState.user.fullName || "Ashish Ghadigaonkar",
        creatorAvatar: dbState.user.avatarUrl || "",
        skillsNeeded: skillsNeeded || [],
        tags: tags || [],
        difficulty: difficulty || "Intermediate",
        status: "Recruiting",
        teamSizeLimit: Number(teamSizeLimit) || 4,
        currentTeamSize: 1,
        milestones: [
          { id: `ml_1`, title: "Project Inception", description: "Define task schedules and system designs.", status: "Pending", dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10) }
        ],
        attachments: []
      });

      const savedProject = await newProjectDoc.save();
      const projectId = savedProject._id.toString();

      const newTeamDoc = new TeamModel({
        projectId,
        projectTitle: savedProject.title,
        leaderId: dbState.user.id || "student_ashish",
        members: [
          {
            userId: dbState.user.id || "student_ashish",
            fullName: dbState.user.fullName || "Ashish Ghadigaonkar",
            avatarUrl: dbState.user.avatarUrl || "",
            role: "Project Lead / Entrepreneur",
            joinedAt: new Date()
          }
        ],
        invitees: []
      });

      const savedTeam = await newTeamDoc.save();

      const newChatDoc = new ChatModel({
        threadId: projectId,
        title: `${savedProject.title} - Workspace`,
        avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=100&h=100&q=80",
        type: "Project",
        lastMessage: "System: Team channel created.",
        lastMessageTime: new Date(),
        unreadCount: 0
      });

      await newChatDoc.save();

      const firstMessageDoc = new MessageModel({
        threadId: projectId,
        senderId: "System",
        senderName: "CollabBot",
        senderAvatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=100&h=100&q=80",
        content: `Welcome to the active workspace for ${savedProject.title}! Chat with your team here.`,
        read: false
      });

      await firstMessageDoc.save();

      const mappedProj: Project = {
        id: projectId,
        title: savedProject.title,
        tagline: savedProject.tagline,
        description: savedProject.description,
        creatorId: savedProject.creatorId,
        creatorName: savedProject.creatorName,
        creatorAvatar: savedProject.creatorAvatar,
        skillsNeeded: savedProject.skillsNeeded,
        tags: savedProject.tags,
        difficulty: savedProject.difficulty as any,
        status: savedProject.status as any,
        teamSizeLimit: savedProject.teamSizeLimit,
        currentTeamSize: savedProject.currentTeamSize,
        createdAt: (savedProject as any).createdAt ? (savedProject as any).createdAt.toISOString() : new Date().toISOString(),
        milestones: savedProject.milestones,
        attachments: savedProject.attachments
      };

      const mappedTeam: Team = {
        id: savedTeam._id.toString(),
        projectId,
        projectTitle: savedTeam.projectTitle,
        leaderId: savedTeam.leaderId,
        members: savedTeam.members.map(m => ({
          userId: m.userId,
          fullName: m.fullName,
          avatarUrl: m.avatarUrl,
          role: m.role,
          joinedAt: m.joinedAt.toISOString()
        })),
        invitees: savedTeam.invitees
      };

      res.json({ success: true, project: mappedProj, team: mappedTeam });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async applyToProject(req: Request, res: Response) {
    const { id } = req.params;
    const { requestedRole, coverLetter } = req.body;

    if (mongoose.connection.readyState !== 1) {
      const project = dbState.projects.find(p => p.id === id);
      if (!project) return res.status(404).json({ error: "Project not found" });

      const existingApp = dbState.applications.find(a => a.projectId === id && a.applicantId === (dbState.user.id || "student_ashish"));
      if (existingApp) {
        return res.status(400).json({ error: "You have already applied to this project squad" });
      }

      const newApp: TeamApplication = {
        id: `app_${Date.now()}`,
        projectId: id,
        projectTitle: project.title,
        applicantId: dbState.user.id || "student_ashish",
        applicantName: dbState.user.fullName || "Ashish Ghadigaonkar",
        applicantAvatar: dbState.user.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
        applicantHeadline: dbState.user.headline || "Enthusiastic Developer",
        applicantSkills: dbState.user.skills || [],
        requestedRole: requestedRole || "General Developer",
        coverLetter: coverLetter || "Highly interested in matching up with the team.",
        status: "Pending" as any,
        createdAt: new Date().toISOString()
      };

      dbState.applications.unshift(newApp);

      const newNotif: Notification = {
        id: `notif_${Date.now()}`,
        userId: project.creatorId,
        title: "New Application Received",
        message: `${dbState.user.fullName || "Someone"} applied to join ${project.title} as ${requestedRole || "developer"}.`,
        type: "Application" as const,
        read: false,
        createdAt: new Date().toISOString()
      };

      dbState.notifications.unshift(newNotif);
      saveDb();
      return res.json({ success: true, application: newApp });
    }

    try {
      const project = await ProjectModel.findById(id);
      if (!project) return res.status(404).json({ error: "Project not found" });

      const existingApp = await ApplicationModel.findOne({ projectId: id, applicantId: dbState.user.id || "student_ashish" });
      if (existingApp) {
        return res.status(400).json({ error: "You have already applied to this project squad" });
      }

      const newAppDoc = new ApplicationModel({
        projectId: id,
        projectTitle: project.title,
        applicantId: dbState.user.id || "student_ashish",
        applicantName: dbState.user.fullName || "Ashish Ghadigaonkar",
        applicantAvatar: dbState.user.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
        applicantHeadline: dbState.user.headline || "Enthusiastic Developer",
        applicantSkills: dbState.user.skills || [],
        requestedRole: requestedRole || "General Developer",
        coverLetter: coverLetter || "Highly interested in matching up with the team.",
        status: "Pending"
      });

      const savedApp = await newAppDoc.save();

      const newNotif = new NotificationModel({
        userId: project.creatorId,
        title: "New Application Received",
        message: `${dbState.user.fullName || "Someone"} applied to join ${project.title} as ${requestedRole || "developer"}.`,
        type: "Application",
        read: false,
        actionUrl: `/projects`
      });

      await newNotif.save();

      const mappedApp = {
        id: savedApp._id.toString(),
        projectId: savedApp.projectId,
        projectTitle: savedApp.projectTitle,
        applicantId: savedApp.applicantId,
        applicantName: savedApp.applicantName,
        applicantAvatar: savedApp.applicantAvatar,
        applicantHeadline: savedApp.applicantHeadline,
        applicantSkills: savedApp.applicantSkills,
        requestedRole: savedApp.requestedRole,
        coverLetter: savedApp.coverLetter,
        status: savedApp.status,
        createdAt: (savedApp as any).createdAt ? (savedApp as any).createdAt.toISOString() : new Date().toISOString()
      };

      res.json({ success: true, application: mappedApp });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async getApplications(req: Request, res: Response) {
    if (mongoose.connection.readyState !== 1) {
      return res.json(dbState.applications);
    }

    try {
      const apps = await ApplicationModel.find().sort({ createdAt: -1 });
      const mapped = apps.map(a => ({
        id: a._id.toString(),
        projectId: a.projectId,
        projectTitle: a.projectTitle,
        applicantId: a.applicantId,
        applicantName: a.applicantName,
        applicantAvatar: a.applicantAvatar,
        applicantHeadline: a.applicantHeadline,
        applicantSkills: a.applicantSkills,
        requestedRole: a.requestedRole,
        coverLetter: a.coverLetter,
        status: a.status,
        createdAt: (a as any).createdAt ? (a as any).createdAt.toISOString() : new Date().toISOString()
      }));
      res.json(mapped);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async updateApplicationStatus(req: Request, res: Response) {
    const { appId } = req.params;
    const { status } = req.body;

    if (mongoose.connection.readyState !== 1) {
      const application = dbState.applications.find(a => a.id === appId);
      if (!application) return res.status(404).json({ error: "Application not found" });

      application.status = status;

      if (status === "Approved") {
        const project = dbState.projects.find(p => p.id === application.projectId);
        const team = dbState.teams.find(t => t.projectId === application.projectId);

        if (project && team) {
          const alreadyMember = team.members.some(m => m.userId === application.applicantId);
          if (!alreadyMember) {
            team.members.push({
              userId: application.applicantId,
              fullName: application.applicantName,
              avatarUrl: application.applicantAvatar,
              role: application.requestedRole,
              joinedAt: new Date().toISOString()
            });

            project.currentTeamSize = team.members.length;
            if (project.currentTeamSize >= project.teamSizeLimit) {
              project.status = "In Progress" as any;
            }
          }
        }
      }

      const newNotif: Notification = {
        id: `nt_${Date.now()}`,
        userId: application.applicantId,
        title: `Project Application ${status}`,
        message: `Your request to join team '${application.projectTitle}' was ${status.toLowerCase()}.`,
        type: "Update" as const,
        read: false,
        createdAt: new Date().toISOString()
      };
      dbState.notifications.unshift(newNotif);
      saveDb();
      return res.json({ success: true, application });
    }

    try {
      const application = await ApplicationModel.findById(appId);
      if (!application) return res.status(404).json({ error: "Application not found" });

      application.status = status;
      await application.save();

      if (status === "Approved") {
        const project = await ProjectModel.findById(application.projectId);
        const team = await TeamModel.findOne({ projectId: application.projectId });

        if (project && team) {
          const alreadyMember = team.members.some(m => m.userId === application.applicantId);
          if (!alreadyMember) {
            team.members.push({
              userId: application.applicantId,
              fullName: application.applicantName,
              avatarUrl: application.applicantAvatar,
              role: application.requestedRole,
              joinedAt: new Date()
            });
            await team.save();

            project.currentTeamSize = team.members.length;
            if (project.currentTeamSize >= project.teamSizeLimit) {
              project.status = "In Progress";
            }
            await project.save();
          }
        }
      }

      const newNotif = new NotificationModel({
        userId: application.applicantId,
        title: `Project Application ${status}`,
        message: `Your request to join team '${application.projectTitle}' was ${status.toLowerCase()}.`,
        type: "Update",
        read: false
      });
      await newNotif.save();

      const mappedApp = {
        id: application._id.toString(),
        projectId: application.projectId,
        projectTitle: application.projectTitle,
        applicantId: application.applicantId,
        applicantName: application.applicantName,
        applicantAvatar: application.applicantAvatar,
        applicantHeadline: application.applicantHeadline,
        applicantSkills: application.applicantSkills,
        requestedRole: application.requestedRole,
        coverLetter: application.coverLetter,
        status: application.status,
        createdAt: (application as any).createdAt ? (application as any).createdAt.toISOString() : new Date().toISOString()
      };

      res.json({ success: true, application: mappedApp });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async addMilestone(req: Request, res: Response) {
    const { id } = req.params;
    const { title, description, dueDate } = req.body;

    if (mongoose.connection.readyState !== 1) {
      const project = dbState.projects.find(p => p.id === id);
      if (!project) return res.status(404).json({ error: "Project not found" });

      const newMilestone = {
        id: `ml_${Date.now()}`,
        title,
        description,
        status: "Pending" as const,
        dueDate: dueDate || new Date().toISOString().slice(0, 10)
      };

      project.milestones.push(newMilestone);
      saveDb();
      return res.json({ success: true, milestone: newMilestone });
    }

    try {
      const project = await ProjectModel.findById(id);
      if (!project) return res.status(404).json({ error: "Project not found" });

      const newMilestone = {
        id: `ml_${Date.now()}`,
        title,
        description,
        status: "Pending" as const,
        dueDate: dueDate || new Date().toISOString().slice(0, 10)
      };

      project.milestones.push(newMilestone);
      await project.save();
      res.json({ success: true, milestone: newMilestone });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async patchMilestone(req: Request, res: Response) {
    const { id, milestoneId } = req.params;
    const { status } = req.body;

    if (mongoose.connection.readyState !== 1) {
      const project = dbState.projects.find(p => p.id === id);
      if (!project) return res.status(404).json({ error: "Project not found" });

      const milestone = project.milestones.find(m => m.id === milestoneId);
      if (!milestone) return res.status(404).json({ error: "Milestone not found" });

      milestone.status = status;
      saveDb();
      return res.json({ success: true, milestone });
    }

    try {
      const project = await ProjectModel.findById(id);
      if (!project) return res.status(404).json({ error: "Project not found" });

      const milestone = project.milestones.find(m => m.id === milestoneId);
      if (!milestone) return res.status(404).json({ error: "Milestone not found" });

      milestone.status = status;
      await project.save();
      res.json({ success: true, milestone });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async getTeams(req: Request, res: Response) {
    if (mongoose.connection.readyState !== 1) {
      return res.json(dbState.teams);
    }

    try {
      const teams = await TeamModel.find();
      const mapped = teams.map(t => ({
        id: t._id.toString(),
        projectId: t.projectId,
        projectTitle: t.projectTitle,
        leaderId: t.leaderId,
        members: t.members.map(m => ({
          userId: m.userId,
          fullName: m.fullName,
          avatarUrl: m.avatarUrl,
          role: m.role,
          joinedAt: m.joinedAt.toISOString()
        })),
        invitees: t.invitees
      }));
      res.json(mapped);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }
}
export const projectsController = new ProjectsController();
