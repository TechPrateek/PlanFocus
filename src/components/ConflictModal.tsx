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
    (currentDailyHours + (conflict.deficitHours / 5)).toFixed(1)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#12151e] border border-amber-500/40 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Workload Capacity Warning
              </h3>
              <p className="text-xs text-gray-400">
                {conflict.subjectName} schedule deficit
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#1e2230] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Deficit breakdown */}
        <div className="bg-[#171b26] p-4 rounded-xl border border-[#1e2230] space-y-2 mb-4 text-xs">
          <div className="flex justify-between text-gray-300">
            <span>Required syllabus workload:</span>
            <span className="font-mono font-bold text-white">{conflict.requiredHours}h</span>
          </div>
          <div className="flex justify-between text-gray-300">
            <span>Available hours before exam:</span>
            <span className="font-mono text-gray-400">{conflict.availableHours}h</span>
          </div>
          <div className="pt-2 border-t border-[#1e2230] flex justify-between font-semibold">
            <span className="text-amber-400">Estimated capacity deficit:</span>
            <span className="font-mono text-rose-400 font-bold">-{conflict.deficitHours}h</span>
          </div>
        </div>

        <p className="text-xs text-gray-400 leading-relaxed mb-6">
          At your current study rate of <strong className="text-white">{currentDailyHours}h/day</strong>, the full syllabus cannot fit before the exam date without adjusting pace.
        </p>

        {/* Actionable Remedies */}
        <div className="space-y-3">
          <button
            onClick={() => {
              onUpdateDailyHours(suggestedHours);
              onClose();
            }}
            className="w-full flex items-center justify-between p-3 rounded-xl bg-indigo-600/20 border border-indigo-500/40 hover:bg-indigo-600/30 text-indigo-200 text-xs font-semibold transition-all group"
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-400" />
              <span>Increase study capacity to {suggestedHours}h/day</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-indigo-600 text-white text-[10px]">
              Apply
            </span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#171b26] border border-[#1e2230] hover:bg-[#1e2230] text-gray-400 hover:text-white text-xs font-medium transition-colors"
          >
            I'll prioritize hard topics first
          </button>
        </div>
      </div>
    </div>
  );
};
