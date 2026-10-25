import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  CheckSquare,
  BookOpen,
  Folder,
  Sparkles,
  Plus,
  UploadCloud,
  BarChart3,
} from 'lucide-react';

interface SidebarProps {
  activeTab: 'today' | 'planly' | 'schedule' | 'tasks' | 'courses' | 'materials';
  setActiveTab: (tab: 'today' | 'planly' | 'schedule' | 'tasks' | 'courses' | 'materials') => void;
  pendingTasksCount: number;
  coursesCount: number;
  isDarkMode: boolean;
  onOpenNewSubject: () => void;
  onOpenSyllabusModal: () => void;
  onOpenWizard: () => void;
  onLoadSample: () => void;
  dailyCapacity: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  pendingTasksCount,
  coursesCount,
  isDarkMode,
  onOpenNewSubject,
  onOpenSyllabusModal,
  onOpenWizard,
  onLoadSample,
  dailyCapacity,
}) => {
  return (
    <aside
      className={`w-64 flex-shrink-0 flex flex-col justify-between border-r transition-colors duration-200 select-none ${
        isDarkMode
          ? 'bg-[#0e111a] border-[#1e2230] text-gray-300'
          : 'bg-[#fafbfc] border-slate-200 text-slate-700'
      }`}
    >
      {/* Top Brand & Navigation */}
      <div className="p-5">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 mb-7 px-1">
          <div className="w-9 h-9 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 flex items-center justify-center font-black tracking-tighter text-sm shadow-md">
            FF
          </div>
          <div>
            <span className="font-black text-base tracking-tight text-slate-900 dark:text-white block leading-none">
              FOCUSFLOW
            </span>
            <span className="text-[10px] text-slate-400 dark:text-gray-400 font-semibold tracking-wider uppercase mt-1 block">
              STUDENT PLANNER
            </span>
          </div>
        </div>

        {/* MAIN Section */}
        <div className="mb-6">
          <span className="text-[10px] font-bold tracking-wider text-slate-400 dark:text-gray-500 uppercase block px-3 mb-2">
            MAIN MENU
          </span>
          <nav className="space-y-1">
            {/* Dashboard */}
            <button
              onClick={() => setActiveTab('today')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'today'
                  ? isDarkMode
                    ? 'bg-[#1a1f2c] text-white shadow-sm border border-[#2e354a]'
                    : 'bg-white text-slate-900 shadow-sm border border-slate-200 font-bold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-slate-100 dark:hover:bg-[#151924]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4 text-indigo-500" />
                <span>Dashboard</span>
              </div>
            </button>

            {/* Import Syllabus Action */}
            <button
              onClick={onOpenSyllabusModal}
              className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-slate-100 dark:hover:bg-[#151924] transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <UploadCloud className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                <span>Import Syllabus</span>
              </div>
              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400">
                PDF/TXT
              </span>
            </button>

            {/* Planly TUF Roadmap View */}
            <button
              onClick={() => setActiveTab('planly')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'planly'
                  ? isDarkMode
                    ? 'bg-[#1a1f2c] text-white shadow-sm border border-[#2e354a]'
                    : 'bg-white text-slate-900 shadow-sm border border-slate-200 font-bold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-slate-100 dark:hover:bg-[#151924]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <span>Planly Roadmap</span>
              </div>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-extrabold shadow-sm">
                TUF
              </span>
            </button>

            {/* Schedule */}
            <button
              onClick={() => setActiveTab('schedule')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'schedule'
                  ? isDarkMode
                    ? 'bg-[#1a1f2c] text-white shadow-sm border border-[#2e354a]'
                    : 'bg-white text-slate-900 shadow-sm border border-slate-200 font-bold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-slate-100 dark:hover:bg-[#151924]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-indigo-500" />
                <span>Study Schedule</span>
              </div>
            </button>

            {/* Tasks / Assignments */}
            <button
              onClick={() => setActiveTab('tasks')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'tasks'
                  ? isDarkMode
                    ? 'bg-[#1a1f2c] text-white shadow-sm border border-[#2e354a]'
                    : 'bg-white text-slate-900 shadow-sm border border-slate-200 font-bold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-slate-100 dark:hover:bg-[#151924]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CheckSquare className="w-4 h-4 text-indigo-500" />
                <span>Assignments</span>
              </div>
              {pendingTasksCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-[10px] font-bold flex items-center justify-center">
                  {pendingTasksCount}
                </span>
              )}
            </button>

            {/* Courses & Syllabi */}
            <button
              onClick={() => setActiveTab('courses')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'courses'
                  ? isDarkMode
                    ? 'bg-[#1a1f2c] text-white shadow-sm border border-[#2e354a]'
                    : 'bg-white text-slate-900 shadow-sm border border-slate-200 font-bold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-slate-100 dark:hover:bg-[#151924]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-indigo-500" />
                <span>Courses</span>
              </div>
              <span className="text-[11px] font-semibold text-slate-400 dark:text-gray-400">{coursesCount}</span>
            </button>
          </nav>
        </div>

        {/* WORKSPACE Section */}
        <div className="mb-6">
          <span className="text-[10px] font-bold tracking-wider text-slate-400 dark:text-gray-500 uppercase block px-3 mb-2">
            TOOLS
          </span>
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('materials')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'materials'
                  ? isDarkMode
                    ? 'bg-[#1a1f2c] text-white shadow-sm border border-[#2e354a]'
                    : 'bg-white text-slate-900 shadow-sm border border-slate-200 font-bold'
                  : 'text-slate-600 hover:text-slate-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-slate-100 dark:hover:bg-[#151924]'
              }`}
            >
              <BarChart3 className="w-4 h-4 text-indigo-500" />
              <span>Progress & Analytics</span>
            </button>

            <button
              onClick={onOpenWizard}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-slate-100 dark:hover:bg-[#151924] transition-colors"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Setup Wizard</span>
            </button>

            <button
              onClick={onLoadSample}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-600 hover:text-slate-900 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-slate-100 dark:hover:bg-[#151924] transition-colors"
            >
              <Folder className="w-4 h-4 text-emerald-500" />
              <span>Preload Demo Data</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Bottom Profile & Capacity Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-[#1e2230]">
        <div className="flex items-center justify-between p-2.5 rounded-2xl bg-white dark:bg-[#151924] border border-slate-200 dark:border-[#1e2230] shadow-sm">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 font-bold text-xs flex items-center justify-center flex-shrink-0">
              ST
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-slate-900 dark:text-white truncate block leading-tight">
                Student
              </span>
              <span className="text-[10px] text-slate-500 dark:text-gray-400 truncate block">
                Cap: {dailyCapacity}h / day
              </span>
            </div>
          </div>
          <button
            onClick={onOpenNewSubject}
            className="p-1.5 rounded-lg bg-slate-100 dark:bg-[#1a1f2c] text-slate-600 dark:text-gray-300 hover:bg-indigo-500 hover:text-white transition-colors"
            title="Add Course"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
