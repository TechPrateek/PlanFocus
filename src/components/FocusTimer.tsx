import React, { useState, useEffect, useRef } from 'react';
import { ScheduledTask } from '../types';
import {
  Play,
  Pause,
  RotateCcw,
  SkipForward,
  CheckCircle2,
  Volume2,
  VolumeX,
  X,
  Sparkles,
} from 'lucide-react';
import { audioService } from '../services/audioService';
import confetti from 'canvas-confetti';

interface FocusTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeTask: ScheduledTask | null;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onLogCompletedSession: (task: ScheduledTask, durationMinutes: number) => void;
  onTimerStateChange?: (isRunning: boolean, minutesRemaining: number) => void;
  isDarkMode?: boolean;
}

export const FocusTimerModal: React.FC<FocusTimerModalProps> = ({
  isOpen,
  onClose,
  activeTask,
  soundEnabled,
  onToggleSound,
  onLogCompletedSession,
  onTimerStateChange,
  isDarkMode = false,
}) => {
  const [mode, setMode] = useState<'work' | 'shortBreak' | 'longBreak'>('work');
  const [durationMinutes, setDurationMinutes] = useState<number>(25);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(true); // Auto-start on modal open
  const [sessionCompletedNotice, setSessionCompletedNotice] = useState<boolean>(false);

  const timerRef = useRef<any>(null);

  // Auto-start and chime when modal opens with an active task
  useEffect(() => {
    if (isOpen) {
      setIsRunning(true);
      setSessionCompletedNotice(false);
      if (soundEnabled) {
        audioService.playStartChime();
      }
    }
  }, [isOpen, activeTask, soundEnabled]);

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
    if (isRunning && isOpen) {
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
  }, [isRunning, isOpen]);

  // Sync state upward if provided
  useEffect(() => {
    if (onTimerStateChange) {
      onTimerStateChange(isRunning, Math.ceil(secondsRemaining / 60));
    }
  }, [isRunning, secondsRemaining, onTimerStateChange]);

  const handleSessionEnd = () => {
    setSessionCompletedNotice(true);
    if (soundEnabled) {
      audioService.playSessionCompleteChime();
    }
    if (mode === 'work') {
      confetti({
        particleCount: 90,
        spread: 65,
        origin: { y: 0.65 },
        colors: ['#6366f1', '#10b981', '#f59e0b', '#ec4899'],
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
      onClose();
    }
  };

  if (!isOpen) return null;

  const totalSeconds = durationMinutes * 60;
  const progressFraction = Math.max(0, Math.min(1, 1 - secondsRemaining / totalSeconds));

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  // SVG circular dimensions
  const radius = 105;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - progressFraction * circumference;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-sans">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#12151e] border border-gray-200 dark:border-indigo-500/30 rounded-3xl p-6 sm:p-8 text-center shadow-2xl overflow-hidden transition-colors">
        {/* Top Controls: Sound Toggle and Close Button */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={onToggleSound}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-[#171b26] border border-gray-200 dark:border-[#1e2230] text-gray-700 dark:text-gray-300 text-xs font-semibold hover:border-indigo-500 transition-colors"
            title={soundEnabled ? 'Web Audio chime enabled' : 'Muted'}
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-indigo-500" />
                <span>Audio Chimes On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-gray-400" />
                <span>Muted</span>
              </>
            )}
          </button>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
            title="Minimize or Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Active Task Banner */}
        <div className="mb-6 p-4 rounded-2xl bg-gray-50 dark:bg-[#171b26] border border-gray-200 dark:border-[#1e2230] text-left">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Focus Target
            </span>
            {activeTask && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-bold uppercase tracking-wide">
                {activeTask.difficulty}
              </span>
            )}
          </div>
          <h3 className="text-base font-extrabold text-gray-900 dark:text-white truncate">
            {activeTask ? activeTask.topicName : 'General Focus Session'}
          </h3>
          {activeTask && (
            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold mt-0.5">
              {activeTask.subjectName} &bull; {activeTask.durationHours}h Block
            </p>
          )}
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center justify-center gap-2 mb-6 p-1 bg-gray-100 dark:bg-[#171b26] border border-gray-200 dark:border-[#1e2230] rounded-2xl w-fit mx-auto">
          <button
            onClick={() => handleModeChange('work')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              mode === 'work'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Work (25m)
          </button>
          <button
            onClick={() => handleModeChange('shortBreak')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              mode === 'shortBreak'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Break (5m)
          </button>
          <button
            onClick={() => handleModeChange('longBreak')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              mode === 'longBreak'
                ? 'bg-amber-600 text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
            }`}
          >
            Rest (15m)
          </button>
        </div>

        {/* SVG Circular Progress Timer */}
        <div className="relative w-64 h-64 mx-auto my-2 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            {/* Background ring */}
            <circle
              cx="128"
              cy="128"
              r={radius}
              stroke={isDarkMode ? '#1e2230' : '#e2e8f0'}
              strokeWidth="8"
              fill="transparent"
            />
            {/* Animated progress ring */}
            <circle
              cx="128"
              cy="128"
              r={radius}
              stroke={mode === 'work' ? '#6366f1' : mode === 'shortBreak' ? '#10b981' : '#f59e0b'}
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
            <span className="text-5xl font-black font-mono text-gray-900 dark:text-white tracking-tight">
              {formattedTime}
            </span>
            <span className="text-[11px] uppercase font-bold tracking-wider text-gray-400 mt-2 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              {isRunning ? (mode === 'work' ? 'Deep Work Running' : 'Resting') : 'Paused'}
            </span>
          </div>
        </div>

        {/* Session Finished Notification Banner */}
        {sessionCompletedNotice && (
          <div className="my-4 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-500/30 text-emerald-800 dark:text-emerald-300 text-xs flex items-center justify-between animate-fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
              <span className="font-semibold">Focus block completed!</span>
            </div>
            {activeTask && (
              <button
                onClick={handleLogAndComplete}
                className="px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-sm transition-colors text-xs"
              >
                Log Session
              </button>
            )}
          </div>
        )}

        {/* Primary Controls */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={resetTimer}
            className="p-3.5 rounded-2xl bg-gray-100 dark:bg-[#171b26] border border-gray-200 dark:border-[#1e2230] text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            title="Reset"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={togglePlay}
            className={`px-8 py-3.5 rounded-2xl flex items-center justify-center gap-2.5 text-white font-bold text-sm shadow-xl transition-all transform hover:scale-105 active:scale-95 ${
              isRunning
                ? 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30'
                : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-5 h-5 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-5 h-5 fill-current ml-0.5" />
                <span>Resume Focus</span>
              </>
            )}
          </button>

          <button
            onClick={handleSessionEnd}
            className="p-3.5 rounded-2xl bg-gray-100 dark:bg-[#171b26] border border-gray-200 dark:border-[#1e2230] text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            title="Skip / Finish Block"
          >
            <SkipForward className="w-5 h-5" />
          </button>
        </div>

        {/* Complete Topic & Close */}
        {activeTask && (
          <div className="mt-6 pt-4 border-t border-gray-200 dark:border-[#1e2230] flex items-center justify-between text-xs text-gray-400">
            <span>Finished this assignment?</span>
            <button
              onClick={handleLogAndComplete}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 hover:bg-indigo-600 text-indigo-600 dark:text-indigo-300 hover:text-white border border-indigo-200 dark:border-indigo-800/40 font-bold transition-all"
            >
              Mark Topic Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
