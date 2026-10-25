import React, { useState } from 'react';
import { Subject, Topic, Difficulty } from '../types';
import { X, Plus, Trash2, Check } from 'lucide-react';
import { addDays, getTodayDateString } from '../utils/dateUtils';

interface SubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (subject: Subject) => void;
  onDelete?: (subjectId: string) => void;
  initialSubject?: Subject | null;
}

export const SubjectModal: React.FC<SubjectModalProps> = ({
  isOpen,
  onClose,
  onSave,
  onDelete,
  initialSubject,
}) => {
  const today = getTodayDateString();

  const [name, setName] = useState(initialSubject?.name || '');
  const [code, setCode] = useState(initialSubject?.code || '');
  const [color, setColor] = useState(initialSubject?.color || '#6366f1');
  const [examDate, setExamDate] = useState(initialSubject?.examDate || addDays(today, 10));
  const [topics, setTopics] = useState<Topic[]>(
    initialSubject?.topics || [
      {
        id: `top-${Date.now()}`,
        subjectId: initialSubject?.id || '',
        name: 'Unit 1: Fundamentals',
        difficulty: 'medium',
        estimatedHours: 2.0,
        completedHours: 0,
        isCompleted: false,
      },
    ]
  );

  if (!isOpen) return null;

  const handleAddTopic = () => {
    const newTopic: Topic = {
      id: `top-${Date.now()}`,
      subjectId: initialSubject?.id || '',
      name: '',
      difficulty: 'medium',
      estimatedHours: 2.0,
      completedHours: 0,
      isCompleted: false,
    };
    setTopics([...topics, newTopic]);
  };

  const handleRemoveTopic = (id: string) => {
    setTopics(topics.filter((t) => t.id !== id));
  };

  const handleUpdateTopic = (id: string, field: keyof Topic, value: any) => {
    setTopics(topics.map((t) => (t.id === id ? { ...t, [field]: value } : t)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const subjectId = initialSubject?.id || `subj-${Date.now()}`;
    const finalizedTopics = topics.map((t) => ({
      ...t,
      subjectId,
      name: t.name.trim() || 'Untitled Topic',
    }));

    onSave({
      id: subjectId,
      name: name.trim(),
      code: code.trim(),
      color,
      examDate,
      topics: finalizedTopics,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-[#12151e] border border-slate-200 dark:border-[#1e2230] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] transition-colors">
        <div className="p-5 border-b border-slate-200 dark:border-[#1e2230] bg-slate-50 dark:bg-[#171b26] flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
            {initialSubject ? 'Edit Course' : 'Add New Course'}
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1e2230] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 sm:col-span-1">
              <label className="text-[11px] font-bold text-slate-500 dark:text-gray-400 block mb-1">
                Course Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Operating Systems"
                className="w-full bg-slate-50 dark:bg-[#171b26] border border-slate-200 dark:border-[#1e2230] rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="text-[11px] font-bold text-slate-500 dark:text-gray-400 block mb-1">
                Course Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. CS 350"
                className="w-full bg-slate-50 dark:bg-[#171b26] border border-slate-200 dark:border-[#1e2230] rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-500 dark:text-gray-400 block mb-1">
                Exam Date
              </label>
              <input
                type="date"
                required
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-[#171b26] border border-slate-200 dark:border-[#1e2230] rounded-xl px-3 py-1.5 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-500 dark:text-gray-400 block mb-1">
                Color Tag
              </label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full h-9 bg-slate-50 dark:bg-[#171b26] border border-slate-200 dark:border-[#1e2230] rounded-xl cursor-pointer px-1 py-1"
              />
            </div>
          </div>

          {/* Topics */}
          <div className="pt-3 border-t border-slate-200 dark:border-[#1e2230]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-extrabold text-slate-500 dark:text-gray-400 uppercase tracking-wider">
                Topics & Workload
              </span>
              <button
                type="button"
                onClick={handleAddTopic}
                className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Topic
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {topics.map((t) => (
                <div
                  key={t.id}
                  className="grid grid-cols-12 gap-2 items-center bg-slate-50 dark:bg-[#171b26] p-2.5 rounded-xl border border-slate-200 dark:border-[#1e2230]"
                >
                  <input
                    type="text"
                    value={t.name}
                    onChange={(e) => handleUpdateTopic(t.id, 'name', e.target.value)}
                    placeholder="Topic name"
                    className="col-span-6 bg-transparent text-xs text-slate-900 dark:text-white font-medium focus:outline-none"
                  />

                  <select
                    value={t.difficulty}
                    onChange={(e) =>
                      handleUpdateTopic(t.id, 'difficulty', e.target.value as Difficulty)
                    }
                    className="col-span-3 bg-white dark:bg-[#12151e] border border-slate-200 dark:border-[#1e2230] text-slate-700 dark:text-gray-300 text-xs rounded-lg px-2 py-1 focus:outline-none font-bold"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>

                  <div className="col-span-2 flex items-center gap-1">
                    <input
                      type="number"
                      step="0.5"
                      min="0.5"
                      max="10"
                      value={t.estimatedHours}
                      onChange={(e) =>
                        handleUpdateTopic(t.id, 'estimatedHours', parseFloat(e.target.value) || 1)
                      }
                      className="w-10 bg-white dark:bg-[#12151e] border border-slate-200 dark:border-[#1e2230] text-xs text-slate-900 dark:text-white rounded-lg px-1 py-1 text-center font-bold focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-400">h</span>
                  </div>

                  {topics.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTopic(t.id)}
                      className="col-span-1 text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5 mx-auto" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-[#1e2230]">
            {initialSubject && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  onDelete(initialSubject.id);
                  onClose();
                }}
                className="text-xs text-rose-600 dark:text-rose-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Course
              </button>
            ) : (
              <div />
            )}

            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-600/20 transition-all"
            >
              <Check className="w-3.5 h-3.5" />
              Save Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
