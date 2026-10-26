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
    <div className="rounded-xl p-4 bg-[#121616] dark:bg-[#121616] border border-[#abf5c0]/30 dark:border-[#abf5c0]/30 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fade-in transition-colors">
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-lg bg-[#171c1b] text-[#abf5c0] border border-[#abf5c0]/20 flex-shrink-0">
          <Sparkles className="w-5 h-5 animate-pulse" />
        </div>
        <div>
          <h3 className="text-sm font-extrabold text-white flex items-center gap-1.5 font-sans">
            Adaptive Rebalance Ready
            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-[#171c1b] text-[#abf5c0] border border-[#abf5c0]/30 font-bold uppercase">
              Autonomous Policy
            </span>
          </h3>
          <p className="text-xs text-[#82918c] mt-0.5 max-w-xl leading-relaxed">
            Missed a study block? FocusFlow AI can recalculate future days based on exam proximity and difficulty, keeping you on track without overloading daily limits.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 self-end sm:self-center">
        <button
          onClick={onDismiss}
          className="p-1.5 rounded-lg text-[#82918c] hover:text-white hover:bg-white/10 transition-colors"
          title="Dismiss banner"
        >
          <X className="w-4 h-4" />
        </button>

        <button
          onClick={onRebalance}
          className="flex items-center gap-2 px-4 py-2 rounded text-xs font-mono font-bold bg-[#abf5c0] hover:bg-[#cdfad8] text-[#0b0d0d] shadow-[0_6px_25px_rgba(171,245,192,0.2)] transition-all hover:-translate-y-0.5 active:translate-y-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Execute Rebalance</span>
        </button>
      </div>
    </div>
  );
};
