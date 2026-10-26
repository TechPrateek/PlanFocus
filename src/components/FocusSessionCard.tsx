import React, { useState, useEffect, useRef } from 'react';
import { ScheduledTask } from '../types';
import { Play, Pause, RotateCcw, SkipForward } from 'lucide-react';
import { audioService } from '../services/audioService';
import confetti from 'canvas-confetti';

interface FocusSessionCardProps {
  activeTask: ScheduledTask | null;
  soundEnabled: boolean;
  onLogCompletedSession: (task: ScheduledTask, durationMinutes: number) => void;
  onTimerRunningChange?: (isRunning: boolean) => void;
  isDarkMode?: boolean;
}

export const FocusSessionCard: React.FC<FocusSessionCardProps> = ({
  activeTask,
  soundEnabled,
  onLogCompletedSession,
  onTimerRunningChange,
  isDarkMode = false,
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
        particleCount: 80,
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

  const cardBorder = isDarkMode
    ? 'border-[rgba(217,234,224,0.12)] bg-[#121616]'
    : 'border-slate-200 bg-white shadow-sm';
  const textHeading = isDarkMode ? 'text-white' : 'text-slate-900';
  const textMuted = isDarkMode ? 'text-[#82918c]' : 'text-slate-500';

  return (
    <div className={`rounded-xl p-5 border relative overflow-hidden transition-colors ${cardBorder}`}>
      {/* Top Header Eyebrow */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-[10px] font-mono tracking-wider uppercase text-[#82918c] block">
            {isBreak ? 'REST // RECHARGE' : 'DEEP WORK // POMODORO'}
          </span>
          <h4 className={`text-xs font-bold truncate max-w-[200px] mt-0.5 ${textHeading}`}>
            {activeTask ? activeTask.topicName : 'General Focus Session'}
          </h4>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="live-pip" />
          <span className={`text-[10px] font-mono font-bold ${isDarkMode ? 'text-[#abf5c0]' : 'text-emerald-700'}`}>
            {isRunning ? 'RUNNING' : 'STANDBY'}
          </span>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className={`flex items-center gap-1 p-1 rounded-lg mb-5 border ${isDarkMode ? 'bg-[#171c1b] border-[rgba(217,234,224,0.08)]' : 'bg-slate-100 border-slate-200'}`}>
        <button
          onClick={() => {
            setIsRunning(false);
            setIsBreak(false);
            setDurationMinutes(25);
            setSecondsRemaining(25 * 60);
          }}
          className={`flex-1 py-1 rounded text-[10px] font-mono font-bold transition-all ${
            !isBreak
              ? isDarkMode
                ? 'bg-[#abf5c0] text-[#0b0d0d] shadow-sm'
                : 'bg-emerald-600 text-white shadow-sm'
              : textMuted
          }`}
        >
          25m Focus
        </button>
        <button
          onClick={() => {
            setIsRunning(false);
            setIsBreak(true);
            setDurationMinutes(5);
            setSecondsRemaining(5 * 60);
          }}
          className={`flex-1 py-1 rounded text-[10px] font-mono font-bold transition-all ${
            isBreak
              ? isDarkMode
                ? 'bg-[#abf5c0] text-[#0b0d0d] shadow-sm'
                : 'bg-emerald-600 text-white shadow-sm'
              : textMuted
          }`}
        >
          5m Break
        </button>
      </div>

      {/* Big Digits Display (PayRevive Mint) */}
      <div className="text-center my-4">
        <div
          className={`text-5xl sm:text-6xl font-black font-mono tracking-tight mb-1.5 transition-colors ${
            isDarkMode ? 'text-[#abf5c0]' : 'text-emerald-700'
          }`}
        >
          {formattedTime}
        </div>
        <p className={`text-[11px] font-mono ${textMuted}`}>
          {isBreak ? '5 min cognitive reset' : 'Block distractions & execute'}
        </p>
      </div>

      {/* Controls: Reset, Big Action Button, Skip */}
      <div className="flex items-center justify-between gap-2.5 pt-2">
        <button
          type="button"
          onClick={resetTimer}
          className={`p-2.5 rounded-lg border transition-colors cursor-pointer ${
            isDarkMode
              ? 'border-[rgba(217,234,224,0.12)] bg-[#171c1b] text-[#82918c] hover:text-white'
              : 'border-slate-200 bg-slate-100 text-slate-600 hover:text-slate-900'
          }`}
          title="Reset Session"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={togglePlay}
          className={`flex-1 py-2.5 px-4 rounded-lg font-bold text-xs font-mono flex items-center justify-center gap-2 shadow-md transition-all hover:-translate-y-0.5 active:translate-y-0 cursor-pointer ${
            isDarkMode
              ? 'bg-[#abf5c0] hover:bg-[#cdfad8] text-[#0b0d0d] shadow-[0_6px_25px_rgba(171,245,192,0.2)]'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
          }`}
        >
          {isRunning ? (
            <>
              <Pause className="w-4 h-4 fill-current" />
              <span>PAUSE SESSION</span>
            </>
          ) : (
            <>
              <Play className="w-4 h-4 fill-current" />
              <span>START FOCUS</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={skipTimer}
          className={`p-2.5 rounded-lg border transition-colors cursor-pointer ${
            isDarkMode
              ? 'border-[rgba(217,234,224,0.12)] bg-[#171c1b] text-[#82918c] hover:text-white'
              : 'border-slate-200 bg-slate-100 text-slate-600 hover:text-slate-900'
          }`}
          title="Skip or Complete Block"
        >
          <SkipForward className="w-4 h-4" />
        </button>
      </div>

      {/* Active Target Course Pill */}
      {activeTask && (
        <div
          className={`mt-4 pt-3 border-t flex items-center justify-between text-[10px] font-mono ${
            isDarkMode ? 'border-[rgba(217,234,224,0.08)] text-[#82918c]' : 'border-slate-200 text-slate-500'
          }`}
        >
          <span className="flex items-center gap-1.5 truncate">
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: activeTask.subjectColor || '#abf5c0' }}
            />
            {activeTask.subjectName}
          </span>
          <span className={`font-bold ${isDarkMode ? 'text-[#e5eee8]' : 'text-slate-700'}`}>
            {activeTask.difficulty.toUpperCase()}
          </span>
        </div>
      )}
    </div>
  );
};
