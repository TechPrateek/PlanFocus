import type { DailySchedule, ScheduledTask, Subject, Topic, UserSettings } from '../types/index.ts';
import { addDays, formatFriendlyDate, getDaysDifference, getTodayDateString } from '../utils/dateUtils.ts';

export interface SchedulingResult {
  schedule: DailySchedule[];
  capacityDeficitHours: number;
  hasCapacityConflict: boolean;
  conflictSummary?: {
    subjectName: string;
    requiredHours: number;
    availableHours: number;
    deficitHours: number;
  };
}

const DIFFICULTY_WEIGHTS = {
  easy: 1.0,
  medium: 1.5,
  hard: 2.0,
};

/**
 * Calculates priority score for an uncompleted topic based on exam urgency, difficulty, and duration.
 */
export function calculateTopicPriority(
  topic: Topic,
  subject: Subject,
  currentDate: string
): number {
  const daysUntilExam = Math.max(0, getDaysDifference(currentDate, subject.examDate));
  const diffWeight = DIFFICULTY_WEIGHTS[topic.difficulty] || 1.0;
  const remainingHours = Math.max(0, topic.estimatedHours - topic.completedHours);

  // Score: Higher means more urgent & difficult.
  // Topics for exams happening sooner get significantly higher priority.
  const urgencyFactor = 1 / (daysUntilExam + 0.1);
  return Number((urgencyFactor * diffWeight * remainingHours).toFixed(3));
}

/**
 * Generates an optimized, day-by-day study schedule starting from today.
 */
export function generateSchedule(
  subjects: Subject[],
  settings: UserSettings,
  missedTopicIds: string[] = []
): SchedulingResult {
  const today = getTodayDateString();
  const dailyLimit = settings.dailyAvailableHours || 3.0;

  if (subjects.length === 0) {
    return {
      schedule: [],
      capacityDeficitHours: 0,
      hasCapacityConflict: false,
    };
  }

  // Find latest exam date to determine schedule horizon
  let maxDays = 14;
  subjects.forEach((s) => {
    const days = getDaysDifference(today, s.examDate);
    if (days > maxDays) maxDays = Math.min(days + 2, 45); // up to 45 days
  });

  // Collect all uncompleted topics
  interface TopicQueueItem {
    topic: Topic;
    subject: Subject;
    remainingHours: number;
    priority: number;
    isMissed: boolean;
  }

  const topicQueue: TopicQueueItem[] = [];

  subjects.forEach((subj) => {
    subj.topics.forEach((top) => {
      const remaining = top.estimatedHours - top.completedHours;
      if (!top.isCompleted && remaining > 0) {
        const isMissed = missedTopicIds.includes(top.id);
        const priority = calculateTopicPriority(top, subj, today) + (isMissed ? 5.0 : 0);
        topicQueue.push({
          topic: top,
          subject: subj,
          remainingHours: remaining,
          priority,
          isMissed,
        });
      }
    });
  });

  // Sort queue by priority descending (highest urgency first)
  topicQueue.sort((a, b) => b.priority - a.priority);

  // Check capacity conflict: remaining hours vs available calendar capacity before exams
  let totalDeficit = 0;
  let conflictSummary: SchedulingResult['conflictSummary'] = undefined;

  for (const subj of subjects) {
    const daysLeft = Math.max(1, getDaysDifference(today, subj.examDate));
    const subjUncompletedHours = subj.topics
      .filter((t) => !t.isCompleted)
      .reduce((sum, t) => sum + Math.max(0, t.estimatedHours - t.completedHours), 0);

    if (subjUncompletedHours > daysLeft * dailyLimit) {
      const deficit = subjUncompletedHours - daysLeft * dailyLimit;
      if (deficit > totalDeficit) {
        totalDeficit = Number(deficit.toFixed(1));
        conflictSummary = {
          subjectName: subj.name,
          requiredHours: Number(subjUncompletedHours.toFixed(1)),
          availableHours: Number((daysLeft * dailyLimit).toFixed(1)),
          deficitHours: totalDeficit,
        };
      }
    }
  }

  // Distribute tasks across days
  const schedule: DailySchedule[] = [];
  const activeQueue = topicQueue.map((item) => ({ ...item }));

  for (let dayOffset = 0; dayOffset < maxDays; dayOffset++) {
    const dateStr = addDays(today, dayOffset);
    const dayLabel = formatFriendlyDate(dateStr);

    // Check which exams occur on this date
    const examSubjects = subjects.filter((s) => s.examDate === dateStr);
    const isExamDay = examSubjects.length > 0;
    const examSubjectNames = examSubjects.map((s) => s.name);

    const dayTasks: ScheduledTask[] = [];
    let dayHoursUsed = 0;

    // Allocate tasks up to daily capacity
    for (let i = 0; i < activeQueue.length; i++) {
      const item = activeQueue[i];
      if (item.remainingHours <= 0) continue;

      // Don't schedule a subject on or after its exam date has passed
      const daysUntilSubjExam = getDaysDifference(dateStr, item.subject.examDate);
      if (daysUntilSubjExam <= 0) {
        continue;
      }

      const availableTime = dailyLimit - dayHoursUsed;
      if (availableTime < 0.5) {
        break; // Day is full
      }

      // Allocate in blocks of up to 1.5h or remaining duration
      const blockDuration = Math.min(item.remainingHours, Math.min(availableTime, 1.5));
      const roundedDuration = Number(blockDuration.toFixed(1));

      if (roundedDuration > 0) {
        dayTasks.push({
          id: `task-${item.topic.id}-${dateStr}`,
          topicId: item.topic.id,
          subjectId: item.subject.id,
          topicName: item.topic.name,
          subjectName: item.subject.name,
          subjectColor: item.subject.color,
          difficulty: item.topic.difficulty,
          date: dateStr,
          durationHours: roundedDuration,
          isCompleted: false,
          isMissed: item.isMissed && dayOffset === 0,
          priorityScore: item.priority,
          pattern: item.topic.pattern,
          problemUrl: item.topic.problemUrl,
          needsRevision: item.topic.needsRevision,
          step: item.topic.step,
          stepTitle: item.topic.stepTitle,
        });

        dayHoursUsed += roundedDuration;
        item.remainingHours = Number((item.remainingHours - roundedDuration).toFixed(2));
      }
    }

    schedule.push({
      date: dateStr,
      dayLabel,
      tasks: dayTasks,
      totalHours: Number(dayHoursUsed.toFixed(1)),
      capacityHours: dailyLimit,
      isExamDay,
      examSubjectNames,
    });
  }

  return {
    schedule,
    capacityDeficitHours: totalDeficit,
    hasCapacityConflict: totalDeficit > 0,
    conflictSummary,
  };
}
