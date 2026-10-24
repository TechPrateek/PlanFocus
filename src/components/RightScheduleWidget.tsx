import React, { useState } from 'react';
import { ScheduledTask } from '../types';
import { formatTimeHours } from '../utils/dateUtils';
import { Play } from 'lucide-react';

interface RightScheduleWidgetProps {
  tasks: ScheduledTask[];
  onStartFocus: (task: ScheduledTask) => void;
  isDarkMode: boolean;
}

export const RightScheduleWidget: React.FC<RightScheduleWidgetProps> = ({
  tasks,
  onStartFocus,
  isDarkMode,
}) => {
  const [autoSync, setAutoSync] = useState(true);

  // Generate mock time slots for today's tasks
  const timeSlots = [
    { start: '09:00 AM', end: '10:30 AM' },
    { start: '11:00 AM', end: '12:30 PM' },
    { start: '02:00 PM', end: '03:30 PM' },
    { start: '04:00 PM', end: '05:30 PM' },
    { start: '06:00 PM', end: '07:30 PM' },
  ];

  return (
    <div
      className={`rounded-3xl p-6 border shadow-sm transition-colors ${
        isDarkMode
          ? 'bg-[#12151e] border-[#1e2230] text-white'
          : 'bg-white border-gray-200/80 text-gray-900'
      }`}
    >
      {/* Widget Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="font-bold text-sm tracking-tight text-gray-900 dark:text-white">
          Today's Schedule
        </h3>

        <div className="flex items-center gap-2">
          <span className="text-[11px] text-gray-400 font-medium">Auto-sync</span>
          <button
            onClick={() => setAutoSync(!autoSync)}
            className={`w-9 h-5 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
              autoSync ? 'bg-black dark:bg-white' : 'bg-gray-300 dark:bg-gray-700'
            }`}
          >
            <div
              className={`w-3.5 h-3.5 rounded-full transition-transform ${
                autoSync
                  ? 'bg-white dark:bg-black translate-x-4'
                  : 'bg-white translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Schedule Items with Timeline Dot */}
      {tasks.length === 0 ? (
        <p className="text-xs text-gray-400 py-6 text-center italic">
          No tasks scheduled for today.
        </p>
      ) : (
        <div className="relative pl-6 space-y-5 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200 dark:before:bg-gray-800">
          {tasks.slice(0, 4).map((task, idx) => {
            const slot = timeSlots[idx] || { start: `${9 + idx}:00 AM`, end: `${10 + idx}:30 AM` };
            const isFirst = idx === 0;

            return (
              <div key={task.id} className="relative group">
                {/* Timeline Dot */}
                <div
                  className={`absolute -left-6 top-1 w-2.5 h-2.5 rounded-full border-2 transition-transform group-hover:scale-125 ${
                    isFirst
                      ? 'bg-indigo-600 border-white dark:border-[#12151e] ring-4 ring-indigo-500/20'
                      : 'bg-gray-300 dark:bg-gray-700 border-white dark:border-[#12151e]'
                  }`}
                />

                {/* Time row */}
                <div className="flex items-center gap-2 text-[11px] font-mono text-gray-400 mb-1">
                  <span>{slot.start} - {slot.end}</span>
                  {isFirst && (
                    <span className="text-[9px] font-sans font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-950/40 px-1.5 py-0.2 rounded">
                      Active Now
                    </span>
                  )}
                </div>

                {/* Task Card Box */}
                <div
                  className={`p-3 rounded-2xl border transition-all ${
                    isFirst
                      ? isDarkMode
                        ? 'bg-[#171b26] border-indigo-500/40 shadow-sm'
                        : 'bg-indigo-50/40 border-indigo-200 shadow-sm'
                      : isDarkMode
                      ? 'bg-[#151924]/60 border-transparent hover:border-[#1e2230]'
                      : 'bg-gray-50/70 border-transparent hover:border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: task.subjectColor || '#6366f1' }}
                        />
                        <span className="text-[10px] font-bold text-gray-500 dark:text-gray-400">
                          {task.subjectName}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-gray-900 dark:text-white leading-tight">
                        {task.topicName}
                      </h4>
                      <p className="text-[10px] text-gray-400 mt-1">
                        Block: {formatTimeHours(task.durationHours)} • {task.difficulty}
                      </p>
                    </div>

                    <button
                      onClick={() => onStartFocus(task)}
                      className="p-1.5 rounded-lg bg-black text-white dark:bg-white dark:text-black hover:opacity-80 transition-opacity flex-shrink-0"
                      title="Focus on this"
                    >
                      <Play className="w-3 h-3 fill-current" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
