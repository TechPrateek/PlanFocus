import React, { useState, useEffect, useRef } from 'react';
import { ScheduledTask } from '../types';
import { Play, Pause, RotateCcw, SkipForward, MoreHorizontal } from 'lucide-react';
import { audioService } from '../services/audioService';
import confetti from 'canvas-confetti';

interface FocusSessionCardProps {
  activeTask: ScheduledTask | null;
  soundEnabled: boolean;
  onLogCompletedSession: (task: ScheduledTask, durationMinutes: number) => void;
  onTimerRunningChange?: (isRunning: boolean) => void;
}

export const FocusSessionCard: React.FC<FocusSessionCardProps> = ({
  activeTask,
  soundEnabled,
  onLogCompletedSession,
  onTimerRunningChange,
}) => {
  const [durationMinutes, setDurationMinutes] = useState<number>(25);
  const [secondsRemaining, setSecondsRemaining] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isBreak, setIsBreak] = useState<boolean>(false);

  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            handleComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    if (onTimerRunningChange) {
      onTimerRunningChange(isRunning);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, onTimerRunningChange]);

  const handleComplete = () => {
    if (soundEnabled) {
      audioService.playSessionCompleteChime();
    }
    if (!isBreak) {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.6 },
      });
      if (activeTask) {
        onLogCompletedSession(activeTask, durationMinutes);
      }
    }
    // Switch to short break or next focus
    setIsBreak(!isBreak);
    const nextMins = !isBreak ? 5 : 25;
    setDurationMinutes(nextMins);
    setSecondsRemaining(nextMins * 60);
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
  };

  const skipTimer = () => {
    setIsRunning(false);
    handleComplete();
  };

  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="bg-white dark:bg-[#15171e] text-slate-900 dark:text-white rounded-3xl p-6 shadow-xl border border-slate-200 dark:border-white/5 relative overflow-hidden transition-colors">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <span className="text-xs font-semibold text-slate-500 dark:text-gray-400">
            {isBreak ? 'Rest & Recharge' : 'Focus Session'}
          </span>
          {activeTask ? (
            <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-[200px]">
              {activeTask.topicName}
            </h4>
          ) : (
            <p className="text-[11px] text-slate-500 dark:text-gray-400">Deep Work • Block Distractions</p>
          )}
        </div>

        <div className="flex items-center gap-1 text-slate-400 dark:text-gray-400 hover:text-slate-600 dark:hover:text-white cursor-pointer">
          <MoreHorizontal className="w-5 h-5" />
        </div>
      </div>

      {/* Big Digits Display */}
      <div className="text-center my-6">
        <div className="text-5xl font-extrabold font-mono tracking-tight text-slate-900 dark:text-white mb-2">
          {formattedTime}
        </div>
        <p className="text-xs text-slate-500 dark:text-gray-400 font-medium">
          {isBreak ? '5 min pause' : 'Deep Work • Block Distractions'}
        </p>
      </div>

      {/* Controls: Reset, Big Pill Button, Skip */}
      <div className="flex items-center justify-between gap-3 pt-2">
        <button
          onClick={resetTimer}
          className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
          title="Reset Session"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={togglePlay}
          className="flex-1 py-3 px-5 rounded-full bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-gray-100 dark:text-black font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-transform active:scale-95"
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4 fill-current" />
              <span>Pause Focus</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>Start Focus</span>
            </>
          )}
        </button>

        <button
          onClick={skipTimer}
          className="w-10 h-10 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-white/10 dark:hover:bg-white/20 text-slate-600 dark:text-gray-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
          title="Skip or Complete Block"
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>

      {/* Subject badge if active */}
      {activeTask && (
        <div className="mt-4 pt-3 border-t border-slate-200 dark:border-white/10 flex items-center justify-between text-[11px] text-slate-500 dark:text-gray-400">
          <span className="flex items-center gap-1.5">
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: activeTask.subjectColor || '#6366f1' }}
            />
            {activeTask.subjectName}
          </span>
          <span className="font-mono text-slate-700 dark:text-gray-300 font-semibold">{activeTask.difficulty}</span>
        </div>
      )}
    </div>
  );
};
