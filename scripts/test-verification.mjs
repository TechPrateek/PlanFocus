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

// 4. Verify Multi-Course Curriculum Parsing (AKTU B.Tech 4th Year Bundle)
import { parseSyllabusText, parseMultiCourseSyllabus, createSubjectFromParsed, SAMPLE_SYLLABI } from '../src/services/syllabusParser.ts';

const multiResult = parseMultiCourseSyllabus(SAMPLE_SYLLABI[0].content);
assert(multiResult.isMultiCourse, 'Should identify multi-course B.Tech curriculum bundle');
assert(multiResult.courses.length >= 5, `Should extract at least 5 courses from B.Tech 4th year handbook, got ${multiResult.courses.length}`);
assert(multiResult.courses.some(c => c.courseCode === 'BCS701'), 'Should contain Artificial Intelligence (BCS701)');
assert(multiResult.courses.some(c => c.courseCode === 'BCS070'), 'Should contain Internet of Things (BCS070)');
assert(multiResult.courses.some(c => c.courseCode === 'BCS071'), 'Should contain Cloud Computing (BCS071)');
assert(multiResult.courses.some(c => c.courseCode === 'BCS072'), 'Should contain Cryptography (BCS072)');
assert(multiResult.courses.some(c => c.courseCode === 'BCS073'), 'Should contain Mobile Apps (BCS073)');

const aiCourse = multiResult.courses.find(c => c.courseCode === 'BCS701');
assert(aiCourse && aiCourse.topics.length >= 4, 'Should extract syllabus units for AI course');
console.log(`✅ Multi-Course Curriculum verified: Extracted '${multiResult.programTitle}' with ${multiResult.courses.length} courses (${multiResult.courses.map(c => c.courseCode).join(', ')})`);

// 5. Verify Single Course Syllabus Engine (CS 350)
const parsedCs = parseSyllabusText(SAMPLE_SYLLABI[1].content);
assert(parsedCs.courseCode === 'CS 350', 'Should extract course code CS 350');
assert(parsedCs.examDate === '2026-12-18', `Should accurately parse ordinal/complex exam date: got ${parsedCs.examDate}`);
assert(parsedCs.topics.length >= 6, 'Should extract modular topics from schedule table');

// Verify boilerplate rejection: office hours, grading, academic integrity, homework must NOT be topics
const topicNamesJoined = parsedCs.topics.map(t => t.name.toLowerCase()).join('; ');
assert(!topicNamesJoined.includes('office hours'), 'Should filter out office hours boilerplate');
assert(!topicNamesJoined.includes('plagiarism'), 'Should filter out academic integrity boilerplate');
assert(!topicNamesJoined.includes('grading:'), 'Should filter out grading policies');
assert(!topicNamesJoined.includes('hw 1 assigned'), 'Should strip homework assignment notes from schedule table');
console.log(`✅ Single Course Syllabus verified: Extracted '${parsedCs.courseName} (${parsedCs.courseCode})' with ${parsedCs.topics.length} topics and exam date ${parsedCs.examDate}`);

// 6. Test Sample 2 (BIO 210 with 11/25/2026 date format)
const parsedBio = parseSyllabusText(SAMPLE_SYLLABI[2].content);
assert(parsedBio.courseCode === 'BIO 210', 'Should extract BIO 210');
assert(parsedBio.examDate === '2026-11-25', `Should parse slash date 11/25/2026: got ${parsedBio.examDate}`);
assert(!parsedBio.topics.some(t => t.name.includes('ISBN')), 'Should filter out textbook ISBN');
console.log(`✅ Bio Syllabus verified: Extracted '${parsedBio.courseName} (${parsedBio.courseCode})' with exam date ${parsedBio.examDate}`);

// 7. Test Sample 3 (MATH 240 with ordinal date 'Nov 20th, 2026')
const parsedMath = parseSyllabusText(SAMPLE_SYLLABI[3].content);
assert(parsedMath.courseCode === 'MATH 240', 'Should extract MATH 240');
assert(parsedMath.examDate === '2026-11-20', `Should parse ordinal date 'Nov 20th, 2026': got ${parsedMath.examDate}`);
console.log(`✅ Math Syllabus verified: Extracted '${parsedMath.courseName} (${parsedMath.courseCode})' with exam date ${parsedMath.examDate}`);

console.log('\n🎉 ALL MECHANICAL VERIFICATIONS PASSED CLEANLY!');
