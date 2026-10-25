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
  const inactiveBtnClass = isDarkMode
    ? 'text-gray-400 hover:text-gray-200 hover:bg-[#151924]'
    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100';

  const activeBtnClass = isDarkMode
    ? 'bg-[#1a1f2c] text-white shadow-sm border border-[#2e354a]'
    : 'bg-white text-slate-900 shadow-sm border border-slate-200 font-bold';

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
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center font-black tracking-tighter text-sm shadow-md ${
              isDarkMode
                ? 'bg-white text-slate-900'
                : 'bg-slate-900 text-white'
            }`}
          >
            FF
          </div>
          <div>
            <span
              className={`font-black text-base tracking-tight block leading-none ${
                isDarkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              FOCUSFLOW
            </span>
            <span
              className={`text-[10px] font-semibold tracking-wider uppercase mt-1 block ${
                isDarkMode ? 'text-gray-400' : 'text-slate-500'
              }`}
            >
              STUDENT PLANNER
            </span>
          </div>
        </div>

        {/* MAIN Section */}
        <div className="mb-6">
          <span
            className={`text-[10px] font-bold tracking-wider uppercase block px-3 mb-2 ${
              isDarkMode ? 'text-gray-500' : 'text-slate-400'
            }`}
          >
            MAIN MENU
          </span>
          <nav className="space-y-1">
            {/* Dashboard */}
            <button
              onClick={() => setActiveTab('today')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'today' ? activeBtnClass : inactiveBtnClass
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
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all group ${inactiveBtnClass}`}
            >
              <div className="flex items-center gap-2.5">
                <UploadCloud className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                <span>Import Syllabus</span>
              </div>
              <span
                className={`text-[9px] font-mono font-bold px-1.5 py-0.5 rounded ${
                  isDarkMode
                    ? 'bg-emerald-950/60 text-emerald-400'
                    : 'bg-emerald-100 text-emerald-700'
                }`}
              >
                PDF/TXT
              </span>
            </button>

            {/* Planly TUF Roadmap View */}
            <button
              onClick={() => setActiveTab('planly')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'planly' ? activeBtnClass : inactiveBtnClass
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
                activeTab === 'schedule' ? activeBtnClass : inactiveBtnClass
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
                activeTab === 'tasks' ? activeBtnClass : inactiveBtnClass
              }`}
            >
              <div className="flex items-center gap-2.5">
                <CheckSquare className="w-4 h-4 text-indigo-500" />
                <span>Assignments</span>
              </div>
              {pendingTasksCount > 0 && (
                <span
                  className={`w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center ${
                    isDarkMode ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'
                  }`}
                >
                  {pendingTasksCount}
                </span>
              )}
            </button>

            {/* Courses & Syllabi */}
            <button
              onClick={() => setActiveTab('courses')}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'courses' ? activeBtnClass : inactiveBtnClass
              }`}
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 text-indigo-500" />
                <span>Courses</span>
              </div>
              <span
                className={`text-[11px] font-semibold ${
                  isDarkMode ? 'text-gray-400' : 'text-slate-500'
                }`}
              >
                {coursesCount}
              </span>
            </button>
          </nav>
        </div>

        {/* WORKSPACE Section */}
        <div className="mb-6">
          <span
            className={`text-[10px] font-bold tracking-wider uppercase block px-3 mb-2 ${
              isDarkMode ? 'text-gray-500' : 'text-slate-400'
            }`}
          >
            TOOLS
          </span>
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('materials')}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'materials' ? activeBtnClass : inactiveBtnClass
              }`}
            >
              <BarChart3 className="w-4 h-4 text-indigo-500" />
              <span>Progress & Analytics</span>
            </button>

            <button
              onClick={onOpenWizard}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${inactiveBtnClass}`}
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Setup Wizard</span>
            </button>

            <button
              onClick={onLoadSample}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium transition-colors ${inactiveBtnClass}`}
            >
              <Folder className="w-4 h-4 text-emerald-500" />
              <span>Preload Demo Data</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Bottom Profile & Capacity Footer */}
      <div className={`p-4 border-t ${isDarkMode ? 'border-[#1e2230]' : 'border-slate-200'}`}>
        <div
          className={`flex items-center justify-between p-2.5 rounded-2xl border shadow-sm transition-colors ${
            isDarkMode
              ? 'bg-[#151924] border-[#1e2230]'
              : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className={`w-8 h-8 rounded-xl font-bold text-xs flex items-center justify-center flex-shrink-0 ${
                isDarkMode
                  ? 'bg-indigo-900/50 text-indigo-300'
                  : 'bg-indigo-100 text-indigo-700'
              }`}
            >
              ST
            </div>
            <div className="min-w-0">
              <span
                className={`text-xs font-bold truncate block leading-tight ${
                  isDarkMode ? 'text-white' : 'text-slate-900'
                }`}
              >
                Student
              </span>
              <span
                className={`text-[10px] truncate block ${
                  isDarkMode ? 'text-gray-400' : 'text-slate-500'
                }`}
              >
                Cap: {dailyCapacity}h / day
              </span>
            </div>
          </div>
          <button
            onClick={onOpenNewSubject}
            className={`p-1.5 rounded-lg transition-colors ${
              isDarkMode
                ? 'bg-[#1a1f2c] text-gray-300 hover:bg-indigo-500 hover:text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-indigo-500 hover:text-white'
            }`}
            title="Add Course"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </aside>
  );
};
