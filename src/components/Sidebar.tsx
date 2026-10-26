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
  Layers,
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
  const getNavItemClass = (tab: typeof activeTab) => {
    const isActive = activeTab === tab;
    if (isActive) {
      return isDarkMode
        ? 'text-[#abf5c0] bg-gradient-to-r from-[rgba(171,245,192,0.14)] to-transparent border-l-2 border-[#abf5c0] font-bold'
        : 'text-emerald-800 bg-gradient-to-r from-emerald-500/15 to-transparent border-l-2 border-emerald-600 font-bold';
    }
    return isDarkMode
      ? 'text-[#82918c] hover:text-[#e5eee8] hover:bg-white/[0.04]'
      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100';
  };

  return (
    <aside
      className={`w-60 flex-shrink-0 flex flex-col justify-between border-r transition-colors duration-200 select-none ${
        isDarkMode
          ? 'bg-[#0b0d0d]/90 backdrop-blur-xl border-[rgba(217,234,224,0.12)] text-[#e5eee8]'
          : 'bg-white/95 backdrop-blur-xl border-slate-200 text-slate-800'
      }`}
    >
      {/* Top Brand & Navigation */}
      <div className="p-5">
        {/* Brand Wordmark (PayRevive Serif/Sans Style) */}
        <div className="flex items-center gap-3 mb-8 px-1">
          <div
            className={`w-9 h-9 rounded-xl flex items-center justify-center font-mono font-bold text-xs shadow-md transition-all ${
              isDarkMode
                ? 'bg-[#171c1b] text-[#abf5c0] border border-[rgba(217,234,224,0.15)] ring-1 ring-[#abf5c0]/20'
                : 'bg-emerald-600 text-white shadow-emerald-500/20'
            }`}
          >
            <Layers className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-baseline gap-1 leading-none">
              <span className={`text-base font-extrabold tracking-tight ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                Focus
              </span>
              <span className={`text-base font-serif italic font-bold tracking-tight ${isDarkMode ? 'text-[#abf5c0]' : 'text-emerald-600'}`}>
                Flow
              </span>
            </div>
            <span
              className={`text-[9px] font-mono tracking-wider uppercase block mt-1 ${
                isDarkMode ? 'text-[#82918c]' : 'text-slate-500'
              }`}
            >
              AI Study Intelligence
            </span>
          </div>
        </div>

        {/* COMMAND CENTER Section */}
        <div className="mb-6">
          <span
            className={`text-[9px] font-mono tracking-widest uppercase block px-3 mb-2 font-medium ${
              isDarkMode ? 'text-[#82918c]' : 'text-slate-400'
            }`}
          >
            COMMAND CENTER
          </span>
          <nav className="space-y-1">
            {/* Dashboard / Recovery Feed */}
            <button
              onClick={() => setActiveTab('today')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-all ${getNavItemClass(
                'today'
              )}`}
            >
              <div className="flex items-center gap-2.5">
                <LayoutDashboard className="w-4 h-4 flex-shrink-0" />
                <span className="font-semibold tracking-tight">Today Feed</span>
              </div>
            </button>

            {/* Import Syllabus Action */}
            <button
              onClick={onOpenSyllabusModal}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-all group ${
                isDarkMode
                  ? 'text-[#82918c] hover:text-[#e5eee8] hover:bg-white/[0.04]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <UploadCloud
                  className={`w-4 h-4 flex-shrink-0 transition-transform group-hover:scale-110 ${
                    isDarkMode ? 'text-[#abf5c0]' : 'text-emerald-600'
                  }`}
                />
                <span className="font-semibold tracking-tight">Import Syllabus</span>
              </div>
              <span
                className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                  isDarkMode
                    ? 'bg-[#171c1b] text-[#abf5c0] border border-[#abf5c0]/30'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                PDF/TXT
              </span>
            </button>

            {/* Planly TUF Roadmap */}
            <button
              onClick={() => setActiveTab('planly')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-all ${getNavItemClass(
                'planly'
              )}`}
            >
              <div className="flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 flex-shrink-0" />
                <span className="font-semibold tracking-tight">Planly Roadmap</span>
              </div>
              <span
                className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold ${
                  isDarkMode
                    ? 'bg-[#171c1b] text-[#abf5c0] border border-[#abf5c0]/30'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}
              >
                TUF
              </span>
            </button>

            {/* Schedule */}
            <button
              onClick={() => setActiveTab('schedule')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-all ${getNavItemClass(
                'schedule'
              )}`}
            >
              <div className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span className="font-semibold tracking-tight">Timeline</span>
              </div>
            </button>

            {/* Assignments / Tasks Queue */}
            <button
              onClick={() => setActiveTab('tasks')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-all ${getNavItemClass(
                'tasks'
              )}`}
            >
              <div className="flex items-center gap-2.5">
                <CheckSquare className="w-4 h-4 flex-shrink-0" />
                <span className="font-semibold tracking-tight">Queue</span>
              </div>
              {pendingTasksCount > 0 && (
                <span
                  className={`px-1.5 py-0.5 rounded font-mono text-[9px] font-bold ${
                    isDarkMode
                      ? 'bg-amber-400/10 text-amber-300 border border-amber-400/20'
                      : 'bg-amber-50 text-amber-700 border border-amber-200'
                  }`}
                >
                  {pendingTasksCount}
                </span>
              )}
            </button>

            {/* Courses */}
            <button
              onClick={() => setActiveTab('courses')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs transition-all ${getNavItemClass(
                'courses'
              )}`}
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-4 h-4 flex-shrink-0" />
                <span className="font-semibold tracking-tight">Courses</span>
              </div>
              <span className={`text-[10px] font-mono ${isDarkMode ? 'text-[#82918c]' : 'text-slate-400'}`}>
                {coursesCount}
              </span>
            </button>
          </nav>
        </div>

        {/* WORKSPACE & TOOLS Section */}
        <div className="mb-6">
          <span
            className={`text-[9px] font-mono tracking-widest uppercase block px-3 mb-2 font-medium ${
              isDarkMode ? 'text-[#82918c]' : 'text-slate-400'
            }`}
          >
            TOOLS
          </span>
          <nav className="space-y-1">
            <button
              onClick={() => setActiveTab('materials')}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs transition-all ${getNavItemClass(
                'materials'
              )}`}
            >
              <BarChart3 className="w-4 h-4 flex-shrink-0" />
              <span className="font-semibold tracking-tight">Analytics</span>
            </button>

            <button
              onClick={onOpenWizard}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors ${
                isDarkMode
                  ? 'text-[#82918c] hover:text-[#e5eee8] hover:bg-white/[0.04]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Setup Wizard</span>
            </button>

            <button
              onClick={onLoadSample}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs transition-colors ${
                isDarkMode
                  ? 'text-[#82918c] hover:text-[#e5eee8] hover:bg-white/[0.04]'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Folder className={`w-4 h-4 ${isDarkMode ? 'text-[#abf5c0]' : 'text-emerald-600'}`} />
              <span>Preload Demo Data</span>
            </button>
          </nav>
        </div>
      </div>

      {/* PayRevive-style Bottom Rail Status */}
      <div
        className={`p-4 border-t flex items-center justify-between ${
          isDarkMode
            ? 'border-[rgba(217,234,224,0.12)] bg-[#121616]/60'
            : 'border-slate-200 bg-slate-50'
        }`}
      >
        <div className="flex items-center gap-2.5">
          <span className="status-dot" />
          <div className="text-[10px] font-mono leading-tight">
            <span className={isDarkMode ? 'text-[#82918c]' : 'text-slate-500'}>Status: </span>
            <strong className={`font-bold ${isDarkMode ? 'text-[#abf5c0]' : 'text-emerald-700'}`}>
              Active ({dailyCapacity}h)
            </strong>
          </div>
        </div>

        <button
          onClick={onOpenNewSubject}
          className={`p-1.5 rounded-lg transition-all ${
            isDarkMode
              ? 'bg-[#171c1b] hover:bg-[#abf5c0] hover:text-[#0b0d0d] text-[#abf5c0] border border-[#abf5c0]/30'
              : 'bg-white hover:bg-emerald-600 hover:text-white text-emerald-700 border border-slate-200'
          }`}
          title="Add New Course"
        >
          <Plus className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
