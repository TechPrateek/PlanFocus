import React from 'react';
import { DailySchedule, ScheduledTask } from '../types';
import { Calendar, Clock, CheckCircle2, Circle, AlertCircle, Play } from 'lucide-react';
import { formatTimeHours } from '../utils/dateUtils';

interface ScheduleTimelineProps {
  schedule: DailySchedule[];
  onCompleteTask: (taskId: string) => void;
  onStartFocus: (task: ScheduledTask) => void;
}

export const ScheduleTimeline: React.FC<ScheduleTimelineProps> = ({
  schedule,
  onCompleteTask,
  onStartFocus,
}) => {
  if (schedule.length === 0) {
    return (
      <div className="py-16 text-center text-gray-400">
        <Calendar className="w-12 h-12 mx-auto text-gray-600 mb-3" />
        <h3 className="text-base font-semibold text-white">No Schedule Generated Yet</h3>
        <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
          Add subjects and exam dates or load the sample demo plan to generate your timeline.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-[#1e2230]">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
            Adaptive Study Roadmap
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Day-by-day balanced allocation based on exam proximity and topic difficulty.
          </p>
        </div>
        <div className="text-xs text-gray-400">
          Showing next {schedule.length} days
        </div>
      </div>

      <div className="space-y-4">
        {schedule.map((day) => {
          const isToday = day.dayLabel === 'Today';
          const capacityPercent = Math.min(
            100,
            Math.round((day.totalHours / (day.capacityHours || 3)) * 100)
          );

          return (
            <div
              key={day.date}
              className={`p-4 rounded-xl border transition-all ${
                isToday
                  ? 'bg-[#12151e] border-indigo-500/50 shadow-lg shadow-indigo-950/20'
                  : 'bg-[#12151e]/80 border-[#1e2230]'
              }`}
            >
              {/* Day Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 mb-3 border-b border-[#1e2230]/70">
                <div className="flex items-center gap-3">
                  <div
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${
                      isToday
                        ? 'bg-indigo-600 text-white'
                        : 'bg-[#171b26] text-gray-300 border border-[#1e2230]'
                    }`}
                  >
                    {day.dayLabel}
                  </div>
                  <span className="text-xs text-gray-400 font-mono">{day.date}</span>

                  {day.isExamDay && (
                    <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      Exam: {day.examSubjectNames.join(', ')}
                    </span>
                  )}
                </div>

                {/* Capacity Progress Bar */}
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Clock className="w-3.5 h-3.5 text-indigo-400" />
                  <span>
                    {formatTimeHours(day.totalHours)} / {day.capacityHours}h capacity
                  </span>
                  <div className="w-20 h-1.5 bg-[#171b26] rounded-full overflow-hidden ml-1">
                    <div
                      className={`h-full rounded-full transition-all ${
                        capacityPercent >= 100
                          ? 'bg-amber-400'
                          : 'bg-indigo-500'
                      }`}
                      style={{ width: `${capacityPercent}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Day Tasks List */}
              {day.tasks.length === 0 ? (
                <div className="py-4 text-center text-xs text-gray-500 italic">
                  {day.isExamDay
                    ? 'Exam scheduled today — no additional study blocks allocated.'
                    : 'Rest or review day — no pending topics assigned.'}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {day.tasks.map((task) => {
                    const isDone = task.isCompleted;

                    return (
                      <div
                        key={task.id}
                        className={`p-3 rounded-lg border flex items-center justify-between gap-2 transition-all ${
                          isDone
                            ? 'bg-[#171b26]/40 border-[#1e2230] opacity-50'
                            : 'bg-[#171b26] border-[#1e2230] hover:border-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <button
                            onClick={() => onCompleteTask(task.id)}
                            className="text-gray-400 hover:text-emerald-400 transition-colors focus:outline-none flex-shrink-0"
                          >
                            {isDone ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Circle className="w-4 h-4" />
                            )}
                          </button>

                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span
                                className="w-2 h-2 rounded-full flex-shrink-0"
                                style={{ backgroundColor: task.subjectColor || '#6366f1' }}
                              />
                              <span className="text-[10px] text-gray-400 font-medium">
                                {task.subjectName}
                              </span>
                              <span className="text-[9px] uppercase px-1 rounded bg-[#12151e] border border-[#1e2230] text-gray-400 font-mono">
                                {task.difficulty}
                              </span>
                            </div>
                            <h4
                              className={`text-xs font-semibold truncate ${
                                isDone ? 'line-through text-gray-500' : 'text-white'
                              }`}
                            >
                              {task.topicName}
                            </h4>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 flex-shrink-0">
                          <span className="text-[11px] font-mono text-gray-400 bg-[#12151e] px-1.5 py-0.5 rounded border border-[#1e2230]">
                            {formatTimeHours(task.durationHours)}
                          </span>

                          {!isDone && (
                            <button
                              onClick={() => onStartFocus(task)}
                              className="p-1 rounded bg-indigo-600/30 hover:bg-indigo-600 text-indigo-300 hover:text-white transition-colors"
                              title="Start Timer"
                            >
                              <Play className="w-3 h-3 fill-current" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
