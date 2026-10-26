# FocusFlow AI 🎯
> **Smart, Adaptive Study Planner and Focus Companion for College Students**  
> *Devpost Hackathon Submission — Build With AI: Basics*

---

## 🌟 Overview
College students often juggle 4–6 rigorous courses, multiple exam deadlines, and shifting workloads with only 2–4 hours of daily study availability. Traditional study tools fall into two traps:
1. **Static to-do lists** that lack time-budgeting and panic students with endless unchecked tasks.
2. **Rigid calendar blocks** that break down the moment a student misses a single study session.

**FocusFlow AI** solves this with **Adaptive Rebalancing**:
It turns course syllabi, exam deadlines, and daily available study hours into realistic, prioritized study blocks. If life happens and you miss a session, **one click recalculates future days** based on exam urgency and topic difficulty—no guilt, no broken schedules.

---

## 🚀 Key Features

1. **Deterministic Priority Scheduling:**
   Calculates daily workloads using a transparent formula:
   $$\text{Priority} = \frac{\text{Difficulty Weight}}{\text{Days Until Exam} + 0.1} \times \text{Workload Hours}$$
   Distributes topics up to your daily study limit without overloading, and strictly caps tasks before exam dates.
2. **One-Click Adaptive Rebalance (The Unique Kernel):**
   Missed a session? Click "Rebalance Plan" to redistribute pending topics smoothly across remaining days.
3. **Capacity Conflict Warning:**
   If remaining coursework cannot realistically fit before an exam date at your current pace, the app proactively alerts you with actionable remedies (e.g. adjust daily hours or prioritize high-difficulty topics).
4. **Integrated Pomodoro Focus Timer:**
   Built-in Work (25m), Short Break (5m), and Long Break (15m) intervals with circular SVG progress, ambient Web Audio harmonic chimes, and automatic session logging.
5. **Visual Progress & Streaks:**
   Track syllabus mastery by course, total hours studied, pending topics, and daily focus streaks.
6. **Zero-Friction Local Persistence:**
   All data persists in browser `localStorage`. Survives page reloads with zero signups or login walls.
7. **Judge & Evaluator Demo Controls:**
   Includes a 1-click **"Load Demo Data"** button (preloading realistic Computer Science, Organic Chemistry, and Linear Algebra exam scenarios) and a **"Simulate Miss"** button to test the adaptive rebalance loop in under 10 seconds.
8. **High-Precision Dual-Engine Syllabus Ingestion (PDF / TXT / DOC + Gemini AI):**
   Import real-world college syllabi, lecture schedules, or reading outlines instantly via drag-and-drop or text paste:
   - **Local Heuristic Engine (100% Offline):** Automatically purges boilerplate noise (office hours, grading weight percentages, academic honesty policies, book ISBNs), resolves multi-format dates (including ordinals like `"Nov 20th"` or `"December 18 at 2pm"`), and parses schedule tables.
   - **Gemini AI Zero-Shot Extraction:** 1-click structured JSON extraction powered by Google Gemini Flash, outputting exact course titles, verified exam deadlines, and modular topic lists with cognitive difficulty and workload hours.
   - **Live Confidence & Topic Review:** Visual confidence badge with an interactive editor to tweak hours or topics before generating your plan.
9. **Fintech Command Center UI/UX (PayRevive Aesthetic):**
   Re-engineered with high-contrast day and dark modes, DM Mono telemetry badges, live status pulses, radial progress rings, and frictionless navigation.

---

## 🛠️ Tech Stack & Architecture

- **Frontend:** React 18 / 19 + TypeScript 5
- **Build System:** Vite 6 (sub-second HMR and production bundling)
- **Styling:** Tailwind CSS (Obsidian dark theme inspired by Linear and Notion)
- **Icons:** Lucide React
- **Audio Synthesizer:** Native HTML5 Web Audio API (zero external audio file dependencies)
- **Persistence:** Browser `localStorage` with typed JSON serialization
- **AI Integration (Optional):** Google Gemini API (`gemini-1.5-flash`) for automated study technique advice, falling back 100% reliably to offline rule-based recommendations.

---

## 🏃 Running Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended; tested on Node v24)
- [Git](https://git-scm.com/)

### Quick Start
```bash
# 1. Clone the repository
git clone https://github.com/TechPrateek/PlanFocus.git
cd PlanFocus

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open your browser to `http://localhost:5173`.

### Automated Verification Tests
Run the deterministic algorithm verification suite:
```bash
npm test
```

### Production Build
```bash
npm run build
```

---

## 🎬 1–2 Minute Demo Video Script

| Time | Action | Voiceover / Talking Point |
|---|---|---|
| **0:00 - 0:20** | Open `http://localhost:5173` with Obsidian dark theme | *"Welcome to FocusFlow AI, an adaptive study planner built for college students preparing for exams without burnout."* |
| **0:20 - 0:45** | Click **"Load Demo Data"** | *"With one click, our demo loads realistic courses—Data Structures, Organic Chemistry, and Linear Algebra—with upcoming exam countdowns."* |
| **0:45 - 1:10** | Show **Today's Plan** & Launch **Focus Timer** | *"Our priority algorithm schedules topics up to our 3-hour daily capacity. Let's launch the Pomodoro timer on our top priority topic: AVL Trees. Notice the Web Audio chime and session logging."* |
| **1:10 - 1:40** | Click **"Simulate Miss"** $\to$ Click **"Rebalance Plan"** | *"Here is the magic moment: if you miss a study session, traditional apps fall apart. In FocusFlow AI, one click on 'Rebalance Plan' intelligently redistributes remaining topics forward without dropping any content."* |
| **1:40 - 2:00** | Switch to **Schedule Timeline** & **Analytics** | *"The schedule updates, progress bars track syllabus mastery, and your streak keeps growing. FocusFlow AI makes college study realistic, focused, and stress-free."* |

---

## 📋 Devpost Learn Hackathon Artifacts
This project was designed and built strictly following the official Devpost Learn Skill Pack (`challengepost/learn-ai-basics`):
- `devpost/learner-profile.md` — Learner background, technical goals, and communication preferences
- `devpost/scope.md` / `scope.html` — Approved proof-of-concept boundaries and core kernel
- `devpost/prd.md` / `prd.html` — Product requirements, user journey, and acceptance criteria
- `devpost/spec.md` / `spec.html` — Technical specification and architectural blueprint
- `devpost/checklist.md` — Verified build slices and checkpoints

---

## 📄 License
MIT License. Built for Devpost Build With AI: Basics Hackathon.
