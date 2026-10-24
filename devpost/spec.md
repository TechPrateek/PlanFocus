---
doc: spec
status: approved
---

# FocusFlow AI — Technical Specification

## How This Works, In Plain Language
FocusFlow AI is built as a fast, responsive Single Page Application (SPA) running entirely in the user's browser. 

Here is how the "tech stack" fits together:
1. **React with TypeScript (The UI & Logic):** React breaks the interface into reusable, independent lego blocks called "Components" (like the Timer, the Today Schedule, the Analytics bar). TypeScript acts as our safety shield—it defines strict "Types" for data (like what a Subject or a Study Task looks like) so the browser never crashes from unexpected missing fields.
2. **Vite (The Engine & Bundler):** Vite is an ultra-fast build tool that serves our React code during development and bundles it into optimized HTML, CSS, and JavaScript for deployment.
3. **Tailwind CSS (The Styling System):** Instead of writing thousands of lines of custom CSS, Tailwind provides utility classes to achieve the dark, minimalist Linear/Notion aesthetic with consistent padding, borders, and colors.
4. **Deterministic Scheduling Engine (The Math Brain):** A pure TypeScript algorithm that calculates study priorities using exam dates, difficulty levels, and daily capacity. It requires zero network calls and runs in under 5 milliseconds.
5. **Web Audio API (The Sound System):** Generates gentle audio chimes natively in the browser without needing external MP3 audio files that might fail to load.
6. **Browser LocalStorage (The Memory):** Whenever you add a subject, finish a study block, or trigger an adaptive rebalance, the app saves state into `localStorage`. When you refresh or close the tab, your data is restored instantly.

Why this architecture? It requires zero backend servers, zero database credentials, zero cloud costs, and works 100% offline—making it rock-solid and fail-proof for hackathon evaluation and demos.

---

## The Core Journey Through the System
PRD ref: `prd.md > The Core Journey`.

1. **User lands on App:** `App.tsx` reads `localStorage`. If empty, it initializes the state with welcoming defaults and shows the Setup Wizard or 1-Click "Load Sample Student Plan" button.
2. **User enters subjects or loads demo:** The input triggers `state.setSubjects()`. The `schedulingEngine.ts` receives the subjects, topics, and daily hours, computes the priorities, and outputs a day-by-day `DailySchedule[]` array.
3. **User launches Focus Timer:** Clicking "Start Session" on a topic sets `activeTask` in `TimerContext`. The `FocusTimer.tsx` component begins a 25-minute countdown.
4. **Timer finishes:** `audioChime.ts` plays a gentle chime using the browser's native Web Audio API. The user confirms completion $\to$ `state.completeSession(taskId)` records study minutes, marks topic progress, increments streak, and updates the Today view.
5. **User simulates missed session & rebalances:** Clicking "Simulate Missed Task" flags a task as `missed`. `App.tsx` renders the `RebalanceBanner.tsx`. When the user clicks "Rebalance Plan", `schedulingEngine.ts` redistributes remaining uncompleted work across future available days up to the daily study limit. If the workload exceeds the remaining days before the exam, a `CapacityConflictModal.tsx` is displayed with recommended adjustments.

---

## Stack
- **Language:** TypeScript 5.x — [TypeScript Docs](https://www.typescriptlang.org/)  
  *Rationale:* Static type enforcement prevents runtime bugs across scheduling, timers, and storage models.
- **Framework:** React 18 / 19 with Vite — [Vite Docs](https://vite.dev/), [React Docs](https://react.dev/)  
  *Rationale:* Instant hot-module replacement (HMR), sub-second page loads, and modular component architecture.
- **Styling:** Tailwind CSS + Lucide React Icons — [Tailwind CSS Docs](https://tailwindcss.com/), [Lucide Docs](https://lucide.dev/)  
  *Rationale:* Precise, high-density dark UI styling matching Linear and Notion without stylesheet bloat.
- **Audio Feedback:** HTML5 Web Audio API Synthesizer — [Web Audio API Docs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)  
  *Rationale:* Generates clean harmonic sine/bell tones directly via browser oscillators; zero network dependencies or missing audio asset 404s.
- **Persistence:** Browser `localStorage` with typed JSON serialization  
  *Rationale:* Instant zero-latency operations, no login or database infrastructure required.
- **AI Enhancement (Optional):** Google Gemini API (`gemini-2.5-flash` or `gemini-1.5-flash`) via standard fetch or `@google/genai` when `VITE_GEMINI_API_KEY` is supplied in `.env`, seamlessly falling back to the rule-based engine.

---

## Where It Runs and How Someone Tries It
- **Runtime:** Any modern web browser (Chrome, Firefox, Safari, Edge).
- **Local Dev Server:** Runs on Node.js 18+ (tested on Node v24).
- **Run Command:**
  ```bash
  npm install
  npm run dev
  ```
  Opens at `http://localhost:5173`.
- **Demo Recording Instructions:**
  Open `http://localhost:5173`. Click "Load Sample Student Plan" in the top bar. Show the Today schedule, click "Start Focus Session" to preview the Pomodoro timer, then click "Simulate Missed Session" and "Rebalance Plan" to demonstrate adaptive rescheduling and the capacity warning.

---

## Look and Feel
PRD ref: `prd.md > Look and Feel` and `scope.md > Inspiration & Identity`.
- **Theme:** Strict Obsidian Dark Theme (`bg-[#090a0f]`, panels `bg-[#12151e]`, borders `border-[#1e2230]`).
- **Accent:** Indigo / Electric Violet (`#6366f1` / `#818cf8`) for interactive focus states, primary buttons, and timer progress rings.
- **Status Accents:** Emerald (`#10b981`) for completed items/streaks, Amber (`#f59e0b`) for medium difficulty/warnings, Rose (`#ef4444`) for missed sessions and urgent exams.
- **Typography:** Sans-serif for body (`Inter`), tabular monospace figures (`font-mono`) for the Pomodoro clock, countdown badges, and hour capacity meters.

---

## Components

### 1. `Header.tsx`
Displays the FocusFlow AI logo, current study streak badge, today's completed study hours vs target meter, quick-launch demo data button, and active timer status.
PRD ref: `prd.md > Top Bar / Status Banner`.

### 2. `TodayDashboard.tsx`
Renders the prioritized focus tasks for today, upcoming exam countdown cards (e.g. "Data Structures: Exam in 5 days"), and quick task completion triggers.
PRD ref: `prd.md > The Core Journey` and `prd.md > Screens and Layout`.

### 3. `ScheduleTimeline.tsx`
Renders the day-by-day study roadmap from Today until the latest exam date. Shows scheduled topics, estimated durations, and daily capacity meters (e.g. 2.5h / 3.0h filled).
PRD ref: `prd.md > 2. Transparent Scheduling Engine`.

### 4. `FocusTimer.tsx`
Dedicated Pomodoro timer interface with Work (25m), Short Break (5m), and Long Break (15m) modes. Features circular progress ring, play/pause/reset, sound toggle, and logs completed session time directly to the current topic.
PRD ref: `prd.md > 4. Interactive Focus Timer (Pomodoro)`.

### 5. `RebalanceBanner.tsx` & `ConflictModal.tsx`
Surfaces the adaptive rebalance call-to-action when tasks are missed. If remaining workload exceeds remaining calendar days, displays actionable warnings and adjustment controls.
PRD ref: `prd.md > 3. Adaptive Rebalance & Missed Session Recovery`.

### 6. `SubjectManagerModal.tsx` & `SetupWizard.tsx`
Provides intuitive forms to add/edit/delete subjects, input exam dates, configure topics with difficulty and hours, and adjust daily study availability.
PRD ref: `prd.md > 1. Setup Wizard & Demo Data Loader`.

### 7. `AnalyticsView.tsx`
Visual progress dashboard showing subject completion percentages, total hours logged, pending topics count, and streak history.
PRD ref: `prd.md > 5. Progress Analytics & Streaks`.

---

## Data Model

```typescript
export type Difficulty = 'easy' | 'medium' | 'hard'; // Weights: easy=1x, medium=1.5x, hard=2x

export interface Topic {
  id: string;
  subjectId: string;
  name: string;
  difficulty: Difficulty;
  estimatedHours: number;
  completedHours: number;
  isCompleted: boolean;
}

export interface Subject {
  id: string;
  name: string;
  color: string; // Hex color code
  examDate: string; // ISO format (YYYY-MM-DD)
  topics: Topic[];
}

export interface ScheduledTask {
  id: string;
  topicId: string;
  subjectId: string;
  date: string; // YYYY-MM-DD
  durationHours: number;
  isCompleted: boolean;
  isMissed: boolean;
  priorityScore: number;
}

export interface DailySchedule {
  date: string;
  dayOfWeek: string;
  tasks: ScheduledTask[];
  totalHours: number;
  capacityHours: number;
  isExamDay: boolean;
  examSubjectNames: string[];
}

export interface UserSettings {
  dailyAvailableHours: number; // e.g. 3.0
  pomodoroWorkMinutes: number; // 25
  pomodoroShortBreakMinutes: number; // 5
  pomodoroLongBreakMinutes: number; // 15
  soundEnabled: boolean;
}

export interface AppState {
  subjects: Subject[];
  schedule: DailySchedule[];
  settings: UserSettings;
  streak: number;
  lastActiveDate: string;
  totalStudyMinutes: number;
}
```

---

## File Structure

```
focusflow-ai/
├── index.html                   # HTML entrypoint
├── package.json                 # Dependencies and scripts
├── tsconfig.json                # TypeScript compiler config
├── vite.config.ts               # Vite bundler configuration
├── tailwind.config.js           # Tailwind design tokens
├── postcss.config.js            # PostCSS configuration
├── src/
│   ├── main.tsx                 # React DOM root entry
│   ├── App.tsx                  # Main app shell, tabs & layout
│   ├── index.css                # Global Tailwind directives & dark theme base
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces (Subject, Topic, Schedule, etc.)
│   ├── services/
│   │   ├── schedulingEngine.ts  # Priority scoring & calendar distribution algorithm
│   │   ├── storageService.ts    # LocalStorage persistence & migration
│   │   ├── sampleData.ts        # Pre-loaded realistic college exam sample data
│   │   ├── audioService.ts      # Web Audio API chime synthesizer & sound fallback
│   │   └── aiService.ts         # Optional Gemini API integration with rule fallback
│   ├── components/
│   │   ├── Header.tsx           # Top navigation bar, streak, and quick actions
│   │   ├── TodayDashboard.tsx   # Today's focus queue & exam countdowns
│   │   ├── ScheduleTimeline.tsx # Day-by-day study roadmap & capacity bars
│   │   ├── FocusTimer.tsx       # Pomodoro timer with SVG progress ring
│   │   ├── AnalyticsView.tsx    # Subject mastery progress & study stats
│   │   ├── SetupWizard.tsx      # Onboarding modal for new users
│   │   ├── SubjectModal.tsx     # Add/edit subjects, topics, and exam dates
│   │   ├── RebalanceBanner.tsx  # Adaptive replan notification
│   │   └── ConflictModal.tsx    # Capacity deficit alert & resolution
│   └── utils/
│       └── dateUtils.ts         # Date math, formatters, and day calculations
├── devpost/                     # Devpost learning hackathon documents
│   ├── learner-profile.md
│   ├── scope.md
│   ├── prd.md
│   └── spec.md
├── README.md                    # Setup, demo script, and architectural overview
└── .gitignore                   # Ignore node_modules, .env, and personal profile
```

---

## External Services and Dependencies
- **Dependencies:**
  - `react`, `react-dom` (~18.3 or 19.x)
  - `lucide-react` (clean icons for subjects, timers, exams, settings)
  - `canvas-confetti` (for celebratory particle burst when completing a study goal)
  - `clsx`, `tailwind-merge` (clean conditional CSS utility)
- **APIs:**
  - Optional: Google Gemini API via `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent` using `VITE_GEMINI_API_KEY`.
  - Zero external databases or mandatory API keys required. 100% operational offline.

---

## Important Failure Modes & Fallbacks
1. **Browser Audio Blocked / Muted:** If the user hasn't interacted with the page yet or system audio is muted, `audioService.ts` catches `AudioContext.resume()` errors silently and triggers visual fallback notifications (flashing browser tab title and toast banner).
2. **Schedule Overcapacity (Exam in 2 days, 15 hours remaining):** The algorithm detects that `remainingWorkloadHours > availableCalendarHours`. Rather than crashing or silently dropping tasks, it marks the schedule in deficit and triggers `ConflictModal.tsx` suggesting the user either bump daily availability or de-prioritize lower-weight topics.
3. **Corrupted LocalStorage Data:** `storageService.ts` wraps all `JSON.parse()` in try-catch. If corrupted data is encountered, it seamlessly recovers default state without white-screening.

---

## What Was Simplified and Why
- **Browser LocalStorage instead of Cloud PostgreSQL/Supabase:** Removes all auth setup, connection dropouts, environment secret leaks, and latency. Anyone evaluating the project can open it and test immediately.
- **Web Audio Oscillators instead of MP3 Audio Assets:** Generates clean digital bell frequencies directly in code; eliminates missing audio asset 404s and cross-origin CORS errors.
- **Client-Side Deterministic Scheduler instead of Pure LLM Schedule Prompting:** Generates consistent, mathematically exact schedules with zero token limits, zero latency, and zero hallucination.

---

## Decisions and Open Issues
- **Learner Understanding Check:** Clarified the modern React + Vite + TypeScript tech stack—explaining how TypeScript types prevent bugs, how Vite bundles files, and how components cleanly isolate features.
- All technical choices, components, and data structures are fully resolved and ready for implementation in `5-build`.
