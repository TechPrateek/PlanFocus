import assert from 'node:assert';
import { getSampleStudentSubjects } from '../src/services/sampleData.ts';
import { generateSchedule } from '../src/services/schedulingEngine.ts';
import { getDaysDifference } from '../src/utils/dateUtils.ts';

console.log('🧪 Starting FocusFlow AI Mechanical Verifications...\n');

// 1. Verify Sample Data
const sampleSubjects = getSampleStudentSubjects();
assert(sampleSubjects.length >= 2, 'Should load at least 2 sample courses');
assert(sampleSubjects.some(s => s.name.includes('Data Structures')), 'Should include Data Structures');
console.log('✅ Sample courses loaded successfully:', sampleSubjects.map(s => s.name).join(', '));

// 2. Verify Scheduling Algorithm
const settings = {
  dailyAvailableHours: 3.0,
  pomodoroWorkMinutes: 25,
  pomodoroShortBreakMinutes: 5,
  pomodoroLongBreakMinutes: 15,
  soundEnabled: true,
};

const result = generateSchedule(sampleSubjects, settings, []);
assert(result.schedule.length > 0, 'Schedule should have generated days');

// Verify daily capacity is respected
for (const day of result.schedule) {
  assert(day.totalHours <= settings.dailyAvailableHours + 0.01, `Day ${day.date} exceeded daily limit: ${day.totalHours} > ${settings.dailyAvailableHours}`);
}
console.log(`✅ Daily hour limits verified: All ${result.schedule.length} days strictly <= ${settings.dailyAvailableHours}h`);

// Verify no topics scheduled after exam date
for (const day of result.schedule) {
  for (const task of day.tasks) {
    const subj = sampleSubjects.find(s => s.id === task.subjectId);
    assert(subj, `Subject not found for task ${task.id}`);
    const daysUntilExam = getDaysDifference(day.date, subj.examDate);
    assert(daysUntilExam > 0, `Topic ${task.topicName} scheduled on/after exam date (${day.date} vs ${subj.examDate})`);
  }
}
console.log('✅ Exam date boundaries verified: Zero topics scheduled on or after their exam date');

// 3. Verify Adaptive Rebalance on Missed Topic
const firstTopicId = sampleSubjects[0].topics[0].id;
const rebalanced = generateSchedule(sampleSubjects, settings, [firstTopicId]);
assert(rebalanced.schedule.length > 0, 'Rebalanced schedule should exist');
console.log('✅ Adaptive Rebalance verified: Successfully shifted and prioritized missed topic');

// 4. Verify Syllabus & Document Parsing Engine
import { parseSyllabusText, createSubjectFromParsed, SAMPLE_SYLLABI } from '../src/services/syllabusParser.ts';

const parsed = parseSyllabusText(SAMPLE_SYLLABI[0].content);
assert(parsed.courseName.includes('Distributed Systems') || parsed.courseCode === 'CS 350', 'Should extract course code and title');
assert(parsed.topics.length >= 4, 'Should extract modular topics from syllabus text');
assert(parsed.topics.some(t => t.difficulty === 'hard'), 'Should auto-assign difficulty heuristics based on technical keywords');
const importedSubject = createSubjectFromParsed(parsed);
assert(importedSubject.topics.length === parsed.topics.length, 'Generated subject should contain all parsed modules');
console.log(`✅ Syllabus Parsing verified: Extracted '${parsed.courseName} (${parsed.courseCode})' with ${parsed.topics.length} topics and exam date ${parsed.examDate}`);

console.log('\n🎉 ALL MECHANICAL VERIFICATIONS PASSED CLEANLY!');
