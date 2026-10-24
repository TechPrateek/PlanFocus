import React, { useState, useEffect, useRef } from 'react';
import { ScheduledTask } from '../types';
import { Play, Pause, RotateCcw, SkipForward, CheckCircle2, Volume2, VolumeX } from 'lucide-react';
import { audioService } from '../services/audioService';
import confetti from 'canvas-confetti';

interface FocusTimerProps {
  activeTask: ScheduledTask | null;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onLogCompletedSession: (task: ScheduledTask, durationMinutes: number) => void;
  onTimerStateChange: (isRunning: boolean, minutesRemaining: number) => void;
}

export const FocusTimer: React.FC<FocusTimerProps> = ({
  activeTask,
  soundEnabled,
  onToggleSound,
  onLogCompletedSession,
  onTimerStateChange,
}) => {
  const [mode, setMode] = useState<'work' | 'shortBreak' | 'longBreak'>('work');
  const [durationMinutes, setDurationMinutes] = useState<number>(25);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [sessionCompletedNotice, setSessionCompletedNotice] = useState<boolean>(false);

  const timerRef = useRef<any>(null);

  // Switch modes
  const handleModeChange = (newMode: 'work' | 'shortBreak' | 'longBreak') => {
    setIsRunning(false);
    setSessionCompletedNotice(false);
    setMode(newMode);
    let mins = 25;
    if (newMode === 'shortBreak') mins = 5;
    if (newMode === 'longBreak') mins = 15;
    setDurationMinutes(mins);
    setSecondsRemaining(mins * 60);
  };

  // Timer tick effect
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setIsRunning(false);
            handleSessionEnd();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning]);

  // Sync state upward to Header
  useEffect(() => {
    onTimerStateChange(isRunning, Math.ceil(secondsRemaining / 60));
  }, [isRunning, secondsRemaining, onTimerStateChange]);

  const handleSessionEnd = () => {
    setSessionCompletedNotice(true);
    if (soundEnabled) {
      audioService.playSessionCompleteChime();
    }
    // Celebratory confetti if it was a work session
    if (mode === 'work') {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#6366f1', '#10b981', '#f59e0b'],
      });
    }
  };

  const togglePlay = () => {
    if (!isRunning && soundEnabled) {
      audioService.playStartChime();
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setSecondsRemaining(durationMinutes * 60);
    setSessionCompletedNotice(false);
  };

  const handleLogAndComplete = () => {
    if (activeTask) {
      onLogCompletedSession(activeTask, durationMinutes);
      resetTimer();
    }
  };

  const totalSeconds = durationMinutes * 60;
  const progressFraction = Math.max(0, Math.min(1, 1 - secondsRemaining / totalSeconds));

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // SVG circular dimensions
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progressFraction * circumference;

  return (
    <div className="max-w-xl mx-auto py-6">
      <div className="bg-[#12151e] border border-[#1e2230] rounded-2xl p-6 sm:p-8 text-center shadow-xl relative overflow-hidden">
        {/* Active Task Banner */}
        <div className="mb-6 p-3 rounded-xl bg-[#171b26] border border-[#1e2230] flex items-center justify-between">
          <div className="text-left min-w-0">
            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block">
              Active Focus Target
            </span>
            <h3 className="text-sm font-bold text-white truncate">
              {activeTask ? activeTask.topicName : 'General Focus Session'}
            </h3>
            {activeTask && (
              <span className="text-[11px] text-indigo-400">
                {activeTask.subjectName} ({activeTask.difficulty})
              </span>
            )}
          </div>

          <button
            onClick={onToggleSound}
            className="p-2 rounded-lg bg-[#12151e] text-gray-400 hover:text-white transition-colors"
            title={soundEnabled ? 'Web Audio chime enabled' : 'Muted'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-indigo-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-gray-500" />
            )}
          </button>
        </div>

        {/* Mode Selector Tabs */}
        <div className="inline-flex p-1 bg-[#171b26] rounded-xl border border-[#1e2230] mb-8">
          <button
            onClick={() => handleModeChange('work')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === 'work'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Focus (25m)
          </button>
          <button
            onClick={() => handleModeChange('shortBreak')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === 'shortBreak'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Short Break (5m)
          </button>
          <button
            onClick={() => handleModeChange('longBreak')}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              mode === 'longBreak'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Long Break (15m)
          </button>
        </div>

        {/* Circular Progress Clock */}
        <div className="relative w-72 h-72 mx-auto flex items-center justify-center mb-8">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background Track */}
            <circle
              cx="144"
              cy="144"
              r={radius}
              stroke="#1e2230"
              strokeWidth="8"
              fill="transparent"
            />
            {/* Active Progress */}
            <circle
              cx="144"
              cy="144"
              r={radius}
              stroke={mode === 'work' ? '#6366f1' : '#10b981'}
              strokeWidth="8"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-500 ease-linear"
            />
          </svg>

          {/* Centered Digits */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-extrabold font-mono text-white tracking-tight">
              {formattedTime}
            </span>
            <span className="text-xs uppercase font-medium tracking-wider text-gray-400 mt-2">
              {mode === 'work' ? 'Deep Focus' : 'Recharge & Rest'}
            </span>
          </div>
        </div>

        {/* Session Finished Notification Banner */}
        {sessionCompletedNotice && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>Great job! You finished a focus block.</span>
            </div>
            {activeTask && (
              <button
                onClick={handleLogAndComplete}
                className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold shadow-sm transition-colors"
              >
                Log to Topic
              </button>
            )}
          </div>
        )}

        {/* Primary Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={resetTimer}
            className="p-3 rounded-xl bg-[#171b26] border border-[#1e2230] text-gray-400 hover:text-white hover:bg-[#1e2230] transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={togglePlay}
            className={`w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg transition-transform hover:scale-105 ${
              isRunning
                ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30'
                : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'
            }`}
          >
            {isRunning ? (
              <Pause className="w-7 h-7 fill-current" />
            ) : (
              <Play className="w-7 h-7 fill-current ml-0.5" />
            )}
          </button>

          <button
            onClick={handleSessionEnd}
            className="p-3 rounded-xl bg-[#171b26] border border-[#1e2230] text-gray-400 hover:text-white hover:bg-[#1e2230] transition-colors"
            title="Complete Session Now (Demo / Skip)"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Log Button if Task is Active */}
        {activeTask && (
          <div className="mt-8 pt-4 border-t border-[#1e2230]/70 flex items-center justify-between text-xs text-gray-400">
            <span>Mark task complete & update roadmap</span>
            <button
              onClick={handleLogAndComplete}
              className="px-3 py-1.5 rounded-lg bg-[#171b26] hover:bg-indigo-600/20 hover:border-indigo-500/40 border border-[#1e2230] text-indigo-300 font-semibold transition-all"
            >
              Complete Topic Now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
