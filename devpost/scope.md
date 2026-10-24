---
doc: scope
status: approved
---

# FocusFlow AI

An adaptive, stress-free smart study planner and focus companion for college students preparing for exams and deadlines.

## The Unique Kernel
Most study apps are either static to-do lists or rigid calendars that fall apart the moment a student falls behind. FocusFlow AI combines realistic time-budgeted daily scheduling with instant, guilt-free adaptive replanning: if you miss a study session, one click reorganizes your upcoming days based on difficulty and exam urgency without breaking your rhythm.

## Who It's For
A college student (like an engineering, premed, or business undergrad) juggling 4–6 courses, multiple exams, and assignments with only 2–4 hours of actual daily study time. Today, they either cram haphazardly, copy syllabus dates into an overwhelming calendar, or use generic to-do apps that fail to prioritize topics by exam proximity and personal difficulty.

## The Core Loop
1. **Input & Adjust:** Enter subjects, upcoming exam dates, topic difficulty, and daily available study hours.
2. **Generate Schedule:** FocusFlow AI calculates a realistic, day-by-day study roadmap balanced around exam proximity and subject difficulty.
3. **Execute in Focus Mode:** Launch the integrated Pomodoro focus timer directly on the scheduled topic.
4. **Complete or Rebalance:** Mark topics complete to boost streaks and analytics—or mark a missed session to trigger an immediate, intelligent rebalance of remaining days.

## Inspiration & Identity
- **Inspirations:** Linear and Notion—minimalist, dark/clean theme, intentional typography, monospace timer readouts, keyboard shortcuts, and zero useless clutter.
- **Tone:** Calm, empowering, and focused. No stressful red alarms or false guarantees ("100% Guaranteed A+"), but practical momentum tracking.

## Why This Matters to the Learner
The learner understands firsthand how overwhelming college exams and coursework can be, and wanted to build a practical tool they and their peers could actually use every single day. Technically, it is an opportunity to master modern frontend architecture (React, TypeScript, component hierarchies, and responsive UI design) using agentic, plan-first workflows.

## What "Working" Looks Like
In a 1–2 minute screen recording demo:
1. The user opens the app and completes a clean 30-second onboarding wizard (enters 2 subjects, exam dates in 2 weeks, and 3 hours/day availability).
2. The dashboard updates with "Today's Study Plan" showing scheduled topics and time blocks.
3. The user starts a 25-minute Pomodoro focus session for the top-priority topic, pauses/resumes, and marks it complete.
4. The user simulates a missed task on another topic and clicks "Rebalance Plan"—watching the upcoming days smoothly reschedule without losing any syllabus content.
5. The progress dashboard immediately updates with completed hours, topic progress bar, and study streak.

## The POC Boundary (Now)
- Fast Setup Wizard: Add subjects, topics, difficulty (Easy/Medium/Hard), exam dates, and daily study availability.
- Smart Adaptive Scheduler: Rule-based priority scheduler (with optional Gemini AI enhancement) allocating study blocks up to daily capacity.
- Today Dashboard: Upcoming exams countdown, today's focus queue, and quick actions.
- Interactive Pomodoro Timer: 25m work / 5m short break / 15m long break with audio chime notification, play/pause/reset.
- Rebalance Engine: Reschedules incomplete/missed topics onto future days before the exam date.
- Progress & Streaks: Visual breakdown of hours studied, completed topics per subject, and daily streak counter.
- Full Local Persistence: All state saved reliably in browser localStorage (no login required to run immediately).

## Later (Post-Hackathon)
- PDF Syllabus parsing with Gemini Multimodal to auto-extract topics and exam dates.
- Google Calendar / Outlook two-way sync.
- Cloud account sync and collaborative study rooms with friends.

## Explicitly Cut
- Social feeds and public leaderboards (distracting for focused study).
- Mandatory user login / complex auth backend (slows down onboarding and evaluation).
- Grade prediction algorithms (misleading and unprovable).
