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

  const cardBorder = isDarkMode
    ? 'border-[rgba(217,234,224,0.12)] bg-[#121616]'
    : 'border-slate-200 bg-white shadow-sm';
  const textHeading = isDarkMode ? 'text-white' : 'text-slate-900';
  const textMuted = isDarkMode ? 'text-[#82918c]' : 'text-slate-500';

  return (
    <div className={`rounded-xl p-5 border transition-colors ${cardBorder}`}>
      {/* Widget Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-[10px] font-mono tracking-wider uppercase text-[#82918c] block">
            SLOT ALLOCATION
          </span>
          <h3 className={`font-extrabold text-sm tracking-tight mt-0.5 ${textHeading}`}>
            Today's Timeline
          </h3>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-mono ${textMuted}`}>Auto-sync</span>
          <button
            onClick={() => setAutoSync(!autoSync)}
            className={`w-8 h-4 flex items-center rounded-full p-0.5 cursor-pointer transition-colors ${
              autoSync
                ? isDarkMode
                  ? 'bg-[#abf5c0]'
                  : 'bg-emerald-600'
                : isDarkMode
                ? 'bg-gray-800'
                : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-3 h-3 rounded-full transition-transform ${
                autoSync ? 'bg-[#0b0d0d] translate-x-4' : 'bg-white translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Schedule Items with Timeline Dot */}
      {tasks.length === 0 ? (
        <p className="text-xs text-[#82918c] py-6 text-center italic font-mono">
          No active blocks scheduled for today.
        </p>
      ) : (
        <div className="relative pl-5 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-px before:bg-[rgba(217,234,224,0.15)]">
          {tasks.slice(0, 4).map((task, idx) => {
            const slot = timeSlots[idx] || { start: `${9 + idx}:00 AM`, end: `${10 + idx}:30 AM` };
            const isFirst = idx === 0;

            return (
              <div key={task.id} className="relative group">
                {/* Timeline Dot */}
                <div
                  className={`absolute -left-5 top-1.5 w-2 h-2 rounded-full transition-transform group-hover:scale-125 ${
                    isFirst
                      ? 'bg-[#abf5c0] ring-2 ring-[#abf5c0]/30'
                      : isDarkMode
                      ? 'bg-gray-700 border border-gray-600'
                      : 'bg-slate-300'
                  }`}
                />

                {/* Time row */}
                <div className="flex items-center gap-2 text-[10px] font-mono text-[#82918c] mb-1">
                  <span>
                    {slot.start} - {slot.end}
                  </span>
                  {isFirst && (
                    <span
                      className={`text-[9px] font-mono font-bold px-1.5 py-0.2 rounded ${
                        isDarkMode ? 'bg-[#abf5c0]/15 text-[#abf5c0]' : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      Active Now
                    </span>
                  )}
                </div>

                {/* Task Card Box */}
                <div
                  className={`p-3 rounded-lg border transition-all ${
                    isFirst
                      ? isDarkMode
                        ? 'bg-[#171c1b] border-[#abf5c0]/30 shadow-sm'
                        : 'bg-emerald-50/50 border-emerald-200 shadow-sm'
                      : isDarkMode
                      ? 'bg-[#171c1b]/60 border-[rgba(217,234,224,0.06)] hover:border-[rgba(217,234,224,0.2)]'
                      : 'bg-slate-50 border-slate-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span
                          className="w-1.5 h-1.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: task.subjectColor || '#abf5c0' }}
                        />
                        <span className={`text-[10px] font-mono font-semibold truncate ${textMuted}`}>
                          {task.subjectName}
                        </span>
                      </div>
                      <h4 className={`text-xs font-bold leading-tight truncate ${textHeading}`}>
                        {task.topicName}
                      </h4>
                      <p className={`text-[10px] font-mono mt-1 ${textMuted}`}>
                        {formatTimeHours(task.durationHours)} &bull; {task.difficulty}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onStartFocus(task);
                      }}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-bold flex items-center gap-1 transition-all flex-shrink-0 cursor-pointer shadow-xs ${
                        isDarkMode
                          ? 'bg-[#abf5c0] hover:bg-[#cdfad8] text-[#0b0d0d]'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                      }`}
                      title="Focus on this"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>Focus</span>
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
