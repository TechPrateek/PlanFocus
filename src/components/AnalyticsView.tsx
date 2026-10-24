import React from 'react';
import { AppState } from '../types';
import { BarChart2, CheckCircle2, Clock, Flame, BookOpen, RotateCcw, Award } from 'lucide-react';

interface AnalyticsViewProps {
  state: AppState;
  onResetData: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  state,
  onResetData,
}) => {
  const { subjects, streak, studyLogs } = state;

  const totalStudyMinutes = studyLogs.reduce((acc, log) => acc + log.durationMinutes, 0);
  const totalStudyHours = (totalStudyMinutes / 60).toFixed(1);

  // Calculate subject progress metrics
  const subjectProgress = subjects.map((subj) => {
    const totalTopics = subj.topics.length;
    const completedTopics = subj.topics.filter((t) => t.isCompleted).length;
    const totalHoursRequired = subj.topics.reduce((acc, t) => acc + t.estimatedHours, 0);
    const completedHours = subj.topics.reduce((acc, t) => acc + (t.isCompleted ? t.estimatedHours : t.completedHours), 0);
    const percent = totalHoursRequired > 0 ? Math.round((completedHours / totalHoursRequired) * 100) : 0;

    return {
      ...subj,
      totalTopics,
      completedTopics,
      totalHoursRequired: Number(totalHoursRequired.toFixed(1)),
      completedHours: Number(completedHours.toFixed(1)),
      percent: Math.min(100, percent),
    };
  });

  const allTopicsCount = subjects.reduce((sum, s) => sum + s.topics.length, 0);
  const completedTopicsCount = subjects.reduce(
    (sum, s) => sum + s.topics.filter((t) => t.isCompleted).length,
    0
  );

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Level Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-[#12151e] border border-[#1e2230]">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Streak</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500/20" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {streak} {streak === 1 ? 'Day' : 'Days'}
          </div>
          <p className="text-[11px] text-gray-500 mt-1">Consistent study momentum</p>
        </div>

        <div className="p-5 rounded-xl bg-[#12151e] border border-[#1e2230]">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Focus Time</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{totalStudyHours}h</div>
          <p className="text-[11px] text-gray-500 mt-1">
            {studyLogs.length} logged sessions
          </p>
        </div>

        <div className="p-5 rounded-xl bg-[#12151e] border border-[#1e2230]">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Topics Mastered</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">
            {completedTopicsCount} / {allTopicsCount}
          </div>
          <p className="text-[11px] text-gray-500 mt-1">
            {allTopicsCount > 0
              ? `${Math.round((completedTopicsCount / allTopicsCount) * 100)}% coverage`
              : '0% coverage'}
          </p>
        </div>

        <div className="p-5 rounded-xl bg-[#12151e] border border-[#1e2230]">
          <div className="flex items-center justify-between text-gray-400 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Courses</span>
            <BookOpen className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white">{subjects.length}</div>
          <p className="text-[11px] text-gray-500 mt-1">With scheduled exams</p>
        </div>
      </div>

      {/* Subject-Wise Mastery Progress */}
      <section className="p-6 rounded-xl bg-[#12151e] border border-[#1e2230]">
        <h3 className="text-base font-bold text-white tracking-tight mb-4 flex items-center gap-2">
          <BarChart2 className="w-4 h-4 text-indigo-400" />
          Syllabus Coverage by Subject
        </h3>

        {subjectProgress.length === 0 ? (
          <p className="text-xs text-gray-500 py-6 text-center">
            No subjects added yet. Add courses to view your progress analytics.
          </p>
        ) : (
          <div className="space-y-5">
            {subjectProgress.map((subj) => (
              <div key={subj.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: subj.color || '#6366f1' }}
                    />
                    <span className="font-semibold text-white">{subj.name}</span>
                    {subj.code && <span className="text-gray-500 font-mono">({subj.code})</span>}
                  </div>
                  <div className="text-gray-400 font-mono">
                    {subj.completedHours}h / {subj.totalHoursRequired}h ({subj.percent}%)
                  </div>
                </div>

                <div className="w-full h-2.5 bg-[#171b26] rounded-full overflow-hidden border border-[#1e2230]">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${subj.percent}%`,
                      backgroundColor: subj.color || '#6366f1',
                    }}
                  />
                </div>

                <div className="flex justify-between text-[11px] text-gray-500">
                  <span>
                    {subj.completedTopics} of {subj.totalTopics} topics completed
                  </span>
                  <span>Exam: {subj.examDate}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Recent Study Session History */}
      <section className="p-6 rounded-xl bg-[#12151e] border border-[#1e2230]">
        <h3 className="text-base font-bold text-white tracking-tight mb-4 flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          Recent Focus Sessions
        </h3>

        {studyLogs.length === 0 ? (
          <p className="text-xs text-gray-500 py-6 text-center">
            No focus sessions logged yet. Start the Pomodoro timer to build your log!
          </p>
        ) : (
          <div className="space-y-2.5">
            {studyLogs.slice(0, 8).map((log) => (
              <div
                key={log.id}
                className="p-3 rounded-lg bg-[#171b26] border border-[#1e2230] flex items-center justify-between text-xs"
              >
                <div>
                  <h4 className="font-semibold text-white">{log.topicName}</h4>
                  <p className="text-[11px] text-gray-400">{log.subjectName}</p>
                </div>
                <div className="text-right">
                  <span className="font-mono font-semibold text-indigo-400">
                    +{log.durationMinutes}m
                  </span>
                  <p className="text-[10px] text-gray-500">
                    {new Date(log.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Danger Zone: Reset Data */}
      <div className="pt-6 border-t border-[#1e2230] flex justify-end">
        <button
          onClick={() => {
            if (confirm('Are you sure you want to clear all subjects, schedules, and analytics?')) {
              onResetData();
            }
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-rose-400 hover:text-white hover:bg-rose-600/20 border border-rose-500/20 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset All Data
        </button>
      </div>
    </div>
  );
};
