import React, { useState, useMemo } from 'react';
import { Subject, ScheduledTask, Difficulty } from '../types';
import { TufyAiModal } from './TufyAiModal';
import {
  Sparkles,
  Search,
  CheckCircle,
  Circle,
  Star,
  ExternalLink,
  Play,
  Bot,
  ChevronDown,
  ChevronRight,
  Filter,
  Award,
  Zap,
  RotateCcw,
  BookOpen,
} from 'lucide-react';

interface PlanlyRoadmapViewProps {
  subjects: Subject[];
  dailyCapacity: number;
  onCompleteTopic: (topicId: string) => void;
  onToggleRevision: (topicId: string) => void;
  onStartFocus: (task: ScheduledTask) => void;
  onSimulateMissed: (task: ScheduledTask) => void;
  onRebalance: () => void;
  onOpenConfigure: () => void;
  geminiApiKey?: string;
}

export const PlanlyRoadmapView: React.FC<PlanlyRoadmapViewProps> = ({
  subjects,
  dailyCapacity,
  onCompleteTopic,
  onToggleRevision,
  onStartFocus,
  onSimulateMissed,
  onRebalance,
  onOpenConfigure,
  geminiApiKey,
}) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'completed' | 'revision'>('all');
  const [selectedStep, setSelectedStep] = useState<number | 'all'>('all');
  const [expandedSteps, setExpandedSteps] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: true,
    4: true,
    5: true,
    6: true,
    7: true,
    8: true,
  });

  // TUFY AI modal state
  const [tufyModalOpen, setTufyModalOpen] = useState<boolean>(false);
  const [selectedProblemName, setSelectedProblemName] = useState<string | null>(null);
  const [selectedProblemPattern, setSelectedProblemPattern] = useState<string | undefined>(undefined);

  // Flatten all topics across subjects
  const allTopics = useMemo(() => {
    return subjects.flatMap((s) =>
      s.topics.map((t) => ({
        ...t,
        subjectName: s.name,
        subjectColor: s.color,
        subjectExamDate: s.examDate,
      }))
    );
  }, [subjects]);

  // Overall metrics
  const totalCount = allTopics.length;
  const completedCount = allTopics.filter((t) => t.isCompleted).length;
  const revisionCount = allTopics.filter((t) => t.needsRevision).length;
  const totalHours = allTopics.reduce((acc, t) => acc + t.estimatedHours, 0);
  const completedHours = allTopics.reduce((acc, t) => acc + (t.isCompleted ? t.estimatedHours : t.completedHours), 0);
  const remainingHours = Number((totalHours - completedHours).toFixed(1));
  const completionPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const readinessScore = Math.min(100, Math.round(completionPercent * 0.75 + (completedCount > 0 ? 25 : 0)));

  // Filtered topics
  const filteredTopics = useMemo(() => {
    return allTopics.filter((t) => {
      // Search
      const matchesSearch =
        searchQuery.trim() === '' ||
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (t.pattern && t.pattern.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (t.stepTitle && t.stepTitle.toLowerCase().includes(searchQuery.toLowerCase()));

      // Difficulty
      const matchesDifficulty = selectedDifficulty === 'all' || t.difficulty === selectedDifficulty;

      // Status
      let matchesStatus = true;
      if (selectedStatus === 'pending') matchesStatus = !t.isCompleted;
      if (selectedStatus === 'completed') matchesStatus = t.isCompleted;
      if (selectedStatus === 'revision') matchesStatus = !!t.needsRevision;

      // Step
      const matchesStep = selectedStep === 'all' || t.step === selectedStep;

      return matchesSearch && matchesDifficulty && matchesStatus && matchesStep;
    });
  }, [allTopics, searchQuery, selectedDifficulty, selectedStatus, selectedStep]);

  // Group by step
  const stepGroups = useMemo(() => {
    const groups: Record<number, { title: string; topics: typeof allTopics }> = {};

    filteredTopics.forEach((t) => {
      const stepNum = t.step || 1;
      const stepTitle = t.stepTitle || `Step ${stepNum}: Core Practice`;

      if (!groups[stepNum]) {
        groups[stepNum] = { title: stepTitle, topics: [] };
      }
      groups[stepNum].topics.push(t);
    });

    return Object.entries(groups)
      .map(([stepStr, data]) => ({
        step: Number(stepStr),
        title: data.title,
        topics: data.topics,
      }))
      .sort((a, b) => a.step - b.step);
  }, [filteredTopics]);

  const toggleStepAccordion = (step: number) => {
    setExpandedSteps((prev) => ({
      ...prev,
      [step]: !prev[step],
    }));
  };

  const handleOpenTufy = (name: string, pattern?: string) => {
    setSelectedProblemName(name);
    setSelectedProblemPattern(pattern);
    setTufyModalOpen(true);
  };

  const handleStartFocusFromProblem = (probName: string) => {
    const topic = allTopics.find((t) => t.name === probName);
    if (topic) {
      const task: ScheduledTask = {
        id: `task-${topic.id}-${Date.now()}`,
        topicId: topic.id,
        subjectId: topic.subjectId,
        topicName: topic.name,
        subjectName: topic.subjectName,
        subjectColor: topic.subjectColor,
        difficulty: topic.difficulty,
        date: new Date().toISOString().split('T')[0],
        durationHours: topic.estimatedHours,
        isCompleted: topic.isCompleted,
        isMissed: false,
        priorityScore: 10,
        pattern: topic.pattern,
        problemUrl: topic.problemUrl,
        needsRevision: topic.needsRevision,
        step: topic.step,
        stepTitle: topic.stepTitle,
      };
      onStartFocus(task);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner: takeUforward Planly SDE Roadmap Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#101426] via-[#15192c] to-[#121524] border border-indigo-500/30 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-mono text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3 h-3" />
                takeUforward Planly
              </span>
              <span className="px-2 py-0.5 rounded-full bg-indigo-950/80 border border-indigo-500/40 text-indigo-300 font-mono text-[10px] font-semibold">
                Striver's A2Z & SDE Sheet Sprint
              </span>
              <span className="px-2 py-0.5 rounded-full bg-[#1e2230] text-gray-300 font-mono text-[10px]">
                Target: FAANG / Top Product Firms
              </span>
            </div>

            <h1 className="text-2xl font-black tracking-tight text-white">
              Planly SDE Preparation Roadmap
            </h1>
            <p className="text-xs text-gray-300 max-w-2xl leading-relaxed">
              Personalized algorithmic roadmap powered by Striver's pattern sheets. Features adaptive replanning when days are missed, TUFY AI intuition breakdowns, and direct takeUforward practice links.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 flex-shrink-0">
            <button
              onClick={onOpenConfigure}
              className="px-4 py-2 rounded-xl bg-[#1e2230] hover:bg-[#252b3d] text-white text-xs font-bold border border-gray-700 transition-all flex items-center gap-2 shadow-sm"
            >
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Configure Planly</span>
            </button>

            {/* Judge Demo: Simulate Missed Day */}
            <button
              onClick={() => {
                const firstPending = allTopics.find((t) => !t.isCompleted);
                if (firstPending) {
                  const task: ScheduledTask = {
                    id: `task-${firstPending.id}-sim`,
                    topicId: firstPending.id,
                    subjectId: firstPending.subjectId,
                    topicName: firstPending.name,
                    subjectName: firstPending.subjectName,
                    subjectColor: firstPending.subjectColor,
                    difficulty: firstPending.difficulty,
                    date: new Date().toISOString().split('T')[0],
                    durationHours: firstPending.estimatedHours,
                    isCompleted: false,
                    isMissed: true,
                    priorityScore: 10,
                    pattern: firstPending.pattern,
                    problemUrl: firstPending.problemUrl,
                  };
                  onSimulateMissed(task);
                }
              }}
              className="px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-bold transition-all flex items-center gap-1.5 shadow-sm"
              title="Simulate a missed day to showcase dynamic adaptive rescheduling"
            >
              <span>Simulate Missed Day</span>
            </button>

            <button
              onClick={onRebalance}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-indigo-600/25"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Adaptive Rebalance</span>
            </button>
          </div>
        </div>

        {/* Planly Progress Bar */}
        <div className="mt-6 pt-5 border-t border-[#1e2230] grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase text-gray-400 block mb-0.5">
              Sheet Completion
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-xl font-extrabold text-white">
                {completedCount} <span className="text-xs font-normal text-gray-400">/ {totalCount}</span>
              </span>
              <span className="text-xs font-bold text-indigo-400">{completionPercent}%</span>
            </div>
            <div className="w-full bg-[#1e2230] h-1.5 rounded-full mt-1.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${completionPercent}%` }}
              />
            </div>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase text-gray-400 block mb-0.5">
              Readiness Score
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold text-emerald-400">{readinessScore}%</span>
              <Award className="w-4 h-4 text-emerald-400" />
            </div>
            <span className="text-[10px] text-gray-400">FAANG SDE Target</span>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase text-gray-400 block mb-0.5">
              Remaining Workload
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold text-white">{remainingHours}h</span>
            </div>
            <span className="text-[10px] text-gray-400">Cap: {dailyCapacity}h / day</span>
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase text-gray-400 block mb-0.5">
              Starred for Revision
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold text-amber-400">{revisionCount}</span>
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            </div>
            <span className="text-[10px] text-gray-400">Spaced repetition</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="p-4 rounded-2xl bg-white dark:bg-[#12151e] border border-gray-200/80 dark:border-[#1e2230] shadow-sm space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search problems by name, pattern (e.g. Kadane, Two Pointers, Binary Search)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-gray-50 dark:bg-[#171b26] border border-gray-200 dark:border-[#1e2230] text-xs text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Difficulty & Status Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#171b26] p-1 rounded-xl border border-gray-200/60 dark:border-[#1e2230]">
              <Filter className="w-3.5 h-3.5 text-gray-400 ml-1.5" />
              {(['all', 'easy', 'medium', 'hard'] as const).map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase transition-all ${
                    selectedDifficulty === diff
                      ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm'
                      : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#171b26] p-1 rounded-xl border border-gray-200/60 dark:border-[#1e2230]">
              {(['all', 'pending', 'completed', 'revision'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setSelectedStatus(status)}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-bold capitalize transition-all ${
                    selectedStatus === status
                      ? 'bg-indigo-600 text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Step Navigation Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          <button
            onClick={() => setSelectedStep('all')}
            className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap ${
              selectedStep === 'all'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'bg-gray-100 dark:bg-[#171b26] text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
            }`}
          >
            All Steps ({allTopics.length})
          </button>

          {[
            { step: 1, label: '1: Basics' },
            { step: 2, label: '2: Arrays' },
            { step: 3, label: '3: Binary Search' },
            { step: 4, label: '4: Linked List' },
            { step: 5, label: '5: Trees' },
            { step: 6, label: '6: Graphs' },
            { step: 7, label: '7: DP' },
            { step: 8, label: '8: CS Core' },
          ].map(({ step, label }) => (
            <button
              key={step}
              onClick={() => setSelectedStep(step)}
              className={`px-3 py-1 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap ${
                selectedStep === step
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-gray-100 dark:bg-[#171b26] text-gray-500 hover:text-gray-900 dark:hover:text-gray-200'
              }`}
            >
              Step {label}
            </button>
          ))}
        </div>
      </div>

      {/* Step Accordion List */}
      <div className="space-y-4">
        {stepGroups.length === 0 ? (
          <div className="py-12 text-center bg-white dark:bg-[#12151e] rounded-3xl border border-gray-200/80 dark:border-[#1e2230] p-8">
            <BookOpen className="w-10 h-10 text-gray-400 mx-auto mb-3" />
            <h3 className="text-sm font-bold text-gray-900 dark:text-white">
              No matching problems found
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Try adjusting your search keywords or clearing active filters.
            </p>
          </div>
        ) : (
          stepGroups.map((group) => {
            const isExpanded = !!expandedSteps[group.step];
            const groupCompleted = group.topics.filter((t) => t.isCompleted).length;
            const groupTotal = group.topics.length;
            const groupPercent = groupTotal > 0 ? Math.round((groupCompleted / groupTotal) * 100) : 0;

            return (
              <div
                key={group.step}
                className="rounded-3xl border border-gray-200/80 dark:border-[#1e2230] bg-white dark:bg-[#12151e] overflow-hidden shadow-sm transition-all"
              >
                {/* Step Accordion Header */}
                <div
                  onClick={() => toggleStepAccordion(group.step)}
                  className="p-4 sm:px-6 cursor-pointer flex items-center justify-between bg-gray-50/70 dark:bg-[#171b26]/70 hover:bg-gray-100/70 dark:hover:bg-[#171b26] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-indigo-500" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      )}
                    </button>

                    <div>
                      <h3 className="text-sm font-extrabold text-gray-900 dark:text-white">
                        {group.title}
                      </h3>
                      <span className="text-[10px] text-gray-400">
                        {groupTotal} Core Interview Problems
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="hidden sm:flex flex-col items-end">
                      <span className="text-xs font-bold text-gray-800 dark:text-gray-200">
                        {groupCompleted} / {groupTotal} Solved
                      </span>
                      <div className="w-24 bg-gray-200 dark:bg-[#1e2230] h-1.5 rounded-full mt-1 overflow-hidden">
                        <div
                          className="bg-indigo-600 h-full rounded-full transition-all duration-300"
                          style={{ width: `${groupPercent}%` }}
                        />
                      </div>
                    </div>

                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                        groupPercent === 100
                          ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300'
                          : 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-300'
                      }`}
                    >
                      {groupPercent}%
                    </span>
                  </div>
                </div>

                {/* Problems Table inside Step */}
                {isExpanded && (
                  <div className="divide-y divide-gray-100 dark:divide-[#1e2230]/70">
                    {group.topics.map((topic) => {
                      const diffColors: Record<Difficulty, { badge: string; text: string }> = {
                        easy: {
                          badge: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-500/20',
                          text: 'Easy',
                        },
                        medium: {
                          badge: 'bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-500/20',
                          text: 'Med',
                        },
                        hard: {
                          badge: 'bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300 border border-rose-500/20',
                          text: 'Hard',
                        },
                      };

                      return (
                        <div
                          key={topic.id}
                          className={`p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
                            topic.isCompleted
                              ? 'bg-emerald-50/20 dark:bg-emerald-950/10'
                              : 'hover:bg-gray-50/50 dark:hover:bg-[#171b26]/50'
                          }`}
                        >
                          {/* Left: Checkbox + Name + Pattern */}
                          <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                            <button
                              onClick={() => onCompleteTopic(topic.id)}
                              className="mt-0.5 sm:mt-0 flex-shrink-0 text-gray-300 hover:text-emerald-500 transition-colors"
                              title={topic.isCompleted ? 'Mark Pending' : 'Mark Completed'}
                            >
                              {topic.isCompleted ? (
                                <CheckCircle className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />
                              ) : (
                                <Circle className="w-5 h-5 text-gray-400 hover:border-emerald-500" />
                              )}
                            </button>

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <h4
                                  className={`text-xs font-bold transition-all ${
                                    topic.isCompleted
                                      ? 'line-through text-gray-400 dark:text-gray-500'
                                      : 'text-gray-900 dark:text-white'
                                  }`}
                                >
                                  {topic.name}
                                </h4>

                                <span
                                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                                    diffColors[topic.difficulty].badge
                                  }`}
                                >
                                  {diffColors[topic.difficulty].text}
                                </span>

                                {topic.pattern && (
                                  <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-gray-100 dark:bg-[#1e2230] text-indigo-500 dark:text-indigo-400 font-semibold">
                                    ⚡ {topic.pattern}
                                  </span>
                                )}
                              </div>
                              <span className="text-[10px] text-gray-400 block mt-0.5">
                                Est. {topic.estimatedHours}h • {topic.subjectName}
                              </span>
                            </div>
                          </div>

                          {/* Right: Actions (Bookmark, TUFY AI, Practice Link, Focus Timer) */}
                          <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center">
                            {/* Revision Bookmark */}
                            <button
                              onClick={() => onToggleRevision(topic.id)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                topic.needsRevision
                                  ? 'text-amber-400 bg-amber-500/10'
                                  : 'text-gray-400 hover:text-amber-400 hover:bg-gray-100 dark:hover:bg-[#1a1f2c]'
                              }`}
                              title={topic.needsRevision ? 'Starred for Revision' : 'Bookmark for Revision'}
                            >
                              <Star
                                className={`w-4 h-4 ${
                                  topic.needsRevision ? 'fill-amber-400' : ''
                                }`}
                              />
                            </button>

                            {/* TUFY AI Tutor */}
                            <button
                              onClick={() => handleOpenTufy(topic.name, topic.pattern)}
                              className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-300 border border-purple-500/20 text-[11px] font-bold transition-all"
                              title="Ask TUFY for Intuition, Brute-Force & Optimal Approach"
                            >
                              <Bot className="w-3.5 h-3.5 text-purple-400" />
                              <span>Ask TUFY</span>
                            </button>

                            {/* Practice on TUF Link */}
                            {topic.problemUrl && (
                              <a
                                href={topic.problemUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border border-indigo-500/20 text-[11px] font-bold transition-all"
                              >
                                <span>Solve</span>
                                <ExternalLink className="w-3 h-3" />
                              </a>
                            )}

                            {/* Start Pomodoro Focus */}
                            <button
                              onClick={() => handleStartFocusFromProblem(topic.name)}
                              className="flex items-center gap-1 px-3 py-1 rounded-xl bg-black dark:bg-white text-white dark:text-black hover:opacity-90 text-[11px] font-bold transition-all shadow-sm"
                            >
                              <Play className="w-3 h-3 fill-current" />
                              <span>Focus</span>
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Interactive TUFY AI Companion Modal */}
      <TufyAiModal
        isOpen={tufyModalOpen}
        onClose={() => setTufyModalOpen(false)}
        problemName={selectedProblemName}
        pattern={selectedProblemPattern}
        onStartFocus={handleStartFocusFromProblem}
        geminiApiKey={geminiApiKey}
      />
    </div>
  );
};
