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
  FileText,
  GraduationCap,
  TrendingUp,
  FileCode,
  Folder,
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
  onLoadSample,
}) => {
  // Metrics
  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const pendingCount = tasks.filter((t) => !t.isCompleted).length;
  const totalHoursPlanned = tasks.reduce((sum, t) => sum + t.durationHours, 0);

  // If no subjects exist, show welcoming empty state
  if (subjects.length === 0) {
    return (
      <div className="py-16 text-center max-w-lg mx-auto">
        <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
          <BookOpen className="w-7 h-7" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Ready to plan your semester?
        </h2>
        <p className="text-xs text-gray-500 mb-6 leading-relaxed">
          FocusFlow AI turns your course syllabi, exam dates, and daily study hours into an adaptive schedule.
        </p>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onOpenWizard}
            className="p-4 rounded-2xl border border-gray-200 dark:border-[#1e2230] bg-white dark:bg-[#12151e] hover:border-indigo-500 transition-all text-left"
          >
            <Sparkles className="w-5 h-5 text-indigo-500 mb-2" />
            <h4 className="text-xs font-bold text-gray-900 dark:text-white">Setup Wizard</h4>
            <p className="text-[10px] text-gray-400 mt-0.5">Add subjects & deadlines</p>
          </button>

          <button
            onClick={onLoadSample}
            className="p-4 rounded-2xl border border-gray-200 dark:border-[#1e2230] bg-white dark:bg-[#12151e] hover:border-emerald-500 transition-all text-left"
          >
            <Folder className="w-5 h-5 text-emerald-500 mb-2" />
            <h4 className="text-xs font-bold text-gray-900 dark:text-white">Demo Plan</h4>
            <p className="text-[10px] text-gray-400 mt-0.5">Preload CS & Chemistry</p>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-7">
      {/* 4 Stat Cards Row (Exact Match to Screenshot!) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* Card 1: Target GPA / Readiness */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#12151e] border border-gray-200/80 dark:border-[#1e2230] shadow-sm">
          <div className="flex items-center justify-between text-gray-400 mb-1.5">
            <span className="text-[11px] font-semibold">Exam Readiness</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-extrabold text-gray-900 dark:text-white font-mono">
            3.85
          </div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
            <span>↑ Top 5% pace</span>
          </div>
        </div>

        {/* Card 2: Study Streak */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#12151e] border border-gray-200/80 dark:border-[#1e2230] shadow-sm">
          <div className="flex items-center justify-between text-gray-400 mb-1.5">
            <span className="text-[11px] font-semibold">Study Streak</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500/20" />
          </div>
          <div className="text-2xl font-extrabold text-gray-900 dark:text-white font-mono">
            {streak} <span className="text-xs font-sans font-normal text-gray-500">days</span>
          </div>
          <div className="w-full h-1 bg-gray-100 dark:bg-gray-800 rounded-full mt-2 overflow-hidden">
            <div className="h-full bg-amber-500 rounded-full w-3/4" />
          </div>
        </div>

        {/* Card 3: Assignments / Tasks */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#12151e] border border-gray-200/80 dark:border-[#1e2230] shadow-sm">
          <div className="flex items-center justify-between text-gray-400 mb-1.5">
            <span className="text-[11px] font-semibold">Tasks Queue</span>
            <FileText className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-extrabold text-gray-900 dark:text-white font-mono">
            {pendingCount} <span className="text-xs font-sans font-normal text-gray-500">left</span>
          </div>
          <p className="text-[10px] text-gray-400 mt-1">
            {completedCount} completed today
          </p>
        </div>

        {/* Card 4: Daily Capacity / Hours */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#12151e] border border-gray-200/80 dark:border-[#1e2230] shadow-sm">
          <div className="flex items-center justify-between text-gray-400 mb-1.5">
            <span className="text-[11px] font-semibold">Today's Study Load</span>
            <GraduationCap className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="text-2xl font-extrabold text-gray-900 dark:text-white font-mono">
            {formatTimeHours(totalHoursPlanned)} <span className="text-xs font-sans font-normal text-gray-500">/ {dailyCapacity}h</span>
          </div>
          <div className="w-full h-1 bg-gray-100 dark:bg-gray-800 rounded-full mt-2 overflow-hidden">
            <div
              className="h-full bg-indigo-500 rounded-full"
              style={{
                width: `${Math.min(100, Math.round((totalHoursPlanned / (dailyCapacity || 3)) * 100))}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Priority Tasks List (Exact Match to Screenshot!) */}
      <section className="bg-white dark:bg-[#12151e] rounded-3xl border border-gray-200/80 dark:border-[#1e2230] p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-base text-gray-900 dark:text-white tracking-tight">
            Priority Tasks
          </h3>
          <span className="text-xs font-medium text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 cursor-pointer">
            View all →
          </span>
        </div>

        {tasks.length === 0 ? (
          <div className="py-8 text-center text-gray-400 text-xs">
            <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
            <p className="font-semibold text-gray-700 dark:text-gray-300">All caught up for today!</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Your roadmap is completely clear.</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-[#1e2230]">
            {tasks.map((task, idx) => {
              const isDone = task.isCompleted;
              const isUrgent = idx === 0;

              return (
                <div
                  key={task.id}
                  className={`py-3.5 first:pt-0 last:pb-0 flex items-start justify-between gap-3 transition-opacity ${
                    isDone ? 'opacity-50' : 'opacity-100'
                  }`}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <button
                      onClick={() => onCompleteTask(task.id)}
                      className="mt-1 text-gray-300 dark:text-gray-600 hover:text-emerald-500 transition-colors"
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
                            ? 'line-through text-gray-400'
                            : 'text-gray-900 dark:text-white'
                        }`}
                      >
                        {task.topicName}
                      </h4>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                        {task.subjectName} • Key syllabus concept
                      </p>

                      {/* Metadata badges (# Course, Est. 2h) */}
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span className="text-[10px] font-mono text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-[#1a1f2c] px-2 py-0.5 rounded-md font-medium border border-gray-200/60 dark:border-[#262c3e]">
                          # {task.subjectName}
                        </span>

                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-indigo-500" />
                          Est. {task.durationHours}h
                        </span>

                        <span
                          className={`text-[9px] uppercase font-mono font-bold px-1.5 py-0.2 rounded border ${
                            task.difficulty === 'hard'
                              ? 'bg-rose-50 text-rose-600 border-rose-200 dark:bg-rose-950/30 dark:text-rose-300 dark:border-rose-900'
                              : task.difficulty === 'medium'
                              ? 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-950/30 dark:text-amber-300 dark:border-amber-900'
                              : 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-950/30 dark:text-emerald-300 dark:border-emerald-900'
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
                            className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-0.5"
                          >
                            Solve on TUF ↗
                          </a>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Right Tags & Quick Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {/* Due Tag Pill */}
                    {isUrgent ? (
                      <span className="text-[10px] font-semibold text-rose-600 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 px-2.5 py-0.5 rounded-full">
                        Due Today
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-amber-600 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 px-2.5 py-0.5 rounded-full">
                        Tomorrow
                      </span>
                    )}

                    {/* AI Study Guidance button */}
                    <button
                      onClick={() => onOpenStudyTip(task)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 dark:hover:text-indigo-300 hover:bg-gray-100 dark:hover:bg-[#1a1f2c] transition-colors"
                      title="AI Study Tip"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                    </button>

                    {/* Simulate Missed block (for judges) */}
                    {!isDone && (
                      <button
                        onClick={() => onSimulateMissed(task)}
                        className="text-[10px] text-gray-400 hover:text-rose-500 dark:hover:text-rose-400 px-2 py-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-colors"
                        title="Simulate missed session to test adaptive replan"
                      >
                        Simulate Miss
                      </button>
                    )}

                    {/* Start Focus Timer Button */}
                    {!isDone && (
                      <button
                        onClick={() => onStartFocus(task)}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-black dark:bg-white text-white dark:text-black font-semibold text-xs hover:opacity-90 transition-opacity shadow-sm"
                      >
                        <Play className="w-3 h-3 fill-current" />
                        Focus
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Recent Materials Section (Exact Match to Screenshot!) */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm text-gray-900 dark:text-white tracking-tight">
            Recent Materials & Study Docs
          </h3>
          <span className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer">
            All files →
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-white dark:bg-[#12151e] border border-gray-200/80 dark:border-[#1e2230] shadow-sm flex items-start gap-3 hover:border-indigo-400 transition-colors cursor-pointer group">
            <div className="p-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-500 group-hover:scale-105 transition-transform">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate max-w-[130px]">
                CS201_Trees_Guide.pdf
              </h4>
              <p className="text-[10px] text-gray-400 mt-0.5">Reviewed 2h ago</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#12151e] border border-gray-200/80 dark:border-[#1e2230] shadow-sm flex items-start gap-3 hover:border-emerald-400 transition-colors cursor-pointer group">
            <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-500 group-hover:scale-105 transition-transform">
              <Folder className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate max-w-[130px]">
                Chem_Reaction_Decks
              </h4>
              <p className="text-[10px] text-gray-400 mt-0.5">Updated 5h ago</p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-[#12151e] border border-gray-200/80 dark:border-[#1e2230] shadow-sm flex items-start gap-3 hover:border-amber-400 transition-colors cursor-pointer group">
            <div className="p-2.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-500 group-hover:scale-105 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate max-w-[130px]">
                LinearAlgebra_Formulas
              </h4>
              <p className="text-[10px] text-gray-400 mt-0.5">Checked yesterday</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
