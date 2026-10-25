import React from 'react';
import { ScheduledTask, Subject } from '../types';
import {
  CheckCircle2,
  Circle,
  Clock,
  Play,
  Sparkles,
  BookOpen,
  Flame,
  GraduationCap,
  TrendingUp,
  FileCode,
  Folder,
  UploadCloud,
  RotateCcw,
} from 'lucide-react';
import { formatTimeHours } from '../utils/dateUtils';

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
  isDarkMode?: boolean;
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
}) => {
  // Metrics
  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const pendingCount = tasks.filter((t) => !t.isCompleted).length;
  const totalHoursPlanned = tasks.reduce((sum, t) => sum + t.durationHours, 0);

  // If no subjects exist, show welcoming clean onboarding
  if (subjects.length === 0) {
    return (
      <div className="py-16 text-center max-w-lg mx-auto">
        <div className="w-16 h-16 mx-auto mb-4 rounded-3xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-inner">
          <BookOpen className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-slate-900 dark:text-white mb-2">
          Ready to plan your courses?
        </h2>
        <p className="text-xs text-slate-500 dark:text-gray-400 mb-6 leading-relaxed max-w-md mx-auto">
          Upload your course syllabus (PDF or TXT) or paste your course topics. FocusFlow AI automatically budgets your daily study hours before exams.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {onOpenSyllabusModal && (
            <button
              onClick={onOpenSyllabusModal}
              className="p-4 rounded-2xl border border-indigo-200 dark:border-indigo-800/60 bg-indigo-50/50 dark:bg-indigo-950/20 hover:border-indigo-500 transition-all text-left group"
            >
              <UploadCloud className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Import Syllabus</h4>
              <p className="text-[10px] text-slate-500 dark:text-gray-400 mt-0.5">PDF or TXT document</p>
            </button>
          )}

          <button
            onClick={onOpenWizard}
            className="p-4 rounded-2xl border border-slate-200 dark:border-[#1e2230] bg-white dark:bg-[#12151e] hover:border-indigo-500 transition-all text-left group"
          >
            <Sparkles className="w-5 h-5 text-amber-500 mb-2 group-hover:scale-110 transition-transform" />
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Setup Wizard</h4>
            <p className="text-[10px] text-slate-500 dark:text-gray-400 mt-0.5">Manual course builder</p>
          </button>

          <button
            onClick={onLoadSample}
            className="p-4 rounded-2xl border border-slate-200 dark:border-[#1e2230] bg-white dark:bg-[#12151e] hover:border-emerald-500 transition-all text-left group"
          >
            <Folder className="w-5 h-5 text-emerald-500 mb-2 group-hover:scale-110 transition-transform" />
            <h4 className="text-xs font-bold text-slate-900 dark:text-white">Demo Plan</h4>
            <p className="text-[10px] text-slate-500 dark:text-gray-400 mt-0.5">Preload CS & Chem</p>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* 4 Stat Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Exam Readiness */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#12151e] border border-slate-200/90 dark:border-[#1e2230] shadow-sm">
          <div className="flex items-center justify-between text-slate-400 dark:text-gray-400 mb-1.5">
            <span className="text-[11px] font-semibold">Exam Readiness</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            3.85
          </div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">
            <span>↑ Top 5% pace</span>
          </div>
        </div>

        {/* Card 2: Study Streak */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#12151e] border border-slate-200/90 dark:border-[#1e2230] shadow-sm">
          <div className="flex items-center justify-between text-slate-400 dark:text-gray-400 mb-1.5">
            <span className="text-[11px] font-semibold">Study Streak</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500/20" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {streak} <span className="text-xs font-sans font-normal text-slate-400 dark:text-gray-400">days</span>
          </div>
          <div className="w-full h-1 bg-slate-100 dark:bg-[#1e2230] rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full w-3/4" />
          </div>
        </div>

        {/* Card 3: Tasks Queue */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#12151e] border border-slate-200/90 dark:border-[#1e2230] shadow-sm">
          <div className="flex items-center justify-between text-slate-400 dark:text-gray-400 mb-1.5">
            <span className="text-[11px] font-semibold">Tasks Queue</span>
            <Clock className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {pendingCount} <span className="text-xs font-sans font-normal text-slate-400 dark:text-gray-400">left</span>
          </div>
          <div className="text-[10px] text-slate-500 dark:text-gray-400 font-medium mt-1">
            {completedCount} completed today
          </div>
        </div>

        {/* Card 4: Today's Study Load */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#12151e] border border-slate-200/90 dark:border-[#1e2230] shadow-sm">
          <div className="flex items-center justify-between text-slate-400 dark:text-gray-400 mb-1.5">
            <span className="text-[11px] font-semibold">Today's Study Load</span>
            <GraduationCap className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white font-mono">
            {formatTimeHours(totalHoursPlanned)} <span className="text-xs font-sans font-normal text-slate-400 dark:text-gray-400">/ {dailyCapacity}h</span>
          </div>
          <div className="w-full h-1 bg-slate-100 dark:bg-[#1e2230] rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-indigo-600 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(100, Math.round((totalHoursPlanned / (dailyCapacity || 3)) * 100))}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Priority Tasks List */}
      <section className="bg-white dark:bg-[#12151e] rounded-3xl border border-slate-200/90 dark:border-[#1e2230] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white tracking-tight">
              Priority Tasks
            </h3>
            <p className="text-[11px] text-slate-500 dark:text-gray-400">
              Personalized based on exam urgency, difficulty & daily {dailyCapacity}h limit
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Clean Test Rebalance Pill */}
            {tasks.length > 0 && (
              <button
                onClick={() => {
                  const firstPending = tasks.find((t) => !t.isCompleted);
                  if (firstPending) onSimulateMissed(firstPending);
                }}
                className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 text-[11px] font-bold hover:bg-amber-100 dark:hover:bg-amber-950/50 transition-colors shadow-sm"
                title="Simulate missed study session to demonstrate adaptive rebalancing"
              >
                <RotateCcw className="w-3 h-3 text-amber-500" />
                <span>Simulate Miss</span>
              </button>
            )}
          </div>
        </div>

        {tasks.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
            <p className="font-bold text-slate-700 dark:text-gray-300">All caught up for today!</p>
            <p className="text-[11px] text-slate-400 dark:text-gray-500 mt-0.5">Your study roadmap is completely clear.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-[#1e2230]">
            {tasks.map((task, idx) => {
              const isDone = task.isCompleted;
              const isUrgent = idx === 0;

              return (
                <div
                  key={task.id}
                  className={`py-3.5 first:pt-0 last:pb-0 flex items-start justify-between gap-3 transition-opacity ${
                    isDone ? 'opacity-40' : 'opacity-100'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <button
                      onClick={() => onCompleteTask(task.id)}
                      className="mt-1 text-slate-300 dark:text-gray-600 hover:text-emerald-500 transition-colors flex-shrink-0"
                      title={isDone ? 'Mark Incomplete' : 'Complete Task'}
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-100 dark:fill-emerald-950/40" />
                      ) : (
                        <Circle className="w-4 h-4" />
                      )}
                    </button>

                    <div className="min-w-0">
                      <h4
                        className={`text-xs font-bold ${
                          isDone
                            ? 'line-through text-slate-400 dark:text-gray-500'
                            : 'text-slate-900 dark:text-white'
                        }`}
                      >
                        {task.topicName}
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-gray-400 mt-0.5 truncate">
                        {task.subjectName} • Key syllabus concept
                      </p>

                      {/* Metadata badges (# Course, Est. 2h) */}
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className="text-[10px] font-mono text-slate-600 dark:text-gray-300 bg-slate-100 dark:bg-[#1a1f2c] px-2 py-0.5 rounded-md font-medium border border-slate-200/80 dark:border-[#262c3e]">
                          # {task.subjectName}
                        </span>

                        <span className="text-[10px] text-slate-500 dark:text-gray-400 flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3 text-indigo-500" />
                          Est. {task.durationHours}h
                        </span>

                        <span
                          className={`text-[9px] uppercase font-mono font-bold px-1.5 py-0.5 rounded border ${
                            task.difficulty === 'hard'
                              ? 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/30 dark:text-rose-300 dark:border-rose-900'
                              : task.difficulty === 'medium'
                              ? 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-900'
                          }`}
                        >
                          {task.difficulty}
                        </span>

                        {task.pattern && (
                          <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60">
                            ⚡ {task.pattern}
                          </span>
                        )}

                        {task.problemUrl && (
                          <a
                            href={task.problemUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
                          >
                            Solve on TUF ↗
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Tags & Clean Action */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Due Tag Pill */}
                    {isUrgent ? (
                      <span className="text-[10px] font-bold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 px-2.5 py-0.5 rounded-full">
                        Due Today
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 px-2.5 py-0.5 rounded-full">
                        Tomorrow
                      </span>
                    )}

                    {/* AI Study Guidance button */}
                    <button
                      onClick={() => onOpenStudyTip(task)}
                      className="p-1.5 rounded-xl text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-slate-100 dark:hover:bg-[#1a1f2c] transition-colors"
                      title="AI Study Tip"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                    </button>

                    {/* Start Focus Timer Button */}
                    {!isDone && (
                      <button
                        onClick={() => onStartFocus(task)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 font-bold text-xs transition-all shadow-sm"
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

      {/* Course Materials & Syllabus Section */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white tracking-tight">
            Course Documents & Syllabi
          </h3>
          {onOpenSyllabusModal && (
            <button
              onClick={onOpenSyllabusModal}
              className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
            >
              + Upload New Document
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div
            onClick={onOpenSyllabusModal}
            className="p-4 rounded-2xl bg-white dark:bg-[#12151e] border border-slate-200/90 dark:border-[#1e2230] shadow-sm flex items-start gap-3 hover:border-indigo-400 transition-colors cursor-pointer group"
          >
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 group-hover:scale-105 transition-transform">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[130px]">
                CS_Syllabus_2026.pdf
              </h4>
              <p className="text-[10px] text-slate-400 dark:text-gray-400 mt-0.5">8 topics loaded</p>
            </div>
          </div>

          <div
            onClick={onOpenSyllabusModal}
            className="p-4 rounded-2xl bg-white dark:bg-[#12151e] border border-slate-200/90 dark:border-[#1e2230] shadow-sm flex items-start gap-3 hover:border-emerald-400 transition-colors cursor-pointer group"
          >
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 group-hover:scale-105 transition-transform">
              <Folder className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[130px]">
                Chem_Reaction_Decks
              </h4>
              <p className="text-[10px] text-slate-400 dark:text-gray-400 mt-0.5">Updated recently</p>
            </div>
          </div>

          <div
            onClick={onOpenSyllabusModal}
            className="p-4 rounded-2xl bg-white dark:bg-[#12151e] border border-slate-200/90 dark:border-[#1e2230] shadow-sm flex items-start gap-3 hover:border-amber-400 transition-colors cursor-pointer group"
          >
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate max-w-[130px]">
                LinearAlgebra_Syllabus
              </h4>
              <p className="text-[10px] text-slate-400 dark:text-gray-400 mt-0.5">Parsed via text</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
