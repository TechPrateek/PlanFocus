import { AppState, UserSettings } from '../types';
import { getSampleStudentSubjects } from './sampleData';
import { getTodayDateString } from '../utils/dateUtils';

const STORAGE_KEY = 'focusflow_ai_state_v1';

export const DEFAULT_SETTINGS: UserSettings = {
  dailyAvailableHours: 3.0,
  pomodoroWorkMinutes: 25,
  pomodoroShortBreakMinutes: 5,
  pomodoroLongBreakMinutes: 15,
  soundEnabled: true,
};

export const INITIAL_STATE: AppState = {
  subjects: [],
  schedule: [],
  settings: DEFAULT_SETTINGS,
  streak: 1,
  lastActiveDate: getTodayDateString(),
  studyLogs: [],
  hasMissedTasks: false,
  capacityDeficitHours: 0,
};

export function loadStoredState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return INITIAL_STATE;
    }
    const parsed = JSON.parse(raw) as Partial<AppState>;
    return {
      ...INITIAL_STATE,
      ...parsed,
      settings: {
        ...DEFAULT_SETTINGS,
        ...(parsed.settings || {}),
      },
    };
  } catch (error) {
    console.error('Failed to parse FocusFlow state from localStorage:', error);
    return INITIAL_STATE;
  }
}

export function saveStoredState(state: AppState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save FocusFlow state to localStorage:', error);
  }
}

export function loadSampleState(): AppState {
  const subjects = getSampleStudentSubjects();
  return {
    ...INITIAL_STATE,
    subjects,
    streak: 3,
    studyLogs: [
      {
        id: 'log-1',
        topicId: 'top-cs-5',
        subjectId: 'subj-cs',
        topicName: 'Hash Tables & Collision Resolution',
        subjectName: 'Data Structures & Algorithms',
        timestamp: new Date().toISOString(),
        durationMinutes: 90,
      },
      {
        id: 'log-2',
        topicId: 'top-math-3',
        subjectId: 'subj-math',
        topicName: 'Matrix Inverses & Determinants',
        subjectName: 'Linear Algebra',
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        durationMinutes: 90,
      },
    ],
  };
}
