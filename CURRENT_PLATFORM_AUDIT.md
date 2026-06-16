# Current Platform Audit: SkillCollab

This document maps out the comprehensive navigation, visual, and behavioral architecture of the SkillCollab platform exactly as it exists in the active workspace today.

---

## 1. Navbar Navigation Hub Audit

The horizontal and vertical navigation structures partition the application's major modules. This audit details the active components, displayed attributes, and available interactions across each primary top-level navigation viewport.

### Section: Home

#### Purpose
Renders the primary social timeline hub for the campus of student engineers, where users draft micro-updates, showcase project milestones, track peers, and browse community activity logs.

#### Current Components
* **Create Post Composer Card**: An inline banner displaying the current user's profile picture with a pill button trigger that opens the expansive dynamic post composer modal.
* **Category Composer Modal Selector**: Includes fields for Category select options (such as General News, Project Update, Teammate Recruitment, Achievement, or Certification), Description textarea, Project Squad Title, and skills list comma input.
* **Feed Segment Tabs**: Interactive category filter pill links ("All Updates", "Projects", "Squad Recruitment", "Hackathons", "Core Internships", and "Achievements & Certificates").
* **Refresh Inline Link Trigger**: A sub-navigation button containing a spin icon to quickly reload feed events.
* **Feed Timeline Cards Loop**: Interactive, itemized timeline components showing individual author nodes, time-tags, text logs, tag badges, resource metadata attachments, and full metrics counters.
* **Simulation Load More Pagination Button**: An interactive block trigger enabling users to paginatedly load upcoming timeline activities.

#### Data Displayed
* **User Profile Header Details**: Full name, headline role affiliation, status-indicating avatar.
* **Category Badges**: Categorical tags (e.g., ProjectUpdate, TeamRecruitment, HackathonOpportunity, AchievementPost, or CertificationPost).
* **Social Count Telemetries**: Inline numbers reflecting likes, comments, and shares.
* **Project Meta Attachments**: Title, tagline description, difficulty tier, and team size boundaries.
* **Opportunity Meta Attachments**: Title, deadline, partner location, and starts count.
* **Comment Records Feed**: Nested user comments displaying names, avatars, text payloads, and creation timestamps.

#### User Actions
* **Like / Unlike Feed Item**: Action toggle to increment or decrement the active post like telemetry.
* **Reply / Comment Inline**: Subscribes a comment contribution to the nested database discussion thread.
* **Save / Bookmark Update**: Toggles post storage to local bookmark logs.
* **Share / Repost Highlights**: Propagates post contents to the active feed timeline registry.
* **Follow / Unfollow Peer Profile**: Toggles network updates subscriptions for student, mentor, or company nodes.
* **Initiate Connection Request**: Transmits an immediate professional matchmaking invite.
* **Report Unprofessional Activity**: Flags the timeline element for moderator review.
* **Trigger Pagination Scroll**: Appends mock dynamic timeline payloads to the active timeline grid.

#### Navigation Paths
* **Clicking Profile Badge / Name**: Dynamically routes to the corresponding student or mentor `profile` page.
* **Clicking Project Attachment Tab**: Switches the viewport focus to the Projects dashboard.
* **Clicking Opportunity Attachment Tab**: Switches the viewport focus to the Hackathons dashboard.

#### API/Data Dependencies
* `/api/feed` — Fetches current community post entries and followed accounts.
* `/api/feed/posts` — Endpoint for drafting and creating updates.
* `/api/feed/posts/:id/like` — Toggles active like registers.
* `/api/feed/posts/:id/comment` — Appends nested feedback lists.
* `/api/feed/posts/:id/save` — Toggles timeline bookmarking.
* `/api/feed/posts/:id/share` — Triggers repost duplicates.
* `/api/feed/posts/:id/connect-author` — Transmits handshake invitations.
* `/api/feed/posts/:id/report` — Registers system moderation safety flags.

#### Current Feed UX Observations
* The composer card resides at the very top of the feed to encourage regular user participation.
* Feed category pill filters support horizontal scroll behaviors on constrained viewports.
* Skeletons are displayed during silent refresh sequences to present responsive, layout-safe transitions.

---

### Section: Build

#### Purpose
A combined recruitment marketplace and workspace tracking board enabling scholars to pitch college project initiatives, discover co-founders, hook repositories, and organize deliverables.

#### Current Components
* **Build Workspace Banner**: A stylized top container detailing the primary core build controls, featuring a "Pitch Innovation" modal button trigger.
* **Sub-navigation Tab Handles**: Horizontal toggles to switch viewports between "Browse Initiatives" and "Collaboration Workspace".
* **Search and Filter Toolbar**: A search inputs field linked with a "Difficulty Levels" dropdown filter selector.
* **Project Marketplace Cards Grid**: Multi-column list of pitched projects with difficulty tags, creation dates, tagline metrics, skills requirements, and active squad allocations.
* **Pitch Creation Modal Panel**: Expansive form with inputs for title, tagline, description, required skills, secondary tags, difficulty, and capacity.
* **Squad Application Cover Dialog**: Pop-up window for entering cover pitches and roles.
* **Milestone Checklist Workspace Component**: An interactive board featuring an add-task input form, checklist task rows, check button toggles, and deletion triggers.
* **Incoming Squad Applications Roster**: Rows of pending teammate requests with accept and decline action controls.
* **Git Repository Sync Board Workspace**: Displays repository details, active branch indicators, commit message draft form controls, and scrolled commits list logs.

#### Data Displayed
* **Card Metadata**: Project title, tagline description, full descriptive paragraphs, dates, and difficulty tiers.
* **Required Technical Badges**: Comma-divided skills checklists.
* **Capacity Indicators**: Member metrics (e.g., `1 / 4 Members`).
* **Active Milestones**: Checklist arrays indicating task text payloads, completion states, and unique indices.
* **Applicant Roster Entries**: Name, target role, and target project title.
* **Git Repository Telemetries**: Repository slug path, sync dots, branch log hashes, commit messages, draft author tags, and time intervals.

#### User Actions
* **Pitch New Innovation**: Launches the full-form project creator modal.
* **Browse & Search Projects**: Dynamically filters cards by stack, title, and tagline keywords.
* **Filter by Difficulty Tier**: Toggles specific beginner, intermediate, or advanced cards.
* **Draft Teammate Proposal**: Opens the cover letter pop-up, inputting required roles and cover descriptions.
* **Add Technical Work Milestone**: Appends fresh task checkboxes to the roster workspace.
* **Toggle Milestone Checkbox**: Modifies the task check state.
* **Delete Milestone Chore**: Discharges specific deliverables.
* **Accept Teammate Application**: Recruits candidate into the local project roster.
* **Decline Teammate Application**: Rejects draft application request.
* **Add Simulated Git Commit**: Pushes fresh branch entries onto the repository sync board list.

#### Navigation Paths
* **Clicking Browse / Collaboration Sub-tabs**: Switches core subtends viewports between browse boards and the checklist dashboards.
* **Clicking Project Join Button**: Instantiates the applicant cover letter portal.

#### API/Data Dependencies
* `/api/projects` — Fetches current project listings or posts fresh project pitches.
* `/api/projects/:id/apply` — Transmits teammate proposals.
* `/api/co-founders/posts` — Backup fallback endpoints to feed launchpad items.

#### Current Build UX Observations
* Contains both the discoverable cards grid and the workspace modules in a single viewport, using sub-tabs to avoid structural clutter.
* Interactive task checklists update states instantly without page reloads.

---

### Section: Explore

#### Purpose
Serves as an expansive discovery deck highlighting trending projects, active campus hackathons, expert professionals, open-source challenges, and seminars.

#### Current Components
* **Hero Overview Header**: Stylized dark background banner describing the scope of campus-wide innovations.
* **Trending Projects Carousel**: A horizontal swipeable container showing top-rated student developer repositories.
* **Ecosystem Hackathons Carousel**: Slides showcasing upcoming developer jams, deadlines, and prize structures.
* **Expert Mentors Carousel**: Dynamic rows displaying certified professional advisors.
* **Open Source Opportunities Carousel**: Grid displaying beginner-friendly issues on campus repositories.
* **Startup Launchpad Carousel**: Carousel presenting student-built startups seeking co-founders.
* **Campus Events & Seminars Carousel**: List showing local technical masterclasses and seminar programs.

#### Data Displayed
* **Project Cards**: Repositories titles, descriptions, required skillsets, and star telemetries.
* **Hackathon Cards**: Event titles, dates, categories, and prize pool scopes.
* **Mentor Cards**: Names, professional headlines, expert areas, and indicator avatars.
* **OS Issue Cards**: Repository scopes, issue titles, points, and difficulty tiers.
* **Startup Cards**: Startup names, taglines, rolls required, and funding stages.
* **Seminar Cards**: Lecture topics, dates, locations, speakers, and RSVP buttons.

#### User Actions
* **Toggle Star Project Rating**: Bookmarks or stars specific projects item carousels.
* **Register RSVP Seat for Seminars**: Toggles seat reservations.
* **Scroll Carousels horizontally**: Swipes cards on smaller touchscreens.

#### Navigation Paths
* **Clicking "All Projects"**: Navigates user focus to Project Board (`projects`).
* **Clicking "Ecosystem Board"**: Navigates user focus to Hackathons (`hackathons`).
* **Clicking "Mentors Net"**: Navigates user focus to Mentor Network (`mentors`).
* **Clicking "OS Suite"**: Navigates user focus to OS Hub (`open_source`).
* **Clicking "Launchpad"**: Navigates user focus to Startup incubator (`startup_launchpad`).
* **Clicking Carousel Buttons**: Activates internal routing functions.

#### API/Data Dependencies
* `/api/projects` — Feeds trending initiatives.
* `/api/teams` — Retrieves current squad posts.
* `/api/co-founders/posts` — Populates active startup pitches.
* `/api/open-source/issues` — Queries campus open source repositories.
* `/api/mentors` — Retrieves active professional advisor directories.
* `/api/hackathons` — Pulls scheduled hackathon cards.

#### Current Explore UX Observations
* The touch-responsive horizontal carousels enable dense discovery pathways without exhausting vertical margins.
* RSVP actions offer instant layout feedback, shifting states from "RSVP Seat" to "RSVP'd ✓".

---

### Section: Chats

#### Purpose
The centralized collaboration messenger that integrates communication across teams, projects, mentors, recruiters, and classic network connections. Including direct text, file sharing, and simulated voice recordings.

#### Current Components
* **Category Left Sidebar Filters**: Sidebar toggles ("All", "Connections", "Teams", "Projects", "Mentors", "Recruiters", "Startup Teams").
* **Threads List Panel**: Responsive vertical roster of active chat threads showing avatars and unread indicators.
* **New Message Contacts Trigger**: Quick button that opens the network roster to start active chats.
* **Central Discussion Window**: Renders historical thread feeds, user tags, and response logs.
* **Voice Note Player Widget**: Simulated inline voice player with seek controls and duration readouts.
* **Reply Attachment Tray**: Pop-up indicator that docks reply parent structures onto the composer input.
* **Actionable Message Options Popover**: Triggered by options buttons to pin, edit, forward, reply, or delete messages.
* **Interactive Chat Input Console**: Includes file attachments, emoji pickers, voice recording controls, and text input.
* **Dynamic Typing Indicator Dots**: Staggered animation showing active participant typing states.
* **Incoming Network Requests Panel**: List displaying pending connection invites from recruiters, mentors, and peers.

#### Data Displayed
* **Thread Details**: Thread title, unread message badges, and categories.
* **Conversation Messages**: Text messages, author tags, formatted timestamps, and edit badges.
* **Attachments Metadata**: File name, file type (e.g. PDF/Zip), and sizes.
* **Reactions Counter**: Emoji arrays reporting reaction tallies.
* **Typing Log States**: Informational lines (e.g., `"Priya Patel is typing..."`).
* **Connection Invite Cards**: Name of sender, current headline affiliation, and notes.

#### User Actions
* **Change Thread Category Filters**: Isolates direct, team, or mentor discussions.
* **Select Chat Conversation Thread**: Switches the active discussion log.
* **Draft Message Text**: Inputs alphanumeric chat content.
* **Initiate Voice Recording**: Records voice notes with an active timer.
* **Attach Virtual Files**: Drafts simulated mock attachments.
* **Send Message**: Transmits message payloads into the conversation database.
* **Edit Sent Message**: Replaces historic text payload content.
* **Pin Message**: Pins conversation content to the active sidebar.
* **Delete Message**: Flags messages as retracted.
* **Add Reactions**: Appends thumbs-up or heart reactions.
* **Resolve Peer Invites**: Accepts or declines pending network connection logs.

#### Navigation Paths
* **Clicking Thread Avatars**: Opens target user profiles.
* **URL Sync Routing**: Automatically sets pathname variables (e.g. `/messages/:id`).

#### API/Data Dependencies
* `/api/connections` — Populates direct peer connection states.
* `/api/chats` — Integrates discussion messages.

#### Current Chats UX Observations
* Supports full desktop-size dual pane views alongside toggleable mobile slide-drawers.
* Simulated real-time typing indicators match live conversation behaviors.

---

### Section: Profile

#### Purpose
Establishes the user's secure digital portfolio, showcasing academic achievements, verified developer skills, project history, certifications, and peer endorsements.

#### Current Components
* **User Profile Header Card**: Displays the user's cover banner, avatar, name, verification badges, headline, location, social links, and core statistics.
* **Tab-Bar Controller**: Selects active sub-sections ("Portfolio", "Engineering Detail", "Hackathons", "Endorsements & Recommendations", "Activity Log", "Connections", "Followers", "Following").
* **Portfolio Sub-tab Layout**: Shows the user's career roadmap, experience timeline, and certifications.
* **Engineering Sub-tab Layout**: Lists pinned skills, connected Git repositories, and contribution logs.
* **Endorsements Sub-tab Panel**: Renders endorsement counters, recommendations, and feedback submission forms.
* **Connected Networks Sub-tabs Grid**: Displays active search fields and rows of connected contacts.
* **Profile Credentials Admin Panel**: Modular forms to update name, bio, tags, links, and avatar coordinates.

#### Data Displayed
* **Main Card Stats**: Reputation level, follower count, following count, profile views, and portfolio strength score.
* **Experience Records**: Title, company, duration, and descriptions.
* **Education Parameters**: University name and graduation year.
* **Git Connected Badges**: Repository list, branch states, and commit logs.
* **Verification Status**: Displays a "Verified Student" checkmark.
* **Written peer recommendations**: Reviews, author roles, and relationships.

#### User Actions
* **Edit Profile**: Switches the template into editable form consoles.
* **Modify Subtabs**: Isolates specific portfolio or engineering views.
* **Add Experience Timeline Node**: Inserts new work experience blocks.
* **Add Certificate Badge**: Inserts certified credentials.
* **Post Endorsement Written Recommendation**: Drafts feedback to peer portfolios.
* **Block Profile Node**: Blacklists target profiles, shielding communication.
* **Follow / Unfollow**: Subscribes to the profile's update feed.

#### Navigation Paths
* **Clicking Connection Grid Avatars**: Switches the active profile view to target user metrics.
* **Back to Feed link**: Routes the user back to the primary HomeFeed.

#### API/Data Dependencies
* `/api/users/:id/profile` — Retrieves the active profile context.
* `/api/users/:id/connections` — Fetches connected contacts.
* `/api/users/:id/followers` — Pulls followers statistics.
* `/api/users/:id/projects` — Integrates project histories.

#### Current Profile UX Observations
* Displays deep technical validation (e.g., Git commits and verified student checkmarks) to emphasize academic credibility.
* Forms are enclosed in inline slide-drawers to avoid disrupting layout flow.

---

## 2. Global UI Component Audit

Global components ensure cohesive layouts, styling consistency, and helpful navigation across the platform.

* **Top Brand Header Bar (`sticky`)**:
  * **Branding Area**: Includes the stylized "SkillCollab" typographic logo and a persistent "SaaS Enterprise" badge.
  * **Responsive Drawer Toggle**: Interactive hamburger menu, displaying or collapsing navigation sidebars on dynamic mobile viewports.
  * **Quick Profile Widget**: Renders active avatar coordinates, initials, and live reputation points.
  * **Theme Switcher Selector**: Toggles between light and dark theme configurations.
  * **Inbox Notifications Dot**: Features an badge showing unread notification counts, opening the alerts drawer.
* **Vertical Navigation Sidebar Panel**:
  * Segments routes under "Home", "Community", "Build", "Career", and "Messages" headers.
  * Renders individual paths with distinct, interactive micro-animations.
* **Right Panel Context Widgets (`xl` screen layout only)**:
  * **Suggested Partners**: Refers users to highly matched profiles, including match scores and direct message triggers.
  * **Ecosystem Hackathons**: Displays active campus hackathons.
  * **Recent Alerts Inbox Feed**: Interactive notification logs featuring clear-all markers.
* **Responsive Mobile Bottom Menu**:
  * Locked 5-item bar with spring micro-interactions: Home Feed, Projects Board, Explore Hub, Collaboration Chats, and Profile Page.

---

## 3. Core Data Schema Definitions

Below are the data structures modeled inside the routing structures and databases:

* **User**: `id`, `fullName`, `email`, `role`, `reputationPoints`, `avatarUrl`, `onboardingCompleted`.
* **Profile**: `userId`, `college`, `branch`, `graduationYear`, `bio`, `githubLink`, `linkedinLink`, `portfolioLink`, `skills` (array), `interests` (array), `careerGoals`.
* **FeedPost / Post**: `id`, `userId`, `authorName`, `authorRole`, `authorAvatar`, `type` (Category), `content` (Markdown), `skills` (array), `likesCount`, `likes` (array), `commentsCount`, `comments` (array), `sharesCount`, `createdAt`.
* **Comment**: `id`, `author`, `avatar`, `text`, `createdAt`.
* **Project**: `id`, `title`, `tagline`, `description`, `skillsNeeded` (array), `tags` (array), `difficulty`, `teamSizeLimit`, `currentTeamSize`, `creatorId`, `createdAt`.
* **ChatMessage**: `id`, `senderId`, `senderName`, `senderAvatar`, `content`, `timestamp`, `reactions` (record), `isPinned`, `replyToMessageId`, `isEdited`, `isDeleted`, `voiceNote`, `attachment` (object).
* **ChatThread**: `id`, `title`, `avatar`, `type` (Direct/Team/Project), `unreadCount`, `messages` (array).
* **Notification**: `id`, `title`, `message`, `read`, `createdAt`.
* **Relation**: `followerId`, `followingId`, `type` (student/mentor/company).
* **History / Activity**: `id`, `userId`, `type`, `relation`, `timestamp`.

---

## 4. Platform Route Registry

These routes determine the viewports rendered inside `AppRouter.tsx`:

| ActiveTab Identifier | Component / Page Target | Functional Scope Description |
|---|---|---|
| `home` / `dashboard` | `HomeFeed` | Core timeline. |
| `explore` | `ExploreHub` | Discovery carousel hub. |
| `projects` | `ProjectMarketplace` | Project profiles discoverable board. |
| `teams` | `TeamBuilder` | Recruits assembly control decks. |
| `chats` | `WorkspaceChat` | Multi-category unified chat. |
| `profile` | `MyUserProfile` | Technical profile layout. |
| `ai_career_suite` | `AICareerSuite` | Resume scanning and assessments. |
| `startup_launchpad` | `StartupLaunchpad` | Incubator deck pitches. |
| `open_source` | `OpenSourceHub` | OS challenge submissions. |
| `hackathons` | `HackathonHub` | Team assemblies for event registrations. |
| `internships` | `InternshipBoard` | Job applications grid. |
| `mentors` | `MentorNetwork` | Interactive mentor booking. |
| `ai_matcher` | `RecommendationEngine` | AI-matched peers. |
| `professional_suite`| `ProfessionalNetworkSuite`| Professional dashboard. |
| `admin` | `AdminConsole` | Moderation tools. |
| `blueprint` | `DeveloperBlueprint` | Specifications and interactive blueprints. |

---

## 5. Global Feature Matrix Check-list

This checklist tracks the core experiences currently built and verified within the codebase:

- [x] **Secure Academic Profile Onboarding**
  - [x] Institute verification fields.
  - [x] Dynamic generation of initial avatars by peer name initials.
  - [x] Local storage validation checks to survive session refreshes.
- [x] **Rich Social Media Timeline Engine**
  - [x] Alphanumeric text and classification logs.
  - [x] Interactive category filters.
  - [x] Double-buffer liking models.
  - [x] Threaded peer feedback comments.
  - [x] Post saving.
- [x] **Project Build Board Marketplace**
  - [x] Detail creation form.
  - [x] Difficulty tiers.
  - [x] Cover letter proposal templates.
- [x] **Centralized Workspace Board**
  - [x] Project task cards checklists.
  - [x] Incoming squad recruitment application solvers.
  - [x] Dynamic Git commits mock terminal logger feeds.
- [x] **Responsive Desktop-to-Mobile App Frame**
  - [x] Persistent horizontal header.
  - [x] Interactive collapsible vertical menu bar.
  - [x] Floating mobile bottom navigation.
- [x] **Interactive Unified Messenger**
  - [x] Messaging categories sidebar filters.
  - [x] Media attachments (PDF/Zip layout cards).
  - [x] Simulated voice note recorders.
  - [x] Live search filters.
- [x] **Peer Recommendation System**
  - [x] Endorsements counters.
  - [x] Written reference forms to endorse peer profiles.

---

## 6. Functional Documentation Gaps

These areas require clearer documentation to enhance feature discoverability:

* **Reputation Points Accumulation Scale**: The profile page prominently displays reputation scores (e.g., `🏆 180 pt`), but the exact formulas and rules for earning points (e.g., via commits, checklists, or replies) are not fully detailed in the current UI.
* **Project Team Membership Boundaries**: While users can pitch projects and apply through the recruitment tools, the system lacks explicit visual cues on card items to indicate whether a user is currently a member or the creator of a project.
* **Notifications Interconnection Channels**: System alerts appear in the header drawer, but the specific events that trigger notification dispatches (such as comment replies or peer approvals) would benefit from more detailed in-app explanations.
