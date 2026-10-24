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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-lg bg-[#12151e] border border-[#1e2230] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-[#1e2230] flex items-center justify-between">
          <h2 className="text-base font-bold text-white tracking-tight">
            {initialSubject ? 'Edit Subject' : 'Add New Subject'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-[#1e2230] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto flex-1 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 sm:col-span-1">
              <label className="text-[11px] font-medium text-gray-400 block mb-1">
                Subject Name
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Physics"
                className="w-full bg-[#171b26] border border-[#1e2230] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="col-span-2 sm:col-span-1">
              <label className="text-[11px] font-medium text-gray-400 block mb-1">
                Course Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. PHYS 101"
                className="w-full bg-[#171b26] border border-[#1e2230] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-medium text-gray-400 block mb-1">
                Exam Date
              </label>
              <input
                type="date"
                required
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full bg-[#171b26] border border-[#1e2230] rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-medium text-gray-400 block mb-1">
                Color Tag
              </label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full h-8 bg-[#171b26] border border-[#1e2230] rounded-lg cursor-pointer px-1 py-1"
              />
            </div>
          </div>

          {/* Topics */}
          <div className="pt-2 border-t border-[#1e2230]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                Topics & Workload
              </span>
              <button
                type="button"
                onClick={handleAddTopic}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <Plus className="w-3 h-3" /> Add Topic
              </button>
            </div>

            <div className="space-y-2">
              {topics.map((t) => (
                <div
                  key={t.id}
                  className="grid grid-cols-12 gap-2 items-center bg-[#171b26] p-2 rounded-lg border border-[#1e2230]"
                >
                  <input
                    type="text"
                    value={t.name}
                    onChange={(e) => handleUpdateTopic(t.id, 'name', e.target.value)}
                    placeholder="Topic name"
                    className="col-span-6 bg-transparent text-xs text-white focus:outline-none"
                  />

                  <select
                    value={t.difficulty}
                    onChange={(e) =>
                      handleUpdateTopic(t.id, 'difficulty', e.target.value as Difficulty)
                    }
                    className="col-span-3 bg-[#12151e] border border-[#1e2230] text-gray-300 text-xs rounded px-1.5 py-1 focus:outline-none"
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
                      className="w-10 bg-[#12151e] border border-[#1e2230] text-xs text-white rounded px-1 py-1 text-center focus:outline-none"
                    />
                    <span className="text-[10px] text-gray-400">h</span>
                  </div>

                  {topics.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveTopic(t.id)}
                      className="col-span-1 text-gray-500 hover:text-rose-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5 mx-auto" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#1e2230]">
            {initialSubject && onDelete ? (
              <button
                type="button"
                onClick={() => {
                  onDelete(initialSubject.id);
                  onClose();
                }}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Course
              </button>
            ) : (
              <div />
            )}

            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-all"
            >
              <Check className="w-3.5 h-3.5" />
              Save Subject
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
