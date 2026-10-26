import React, { useState } from 'react';
import { Subject, Difficulty } from '../types';
import {
  parseMultiCourseSyllabus,
  parseSyllabusWithGemini,
  createSubjectFromParsed,
  ParsedSyllabusResult,
  MultiCourseSyllabusResult,
  SAMPLE_SYLLABI,
  SUBJECT_COLORS,
} from '../services/syllabusParser';
import { extractTextFromPdf } from '../services/pdfReader';
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
  Key,
  AlertCircle,
  RefreshCw,
  GraduationCap,
  CheckSquare,
  Square,
} from 'lucide-react';

interface SyllabusImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSubject: (subject: Subject) => void;
  onImportMultipleSubjects?: (subjects: Subject[]) => void;
  isDarkMode?: boolean;
  geminiApiKey?: string;
}

export const SyllabusImportModal: React.FC<SyllabusImportModalProps> = ({
  isOpen,
  onClose,
  onImportSubject,
  onImportMultipleSubjects,
  geminiApiKey,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [rawText, setRawText] = useState<string>('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isAiProcessing, setIsAiProcessing] = useState<boolean>(false);
  const [aiError, setAiError] = useState<string | null>(null);
  
  // Multi-course state (e.g. B.Tech 4th Year Curriculum)
  const [multiCourseResult, setMultiCourseResult] = useState<MultiCourseSyllabusResult | null>(null);
  const [activeCourseIndex, setActiveCourseIndex] = useState<number>(0);
  const [selectedCourseIndices, setSelectedCourseIndices] = useState<number[]>([]);
  const [customApiKey, setCustomApiKey] = useState<string>('');
  const [showKeyInput, setShowKeyInput] = useState<boolean>(false);

  if (!isOpen) return null;

  const effectiveApiKey = geminiApiKey || customApiKey;

  const currentCourse: ParsedSyllabusResult | null =
    multiCourseResult && multiCourseResult.courses[activeCourseIndex]
      ? multiCourseResult.courses[activeCourseIndex]
      : null;

  // Process extracted raw text into single or multi-course results
  const processExtractedText = (text: string) => {
    setRawText(text);
    setAiError(null);
    if (text.trim().length > 15) {
      const parsed = parseMultiCourseSyllabus(text);
      setMultiCourseResult(parsed);
      setActiveCourseIndex(0);
      setSelectedCourseIndices(parsed.courses.map((_, idx) => idx));
    } else {
      setMultiCourseResult(null);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    setIsProcessing(true);
    setAiError(null);

    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      try {
        const buffer = await file.arrayBuffer();
        const extracted = await extractTextFromPdf(buffer);

        if (extracted.trim().length > 30) {
          processExtractedText(extracted);
        } else {
          // Fallback starter template
          const fallbackText = `Course: ${file.name.replace('.pdf', '')}\nFinal Exam Date: 2026-11-20\n\nModule 1: Introduction & Architecture\nModule 2: Core Theoretical Principles\nModule 3: Algorithms & Analysis\nModule 4: Advanced Problem Solving\nModule 5: Final Review & Synthesis`;
          processExtractedText(fallbackText);
        }
      } catch (err: any) {
        console.error('PDF parsing failed:', err);
        const fallbackText = `Course: ${file.name.replace('.pdf', '')}\nFinal Exam Date: 2026-11-20`;
        processExtractedText(fallbackText);
      } finally {
        setIsProcessing(false);
      }
    } else {
      // Plain text, markdown, or doc
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = (event.target?.result as string) || '';
        processExtractedText(text);
        setIsProcessing(false);
      };
      reader.readAsText(file);
    }
  };

  const handleLoadSample = (sample: (typeof SAMPLE_SYLLABI)[0]) => {
    setRawText(sample.content);
    setFileName(null);
    setActiveTab('paste');
    processExtractedText(sample.content);
  };

  const handleRunAiExtraction = async () => {
    if (!effectiveApiKey) {
      setShowKeyInput(true);
      return;
    }

    if (!rawText.trim()) return;

    setIsAiProcessing(true);
    setAiError(null);

    try {
      const result = await parseSyllabusWithGemini(rawText, effectiveApiKey);
      setMultiCourseResult(result);
      setActiveCourseIndex(0);
      setSelectedCourseIndices(result.courses.map((_, idx) => idx));
    } catch (err: any) {
      setAiError(err.message || 'Gemini AI parsing failed. Reverted to offline heuristic engine.');
      if (!multiCourseResult) {
        processExtractedText(rawText);
      }
    } finally {
      setIsAiProcessing(false);
    }
  };

  const handleUpdateTopic = (index: number, field: string, val: any) => {
    if (!multiCourseResult || !currentCourse) return;
    const updatedTopics = [...currentCourse.topics];
    updatedTopics[index] = { ...updatedTopics[index], [field]: val };

    const updatedCourses = [...multiCourseResult.courses];
    updatedCourses[activeCourseIndex] = {
      ...currentCourse,
      topics: updatedTopics,
    };

    setMultiCourseResult({
      ...multiCourseResult,
      courses: updatedCourses,
    });
  };

  const handleDeleteTopic = (index: number) => {
    if (!multiCourseResult || !currentCourse) return;
    const updatedTopics = currentCourse.topics.filter((_, i) => i !== index);

    const updatedCourses = [...multiCourseResult.courses];
    updatedCourses[activeCourseIndex] = {
      ...currentCourse,
      topics: updatedTopics,
    };

    setMultiCourseResult({
      ...multiCourseResult,
      courses: updatedCourses,
    });
  };

  const handleAddTopic = () => {
    if (!multiCourseResult || !currentCourse) return;
    const updatedTopics = [
      ...currentCourse.topics,
      {
        name: `Unit ${currentCourse.topics.length + 1}: New Syllabus Topic`,
        difficulty: 'medium' as Difficulty,
        estimatedHours: 4.0,
      },
    ];

    const updatedCourses = [...multiCourseResult.courses];
    updatedCourses[activeCourseIndex] = {
      ...currentCourse,
      topics: updatedTopics,
    };

    setMultiCourseResult({
      ...multiCourseResult,
      courses: updatedCourses,
    });
  };

  const handleUpdateCourseMeta = (field: keyof ParsedSyllabusResult, val: any) => {
    if (!multiCourseResult || !currentCourse) return;
    const updatedCourses = [...multiCourseResult.courses];
    updatedCourses[activeCourseIndex] = {
      ...currentCourse,
      [field]: val,
    };

    setMultiCourseResult({
      ...multiCourseResult,
      courses: updatedCourses,
    });
  };

  const handleToggleCourseSelection = (idx: number) => {
    if (selectedCourseIndices.includes(idx)) {
      if (selectedCourseIndices.length > 1) {
        setSelectedCourseIndices(selectedCourseIndices.filter((i) => i !== idx));
      }
    } else {
      setSelectedCourseIndices([...selectedCourseIndices, idx]);
    }
  };

  // Import single active course
  const handleConfirmSingleImport = () => {
    if (!currentCourse) return;
    const subject = createSubjectFromParsed(currentCourse);
    onImportSubject(subject);
    onClose();
  };

  // Import all selected B.Tech courses at once
  const handleConfirmMultiImport = () => {
    if (!multiCourseResult) return;
    const subjectsToImport = multiCourseResult.courses
      .filter((_, idx) => selectedCourseIndices.includes(idx))
      .map((c) => createSubjectFromParsed(c));

    if (onImportMultipleSubjects && subjectsToImport.length > 1) {
      onImportMultipleSubjects(subjectsToImport);
    } else if (subjectsToImport.length > 0) {
      // Fallback
      subjectsToImport.forEach((subj) => onImportSubject(subj));
    }
    onClose();
  };

  const totalSelectedTopics = multiCourseResult
    ? multiCourseResult.courses
        .filter((_, idx) => selectedCourseIndices.includes(idx))
        .reduce((sum, c) => sum + c.topics.length, 0)
    : 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-sans">
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#12151e] border border-gray-200 dark:border-indigo-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] transition-colors">
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-[#1e2230] bg-gray-50/70 dark:bg-gradient-to-r dark:from-indigo-950/60 dark:to-purple-950/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-bold uppercase tracking-wide">
                  Curriculum Ingestion
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 font-bold tracking-wide flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  PDF.js Multi-Course Engine
                </span>
              </div>
              <h2 className="text-lg font-extrabold text-gray-900 dark:text-white tracking-tight mt-0.5">
                Import Course Syllabus or Curriculum Handbook
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
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
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
                  <span>Upload PDF / Syllabus File</span>
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

              {/* AI Auto-Extract Button */}
              {rawText.trim().length > 20 && (
                <button
                  type="button"
                  disabled={isAiProcessing}
                  onClick={handleRunAiExtraction}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs shadow-md shadow-purple-500/20 transition-all cursor-pointer"
                >
                  {isAiProcessing ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  )}
                  <span>{isAiProcessing ? 'Extracting via AI...' : 'AI Zero-Shot Extract'}</span>
                </button>
              )}
            </div>

            {/* Quick API Key Prompt */}
            {showKeyInput && !effectiveApiKey && (
              <div className="mb-4 p-4 rounded-2xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800/40 animate-fade-in space-y-2">
                <div className="flex items-center gap-2 text-purple-900 dark:text-purple-200 font-bold text-xs">
                  <Key className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                  <span>Enter Gemini API Key for Zero-Shot Precision</span>
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="password"
                    placeholder="AIzaSy..."
                    value={customApiKey}
                    onChange={(e) => setCustomApiKey(e.target.value)}
                    className="flex-1 p-2 rounded-xl bg-white dark:bg-[#12151e] border border-purple-300 dark:border-purple-700 text-gray-900 dark:text-white text-xs font-mono focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleRunAiExtraction}
                    disabled={!customApiKey.trim() || isAiProcessing}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-colors"
                  >
                    Run AI Extraction
                  </button>
                </div>
              </div>
            )}

            {aiError && (
              <div className="mb-4 p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-amber-800 dark:text-amber-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-amber-600" />
                <span className="flex-1">{aiError}</span>
              </div>
            )}

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
                  {fileName ? fileName : 'Drag & drop your B.Tech Syllabus PDF or Course Document here'}
                </h4>
                <p className="text-xs text-gray-400 mt-1">
                  Powered by PDF.js: Extracts multi-page university handbooks, tables, units, and semester schemes.
                </p>
                {isProcessing && (
                  <p className="text-xs text-indigo-500 font-semibold mt-2 animate-pulse flex items-center justify-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Decompressing PDF vector text and splitting into courses...</span>
                  </p>
                )}
              </div>
            )}

            {/* Paste Area */}
            {activeTab === 'paste' && (
              <div className="space-y-3">
                <textarea
                  rows={5}
                  value={rawText}
                  onChange={(e) => processExtractedText(e.target.value)}
                  placeholder="Paste your course outline or university evaluation scheme here..."
                  className="w-full p-4 rounded-2xl bg-gray-50 dark:bg-[#171b26] border border-gray-200 dark:border-[#1e2230] text-gray-900 dark:text-gray-100 text-xs focus:outline-none focus:border-indigo-500 font-mono transition-colors"
                />

                {/* Pre-built Sample Syllabus Pills */}
                <div>
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1.5">
                    Or click a pre-loaded syllabus bundle:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {SAMPLE_SYLLABI.map((sample, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleLoadSample(sample)}
                        className={`px-3 py-1.5 rounded-xl border text-[11px] font-medium transition-all ${
                          idx === 0
                            ? 'bg-purple-50 dark:bg-purple-950/50 border-purple-300 dark:border-purple-700/60 text-purple-700 dark:text-purple-300 font-bold hover:scale-102 shadow-xs'
                            : 'bg-gray-100 dark:bg-[#171b26] hover:bg-indigo-50 dark:hover:bg-indigo-950/40 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 border-gray-200/80 dark:border-[#1e2230]'
                        }`}
                      >
                        {sample.title}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Step 2: Multi-Course Selection & Curriculum Section */}
          {multiCourseResult && multiCourseResult.courses.length > 0 && (
            <div className="space-y-4">
              {/* Multi-Course Top Bar */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-purple-900/20 via-indigo-900/20 to-transparent border border-purple-300/40 dark:border-purple-800/40 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center font-bold">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-black text-gray-900 dark:text-white uppercase tracking-wider">
                      {multiCourseResult.programTitle}
                    </h3>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400">
                      Found {multiCourseResult.courses.length} courses with individual units & lab experiments.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedCourseIndices(
                        selectedCourseIndices.length === multiCourseResult.courses.length
                          ? [0]
                          : multiCourseResult.courses.map((_, i) => i)
                      )
                    }
                    className="text-[11px] font-mono text-purple-600 dark:text-purple-400 hover:underline font-bold"
                  >
                    {selectedCourseIndices.length === multiCourseResult.courses.length
                      ? 'Deselect All'
                      : 'Select All Courses'}
                  </button>
                </div>
              </div>

              {/* Course Selector Tabs: Allows clicking on each course one by one */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                  Select a course to inspect & customize syllabus units:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  {multiCourseResult.courses.map((c, idx) => {
                    const isSelected = selectedCourseIndices.includes(idx);
                    const isActive = activeCourseIndex === idx;

                    return (
                      <div
                        key={idx}
                        onClick={() => setActiveCourseIndex(idx)}
                        className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                          isActive
                            ? 'bg-indigo-50/80 dark:bg-indigo-950/50 border-indigo-500 shadow-sm'
                            : 'bg-gray-50 dark:bg-[#171b26] border-gray-200 dark:border-[#1e2230] hover:border-gray-300 dark:hover:border-gray-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleCourseSelection(idx);
                            }}
                            className="text-gray-400 hover:text-indigo-600 transition-colors"
                          >
                            {isSelected ? (
                              <CheckSquare className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <Square className="w-4 h-4" />
                            )}
                          </button>
                          <div className="min-w-0">
                            <span className="text-[10px] font-mono font-bold text-indigo-600 dark:text-indigo-400 uppercase block">
                              {c.courseCode}
                            </span>
                            <h4 className="text-xs font-bold text-gray-900 dark:text-white truncate">
                              {c.courseName}
                            </h4>
                          </div>
                        </div>

                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-lg bg-white dark:bg-[#12151e] border border-gray-200 dark:border-[#1e2230] text-gray-600 dark:text-gray-400 flex-shrink-0">
                          {c.topics.length} Units
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Step 3: Active Course Units Editor */}
              {currentCourse && (
                <div className="p-5 rounded-3xl bg-gray-50 dark:bg-[#171b26] border border-gray-200 dark:border-[#1e2230] space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200 dark:border-[#1e2230] pb-3">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      <span className="font-extrabold text-xs text-gray-900 dark:text-white uppercase tracking-wider">
                        {currentCourse.courseName} &bull; {currentCourse.courseCode} ({currentCourse.topics.length} Units)
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-gray-400">Color:</span>
                      <div className="flex items-center gap-1">
                        {SUBJECT_COLORS.slice(0, 6).map((c) => (
                          <button
                            key={c}
                            type="button"
                            onClick={() => handleUpdateCourseMeta('suggestedColor', c)}
                            className={`w-4 h-4 rounded-full transition-transform ${
                              currentCourse.suggestedColor === c ? 'scale-125 ring-2 ring-white' : ''
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
                        Subject Title
                      </label>
                      <input
                        type="text"
                        value={currentCourse.courseName}
                        onChange={(e) => handleUpdateCourseMeta('courseName', e.target.value)}
                        className="w-full p-2.5 rounded-xl bg-white dark:bg-[#12151e] border border-gray-200 dark:border-[#1e2230] text-gray-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                        Course Code
                      </label>
                      <input
                        type="text"
                        value={currentCourse.courseCode}
                        onChange={(e) => handleUpdateCourseMeta('courseCode', e.target.value)}
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
                        value={currentCourse.examDate}
                        onChange={(e) => handleUpdateCourseMeta('examDate', e.target.value)}
                        className="w-full p-2 rounded-xl bg-white dark:bg-[#12151e] border border-gray-200 dark:border-[#1e2230] text-gray-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-indigo-500"
                      />
                    </div>
                  </div>

                  {/* Topic List */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-[11px] text-gray-400 font-semibold px-1">
                      <span>Course Units & Lecture Allocation</span>
                      <button
                        type="button"
                        onClick={handleAddTopic}
                        className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Unit</span>
                      </button>
                    </div>

                    <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                      {currentCourse.topics.map((t, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 rounded-xl bg-white dark:bg-[#12151e] border border-gray-200 dark:border-[#1e2230] flex items-center justify-between gap-3 shadow-xs hover:border-indigo-500/40 transition-colors"
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
                                max="15"
                                value={t.estimatedHours}
                                onChange={(e) =>
                                  handleUpdateTopic(idx, 'estimatedHours', parseFloat(e.target.value) || 2.0)
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

          <div className="flex items-center gap-3">
            {multiCourseResult && multiCourseResult.courses.length > 1 ? (
              <>
                <button
                  type="button"
                  disabled={!currentCourse}
                  onClick={handleConfirmSingleImport}
                  className="px-4 py-2.5 rounded-xl bg-gray-200 dark:bg-[#171b26] hover:bg-gray-300 dark:hover:bg-[#1e2230] text-gray-800 dark:text-gray-200 font-bold text-xs transition-colors"
                >
                  Import {currentCourse?.courseCode || 'This Course'} Only
                </button>

                <button
                  type="button"
                  disabled={selectedCourseIndices.length === 0}
                  onClick={handleConfirmMultiImport}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-purple-600 via-indigo-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/25 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>
                    Import All {selectedCourseIndices.length} Courses ({totalSelectedTopics} Units)
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </>
            ) : (
              <button
                type="button"
                disabled={!currentCourse || currentCourse.topics.length === 0}
                onClick={handleConfirmSingleImport}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md ${
                  currentCourse && currentCourse.topics.length > 0
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-indigo-600/25 cursor-pointer'
                    : 'bg-gray-300 dark:bg-[#1e2230] text-gray-400 cursor-not-allowed'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                <span>Generate Study Plan & Schedule</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
