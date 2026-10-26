import React from 'react';
import { FileText, Sun, Moon, Zap } from 'lucide-react';

interface TopNavProps {
  onLoadSample: () => void;
  onOpenSyllabusModal: () => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  onLoadSample,
  onOpenSyllabusModal,
  isDarkMode,
  onToggleTheme,
}) => {
  const now = new Date();
  const dateFormatted = now.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const hour = now.getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className={`pb-6 mb-7 border-b ${isDarkMode ? 'border-[rgba(217,234,224,0.12)]' : 'border-slate-200'}`}>
      {/* Eyebrow topline */}
      <div className="flex items-center justify-between mb-3 text-[10px] font-mono tracking-widest uppercase">
        <div className="flex items-center gap-2.5">
          <span className="live-pip" />
          <span className={isDarkMode ? 'text-[#82918c]' : 'text-slate-500'}>
            STUDY INTELLIGENCE &bull; ADAPTIVE REBALANCE ENGINE
          </span>
        </div>

        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1.5 ${isDarkMode ? 'text-[#82918c]' : 'text-slate-500'}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${isDarkMode ? 'bg-[#abf5c0]' : 'bg-emerald-500'}`} />
            <span>Synced &bull; {dateFormatted}</span>
          </div>
        </div>
      </div>

      {/* Main Header & Actions Row */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1
            className={`text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight ${
              isDarkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            {greeting}, <span className={isDarkMode ? 'text-[#abf5c0]' : 'text-emerald-700'}>Student</span>
          </h1>
          <p className={`text-xs mt-1 max-w-xl leading-relaxed ${isDarkMode ? 'text-[#82918c]' : 'text-slate-600'}`}>
            FocusFlow dynamically budgets your syllabus topics before exam dates and recalculates workload instantly when sessions are missed.
          </p>
        </div>

        {/* Action Buttons (PayRevive Style) */}
        <div className="flex items-center gap-2.5 flex-wrap">
          {/* Quick Demo Preload Pill */}
          <button
            onClick={onLoadSample}
            className={`flex items-center gap-1.5 px-3 py-2 rounded text-xs font-mono font-medium border transition-all ${
              isDarkMode
                ? 'border-[rgba(217,234,224,0.15)] bg-[#171c1b] text-[#e5eee8] hover:border-[#abf5c0]/50'
                : 'border-slate-300 bg-white text-slate-700 hover:border-slate-400 shadow-sm'
            }`}
            title="Preload sample college courses (CS, Chemistry, Math)"
          >
            <Zap className={`w-3.5 h-3.5 ${isDarkMode ? 'text-amber-400' : 'text-amber-600'}`} />
            <span>Demo Plan</span>
          </button>

          {/* Primary Action Button: Ingest Syllabus (PayRevive Mint Signature Button) */}
          <button
            onClick={onOpenSyllabusModal}
            className={`flex items-center gap-2 px-4 py-2 rounded text-xs font-bold transition-all shadow-md hover:-translate-y-0.5 active:translate-y-0 ${
              isDarkMode
                ? 'bg-[#abf5c0] hover:bg-[#cdfad8] text-[#0b0d0d] shadow-[0_6px_25px_rgba(171,245,192,0.18)]'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
            }`}
          >
            <FileText className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Ingest Syllabus (PDF/TXT)</span>
          </button>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            className={`p-2 rounded border transition-colors ${
              isDarkMode
                ? 'border-[rgba(217,234,224,0.15)] bg-[#171c1b] text-[#e5eee8] hover:border-[#abf5c0]/50'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 shadow-sm'
            }`}
            title={isDarkMode ? 'Switch to Day Mode' : 'Switch to Night Mode'}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
