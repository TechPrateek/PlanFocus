import React from 'react';
import { Flame, Clock, Sparkles, Plus, Volume2, VolumeX, BarChart2, Calendar, Target, PlayCircle } from 'lucide-react';
import { formatTimeHours } from '../utils/dateUtils';

interface HeaderProps {
  activeTab: 'today' | 'schedule' | 'timer' | 'analytics';
  setActiveTab: (tab: 'today' | 'schedule' | 'timer' | 'analytics') => void;
  streak: number;
  todayCompletedHours: number;
  dailyCapacityHours: number;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onLoadSample: () => void;
  onOpenNewSubject: () => void;
  onOpenWizard: () => void;
  isTimerRunning: boolean;
  timerMinutesRemaining: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  streak,
  todayCompletedHours,
  dailyCapacityHours,
  soundEnabled,
  onToggleSound,
  onLoadSample,
  onOpenNewSubject,
  onOpenWizard,
  isTimerRunning,
  timerMinutesRemaining,
}) => {
  const progressPercent = Math.min(100, Math.round((todayCompletedHours / (dailyCapacityHours || 3)) * 100));

  return (
    <header className="sticky top-0 z-40 bg-[#090a0f]/90 backdrop-blur-md border-b border-[#1e2230]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand & Tagline */}
          <div className="flex items-center gap-6">
            <div 
              className="flex items-center gap-2.5 cursor-pointer group"
              onClick={() => setActiveTab('today')}
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <Target className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="font-bold text-lg tracking-tight text-white flex items-center gap-1.5">
                  FocusFlow <span className="text-xs px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-400 font-mono font-medium border border-indigo-500/30">AI</span>
                </span>
                <p className="text-[10px] text-gray-400 hidden sm:block -mt-0.5">Adaptive Study Planner</p>
              </div>
            </div>

            {/* Nav Tabs */}
            <nav className="hidden md:flex items-center gap-1 bg-[#12151e] p-1 rounded-lg border border-[#1e2230]">
              <button
                onClick={() => setActiveTab('today')}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  activeTab === 'today'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-[#1a1f2c]'
                }`}
              >
                <Target className="w-3.5 h-3.5" />
                Today's Plan
              </button>

              <button
                onClick={() => setActiveTab('schedule')}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  activeTab === 'schedule'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-[#1a1f2c]'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                Schedule Timeline
              </button>

              <button
                onClick={() => setActiveTab('timer')}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all relative ${
                  activeTab === 'timer'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-[#1a1f2c]'
                }`}
              >
                <PlayCircle className="w-3.5 h-3.5" />
                Focus Timer
                {isTimerRunning && (
                  <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('analytics')}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  activeTab === 'analytics'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-[#1a1f2c]'
                }`}
              >
                <BarChart2 className="w-3.5 h-3.5" />
                Analytics
              </button>
            </nav>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex items-center gap-3">
            {/* Active timer badge (if running in background) */}
            {isTimerRunning && activeTab !== 'timer' && (
              <button
                onClick={() => setActiveTab('timer')}
                className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono animate-pulse hover:bg-emerald-500/20 transition-colors"
                title="Timer active — click to view"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>{timerMinutesRemaining}m left</span>
              </button>
            )}

            {/* Streak Counter */}
            <div 
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#12151e] border border-[#1e2230] text-amber-400 text-xs font-semibold"
              title="Daily Study Streak"
            >
              <Flame className="w-4 h-4 fill-amber-400 text-amber-500 animate-bounce" style={{ animationDuration: '2s' }} />
              <span>{streak} {streak === 1 ? 'Day' : 'Days'}</span>
            </div>

            {/* Daily Hours Meter */}
            <div 
              className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-lg bg-[#12151e] border border-[#1e2230] text-xs text-gray-300"
              title="Today's Study Progress"
            >
              <Clock className="w-3.5 h-3.5 text-indigo-400" />
              <span>{formatTimeHours(todayCompletedHours)} / {dailyCapacityHours}h</span>
              <div className="w-16 h-1.5 bg-[#1e2230] rounded-full overflow-hidden ml-1">
                <div 
                  className="h-full bg-indigo-500 rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={onToggleSound}
              className="p-2 rounded-lg bg-[#12151e] border border-[#1e2230] text-gray-400 hover:text-gray-200 hover:bg-[#1a1f2c] transition-colors"
              title={soundEnabled ? 'Web Audio chime enabled' : 'Sound muted'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4 text-indigo-400" /> : <VolumeX className="w-4 h-4 text-gray-500" />}
            </button>

            {/* Load Sample Data (For Judges & Instant Evaluation) */}
            <button
              onClick={onLoadSample}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-xs font-medium transition-all"
              title="Quickly load sample college courses & exam schedule"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Load Demo Data</span>
            </button>

            {/* Setup Wizard */}
            <button
              onClick={onOpenWizard}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-[#12151e] hover:bg-[#1a1f2c] border border-[#1e2230] text-gray-300 hover:text-white text-xs font-medium transition-colors"
              title="Launch Setup Wizard"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Wizard</span>
            </button>

            {/* Add Subject / Course */}
            <button
              onClick={onOpenNewSubject}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm shadow-indigo-600/30 transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Add Subject</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="flex md:hidden items-center justify-around py-2 border-t border-[#1e2230]/60">
          <button
            onClick={() => setActiveTab('today')}
            className={`flex items-center gap-1.5 text-xs py-1 px-2 rounded font-medium ${
              activeTab === 'today' ? 'text-indigo-400 font-semibold' : 'text-gray-400'
            }`}
          >
            <Target className="w-3.5 h-3.5" />
            Today
          </button>
          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex items-center gap-1.5 text-xs py-1 px-2 rounded font-medium ${
              activeTab === 'schedule' ? 'text-indigo-400 font-semibold' : 'text-gray-400'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Timeline
          </button>
          <button
            onClick={() => setActiveTab('timer')}
            className={`flex items-center gap-1.5 text-xs py-1 px-2 rounded font-medium ${
              activeTab === 'timer' ? 'text-indigo-400 font-semibold' : 'text-gray-400'
            }`}
          >
            <PlayCircle className="w-3.5 h-3.5" />
            Timer
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex items-center gap-1.5 text-xs py-1 px-2 rounded font-medium ${
              activeTab === 'analytics' ? 'text-indigo-400 font-semibold' : 'text-gray-400'
            }`}
          >
            <BarChart2 className="w-3.5 h-3.5" />
            Stats
          </button>
        </div>
      </div>
    </header>
  );
};
