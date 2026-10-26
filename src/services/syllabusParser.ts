import type { Subject, Topic, Difficulty } from '../types/index.ts';
import { addDays, getTodayDateString } from '../utils/dateUtils.ts';

export interface ParsedSyllabusResult {
  courseName: string;
  courseCode: string;
  suggestedColor: string;
  examDate: string;
  confidenceScore?: number; // 0 - 100%
  extractionMethod?: 'ai' | 'heuristic';
  warnings?: string[];
  topics: Array<{
    name: string;
    difficulty: Difficulty;
    estimatedHours: number;
    pattern?: string;
  }>;
}

export interface MultiCourseSyllabusResult {
  isMultiCourse: boolean;
  programTitle: string;
  courses: ParsedSyllabusResult[];
}

// Preset color options
export const SUBJECT_COLORS = [
  '#6366f1', // Indigo
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ec4899', // Pink
  '#8b5cf6', // Purple
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
  '#ef4444', // Red
];

// Months lookup for multi-format date parser
const MONTH_NAMES: Record<string, number> = {
  jan: 1, january: 1,
  feb: 2, february: 2,
  mar: 3, march: 3,
  apr: 4, april: 4,
  may: 5,
  jun: 6, june: 6,
  jul: 7, july: 7,
  aug: 8, august: 8,
  sep: 9, sept: 9, september: 9,
  oct: 10, october: 10,
  nov: 11, november: 11,
  dec: 12, december: 12,
};

// Boilerplate patterns that should never be treated as academic topics
const BOILERPLATE_REGEX = [
  // Administrative & Instructor contacts
  /\b(?:office\s*hours?|instructor\s*:|professor\s*:|ta\s*:|teaching\s*assistant|zoom\s*link|meeting\s*id|passcode|phone\s*:|room\s*\d+|building|contact\s*info)\b/i,
  // Policies & Disclaimers
  /\b(?:academic\s*(?:integrity|honesty)|plagiarism|honor\s*code|code\s*of\s*conduct|disability|accommodations?|accessibility|title\s*ix|counseling|mental\s*health|attendance\s*policy|absence\s*policy|late\s*submissions?|late\s*policy|drop\s*deadline|withdraw\s*deadline)\b/i,
  // Grading & Breakdown
  /\b(?:grading\s*(?:policy|breakdown|criteria|scale)|grade\s*distribution|letter\s*grade|\d+%\s*(?:midterm|final|homework|quizzes|project|labs?)|points?\s*possible|rubric)\b/i,
  // Textbooks & Logistics
  /\b(?:required\s*text(?:book)?|recommended\s*reading|isbn\s*[:-]?\s*\d+|edition\s*\d+|bookstore|canvas\s*login|blackboard|github\s*classroom)\b/i,
  // Generic headings
  /^(?:syllabus|course\s*overview|course\s*description|prerequisites|learning\s*objectives|course\s*schedule|table\s*of\s*contents|week\s*dates?|module\s*dates?)$/i,
];

// Domain keywords for high-difficulty topics
const HARD_KEYWORDS = [
  'advanced',
  'concurrency',
  'deadlock',
  'dynamic programming',
  'graphs',
  'graph theory',
  'proof',
  'derivation',
  'synthesis',
  'mechanisms',
  'quantum',
  'compiler',
  'optimization',
  'dijkstra',
  'avl',
  'np-complete',
  'distributed',
  'operating systems',
  'cryptography',
  'spectral',
  'eigen',
  'fourier',
  'asymptotic',
  'kernel',
  'virtual memory',
  'security attacks',
  'neural networks',
  'search strategies',
];

// Domain keywords for introductory/easy topics
const EASY_KEYWORDS = [
  'introduction',
  'intro',
  'basics',
  'overview',
  'syntax',
  'review',
  'history',
  'definitions',
  'welcome',
  'setup',
  'installation',
  'warmup',
  'orientation',
  'elementary',
  'foundations',
];

/**
 * Universal date parser that handles ordinals ("Dec 14th"), missing years,
 * relative semester dates, and 8+ common calendar formats.
 */
function parseFlexibleExamDate(dateStr: string, today: string): string | null {
  const clean = dateStr
    // Remove ordinals like 1st, 2nd, 3rd, 14th
    .replace(/(\d+)(st|nd|rd|th)/gi, '$1')
    // Remove time like "at 2:00 PM", "2:00pm", "9:30 AM", "3pm"
    .replace(/(?:\bat\s+\d{1,2}(?::\d{2})?(?:\s*[ap]m)?|\b\d{1,2}:\d{2}(?:\s*[ap]m)?|\b\d{1,2}\s*[ap]m)\b/gi, '')
    // Remove day of week like Monday, Tue, etc.
    .replace(/\b(?:monday|tuesday|wednesday|thursday|friday|saturday|sunday|mon|tue|wed|thu|fri|sat|sun)[.,]?\b/gi, '')
    .trim();

  // Pattern A: "Month Day, Year" or "Month Day" (e.g. "December 18, 2026" or "Dec 18")
  const monthDayMatch = clean.match(/\b([A-Za-z]+)\.?\s+(\d{1,2})(?:[,\s]+(\d{4}))?\b/);
  if (monthDayMatch) {
    const monthKey = monthDayMatch[1].toLowerCase();
    const monthNum = MONTH_NAMES[monthKey];
    if (monthNum) {
      const dayNum = parseInt(monthDayMatch[2], 10);
      const currentYear = new Date().getFullYear();
      let yearNum = monthDayMatch[3] ? parseInt(monthDayMatch[3], 10) : currentYear;

      const formatted = `${yearNum}-${String(monthNum).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      if (!monthDayMatch[3] && formatted < today) {
        yearNum += 1;
        return `${yearNum}-${String(monthNum).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      }
      return formatted;
    }
  }

  // Pattern B: "Day Month Year" or "Day Month" (e.g. "18 December 2026" or "18 Dec")
  const dayMonthMatch = clean.match(/\b(\d{1,2})\s+([A-Za-z]+)\.?\s*(?:[,\s]+(\d{4}))?\b/);
  if (dayMonthMatch) {
    const monthKey = dayMonthMatch[2].toLowerCase();
    const monthNum = MONTH_NAMES[monthKey];
    if (monthNum) {
      const dayNum = parseInt(dayMonthMatch[1], 10);
      const currentYear = new Date().getFullYear();
      let yearNum = dayMonthMatch[3] ? parseInt(dayMonthMatch[3], 10) : currentYear;

      const formatted = `${yearNum}-${String(monthNum).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      if (!dayMonthMatch[3] && formatted < today) {
        yearNum += 1;
        return `${yearNum}-${String(monthNum).padStart(2, '0')}-${String(dayNum).padStart(2, '0')}`;
      }
      return formatted;
    }
  }

  // Pattern C: ISO "YYYY-MM-DD" or "YYYY/MM/DD"
  const isoMatch = clean.match(/\b(\d{4})[-\/](\d{1,2})[-\/](\d{1,2})\b/);
  if (isoMatch) {
    return `${isoMatch[1]}-${isoMatch[2].padStart(2, '0')}-${isoMatch[3].padStart(2, '0')}`;
  }

  // Pattern D: "MM/DD/YYYY" or "M/D/YY"
  const slashMatch = clean.match(/\b(\d{1,2})[\/.-](\d{1,2})[\/.-](\d{2,4})\b/);
  if (slashMatch) {
    let year = parseInt(slashMatch[3], 10);
    if (year < 100) year += 2000;
    const month = String(parseInt(slashMatch[1], 10)).padStart(2, '0');
    const day = String(parseInt(slashMatch[2], 10)).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // Standard fallback
  const fallbackTimestamp = Date.parse(clean);
  if (!isNaN(fallbackTimestamp)) {
    const d = new Date(fallbackTimestamp);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  }

  return null;
}

/**
 * Enhanced Heuristic Syllabus Parser for a single course.
 */
export function parseSyllabusText(text: string): ParsedSyllabusResult {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);

  const today = getTodayDateString();
  const warnings: string[] = [];

  // 1. Extract Course Title & Course Code
  let courseCode = 'COURSE 101';
  let courseName = '';

  const codeRegex = /\b([A-Z]{2,5})\s*[-_:]?\s*(\d{2,4}[A-Z]?)\b/i;
  
  for (const line of lines.slice(0, 15)) {
    if (/\b(?:room|box|fall|spring|summer|winter|year|page|crn)\b/i.test(line)) {
      continue;
    }
    const codeMatch = line.match(codeRegex);
    if (codeMatch) {
      courseCode = `${codeMatch[1].toUpperCase()} ${codeMatch[2].toUpperCase()}`;
      
      const parts = line.split(codeMatch[0]);
      let candidateTitle = '';
      if (parts[1] && parts[1].replace(/^[:\-\s–|()]+/, '').replace(/[:\-\s–|()]+$/, '').trim().length > 4) {
        candidateTitle = parts[1].replace(/^[:\-\s–|()]+/, '').replace(/[:\-\s–|()]+$/, '').trim();
      } else if (parts[0] && parts[0].replace(/[:\-\s–|()]+$/, '').trim().length > 4) {
        candidateTitle = parts[0]
          .replace(/^(?:course\s*(?:title|name)?|syllabus|fall|spring|winter|summer|\d{4})[:\-\s]*/i, '')
          .replace(/[:\-\s–|()]+$/, '')
          .trim();
      }
      
      if (candidateTitle.length > 4 && !candidateTitle.includes('http')) {
        courseName = candidateTitle;
      }
      break;
    }
  }

  if (!courseName) {
    for (const line of lines.slice(0, 8)) {
      if (
        !BOILERPLATE_REGEX.some((rgx) => rgx.test(line)) &&
        !line.toLowerCase().includes('syllabus') &&
        line.length >= 4 &&
        line.length <= 65 &&
        !line.includes('@') &&
        !line.includes('http')
      ) {
        courseName = line.replace(/^(?:course\s*:|\s*#\s*)/i, '').trim();
        break;
      }
    }
  }

  if (!courseName) {
    courseName = 'University Course';
    warnings.push('Course name defaulted; check title');
  }

  // 2. Extract Exam Date
  let examDate = addDays(today, 28); // Default 4 weeks out for university courses
  let foundExamDate = false;

  const examKeywords = /(?:final\s*(?:exam|examination|assessment|test|evaluation)|finals|midterm(?:\s*exam)?|exam\s*date|test\s*date)\s*[:\-–]?\s*([^\n\r;|]+)/i;

  for (const line of lines) {
    const examMatch = line.match(examKeywords);
    if (examMatch && examMatch[1]) {
      const candidateDate = parseFlexibleExamDate(examMatch[1], today);
      if (candidateDate && candidateDate >= today) {
        examDate = candidateDate;
        foundExamDate = true;
        break;
      }
    }
  }

  // 3. Extract Units / Topics (Supports table rows, Roman numeral Units I-V, Lab experiments, and Modules)
  const topics: ParsedSyllabusResult['topics'] = [];

  // Branch 1: If text has structured table delimiters (| or \t) like CS 350
  if (text.includes('|')) {
    for (const rawLine of lines) {
      if (BOILERPLATE_REGEX.some((rgx) => rgx.test(rawLine))) continue;
      if (rawLine.includes('|')) {
        const parts = rawLine.split('|').map((p) => p.trim()).filter((p) => p.length > 0);
        for (const part of parts) {
          if (
            part.length >= 6 &&
            part.length <= 80 &&
            !/^(?:week\s*\d+|module\s*\d+|date|reading|hw|homework|assignment|ch\.?\s*\d+|\d{1,2}[\/\-]\d{1,2})/i.test(part) &&
            !BOILERPLATE_REGEX.some((r) => r.test(part))
          ) {
            let topicCandidate = part
              .replace(/\((?:read|ch|pp|pages|see)?[^)]*\)/gi, '')
              .replace(/\[(?:read|ch|pp|pages|hw)?[^\]]*\]/gi, '')
              .replace(/,\s*(?:ch|chapter|reading)\.?\s*\d+.*$/gi, '')
              .replace(/\s{2,}/g, ' ')
              .trim();

            if (topicCandidate.length >= 5 && !topics.some((t) => t.name.toLowerCase() === topicCandidate.toLowerCase())) {
              const lower = topicCandidate.toLowerCase();
              let difficulty: Difficulty = 'medium';
              let estimatedHours = 2.0;
              if (HARD_KEYWORDS.some((kw) => lower.includes(kw))) {
                difficulty = 'hard';
                estimatedHours = 2.5;
              } else if (EASY_KEYWORDS.some((kw) => lower.includes(kw))) {
                difficulty = 'easy';
                estimatedHours = 1.5;
              }

              topics.push({
                name: topicCandidate,
                difficulty,
                estimatedHours,
                pattern: courseName,
              });
              break;
            }
          }
        }
      }
    }
  }

  // Branch 2: Unit Roman Numeral (e.g. "Unit I: Introduction" or "I Problem Solving...")
  if (topics.length === 0) {
    const unitRomanRegex = /(?:^|\n)\s*(?:Unit\s*)?([IVX]+|\d+)\s*[:.\-–]?\s*([A-Za-z0-9\s,&/–()'-]+?)(?::|\s{2,}|Proposed|\d{1,2}\s*$|\r?\n)/gi;
    let uMatch;
    while ((uMatch = unitRomanRegex.exec(text)) !== null) {
      const uNum = uMatch[1].trim();
      const uTitle = uMatch[2].trim();
      if (uTitle.length >= 4 && !/^(?:Topic|Unit|Proposed|Lecture|Syllabus|Course|Semester|Credit|Scheme|Evaluation)$/i.test(uTitle)) {
        if (!topics.some((t) => t.name.toLowerCase() === uTitle.toLowerCase())) {
          const lower = uTitle.toLowerCase();
          let difficulty: Difficulty = 'medium';
          if (HARD_KEYWORDS.some((kw) => lower.includes(kw))) difficulty = 'hard';
          else if (EASY_KEYWORDS.some((kw) => lower.includes(kw))) difficulty = 'easy';

          topics.push({
            name: `Unit ${uNum}: ${uTitle}`,
            difficulty,
            estimatedHours: 4.0, // standard 4 to 8 hours per university unit
            pattern: courseName,
          });
        }
      }
    }
  }

  // Branch 3: Lab experiments (e.g. "1. Implement BFS...")
  if (topics.length === 0) {
    const labRegex = /(?:^|\n)\s*(\d{1,2})\.\s*([^\n\r]{8,90})/g;
    let lMatch;
    while ((lMatch = labRegex.exec(text)) !== null) {
      const lTitle = lMatch[2].trim();
      if (!BOILERPLATE_REGEX.some((r) => r.test(lTitle))) {
        topics.push({
          name: `Exp ${lMatch[1]}: ${lTitle}`,
          difficulty: 'medium',
          estimatedHours: 2.0,
          pattern: courseName,
        });
      }
    }
  }

  // Branch 4: Standard prefix outline fallback (Module 1, Week 2, Topic 3...)
  if (topics.length === 0) {
    const structuredPrefixRegex = /^(?:week\s*\d+|module\s*\d+|unit\s*\d+|chapter\s*\d+|topic\s*\d+|lecture\s*[\d\-]+|\d+\.|\*|\-|\u2022)\s*[:\-–.]?\s*(.+)$/i;

    for (const rawLine of lines) {
      if (BOILERPLATE_REGEX.some((rgx) => rgx.test(rawLine))) continue;

      let topicCandidate = '';
      const prefixMatch = rawLine.match(structuredPrefixRegex);
      if (prefixMatch && prefixMatch[1]) {
        topicCandidate = prefixMatch[1].trim();
      } else if (
        (rawLine.includes(':') || rawLine.includes(' - ') || rawLine.includes(' – ')) &&
        rawLine.length > 8 &&
        rawLine.length < 85 &&
        !rawLine.includes('@') &&
        !rawLine.includes('http')
      ) {
        const colonSplit = rawLine.split(/[:–-]/);
        if (colonSplit.length === 2 && colonSplit[1].trim().length > 6) {
          topicCandidate = colonSplit[1].trim();
        } else {
          topicCandidate = rawLine.trim();
        }
      }

      if (topicCandidate) {
        topicCandidate = topicCandidate
          .replace(/\((?:read|ch|pp|pages|see)?[^)]*\)/gi, '')
          .replace(/\[(?:read|ch|pp|pages|hw)?[^\]]*\]/gi, '')
          .replace(/,\s*(?:ch|chapter|reading)\.?\s*\d+.*$/gi, '')
          .replace(/\s{2,}/g, ' ')
          .trim();

        if (
          topicCandidate.length >= 5 &&
          topicCandidate.length <= 85 &&
          !BOILERPLATE_REGEX.some((r) => r.test(topicCandidate)) &&
          !/^(?:overview|review|exam|spring|fall|winter|summer|dates?)$/i.test(topicCandidate)
        ) {
          if (!topics.some((t) => t.name.toLowerCase() === topicCandidate.toLowerCase())) {
            const lower = topicCandidate.toLowerCase();
            let difficulty: Difficulty = 'medium';
            let estimatedHours = 2.0;

            if (HARD_KEYWORDS.some((kw) => lower.includes(kw))) {
              difficulty = 'hard';
              estimatedHours = 2.5;
            } else if (EASY_KEYWORDS.some((kw) => lower.includes(kw))) {
              difficulty = 'easy';
              estimatedHours = 1.5;
            }

            topics.push({
              name: topicCandidate,
              difficulty,
              estimatedHours,
              pattern: courseName,
            });
          }
        }
      }
    }
  }

  // Fallback if still empty
  if (topics.length === 0) {
    const candidateLines = lines.filter(
      (l) =>
        l.length > 8 &&
        l.length < 75 &&
        !l.includes('http') &&
        !l.includes('@') &&
        !BOILERPLATE_REGEX.some((r) => r.test(l))
    );
    for (const l of candidateLines.slice(1, 8)) {
      topics.push({
        name: l.replace(/^[0-9.\-*\s]+/, '').trim(),
        difficulty: 'medium',
        estimatedHours: 2.0,
      });
    }
    warnings.push('Used loose line detection');
  }

  let confidenceScore = 65;
  if (courseCode !== 'COURSE 101') confidenceScore += 15;
  if (foundExamDate) confidenceScore += 10;
  if (topics.length >= 4) confidenceScore += 10;

  return {
    courseName,
    courseCode,
    suggestedColor: SUBJECT_COLORS[Math.floor(Math.random() * SUBJECT_COLORS.length)],
    examDate,
    confidenceScore: Math.min(confidenceScore, 98),
    extractionMethod: 'heuristic',
    warnings: warnings.length > 0 ? warnings : undefined,
    topics,
  };
}

/**
 * Universal Multi-Course Curriculum Ingestion Parser.
 * Detects whether a document contains an entire semester/year handbook (e.g. B.Tech 4th Year)
 * and extracts all subjects one by one with their respective units, codes, and hours.
 */
export function parseMultiCourseSyllabus(text: string): MultiCourseSyllabusResult {
  const cleanText = text.replace(/\r\n/g, '\n');

  // 1. Detect degree/program title
  let programTitle = 'B.Tech 4th Year — Computer Science and Design';
  const programMatch = cleanText.match(/\b(?:B\.?\s*TECH\.?|BACHELOR\s*OF\s*TECHNOLOGY)[\s\S]*?(?:4TH|\d(?:ST|ND|RD|TH)?)\s*YEAR[\s\S]*?(?:Computer\s*Science[^\n\r]*|Design[^\n\r]*|[^\n\r]{4,50})/i);
  if (programMatch) {
    const rawLine = programMatch[0].split('\n')[0].replace(/[\-_=]+/g, '').trim();
    if (rawLine.length > 5 && rawLine.length < 80) {
      programTitle = rawLine;
    }
  }

  // 2. Look for multiple course headers
  // E.g. "Artificial Intelligence (BCS701)", "Cloud Computing (BCS071)", "BCS751 ARTIFICIAL INTELLIGENCE LAB"
  const headerPattern = /(?:^|\n)\s*(?:([A-Za-z\s&,/–-]+?)\s*\(([A-Z]{2,5}\s*\d{2,4}[A-Z]?)\)|([A-Z]{2,5}\s*\d{2,4}[A-Z]?)\s*[:\-–]?\s*([A-Za-z\s&,/–-]+?(?:LAB|LABORATORY|PRACTICAL)?))\s*(?=\r?\n|DETAILED SYLLABUS|Course Outcome|\(CO\)|Bloom)/gi;

  const matches: Array<{ name: string; code: string; index: number }> = [];
  let m;
  while ((m = headerPattern.exec(cleanText)) !== null) {
    const rawName = (m[1] || m[4] || '').trim();
    const rawCode = (m[2] || m[3] || '').trim().toUpperCase();
    if (rawName.length > 3 && rawCode.length >= 4 && !/^(?:Total|Credit|Proposed|Lecture|Evaluation|Scheme)/i.test(rawName)) {
      const cleanName = rawName.replace(/^Course\s*:\s*/i, '').replace(/^[0-9.\-\s]+/, '').trim();
      // Avoid duplicate header detections
      if (!matches.some((match) => match.code === rawCode)) {
        matches.push({
          name: cleanName,
          code: rawCode,
          index: m.index,
        });
      }
    }
  }

  // If 2 or more distinct courses are identified, parse as multi-course curriculum
  if (matches.length >= 2) {
    const courses: ParsedSyllabusResult[] = [];
    const today = getTodayDateString();

    for (let i = 0; i < matches.length; i++) {
      const cur = matches[i];
      const nextIndex = i + 1 < matches.length ? matches[i + 1].index : cleanText.length;
      const block = cleanText.slice(cur.index, nextIndex);

      // Parse this specific subject block
      const singleParsed = parseSyllabusText(block);
      
      courses.push({
        ...singleParsed,
        courseName: cur.name,
        courseCode: cur.code,
        suggestedColor: SUBJECT_COLORS[i % SUBJECT_COLORS.length],
        examDate: addDays(today, 28 + i * 2), // Stagger exam dates slightly across exam week
        confidenceScore: 98,
        extractionMethod: 'heuristic',
      });
    }

    return {
      isMultiCourse: true,
      programTitle,
      courses,
    };
  }

  // Single course fallback
  const single = parseSyllabusText(cleanText);
  return {
    isMultiCourse: false,
    programTitle: single.courseName,
    courses: [single],
  };
}

/**
 * AI-Powered Syllabus Parser via Google Gemini Flash API.
 * Supports zero-shot extraction for single or multi-course curriculum documents.
 */
export async function parseSyllabusWithGemini(
  text: string,
  apiKey: string
): Promise<MultiCourseSyllabusResult> {
  if (!apiKey || apiKey.trim().length < 10) {
    throw new Error('Valid Gemini API key required for AI extraction');
  }

  const prompt = `You are an expert college academic advisor and curriculum parser for FocusFlow AI.
Analyze the following university syllabus or evaluation scheme handbook.
If it contains multiple subjects (e.g. B.Tech 4th Year with AI, Cloud Computing, IoT, Cryptography, etc.), extract ALL courses into the "courses" array.
For each course:
1. "courseName": Clean, exact course title
2. "courseCode": Academic course code (e.g. "BCS701", "BCS070")
3. "examDate": Target exam date in "YYYY-MM-DD" format (default 3 to 4 weeks out if not explicitly given)
4. "topics": The 5 Units or lecture modules in order. Each topic has:
   - "name": e.g. "Unit 1: Introduction to AI & Intelligent Agents"
   - "difficulty": "easy", "medium", or "hard"
   - "estimatedHours": number (e.g. 4.0 or 8.0)

Output ONLY valid JSON matching this schema:
{
  "programTitle": "string",
  "courses": [
    {
      "courseName": "string",
      "courseCode": "string",
      "examDate": "YYYY-MM-DD",
      "topics": [
        {
          "name": "string",
          "difficulty": "easy" | "medium" | "hard",
          "estimatedHours": number
        }
      ]
    }
  ]
}

Syllabus Text:
"""
${text.slice(0, 16000)}
"""`;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }],
          },
        ],
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.1,
        },
      }),
    }
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Gemini API error (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  const rawJson = data.candidates?.[0]?.content?.parts?.[0]?.text;

  if (!rawJson) {
    throw new Error('Gemini returned an empty response');
  }

  const parsed = JSON.parse(rawJson);
  const rawCourses = Array.isArray(parsed.courses) ? parsed.courses : [parsed];

  const courses: ParsedSyllabusResult[] = rawCourses.map((c: any, idx: number) => ({
    courseName: c.courseName || 'University Course',
    courseCode: c.courseCode || `COURSE ${100 + idx}`,
    suggestedColor: SUBJECT_COLORS[idx % SUBJECT_COLORS.length],
    examDate: c.examDate || addDays(getTodayDateString(), 28 + idx * 2),
    confidenceScore: 99,
    extractionMethod: 'ai',
    topics: (c.topics || []).map((t: any) => ({
      name: t.name || 'Core Unit',
      difficulty: (['easy', 'medium', 'hard'].includes(t.difficulty) ? t.difficulty : 'medium') as Difficulty,
      estimatedHours: typeof t.estimatedHours === 'number' ? Math.max(1, Math.min(t.estimatedHours, 10)) : 4.0,
      pattern: c.courseName,
    })),
  }));

  return {
    isMultiCourse: courses.length > 1,
    programTitle: parsed.programTitle || 'B.Tech 4th Year Curriculum',
    courses,
  };
}

/**
 * Pre-defined sample syllabi for students to test instant document parsing with 1 click.
 */
export const SAMPLE_SYLLABI: Array<{ title: string; subtitle: string; content: string }> = [
  {
    title: '🎓 AKTU B.Tech 4th Year (CS & Design) Bundle',
    subtitle: '5 Core Courses: AI (BCS701), IoT (BCS070), Cloud (BCS071), Crypto (BCS072), Mobile Apps (BCS073)',
    content: `DR. A.P.J. ABDUL KALAM TECHNICAL UNIVERSITY, LUCKNOW, UTTAR PRADESH
EVALUATION SCHEME & SYLLABUS FOR B. TECH. 4TH YEAR
Computer Science and Design Based On NEP2020 (Session: 2025-26)

SEMESTER- VII
1 BCS701 Artificial Intelligence (Credit: 3)
2 BCS070 Internet of Things (Credit: 3)
3 BCS071 Cloud Computing (Credit: 3)
4 BCS072 Cryptography & Network Security (Credit: 3)
5 BCS073 Design & Development of Applications (Credit: 3)
6 BCS751 Artificial Intelligence LAB (Credit: 1)

Artificial Intelligence (BCS701)
DETAILED SYLLABUS
Unit Topic Proposed Lecture
I Introduction to Artificial Intelligence & Intelligent Agents: Definition and scope of AI, History and applications of AI, Characteristics of Intelligent Agents, Agent architecture, Problem Solving Approach 08
II Problem Solving & Search Strategies: Uninformed Search: BFS, DFS, Iterative Deepening, Informed Search: Greedy Best-First, A* Search, Heuristics, Hill Climbing, Simulated Annealing, Game Playing: Min-max, Alpha-Beta Pruning 08
III Knowledge Representation & Reasoning: Propositional and First Order Logic, Syntax, Semantics, Wumpus world, Logic Programming using Prolog, Forward and Backward Chaining, Resolution 08
IV Uncertainty & Learning Techniques: Probabilistic reasoning, Bayes' Rule, Bayesian Networks, Fuzzy logic, Neural Networks (basics): Perceptron, Backpropagation, Supervised and Unsupervised Learning 08
V Applications of AI & Multi-Agent Systems: Natural Language Processing, Machine Translation, Information Retrieval, Robotics: Perception and Motion, Software Agents, Explainable AI (XAI) 08

Internet of Things (BCS070)
DETAILED SYLLABUS
Unit Topic Proposed Lecture
I Internet of Things (IoT): Vision, Definition, Conceptual Framework, Architectural view, M2M Communication, Design Principles for Connected Devices, Standardization 08
II Hardware for IoT: Sensors, Digital sensors, actuators, RFID technology, Wireless sensor networks, Embedded Platforms: Arduino, Raspberry Pi, Beagle Bone, ARM cortex 08
III Network & Communication aspects in IoT: Wireless Medium access issues, MAC protocol survey, Routing protocols, Sensor deployment & Node discovery 08
IV Programming the Arduino: Arduino Platform Boards Anatomy, Arduino IDE, coding, emulators, using libraries, programming Arduino for IoT 08
V Challenges in IoT Design: Development Challenges, Security Challenges, IoT Applications: Smart Metering, E-health, City Automation, Automotive, Smart street lights 08

Cloud Computing (BCS071)
DETAILED SYLLABUS
Unit Topic Proposed Lecture
I Introduction To Cloud Computing: Definition of Cloud, Evolution of Cloud Computing, Parallel and Distributed Computing, Elasticity in Cloud, On-demand Provisioning 08
II Cloud Enabling Technologies Service Oriented Architecture: REST, Web Services, Virtualization basics, CPU/Memory/IO Virtualization, Disaster Recovery 08
III Cloud Architecture, Services And Storage: NIST Cloud Architecture, Public, Private and Hybrid Clouds, IaaS, PaaS, SaaS, Cloud Storage, S3 08
IV Resource Management And Security In Cloud: Inter Cloud Resource Management, Security Overview, SaaS Security, Virtual Machine Security, IAM 08
V Cloud Technologies And Advancements: Hadoop, MapReduce, Open Stack, Google App Engine, Federation in the Cloud 08

Cryptography & Network Security (BCS072)
DETAILED SYLLABUS
Unit Topic Proposed Lecture
I Introduction to security attacks, services and mechanism, Classical encryption (substitution, transposition), Stream and block ciphers, DES, Triple DES 08
II Finite Fields GF(p), Modular arithmetic, Extended Euclidean Algorithm, AES encryption/decryption, Fermat's & Euler's theorem, RSA algorithm 08
III Message Authentication Codes: Hash functions, SHA, Digital Signatures (DSS), Elgamal Signature Techniques 08
IV Key Management and distribution: Symmetric key distribution, Diffie-Hellman Key Exchange, Public key distribution, X.509, PKI, PGP, S/MIME 08
V IP Security: Architecture, Authentication header, ESP, Intrusion detection, Viruses and related threats, Firewalls 08

Design & Development of Applications (BCS073)
DETAILED SYLLABUS
Unit Topic Proposed Lecture
I Introduction to mobile applications: Embedded systems, Market drivers, Publishing and delivery, Requirements gathering 08
II Basic Design: Embedded systems design, Embedded OS, Mobile UI, Touch events and gestures, Quality constraints 08
III Advanced Design: Multimedia, Web access, GPS and Social media integration, Cloud environment access, Design patterns 08
IV Technology I – Android: Android architecture, Activities, Views, SQLite, Packaging and deployment, Google Maps, Wi-Fi 08
V Technology II – iOS: Objective C, Swift features, UI implementation, Core Data, Location and Map Kit 08

BCS751 ARTIFICIAL INTELLIGENCE LAB
DETAILED SYLLABUS
1. Implement Breadth First Search (BFS) for a given graph or maze.
2. Implement Depth First Search (DFS) for a tree or graph structure.
3. Solve the 8-Puzzle Problem using A* Search Algorithm.
4. Implement Hill Climbing Algorithm for numerical optimization or pathfinding.
5. Implement Simulated Annealing Algorithm for constraint-based search problems.
6. Solve Water Jug Problem using state-space search (BFS or DFS).
7. Write Prolog programs to define family relationships using predicates.
8. Implement 4-Queens Problem in Prolog using backtracking.
9. Implement Unification Algorithm in Python or Prolog.
10. Implement Min-Max (Minimax) Algorithm for decision making in turn-based games.
11. Enhance the game with Alpha-Beta Pruning to optimize Min-Max.
12. Build a simple chatbot using rules or pre-trained logic.`,
  },
  {
    title: 'CS 350: Operating Systems & Concurrency',
    subtitle: 'Threads, Paging, Virtual Memory, Deadlocks & File Systems',
    content: `Course: CS 350 Operating Systems & System Programming
Instructor: Prof. Henderson (Office: Hall 402, Office Hours: MW 2-4 PM)
TA: Alex (alex@university.edu)
Grading: Midterm 30%, Final Exam 40%, Homework 30%
Final Exam Date: December 18, 2026 at 2:00 PM

Academic Integrity: All code submitted must be original. Plagiarism results in failure.

Weekly Schedule & Modules:
Week 1 | Jan 15 | Processes, Threads and Context Switching | Ch. 1-2 | HW 1 Assigned
Week 2 | Jan 22 | CPU Scheduling Algorithms (Round Robin, Multi-level Queue) | Ch. 3 | Lab 1
Week 3 | Jan 29 | Concurrency, Mutex Locks & Semaphores | Ch. 4 | HW 1 Due
Week 4 | Feb 05 | Deadlock Characterization & Banker's Algorithm | Ch. 5 | Lab 2
Week 5 | Feb 12 | Memory Management, Paging & Page Replacement (LRU) | Ch. 6 | HW 2
Week 6 | Feb 19 | Virtual Memory and Translation Lookaside Buffer (TLB) | Ch. 7 | Lab 3
Week 7 | Feb 26 | File System Implementation, Inodes & Directory Structure | Ch. 8 | HW 3
Week 8 | Mar 05 | Distributed Systems & Distributed Consensus (Raft) | Ch. 9 | Final Review`,
  },
  {
    title: 'BIO 210: Molecular Genetics & Cell Biology',
    subtitle: 'DNA Replication, Gene Expression, CRISPR & Signal Transduction',
    content: `Course: BIO 210 Molecular Genetics & Cell Biology
Final Assessment Date: 11/25/2026
Required Textbook: Molecular Biology of the Cell, 7th Edition, ISBN 978-0393884821
Instructor: Dr. Maya Patel (Office Hours: Tuesday 10-12 via Zoom)

Syllabus Breakdown:
Module 1: DNA Structure, Chromatin Architecture & Histone Modification
Module 2: DNA Replication Mechanisms and Proofreading Enzymes
Module 3: Transcription Factors & RNA Polymerase II Initiation
Module 4: RNA Splicing, Spliceosome Assembly & Alternative Exons
Module 5: Translation & Ribosomal Peptidyl Transferase Kinetics
Module 6: CRISPR-Cas9 Gene Editing & Recombinant DNA Technologies
Module 7: Receptor Tyrosine Kinases & MAPK Signal Transduction Pathways`,
  },
  {
    title: 'MATH 240: Linear Algebra & Matrix Theory',
    subtitle: 'Vector Spaces, Eigenvalues, SVD & Orthogonal Projections',
    content: `Department of Mathematics - MATH 240: Linear Algebra and Matrix Theory
Final Exam: Nov 20th, 2026
Course Policies: No graphing calculators allowed during exams.

Topics Covered:
1. Systems of Linear Equations & Gaussian Elimination
2. Vector Spaces, Subspaces & Linear Independence
3. Matrix Transformations, Inverses and Determinants
4. Eigenvalues, Eigenvectors and Matrix Diagonalization
5. Inner Product Spaces, Gram-Schmidt & Orthogonal Projections
6. Symmetric Matrices, Quadratic Forms & Spectral Theorem
7. Singular Value Decomposition (SVD) and Principal Component Analysis`,
  },
];

/**
 * Convert parsed result into a full Subject object.
 */
export function createSubjectFromParsed(parsed: ParsedSyllabusResult): Subject {
  const subjectId = `subj-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  const topics: Topic[] = parsed.topics.map((t, idx) => ({
    id: `top-${subjectId}-${idx + 1}`,
    subjectId,
    name: t.name,
    difficulty: t.difficulty,
    estimatedHours: t.estimatedHours,
    completedHours: 0,
    isCompleted: false,
    pattern: t.pattern,
  }));

  return {
    id: subjectId,
    name: parsed.courseName,
    code: parsed.courseCode,
    color: parsed.suggestedColor,
    examDate: parsed.examDate,
    topics,
  };
}
