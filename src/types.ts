/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum UserRole {
  STUDENT = "Student",
  TEAM_LEADER = "Team Leader",
  MENTOR = "Mentor",
  RECRUITER = "Recruiter",
  COMPANY = "Company",
  COLLEGE_ADMIN = "College Admin",
  SUPER_ADMIN = "Super Admin"
}

export interface User {
  id: string;
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
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tagline: string;
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  skillsNeeded: string[];
  tags: string[];
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  status: "Recruiting" | "In Progress" | "Completed";
  teamSizeLimit: number;
  currentTeamSize: number;
  createdAt: string;
  milestones: {
    id: string;
    title: string;
    description: string;
    status: "Pending" | "Done";
    dueDate: string;
  }[];
  attachments?: {
    name: string;
    url: string;
  }[];
}

export interface Team {
  id: string;
  projectId: string;
  projectTitle: string;
  leaderId: string;
  members: {
    userId: string;
    fullName: string;
    avatarUrl: string;
    role: string; // e.g. Frontend Developer, ML Engineer, UI Designer
    joinedAt: string;
  }[];
  invitees: string[]; // User IDs invited
}

export interface TeamApplication {
  id: string;
  projectId: string;
  projectTitle: string;
  applicantId: string;
  applicantName: string;
  applicantAvatar: string;
  applicantHeadline: string;
  applicantSkills: string[];
  requestedRole: string;
  coverLetter: string;
  status: "Pending" | "Approved" | "Rejected";
  createdAt: string;
}

export interface Hackathon {
  id: string;
  title: string;
  bannerUrl: string;
  organizer: string;
  description: string;
  startDate: string;
  endDate: string;
  prizePool: string;
  categories: string[];
  status: "Upcoming" | "Active" | "Completed";
  registeredTeamsCount: number;
  rules: string;
  submissions: {
    teamId: string;
    teamName: string;
    projectTitle: string;
    pitchVideoUrl?: string;
    demoUrl: string;
    githubUrl: string;
    score?: number;
    badgeAwarded?: string;
  }[];
}

export interface InternshipPost {
  id: string;
  title: string;
  companyName: string;
  companyLogo: string;
  location: string;
  type: "Remote" | "Hybrid" | "In-office";
  duration: string; // e.g. "3 Months", "6 Months"
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
    appliedAt: string;
  }[];
}

export interface Mentor {
  id: string;
  userId: string;
  fullName: string;
  avatarUrl: string;
  company?: string;
  role: string;
  expertise: string[];
  biography: string;
  rating: number;
  reviewCount: number;
  pricing: string; // e.g. "Free", "$15/hr"
  availability: {
    day: string; // e.g. "Monday", "Wednesday"
    slots: string[]; // e.g. ["10:00 AM", "2:00 PM"]
  }[];
  reviews: {
    id: string;
    reviewerName: string;
    rating: number;
    comment: string;
    createdAt: string;
  }[];
}

export interface MentorshipSession {
  id: string;
  mentorId: string;
  mentorName: string;
  mentorAvatar: string;
  menteeId: string;
  menteeName: string;
  topic: string;
  date: string;
  timeSlot: string;
  status: "Pending" | "Scheduled" | "Completed" | "Declined";
  meetingLink?: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: string;
}

export interface ChatThread {
  id: string; // project ID or peer userId
  title: string;
  avatar: string;
  type: "Direct" | "Team" | "Project";
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
  messages: Message[];
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: "Message" | "Invite" | "Application" | "Update" | "System" | "Admin";
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}

export interface SystemAnalytics {
  dau: number;
  mau: number;
  activeProjects: number;
  teamCreationRate: number; // percentage
  internshipApplications: number;
  skillsFrequency: { name: string; count: number }[];
}

// ==========================================
// PROFESSIONAL LINKEDIN SUITE EXTENSIONS
// ==========================================

export interface ProfessionalConnection {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderHeadline: string;
  receiverId: string;
  receiverName: string;
  receiverAvatar: string;
  receiverHeadline: string;
  status: "Pending" | "Accepted" | "Rejected";
  createdAt: string;
}

export interface UserFollow {
  userId: string;
  targetId: string; // can be User id, Company id, Mentor id, or Org id
  targetType: "User" | "Company" | "Mentor" | "Org";
  createdAt: string;
}

export interface CompanyPage {
  id: string;
  name: string;
  tagline: string;
  description: string;
  logo: string;
  banner: string;
  industry: string;
  size: string; // e.g., "11-50 employees"
  foundedYear: number;
  website: string;
  location: string;
  socialLinks: { twitter?: string; linkedin?: string; github?: string };
  followersCount: number;
  employeesCount: number;
  openJobs: string[]; // Job ids
}

export interface OrganizationPage {
  id: string;
  name: string;
  type: "GDSC Chapter" | "Technical Community" | "Startup Community" | "Student Club";
  tagline: string;
  description: string;
  logo: string;
  membersCount: number;
  eventsCount: number;
}

export interface SkillEndorsement {
  id: string;
  skillName: string;
  endorsedUserId: string;
  endorserId: string;
  endorserName: string;
  endorserRole: string;
  createdAt: string;
}

export interface LinkedInRecommendation {
  id: string;
  receiverId: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  senderRole: string; // e.g., "Project Manager", "Mentor"
  text: string;
  status: "Pending" | "Approved";
  createdAt: string;
}

export interface ContentArticle {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  title: string;
  summary: string;
  content: string; // Markdown article content
  coverImage?: string;
  views: number;
  likes: number;
  shares: number;
  status: "Draft" | "Published";
  createdAt: string;
}

export interface Newsletter {
  id: string;
  title: string;
  frequency: "Weekly" | "Monthly";
  description: string;
  subscribersCount: number;
  authorId: string;
  authorName: string;
  archive: { title: string; sendDate: string; content: string }[];
}

export interface EventItem {
  id: string;
  title: string;
  organizerName: string;
  type: "Online Webinar" | "Tech Talk" | "Matchmaking Meetup" | "Offline Hackathon Info";
  date: string;
  time: string;
  linkOrLocation: string;
  attendeesCount: number;
  isRegistered?: boolean;
}

export interface ExtendedJobItem {
  id: string;
  title: string;
  companyName: string;
  type: "Full-Time" | "Part-Time" | "Remote" | "Campus Internship";
  stipendOrSalary: string;
  skills: string[];
  description: string;
  applyBy: string;
  applicantsCount: number;
}

export interface AlumniRecord {
  id: string;
  name: string;
  avatar: string;
  gradYear: number;
  department: string;
  currentCompany: string;
  currentRole: string;
  skills: string[];
}

export interface ProfileViewLog {
  id: string;
  profileOwnerId: string;
  viewerId: string;
  viewerName: string;
  viewerAvatar: string;
  viewerHeadline: string;
  viewedAt: string;
}

export interface RecruiterCandidatePipeline {
  candidateId: string;
  candidateName: string;
  candidateAvatar: string;
  tag: string; // e.g. "Sourcing" | "Interviewing" | "Shortlisted" | "Offered"
  notes: string[];
}

export interface StreakTracker {
  streak: number;
  lastActive: string;
}

export interface FollowerRelation {
  id: string;
  followerId: string;
  followingId: string;
  followingType: "student" | "mentor" | "company";
  createdAt?: string;
}

