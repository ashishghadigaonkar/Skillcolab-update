/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import mongoose, { Schema, Document, Model } from "mongoose";
import { User, UserRole } from "../types";

// ==========================================
// MONGODB USER SCHEMA DEFINITION
// ==========================================

export interface IUserDocument extends Document, Omit<User, "id"> {
  firebaseUid: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl: string;
  coverUrl?: string;
  headline?: string;
  bio?: string;
  location?: string;
  skills: string[];
  education: {
    institution: string;
    degree: string;
    fieldOfStudy: string;
    startYear: number;
    endYear?: number;
  }[];
  experience: {
    title: string;
    company: string;
    location?: string;
    startDate: string;
    endDate?: string;
    description?: string;
  }[];
  certifications: string[];
  achievements: string[];
  resumeUrl?: string;
  links: {
    github?: string;
    linkedin?: string;
    portfolio?: string;
  };
  reputationPoints: number;
  badges: string[];
  connectionsCount: number;
  followersCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUserDocument>(
  {
    firebaseUid: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true, unique: true, index: true },
    fullName: { type: String, required: true },
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    username: { type: String, default: "" },
    password: { type: String, default: "" },
    college: { type: String, default: "" },
    branch: { type: String, default: "" },
    graduationYear: { type: Number, default: null },
    interests: { type: [String], default: [] },
    careerGoals: { type: String, default: "" },
    isEmailVerified: { type: Boolean, default: false },
    googleId: { type: String, default: "" },
    githubId: { type: String, default: "" },
    provider: { type: String, default: "email" },
    accountStatus: { type: String, default: "Active" },
    role: { 
      type: String, 
      enum: Object.values(UserRole), 
      default: UserRole.STUDENT 
    },
    avatarUrl: { type: String, default: "" },
    coverUrl: { type: String, default: "" },
    headline: { type: String, default: "" },
    bio: { type: String, default: "" },
    location: { type: String, default: "" },
    skills: { type: [String], default: [] },
    education: [{
      institution: { type: String, required: true },
      degree: { type: String, required: true },
      fieldOfStudy: { type: String, required: true },
      startYear: { type: Number, required: true },
      endYear: { type: Number }
    }],
    experience: [{
      title: { type: String, required: true },
      company: { type: String, required: true },
      location: { type: String },
      startDate: { type: String, required: true },
      endDate: { type: String },
      description: { type: String }
    }],
    certifications: { type: [String], default: [] },
    achievements: { type: [String], default: [] },
    resumeUrl: { type: String, default: "" },
    links: {
      github: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      portfolio: { type: String, default: "" }
    },
    reputationPoints: { type: Number, default: 100 },
    badges: { type: [String], default: [] },
    connectionsCount: { type: Number, default: 0 },
    followersCount: { type: Number, default: 0 },
    theme: { type: String, enum: ["light", "dark"], default: "light" }
  },
  {
    timestamps: true
  }
);

// Search optimization Indexes
UserSchema.index({ email: 1, firebaseUid: 1 });
UserSchema.index({ skills: "text", fullName: "text", headline: "text" });

// Prevent mongoose OverwriteModelError across runtime reloads
export const UserModel: Model<IUserDocument> = 
  mongoose.models.User || mongoose.model<IUserDocument>("User", UserSchema);

// ==========================================
// MONGODB SCHEMAS FOR SAAS MODULES
// ==========================================

// 1. Projects
export interface IProjectDocument extends Document {
  title: string;
  tagline: string;
  description: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  skillsNeeded: string[];
  tags: string[];
  difficulty: string;
  status: string;
  teamSizeLimit: number;
  currentTeamSize: number;
  milestones: {
    id: string;
    title: string;
    description: string;
    status: "Pending" | "Done";
    dueDate: string;
  }[];
  attachments: {
    name: string;
    url: string;
  }[];
  createdAt: Date;
}

const ProjectSchema = new Schema<IProjectDocument>({
  title: { type: String, required: true },
  tagline: { type: String, required: true },
  description: { type: String, required: true },
  creatorId: { type: String, required: true, index: true },
  creatorName: { type: String, required: true },
  creatorAvatar: { type: String, required: true },
  skillsNeeded: { type: [String], default: [] },
  tags: { type: [String], default: [] },
  difficulty: { type: String, default: "Intermediate" },
  status: { type: String, default: "Recruiting" },
  teamSizeLimit: { type: Number, default: 4 },
  currentTeamSize: { type: Number, default: 1 },
  milestones: [{
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    status: { type: String, enum: ["Pending", "Done"], default: "Pending" },
    dueDate: { type: String, required: true }
  }],
  attachments: [{
    name: { type: String, required: true },
    url: { type: String, required: true }
  }]
}, { timestamps: true });

ProjectSchema.index({ title: "text", tagline: "text", description: "text", tags: "text" });

export const ProjectModel: Model<IProjectDocument> =
  mongoose.models.Project || mongoose.model<IProjectDocument>("Project", ProjectSchema);

// 2. Teams
export interface ITeamDocument extends Document {
  projectId: string;
  projectTitle: string;
  leaderId: string;
  members: {
    userId: string;
    fullName: string;
    avatarUrl: string;
    role: string;
    joinedAt: Date;
  }[];
  invitees: string[];
}

const TeamSchema = new Schema<ITeamDocument>({
  projectId: { type: String, required: true, unique: true, index: true },
  projectTitle: { type: String, required: true },
  leaderId: { type: String, required: true, index: true },
  members: [{
    userId: { type: String, required: true },
    fullName: { type: String, required: true },
    avatarUrl: { type: String, required: true },
    role: { type: String, required: true },
    joinedAt: { type: Date, default: Date.now }
  }],
  invitees: { type: [String], default: [] }
}, { timestamps: true });

export const TeamModel: Model<ITeamDocument> =
  mongoose.models.Team || mongoose.model<ITeamDocument>("Team", TeamSchema);

// 3. Applications
export interface IApplicationDocument extends Document {
  projectId: string;
  projectTitle: string;
  applicantId: string;
  applicantName: string;
  applicantAvatar: string;
  applicantHeadline: string;
  applicantSkills: string[];
  requestedRole: string;
  coverLetter: string;
  status: string;
}

const ApplicationSchema = new Schema<IApplicationDocument>({
  projectId: { type: String, required: true, index: true },
  projectTitle: { type: String, required: true },
  applicantId: { type: String, required: true, index: true },
  applicantName: { type: String, required: true },
  applicantAvatar: { type: String, required: true },
  applicantHeadline: { type: String, default: "" },
  applicantSkills: { type: [String], default: [] },
  requestedRole: { type: String, required: true },
  coverLetter: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" }
}, { timestamps: true });

export const ApplicationModel: Model<IApplicationDocument> =
  mongoose.models.Application || mongoose.model<IApplicationDocument>("Application", ApplicationSchema);

// 4. Activities (LinkedIn style Social Feed)
export interface IActivityDocument extends Document {
  userId: string;
  authorName: string;
  authorRole: string;
  authorAvatar: string;
  type: string; // SocialPost, ProjectUpdate, HackathonOpportunity, etc.
  content: string;
  createdAt?: Date;
  skills?: string[];
  likesCount: number;
  commentsCount?: number;
  sharesCount?: number;
  repostsCount?: number;
  reportsCount?: number;
  likes?: string[]; // Array of userIds who liked
  saves?: string[]; // Array of userIds who saved
  comments?: any[];
  projectMeta?: {
    id?: string;
    title: string;
    tagline: string;
    teamSizeLimit?: number;
    currentTeamSize?: number;
    difficulty?: string;
  };
  opportunityMeta?: {
    id?: string;
    title?: string;
    description?: string;
    role?: string;
    companyName?: string;
    companyLogo?: string;
    deadline?: string;
    location?: string;
    opportunityType?: string; // hackathon, internship, startup, open-source, mentor
    mentorAvailability?: string;
    price?: string;
    githubLink?: string;
    issueTitle?: string;
    starsCount?: number;
  };
  meta?: {
    targetId?: string;
    targetTitle?: string;
  };
}

const ActivitySchema = new Schema<IActivityDocument>({
  userId: { type: String, required: true, index: true },
  authorName: { type: String, required: true },
  authorRole: { type: String, required: true },
  authorAvatar: { type: String, required: true },
  type: { type: String, required: true },
  content: { type: String, required: true },
  skills: { type: [String], default: [] },
  likesCount: { type: Number, default: 0 },
  commentsCount: { type: Number, default: 0 },
  sharesCount: { type: Number, default: 0 },
  repostsCount: { type: Number, default: 0 },
  reportsCount: { type: Number, default: 0 },
  likes: { type: [String], default: [] },
  saves: { type: [String], default: [] },
  comments: { type: [Schema.Types.Mixed], default: [] } as any,
  projectMeta: {
    id: { type: String },
    title: { type: String },
    tagline: { type: String },
    teamSizeLimit: { type: Number },
    currentTeamSize: { type: Number },
    difficulty: { type: String }
  },
  opportunityMeta: {
    id: { type: String },
    title: { type: String },
    description: { type: String },
    role: { type: String },
    companyName: { type: String },
    companyLogo: { type: String },
    deadline: { type: String },
    location: { type: String },
    opportunityType: { type: String },
    mentorAvailability: { type: String },
    price: { type: String },
    githubLink: { type: String },
    issueTitle: { type: String },
    starsCount: { type: Number }
  },
  meta: {
    targetId: { type: String },
    targetTitle: { type: String }
  }
}, { timestamps: true });

export const ActivityModel: Model<IActivityDocument> =
  mongoose.models.Activity || mongoose.model<IActivityDocument>("Activity", ActivitySchema);

// 5. Comments
export interface ICommentDocument extends Document {
  activityId: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  text: string;
}

const CommentSchema = new Schema<ICommentDocument>({
  activityId: { type: String, required: true, index: true },
  authorId: { type: String, required: true },
  authorName: { type: String, required: true },
  authorAvatar: { type: String, required: true },
  text: { type: String, required: true }
}, { timestamps: true });

export const CommentModel: Model<ICommentDocument> =
  mongoose.models.Comment || mongoose.model<ICommentDocument>("Comment", CommentSchema);

// 6. Likes
export interface ILikeDocument extends Document {
  activityId: string;
  userId: string;
}

const LikeSchema = new Schema<ILikeDocument>({
  activityId: { type: String, required: true, index: true },
  userId: { type: String, required: true, index: true }
}, { timestamps: true });

export const LikeModel: Model<ILikeDocument> =
  mongoose.models.Like || mongoose.model<ILikeDocument>("Like", LikeSchema);

// 7. Chats (Chat Threads)
export interface IChatDocument extends Document {
  threadId: string; // can be projectId or direct message composite UID
  title: string;
  avatar: string;
  type: "Direct" | "Team" | "Project";
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount?: number;
}

const ChatSchema = new Schema<IChatDocument>({
  threadId: { type: String, required: true, unique: true, index: true },
  title: { type: String, required: true },
  avatar: { type: String, required: true },
  type: { type: String, enum: ["Direct", "Team", "Project"], required: true },
  lastMessage: { type: String, default: "" },
  lastMessageTime: { type: Date, default: Date.now },
  unreadCount: { type: Number, default: 0 }
}, { timestamps: true });

export const ChatModel: Model<IChatDocument> =
  mongoose.models.Chat || mongoose.model<IChatDocument>("Chat", ChatSchema);

// 8. Messages
export interface IMessageDocument extends Document {
  threadId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  read: boolean;
}

const MessageSchema = new Schema<IMessageDocument>({
  threadId: { type: String, required: true, index: true },
  senderId: { type: String, required: true },
  senderName: { type: String, required: true },
  senderAvatar: { type: String, required: true },
  content: { type: String, required: true },
  read: { type: Boolean, default: false }
}, { timestamps: true });

export const MessageModel: Model<IMessageDocument> =
  mongoose.models.Message || mongoose.model<IMessageDocument>("Message", MessageSchema);

// 9. Notifications
export interface INotificationDocument extends Document {
  userId: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  actionUrl?: string;
}

const NotificationSchema = new Schema<INotificationDocument>({
  userId: { type: String, required: true, index: true },
  title: { type: String, required: true },
  message: { type: String, required: true },
  type: { type: String, required: true },
  read: { type: Boolean, default: false },
  actionUrl: { type: String }
}, { timestamps: true });

export const NotificationModel: Model<INotificationDocument> =
  mongoose.models.Notification || mongoose.model<INotificationDocument>("Notification", NotificationSchema);

// 10. Hackathons
export interface IHackathonDocument extends Document {
  title: string;
  bannerUrl: string;
  organizer: string;
  description: string;
  startDate: string;
  endDate: string;
  prizePool: string;
  categories: string[];
  status: string;
  registeredTeamsCount: number;
  rules: string;
}

const HackathonSchema = new Schema<IHackathonDocument>({
  title: { type: String, required: true },
  bannerUrl: { type: String, required: true },
  organizer: { type: String, required: true },
  description: { type: String, required: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  prizePool: { type: String, required: true },
  categories: { type: [String], default: [] },
  status: { type: String, enum: ["Upcoming", "Active", "Completed"], default: "Upcoming" },
  registeredTeamsCount: { type: Number, default: 0 },
  rules: { type: String, default: "" }
}, { timestamps: true });

export const HackathonModel: Model<IHackathonDocument> =
  mongoose.models.Hackathon || mongoose.model<IHackathonDocument>("Hackathon", HackathonSchema);

// 11. Mentors
export interface IMentorDocument extends Document {
  userId: string;
  fullName: string;
  avatarUrl: string;
  company?: string;
  role: string;
  expertise: string[];
  biography: string;
  rating: number;
  reviewCount: number;
  pricing: string;
  availability: {
    day: string;
    slots: string[];
  }[];
}

const MentorSchema = new Schema<IMentorDocument>({
  userId: { type: String, required: true, unique: true, index: true },
  fullName: { type: String, required: true },
  avatarUrl: { type: String, required: true },
  company: { type: String },
  role: { type: String, required: true },
  expertise: { type: [String], default: [] },
  biography: { type: String, required: true },
  rating: { type: Number, default: 5 },
  reviewCount: { type: Number, default: 0 },
  pricing: { type: String, default: "Free" },
  availability: [{
    day: { type: String, required: true },
    slots: { type: [String], default: [] }
  }]
}, { timestamps: true });

export const MentorModel: Model<IMentorDocument> =
  mongoose.models.Mentor || mongoose.model<IMentorDocument>("Mentor", MentorSchema);

// 12. Bookings
export interface IMentorBookingDocument extends Document {
  mentorId: string;
  mentorName: string;
  mentorAvatar: string;
  menteeId: string;
  menteeName: string;
  topic: string;
  date: string;
  timeSlot: string;
  status: string;
  meetingLink?: string;
}

const MentorBookingSchema = new Schema<IMentorBookingDocument>({
  mentorId: { type: String, required: true, index: true },
  mentorName: { type: String, required: true },
  mentorAvatar: { type: String, required: true },
  menteeId: { type: String, required: true, index: true },
  menteeName: { type: String, required: true },
  topic: { type: String, required: true },
  date: { type: String, required: true },
  timeSlot: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Scheduled", "Completed", "Declined"], default: "Pending" },
  meetingLink: { type: String }
}, { timestamps: true });

export const MentorBookingModel: Model<IMentorBookingDocument> =
  mongoose.models.MentorBooking || mongoose.model<IMentorBookingDocument>("MentorBooking", MentorBookingSchema);

// 13. Internships
export interface IInternshipDocument extends Document {
  title: string;
  companyName: string;
  companyLogo: string;
  location: string;
  type: string;
  duration: string;
  stipend: string;
  skillsRequired: string[];
  description: string;
  applyBy: string;
  applicantsCount: number;
  applicants: {
    userId: string;
    fullName: string;
    avatarUrl: string;
    resumeUrl?: string;
    status: "Applied" | "Reviewing" | "Accepted" | "Rejected";
    appliedAt: Date;
  }[];
}

const InternshipSchema = new Schema<IInternshipDocument>({
  title: { type: String, required: true },
  companyName: { type: String, required: true },
  companyLogo: { type: String, required: true },
  location: { type: String, required: true },
  type: { type: String, required: true },
  duration: { type: String, required: true },
  stipend: { type: String, required: true },
  skillsRequired: { type: [String], default: [] },
  description: { type: String, required: true },
  applyBy: { type: String, required: true },
  applicantsCount: { type: Number, default: 0 },
  applicants: [{
    userId: { type: String, required: true },
    fullName: { type: String, required: true },
    avatarUrl: { type: String, required: true },
    resumeUrl: { type: String },
    status: { type: String, enum: ["Applied", "Reviewing", "Accepted", "Rejected"], default: "Applied" },
    appliedAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

export const InternshipModel: Model<IInternshipDocument> =
  mongoose.models.Internship || mongoose.model<IInternshipDocument>("Internship", InternshipSchema);

// 14. Co-Founder / Startup Ideas
export interface IStartupIdeaDocument extends Document {
  title: string;
  description: string;
  problem: string;
  solution: string;
  marketSize?: string;
  tags: string[];
  authorId: string;
  authorName: string;
  authorAvatar: string;
  authorRole: string;
  neededRoles: string[];
  equityOffer?: string;
}

const StartupIdeaSchema = new Schema<IStartupIdeaDocument>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  problem: { type: String, required: true },
  solution: { type: String, required: true },
  marketSize: { type: String },
  tags: { type: [String], default: [] },
  authorId: { type: String, required: true, index: true },
  authorName: { type: String, required: true },
  authorAvatar: { type: String, required: true },
  authorRole: { type: String, required: true },
  neededRoles: { type: [String], default: [] },
  equityOffer: { type: String }
}, { timestamps: true });

export const StartupIdeaModel: Model<IStartupIdeaDocument> =
  mongoose.models.StartupIdea || mongoose.model<IStartupIdeaDocument>("StartupIdea", StartupIdeaSchema);

// 15. Verification Requests (SaaS Engine)
export interface IVerificationRequestDocument extends Document {
  userId: string;
  userName: string;
  type: "GITHUB" | "CERTIFICATE" | "PROJECT";
  artifactUrl: string;
  status: "Pending" | "Approved" | "Rejected";
  adminNotes?: string;
}

const VerificationRequestSchema = new Schema<IVerificationRequestDocument>({
  userId: { type: String, required: true, index: true },
  userName: { type: String, required: true },
  type: { type: String, enum: ["GITHUB", "CERTIFICATE", "PROJECT"], required: true },
  artifactUrl: { type: String, required: true },
  status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
  adminNotes: { type: String }
}, { timestamps: true });

export const VerificationRequestModel: Model<IVerificationRequestDocument> =
  mongoose.models.VerificationRequest || mongoose.model<IVerificationRequestDocument>("VerificationRequest", VerificationRequestSchema);

// 16. Subscriptions
export interface ISubscriptionDocument extends Document {
  userId: string;
  planId: "FREE" | "PREMIUM_STUDENT" | "MENTOR" | "RECRUITER";
  status: "active" | "inactive" | "cancelled" | "past_due";
  razorpaySubscriptionId?: string;
  currentPeriodEndAt: Date;
}

const SubscriptionSchema = new Schema<ISubscriptionDocument>({
  userId: { type: String, required: true, unique: true, index: true },
  planId: { type: String, enum: ["FREE", "PREMIUM_STUDENT", "MENTOR", "RECRUITER"], default: "FREE" },
  status: { type: String, default: "active" },
  razorpaySubscriptionId: { type: String },
  currentPeriodEndAt: { type: Date, default: () => new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) }
}, { timestamps: true });

export const SubscriptionModel: Model<ISubscriptionDocument> =
  mongoose.models.Subscription || mongoose.model<ISubscriptionDocument>("Subscription", SubscriptionSchema);

// 17. Payments
export interface IPaymentDocument extends Document {
  userId: string;
  amount: number;
  currency: string;
  status: "captured" | "failed" | "refunded";
  razorpayPaymentId: string;
  razorpayOrderId?: string;
  planPurchased: string;
}

const PaymentSchema = new Schema<IPaymentDocument>({
  userId: { type: String, required: true, index: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: "INR" },
  status: { type: String, enum: ["captured", "failed", "refunded"], required: true },
  razorpayPaymentId: { type: String, required: true, unique: true },
  razorpayOrderId: { type: String },
  planPurchased: { type: String, required: true }
}, { timestamps: true });

export const PaymentModel: Model<IPaymentDocument> =
  mongoose.models.Payment || mongoose.model<IPaymentDocument>("Payment", PaymentSchema);

// 18. Invoices
export interface IInvoiceDocument extends Document {
  userId: string;
  invoiceNumber: string;
  paymentId: string;
  amount: number;
  planName: string;
  downloadUrl?: string;
}

const InvoiceSchema = new Schema<IInvoiceDocument>({
  userId: { type: String, required: true, index: true },
  invoiceNumber: { type: String, required: true, unique: true },
  paymentId: { type: String, required: true },
  amount: { type: Number, required: true },
  planName: { type: String, required: true },
  downloadUrl: { type: String }
}, { timestamps: true });

export const InvoiceModel: Model<IInvoiceDocument> =
  mongoose.models.Invoice || mongoose.model<IInvoiceDocument>("Invoice", InvoiceSchema);

// 19. Audit Logs
export interface IAuditLogDocument extends Document {
  userId?: string;
  action: string;
  details: string;
  ipAddress?: string;
}

const AuditLogSchema = new Schema<IAuditLogDocument>({
  userId: { type: String, index: true },
  action: { type: String, required: true },
  details: { type: String, required: true },
  ipAddress: { type: String }
}, { timestamps: true });

export const AuditLogModel: Model<IAuditLogDocument> =
  mongoose.models.AuditLog || mongoose.model<IAuditLogDocument>("AuditLog", AuditLogSchema);

// 20. Followers
export interface IFollowerDocument extends Document {
  followerId: string;
  followingId: string;
  followingType: "student" | "mentor" | "company";
  createdAt: Date;
  updatedAt: Date;
}

const FollowerSchema = new Schema<IFollowerDocument>({
  followerId: { type: String, required: true, index: true },
  followingId: { type: String, required: true, index: true },
  followingType: { type: String, enum: ["student", "mentor", "company"], required: true }
}, { timestamps: true });

export const FollowerModel: Model<IFollowerDocument> =
  mongoose.models.Follower || mongoose.model<IFollowerDocument>("Follower", FollowerSchema);

// ==========================================
// MONGODB PRODUCTION CONNECTION MANAGEMENT
// ==========================================

export class MongoDBService {
  private static instance: MongoDBService;
  private isConnected: boolean = false;
  private uri: string = "";

  private constructor() {
    this.uri = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/skillcollab";
  }

  public static getInstance(): MongoDBService {
    if (!MongoDBService.instance) {
      MongoDBService.instance = new MongoDBService();
    }
    return MongoDBService.instance;
  }

  /**
   * Initializes MongoDB connection using Mongoose pool.
   */
  async connect(): Promise<void> {
    if (this.isConnected) return;

    if (!process.env.MONGODB_URI) {
      console.info("[MongoDBService] No MONGODB_URI provided in environment. SkillCollab automatically falls back to full simulated key-value and local file-based (mock_db_store.json) storage engine.");
      return;
    }

    try {
      // Connect to MongoDB Atlas or localhost
      console.info(`[MongoDBService] Connecting stream to target: ${this.uri.split("@").pop()}`);
      
      await mongoose.connect(this.uri, {
        maxPoolSize: 100,
        minPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      });

      this.isConnected = true;
      console.info("[MongoDBService] Successfully established connection pool with MongoDB Atlas!");
      
      // Auto-init indexing
      await this.ensureIndexes();

      // Seed if database is blank
      await this.seedDatabaseIfEmpty();

    } catch (error: any) {
      if (error?.message?.includes("ECONNREFUSED") || error?.name === "MongooseServerSelectionError" || error?.message?.includes("MongooseServerSelectionError")) {
        console.warn("[MongoDBService] Local MongoDB database is not running or is offline. SkillCollab automatically falls back to full simulated key-value and local file-based (mock_db_store.json) storage engine. All student work will persist stably.");
      } else {
        console.error("[MongoDBService] Failed to establish connection pool:", error);
      }
      throw error;
    }
  }

  async ensureIndexes(): Promise<void> {
    try {
      console.info("[MongoDBService] Constructing sparse / compound collection indices...");
      await UserModel.ensureIndexes();
      await ProjectModel.ensureIndexes();
      await FollowerModel.ensureIndexes();
      console.info("[MongoDBService] Database indexing strategy created.");
    } catch (e) {
      console.warn("[MongoDBService] Failed indexing synchronization:", e);
    }
  }

  /**
   * Check if any collection is empty and hydrate with default records.
   */
  async seedDatabaseIfEmpty(): Promise<void> {
    try {
      console.info("[MongoDBService] Checking if database seeding is required...");
      
      const userCount = await UserModel.countDocuments();
      if (userCount === 0) {
        console.info("[MongoDBService] Seeding default template user...");
        const { DEFAULT_USER } = await import("./seedData");
        await new UserModel(DEFAULT_USER).save();
      }

      const projectCount = await ProjectModel.countDocuments();
      if (projectCount === 0) {
        console.info("[MongoDBService] Seeding master production campus catalog...");
        const { 
          DEFAULT_PROJECTS, 
          DEFAULT_TEAMS, 
          DEFAULT_HACKATHONS, 
          DEFAULT_INTERNSHIPS, 
          DEFAULT_MENTORS, 
          DEFAULT_STARTUP_IDEAS, 
          DEFAULT_CHATS, 
          DEFAULT_NOTIFICATIONS 
        } = await import("./seedData");

        await ProjectModel.insertMany(DEFAULT_PROJECTS);
        await TeamModel.insertMany(DEFAULT_TEAMS);
        await HackathonModel.insertMany(DEFAULT_HACKATHONS);
        await InternshipModel.insertMany(DEFAULT_INTERNSHIPS);
        await MentorModel.insertMany(DEFAULT_MENTORS);
        await StartupIdeaModel.insertMany(DEFAULT_STARTUP_IDEAS);
        await ChatModel.insertMany(DEFAULT_CHATS);
        await NotificationModel.insertMany(DEFAULT_NOTIFICATIONS);

        console.info("[MongoDBService] Hydrated campus data successfully.");
      } else {
        console.info("[MongoDBService] Active production items exist. Hydration skipped.");
      }
    } catch (err) {
      console.error("[MongoDBService] Automation Seeder encountered an exception:", err);
    }
  }

  /**
   * Helper: Retrieve user from collection by Firebase UID
   */
  async getUserByFirebaseUid(uid: string): Promise<IUserDocument | null> {
    await this.connect();
    return UserModel.findOne({ firebaseUid: uid });
  }

  /**
   * Helper: Synchronize user details from Firebase authenticated session
   */
  async syncUserWithFirebase(uid: string, data: {
    email: string;
    fullName: string;
    avatarUrl: string;
    githubUsername?: string;
  }): Promise<IUserDocument> {
    await this.connect();

    // Look up existing profile
    const existing = await UserModel.findOne({ firebaseUid: uid });
    if (existing) {
      // Update basic fields but keep historical state elements like skills, experience, connections pristine
      existing.email = data.email || existing.email;
      existing.fullName = data.fullName || existing.fullName;
      if (data.avatarUrl && !existing.avatarUrl) {
        existing.avatarUrl = data.avatarUrl;
      }
      if (data.githubUsername) {
        existing.links.github = `https://github.com/${data.githubUsername}`;
      }
      return await existing.save();
    }

    // Otherwise create default starter profile
    const nameSplit = data.fullName.split(" ");
    const firstName = nameSplit[0] || "User";
    
    const newUser = new UserModel({
      firebaseUid: uid,
      email: data.email,
      fullName: data.fullName,
      avatarUrl: data.avatarUrl || `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(firstName)}`,
      role: UserRole.STUDENT,
      coverUrl: "https://images.unsplash.com/photo-1620121692029-d088224ddc74?auto=format&fit=crop&w=800&q=80",
      headline: "Computer Science Enthusiast | Student Scholar",
      bio: `Passionate B.Tech engineering major eager to build robust products, learn modern stacks, and match with team projects across campus. Joined via university hub.`,
      location: "Mumbai, India",
      skills: ["React.js", "Node.js", "Express.js", "TypeScript", "Tailwind CSS"],
      education: [
        {
          institution: "University Engineering Hub",
          degree: "Bachelor of Technology",
          fieldOfStudy: "Computer Science",
          startYear: 2024,
          endYear: 2028
        }
      ],
      experience: [],
      certifications: [],
      achievements: [],
      reputationPoints: 100,
      badges: ["First Access"],
      links: {
        github: data.githubUsername ? `https://github.com/${data.githubUsername}` : "",
        linkedin: "",
        portfolio: ""
      },
      connectionsCount: 0,
      followersCount: 0
    });

    return await newUser.save();
  }
}
