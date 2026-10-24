import React, { useState, useEffect, useCallback } from 'react';
import { AppState, ScheduledTask, Subject, UserSettings } from './types';
import {
  loadStoredState,
  saveStoredState,
  loadSampleState,
  INITIAL_STATE,
} from './services/storageService';
import { generateSchedule, SchedulingResult } from './services/schedulingEngine';
import { Header } from './components/Header';
import { TodayDashboard } from './components/TodayDashboard';
import { ScheduleTimeline } from './components/ScheduleTimeline';
import { FocusTimer } from './components/FocusTimer';
import { AnalyticsView } from './components/AnalyticsView';
import { SetupWizard } from './components/SetupWizard';
import { SubjectModal } from './components/SubjectModal';
import { RebalanceBanner } from './components/RebalanceBanner';
import { ConflictModal } from './components/ConflictModal';
import { StudyTipModal } from './components/StudyTipModal';
import { getTodayDateString } from './utils/dateUtils';
import confetti from 'canvas-confetti';

export const App: React.FC = () => {
  const [state, setState] = useState<AppState>(() => loadStoredState());
  const [activeTab, setActiveTab] = useState<'today' | 'schedule' | 'timer' | 'analytics'>('today');

  // Modals & Active Selections
  const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState<boolean>(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [activeFocusTask, setActiveFocusTask] = useState<ScheduledTask | null>(null);
  const [studyTipTask, setStudyTipTask] = useState<ScheduledTask | null>(null);
  const [isStudyTipOpen, setIsStudyTipOpen] = useState<boolean>(false);

  // Background timer status for Header pill
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [timerMinutesRemaining, setTimerMinutesRemaining] = useState<number>(25);

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

      // Update schedule task
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

      // Update subject topic
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
    setActiveTab('timer');
  };

  const handleSimulateMissed = (task: ScheduledTask) => {
    if (!missedTopicIds.includes(task.topicId)) {
      const updated = [...missedTopicIds, task.topicId];
      setMissedTopicIds(updated);
      setShowRebalanceBanner(true);
      // Flag task as missed in schedule
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
    // Re-run scheduler with missed topics prioritized for future slots
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
      // Add study log
      const newLog = {
        id: `log-${Date.now()}`,
        topicId: task.topicId,
        subjectId: task.subjectId,
        topicName: task.topicName,
        subjectName: task.subjectName,
        timestamp: new Date().toISOString(),
        durationMinutes,
      };

      // Update topic completed hours
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

      // Mark task complete in schedule
      const updatedSchedule = prev.schedule.map((day) => ({
        ...day,
        tasks: day.tasks.map((t) =>
          t.topicId === task.topicId ? { ...t, isCompleted: true } : t
        ),
      }));

      // Update streak if today is new active day
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
  const todayCompletedHours = todayTasks
    .filter((t) => t.isCompleted)
    .reduce((sum, t) => sum + t.durationHours, 0);

  return (
    <div className="min-h-screen bg-[#090a0f] text-gray-100 flex flex-col font-sans">
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        streak={state.streak}
        todayCompletedHours={todayCompletedHours}
        dailyCapacityHours={state.settings.dailyAvailableHours}
        soundEnabled={state.settings.soundEnabled}
        onToggleSound={() =>
          setState((prev) => ({
            ...prev,
            settings: { ...prev.settings, soundEnabled: !prev.settings.soundEnabled },
          }))
        }
        onLoadSample={handleLoadSampleData}
        onOpenNewSubject={() => {
          setEditingSubject(null);
          setIsSubjectModalOpen(true);
        }}
        onOpenWizard={() => setIsWizardOpen(true)}
        isTimerRunning={isTimerRunning}
        timerMinutesRemaining={timerMinutesRemaining}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Adaptive Rebalance Notification Banner */}
        {showRebalanceBanner && (
          <div className="mb-6">
            <RebalanceBanner
              onRebalance={handleRebalancePlan}
              onDismiss={() => setShowRebalanceBanner(false)}
            />
          </div>
        )}

        {/* Tab Views */}
        {activeTab === 'today' && (
          <TodayDashboard
            tasks={todayTasks}
            subjects={state.subjects}
            dailyCapacity={state.settings.dailyAvailableHours}
            onCompleteTask={handleCompleteTask}
            onStartFocus={handleStartFocus}
            onSimulateMissed={handleSimulateMissed}
            onOpenStudyTip={(task) => {
              setStudyTipTask(task);
              setIsStudyTipOpen(true);
            }}
            onOpenWizard={() => setIsWizardOpen(true)}
            onLoadSample={handleLoadSampleData}
          />
        )}

        {activeTab === 'schedule' && (
          <ScheduleTimeline
            schedule={state.schedule}
            onCompleteTask={handleCompleteTask}
            onStartFocus={handleStartFocus}
          />
        )}

        {activeTab === 'timer' && (
          <FocusTimer
            activeTask={activeFocusTask}
            soundEnabled={state.settings.soundEnabled}
            onToggleSound={() =>
              setState((prev) => ({
                ...prev,
                settings: { ...prev.settings, soundEnabled: !prev.settings.soundEnabled },
              }))
            }
            onLogCompletedSession={handleLogCompletedSession}
            onTimerStateChange={(running, mins) => {
              setIsTimerRunning(running);
              setTimerMinutesRemaining(mins);
            }}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView state={state} onResetData={handleResetAll} />
        )}
      </main>

      {/* Modals */}
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
