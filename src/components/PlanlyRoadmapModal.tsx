import React, { useState } from 'react';
import { Subject } from '../types';
import { getPlanlyDSARoadmap } from '../services/sampleData';
import { X, Sparkles, Target, Building2, ArrowRight, Zap, Code2 } from 'lucide-react';

interface PlanlyRoadmapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyPlanlyRoadmap: (subjects: Subject[], dailyHours: number) => void;
}

export const PlanlyRoadmapModal: React.FC<PlanlyRoadmapModalProps> = ({
  isOpen,
  onClose,
  onApplyPlanlyRoadmap,
}) => {
  const [selectedTrack, setSelectedTrack] = useState<'sde' | 'faang' | 'placement'>('sde');
  const [targetRole, setTargetRole] = useState<'SDE Intern' | 'Software Engineer' | 'Campus Placement'>('Software Engineer');
  const [targetCompany, setTargetCompany] = useState<'FAANG' | 'Top Product Firms' | 'Tech Startups'>('Top Product Firms');
  const [targetDays, setTargetDays] = useState<number>(45);
  const [dailyHours, setDailyHours] = useState<number>(3.0);

  if (!isOpen) return null;

  const handleGenerate = () => {
    const roadmapSubjects = getPlanlyDSARoadmap(targetDays);
    onApplyPlanlyRoadmap(roadmapSubjects, dailyHours);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-2xl bg-white dark:bg-[#12151e] border border-slate-200 dark:border-indigo-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] transition-colors">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-[#1e2230] bg-slate-50 dark:bg-gradient-to-r dark:from-indigo-950/60 dark:to-purple-950/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Zap className="w-5 h-5 fill-current" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-mono font-bold uppercase">
                  Inspired by takeUforward Planly
                </span>
              </div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
                Planly Placement & Interview Planner
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Track Selection */}
          <div>
            <label className="text-slate-500 dark:text-gray-400 font-bold uppercase tracking-wider block mb-2.5">
              1. Choose Preparation Track
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <button
                type="button"
                onClick={() => setSelectedTrack('sde')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  selectedTrack === 'sde'
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-600/10 text-slate-900 dark:text-white shadow-sm'
                    : 'border-slate-200 dark:border-[#1e2230] bg-slate-50 dark:bg-[#171b26] text-slate-600 dark:text-gray-400 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Code2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="font-bold text-slate-900 dark:text-white text-xs">Striver's SDE Sheet</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-gray-400 leading-relaxed">
                  DSA patterns: Arrays, 2-Pointers, Trees, Graphs, DP & Knapsack.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTrack('faang')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  selectedTrack === 'faang'
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-600/10 text-slate-900 dark:text-white shadow-sm'
                    : 'border-slate-200 dark:border-[#1e2230] bg-slate-50 dark:bg-[#171b26] text-slate-600 dark:text-gray-400 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Target className="w-4 h-4 text-rose-500 dark:text-rose-400" />
                  <span className="font-bold text-slate-900 dark:text-white text-xs">FAANG 30-Day Sprint</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-gray-400 leading-relaxed">
                  High-frequency LeetCode patterns for urgent interview deadlines.
                </p>
              </button>

              <button
                type="button"
                onClick={() => setSelectedTrack('placement')}
                className={`p-4 rounded-2xl border text-left transition-all ${
                  selectedTrack === 'placement'
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-600/10 text-slate-900 dark:text-white shadow-sm'
                    : 'border-slate-200 dark:border-[#1e2230] bg-slate-50 dark:bg-[#171b26] text-slate-600 dark:text-gray-400 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <Building2 className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                  <span className="font-bold text-slate-900 dark:text-white text-xs">Campus SDE Bundle</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-gray-400 leading-relaxed">
                  Full package: DSA + Operating Systems, DBMS & Computer Networks.
                </p>
              </button>
            </div>
          </div>

          {/* Target Role & Company */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-500 dark:text-gray-400 font-bold uppercase tracking-wider block mb-2">
                Target Role
              </label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value as any)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#171b26] border border-slate-200 dark:border-[#1e2230] text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
              >
                <option value="SDE Intern">SDE Intern (College / 3rd-4th year)</option>
                <option value="Software Engineer">Software Development Engineer (0-2 Yrs)</option>
                <option value="Campus Placement">On-Campus Placement Drives</option>
              </select>
            </div>

            <div>
              <label className="text-slate-500 dark:text-gray-400 font-bold uppercase tracking-wider block mb-2">
                Target Company Tier
              </label>
              <select
                value={targetCompany}
                onChange={(e) => setTargetCompany(e.target.value as any)}
                className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-[#171b26] border border-slate-200 dark:border-[#1e2230] text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
              >
                <option value="Top Product Firms">Top Product Firms (Uber, Atlassian, Stripe)</option>
                <option value="FAANG">Tier 1 / FAANG (Google, Amazon, Meta)</option>
                <option value="Tech Startups">Fast-Growing Unicorn Startups</option>
              </select>
            </div>
          </div>

          {/* Timeline & Daily Capacity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-slate-500 dark:text-gray-400 font-bold uppercase tracking-wider block mb-2">
                Timeline Horizon
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[30, 45, 60, 90].map((days) => (
                  <button
                    key={days}
                    type="button"
                    onClick={() => setTargetDays(days)}
                    className={`py-2 px-1 rounded-xl border text-center font-bold ${
                      targetDays === days
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                        : 'bg-slate-50 dark:bg-[#171b26] border-slate-200 dark:border-[#1e2230] text-slate-600 dark:text-gray-400'
                    }`}
                  >
                    {days}d
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-slate-500 dark:text-gray-400 font-bold uppercase tracking-wider block mb-2">
                Daily Study Availability
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[2.0, 3.0, 4.0, 5.0].map((hrs) => (
                  <button
                    key={hrs}
                    type="button"
                    onClick={() => setDailyHours(hrs)}
                    className={`py-2 px-1 rounded-xl border text-center font-bold ${
                      dailyHours === hrs
                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                        : 'bg-slate-50 dark:bg-[#171b26] border-slate-200 dark:border-[#1e2230] text-slate-600 dark:text-gray-400'
                    }`}
                  >
                    {hrs}h
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* What Planly Does */}
          <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-900 dark:text-indigo-300 space-y-1.5">
            <h4 className="font-extrabold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              What Planly Will Build For You:
            </h4>
            <p className="text-[11px] text-slate-600 dark:text-gray-300 leading-relaxed">
              Planly will schedule <strong>Striver's core SDE topics & problems</strong> into day-by-day study blocks capped at <strong>{dailyHours} hours/day</strong> over the next <strong>{targetDays} days</strong>. If you miss a session, the Adaptive Rebalance automatically shifts it forward without breaking your timeline!
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-slate-200 dark:border-[#1e2230] bg-slate-50 dark:bg-[#12151e] flex items-center justify-between">
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-gray-400 dark:hover:text-white transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={handleGenerate}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-600/25 transition-all hover:scale-105"
          >
            <span>Generate Planly Roadmap</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
