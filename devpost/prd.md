---
doc: prd
status: approved
---

# FocusFlow AI — Product Requirements

An adaptive, stress-free smart study planner and focus companion for college students preparing for exams and deadlines.
Source: `scope.md > Who It's For` and `scope.md > The Unique Kernel`.

---

## The Core Journey
1. **Landing & Setup:** The student opens the app. As a first-time visitor, they see a clean welcome state with two primary choices: "Start Setup Wizard" or "Load Sample Student Plan (Demo)".
2. **Inputting Constraints:** In the setup wizard (or subjects manager), the student defines their subjects (e.g., "Data Structures", "Organic Chemistry"), upcoming exam dates, individual topics, estimated hours per topic, difficulty level (Easy = 1x, Medium = 1.5x, Hard = 2x weight), and daily available study hours (e.g., 3 hours/day).
3. **Plan Generation:** FocusFlow AI calculates and displays a day-by-day study calendar leading up to each exam. Each day is packed up to—but never exceeding—the student's daily hour capacity, prioritizing earlier exams and harder topics.
4. **Execution in Focus Mode:** On today's dashboard, the student selects their next scheduled topic and clicks "Start Focus Session". A full-screen or dockable Pomodoro timer runs with work intervals (25m), short breaks (5m), and long breaks (15m), accompanied by gentle audio chimes (with graceful fallback if browser sound permissions are muted).
5. **Session Outcome & Adaptive Rebalance:**
   - **Completed:** The student marks the session complete. The task moves to completed, the daily progress ring fills, study hours increment, and the streak counter ticks up.
   - **Missed Session:** If a student misses a planned session (or clicks "Simulate Missed Session" in the demo), the app flags the missed workload and displays an **"Adaptive Rebalance"** banner. Clicking "Rebalance Plan" instantly recalculates future days without dropping the topic, adjusting daily workloads. If the total workload exceeds the time remaining before an exam, a clear **Capacity Conflict Warning** is shown with suggested adjustments.
6. **Progress Tracking:** The student visits the Analytics tab to view subject mastery breakdowns, weekly hours studied, completed vs. pending topics, and active focus streaks. All progress persists across browser reloads without login.

---

## Screens and Layout

The application uses a focused, responsive desktop-first layout with a collapsible sidebar and clean mobile drawer navigation:

1. **Top Bar / Status Banner:** Displays current streak, today's study target vs. completed hours, quick-action "Load Demo Data", and active Pomodoro miniature widget.
2. **Main Navigation (Sidebar / Tabs):**
   - **Dashboard (Today):** Today's prioritized study blocks, quick timer launch, upcoming exam countdown cards, and quick task check-off.
   - **Study Schedule (Calendar/Timeline View):** Day-by-day study roadmap leading up to exams, showing scheduled topics, estimated durations, and capacity meters.
   - **Subjects & Syllabus:** List of subjects, topics, difficulty ratings, exam dates, and a form to add/edit/delete.
   - **Focus Timer:** Dedicated distraction-free Pomodoro surface with timer controls, ambient audio toggle, and current topic card.
   - **Analytics:** Visual progress bars, hours studied, completion rates, and streak breakdown.
3. **Modal Dialogs / Drawers:**
   - Quick Setup Wizard (guided 3-step modal).
   - Topic Add/Edit Drawer.
   - Conflict Warning Modal (when syllabus workload exceeds days left).

---

## Look and Feel
Source: `scope.md > Inspiration & Identity`.

- **Aesthetic Inspiration:** Linear and Notion. Minimalist, uncluttered, keyboard-accessible, and dark-themed.
- **Color Palette:**
  - Background: Deep obsidian/zinc (`#090a0f` and `#12151e`).
  - Card/Borders: Subtle dark borders (`#1e2230`) with soft hover highlights.
  - Accent Color: Indigo / Electric Violet (`#6366f1` / `#818cf8`) for primary actions, timer rings, and active states.
  - Semantic Colors: Emerald green (`#10b981`) for completed tasks/streaks, amber (`#f59e0b`) for warnings/medium difficulty, and crimson (`#ef4444`) for high-urgency exams/overdue topics.
- **Typography:** Modern clean sans-serif (`Inter` or system-ui) with monospace figures (`JetBrains Mono` or tabular numerals) for the Pomodoro clock and hours meters.
- **Avoid:** Blurry neon gradients, decorative fake charts, clutter, and childish cartoon gamification.

---

## Features and Behavior

### 1. Setup Wizard & Demo Data Loader
Source: `scope.md > The POC Boundary`.
- As a student, I want to quickly enter my exam schedule and available hours so I can get a plan in seconds.
  - [ ] Supports adding multiple subjects with name, color code, and exam date.
  - [ ] Supports adding topics per subject with estimated study duration (0.5h to 4h) and difficulty (Easy, Medium, Hard).
  - [ ] Daily study availability input (e.g., 2h, 3h, 4h per day).
  - [ ] Includes a 1-click "Load Sample Student Plan" that loads a realistic college semester dataset (e.g., Computer Science exam in 10 days, Chemistry in 14 days) so judges can test instantly without manual typing.
  - [ ] "Reset All Data" button with confirmation to clear and start fresh.

### 2. Transparent Scheduling Engine
Source: `scope.md > The Unique Kernel`.
- As a student, I want a study schedule that is mathematically realistic and respects my daily hours limit.
  - [ ] Uses a transparent priority scoring formula:
    $$\text{Priority} = \frac{\text{Difficulty Weight}}{\text{Days Until Exam} + 0.1} \times \text{Workload Hours}$$
  - [ ] Distributes topics across available days from Today until each subject's Exam Date.
  - [ ] Caps each day at the student's defined daily available hours (e.g., maximum 3 hours per day).
  - [ ] Never schedules topics for a subject after its exam date has passed.
  - [ ] Supports optional Google Gemini API enhancement for natural-language topic breakdowns and study tips when an API key is provided, falling back reliably to the rule-based engine.

### 3. Adaptive Rebalance & Missed Session Recovery
Source: `scope.md > The Unique Kernel`.
- As a student, I want to reschedule missed sessions effortlessly without guilt or broken plans.
  - [ ] Tasks can be explicitly marked as "Missed" or "Skipped" (plus a dedicated "Simulate Missed Session" demo button for hackathon judges).
  - [ ] Clicking "Rebalance Plan" immediately moves incomplete and missed topics to future available slots, recalculating priority order.
  - [ ] Never silently drops uncompleted syllabus topics.
  - [ ] **Capacity Conflict Warning:** If the remaining study hours required before an exam exceed the total available study hours before the exam date, the app surfaces a prominent, helpful warning banner:
    > *"Warning: 14 hours of study remain before your CS exam in 3 days, but your capacity is only 9 hours. Consider increasing daily hours to 4.7h or prioritizing high-difficulty topics."*
  - [ ] The warning provides actionable buttons: "Increase Daily Study Hours" or "Adjust Topic Estimates".

### 4. Interactive Focus Timer (Pomodoro)
Source: `scope.md > The Core Loop`.
- As a student, I want an integrated timer linked to my scheduled topic so I can focus without context-switching.
  - [ ] Presets: Work session (25m), Short Break (5m), Long Break (15m), plus custom duration slider.
  - [ ] Play, Pause, Resume, and Skip controls with animated circular progress indicator.
  - [ ] Audio chime synthesizer using Web Audio API (beeps/chimes) when a session finishes.
  - [ ] Audio fallback: If browser autoplay is restricted or sound is muted, displays visual toast notification and tab title blink (`"🔔 Focus Session Done!"`).
  - [ ] Completing a work interval prompts the user to log study time directly to the active topic.

### 5. Progress Analytics & Streaks
Source: `scope.md > The Core Loop`.
- As a student, I want to see my study momentum and syllabus coverage so I feel confident before exams.
  - [ ] Total hours studied today and this week.
  - [ ] Subject-wise completion bars (% of topics mastered vs. pending).
  - [ ] Daily streak counter (increments on consecutive active study days).
  - [ ] Upcoming exam countdown badges (e.g., "Exam in 4 days").

---

## States and Boundaries

- **First Use State:** Empty dashboard guides user with an onboarding prompt: "Set up your subjects or try the sample demo plan".
- **Active State:** Clean daily schedule with today's focus queue and upcoming calendar.
- **Missed Session State:** Highlighted missed card with one-click "Rebalance Plan" action.
- **Overcapacity State:** Alert banner detailing exact deficit and recommended remediation.
- **Persistence:** All data (subjects, topics, schedule, completed sessions, streak) is auto-saved in `localStorage`. Survives browser refresh and closing the window.
- **Offline Readiness:** 100% operational offline without external server dependencies.

---

## Product Decisions

- **Local Storage over Mandatory Auth:** We chose zero-friction browser persistence so judges and users can use the app instantly without signing up, verifying emails, or dealing with broken auth tokens.
- **Transparent Rule Engine over Pure Black-Box LLM:** The core schedule generator runs on a deterministic, mathematically sound scheduling algorithm with optional Gemini API assistance. This guarantees zero hallucinations, instant sub-millisecond execution, and total reliability even with no internet connection or expired API keys.
- **One-Click Demo Button:** Added a prominent "Demo Mode / Sample Data" control specifically designed so hackathon evaluators can test the core journey and see the "Adaptive Rebalance" magic moment in 10 seconds.

---

## What We're Building (POC Boundary)
- [x] Responsive React/TypeScript single-page application with modern dark UI.
- [x] Onboarding Wizard + 1-Click Sample Student Plan.
- [x] Subjects, Topics, Difficulty, and Exam Dates Manager.
- [x] Deterministic Priority Scheduling Engine respecting daily limits.
- [x] One-Click Adaptive Rebalance for missed study sessions.
- [x] Workload Capacity Conflict Warning and resolution recommendations.
- [x] Web Audio Pomodoro Focus Timer with audio/visual notifications.
- [x] Progress Analytics (Hours, Subject Coverage, Streak).
- [x] LocalStorage persistence layer with zero external DB dependencies.

---

## Deferred From the POC
- **PDF Syllabus Parsing:** Requires complex OCR and document ingestion backend; deferred to post-hackathon.
- **Calendar Two-Way Sync (Google/iCal):** Requires OAuth consent screen approvals and external cloud integration.
- **User Accounts & Cloud Sync:** Not needed for the core proof of concept.

---

## Non-Goals
- Social leaderboards or peer messaging (distracting from deep work).
- Grade prediction or exam result promises.
- Native mobile app wrapper (responsive web is sufficient for the demo).

---

## Open Questions
- None blocking. All core requirements, edge cases, algorithms, and boundaries are resolved.
