import React from 'react';
import { RefreshCw, Sparkles, X } from 'lucide-react';

interface RebalanceBannerProps {
  onRebalance: () => void;
  onDismiss: () => void;
}

export const RebalanceBanner: React.FC<RebalanceBannerProps> = ({
  onRebalance,
  onDismiss,
}) => {
  return (
    <div className="rounded-xl p-4 bg-gradient-to-r from-indigo-950/80 via-[#171b26] to-indigo-950/80 border border-indigo-500/40 shadow-lg shadow-indigo-950/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 flex-shrink-0">
          <Sparkles className="w-5 h-5 animate-spin" style={{ animationDuration: '6s' }} />
        </div>
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
            Adaptive Rebalance Available
            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-medium">
              Zero Guilt
            </span>
          </h3>
          <p className="text-xs text-gray-300 mt-0.5 max-w-xl leading-relaxed">
            Missed a study block? FocusFlow AI can recalculate future days based on exam proximity and difficulty, keeping you on track without overloading your daily hours.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center">
        <button
          onClick={onDismiss}
          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#1e2230] transition-colors"
          title="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>

        <button
          onClick={onRebalance}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-all hover:scale-105"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Rebalance Plan
        </button>
      </div>
    </div>
  );
};
