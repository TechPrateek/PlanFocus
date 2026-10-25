import React from 'react';
import { ScheduledTask, Subject } from '../types';
import { formatTimeHours } from '../utils/dateUtils';
import {
  TrendingUp,
  Flame,
  Clock,
  GraduationCap,
  Sparkles,
  BookOpen,
  Play,
  RotateCcw,
  CheckCircle2,
  Circle,
  Folder,
  FileCode,
  UploadCloud,
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
  // Dynamic color tokens based on isDarkMode
  const cardBgClass = isDarkMode
    ? 'bg-[#12151e] border-[#1e2230]'
    : 'bg-white border-slate-200/90 shadow-sm';
  const textHeadingClass = isDarkMode ? 'text-white' : 'text-slate-900';
  const textSubClass = isDarkMode ? 'text-gray-400' : 'text-slate-500';

  // Metrics
  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const pendingCount = tasks.filter((t) => !t.isCompleted).length;
  const totalHoursPlanned = tasks.reduce((sum, t) => sum + t.durationHours, 0);

  // If no subjects exist, show welcoming clean onboarding
  if (subjects.length === 0) {
    return (
      <div className="py-16 text-center max-w-lg mx-auto">
        <div
          className={`w-16 h-16 mx-auto mb-4 rounded-3xl flex items-center justify-center shadow-inner ${
            isDarkMode ? 'bg-indigo-950/40 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
          }`}
        >
          <BookOpen className="w-8 h-8" />
        </div>
        <h2 className={`text-xl font-black mb-2 ${textHeadingClass}`}>
          Ready to plan your courses?
        </h2>
        <p className={`text-xs mb-6 leading-relaxed max-w-md mx-auto ${textSubClass}`}>
          Upload your course syllabus (PDF or TXT) or paste your course topics. FocusFlow AI automatically budgets your daily study hours before exams.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {onOpenSyllabusModal && (
            <button
              onClick={onOpenSyllabusModal}
              className={`p-4 rounded-2xl border text-left group transition-all ${
                isDarkMode
                  ? 'border-indigo-800/60 bg-indigo-950/20 hover:border-indigo-500'
                  : 'border-indigo-200 bg-indigo-50/70 hover:border-indigo-400 shadow-sm'
              }`}
            >
              <UploadCloud className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mb-2 group-hover:scale-110 transition-transform" />
              <h4 className={`text-xs font-bold ${textHeadingClass}`}>Import Syllabus</h4>
              <p className={`text-[10px] mt-0.5 ${textSubClass}`}>PDF or TXT document</p>
            </button>
          )}

          <button
            onClick={onOpenWizard}
            className={`p-4 rounded-2xl border text-left group transition-all ${
              isDarkMode
                ? 'border-[#1e2230] bg-[#12151e] hover:border-indigo-500'
                : 'border-slate-200 bg-white hover:border-indigo-400 shadow-sm'
            }`}
          >
            <Sparkles className="w-5 h-5 text-amber-500 mb-2 group-hover:scale-110 transition-transform" />
            <h4 className={`text-xs font-bold ${textHeadingClass}`}>Setup Wizard</h4>
            <p className={`text-[10px] mt-0.5 ${textSubClass}`}>Manual course builder</p>
          </button>

          <button
            onClick={onLoadSample}
            className={`p-4 rounded-2xl border text-left group transition-all ${
              isDarkMode
                ? 'border-[#1e2230] bg-[#12151e] hover:border-emerald-500'
                : 'border-slate-200 bg-white hover:border-emerald-400 shadow-sm'
            }`}
          >
            <Folder className="w-5 h-5 text-emerald-500 mb-2 group-hover:scale-110 transition-transform" />
            <h4 className={`text-xs font-bold ${textHeadingClass}`}>Demo Plan</h4>
            <p className={`text-[10px] mt-0.5 ${textSubClass}`}>Preload CS & Chem</p>
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
        <div className={`p-4 rounded-2xl border ${cardBgClass}`}>
          <div className="flex items-center justify-between text-slate-400 dark:text-gray-400 mb-1.5">
            <span className="text-[11px] font-semibold">Exam Readiness</span>
            <TrendingUp className="w-4 h-4 text-emerald-500" />
          </div>
          <div className={`text-2xl font-black font-mono ${textHeadingClass}`}>
            3.85
          </div>
          <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold mt-1">
            <span>↑ Top 5% pace</span>
          </div>
        </div>

        {/* Card 2: Study Streak */}
        <div className={`p-4 rounded-2xl border ${cardBgClass}`}>
          <div className="flex items-center justify-between text-slate-400 dark:text-gray-400 mb-1.5">
            <span className="text-[11px] font-semibold">Study Streak</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500/20" />
          </div>
          <div className={`text-2xl font-black font-mono ${textHeadingClass}`}>
            {streak} <span className="text-xs font-sans font-normal opacity-70">days</span>
          </div>
          <div className={`w-full h-1 rounded-full mt-2 overflow-hidden ${isDarkMode ? 'bg-[#1e2230]' : 'bg-slate-100'}`}>
            <div className="h-full bg-amber-500 rounded-full w-3/4" />
          </div>
        </div>

        {/* Card 3: Tasks Queue */}
        <div className={`p-4 rounded-2xl border ${cardBgClass}`}>
          <div className="flex items-center justify-between text-slate-400 dark:text-gray-400 mb-1.5">
            <span className="text-[11px] font-semibold">Tasks Queue</span>
            <Clock className="w-4 h-4 text-indigo-500" />
          </div>
          <div className={`text-2xl font-black font-mono ${textHeadingClass}`}>
            {pendingCount} <span className="text-xs font-sans font-normal opacity-70">left</span>
          </div>
          <div className={`text-[10px] font-medium mt-1 ${textSubClass}`}>
            {completedCount} completed today
          </div>
        </div>

        {/* Card 4: Today's Study Load */}
        <div className={`p-4 rounded-2xl border ${cardBgClass}`}>
          <div className="flex items-center justify-between text-slate-400 dark:text-gray-400 mb-1.5">
            <span className="text-[11px] font-semibold">Today's Study Load</span>
            <GraduationCap className="w-4 h-4 text-indigo-500" />
          </div>
          <div className={`text-2xl font-black font-mono ${textHeadingClass}`}>
            {formatTimeHours(totalHoursPlanned)} <span className="text-xs font-sans font-normal opacity-70">/ {dailyCapacity}h</span>
          </div>
          <div className={`w-full h-1 rounded-full mt-2 overflow-hidden ${isDarkMode ? 'bg-[#1e2230]' : 'bg-slate-100'}`}>
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
      <section className={`rounded-3xl border p-6 ${cardBgClass}`}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className={`font-extrabold text-base tracking-tight ${textHeadingClass}`}>
              Priority Tasks
            </h3>
            <p className={`text-[11px] ${textSubClass}`}>
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
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-bold transition-colors border shadow-sm ${
                  isDarkMode
                    ? 'bg-amber-950/30 text-amber-300 border-amber-800/60 hover:bg-amber-950/50'
                    : 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                }`}
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
            <p className={`font-bold ${textHeadingClass}`}>All caught up for today!</p>
            <p className={`text-[11px] mt-0.5 ${textSubClass}`}>Your study roadmap is completely clear.</p>
          </div>
        ) : (
          <div className={`divide-y ${isDarkMode ? 'divide-[#1e2230]' : 'divide-slate-100'}`}>
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
                            ? 'line-through text-slate-400'
                            : textHeadingClass
                        }`}
                      >
                        {task.topicName}
                      </h4>
                      <p className={`text-[11px] mt-0.5 truncate ${textSubClass}`}>
                        {task.subjectName} • Key syllabus concept
                      </p>

                      {/* Metadata badges (# Course, Est. 2h) */}
                      <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-medium border ${
                            isDarkMode
                              ? 'text-gray-300 bg-[#1a1f2c] border-[#262c3e]'
                              : 'text-slate-600 bg-slate-100 border-slate-200'
                          }`}
                        >
                          # {task.subjectName}
                        </span>

                        <span className={`text-[10px] flex items-center gap-1 font-medium ${textSubClass}`}>
                          <Clock className="w-3 h-3 text-indigo-500" />
                          Est. {task.durationHours}h
                        </span>

                        <span
                          className={`text-[9px] uppercase font-mono font-bold px-1.5 py-0.5 rounded border ${
                            task.difficulty === 'hard'
                              ? isDarkMode
                                ? 'bg-rose-950/30 text-rose-300 border-rose-900'
                                : 'bg-rose-50 text-rose-700 border-rose-200'
                              : task.difficulty === 'medium'
                              ? isDarkMode
                                ? 'bg-amber-950/30 text-amber-300 border-amber-900'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                              : isDarkMode
                              ? 'bg-emerald-950/30 text-emerald-300 border-emerald-900'
                              : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          }`}
                        >
                          {task.difficulty}
                        </span>

                        {task.pattern && (
                          <span
                            className={`text-[10px] font-medium px-2 py-0.5 rounded-md border ${
                              isDarkMode
                                ? 'bg-purple-950/40 text-purple-300 border-purple-800/60'
                                : 'bg-purple-50 text-purple-700 border-purple-200'
                            }`}
                          >
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
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          isDarkMode
                            ? 'text-rose-300 bg-rose-950/30 border-rose-900'
                            : 'text-rose-700 bg-rose-50 border-rose-200'
                        }`}
                      >
                        Due Today
                      </span>
                    ) : (
                      <span
                        className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                          isDarkMode
                            ? 'text-amber-300 bg-amber-950/30 border-amber-900'
                            : 'text-amber-700 bg-amber-50 border-amber-200'
                        }`}
                      >
                        Tomorrow
                      </span>
                    )}

                    {/* AI Study Guidance button */}
                    <button
                      onClick={() => onOpenStudyTip(task)}
                      className={`p-1.5 rounded-xl transition-colors ${
                        isDarkMode
                          ? 'text-gray-400 hover:text-indigo-300 hover:bg-[#1a1f2c]'
                          : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-100'
                      }`}
                      title="AI Study Tip"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                    </button>

                    {/* Start Focus Timer Button */}
                    {!isDone && (
                      <button
                        onClick={() => onStartFocus(task)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold text-xs transition-all shadow-sm ${
                          isDarkMode
                            ? 'bg-white hover:bg-slate-100 text-slate-900'
                            : 'bg-slate-900 hover:bg-slate-800 text-white'
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

      {/* Course Materials & Syllabus Section */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <h3 className={`font-extrabold text-sm tracking-tight ${textHeadingClass}`}>
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
            className={`p-4 rounded-2xl border flex items-start gap-3 transition-colors cursor-pointer group hover:border-indigo-400 ${cardBgClass}`}
          >
            <div
              className={`p-2.5 rounded-xl group-hover:scale-105 transition-transform ${
                isDarkMode ? 'bg-indigo-950/40 text-indigo-400' : 'bg-indigo-50 text-indigo-600'
              }`}
            >
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h4 className={`text-xs font-bold truncate max-w-[130px] ${textHeadingClass}`}>
                CS_Syllabus_2026.pdf
              </h4>
              <p className={`text-[10px] mt-0.5 ${textSubClass}`}>8 topics loaded</p>
            </div>
          </div>

          <div
            onClick={onOpenSyllabusModal}
            className={`p-4 rounded-2xl border flex items-start gap-3 transition-colors cursor-pointer group hover:border-emerald-400 ${cardBgClass}`}
          >
            <div
              className={`p-2.5 rounded-xl group-hover:scale-105 transition-transform ${
                isDarkMode ? 'bg-emerald-950/40 text-emerald-400' : 'bg-emerald-50 text-emerald-600'
              }`}
            >
              <Folder className="w-5 h-5" />
            </div>
            <div>
              <h4 className={`text-xs font-bold truncate max-w-[130px] ${textHeadingClass}`}>
                Chem_Reaction_Decks
              </h4>
              <p className={`text-[10px] mt-0.5 ${textSubClass}`}>Updated recently</p>
            </div>
          </div>

          <div
            onClick={onOpenSyllabusModal}
            className={`p-4 rounded-2xl border flex items-start gap-3 transition-colors cursor-pointer group hover:border-amber-400 ${cardBgClass}`}
          >
            <div
              className={`p-2.5 rounded-xl group-hover:scale-105 transition-transform ${
                isDarkMode ? 'bg-amber-950/40 text-amber-400' : 'bg-amber-50 text-amber-600'
              }`}
            >
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className={`text-xs font-bold truncate max-w-[130px] ${textHeadingClass}`}>
                LinearAlgebra_Syllabus
              </h4>
              <p className={`text-[10px] mt-0.5 ${textSubClass}`}>Parsed via text</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
