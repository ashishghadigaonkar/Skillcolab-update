import path from "path";
import fs from "fs";
import { 
  DEFAULT_USER, DEFAULT_PROJECTS, DEFAULT_TEAMS, DEFAULT_APPLICATIONS,
  DEFAULT_HACKATHONS, DEFAULT_INTERNSHIPS, DEFAULT_MENTORS, DEFAULT_SESSIONS,
  DEFAULT_CHATS, DEFAULT_NOTIFICATIONS, DEFAULT_ANALYTICS, DEFAULT_CHANNEL_MESSAGES,
  DEFAULT_ACTIVITIES
} from "./defaults";
import { FollowerRelation } from "../../types";

const DB_FILE_PATH = path.join(process.cwd(), "src", "mock_db_store.json");

export let dbState = {
  user: JSON.parse(JSON.stringify(DEFAULT_USER)),
  projects: JSON.parse(JSON.stringify(DEFAULT_PROJECTS)),
  teams: JSON.parse(JSON.stringify(DEFAULT_TEAMS)),
  applications: JSON.parse(JSON.stringify(DEFAULT_APPLICATIONS)),
  hackathons: JSON.parse(JSON.stringify(DEFAULT_HACKATHONS)),
  internships: JSON.parse(JSON.stringify(DEFAULT_INTERNSHIPS)),
  mentors: JSON.parse(JSON.stringify(DEFAULT_MENTORS)),
  sessions: JSON.parse(JSON.stringify(DEFAULT_SESSIONS)),
  chats: JSON.parse(JSON.stringify(DEFAULT_CHATS)),
  notifications: JSON.parse(JSON.stringify(DEFAULT_NOTIFICATIONS)),
  analytics: JSON.parse(JSON.stringify(DEFAULT_ANALYTICS)),
  channelMessages: JSON.parse(JSON.stringify(DEFAULT_CHANNEL_MESSAGES)) as Record<string, any[]>,
  activities: JSON.parse(JSON.stringify(DEFAULT_ACTIVITIES)) as any[],
  followers: [
    { id: "follow_1", followerId: "student_ashish", followingId: "comp_microsoft", followingType: "company" },
    { id: "follow_2", followerId: "student_ashish", followingId: "mentor_nitin", followingType: "mentor" },
    { id: "follow_3", followerId: "student_ashish", followingId: "mentor_ayesha", followingType: "mentor" }
  ] as FollowerRelation[],
  connectionRequests: [
    {
      id: "req_seed_1",
      senderId: "user_piyush",
      senderName: "Piyush Mehta",
      senderAvatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=100&h=100&q=80",
      senderHeadline: "Final Year CS | System Lead",
      receiverId: "student_ashish",
      receiverName: "Ashish Ghadigaonkar",
      receiverAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
      receiverHeadline: "Fullstack Lead Developer (You)",
      note: "Hi Ashish, I saw your MERN project and would love to connect and learn more about your work on WebSocket proxy routing!",
      status: "Pending",
      sentDate: new Date(Date.now() - 3600000 * 24).toISOString()
    },
    {
      id: "req_seed_2",
      senderId: "user_rohan",
      senderName: "Rohan Sharma",
      senderAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150&q=80",
      senderHeadline: "Senior Cloud & Backend Engineer",
      receiverId: "student_ashish",
      receiverName: "Ashish Ghadigaonkar",
      receiverAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&h=150&q=80",
      receiverHeadline: "Fullstack Lead Developer (You)",
      note: "",
      status: "Accepted",
      sentDate: new Date(Date.now() - 3600000 * 48).toISOString()
    }
  ] as any[],
  connections: [
    {
      id: "conn_seed_2",
      user1Id: "user_rohan",
      user2Id: "student_ashish",
      createdAt: new Date(Date.now() - 3600000 * 48).toISOString()
    }
  ] as any[]
};

export function loadDb() {
  try {
    if (fs.existsSync(DB_FILE_PATH)) {
      const dataStr = fs.readFileSync(DB_FILE_PATH, "utf-8");
      const loaded = JSON.parse(dataStr);
      Object.assign(dbState, loaded);
      
      if (!dbState.channelMessages) {
        dbState.channelMessages = JSON.parse(JSON.stringify(DEFAULT_CHANNEL_MESSAGES));
        saveDb();
      }
      if (!dbState.activities) {
        dbState.activities = JSON.parse(JSON.stringify(DEFAULT_ACTIVITIES));
        saveDb();
      }
      if (!dbState.followers) {
        dbState.followers = [
          { id: "follow_1", followerId: "student_ashish", followingId: "comp_microsoft", followingType: "company" },
          { id: "follow_2", followerId: "student_ashish", followingId: "mentor_nitin", followingType: "mentor" },
          { id: "follow_3", followerId: "student_ashish", followingId: "mentor_ayesha", followingType: "mentor" }
        ];
        saveDb();
      }
      if (!dbState.connectionRequests) {
        dbState.connectionRequests = [];
        saveDb();
      }
    } else {
      saveDb();
    }
  } catch (err) {
    console.warn("Failed loading local mock JSON db state: ", err);
  }
}

export function saveDb() {
  try {
    const parentDir = path.dirname(DB_FILE_PATH);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }
    fs.writeFileSync(DB_FILE_PATH, JSON.stringify(dbState, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed saving local db state to JSON file:", err);
  }
}

export function resetDb() {
  dbState.user = JSON.parse(JSON.stringify(DEFAULT_USER));
  dbState.projects = JSON.parse(JSON.stringify(DEFAULT_PROJECTS));
  dbState.teams = JSON.parse(JSON.stringify(DEFAULT_TEAMS));
  dbState.applications = JSON.parse(JSON.stringify(DEFAULT_APPLICATIONS));
  dbState.hackathons = JSON.parse(JSON.stringify(DEFAULT_HACKATHONS));
  dbState.internships = JSON.parse(JSON.stringify(DEFAULT_INTERNSHIPS));
  dbState.mentors = JSON.parse(JSON.stringify(DEFAULT_MENTORS));
  dbState.sessions = JSON.parse(JSON.stringify(DEFAULT_SESSIONS));
  dbState.chats = JSON.parse(JSON.stringify(DEFAULT_CHATS));
  dbState.notifications = JSON.parse(JSON.stringify(DEFAULT_NOTIFICATIONS));
  dbState.analytics = JSON.parse(JSON.stringify(DEFAULT_ANALYTICS));
  dbState.channelMessages = JSON.parse(JSON.stringify(DEFAULT_CHANNEL_MESSAGES));
  dbState.activities = JSON.parse(JSON.stringify(DEFAULT_ACTIVITIES));
  dbState.followers = [
    { id: "follow_1", followerId: "student_ashish", followingId: "comp_microsoft", followingType: "company" },
    { id: "follow_2", followerId: "student_ashish", followingId: "mentor_nitin", followingType: "mentor" },
    { id: "follow_3", followerId: "student_ashish", followingId: "mentor_ayesha", followingType: "mentor" }
  ];
  dbState.connectionRequests = [];
  dbState.connections = [];
  saveDb();
}
