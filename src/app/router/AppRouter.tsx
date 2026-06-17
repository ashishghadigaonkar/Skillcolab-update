import React, { Suspense, lazy } from "react";
import { Compass, Users, Sparkles, Layers, Cpu, Trophy, BookOpen, GraduationCap, ArrowUpRight } from "lucide-react";

// Lazy-loaded routes for performance & split execution
const HomeFeed = lazy(() => import("../../modules/feed/pages/HomeFeed"));
const ProjectMarketplace = lazy(() => import("../../modules/projects/pages/ProjectMarketplace"));
const TeamBuilder = lazy(() => import("../../modules/teams/pages/TeamBuilder"));
const WorkspaceChat = lazy(() => import("../../modules/chat/pages/WorkspaceChat"));
const AICareerSuite = lazy(() => import("../../modules/ai/pages/AICareerSuite"));
const ProfessionalNetworkSuite = lazy(() => import("../../modules/network/pages/ProfessionalNetworkSuite"));
const StartupLaunchpad = lazy(() => import("../../modules/startup-hub/pages/StartupLaunchpad"));
const OpenSourceHub = lazy(() => import("../../modules/github/pages/OpenSourceHub"));
const HackathonHub = lazy(() => import("../../modules/hackathons/pages/HackathonHub"));
const InternshipBoard = lazy(() => import("../../modules/internships/pages/InternshipBoard"));
const MentorNetwork = lazy(() => import("../../modules/mentors/pages/MentorNetwork"));
const RecommendationEngine = lazy(() => import("../../modules/analytics/pages/RecommendationEngine"));
const AdminConsole = lazy(() => import("../../modules/admin/pages/AdminConsole"));
const DeveloperBlueprint = lazy(() => import("../../modules/verification/pages/DeveloperBlueprint"));
const MyUserProfile = lazy(() => import("../../modules/profiles/pages/MyUserProfile"));
const ExploreHub = lazy(() => import("../../modules/explore/pages/ExploreHub"));

interface AppRouterProps {
  activeTab: string;
  navigateToTab: (tabId: string) => void;
  currentUser: any;
  onUpdateCurrentUser: (updated: any) => void;
  projects: any[];
  handleProjectSuccess: () => void;
  selectedProfileId: string | null;
  viewUserProfile: (userId: string) => void;
}

// Simple fallback skeleton spinner
const LazyLoader = () => (
  <div className="w-full h-64 flex flex-col justify-center items-center gap-2">
    <div className="w-8 h-8 rounded-full border-2 border-slate-800 border-t-indigo-500 animate-spin" />
    <span className="text-[10px] font-mono text-slate-500 animate-pulse">LOADING VIEWPORTS...</span>
  </div>
);

// Admins are characterized by roles or user id matching
const isAdminUser = (user: any) => {
  return user?.isAdmin || user?.role === "Administrator" || user?.email?.includes("admin");
};

export const AppRouter: React.FC<AppRouterProps> = ({
  activeTab,
  navigateToTab,
  currentUser,
  onUpdateCurrentUser,
  projects,
  handleProjectSuccess,
  selectedProfileId,
  viewUserProfile
}) => {
  return (
    <Suspense fallback={<LazyLoader />}>
      {/* 1. HOME & TIMELINE VIEWS */}
      {(activeTab === "home" || activeTab === "dashboard") && (
        <div className="space-y-4 text-left">
          <HomeFeed 
            navigateToTab={navigateToTab} 
            currentUser={currentUser}
            onViewProfile={viewUserProfile}
          />
        </div>
      )}

      {/* 2. CORE SYSTEM SUITES */}
      {activeTab === "projects" && (
        <ProjectMarketplace onProjectCreated={handleProjectSuccess} />
      )}

      {activeTab === "teams" && (
        <TeamBuilder 
          projects={projects} 
          fetchProjects={handleProjectSuccess} 
          onViewProfile={viewUserProfile} 
          onRosterUpdated={handleProjectSuccess}
        />
      )}

      {activeTab === "open_source" && (
        <OpenSourceHub />
      )}

      {activeTab === "chats" && <WorkspaceChat currentUser={currentUser} />}
      {activeTab === "ai_career_suite" && <AICareerSuite />}
      {activeTab === "startup_launchpad" && <StartupLaunchpad />}
      {activeTab === "hackathons" && (
        <HackathonHub onSubmissionSuccess={handleProjectSuccess} />
      )}
      {activeTab === "internships" && (
        <InternshipBoard onApplicationSuccess={handleProjectSuccess} />
      )}
      {activeTab === "mentors" && (
        <MentorNetwork onViewProfile={viewUserProfile} />
      )}
      {activeTab === "ai_matcher" && <RecommendationEngine />}
      
      {/* 3. PROTECTED ROLE GUARDS */}
      {activeTab === "admin" && (
        isAdminUser(currentUser) ? (
          <AdminConsole />
        ) : (
          <div className="bg-red-950/20 border border-red-500/30 p-6 rounded-2xl text-center space-y-3">
            <h3 className="font-sans font-bold text-red-400 text-sm">Access Denied (Role Guard)</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto">
              Your verified profile lacks Administrator system credentials. Contact local node supervisors.
            </p>
            <button 
              onClick={() => navigateToTab("home")}
              className="px-4 py-2 bg-slate-900 border border-slate-800 text-slate-300 text-xs rounded-xl hover:text-white"
            >
              Return Home
            </button>
          </div>
        )
      )}

      {activeTab === "blueprint" && <DeveloperBlueprint />}
      
      {activeTab === "professional_suite" && (
        <ProfessionalNetworkSuite 
          currentUser={currentUser} 
          onUpdateCurrentUser={onUpdateCurrentUser} 
        />
      )}

      {activeTab === "profile" && (
        <MyUserProfile 
          userId={selectedProfileId}
          currentUserId={currentUser?.id}
          onViewProfile={viewUserProfile}
          onBackToFeed={() => navigateToTab("home")}
          onUpdateCurrentUser={onUpdateCurrentUser}
        />
      )}

      {/* 4. EXPLORE HUB FOR MOBILE */}
      {activeTab === "explore" && (
        <ExploreHub onNavigate={navigateToTab} currentUser={currentUser} />
      )}

      {/* DISMISSED STATIC MENU NODES */}
      {false && (
        <div>
          <div className="grid grid-cols-2 gap-3.5 text-xs">
            <div 
              onClick={() => navigateToTab("teams")}
              className="bg-slate-900 hover:bg-slate-850 border border-slate-850 p-4 rounded-2xl space-y-2 cursor-pointer transition-all active:scale-95 text-center sm:text-left select-none"
            >
              <Users className="w-7 h-7 text-indigo-400 mx-auto sm:mx-0" />
              <h4 className="font-bold text-white">Team Builder</h4>
              <p className="text-[10px] text-slate-500 leading-normal">Solve recruiting hurdles; pair with CS, business and design rosters.</p>
            </div>

            <div 
              onClick={() => navigateToTab("ai_career_suite")}
              className="bg-slate-900 hover:bg-slate-850 border border-slate-850 p-4 rounded-2xl space-y-2 cursor-pointer transition-all active:scale-95 text-center sm:text-left select-none"
            >
              <Sparkles className="w-7 h-7 text-amber-300 mx-auto sm:mx-0" />
              <h4 className="font-bold text-white">AI Career Suite</h4>
              <p className="text-[10px] text-slate-500 leading-normal">Score resumes, pass mock technical panels, find spec roadmaps.</p>
            </div>

            <div 
              onClick={() => navigateToTab("startup_launchpad")}
              className="bg-slate-900 hover:bg-slate-850 border border-slate-850 p-4 rounded-2xl space-y-2 cursor-pointer transition-all active:scale-95 text-center sm:text-left select-none"
            >
              <Layers className="w-7 h-7 text-indigo-400 mx-auto sm:mx-0" />
              <h4 className="font-bold text-white">Startup Hub</h4>
              <p className="text-[10px] text-slate-500 leading-normal">Pitch product ideas, auto-generate AI MVPs, seek corporate co-founders.</p>
            </div>

            <div 
              onClick={() => navigateToTab("open_source")}
              className="bg-slate-900 hover:bg-slate-850 border border-slate-850 p-4 rounded-2xl space-y-2 cursor-pointer transition-all active:scale-95 text-center sm:text-left select-none"
            >
              <Cpu className="w-7 h-7 text-emerald-400 mx-auto sm:mx-0" />
              <h4 className="font-bold text-white">Open Source Hub</h4>
              <p className="text-[10px] text-slate-500 leading-normal">Claim beginner first-issues on campus repositories & earn reputation.</p>
            </div>

            <div 
              onClick={() => navigateToTab("hackathons")}
              className="bg-slate-900 hover:bg-slate-850 border border-slate-850 p-4 rounded-2xl space-y-2 cursor-pointer transition-all active:scale-95 text-center sm:text-left select-none"
            >
              <Trophy className="w-7 h-7 text-amber-400 mx-auto sm:mx-0" />
              <h4 className="font-bold text-white">Hackathons Hub</h4>
              <p className="text-[10px] text-slate-500 leading-normal">Form GDSC squads and register for technical developer runnings.</p>
            </div>

            <div 
              onClick={() => navigateToTab("internships")}
              className="bg-slate-900 hover:bg-slate-855 border border-slate-850 p-4 rounded-2xl space-y-2 cursor-pointer transition-all active:scale-95 text-center sm:text-left select-none"
            >
              <BookOpen className="w-7 h-7 text-cyan-400 mx-auto sm:mx-0" />
              <h4 className="font-bold text-white">Internships</h4>
              <p className="text-[10px] text-slate-500 leading-normal">Apply to tech roles backed by verified project checks.</p>
            </div>

            <div 
              onClick={() => navigateToTab("mentors")}
              className="bg-slate-900 hover:bg-slate-850 border border-slate-855 p-4 rounded-2xl space-y-2 cursor-pointer transition-all active:scale-95 text-center sm:text-left select-none"
            >
              <GraduationCap className="w-7 h-7 text-orange-400 mx-auto sm:mx-0" />
              <h4 className="font-bold text-white">Mentors Network</h4>
              <p className="text-[10px] text-slate-500 leading-normal">Book review slots from Google, Amazon, and Stripe developers.</p>
            </div>

            <div 
              onClick={() => navigateToTab("ai_matcher")}
              className="bg-slate-900 hover:bg-slate-850 border border-slate-850 p-4 rounded-2xl space-y-2 cursor-pointer transition-all active:scale-95 text-center sm:text-left select-none"
            >
              <Cpu className="w-7 h-7 text-fuchsia-400 mx-auto sm:mx-0" />
              <h4 className="font-bold text-white">AI Matcher</h4>
              <p className="text-[10px] text-slate-500 leading-normal">Review advanced matching results pointing to projects, teams, or mentors.</p>
            </div>
          </div>

          <div 
            onClick={() => navigateToTab("blueprint")}
            className="bg-slate-900 border border-slate-850 p-4 rounded-2xl flex items-center justify-between text-xs cursor-pointer hover:border-slate-800"
          >
            <div className="flex items-center gap-2.5">
              <Compass className="w-5 h-5 text-indigo-400" />
              <div>
                <strong className="text-white font-bold text-xs block font-sans">Vetting Blueprint & Figma Specifications</strong>
                <span className="text-[10px] text-slate-450">Review system models, security guards, frame grids, and wireflows.</span>
              </div>
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-400" />
          </div>
        </div>
      )}
    </Suspense>
  );
};
