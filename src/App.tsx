import React, { useState, useEffect, useCallback } from 'react';
import { AppState, ScheduledTask, Subject, UserSettings } from './types';
import {
  loadStoredState,
  saveStoredState,
  loadSampleState,
  INITIAL_STATE,
} from './services/storageService';
import { generateSchedule, SchedulingResult } from './services/schedulingEngine';
import { Sidebar } from './components/Sidebar';
import { TopNav } from './components/TopNav';
import { TodayDashboard } from './components/TodayDashboard';
import { FocusSessionCard } from './components/FocusSessionCard';
import { RightScheduleWidget } from './components/RightScheduleWidget';
import { ScheduleTimeline } from './components/ScheduleTimeline';
import { AnalyticsView } from './components/AnalyticsView';
import { SetupWizard } from './components/SetupWizard';
import { SubjectModal } from './components/SubjectModal';
import { RebalanceBanner } from './components/RebalanceBanner';
import { ConflictModal } from './components/ConflictModal';
import { StudyTipModal } from './components/StudyTipModal';
import { SyllabusImportModal } from './components/SyllabusImportModal';
import { getTodayDateString } from './utils/dateUtils';
import confetti from 'canvas-confetti';

export const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => loadStoredState());
  const [activeTab, setActiveTab] = useState<'today' | 'schedule' | 'tasks' | 'courses' | 'materials'>('today');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('focusflow_theme') === 'dark';
  });

  // Sync theme class with HTML root
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('focusflow_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('focusflow_theme', 'light');
    }
  }, [isDarkMode]);

  // Modals & Active Selections
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);
  const [isSyllabusModalOpen, setIsSyllabusModalOpen] = useState<boolean>(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState<boolean>(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [activeFocusTask, setActiveFocusTask] = useState<ScheduledTask | null>(null);
  const [studyTipTask, setStudyTipTask] = useState<ScheduledTask | null>(null);
  const [isStudyTipOpen, setIsStudyTipOpen] = useState<boolean>(false);

  // Missed topics tracking
  const [missedTopicIds, setMissedTopicIds] = useState<string[]>([]);
  const [showRebalanceBanner, setShowRebalanceBanner] = useState<boolean>(false);
  const [conflictInfo, setConflictInfo] = useState<SchedulingResult['conflictSummary'] | null>(null);
  const [isConflictModalOpen, setIsConflictModalOpen] = useState<boolean>(false);

  // Re-run scheduling algorithm whenever subjects, settings, or missed tasks change
  const refreshSchedule = useCallback(
    (subjects: Subject[], settings: UserSettings, missedIds: string[] = []) => {
      const result = generateSchedule(subjects, settings, missedIds);
      setState((prev) => ({
        ...prev,
        schedule: result.schedule,
        capacityDeficitHours: result.capacityDeficitHours,
        hasMissedTasks: missedIds.length > 0,
      }));

      if (result.hasCapacityConflict && result.conflictSummary) {
        setConflictInfo(result.conflictSummary);
      } else {
        setConflictInfo(null);
      }
    },
    []
  );

  // Initial schedule generation if subjects exist but schedule is empty
  useEffect(() => {
    if (state.subjects.length > 0 && state.schedule.length === 0) {
      refreshSchedule(state.subjects, state.settings, missedTopicIds);
    }
  }, [state.subjects, state.schedule.length, state.settings, missedTopicIds, refreshSchedule]);

  // Auto-save state to localStorage on every update
  useEffect(() => {
    saveStoredState(state);
  }, [state]);

  // Auto-select first pending task for the focus card if none selected
  useEffect(() => {
    if (!activeFocusTask && state.schedule.length > 0) {
      const todaySched = state.schedule.find((s) => s.dayLabel === 'Today');
      if (todaySched && todaySched.tasks.length > 0) {
        const firstPending = todaySched.tasks.find((t) => !t.isCompleted);
        if (firstPending) {
          setActiveFocusTask(firstPending);
        }
      }
    }
  }, [activeFocusTask, state.schedule]);

  // Handlers
  const handleLoadSampleData = () => {
    const sample = loadSampleState();
    const result = generateSchedule(sample.subjects, sample.settings, []);
    setState({
      ...sample,
      schedule: result.schedule,
      capacityDeficitHours: result.capacityDeficitHours,
    });
    setMissedTopicIds([]);
    setShowRebalanceBanner(false);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  const handleCompleteTask = (taskId: string) => {
    setState((prev) => {
      let targetTopicId = '';
      let targetSubjectId = '';

      const updatedSchedule = prev.schedule.map((day) => ({
        ...day,
        tasks: day.tasks.map((task) => {
          if (task.id === taskId) {
            targetTopicId = task.topicId;
            targetSubjectId = task.subjectId;
            return { ...task, isCompleted: !task.isCompleted };
          }
          return task;
        }),
      }));

      const updatedSubjects = prev.subjects.map((subj) => {
        if (subj.id === targetSubjectId) {
          return {
            ...subj,
            topics: subj.topics.map((t) => {
              if (t.id === targetTopicId) {
                const newCompleted = !t.isCompleted;
                return {
                  ...t,
                  isCompleted: newCompleted,
                  completedHours: newCompleted ? t.estimatedHours : 0,
                };
              }
              return t;
            }),
          };
        }
        return subj;
      });

      return {
        ...prev,
        subjects: updatedSubjects,
        schedule: updatedSchedule,
      };
    });
  };

  const handleStartFocus = (task: ScheduledTask) => {
    setActiveFocusTask(task);
  };

  const handleSimulateMissed = (task: ScheduledTask) => {
    if (!missedTopicIds.includes(task.topicId)) {
      const updated = [...missedTopicIds, task.topicId];
      setMissedTopicIds(updated);
      setShowRebalanceBanner(true);
      setState((prev) => ({
        ...prev,
        schedule: prev.schedule.map((day) => ({
          ...day,
          tasks: day.tasks.map((t) => (t.id === task.id ? { ...t, isMissed: true } : t)),
        })),
        hasMissedTasks: true,
      }));
    }
  };

  const handleRebalancePlan = () => {
    refreshSchedule(state.subjects, state.settings, missedTopicIds);
    setShowRebalanceBanner(false);
    setMissedTopicIds([]);
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.5 },
      colors: ['#6366f1', '#10b981'],
    });

    if (conflictInfo) {
      setIsConflictModalOpen(true);
    }
  };

  const handleLogCompletedSession = (task: ScheduledTask, durationMinutes: number) => {
    const hours = durationMinutes / 60;
    const today = getTodayDateString();

    setState((prev) => {
      const newLog = {
        id: `log-${Date.now()}`,
        topicId: task.topicId,
        subjectId: task.subjectId,
        topicName: task.topicName,
        subjectName: task.subjectName,
        timestamp: new Date().toISOString(),
        durationMinutes,
      };

      const updatedSubjects = prev.subjects.map((subj) => {
        if (subj.id === task.subjectId) {
          return {
            ...subj,
            topics: subj.topics.map((t) => {
              if (t.id === task.topicId) {
                const totalCompleted = Number((t.completedHours + hours).toFixed(2));
                return {
                  ...t,
                  completedHours: totalCompleted,
                  isCompleted: totalCompleted >= t.estimatedHours,
                };
              }
              return t;
            }),
          };
        }
        return subj;
      });

      const updatedSchedule = prev.schedule.map((day) => ({
        ...day,
        tasks: day.tasks.map((t) =>
          t.topicId === task.topicId ? { ...t, isCompleted: true } : t
        ),
      }));

      const isNewDay = prev.lastActiveDate !== today;
      const newStreak = isNewDay ? prev.streak + 1 : prev.streak;

      return {
        ...prev,
        subjects: updatedSubjects,
        schedule: updatedSchedule,
        studyLogs: [newLog, ...prev.studyLogs],
        streak: newStreak,
        lastActiveDate: today,
      };
    });
  };

  const handleSaveSubject = (savedSubj: Subject) => {
    setState((prev) => {
      const exists = prev.subjects.some((s) => s.id === savedSubj.id);
      const updatedSubjects = exists
        ? prev.subjects.map((s) => (s.id === savedSubj.id ? savedSubj : s))
        : [...prev.subjects, savedSubj];

      refreshSchedule(updatedSubjects, prev.settings, missedTopicIds);
      return {
        ...prev,
        subjects: updatedSubjects,
      };
    });
  };

  const handleDeleteSubject = (subjId: string) => {
    setState((prev) => {
      const updated = prev.subjects.filter((s) => s.id !== subjId);
      refreshSchedule(updated, prev.settings, missedTopicIds);
      return {
        ...prev,
        subjects: updated,
      };
    });
  };

  const handleWizardComplete = (newSubjects: Subject[], dailyHours: number) => {
    const updatedSettings = {
      ...state.settings,
      dailyAvailableHours: dailyHours,
    };
    setState((prev) => ({
      ...prev,
      subjects: newSubjects,
      settings: updatedSettings,
    }));
    refreshSchedule(newSubjects, updatedSettings, []);
    confetti({
      particleCount: 60,
      spread: 70,
      origin: { y: 0.6 },
    });
  };

  const handleImportSubject = (newSubject: Subject) => {
    setState((prev) => {
      const updatedSubjects = [...prev.subjects, newSubject];
      refreshSchedule(updatedSubjects, prev.settings, missedTopicIds);
      return {
        ...prev,
        subjects: updatedSubjects,
      };
    });
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#6366f1', '#10b981', '#f59e0b'],
    });
  };

  const handleUpdateDailyHours = (newHours: number) => {
    const updatedSettings = {
      ...state.settings,
      dailyAvailableHours: newHours,
    };
    setState((prev) => ({
      ...prev,
      settings: updatedSettings,
    }));
    refreshSchedule(state.subjects, updatedSettings, missedTopicIds);
  };

  const handleResetAll = () => {
    setState(INITIAL_STATE);
    setMissedTopicIds([]);
    setShowRebalanceBanner(false);
  };

  // Find today's tasks
  const todaySchedule = state.schedule.find((s) => s.dayLabel === 'Today');
  const todayTasks = todaySchedule ? todaySchedule.tasks : [];

  const allPendingTasks = state.subjects.flatMap((s) =>
    s.topics.filter((t) => !t.isCompleted)
  );

  return (
    <div
      className={`min-h-screen flex font-sans antialiased transition-colors duration-200 app-glow ${
        isDarkMode ? 'bg-[#0b0d0d] text-[#e5eee8]' : 'bg-[#f8fafc] text-slate-900'
      }`}
    >
      {/* Left Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        pendingTasksCount={allPendingTasks.length}
        coursesCount={state.subjects.length}
        isDarkMode={isDarkMode}
        onOpenNewSubject={() => {
          setEditingSubject(null);
          setIsSubjectModalOpen(true);
        }}
        onOpenSyllabusModal={() => setIsSyllabusModalOpen(true)}
        onOpenWizard={() => setIsWizardOpen(true)}
        onLoadSample={handleLoadSampleData}
        dailyCapacity={state.settings.dailyAvailableHours}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <main className="flex-1 max-w-7xl w-full mx-auto px-5 sm:px-8 py-7">
          {/* Top Bar with Date, Greeting, Search & Demo Button */}
          <TopNav
            onLoadSample={handleLoadSampleData}
            onOpenSyllabusModal={() => setIsSyllabusModalOpen(true)}
            isDarkMode={isDarkMode}
            onToggleTheme={() => setIsDarkMode(!isDarkMode)}
          />

          {/* Adaptive Rebalance Notification Banner */}
          {showRebalanceBanner && (
            <div className="mb-6">
              <RebalanceBanner
                onRebalance={handleRebalancePlan}
                onDismiss={() => setShowRebalanceBanner(false)}
              />
            </div>
          )}

          {/* Main 2-Column Dashboard View */}
          {activeTab === 'today' && (
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-7">
              {/* Left Column (65% width): Stat cards, Priority Tasks, Recent Docs */}
              <div className="xl:col-span-8">
                <TodayDashboard
                  tasks={todayTasks}
                  subjects={state.subjects}
                  dailyCapacity={state.settings.dailyAvailableHours}
                  streak={state.streak}
                  onCompleteTask={handleCompleteTask}
                  onStartFocus={handleStartFocus}
                  onSimulateMissed={handleSimulateMissed}
                  onOpenStudyTip={(task) => {
                    setStudyTipTask(task);
                    setIsStudyTipOpen(true);
                  }}
                  onOpenWizard={() => setIsWizardOpen(true)}
                  onOpenSyllabusModal={() => setIsSyllabusModalOpen(true)}
                  onLoadSample={handleLoadSampleData}
                  isDarkMode={isDarkMode}
                />
              </div>

              {/* Right Rail (35% width): Dark Focus Session Card + Today's Schedule */}
              <div className="xl:col-span-4 space-y-6">
                <FocusSessionCard
                  activeTask={activeFocusTask}
                  soundEnabled={state.settings.soundEnabled}
                  onLogCompletedSession={handleLogCompletedSession}
                  isDarkMode={isDarkMode}
                />

                <RightScheduleWidget
                  tasks={todayTasks}
                  onStartFocus={handleStartFocus}
                  isDarkMode={isDarkMode}
                />
              </div>
            </div>
          )}

          {/* Schedule Timeline View */}
          {activeTab === 'schedule' && (
            <div className={`p-6 rounded-3xl border shadow-sm ${isDarkMode ? 'bg-[#12151e] border-[#1e2230]' : 'bg-white border-slate-200'}`}>
              <ScheduleTimeline
                schedule={state.schedule}
                onCompleteTask={handleCompleteTask}
                onStartFocus={handleStartFocus}
              />
            </div>
          )}

          {/* Assignments / Tasks Queue View */}
          {activeTab === 'tasks' && (
            <div className={`p-6 rounded-3xl border shadow-sm ${isDarkMode ? 'bg-[#12151e] border-[#1e2230]' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h3 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    All Course Topics & Assignments
                  </h3>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                    Full checklist of all topics across your active courses
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {state.subjects.flatMap((s) =>
                  s.topics.map((t) => (
                    <div
                      key={t.id}
                      className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                        isDarkMode ? 'bg-[#171b26] border-[#1e2230]' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className="w-2.5 h-2.5 rounded-full"
                          style={{ backgroundColor: s.color }}
                        />
                        <div>
                          <h4
                            className={`text-xs font-bold ${
                              t.isCompleted
                                ? 'line-through text-slate-400'
                                : isDarkMode ? 'text-white' : 'text-slate-900'
                            }`}
                          >
                            {t.name}
                          </h4>
                          <span className={`text-[10px] ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                            {s.name} • Est. {t.estimatedHours}h • {t.difficulty}
                          </span>
                        </div>
                      </div>

                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          t.isCompleted
                            ? isDarkMode
                              ? 'bg-emerald-950/40 text-emerald-300'
                              : 'bg-emerald-50 text-emerald-600'
                            : isDarkMode
                            ? 'bg-amber-950/40 text-amber-300'
                            : 'bg-amber-50 text-amber-600'
                        }`}
                      >
                        {t.isCompleted ? 'Completed' : 'Pending'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Courses & Syllabus Management View */}
          {activeTab === 'courses' && (
            <div className={`p-6 rounded-3xl border shadow-sm space-y-4 ${isDarkMode ? 'bg-[#12151e] border-[#1e2230]' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`text-base font-bold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                    Enrolled Courses
                  </h3>
                  <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                    Manage subjects, exam dates, and syllabi
                  </p>
                </div>
                <button
                  onClick={() => {
                    setEditingSubject(null);
                    setIsSubjectModalOpen(true);
                  }}
                  className={`px-3.5 py-1.5 rounded-xl font-semibold text-xs shadow-sm ${
                    isDarkMode ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'
                  }`}
                >
                  + Add Course
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {state.subjects.map((subj) => (
                  <div
                    key={subj.id}
                    className={`p-5 rounded-2xl border space-y-3 ${
                      isDarkMode ? 'bg-[#171b26] border-[#1e2230]' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: subj.color }}
                        />
                        <span className={`font-bold text-sm ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>
                          {subj.name}
                        </span>
                      </div>
                      <span className={`text-xs font-mono ${isDarkMode ? 'text-gray-400' : 'text-slate-500'}`}>
                        {subj.code || 'Course'}
                      </span>
                    </div>

                    <div className={`text-xs space-y-1 ${isDarkMode ? 'text-gray-400' : 'text-slate-600'}`}>
                      <p>Exam Date: <strong className={isDarkMode ? 'text-gray-200' : 'text-slate-900'}>{subj.examDate}</strong></p>
                      <p>Syllabus: {subj.topics.length} topics</p>
                    </div>

                    <div className={`flex justify-end gap-2 pt-2 border-t ${isDarkMode ? 'border-[#1e2230]' : 'border-slate-200'}`}>
                      <button
                        onClick={() => {
                          setEditingSubject(subj);
                          setIsSubjectModalOpen(true);
                        }}
                        className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold"
                      >
                        Edit Course
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Notes & Analytics View */}
          {activeTab === 'materials' && (
            <AnalyticsView state={state} onResetData={handleResetAll} />
          )}
        </main>
      </div>

      {/* Modals */}
      <SyllabusImportModal
        isOpen={isSyllabusModalOpen}
        onClose={() => setIsSyllabusModalOpen(false)}
        onImportSubject={handleImportSubject}
        isDarkMode={isDarkMode}
        geminiApiKey={state.settings.geminiApiKey}
      />

      <SetupWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onComplete={handleWizardComplete}
        onLoadSample={handleLoadSampleData}
      />

      <SubjectModal
        isOpen={isSubjectModalOpen}
        onClose={() => setIsSubjectModalOpen(false)}
        onSave={handleSaveSubject}
        onDelete={handleDeleteSubject}
        initialSubject={editingSubject}
      />

      {conflictInfo && (
        <ConflictModal
          isOpen={isConflictModalOpen}
          onClose={() => setIsConflictModalOpen(false)}
          conflict={conflictInfo}
          currentDailyHours={state.settings.dailyAvailableHours}
          onUpdateDailyHours={handleUpdateDailyHours}
        />
      )}

      <StudyTipModal
        task={studyTipTask}
        isOpen={isStudyTipOpen}
        onClose={() => setIsStudyTipOpen(false)}
        geminiApiKey={state.settings.geminiApiKey}
      />
    </div>
  );
};

export default App;
