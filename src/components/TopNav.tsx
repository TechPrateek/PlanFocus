import React from 'react';
import { Search, Bell, Sparkles } from 'lucide-react';

interface TopNavProps {
  onLoadSample: () => void;
  isDarkMode: boolean;
}

export const TopNav: React.FC<TopNavProps> = ({ onLoadSample, isDarkMode }) => {
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
      {/* Left: Date & Greeting */}
      <div>
        <p className="text-xs font-medium text-gray-400 mb-0.5">{dateFormatted}</p>
        <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
          {greeting}, Student
        </h1>
      </div>

      {/* Right: Search box (⌘K) & Notification Bell & Demo Load */}
      <div className="flex items-center gap-3">
        {/* Search bar */}
        <div
          className={`flex items-center gap-2 px-3 py-2 rounded-2xl border text-xs shadow-sm transition-colors cursor-pointer ${
            isDarkMode
              ? 'bg-[#12151e] border-[#1e2230] text-gray-300 hover:border-gray-700'
              : 'bg-white border-gray-200/90 text-gray-600 hover:border-gray-300'
          }`}
        >
          <Search className="w-3.5 h-3.5 text-gray-400" />
          <span className="hidden md:inline text-gray-400">Ask your study materials...</span>
          <span className="md:hidden text-gray-400">Search...</span>
          <kbd className="hidden md:inline-flex items-center gap-0.5 text-[10px] font-mono font-medium px-1.5 py-0.5 rounded bg-gray-100 dark:bg-[#1a1f2c] border border-gray-200 dark:border-gray-700 text-gray-400">
            ⌘ K
          </kbd>
        </div>

        {/* Demo Data button for judges */}
        <button
          onClick={onLoadSample}
          className="flex items-center gap-1.5 px-3 py-2 rounded-2xl text-xs font-semibold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800/60 hover:bg-indigo-100 transition-colors shadow-sm"
          title="Quickly preload demo courses for hackathon evaluation"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Load Demo Data</span>
        </button>

        {/* Notification Bell */}
        <div
          className={`p-2 rounded-2xl border shadow-sm relative text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer ${
            isDarkMode
              ? 'bg-[#12151e] border-[#1e2230]'
              : 'bg-white border-gray-200/90'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-[#12151e]" />
        </div>
      </div>
    </div>
  );
};
