import React, { useState } from 'react';
import { getTufyGuidance } from '../services/tufyData';
import { generateAIStudyTip, StudyRecommendation } from '../services/aiService';
import {
  X,
  Sparkles,
  ExternalLink,
  Play,
  Lightbulb,
  Turtle,
  Rocket,
  AlertTriangle,
  Bot,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

interface TufyAiModalProps {
  isOpen: boolean;
  onClose: () => void;
  problemName: string | null;
  pattern?: string;
  onStartFocus?: (problemName: string) => void;
  geminiApiKey?: string;
}

export const TufyAiModal: React.FC<TufyAiModalProps> = ({
  isOpen,
  onClose,
  problemName,
  pattern,
  onStartFocus,
  geminiApiKey,
}) => {
  const [activeTab, setActiveTab] = useState<'intuition' | 'brute' | 'optimal' | 'faang' | 'gemini'>('intuition');
  const [geminiTip, setGeminiTip] = useState<StudyRecommendation | null>(null);
  const [isLoadingGemini, setIsLoadingGemini] = useState<boolean>(false);

  if (!isOpen || !problemName) return null;

  const guidance = getTufyGuidance(problemName, pattern);

  const handleFetchGemini = async () => {
    setIsLoadingGemini(true);
    try {
      const tip = await generateAIStudyTip(
        guidance.problemName,
        'Striver DSA Sheet & Coding Interview',
        guidance.difficulty,
        geminiApiKey
      );
      setGeminiTip(tip);
    } catch {
      setGeminiTip({
        topicName: guidance.problemName,
        recommendedStudyTechnique: 'Active Invariant Proving & Dry-running',
        keyPoints: [
          'Prove the loop invariant on paper with small inputs (n=3)',
          'Check edge cases: empty array, negative numbers, single element',
          'Explain trade-offs clearly to the interviewer before coding',
        ],
        suggestedBreakdown: '10m invariant analysis, 20m coding, 10m dry run',
      });
    } finally {
      setIsLoadingGemini(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl bg-[#12151e] border border-indigo-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-[#1e2230] bg-gradient-to-r from-indigo-950/70 via-[#171b26] to-purple-950/50 flex items-start justify-between">
          <div className="flex items-start gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/25 flex-shrink-0">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold tracking-wide">
                  TUFY • AI Learning Companion
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1e2230] text-gray-300 font-semibold">
                  {guidance.pattern}
                </span>
              </div>
              <h2 className="text-lg font-extrabold text-white tracking-tight">
                {guidance.problemName}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-1 px-6 pt-3 border-b border-[#1e2230] bg-[#0e111a] overflow-x-auto">
          <button
            onClick={() => setActiveTab('intuition')}
            className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'intuition'
                ? 'text-indigo-400 border-indigo-500 bg-[#171b26]'
                : 'text-gray-400 border-transparent hover:text-gray-200'
            }`}
          >
            <Lightbulb className="w-4 h-4 text-amber-400" />
            <span>Intuition & Thought Process</span>
          </button>

          <button
            onClick={() => setActiveTab('brute')}
            className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'brute'
                ? 'text-indigo-400 border-indigo-500 bg-[#171b26]'
                : 'text-gray-400 border-transparent hover:text-gray-200'
            }`}
          >
            <Turtle className="w-4 h-4 text-rose-400" />
            <span>Brute Force</span>
          </button>

          <button
            onClick={() => setActiveTab('optimal')}
            className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'optimal'
                ? 'text-indigo-400 border-indigo-500 bg-[#171b26]'
                : 'text-gray-400 border-transparent hover:text-gray-200'
            }`}
          >
            <Rocket className="w-4 h-4 text-emerald-400" />
            <span>Optimal Striver Solution</span>
          </button>

          <button
            onClick={() => setActiveTab('faang')}
            className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'faang'
                ? 'text-indigo-400 border-indigo-500 bg-[#171b26]'
                : 'text-gray-400 border-transparent hover:text-gray-200'
            }`}
          >
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>FAANG Pitfalls</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('gemini');
              if (!geminiTip && !isLoadingGemini) {
                handleFetchGemini();
              }
            }}
            className={`flex items-center gap-2 px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition-all border-b-2 whitespace-nowrap ${
              activeTab === 'gemini'
                ? 'text-indigo-400 border-indigo-500 bg-[#171b26]'
                : 'text-gray-400 border-transparent hover:text-gray-200'
            }`}
          >
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span>Gemini AI Tutor</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {activeTab === 'intuition' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-gray-200 leading-relaxed text-sm">
                <p className="font-semibold text-indigo-300 mb-2">Core Mental Model:</p>
                {guidance.intuition}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-3.5 rounded-2xl bg-[#171b26] border border-[#1e2230]">
                  <span className="text-[10px] font-mono text-gray-400 uppercase block mb-1">
                    Problem Pattern
                  </span>
                  <span className="font-bold text-white text-xs">{guidance.pattern}</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-[#171b26] border border-[#1e2230]">
                  <span className="text-[10px] font-mono text-gray-400 uppercase block mb-1">
                    Interview Frequency
                  </span>
                  <span className="font-bold text-emerald-400 text-xs">High (FAANG & Top Tier)</span>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'brute' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#171b26] border border-[#1e2230] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-gray-200 text-xs">Brute Force Approach</span>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 font-mono text-[10px] font-bold">
                      Time: {guidance.bruteForce.timeComplexity}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-gray-800 text-gray-300 font-mono text-[10px]">
                      Space: {guidance.bruteForce.spaceComplexity}
                    </span>
                  </div>
                </div>
                <p className="text-gray-300 leading-relaxed">
                  {guidance.bruteForce.approach}
                </p>
                <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/20 text-rose-300 text-[11px]">
                  ⚠️ <strong>Why this Fails:</strong> Leads to Time Limit Exceeded (TLE) when N &gt; 10⁴. An optimal linear or logarithmic solution is required.
                </div>
              </div>
            </div>
          )}

          {activeTab === 'optimal' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Rocket className="w-4 h-4 text-emerald-400" />
                    <span className="font-bold text-white text-xs">Striver's Optimal Technique</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 font-mono text-[10px] font-bold">
                      Time: {guidance.optimal.timeComplexity}
                    </span>
                    <span className="px-2 py-0.5 rounded bg-[#1e2230] text-gray-300 font-mono text-[10px]">
                      Space: {guidance.optimal.spaceComplexity}
                    </span>
                  </div>
                </div>

                <p className="text-gray-200 leading-relaxed">
                  {guidance.optimal.approach}
                </p>

                <div className="p-3 rounded-xl bg-[#12151e] border border-emerald-500/20 text-emerald-300 text-[11px] flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-emerald-200">Key Invariant:</strong>
                    {guidance.optimal.keyInvariant}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'faang' && (
            <div className="space-y-3">
              <p className="text-gray-400 font-semibold mb-2">
                What Top Interviewers (Google, Uber, Meta) Test For:
              </p>
              {guidance.faangPitfalls.map((pitfall, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-amber-950/20 border border-amber-500/20 flex items-start gap-3 text-amber-200/90 text-xs leading-relaxed"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <span>{pitfall}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'gemini' && (
            <div className="space-y-4">
              {isLoadingGemini ? (
                <div className="py-12 flex flex-col items-center justify-center text-center gap-3">
                  <Loader2 className="w-7 h-7 text-indigo-400 animate-spin" />
                  <p className="text-gray-400 text-xs">
                    Asking Gemini AI for deep interview insights & code structure...
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-950/40 to-purple-950/30 border border-indigo-500/30 text-gray-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-indigo-300 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-purple-400" />
                      Gemini Deep-Dive Study Tip
                    </span>
                    <button
                      onClick={handleFetchGemini}
                      className="text-[10px] text-gray-400 hover:text-white underline"
                    >
                      Regenerate
                    </button>
                  </div>
                  {geminiTip && (
                    <div className="space-y-2 text-xs">
                      <div className="p-2.5 rounded-xl bg-indigo-900/30 border border-indigo-500/20">
                        <strong className="text-indigo-300 block mb-1">Recommended Technique:</strong>
                        <p className="text-gray-200">{geminiTip.recommendedStudyTechnique}</p>
                      </div>

                      <div className="p-2.5 rounded-xl bg-[#171b26] border border-[#1e2230]">
                        <strong className="text-gray-300 block mb-1">Key Action Items:</strong>
                        <ul className="list-disc list-inside space-y-1 text-gray-400">
                          {geminiTip.keyPoints.map((point, i) => (
                            <li key={i}>{point}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-2.5 rounded-xl bg-emerald-950/30 border border-emerald-500/20">
                        <strong className="text-emerald-300 block mb-0.5">Session Breakdown:</strong>
                        <p className="text-emerald-200 font-mono text-[11px]">{geminiTip.suggestedBreakdown}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-[#1e2230] bg-[#0e111a] flex flex-wrap items-center justify-between gap-3">
          <a
            href={guidance.takeuforwardUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#171b26] hover:bg-[#1e2230] text-gray-200 hover:text-white border border-[#1e2230] transition-colors text-xs font-semibold"
          >
            <span>Solve on takeUforward</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="flex items-center gap-2">
            {onStartFocus && (
              <button
                onClick={() => {
                  onStartFocus(guidance.problemName);
                  onClose();
                }}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs shadow-md shadow-indigo-600/20 transition-all"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Start Focus Session</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#1e2230] hover:bg-[#252b3d] text-gray-300 hover:text-white text-xs font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
