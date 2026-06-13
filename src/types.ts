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
