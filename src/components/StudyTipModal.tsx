import React, { useState, useEffect } from 'react';
import { ScheduledTask } from '../types';
import { generateAIStudyTip, StudyRecommendation } from '../services/aiService';
import { X, Sparkles, Lightbulb, Clock, CheckCircle } from 'lucide-react';

interface StudyTipModalProps {
  task: ScheduledTask | null;
  isOpen: boolean;
  onClose: () => void;
  geminiApiKey?: string;
}

export const StudyTipModal: React.FC<StudyTipModalProps> = ({
  task,
  isOpen,
  onClose,
  geminiApiKey,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [tip, setTip] = useState<StudyRecommendation | null>(null);

  useEffect(() => {
    if (task && isOpen) {
      setLoading(true);
      generateAIStudyTip(task.topicName, task.subjectName, task.difficulty, geminiApiKey)
        .then((result) => {
          setTip(result);
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [task, isOpen, geminiApiKey]);

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#12151e] border border-slate-200 dark:border-indigo-500/30 rounded-3xl p-6 shadow-2xl transition-colors">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                AI Study Recommendation
              </h3>
              <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-300">
                {task.subjectName} • {task.topicName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1e2230] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-8 h-8 mx-auto border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-slate-400 dark:text-gray-400">
              Analyzing topic difficulty and formulating study plan...
            </p>
          </div>
        ) : tip ? (
          <div className="space-y-4 text-xs">
            {/* Recommended Technique */}
            <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60">
              <div className="flex items-center gap-2 text-indigo-700 dark:text-indigo-300 font-bold mb-1">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <span>Recommended Technique</span>
              </div>
              <p className="text-slate-800 dark:text-gray-200 font-semibold leading-relaxed">
                {tip.recommendedStudyTechnique}
              </p>
            </div>

            {/* Key Action Points */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#171b26] border border-slate-200 dark:border-[#1e2230] space-y-2">
              <div className="text-slate-500 dark:text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                High-Yield Review Steps
              </div>
              <ul className="space-y-1.5">
                {tip.keyPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-2 text-slate-700 dark:text-gray-300 leading-relaxed">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Suggested Time Breakdown */}
            <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#171b26] border border-slate-200 dark:border-[#1e2230] flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-500 dark:text-gray-400 font-medium">
                <Clock className="w-4 h-4 text-indigo-500" />
                <span>Suggested Session Breakdown</span>
              </div>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                {tip.suggestedBreakdown}
              </span>
            </div>
          </div>
        ) : null}

        <div className="mt-5 pt-3 border-t border-slate-200 dark:border-[#1e2230] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold transition-colors shadow-sm"
          >
            Got It, Let's Study
          </button>
        </div>
      </div>
    </div>
  );
};
