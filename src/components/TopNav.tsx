import React from 'react';
import { Search, Bell, Sparkles, FileText, Sun, Moon } from 'lucide-react';

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
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const hour = now.getHours();
  const greeting =
    hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      {/* Left: Date & Greeting with strict contrast */}
      <div>
        <p className={`text-xs font-semibold mb-0.5 tracking-wide ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
          {dateFormatted}
        </p>
        <h1 className={`text-2xl font-black tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
          {greeting}, Student
        </h1>
      </div>

      {/* Right: Search, Import Syllabus, Theme Toggle, Demo Load */}
      <div className="flex items-center gap-2.5 flex-wrap">
        {/* Search bar */}
        <div
          className={`flex items-center gap-2 px-3.5 py-2 rounded-2xl border text-xs shadow-sm transition-colors cursor-pointer ${
            isDarkMode
              ? 'bg-[#12151e] border-[#1e2230] text-gray-300 hover:border-gray-700'
              : 'bg-white border-slate-200 text-slate-700 hover:border-slate-300'
          }`}
        >
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <span className="hidden md:inline text-slate-400 font-medium">Ask study notes...</span>
          <span className="md:hidden text-slate-400 font-medium">Search...</span>
          <kbd
            className={`hidden md:inline-flex items-center gap-0.5 text-[10px] font-mono font-medium px-1.5 py-0.5 rounded border ${
              isDarkMode
                ? 'bg-[#1a1f2c] border-gray-700 text-gray-400'
                : 'bg-slate-100 border-slate-200 text-slate-500'
            }`}
          >
            ⌘ K
          </kbd>
        </div>

        {/* Primary Action: Import Syllabus (PDF / TXT) */}
        <button
          onClick={onOpenSyllabusModal}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-600/20 transition-all hover:scale-[1.02]"
          title="Import syllabus from PDF, TXT or paste course topics"
        >
          <FileText className="w-3.5 h-3.5" />
          <span>Import Syllabus</span>
        </button>

        {/* Quick Demo Plan Button */}
        <button
          onClick={onLoadSample}
          className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-semibold border shadow-sm transition-colors ${
            isDarkMode
              ? 'bg-[#12151e] border-[#1e2230] text-slate-300 hover:bg-[#171b26]'
              : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
          title="Preload sample college courses (CS, Chemistry, Math)"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span className="hidden sm:inline">Demo Plan</span>
        </button>

        {/* Theme Toggle (Day / Night mode) */}
        <button
          onClick={onToggleTheme}
          className={`p-2 rounded-2xl border shadow-sm transition-colors ${
            isDarkMode
              ? 'bg-[#12151e] border-[#1e2230] text-slate-300 hover:text-white'
              : 'bg-white border-slate-200 text-slate-700 hover:text-slate-900'
          }`}
          title={isDarkMode ? 'Switch to Day (Light) Mode' : 'Switch to Night (Dark) Mode'}
        >
          {isDarkMode ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700" />
          )}
        </button>

        {/* Notification Bell */}
        <div
          className={`p-2 rounded-2xl border shadow-sm relative cursor-pointer transition-colors ${
            isDarkMode
              ? 'bg-[#12151e] border-[#1e2230] text-slate-400 hover:text-white'
              : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span
            className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ${
              isDarkMode ? 'ring-[#12151e]' : 'ring-white'
            }`}
          />
        </div>
      </div>
    </div>
  );
};
