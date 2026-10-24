import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  CheckSquare,
  BookOpen,
  FileText,
  Folder,
  Sparkles,
  Plus,
  Moon,
  Sun,
} from 'lucide-react';

interface SidebarProps {
  activeTab: 'today' | 'schedule' | 'tasks' | 'courses' | 'materials';
  setActiveTab: (tab: 'today' | 'schedule' | 'tasks' | 'courses' | 'materials') => void;
  pendingTasksCount: number;
  coursesCount: number;
  isDarkMode: boolean;
  onToggleTheme: () => void;
  onOpenNewSubject: () => void;
  onOpenWizard: () => void;
  onLoadSample: () => void;
  onOpenPlanlyModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  pendingTasksCount,
  coursesCount,
  isDarkMode,
  onToggleTheme,
  onOpenNewSubject,
  onOpenWizard,
  onLoadSample,
  onOpenPlanlyModal,
}) => {
  return (
    <aside
      className={`w-64 flex-shrink-0 flex flex-col justify-between border-r transition-colors duration-200 select-none ${
        isDarkMode
          ? 'bg-[#0e111a] border-[#1e2230] text-gray-300'
          : 'bg-[#fafbfc] border-gray-200 text-gray-700'
      }`}
    >
      {/* Top Brand & Navigation */}
      <div className="p-5">
        {/* Brand Logo */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-black tracking-tighter text-sm shadow-sm">
              FF
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-gray-900 dark:text-white block leading-none">
                FOCUSFLOW.
              </span>
              <span className="text-[10px] text-gray-400 font-medium tracking-wide">
                STUDENT PLANNER
              </span>
            </div>
          </div>

          {/* Theme Toggle */}
          <button
            onClick={onToggleTheme}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-[#1a1f2c] transition-colors"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-gray-600" />}
          </button>
        </div>

        {/* MAIN Section */}
        <div className="mb-6">
          <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase block px-3 mb-2">
            MAIN
          </span>
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('today')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'today'
                  ? isDarkMode
                    ? 'bg-[#1a1f2c] text-white shadow-sm'
                    : 'bg-white text-gray-900 shadow-sm border border-gray-200/80'
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100/70 dark:hover:bg-[#151924]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4 text-indigo-500" />
                <span>Dashboard</span>
              </div>
            </button>

            {/* Planly TUF Roadmap Generator Button */}
            <button
              onClick={onOpenPlanlyModal}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-indigo-500/10 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 hover:border-indigo-500 transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-indigo-500 group-hover:rotate-12 transition-transform" />
                <span>Planly SDE Track</span>
              </div>
              <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-indigo-500 text-white font-bold">
                TUF
              </span>
            </button>

            <button
              onClick={() => setActiveTab('schedule')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'schedule'
                  ? isDarkMode
                    ? 'bg-[#1a1f2c] text-white shadow-sm'
                    : 'bg-white text-gray-900 shadow-sm border border-gray-200/80'
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100/70 dark:hover:bg-[#151924]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-indigo-500" />
                <span>Schedule</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('tasks')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'tasks'
                  ? isDarkMode
                    ? 'bg-[#1a1f2c] text-white shadow-sm'
                    : 'bg-white text-gray-900 shadow-sm border border-gray-200/80'
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100/70 dark:hover:bg-[#151924]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CheckSquare className="w-4 h-4 text-indigo-500" />
                <span>Assignments</span>
              </div>
              {pendingTasksCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-black text-white dark:bg-white dark:text-black text-[10px] font-bold flex items-center justify-center">
                  {pendingTasksCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('courses')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'courses'
                  ? isDarkMode
                    ? 'bg-[#1a1f2c] text-white shadow-sm'
                    : 'bg-white text-gray-900 shadow-sm border border-gray-200/80'
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100/70 dark:hover:bg-[#151924]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-indigo-500" />
                <span>Courses</span>
              </div>
              <span className="text-[11px] font-medium text-gray-400">{coursesCount}</span>
            </button>
          </nav>
        </div>

        {/* WORKSPACE Section */}
        <div className="mb-6">
          <span className="text-[10px] font-bold tracking-wider text-gray-400 uppercase block px-3 mb-2">
            WORKSPACE
          </span>
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('materials')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'materials'
                  ? isDarkMode
                    ? 'bg-[#1a1f2c] text-white shadow-sm'
                    : 'bg-white text-gray-900 shadow-sm border border-gray-200/80'
                  : 'text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100/70 dark:hover:bg-[#151924]'
              }`}
            >
              <FileText className="w-4 h-4 text-indigo-500" />
              <span>Notes & Docs</span>
            </button>

            <button
              onClick={onOpenWizard}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100/70 dark:hover:bg-[#151924] transition-colors"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Setup Wizard</span>
            </button>

            <button
              onClick={onLoadSample}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-gray-500 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100/70 dark:hover:bg-[#151924] transition-colors"
            >
              <Folder className="w-4 h-4 text-emerald-500" />
              <span>Load Sample Plan</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Bottom Profile Footer */}
      <div className="p-4 border-t border-gray-200/80 dark:border-[#1e2230]">
        <div className="flex items-center justify-between p-2 rounded-xl bg-white dark:bg-[#151924] border border-gray-200/80 dark:border-[#1e2230] shadow-sm">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center flex-shrink-0">
              ST
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-gray-900 dark:text-white truncate block leading-tight">
                Student Profile
              </span>
              <span className="text-[10px] text-gray-400 truncate block">
                Computer Science
              </span>
            </div>
          </div>
          <button
            onClick={onOpenNewSubject}
            className="p-1.5 rounded-lg bg-gray-100 dark:bg-[#1a1f2c] text-gray-600 dark:text-gray-300 hover:bg-indigo-500 hover:text-white transition-colors"
            title="Add Course"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
