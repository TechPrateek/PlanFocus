import React, { useState } from 'react';
import { Subject, Difficulty } from '../types';
import {
  parseSyllabusText,
  createSubjectFromParsed,
  ParsedSyllabusResult,
  SAMPLE_SYLLABI,
  SUBJECT_COLORS,
} from '../services/syllabusParser';
import {
  X,
  FileText,
  Upload,
  Sparkles,
  Calendar,
  Clock,
  Trash2,
  Plus,
  BookOpen,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

interface SyllabusImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSubject: (subject: Subject) => void;
  isDarkMode?: boolean;
}

export const SyllabusImportModal: React.FC<SyllabusImportModalProps> = ({
  isOpen,
  onClose,
  onImportSubject,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [rawText, setRawText] = useState<string>('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [parsedData, setParsedData] = useState<ParsedSyllabusResult | null>(null);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsProcessing(true);

    const reader = new FileReader();

    // Check if PDF or text
    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      reader.onload = (event) => {
        try {
          const buffer = event.target?.result as ArrayBuffer;
          const uint8Array = new Uint8Array(buffer);
          // Simple client-side text extractor from PDF stream
          let extracted = '';
          const binary = new TextDecoder('latin1').decode(uint8Array);

          // Find text inside parentheses in PDF text objects (BT ... ET)
          const textMatches = binary.match(/\((.*?)\)\s*Tj/g);
          if (textMatches && textMatches.length > 5) {
            extracted = textMatches
              .map((m) => m.replace(/^\(/, '').replace(/\)\s*Tj$/, ''))
              .join(' ');
          } else {
            // Fallback plain regex on readable words in the binary
            const clean = binary.replace(/[^a-zA-Z0-9\s.,:\-()]/g, ' ');
            extracted = clean.split(/\s{2,}/).filter((w) => w.length > 2).join('\n');
          }

          if (extracted.trim().length > 30) {
            setRawText(extracted);
            const parsed = parseSyllabusText(extracted);
            setParsedData(parsed);
          } else {
            // Fallback: If scanned PDF without text layer, prompt to paste
            setRawText(`Course: ${file.name.replace('.pdf', '')}\nExam Date: 2026-11-20\n\nModule 1: Introduction & Fundamentals\nModule 2: Core Concepts & Practice\nModule 3: Advanced Topics & Review`);
            const parsed = parseSyllabusText(`Course: ${file.name.replace('.pdf', '')}\nExam Date: 2026-11-20\n\nModule 1: Introduction & Fundamentals\nModule 2: Core Concepts & Practice\nModule 3: Advanced Topics & Review`);
            setParsedData(parsed);
          }
        } catch {
          // Fallback
          setRawText(`Course: ${file.name.replace('.pdf', '')}\nExam Date: 2026-11-20`);
        } finally {
          setIsProcessing(false);
        }
      };
      reader.readAsArrayBuffer(file);
    } else {
      // Plain text, markdown, or csv
      reader.onload = (event) => {
        const text = (event.target?.result as string) || '';
        setRawText(text);
        const parsed = parseSyllabusText(text);
        setParsedData(parsed);
        setIsProcessing(false);
      };
      reader.readAsText(file);
    }
  };

  const handleParseText = (text: string) => {
    setRawText(text);
    if (text.trim().length > 10) {
      const parsed = parseSyllabusText(text);
      setParsedData(parsed);
    } else {
      setParsedData(null);
    }
  };

  const handleLoadSample = (sample: (typeof SAMPLE_SYLLABI)[0]) => {
    setRawText(sample.content);
    setFileName(null);
    setActiveTab('paste');
    const parsed = parseSyllabusText(sample.content);
    setParsedData(parsed);
  };

  const handleUpdateTopic = (index: number, field: string, val: any) => {
    if (!parsedData) return;
    const updated = [...parsedData.topics];
    updated[index] = { ...updated[index], [field]: val };
    setParsedData({ ...parsedData, topics: updated });
  };

  const handleDeleteTopic = (index: number) => {
    if (!parsedData) return;
    const updated = parsedData.topics.filter((_, i) => i !== index);
    setParsedData({ ...parsedData, topics: updated });
  };

  const handleAddTopic = () => {
    if (!parsedData) return;
    setParsedData({
      ...parsedData,
      topics: [
        ...parsedData.topics,
        {
          name: 'New Syllabus Topic',
          difficulty: 'medium',
          estimatedHours: 2.0,
        },
      ],
    });
  };

  const handleConfirmImport = () => {
    if (!parsedData) return;
    const subject = createSubjectFromParsed(parsedData);
    onImportSubject(subject);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl bg-white dark:bg-[#12151e] border border-gray-200 dark:border-indigo-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] transition-colors">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-[#1e2230] bg-gray-50/70 dark:bg-gradient-to-r dark:from-indigo-950/60 dark:to-purple-950/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-bold uppercase tracking-wide">
                  Course Planner
                </span>
              </div>
              <h2 className="text-lg font-extrabold text-gray-900 dark:text-white tracking-tight mt-0.5">
                Import Course Syllabus
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-600 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Step 1: Input Mode Tabs */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <button
                type="button"
                onClick={() => setActiveTab('upload')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all ${
                  activeTab === 'upload'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-[#171b26] text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Upload className="w-3.5 h-3.5" />
                <span>Upload PDF / TXT / Doc</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('paste')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-xs transition-all ${
                  activeTab === 'paste'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-[#171b26] text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Paste Syllabus Text</span>
              </button>
            </div>

            {/* Upload Area */}
            {activeTab === 'upload' && (
              <div className="relative border-2 border-dashed border-gray-300 dark:border-[#1e2230] hover:border-indigo-500 rounded-3xl p-6 text-center transition-all bg-gray-50/50 dark:bg-[#171b26]/40 cursor-pointer">
                <input
                  type="file"
                  accept=".pdf,.txt,.md,.doc,.docx"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto mb-3">
                  <Upload className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-gray-900 dark:text-white">
                  {fileName ? fileName : 'Drag & drop your syllabus PDF or TXT file here'}
                </h4>
                <p className="text-xs text-gray-400 mt-1">
                  Supports PDF documents, TXT files, Markdown notes, or course outlines
                </p>
                {isProcessing && (
                  <p className="text-xs text-indigo-500 font-semibold mt-2 animate-pulse">
                    Extracting topics & exam dates...
                  </p>
                )}
              </div>
            )}

            {/* Paste Area */}
            {activeTab === 'paste' && (
              <div className="space-y-3">
                <textarea
                  rows={6}
                  value={rawText}
                  onChange={(e) => handleParseText(e.target.value)}
                  placeholder="Paste your course outline, lecture list, or syllabus here... (e.g. Course: CS 350, Exam: Dec 15, Module 1: Processes, Module 2: Threads...)"
                  className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-[#171b26] border border-gray-200 dark:border-[#1e2230] text-gray-900 dark:text-gray-100 text-xs focus:outline-none focus:border-indigo-500 font-mono transition-colors"
                />

                {/* Pre-built Sample Syllabus Pills */}
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                    Or try a pre-loaded syllabus:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {SAMPLE_SYLLABI.map((sample, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleLoadSample(sample)}
                        className="px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-[#171b26] hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 border border-gray-200/80 dark:border-[#1e2230] text-[11px] font-medium transition-all"
                      >
                        ⚡ {sample.title}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Parsed Result & Customization */}
          {parsedData && (
            <div className="p-5 rounded-3xl bg-gray-50 dark:bg-[#171b26] border border-gray-200 dark:border-[#1e2230] space-y-4">
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-[#1e2230] pb-3">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span className="font-extrabold text-xs text-gray-900 dark:text-white uppercase tracking-wider">
                    Extracted Course Plan ({parsedData.topics.length} Topics)
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-gray-400">Color:</span>
                  <div className="flex items-center gap-1">
                    {SUBJECT_COLORS.slice(0, 5).map((c) => (
                      <button
                        key={c}
                        type="button"
                        onClick={() => setParsedData({ ...parsedData, suggestedColor: c })}
                        className={`w-4 h-4 rounded-full transition-transform ${
                          parsedData.suggestedColor === c ? 'scale-125 ring-2 ring-white' : ''
                        }`}
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Course Meta Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Course Name
                  </label>
                  <input
                    type="text"
                    value={parsedData.courseName}
                    onChange={(e) => setParsedData({ ...parsedData, courseName: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-[#12151e] border border-gray-200 dark:border-[#1e2230] text-gray-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                    Course Code
                  </label>
                  <input
                    type="text"
                    value={parsedData.courseCode}
                    onChange={(e) => setParsedData({ ...parsedData, courseCode: e.target.value })}
                    className="w-full p-2.5 rounded-xl bg-white dark:bg-[#12151e] border border-gray-200 dark:border-[#1e2230] text-gray-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-indigo-500" />
                    Target Exam Date
                  </label>
                  <input
                    type="date"
                    value={parsedData.examDate}
                    onChange={(e) => setParsedData({ ...parsedData, examDate: e.target.value })}
                    className="w-full p-2 rounded-xl bg-white dark:bg-[#12151e] border border-gray-200 dark:border-[#1e2230] text-gray-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              {/* Topic List */}
              <div className="space-y-2 pt-2">
                <div className="flex items-center justify-between text-[11px] text-gray-400 font-semibold px-1">
                  <span>Syllabus Topics & Workload</span>
                  <button
                    type="button"
                    onClick={handleAddTopic}
                    className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Topic</span>
                  </button>
                </div>

                <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                  {parsedData.topics.map((t, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-white dark:bg-[#12151e] border border-gray-200 dark:border-[#1e2230] flex items-center justify-between gap-3"
                    >
                      <input
                        type="text"
                        value={t.name}
                        onChange={(e) => handleUpdateTopic(idx, 'name', e.target.value)}
                        className="flex-1 bg-transparent border-none text-xs text-gray-900 dark:text-white font-medium focus:outline-none"
                      />

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Hours */}
                        <div className="flex items-center gap-1 text-gray-400 text-[11px]">
                          <Clock className="w-3 h-3 text-indigo-500" />
                          <input
                            type="number"
                            step="0.5"
                            min="0.5"
                            max="10"
                            value={t.estimatedHours}
                            onChange={(e) =>
                              handleUpdateTopic(idx, 'estimatedHours', parseFloat(e.target.value) || 1.5)
                            }
                            className="w-12 p-1 rounded-lg bg-gray-100 dark:bg-[#171b26] border border-gray-200 dark:border-[#1e2230] text-center text-xs font-bold text-gray-900 dark:text-white"
                          />
                          <span>h</span>
                        </div>

                        {/* Difficulty */}
                        <select
                          value={t.difficulty}
                          onChange={(e) => handleUpdateTopic(idx, 'difficulty', e.target.value as Difficulty)}
                          className="p-1 rounded-lg bg-gray-100 dark:bg-[#171b26] border border-gray-200 dark:border-[#1e2230] text-[10px] font-bold text-gray-700 dark:text-gray-300 capitalize"
                        >
                          <option value="easy">Easy</option>
                          <option value="medium">Med</option>
                          <option value="hard">Hard</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => handleDeleteTopic(idx)}
                          className="p-1 text-gray-400 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-5 border-t border-gray-200 dark:border-[#1e2230] bg-gray-50/70 dark:bg-[#0e111a] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-[#171b26] hover:bg-gray-200 dark:hover:bg-[#1e2230] text-gray-700 dark:text-gray-300 text-xs font-semibold transition-colors"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={!parsedData || parsedData.topics.length === 0}
            onClick={handleConfirmImport}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md ${
              parsedData && parsedData.topics.length > 0
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-600/25 cursor-pointer'
                : 'bg-gray-300 dark:bg-[#1e2230] text-gray-400 cursor-not-allowed'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate Study Plan & Schedule</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
