export type Difficulty = 'easy' | 'medium' | 'hard';

export interface Topic {
  id: string;
  subjectId: string;
  name: string;
  difficulty: Difficulty;
  estimatedHours: number;
  completedHours: number;
  isCompleted: boolean;
  pattern?: string;
  problemUrl?: string;
  needsRevision?: boolean;
  step?: number;
  stepTitle?: string;
}

export interface Subject {
  id: string;
  name: string;
  code?: string;
  color: string; // Hex color code
  examDate: string; // ISO format (YYYY-MM-DD)
  topics: Topic[];
}

export interface ScheduledTask {
  id: string;
  topicId: string;
  subjectId: string;
  topicName: string;
  subjectName: string;
  subjectColor: string;
  difficulty: Difficulty;
  date: string; // YYYY-MM-DD
  durationHours: number;
  isCompleted: boolean;
  isMissed: boolean;
  priorityScore: number;
  pattern?: string;
  problemUrl?: string;
  needsRevision?: boolean;
  step?: number;
  stepTitle?: string;
}

export interface DailySchedule {
  date: string; // YYYY-MM-DD
  dayLabel: string; // e.g. "Today", "Tomorrow", "Mon, Oct 26"
  tasks: ScheduledTask[];
  totalHours: number;
  capacityHours: number;
  isExamDay: boolean;
  examSubjectNames: string[];
}

export interface UserSettings {
  dailyAvailableHours: number; // e.g. 3.0
  pomodoroWorkMinutes: number; // 25
  pomodoroShortBreakMinutes: number; // 5
  pomodoroLongBreakMinutes: number; // 15
  soundEnabled: boolean;
  geminiApiKey?: string;
}

export interface StudySessionLog {
  id: string;
  topicId: string;
  subjectId: string;
  topicName: string;
  subjectName: string;
  timestamp: string;
  durationMinutes: number;
}

export interface AppState {
  subjects: Subject[];
  schedule: DailySchedule[];
  settings: UserSettings;
  streak: number;
  lastActiveDate: string;
  studyLogs: StudySessionLog[];
  hasMissedTasks: boolean;
  capacityDeficitHours: number;
}
