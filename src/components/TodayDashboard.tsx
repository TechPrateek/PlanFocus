import React from 'react';
import { ScheduledTask, Subject } from '../types';
import { Calendar, CheckCircle2, Circle, Clock, Play, Sparkles, AlertTriangle, BookOpen } from 'lucide-react';
import { formatTimeHours, getDaysDifference, getTodayDateString } from '../utils/dateUtils';

interface TodayDashboardProps {
  tasks: ScheduledTask[];
  subjects: Subject[];
  dailyCapacity: number;
  onCompleteTask: (taskId: string) => void;
  onStartFocus: (task: ScheduledTask) => void;
  onSimulateMissed: (task: ScheduledTask) => void;
  onOpenStudyTip: (task: ScheduledTask) => void;
  onOpenWizard: () => void;
  onLoadSample: () => void;
}

export const TodayDashboard: React.FC<TodayDashboardProps> = ({
  tasks,
  subjects,
  dailyCapacity,
  onCompleteTask,
  onStartFocus,
  onSimulateMissed,
  onOpenStudyTip,
  onOpenWizard,
  onLoadSample,
}) => {
  const today = getTodayDateString();

  // Calculate upcoming exams
  const upcomingExams = subjects
    .map((s) => ({
      ...s,
      daysLeft: getDaysDifference(today, s.examDate),
    }))
    .filter((s) => s.daysLeft >= 0)
    .sort((a, b) => a.daysLeft - b.daysLeft);

  const completedCount = tasks.filter((t) => t.isCompleted).length;
  const totalTasksCount = tasks.length;
  const totalHoursPlanned = tasks.reduce((sum, t) => sum + t.durationHours, 0);

  // If no subjects exist, show helpful empty state
  if (subjects.length === 0) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <div className="w-16 h-16 mx-auto mb-6 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
          <BookOpen className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-white tracking-tight mb-2">Welcome to FocusFlow AI</h2>
        <p className="text-gray-400 max-w-lg mx-auto text-sm mb-8 leading-relaxed">
          Transform your course syllabus, upcoming exams, and available study hours into an adaptive, realistic daily schedule.
        </p>

        <div className="grid sm:grid-cols-2 gap-4 max-w-xl mx-auto">
          <button
            onClick={onOpenWizard}
            className="flex flex-col items-center justify-center p-6 rounded-xl bg-[#12151e] border border-[#1e2230] hover:border-indigo-500/50 hover:bg-[#171b26] transition-all group text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white text-base mb-1">Quick Setup Wizard</h3>
            <p className="text-xs text-gray-400 text-center">
              Add your subjects, exam deadlines, and daily study availability.
            </p>
          </button>

          <button
            onClick={onLoadSample}
            className="flex flex-col items-center justify-center p-6 rounded-xl bg-[#12151e] border border-[#1e2230] hover:border-emerald-500/50 hover:bg-[#171b26] transition-all group text-left"
          >
            <div className="w-10 h-10 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-semibold text-white text-base mb-1">Load Sample Student Plan</h3>
            <p className="text-xs text-gray-400 text-center">
              Preload realistic CS & Chemistry exams to test immediately.
            </p>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Top Banner: Upcoming Exams Countdowns */}
      {upcomingExams.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              Upcoming Exam Deadlines
            </h2>
            <span className="text-xs text-gray-500">{upcomingExams.length} active courses</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {upcomingExams.map((subj) => {
              const isUrgent = subj.daysLeft <= 7;
              return (
                <div
                  key={subj.id}
                  className="p-3.5 rounded-xl bg-[#12151e] border border-[#1e2230] flex items-center justify-between hover:border-gray-700 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-2.5 h-10 rounded-full"
                      style={{ backgroundColor: subj.color || '#6366f1' }}
                    />
                    <div>
                      <h3 className="font-semibold text-sm text-white truncate max-w-[170px]">
                        {subj.name}
                      </h3>
                      <p className="text-xs text-gray-400">{subj.code || 'Course'}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-xs font-mono font-semibold ${
                        isUrgent
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                      }`}
                    >
                      {subj.daysLeft === 0
                        ? 'Exam Today!'
                        : subj.daysLeft === 1
                        ? 'Tomorrow'
                        : `${subj.daysLeft} days`}
                    </span>
                    <p className="text-[10px] text-gray-500 mt-0.5">{subj.examDate}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Today's Focus Queue */}
      <section className="bg-[#12151e] rounded-xl border border-[#1e2230] p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-[#1e2230]">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              Today's Study Plan
              <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-mono font-medium">
                {formatTimeHours(totalHoursPlanned)} / {dailyCapacity}h capacity
              </span>
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Prioritized by exam proximity and topic difficulty. Check off as you complete.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">
              {completedCount} of {totalTasksCount} completed
            </span>
            <div className="w-24 h-2 bg-[#1e2230] rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-500 transition-all duration-300"
                style={{
                  width: `${totalTasksCount > 0 ? (completedCount / totalTasksCount) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        </div>

        {tasks.length === 0 ? (
          <div className="py-10 text-center text-gray-400">
            <CheckCircle2 className="w-10 h-10 mx-auto text-emerald-400/80 mb-2" />
            <p className="font-medium text-white text-sm">All caught up for today!</p>
            <p className="text-xs text-gray-400 mt-1">
              You have no pending tasks scheduled for today. Check the timeline to view upcoming days.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => {
              const isDone = task.isCompleted;
              const isMissed = task.isMissed;

              return (
                <div
                  key={task.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isDone
                      ? 'bg-[#171b26]/50 border-[#1e2230] opacity-60'
                      : isMissed
                      ? 'bg-rose-950/20 border-rose-500/40'
                      : 'bg-[#171b26] border-[#1e2230] hover:border-gray-700'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Left: Completion trigger & Details */}
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => onCompleteTask(task.id)}
                        className="mt-0.5 text-gray-400 hover:text-emerald-400 transition-colors focus:outline-none"
                        title={isDone ? 'Mark Incomplete' : 'Mark Completed'}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/20" />
                        ) : (
                          <Circle className="w-5 h-5 hover:scale-110 transition-transform" />
                        )}
                      </button>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span
                            className="text-[11px] font-semibold px-2 py-0.5 rounded-md text-white"
                            style={{ backgroundColor: task.subjectColor || '#6366f1' }}
                          >
                            {task.subjectName}
                          </span>

                          <span
                            className={`text-[10px] font-mono uppercase px-1.5 py-0.5 rounded border ${
                              task.difficulty === 'hard'
                                ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                                : task.difficulty === 'medium'
                                ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                                : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                            }`}
                          >
                            {task.difficulty}
                          </span>

                          {isMissed && (
                            <span className="text-[10px] bg-rose-500/20 text-rose-400 px-1.5 py-0.5 rounded border border-rose-500/30 font-semibold flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" /> Missed
                            </span>
                          )}
                        </div>

                        <h4
                          className={`font-semibold text-sm ${
                            isDone ? 'line-through text-gray-400' : 'text-white'
                          }`}
                        >
                          {task.topicName}
                        </h4>

                        <div className="flex items-center gap-3 mt-1 text-xs text-gray-400">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-indigo-400" />
                            {formatTimeHours(task.durationHours)} block
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 self-end sm:self-center">
                      {/* AI Study Guidance button */}
                      <button
                        onClick={() => onOpenStudyTip(task)}
                        className="p-2 rounded-lg bg-[#12151e] border border-[#1e2230] text-gray-400 hover:text-indigo-300 hover:border-indigo-500/40 transition-colors text-xs flex items-center gap-1"
                        title="Get AI Study Advice & Breakdown"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                        <span className="hidden md:inline">Study Tips</span>
                      </button>

                      {/* Simulate Missed (Judge / Demo Helper) */}
                      {!isDone && (
                        <button
                          onClick={() => onSimulateMissed(task)}
                          className="px-2 py-1.5 rounded-lg text-[11px] text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors border border-transparent hover:border-rose-500/30"
                          title="Simulate missing this session to test Adaptive Rebalance"
                        >
                          Simulate Miss
                        </button>
                      )}

                      {/* Start Focus Session */}
                      {!isDone && (
                        <button
                          onClick={() => onStartFocus(task)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all shadow-indigo-600/20 hover:scale-105"
                        >
                          <Play className="w-3.5 h-3.5 fill-current" />
                          Focus
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};
