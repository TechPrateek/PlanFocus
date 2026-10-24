import React, { useState } from 'react';
import { Subject, Topic, Difficulty } from '../types';
import { X, Plus, Trash2, ArrowRight, ArrowLeft, Check, Sparkles, Clock } from 'lucide-react';
import { addDays, getTodayDateString } from '../utils/dateUtils';

interface SetupWizardProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (subjects: Subject[], dailyHours: number) => void;
  onLoadSample: () => void;
}

export const SetupWizard: React.FC<SetupWizardProps> = ({
  isOpen,
  onClose,
  onComplete,
  onLoadSample,
}) => {
  const [step, setStep] = useState<1 | 2>(1);
  const [dailyHours, setDailyHours] = useState<number>(3.0);

  // Subject drafting state
  const today = getTodayDateString();
  const [subjects, setSubjects] = useState<Subject[]>([
    {
      id: 'subj-init-1',
      name: 'Computer Science',
      code: 'CS 101',
      color: '#6366f1',
      examDate: addDays(today, 10),
      topics: [
        {
          id: 'top-1',
          subjectId: 'subj-init-1',
          name: 'Arrays & Linked Lists',
          difficulty: 'medium',
          estimatedHours: 2.0,
          completedHours: 0,
          isCompleted: false,
        },
      ],
    },
  ]);

  if (!isOpen) return null;

  const handleAddSubject = () => {
    const newSubj: Subject = {
      id: `subj-${Date.now()}`,
      name: 'New Subject',
      code: '',
      color: '#10b981',
      examDate: addDays(today, 14),
      topics: [
        {
          id: `top-${Date.now()}`,
          subjectId: `subj-${Date.now()}`,
          name: 'Core Topic 1',
          difficulty: 'medium',
          estimatedHours: 2.0,
          completedHours: 0,
          isCompleted: false,
        },
      ],
    };
    setSubjects([...subjects, newSubj]);
  };

  const handleRemoveSubject = (id: string) => {
    setSubjects(subjects.filter((s) => s.id !== id));
  };

  const handleUpdateSubject = (id: string, field: keyof Subject, value: any) => {
    setSubjects(
      subjects.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleAddTopic = (subjectId: string) => {
    setSubjects(
      subjects.map((s) => {
        if (s.id === subjectId) {
          const newTop: Topic = {
            id: `top-${Date.now()}`,
            subjectId,
            name: 'New Topic',
            difficulty: 'medium',
            estimatedHours: 2.0,
            completedHours: 0,
            isCompleted: false,
          };
          return { ...s, topics: [...s.topics, newTop] };
        }
        return s;
      })
    );
  };

  const handleRemoveTopic = (subjectId: string, topicId: string) => {
    setSubjects(
      subjects.map((s) => {
        if (s.id === subjectId) {
          return { ...s, topics: s.topics.filter((t) => t.id !== topicId) };
        }
        return s;
      })
    );
  };

  const handleUpdateTopic = (
    subjectId: string,
    topicId: string,
    field: keyof Topic,
    value: any
  ) => {
    setSubjects(
      subjects.map((s) => {
        if (s.id === subjectId) {
          return {
            ...s,
            topics: s.topics.map((t) => (t.id === topicId ? { ...t, [field]: value } : t)),
          };
        }
        return s;
      })
    );
  };

  const handleSubmit = () => {
    if (subjects.length === 0) return;
    onComplete(subjects, dailyHours);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-[#12151e] border border-[#1e2230] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-[#1e2230] flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-semibold text-indigo-400 uppercase tracking-wider">
                Step {step} of 2
              </span>
              <span className="text-gray-500">•</span>
              <span className="text-xs text-gray-400">
                {step === 1 ? 'Study Availability' : 'Subjects & Exam Dates'}
              </span>
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight mt-0.5">
              Quick Setup Wizard
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onLoadSample();
                onClose();
              }}
              className="px-2.5 py-1 text-xs rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/20 transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Use Sample Plan
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#1e2230] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {step === 1 ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-base font-semibold text-white mb-1">
                  How many hours can you realistically study per day?
                </h3>
                <p className="text-xs text-gray-400">
                  FocusFlow AI will budget daily study blocks up to this limit to keep your plan achievable and prevent burnout.
                </p>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {[1.5, 2.0, 3.0, 4.0].map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => setDailyHours(h)}
                    className={`py-4 px-3 rounded-xl border text-center transition-all ${
                      dailyHours === h
                        ? 'border-indigo-500 bg-indigo-500/10 text-white shadow-sm'
                        : 'border-[#1e2230] bg-[#171b26] text-gray-400 hover:border-gray-600'
                    }`}
                  >
                    <div className="text-xl font-bold font-mono">{h}h</div>
                    <div className="text-[11px] text-gray-400 mt-0.5">per day</div>
                  </button>
                ))}
              </div>

              <div className="p-4 rounded-xl bg-[#171b26] border border-[#1e2230] flex items-center gap-3">
                <Clock className="w-5 h-5 text-indigo-400 flex-shrink-0" />
                <div className="text-xs text-gray-300">
                  You can always adjust this capacity later. FocusFlow AI rebalances schedules immediately if your availability shifts.
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-white mb-0.5">
                    Your Courses & Exam Dates
                  </h3>
                  <p className="text-xs text-gray-400">
                    Add subjects and their estimated exam dates.
                  </p>
                </div>

                <button
                  onClick={handleAddSubject}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#171b26] hover:bg-[#1e2230] border border-[#1e2230] text-xs font-semibold text-white transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Course
                </button>
              </div>

              <div className="space-y-4">
                {subjects.map((subj) => (
                  <div
                    key={subj.id}
                    className="p-4 rounded-xl bg-[#171b26] border border-[#1e2230] space-y-3"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <label className="text-[11px] font-medium text-gray-400 block mb-1">
                          Course Name
                        </label>
                        <input
                          type="text"
                          value={subj.name}
                          onChange={(e) => handleUpdateSubject(subj.id, 'name', e.target.value)}
                          className="w-full bg-[#12151e] border border-[#1e2230] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-medium text-gray-400 block mb-1">
                          Exam Date
                        </label>
                        <input
                          type="date"
                          value={subj.examDate}
                          onChange={(e) => handleUpdateSubject(subj.id, 'examDate', e.target.value)}
                          className="w-full bg-[#12151e] border border-[#1e2230] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
                        />
                      </div>

                      <div className="flex items-end justify-between gap-2">
                        <div className="flex-1">
                          <label className="text-[11px] font-medium text-gray-400 block mb-1">
                            Color Tag
                          </label>
                          <input
                            type="color"
                            value={subj.color}
                            onChange={(e) => handleUpdateSubject(subj.id, 'color', e.target.value)}
                            className="w-full h-8 bg-[#12151e] border border-[#1e2230] rounded-lg cursor-pointer px-1 py-1"
                          />
                        </div>

                        {subjects.length > 1 && (
                          <button
                            onClick={() => handleRemoveSubject(subj.id)}
                            className="p-2 rounded-lg text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                            title="Remove Subject"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Topics Sub-list */}
                    <div className="pt-2 border-t border-[#1e2230]/70">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                          Topics / Chapters
                        </span>
                        <button
                          onClick={() => handleAddTopic(subj.id)}
                          className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                        >
                          <Plus className="w-3 h-3" /> Add Topic
                        </button>
                      </div>

                      <div className="space-y-2">
                        {subj.topics.map((t) => (
                          <div
                            key={t.id}
                            className="grid grid-cols-12 gap-2 items-center bg-[#12151e] p-2 rounded-lg border border-[#1e2230]"
                          >
                            <input
                              type="text"
                              value={t.name}
                              onChange={(e) =>
                                handleUpdateTopic(subj.id, t.id, 'name', e.target.value)
                              }
                              placeholder="Topic name"
                              className="col-span-6 bg-transparent text-xs text-white focus:outline-none"
                            />

                            <select
                              value={t.difficulty}
                              onChange={(e) =>
                                handleUpdateTopic(
                                  subj.id,
                                  t.id,
                                  'difficulty',
                                  e.target.value as Difficulty
                                )
                              }
                              className="col-span-3 bg-[#171b26] border border-[#1e2230] text-gray-300 text-xs rounded px-1.5 py-1 focus:outline-none"
                            >
                              <option value="easy">Easy (1x)</option>
                              <option value="medium">Medium (1.5x)</option>
                              <option value="hard">Hard (2x)</option>
                            </select>

                            <div className="col-span-2 flex items-center gap-1">
                              <input
                                type="number"
                                step="0.5"
                                min="0.5"
                                max="10"
                                value={t.estimatedHours}
                                onChange={(e) =>
                                  handleUpdateTopic(
                                    subj.id,
                                    t.id,
                                    'estimatedHours',
                                    parseFloat(e.target.value) || 1
                                  )
                                }
                                className="w-12 bg-[#171b26] border border-[#1e2230] text-xs text-white rounded px-1.5 py-1 text-center focus:outline-none"
                              />
                              <span className="text-[10px] text-gray-400">h</span>
                            </div>

                            <button
                              onClick={() => handleRemoveTopic(subj.id, t.id)}
                              className="col-span-1 text-gray-500 hover:text-rose-400 transition-colors"
                            >
                              <Trash2 className="w-3.5 h-3.5 mx-auto" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1e2230] bg-[#12151e] flex items-center justify-between">
          {step === 2 ? (
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Back
            </button>
          ) : (
            <div />
          )}

          {step === 1 ? (
            <button
              onClick={() => setStep(2)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all"
            >
              Continue
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Check className="w-3.5 h-3.5" />
              Generate Study Plan
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
