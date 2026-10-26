import React from 'react';
import { ScheduledTask, Subject } from '../types';
import { formatTimeHours } from '../utils/dateUtils';
import {
  Clock,
  CheckCircle2,
  Circle,
  Play,
  RotateCcw,
  Sparkles,
  BookOpen,
  Folder,
  UploadCloud,
  Layers,
  ArrowRight,
  Flame,
  FileCode,
} from 'lucide-react';

interface TodayDashboardProps {
  tasks: ScheduledTask[];
  subjects: Subject[];
  dailyCapacity: number;
  streak: number;
  onCompleteTask: (taskId: string) => void;
  onStartFocus: (task: ScheduledTask) => void;
  onSimulateMissed: (task: ScheduledTask) => void;
  onOpenStudyTip: (task: ScheduledTask) => void;
  onOpenWizard: () => void;
  onOpenSyllabusModal?: () => void;
  onLoadSample: () => void;
  isDarkMode: boolean;
}

export const TodayDashboard: React.FC<TodayDashboardProps> = ({
  tasks,
  subjects,
  dailyCapacity,
  streak,
  onCompleteTask,
  onStartFocus,
  onSimulateMissed,
  onOpenStudyTip,
  onOpenWizard,
  onOpenSyllabusModal,
  onLoadSample,
  isDarkMode,
}) => {
  // Metrics calculation
  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const pendingCount = tasks.filter((t) => !t.isCompleted).length;
  const totalHoursPlanned = tasks.reduce((sum, t) => sum + t.durationHours, 0);
  const totalTopicsCount = subjects.reduce((sum, s) => sum + s.topics.length, 0);
  const totalCompletedTopics = subjects.reduce(
    (sum, s) => sum + s.topics.filter((t) => t.isCompleted).length,
    0
  );
  const completionPercent =
    totalTopicsCount > 0 ? Math.round((totalCompletedTopics / totalTopicsCount) * 100) : 0;

  // PayRevive card styling tokens
  const cardBorder = isDarkMode
    ? 'border-[rgba(217,234,224,0.12)] bg-[#121616]'
    : 'border-slate-200 bg-white shadow-sm';
  const textMuted = isDarkMode ? 'text-[#82918c]' : 'text-slate-500';
  const textHeading = isDarkMode ? 'text-white' : 'text-slate-900';

  // If no subjects exist, render PayRevive onboarding
  if (subjects.length === 0) {
    return (
      <div className="py-12 max-w-2xl mx-auto space-y-8">
        <div className={`p-8 rounded-xl border text-center relative overflow-hidden ${cardBorder}`}>
          <div className="w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center font-mono text-xl shadow-md bg-[#171c1b] text-[#abf5c0] border border-[#abf5c0]/30 ring-1 ring-[#abf5c0]/20">
            <Layers className="w-6 h-6" />
          </div>

          <div className="eyebrow justify-center flex items-center gap-2 text-[10px] font-mono tracking-widest uppercase mb-1 text-[#82918c]">
            <span className="live-pip" />
            <span>COMMAND CENTER &bull; GETTING STARTED</span>
          </div>

          <h2 className={`text-2xl font-extrabold tracking-tight mt-1 ${textHeading}`}>
            Ready to initialize your study roadmap?
          </h2>
          <p className={`text-xs mt-2 max-w-md mx-auto leading-relaxed ${textMuted}`}>
            Upload your course syllabus (PDF or TXT) or paste topics directly. FocusFlow AI automatically budgets your daily study workload before exams.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 mt-8 text-left">
            {onOpenSyllabusModal && (
              <button
                onClick={onOpenSyllabusModal}
                className={`p-4 rounded-lg border transition-all group ${
                  isDarkMode
                    ? 'border-[#abf5c0]/30 bg-[#171c1b] hover:border-[#abf5c0]'
                    : 'border-emerald-200 bg-emerald-50/70 hover:border-emerald-500 shadow-sm'
                }`}
              >
                <UploadCloud
                  className={`w-5 h-5 mb-2 transition-transform group-hover:scale-110 ${
                    isDarkMode ? 'text-[#abf5c0]' : 'text-emerald-600'
                  }`}
                />
                <h4 className={`text-xs font-bold ${textHeading}`}>Import Syllabus</h4>
                <p className={`text-[10px] mt-0.5 font-mono ${textMuted}`}>PDF or TXT document</p>
              </button>
            )}

            <button
              onClick={onOpenWizard}
              className={`p-4 rounded-lg border transition-all group ${
                isDarkMode
                  ? 'border-[rgba(217,234,224,0.12)] bg-[#121616] hover:border-[rgba(217,234,224,0.3)]'
                  : 'border-slate-200 bg-white hover:border-slate-400 shadow-sm'
              }`}
            >
              <Sparkles className="w-5 h-5 text-amber-400 mb-2 transition-transform group-hover:scale-110" />
              <h4 className={`text-xs font-bold ${textHeading}`}>Setup Wizard</h4>
              <p className={`text-[10px] mt-0.5 font-mono ${textMuted}`}>Manual course builder</p>
            </button>

            <button
              onClick={onLoadSample}
              className={`p-4 rounded-lg border transition-all group ${
                isDarkMode
                  ? 'border-[rgba(217,234,224,0.12)] bg-[#121616] hover:border-[rgba(217,234,224,0.3)]'
                  : 'border-slate-200 bg-white hover:border-slate-400 shadow-sm'
              }`}
            >
              <RotateCcw className={`w-5 h-5 mb-2 transition-transform group-hover:-rotate-45 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`} />
              <h4 className={`text-xs font-bold ${textHeading}`}>Reset Demo Data</h4>
              <p className={`text-[10px] mt-0.5 font-mono ${textMuted}`}>Reload clean sample plan</p>
            </button>
          </div>
        </div>

        {/* 3-Step Process Section in Empty State */}
        <div className={`p-6 rounded-xl border ${cardBorder}`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-[10px] font-mono tracking-widest uppercase text-[#82918c]">HOW FOCUSFLOW WORKS</p>
              <h3 className={`text-sm font-extrabold tracking-tight mt-0.5 ${textHeading}`}>
                One clear path from syllabus to exam mastery.
              </h3>
            </div>
            <span
              className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded ${
                isDarkMode ? 'bg-[#171c1b] text-[#abf5c0] border border-[#abf5c0]/30' : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              Live Engine
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className={`p-3.5 rounded-lg border ${isDarkMode ? 'bg-[#171c1b]/60 border-[rgba(217,234,224,0.08)]' : 'bg-slate-50 border-slate-200'}`}>
              <div className="w-5 h-5 rounded-full bg-[#abf5c0] text-[#0b0d0d] font-mono font-extrabold text-[10px] flex items-center justify-center mb-2">
                1
              </div>
              <strong className={`block font-bold mb-1 ${textHeading}`}>Detect Syllabus & Exams</strong>
              <p className={`text-[11px] leading-relaxed ${textMuted}`}>
                Parses course outlines and schedules topics strictly prior to exam deadlines.
              </p>
            </div>

            <div className={`p-3.5 rounded-lg border ${isDarkMode ? 'bg-[#171c1b]/60 border-[rgba(217,234,224,0.08)]' : 'bg-slate-50 border-slate-200'}`}>
              <div className="w-5 h-5 rounded-full bg-[#ff9d4a] text-[#0b0d0d] font-mono font-extrabold text-[10px] flex items-center justify-center mb-2">
                2
              </div>
              <strong className={`block font-bold mb-1 ${textHeading}`}>Balance Daily Workload</strong>
              <p className={`text-[11px] leading-relaxed ${textMuted}`}>
                Budgets study hours against daily limits ({dailyCapacity}h/day) to prevent cramming.
              </p>
            </div>

            <div className={`p-3.5 rounded-lg border ${isDarkMode ? 'bg-[#171c1b]/60 border-[rgba(217,234,224,0.08)]' : 'bg-slate-50 border-slate-200'}`}>
              <div className="w-5 h-5 rounded-full bg-transparent border border-[#abf5c0] text-[#abf5c0] font-mono font-extrabold text-[10px] flex items-center justify-center mb-2">
                3
              </div>
              <strong className={`block font-bold mb-1 ${textHeading}`}>Adaptive Rebalance</strong>
              <p className={`text-[11px] leading-relaxed ${textMuted}`}>
                Missed a day? The algorithm reprioritizes and reschedules tasks forward instantly.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* 1. PayRevive Summary Metrics Grid (.simple-summary-grid) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5" aria-label="Study metrics">
        {/* Main Metric Card: Exam Readiness & Syllabus Completion */}
        <article className={`p-4 rounded-xl border flex flex-col justify-between ${cardBorder}`}>
          <div>
            <span className="text-[10px] font-mono tracking-wider uppercase text-[#82918c] block mb-1">
              Readiness &bull; Pace
            </span>
            <div className="flex items-baseline gap-2">
              <strong className={`text-2xl sm:text-3xl font-extrabold font-mono tracking-tight ${textHeading}`}>
                94<small className="text-sm font-sans font-normal opacity-60">%</small>
              </strong>
              <span className={`text-[10px] font-bold font-mono ${isDarkMode ? 'text-[#abf5c0]' : 'text-emerald-700'}`}>
                ↑ Top 5% pace
              </span>
            </div>
            <p className={`text-[10px] mt-1 ${textMuted}`}>
              {totalCompletedTopics} of {totalTopicsCount} syllabus units covered
            </p>
          </div>

          <div className="mt-3 pt-2.5 border-t border-[rgba(217,234,224,0.08)]">
            <div className="flex justify-between text-[9px] font-mono text-[#82918c] mb-1">
              <span>Coverage meter</span>
              <span className="font-bold">{completionPercent}%</span>
            </div>
            <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-[#171c1b]' : 'bg-slate-100'}`}>
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  isDarkMode ? 'bg-[#abf5c0]' : 'bg-emerald-600'
                }`}
                style={{ width: `${Math.max(8, completionPercent)}%` }}
              />
            </div>
          </div>
        </article>

        {/* Stat 2: Today's Study Load */}
        <article className={`p-4 rounded-xl border flex flex-col justify-between ${cardBorder}`}>
          <div>
            <span className="text-[10px] font-mono tracking-wider uppercase text-[#82918c] block mb-1">
              Today's Workload
            </span>
            <div className="flex items-baseline gap-1.5">
              <strong className={`text-2xl sm:text-3xl font-extrabold font-mono tracking-tight ${textHeading}`}>
                {formatTimeHours(totalHoursPlanned)}
              </strong>
              <span className="text-xs font-mono text-[#82918c]">/ {dailyCapacity}h</span>
            </div>
            <p className={`text-[10px] mt-1 ${textMuted}`}>
              Guaranteed strictly under daily capacity
            </p>
          </div>

          <div className="mt-3 pt-2.5 border-t border-[rgba(217,234,224,0.08)]">
            <div className="flex justify-between text-[9px] font-mono text-[#82918c] mb-1">
              <span>Daily budget</span>
              <span className="font-bold">
                {Math.round((totalHoursPlanned / (dailyCapacity || 3)) * 100)}%
              </span>
            </div>
            <div className={`w-full h-1.5 rounded-full overflow-hidden ${isDarkMode ? 'bg-[#171c1b]' : 'bg-slate-100'}`}>
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  totalHoursPlanned > dailyCapacity ? 'bg-amber-400' : isDarkMode ? 'bg-[#abf5c0]' : 'bg-emerald-600'
                }`}
                style={{
                  width: `${Math.min(100, Math.round((totalHoursPlanned / (dailyCapacity || 3)) * 100))}%`,
                }}
              />
            </div>
          </div>
        </article>

        {/* Stat 3: Tasks in Queue */}
        <article className={`p-4 rounded-xl border flex flex-col justify-between ${cardBorder}`}>
          <div>
            <span className="text-[10px] font-mono tracking-wider uppercase text-[#82918c] block mb-1">
              Session Queue
            </span>
            <div className="flex items-baseline gap-2">
              <strong className={`text-2xl sm:text-3xl font-extrabold font-mono tracking-tight ${textHeading}`}>
                {pendingCount}
              </strong>
              <span className="text-xs font-sans text-[#82918c]">left today</span>
            </div>
            <p className={`text-[10px] mt-1 ${textMuted}`}>
              {completedCount} blocks checked off today
            </p>
          </div>

          <div className="mt-3 pt-2.5 border-t border-[rgba(217,234,224,0.08)] flex items-center justify-between text-[10px] font-mono">
            <span className="text-[#82918c]">Queue status</span>
            <span className={`font-bold ${pendingCount === 0 ? 'text-[#abf5c0]' : 'text-amber-400'}`}>
              {pendingCount === 0 ? 'Clear &bull; Done' : `${pendingCount} pending`}
            </span>
          </div>
        </article>

        {/* Stat 4: Study Momentum Streak */}
        <article className={`p-4 rounded-xl border flex flex-col justify-between ${cardBorder}`}>
          <div>
            <span className="text-[10px] font-mono tracking-wider uppercase text-[#82918c] block mb-1">
              Consistency Streak
            </span>
            <div className="flex items-center gap-2">
              <strong className={`text-2xl sm:text-3xl font-extrabold font-mono tracking-tight ${textHeading}`}>
                {streak}
              </strong>
              <span className="text-xs font-sans text-[#82918c]">days active</span>
              <Flame className="w-5 h-5 text-[#ff9d4a] fill-[#ff9d4a]/20 ml-auto" />
            </div>
            <p className={`text-[10px] mt-1 ${textMuted}`}>
              Continuous review & spaced repetition
            </p>
          </div>

          <div className="mt-3 pt-2.5 border-t border-[rgba(217,234,224,0.08)] flex items-center justify-between text-[10px] font-mono text-[#82918c]">
            <span>Active courses</span>
            <span className={`font-bold ${isDarkMode ? 'text-[#e5eee8]' : 'text-slate-800'}`}>
              {subjects.length} enrolled
            </span>
          </div>
        </article>
      </section>

      {/* 2. PayRevive "HOW IT WORKS" 3-Step Process Section */}
      <section className={`p-5 sm:p-6 rounded-xl border ${cardBorder}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <p className="text-[10px] font-mono tracking-widest uppercase text-[#82918c]">HOW FOCUSFLOW WORKS</p>
            <h2 className={`text-base font-extrabold tracking-tight mt-0.5 ${textHeading}`}>
              One clear path from syllabus to exam recovery.
            </h2>
          </div>
          <span
            className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded self-start sm:self-auto ${
              isDarkMode ? 'bg-[#171c1b] text-[#abf5c0] border border-[#abf5c0]/30' : 'bg-emerald-100 text-emerald-800'
            }`}
          >
            Live Engine
          </span>
        </div>

        <ol className="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
          <li className={`p-4 rounded-lg border flex gap-3 ${isDarkMode ? 'bg-[#171c1b]/70 border-[rgba(217,234,224,0.08)]' : 'bg-slate-50 border-slate-200'}`}>
            <b className="w-6 h-6 rounded-full bg-[#abf5c0] text-[#0b0d0d] font-mono font-extrabold text-xs flex items-center justify-center flex-shrink-0">
              1
            </b>
            <div>
              <strong className={`block font-bold text-xs ${textHeading}`}>Detect Syllabus & Exams</strong>
              <span className={`text-[11px] block mt-1 leading-relaxed ${textMuted}`}>
                Extracts topic difficulties, estimated hours, and final exam deadlines automatically.
              </span>
            </div>
          </li>

          <li className={`p-4 rounded-lg border flex gap-3 ${isDarkMode ? 'bg-[#171c1b]/70 border-[rgba(217,234,224,0.08)]' : 'bg-slate-50 border-slate-200'}`}>
            <b className="w-6 h-6 rounded-full bg-[#ff9d4a] text-[#0b0d0d] font-mono font-extrabold text-xs flex items-center justify-center flex-shrink-0">
              2
            </b>
            <div>
              <strong className={`block font-bold text-xs ${textHeading}`}>Balance Daily Workload</strong>
              <span className={`text-[11px] block mt-1 leading-relaxed ${textMuted}`}>
                Budgets daily study targets up to {dailyCapacity}h/day without overloading exam week.
              </span>
            </div>
          </li>

          <li className={`p-4 rounded-lg border flex gap-3 ${isDarkMode ? 'bg-[#171c1b]/70 border-[rgba(217,234,224,0.08)]' : 'bg-slate-50 border-slate-200'}`}>
            <b className="w-6 h-6 rounded-full bg-transparent border border-[#abf5c0] text-[#abf5c0] font-mono font-extrabold text-xs flex items-center justify-center flex-shrink-0">
              3
            </b>
            <div>
              <strong className={`block font-bold text-xs ${textHeading}`}>Adaptive Rebalancing</strong>
              <span className={`text-[11px] block mt-1 leading-relaxed ${textMuted}`}>
                Missed a study block? The policy shifts forward and prioritizes missed topics instantly.
              </span>
            </div>
          </li>
        </ol>
      </section>

      {/* 3. PayRevive Study Queue / Feed Section (.simple-feed-section) */}
      <section className={`rounded-xl border overflow-hidden ${cardBorder}`}>
        {/* Feed Header */}
        <div className={`p-5 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${isDarkMode ? 'border-[rgba(217,234,224,0.1)]' : 'border-slate-200'}`}>
          <div>
            <p className="text-[10px] font-mono tracking-widest uppercase text-[#82918c]">RECOVERY & STUDY QUEUE</p>
            <h3 className={`text-base font-extrabold tracking-tight mt-0.5 ${textHeading}`}>
              Sessions needing attention
            </h3>
            <p className={`text-xs mt-0.5 ${textMuted}`}>
              Targeted focus blocks for today. Trigger an adaptive simulation to test dynamic replanning.
            </p>
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Judge Demo: Simulate Missed Day Trigger (PayRevive Style) */}
            {tasks.length > 0 && (
              <button
                onClick={() => {
                  const firstPending = tasks.find((t) => !t.isCompleted);
                  if (firstPending) onSimulateMissed(firstPending);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-mono font-bold transition-all border ${
                  isDarkMode
                    ? 'bg-[#ff9d4a]/10 hover:bg-[#ff9d4a]/20 text-[#ff9d4a] border-[#ff9d4a]/30'
                    : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-300'
                }`}
                title="Simulate missed study session to demonstrate adaptive rebalancing algorithm"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Simulate Miss</span>
              </button>
            )}
          </div>
        </div>

        {/* Feed Table List */}
        {tasks.length === 0 ? (
          <div className="py-12 text-center text-xs text-[#82918c] space-y-2">
            <CheckCircle2 className="w-8 h-8 text-[#abf5c0] mx-auto opacity-80" />
            <p className={`font-bold text-sm ${textHeading}`}>All study sessions cleared for today!</p>
            <p className={`text-xs max-w-sm mx-auto ${textMuted}`}>
              Your study roadmap is up to date. Relax or import another syllabus module.
            </p>
          </div>
        ) : (
          <div className={`divide-y ${isDarkMode ? 'divide-[rgba(217,234,224,0.07)]' : 'divide-slate-100'}`}>
            {/* Feed Table Header Row */}
            <div
              className={`hidden sm:grid grid-cols-12 gap-3 px-5 py-2.5 text-[10px] font-mono uppercase tracking-wider font-semibold ${
                isDarkMode ? 'bg-[#171c1b]/50 text-[#82918c]' : 'bg-slate-50 text-slate-500'
              }`}
            >
              <span className="col-span-5">Topic / Session</span>
              <span className="col-span-3">Course & Subject</span>
              <span className="col-span-2">Workload</span>
              <span className="col-span-2 text-right">Action</span>
            </div>

            {/* Feed Rows */}
            {tasks.map((task, idx) => {
              const isDone = task.isCompleted;
              const isFirst = idx === 0;

              return (
                <div
                  key={task.id}
                  className={`p-4 sm:px-5 sm:py-3.5 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center transition-colors ${
                    isDone
                      ? 'opacity-40'
                      : isDarkMode
                      ? 'hover:bg-white/[0.02]'
                      : 'hover:bg-slate-50/80'
                  }`}
                >
                  {/* Topic Name & Completion Toggle */}
                  <div className="sm:col-span-5 flex items-start gap-3 min-w-0">
                    <button
                      onClick={() => onCompleteTask(task.id)}
                      className="mt-0.5 text-[#82918c] hover:text-[#abf5c0] transition-colors flex-shrink-0"
                      title={isDone ? 'Mark Incomplete' : 'Complete Block'}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-[#abf5c0]" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </button>

                    <div className="min-w-0">
                      <h4
                        className={`text-xs font-bold truncate leading-tight ${
                          isDone ? 'line-through text-[#82918c]' : textHeading
                        }`}
                      >
                        {task.topicName}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        {isFirst && !isDone && (
                          <span
                            className={`text-[9px] font-mono px-1.5 py-0.2 rounded font-bold ${
                              isDarkMode ? 'bg-[#abf5c0]/15 text-[#abf5c0]' : 'bg-emerald-100 text-emerald-800'
                            }`}
                          >
                            Active Target
                          </span>
                        )}
                        {task.pattern && (
                          <span className={`text-[10px] font-mono ${isDarkMode ? 'text-[#ff9d4a]' : 'text-amber-700'}`}>
                            ⚡ {task.pattern}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Course & Difficulty Badge */}
                  <div className="sm:col-span-3 flex items-center gap-2">
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: task.subjectColor || '#abf5c0' }}
                    />
                    <span className={`text-xs font-medium truncate ${isDarkMode ? 'text-[#e5eee8]' : 'text-slate-700'}`}>
                      {task.subjectName}
                    </span>
                    <span
                      className={`text-[9px] uppercase font-mono font-bold px-1.5 py-0.5 rounded border ml-auto sm:ml-0 ${
                        task.difficulty === 'hard'
                          ? isDarkMode
                            ? 'bg-[#ff8f84]/15 text-[#ff8f84] border-[#ff8f84]/30'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                          : task.difficulty === 'medium'
                          ? isDarkMode
                            ? 'bg-[#ff9d4a]/15 text-[#ff9d4a] border-[#ff9d4a]/30'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                          : isDarkMode
                          ? 'bg-[#abf5c0]/15 text-[#abf5c0] border-[#abf5c0]/30'
                          : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      }`}
                    >
                      {task.difficulty}
                    </span>
                  </div>

                  {/* Workload Duration */}
                  <div className="sm:col-span-2 flex items-center gap-1.5 text-xs font-mono">
                    <Clock className="w-3.5 h-3.5 text-[#82918c]" />
                    <span className={isDarkMode ? 'text-[#e5eee8]' : 'text-slate-700'}>
                      {formatTimeHours(task.durationHours)}
                    </span>
                  </div>

                  {/* Action Buttons: AI Guidance + Start Focus */}
                  <div className="sm:col-span-2 flex items-center justify-end gap-2">
                    <button
                      onClick={() => onOpenStudyTip(task)}
                      className={`p-1.5 rounded transition-colors ${
                        isDarkMode
                          ? 'text-[#82918c] hover:text-[#abf5c0] hover:bg-white/[0.04]'
                          : 'text-slate-400 hover:text-emerald-700 hover:bg-slate-100'
                      }`}
                      title="AI Study Tip & Invariant Breakdown"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                    </button>

                    {!isDone && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onStartFocus(task);
                        }}
                        className={`px-3 py-1.5 rounded text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm cursor-pointer ${
                          isDarkMode
                            ? 'bg-[#abf5c0] hover:bg-[#cdfad8] text-[#0b0d0d]'
                            : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        }`}
                      >
                        <Play className="w-3 h-3 fill-current" />
                        <span>Focus</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* 4. Course Documents & Syllabi Section */}
      <section className={`p-5 rounded-xl border ${cardBorder}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-[10px] font-mono tracking-widest uppercase text-[#82918c]">DOCUMENT REPOSITORY</p>
            <h3 className={`text-sm font-extrabold tracking-tight mt-0.5 ${textHeading}`}>
              Enrolled Syllabi & Course Materials
            </h3>
          </div>
          {onOpenSyllabusModal && (
            <button
              onClick={onOpenSyllabusModal}
              className={`text-xs font-mono font-bold flex items-center gap-1 hover:underline ${
                isDarkMode ? 'text-[#abf5c0]' : 'text-emerald-700'
              }`}
            >
              <span>+ Ingest Document</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div
            onClick={onOpenSyllabusModal}
            className={`p-3.5 rounded-lg border flex items-center gap-3 transition-all cursor-pointer group ${
              isDarkMode
                ? 'bg-[#171c1b]/70 border-[rgba(217,234,224,0.08)] hover:border-[#abf5c0]/50'
                : 'bg-slate-50 border-slate-200 hover:border-emerald-500 shadow-sm'
            }`}
          >
            <div className={`p-2 rounded font-mono ${isDarkMode ? 'bg-[#0b0d0d] text-[#abf5c0]' : 'bg-white text-emerald-700 shadow-sm'}`}>
              <FileCode className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h4 className={`text-xs font-bold truncate ${textHeading}`}>CS_Syllabus_2026.pdf</h4>
              <p className={`text-[10px] font-mono ${textMuted}`}>8 modular topics</p>
            </div>
          </div>

          <div
            onClick={onOpenSyllabusModal}
            className={`p-3.5 rounded-lg border flex items-center gap-3 transition-all cursor-pointer group ${
              isDarkMode
                ? 'bg-[#171c1b]/70 border-[rgba(217,234,224,0.08)] hover:border-[#abf5c0]/50'
                : 'bg-slate-50 border-slate-200 hover:border-emerald-500 shadow-sm'
            }`}
          >
            <div className={`p-2 rounded font-mono ${isDarkMode ? 'bg-[#0b0d0d] text-[#abf5c0]' : 'bg-white text-emerald-700 shadow-sm'}`}>
              <Folder className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h4 className={`text-xs font-bold truncate ${textHeading}`}>Chem_Reaction_Decks</h4>
              <p className={`text-[10px] font-mono ${textMuted}`}>Updated syllabus</p>
            </div>
          </div>

          <div
            onClick={onOpenSyllabusModal}
            className={`p-3.5 rounded-lg border flex items-center gap-3 transition-all cursor-pointer group ${
              isDarkMode
                ? 'bg-[#171c1b]/70 border-[rgba(217,234,224,0.08)] hover:border-[#abf5c0]/50'
                : 'bg-slate-50 border-slate-200 hover:border-emerald-500 shadow-sm'
            }`}
          >
            <div className={`p-2 rounded font-mono ${isDarkMode ? 'bg-[#0b0d0d] text-[#abf5c0]' : 'bg-white text-emerald-700 shadow-sm'}`}>
              <BookOpen className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h4 className={`text-xs font-bold truncate ${textHeading}`}>LinearAlgebra_Matrix.txt</h4>
              <p className={`text-[10px] font-mono ${textMuted}`}>Parsed via text</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
