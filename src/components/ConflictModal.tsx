import React from 'react';
import { AlertTriangle, TrendingUp, X } from 'lucide-react';

interface ConflictModalProps {
  isOpen: boolean;
  onClose: () => void;
  conflict: {
    subjectName: string;
    requiredHours: number;
    availableHours: number;
    deficitHours: number;
  };
  currentDailyHours: number;
  onUpdateDailyHours: (newHours: number) => void;
}

export const ConflictModal: React.FC<ConflictModalProps> = ({
  isOpen,
  onClose,
  conflict,
  currentDailyHours,
  onUpdateDailyHours,
}) => {
  if (!isOpen) return null;

  const suggestedHours = Number(
    (currentDailyHours + conflict.deficitHours / 5).toFixed(1)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-[#12151e] border border-amber-300 dark:border-amber-500/40 rounded-3xl p-6 shadow-2xl transition-colors">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                Workload Capacity Warning
              </h3>
              <p className="text-xs text-slate-500 dark:text-gray-400">
                {conflict.subjectName} schedule deficit
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1e2230] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Deficit breakdown */}
        <div className="bg-slate-50 dark:bg-[#171b26] p-4 rounded-2xl border border-slate-200 dark:border-[#1e2230] space-y-2 mb-4 text-xs">
          <div className="flex justify-between text-slate-600 dark:text-gray-300">
            <span>Required syllabus workload:</span>
            <span className="font-mono font-bold text-slate-900 dark:text-white">{conflict.requiredHours}h</span>
          </div>
          <div className="flex justify-between text-slate-600 dark:text-gray-300">
            <span>Calendar hours before exam:</span>
            <span className="font-mono text-slate-700 dark:text-gray-300">{conflict.availableHours}h</span>
          </div>
          <div className="flex justify-between text-rose-600 dark:text-rose-400 font-bold border-t border-slate-200 dark:border-[#1e2230] pt-1.5">
            <span>Unscheduled Deficit:</span>
            <span className="font-mono">-{conflict.deficitHours}h</span>
          </div>
        </div>

        <p className="text-xs text-slate-600 dark:text-gray-300 mb-5 leading-relaxed">
          At your current limit of <strong className="text-slate-900 dark:text-white">{currentDailyHours}h/day</strong>, the full syllabus cannot be completed before the exam date. We recommend adjusting your pace to stay on track.
        </p>

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={() => {
              onUpdateDailyHours(suggestedHours);
              onClose();
            }}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all"
          >
            <TrendingUp className="w-4 h-4" />
            <span>Increase Study Limit to {suggestedHours}h / day</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#171b26] dark:hover:bg-[#1e2230] text-slate-700 dark:text-gray-300 text-xs font-semibold transition-colors"
          >
            Keep Current Plan & Prioritize High Difficulty
          </button>
        </div>
      </div>
    </div>
  );
};
