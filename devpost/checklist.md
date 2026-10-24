---
doc: checklist
status: approved
---

# Build Checklist

Build mode: fast

## Slices

- [ ] **1. Scaffolding, Setup Wizard, and Sample Student Plan**
  Becomes usable: A running React + Vite + TypeScript web application styled with Tailwind CSS in an Obsidian dark theme. Shows the header, empty states, and lets the user open the Setup Wizard or click "Load Sample Student Plan" to instantly populate realistic courses, topics, and exam dates.
  Why now: Proves the whole path end to end on the first slice—scaffold, dependencies, types, UI shell, and state—giving every subsequent slice real data and a live screen to land on.
  PRD ref: `prd.md > 1. Setup Wizard & Demo Data Loader`, `prd.md > Screens and Layout`
  Spec ref: `spec.md > Stack`, `spec.md > File Structure`, `spec.md > Components` (`Header.tsx`, `SetupWizard.tsx`, `TodayDashboard.tsx`)
  Build: Scaffold the React+Vite+TypeScript app, configure Tailwind CSS and Lucide icons, write TypeScript models (`types/index.ts`), define realistic college courses in `sampleData.ts`, implement `Header.tsx`, `SetupWizard.tsx`, `TodayDashboard.tsx`, and in-memory App state.
  Verify (mechanical): Run `npm run build` to confirm zero TypeScript compilation errors; test that loading sample data populates subjects and upcoming exam cards.
  Learner check: Open the app in your browser, click "Load Sample Student Plan", and verify that Computer Science and Organic Chemistry appear on the screen with clean styling.
  Commit: `Initialize FocusFlow AI with setup wizard and sample student data`

- [ ] **2. Transparent Priority Scheduling Engine & Calendar Timeline**
  Becomes usable: The app automatically calculates a mathematically sound daily study schedule leading up to exams, capping daily hours and ordering topics by exam proximity and difficulty. The "Study Schedule" view displays day-by-day blocks with capacity progress bars.
  Why now: The scheduling engine is the core calculation backbone that feeds daily tasks into the focus timer and drives adaptive replanning.
  PRD ref: `prd.md > 2. Transparent Scheduling Engine`
  Spec ref: `spec.md > Components` (`ScheduleTimeline.tsx`), `spec.md > Services` (`schedulingEngine.ts`)
  Build: Implement `schedulingEngine.ts` with transparent priority scoring and daily hour capping logic. Build `ScheduleTimeline.tsx` displaying day blocks, exam countdown tags, and daily capacity meters (e.g. 2.5h / 3.0h).
  Verify (mechanical): Run unit test verifying the scheduler never exceeds daily capacity and never schedules topics after their exam date has passed.
  Learner check: Switch to the Schedule Timeline tab, verify topics are distributed realistically across upcoming days without exceeding your daily study hour limit.
  Commit: `Add deterministic priority scheduling engine and timeline view`

- [ ] **3. Adaptive Rebalance & Missed Session Recovery (The Unique Kernel)**
  Becomes usable: The core differentiator works live: marking a task as missed (or clicking "Simulate Missed Task") triggers the Rebalance banner. Clicking "Rebalance Plan" redistributes remaining topics forward without dropping tasks. If workload exceeds calendar days, the Capacity Conflict Warning appears with actionable remedies.
  Why now: Proves the unique kernel early rather than leaving it to the end.
  PRD ref: `prd.md > 3. Adaptive Rebalance & Missed Session Recovery`
  Spec ref: `spec.md > Components` (`RebalanceBanner.tsx`, `ConflictModal.tsx`)
  Build: Add missed-task state management, implement rebalance recalculation in `schedulingEngine.ts`, calculate capacity deficits, and build `RebalanceBanner.tsx` and `ConflictModal.tsx`.
  Verify (mechanical): Run test asserting that a missed session is shifted to the next available day and capacity conflict triggers when workload > remaining calendar hours.
  Learner check: Click "Simulate Missed Session", observe the notification banner, click "Rebalance Plan", and verify future days smoothly adjust.
  Commit: `Implement adaptive rebalance engine and capacity conflict warning`

- [ ] **4. Interactive Web Audio Focus Timer (Pomodoro) & Analytics with Local Persistence**
  Becomes usable: Full Pomodoro focus timer with 25m/5m/15m intervals, SVG circular progress, Web Audio synthesizer chimes (with graceful visual fallback), completed session logging to active topic, analytics progress bars, streak tracking, and automatic `localStorage` persistence surviving page refresh.
  Why now: Completes the full end-to-end loop (Setup → Schedule → Focus → Rebalance → Analytics → Persist), making the app 100% demo-ready for the hackathon.
  PRD ref: `prd.md > 4. Interactive Focus Timer (Pomodoro)`, `prd.md > 5. Progress Analytics & Streaks`, `prd.md > States and Boundaries`
  Spec ref: `spec.md > Components` (`FocusTimer.tsx`, `AnalyticsView.tsx`), `spec.md > Services` (`audioService.ts`, `storageService.ts`)
  Build: Implement `audioService.ts` Web Audio oscillator chimes, `FocusTimer.tsx` with circular SVG progress, `AnalyticsView.tsx` with completion charts, and `storageService.ts` auto-save/restore.
  Verify (mechanical): Verify timer state transitions, audio context fallback, analytics calculations, and `localStorage` serialization. Full `npm run build` passes with zero errors.
  Learner check: Start a Pomodoro timer, finish or skip a session, verify chime sounds (or visual toast flashes), and confirm completed study minutes update on the Analytics dashboard and survive page reload.
  Commit: `Add Pomodoro focus timer with Web Audio chimes and analytics persistence`

## Hands-on Checkpoints

- [ ] Early usable behavior explored — Slice 2 boundary (Sample data loaded & Schedule Timeline calculated)
- [ ] Final kick-the-tires exploration and feedback completed — Slice 4 boundary (Full end-to-end journey tested)

## Final Review

- [ ] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [ ] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [ ] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [ ] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: [to be filled upon completion]
Route and stops: [to be filled upon completion]
Edit outcome: [to be filled upon completion]
Reflection: [to be filled upon completion]
Activity mode: [to be filled upon completion]

## Revisions
