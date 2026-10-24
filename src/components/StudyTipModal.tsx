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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-[#12151e] border border-indigo-500/30 rounded-2xl p-6 shadow-2xl">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                AI Study Recommendation
              </h3>
              <p className="text-xs text-indigo-300">
                {task.subjectName} • {task.topicName}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#1e2230] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center space-y-3">
            <div className="w-8 h-8 mx-auto border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs text-gray-400">Analyzing topic difficulty and formulating study plan...</p>
          </div>
        ) : tip ? (
          <div className="space-y-4">
            {/* Technique Box */}
            <div className="p-4 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400 block mb-1">
                Recommended Technique
              </span>
              <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                <Lightbulb className="w-4 h-4 text-amber-400" />
                {tip.recommendedStudyTechnique}
              </h4>
              <p className="text-xs text-gray-300 mt-2 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                Suggested session pacing: {tip.suggestedBreakdown}
              </p>
            </div>

            {/* Key Action Points */}
            <div>
              <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">
                Execution Steps
              </span>
              <div className="space-y-2">
                {tip.keyPoints.map((pt, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg bg-[#171b26] border border-[#1e2230] text-xs text-gray-200 flex items-start gap-2.5"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span>{pt}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#1e2230] flex justify-end">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-colors"
              >
                Got It, Let's Focus
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
