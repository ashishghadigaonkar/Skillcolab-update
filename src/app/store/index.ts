import { configureStore, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { Project } from "../../types";

// Dynamic Initial States
const defaultUserState = {
  currentUser: null as any,
  authChecking: false,
  syncingUser: false
};

const defaultProjectsState = {
  projects: [] as Project[],
  loading: false,
  error: null as string | null
};

const defaultTeamsState = {
  teams: [] as any[],
  loading: false
};

const defaultAppsState = {
  applications: [] as any[],
  loading: false
};

const defaultNetworkState = {
  following: [] as string[],
  connections: [] as any[],
  loading: false
};

const defaultChatState = {
  threads: [] as any[],
  activeThreadId: null as string | null,
  loading: false
};

const defaultNotificationState = {
  notifications: [] as any[],
  unreadCount: 0,
  loading: false
};

const defaultMentorState = {
  mentors: [] as any[],
  bookedSessions: [] as any[],
  loading: false
};

const defaultInternshipState = {
  posts: [] as any[],
  loading: false
};

const defaultHackathonState = {
  hackathons: [] as any[],
  registeredTeams: [] as string[],
  loading: false
};

const defaultStartupState = {
  posts: [] as any[],
  loading: false
};

const defaultGithubState = {
  issues: [] as any[],
  commits: [] as any[],
  loading: false
};

const defaultAiState = {
  roadmaps: [] as any[],
  interviews: [] as any[],
  loading: false
};

const defaultAdminState = {
  stats: null as any,
  analytics: null as any,
  loading: false
};

// Slices
const authSlice = createSlice({
  name: "auth",
  initialState: defaultUserState,
  reducers: {
    setAuthChecking(state, action: PayloadAction<boolean>) {
      state.authChecking = action.payload;
    },
    setSyncingUser(state, action: PayloadAction<boolean>) {
      state.syncingUser = action.payload;
    },
    setCurrentUser(state, action: PayloadAction<any>) {
      state.currentUser = action.payload;
    }
  }
});

const projectSlice = createSlice({
  name: "projects",
  initialState: defaultProjectsState,
  reducers: {
    setProjects(state, action: PayloadAction<Project[]>) {
      state.projects = action.payload;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setError(state, action: PayloadAction<string | null>) {
      state.error = action.payload;
    }
  }
});

const teamSlice = createSlice({
  name: "teams",
  initialState: defaultTeamsState,
  reducers: {
    setTeams(state, action: PayloadAction<any[]>) {
      state.teams = action.payload;
    }
  }
});

const applicationSlice = createSlice({
  name: "applications",
  initialState: defaultAppsState,
  reducers: {
    setApplications(state, action: PayloadAction<any[]>) {
      state.applications = action.payload;
    }
  }
});

const networkSlice = createSlice({
  name: "network",
  initialState: defaultNetworkState,
  reducers: {
    setFollowing(state, action: PayloadAction<string[]>) {
      state.following = action.payload;
    },
    setConnections(state, action: PayloadAction<any[]>) {
      state.connections = action.payload;
    }
  }
});

const chatSlice = createSlice({
  name: "chat",
  initialState: defaultChatState,
  reducers: {
    setThreads(state, action: PayloadAction<any[]>) {
      state.threads = action.payload;
    },
    setActiveThreadId(state, action: PayloadAction<string | null>) {
      state.activeThreadId = action.payload;
    }
  }
});

const notificationSlice = createSlice({
  name: "notifications",
  initialState: defaultNotificationState,
  reducers: {
    setNotifications(state, action: PayloadAction<any[]>) {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter((n: any) => !n.read).length;
    },
    setUnreadCount(state, action: PayloadAction<number>) {
      state.unreadCount = action.payload;
    }
  }
});

const mentorSlice = createSlice({
  name: "mentors",
  initialState: defaultMentorState,
  reducers: {
    setMentors(state, action: PayloadAction<any[]>) {
      state.mentors = action.payload;
    },
    setBookedSessions(state, action: PayloadAction<any[]>) {
      state.bookedSessions = action.payload;
    }
  }
});

const internshipSlice = createSlice({
  name: "internships",
  initialState: defaultInternshipState,
  reducers: {
    setInternships(state, action: PayloadAction<any[]>) {
      state.posts = action.payload;
    }
  }
});

const hackathonSlice = createSlice({
  name: "hackathons",
  initialState: defaultHackathonState,
  reducers: {
    setHackathons(state, action: PayloadAction<any[]>) {
      state.hackathons = action.payload;
    },
    setRegisteredTeams(state, action: PayloadAction<string[]>) {
      state.registeredTeams = action.payload;
    }
  }
});

const startupSlice = createSlice({
  name: "startup",
  initialState: defaultStartupState,
  reducers: {
    setStartupPosts(state, action: PayloadAction<any[]>) {
      state.posts = action.payload;
    }
  }
});

const githubSlice = createSlice({
  name: "github",
  initialState: defaultGithubState,
  reducers: {
    setIssues(state, action: PayloadAction<any[]>) {
      state.issues = action.payload;
    },
    setCommits(state, action: PayloadAction<any[]>) {
      state.commits = action.payload;
    }
  }
});

const aiSlice = createSlice({
  name: "ai",
  initialState: defaultAiState,
  reducers: {
    setRoadmaps(state, action: PayloadAction<any[]>) {
      state.roadmaps = action.payload;
    }
  }
});

const adminSlice = createSlice({
  name: "admin",
  initialState: defaultAdminState,
  reducers: {
    setStats(state, action: PayloadAction<any>) {
      state.stats = action.payload;
    },
    setAnalytics(state, action: PayloadAction<any>) {
      state.analytics = action.payload;
    }
  }
});

// Configure Store
export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    projects: projectSlice.reducer,
    teams: teamSlice.reducer,
    applications: applicationSlice.reducer,
    network: networkSlice.reducer,
    chat: chatSlice.reducer,
    notifications: notificationSlice.reducer,
    mentors: mentorSlice.reducer,
    internships: internshipSlice.reducer,
    hackathons: hackathonSlice.reducer,
    startup: startupSlice.reducer,
    github: githubSlice.reducer,
    ai: aiSlice.reducer,
    admin: adminSlice.reducer
  }
});

// Action Exports
export const { setAuthChecking, setSyncingUser, setCurrentUser } = authSlice.actions;
export const { setProjects, setLoading, setError } = projectSlice.actions;
export const { setTeams } = teamSlice.actions;
export const { setApplications } = applicationSlice.actions;
export const { setFollowing, setConnections } = networkSlice.actions;
export const { setThreads, setActiveThreadId } = chatSlice.actions;
export const { setNotifications, setUnreadCount } = notificationSlice.actions;
export const { setMentors, setBookedSessions } = mentorSlice.actions;
export const { setInternships } = internshipSlice.actions;
export const { setHackathons, setRegisteredTeams } = hackathonSlice.actions;
export const { setStartupPosts } = startupSlice.actions;
export const { setIssues, setCommits } = githubSlice.actions;
export const { setRoadmaps } = aiSlice.actions;
export const { setStats, setAnalytics } = adminSlice.actions;

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
