import mongoose from "mongoose";
import { UserModel, FollowerModel } from "../../services/mongodbService";
import { dbState, saveDb } from "../../shared/database/dbState";
import { LoggerService } from "../../shared/logger";

export class UserRepository {
  async getMe() {
    return dbState.user;
  }

  async findById(userId: string) {
    if (!userId || userId === "me" || userId === dbState.user.id || userId === "student_ashish") {
      return dbState.user;
    }

    if (mongoose.connection.readyState === 1) {
      try {
        const userDoc = await UserModel.findOne({
          $or: [
            { firebaseUid: userId },
            { _id: mongoose.isValidObjectId(userId) ? userId : undefined }
          ]
        });
        if (userDoc) {
          return {
            id: userDoc.firebaseUid || userDoc._id.toString(),
            email: userDoc.email,
            fullName: userDoc.fullName,
            role: userDoc.role,
            avatarUrl: userDoc.avatarUrl,
            coverUrl: userDoc.coverUrl,
            headline: userDoc.headline,
            bio: userDoc.bio,
            location: userDoc.location,
            skills: userDoc.skills,
            education: userDoc.education,
            experience: userDoc.experience,
            certifications: userDoc.certifications,
            achievements: userDoc.achievements,
            resumeUrl: userDoc.resumeUrl,
            links: userDoc.links,
            reputationPoints: userDoc.reputationPoints,
            badges: userDoc.badges,
                      connectionsCount: userDoc.connectionsCount,
            followersCount: userDoc.followersCount,
            theme: (userDoc as any).theme || "light"
          };
        }
      } catch (err) {
        LoggerService.warn("MongoDB user fetch error, falling back: " + err);
      }
    }

    // fallback mock lookup
    const mockProfiles: Record<string, any> = {
      user_rohan: {
        id: "user_rohan",
        fullName: "Rohan Sharma",
        role: "Backend Architect",
        avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
        coverUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
        headline: "Senior Cloud & Backend Engineer | GDSC Advisor",
        bio: "Focuses on massive scale proxy microservices, low memory consumption garbage routing systems, and high concurrency queues. Doing research on Web3 systems.",
        location: "Mumbai, India",
        skills: ["Go", "Node.js", "Express", "Docker", "Kubernetes", "Redis", "gRPC", "MongoDB"],
        education: [{ institution: "State Technological University", degree: "B.Tech Computer Science", fieldOfStudy: "Cloud & Distributed Systems", startYear: 2023, endYear: 2027 }],
        experience: [
          { title: "Technical Architecture Intern", company: "Supercomputing Labs", startDate: "May 2025 - Present", description: "Programmed real time multiplexers, handled distributed socket failures, and optimized buffer allocations." }
        ],
        certifications: ["CKA: Certified Kubernetes Administrator", "GCP Professional Cloud Dev"],
        achievements: ["Winner - national coding challenge 2026", "Gold badge: Go Contributor"],
        reputationPoints: 620,
        connectionsCount: 142,
        followersCount: 290
      },
      user_sneha: {
        id: "user_sneha",
        fullName: "Sneha Nair",
        role: "UI/UX Designer",
        avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100&q=80",
        coverUrl: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?auto=format&fit=crop&w=800&q=80",
        headline: "Product Designer & Frontend Enthusiast | Figma master",
        bio: "Crafting beautiful, accessible digital spaces. Specializes in building dark twilight visuals, framer-motion micro-animations, and typographic hierarchy systems.",
        location: "Bangalore, India",
        skills: ["Figma", "UI/UX Design", "React", "CSS Variables", "Tailwind CSS", "Motion", "A11y Standards"],
        education: [{ institution: "National Institute of Design", degree: "Bachelor of Design", fieldOfStudy: "Communication Design", startYear: 2024, endYear: 2028 }],
        experience: [
          { title: "Lead Product Designer", company: "Campus Collab Hub", startDate: "Oct 2025 - Dec 2025", description: "Created pixel perfect layouts, compiled user feedback metrics, and organized interactive UI guidelines." }
        ],
        certifications: ["NN/g Certified Designer", "HCI Interaction certification"],
        achievements: ["1st Place - National Creative Design fest 2025"],
        reputationPoints: 340,
        connectionsCount: 95,
        followersCount: 180
      },
      user_priya: {
        id: "user_priya",
        fullName: "Priya Patel",
        role: "Fullstack Architect",
        avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80",
        coverUrl: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?auto=format&fit=crop&w=800&q=80",
        headline: "Fullstack Lead | Systems Integrator | Open Source Ally",
        bio: "Highly focused on MERN architectures, system synchronization adapters, and secure JWT/OAuth authentications. Enjoys debugging memory leaks and query latencies.",
        location: "Pune, India",
        skills: ["React", "Express", "Node.js", "TypeScript", "PostgreSQL", "Mongoose", "Firebase Auth"],
        education: [{ institution: "State Technological University", degree: "B.Tech Computer Engineering", fieldOfStudy: "Software Engineering", startYear: 2023, endYear: 2027 }],
        experience: [
          { title: "Fullstack Developer Intern", company: "SaaS Systems Corp", startDate: "July 2025 - Nov 2025", description: "Built fully secure admin dashboards, automated notification workers, and optimized database queries." }
        ],
        certifications: ["MongoDB Certified Developer", "AWS Certified Developer – Associate"],
        achievements: ["Finalist - Tech India Youth Hackfest 2026", "Campus Tech Pioneer Award"],
        reputationPoints: 580,
        connectionsCount: 110,
        followersCount: 220
      }
    };

    return mockProfiles[userId] || {
      id: userId,
      fullName: userId.replace("user_", " ").replace(/^\w/, c => c.toUpperCase()),
      role: "Student Builder",
      avatarUrl: `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(userId)}`,
      coverUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
      headline: "Engineering Student Developer",
      bio: "Student exploring various fullstack web technologies, database adapters, and interactive interfaces.",
      location: "Global network node",
      skills: ["React", "CSS", "Tailwind", "Node.js", "Express"],
      education: [{ institution: "State Technical College", degree: "Undergrad Builder", fieldOfStudy: "Computer Studies", startYear: 2024, endYear: 2028 }],
      experience: [],
      certifications: ["SkillCollab Certified Student Developer"],
      achievements: ["Active Builder Milestone"],
      reputationPoints: 120,
      connectionsCount: 42,
      followersCount: 65
    };
  }

  async updateProfile(updateData: any) {
    const { 
      fullName, headline, bio, skills, education, experience, links, theme,
      college, branch, graduationYear, interests, careerGoals, onboardingCompleted
    } = updateData;
    if (fullName !== undefined) dbState.user.fullName = fullName;
    if (headline !== undefined) dbState.user.headline = headline;
    if (bio !== undefined) dbState.user.bio = bio;
    if (skills !== undefined) dbState.user.skills = skills;
    if (education !== undefined) dbState.user.education = education;
    if (experience !== undefined) dbState.user.experience = experience;
    if (links !== undefined) dbState.user.links = { ...dbState.user.links, ...links };
    if (theme !== undefined) dbState.user.theme = theme;
    if (college !== undefined) dbState.user.college = college;
    if (branch !== undefined) dbState.user.branch = branch;
    if (graduationYear !== undefined) dbState.user.graduationYear = graduationYear;
    if (interests !== undefined) dbState.user.interests = interests;
    if (careerGoals !== undefined) dbState.user.careerGoals = careerGoals;
    if (onboardingCompleted !== undefined) dbState.user.onboardingCompleted = onboardingCompleted;

    saveDb();

    if (mongoose.connection.readyState === 1 && dbState.user && dbState.user.id) {
      try {
        await UserModel.updateOne(
          { firebaseUid: dbState.user.id },
          {
            $set: {
              fullName: dbState.user.fullName,
              headline: dbState.user.headline,
              bio: dbState.user.bio,
              skills: dbState.user.skills,
              education: dbState.user.education,
              experience: dbState.user.experience,
              links: dbState.user.links,
              theme: dbState.user.theme,
              college: dbState.user.college,
              branch: dbState.user.branch,
              graduationYear: dbState.user.graduationYear,
              interests: dbState.user.interests,
              careerGoals: dbState.user.careerGoals,
              onboardingCompleted: dbState.user.onboardingCompleted,
            }
          }
        );
        LoggerService.info(`Synced profile changes to MongoDB user: ${dbState.user.fullName}`);
      } catch (err: any) {
        LoggerService.warn(`Warning updating MongoDB profile document: ${err?.message}`);
      }
    }
    return dbState.user;
  }

  async findByUsername(username: string): Promise<any> {
    const un = username.trim().toLowerCase();
    
    if (mongoose.connection.readyState === 1) {
      try {
        const userDoc = await UserModel.findOne({
          $or: [
            { username: { $regex: new RegExp("^" + un + "$", "i") } },
            { firebaseUid: un }
          ]
        });
        if (userDoc) {
          return {
            id: userDoc.firebaseUid || userDoc._id.toString(),
            email: userDoc.email,
            fullName: userDoc.fullName,
            role: userDoc.role,
            avatarUrl: userDoc.avatarUrl,
            coverUrl: userDoc.coverUrl,
            headline: userDoc.headline,
            bio: userDoc.bio,
            location: userDoc.location,
            skills: userDoc.skills,
            education: userDoc.education,
            experience: userDoc.experience,
            certifications: userDoc.certifications,
            achievements: userDoc.achievements,
            resumeUrl: userDoc.resumeUrl,
            links: userDoc.links,
            reputationPoints: userDoc.reputationPoints,
            badges: userDoc.badges,
            connectionsCount: userDoc.connectionsCount,
            followersCount: userDoc.followersCount,
            theme: (userDoc as any).theme || "light",
            username: userDoc.username || ""
          };
        }
      } catch (err) {
        LoggerService.warn("MongoDB username fetch error, falling back: " + err);
      }
    }

    if (un === "ashish" || un === "student_ashish" || un === dbState.user.username?.toLowerCase() || un === dbState.user.fullName?.toLowerCase().replace(/\s+/g, "")) {
      return { ...dbState.user, username: "ashish" };
    }
    if (un === "rohan" || un === "user_rohan" || un === "rohan_sharma") {
      return { ...await this.findById("user_rohan"), username: "rohan_sharma" };
    }
    if (un === "sneha" || un === "user_sneha" || un === "sneha_nair") {
      return { ...await this.findById("user_sneha"), username: "sneha_nair" };
    }
    if (un === "priya" || un === "user_priya" || un === "priya_patel") {
      return { ...await this.findById("user_priya"), username: "priya_patel" };
    }

    return { ...await this.findById(username), username };
  }

  async getUserSummary(userId: string) {
    const u = await this.findById(userId);
    return {
      id: u.id,
      fullName: u.fullName,
      role: u.role || "Ecosystem Partner",
      avatarUrl: u.avatarUrl,
      headline: u.headline || "",
      reputationPoints: u.reputationPoints || 100,
      username: u.username || ""
    };
  }

  async getActivity(userId: string) {
    return dbState.activities.filter(
      (a: any) => a.userId === userId || a.authorId === userId
    );
  }

  async getProjects(userId: string) {
    return dbState.projects.filter(
      (p: any) => p.creatorId === userId || p.members?.some((m: any) => m.id === userId || m.userId === userId)
    );
  }

  async getConnections(userId: string) {
    const userConns = dbState.connections.filter(
      (c: any) => c.user1Id === userId || c.user2Id === userId
    );
    const resolved = [];
    for (const conn of userConns) {
      const otherId = conn.user1Id === userId ? conn.user2Id : conn.user1Id;
      try {
        const otherUser = await this.getUserSummary(otherId);
        resolved.push(otherUser);
      } catch (err) {
        // ignore
      }
    }
    return resolved;
  }

  async getFollowers(userId: string) {
    let list: any[] = [];
    if (mongoose.connection.readyState === 1) {
      try {
        const docs = await FollowerModel.find({ followingId: userId });
        list = docs.map(d => ({ followerId: d.followerId }));
      } catch (e) {
        list = dbState.followers.filter(f => f.followingId === userId);
      }
    } else {
      list = dbState.followers.filter(f => f.followingId === userId);
    }
    const resolved = [];
    for (const item of list) {
      try {
        const otherUser = await this.getUserSummary(item.followerId);
        resolved.push(otherUser);
      } catch (err) {}
    }
    return resolved;
  }

  async getFollowing(userId: string) {
    let list: any[] = [];
    if (mongoose.connection.readyState === 1) {
      try {
        const docs = await FollowerModel.find({ followerId: userId });
        list = docs.map(d => ({ followingId: d.followingId }));
      } catch (e) {
        list = dbState.followers.filter(f => f.followerId === userId);
      }
    } else {
      list = dbState.followers.filter(f => f.followerId === userId);
    }
    const resolved = [];
    for (const item of list) {
      try {
        const otherUser = await this.getUserSummary(item.followingId);
        resolved.push(otherUser);
      } catch (err) {}
    }
    return resolved;
  }

  async getDiscoverPeers(): Promise<any[]> {
    let dbUsers: any[] = [];
    if (mongoose.connection.readyState === 1) {
      try {
        const users = await UserModel.find({}, { firebaseUid: 1, fullName: 1, role: 1, avatarUrl: 1, headline: 1 }).limit(10);
        dbUsers = users.map(u => ({
          id: u.firebaseUid || u._id.toString(),
          fullName: u.fullName,
          role: u.role || u.headline || "Sophomore Developer",
          avatarUrl: u.avatarUrl
        }));
      } catch (err) {
        LoggerService.warn("Error listing users from Mongo: " + err);
      }
    }
    
    const repoPeers = [
      { id: "user_rohan", fullName: "Rohan Sharma", role: "Backend Architect", avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80" },
      { id: "user_sneha", fullName: "Sneha Nair", role: "UI/UX Designer", avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=100&h=100&q=80" },
      { id: "user_priya", fullName: "Priya Patel", role: "Fullstack Architect", avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80" }
    ];

    const combined = [...dbUsers];
    for (const r of repoPeers) {
      if (!combined.some(u => u.id === r.id)) {
        combined.push({
          id: r.id,
          fullName: r.fullName,
          role: r.role,
          avatarUrl: r.avatarUrl
        });
      }
    }

    return combined.filter(u => u.id !== dbState.user.id);
  }
}
export const userRepository = new UserRepository();
