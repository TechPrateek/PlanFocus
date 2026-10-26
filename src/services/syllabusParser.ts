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
      // If no year specified and date has passed this year, roll over to next year
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
 * Enhanced Heuristic Syllabus Parser (100% Client-Side & Offline).
 * Employs noise-filtering, structural line analysis, and multi-format regex.
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

  // Look for academic course codes like CS 350, CS-350, MATH 240, BIO 101, CHEM 220, ECE 382N
  const codeRegex = /\b([A-Z]{2,5})\s*[-_:]?\s*(\d{2,4}[A-Z]?)\b/i;
  
  for (const line of lines.slice(0, 15)) {
    // Avoid false positives like "PO BOX 123" or "FALL 2026" or "ROOM 101"
    if (/\b(?:room|box|fall|spring|summer|winter|year|page|crn)\b/i.test(line)) {
      continue;
    }
    const codeMatch = line.match(codeRegex);
    if (codeMatch) {
      courseCode = `${codeMatch[1].toUpperCase()} ${codeMatch[2].toUpperCase()}`;
      
      // Clean candidate title: prefer the text following the code if available (e.g. "MATH 240: Linear Algebra")
      const parts = line.split(codeMatch[0]);
      let candidateTitle = '';
      if (parts[1] && parts[1].replace(/^[:\-\s–|]+/, '').trim().length > 4) {
        candidateTitle = parts[1].replace(/^[:\-\s–|]+/, '').trim();
      } else if (parts[0] && parts[0].replace(/[:\-\s–|]+$/, '').trim().length > 4) {
        candidateTitle = parts[0]
          .replace(/^(?:course\s*(?:title|name)?|syllabus|fall|spring|winter|summer|\d{4})[:\-\s]*/i, '')
          .replace(/[:\-\s–|]+$/, '')
          .trim();
      }
      
      if (candidateTitle.length > 4 && !candidateTitle.includes('http')) {
        courseName = candidateTitle;
      }
      break;
    }
  }

  // If title was not on code line, look for the first non-boilerplate header line
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
  let examDate = addDays(today, 21); // Default 3 weeks out
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

  // Fallback: search for standalone "Finals" or dates in schedule tables
  if (!foundExamDate) {
    for (const line of lines.slice(-20)) {
      if (/final/i.test(line)) {
        const candidateDate = parseFlexibleExamDate(line, today);
        if (candidateDate && candidateDate >= today) {
          examDate = candidateDate;
          foundExamDate = true;
          break;
        }
      }
    }
  }

  // 3. Extract Topics
  const topics: ParsedSyllabusResult['topics'] = [];

  // Patterns indicating structured modules or lecture outlines
  const structuredPrefixRegex = /^(?:week\s*\d+|module\s*\d+|unit\s*\d+|chapter\s*\d+|topic\s*\d+|lecture\s*[\d\-]+|\d+\.|\*|\-|\u2022)\s*[:\-–.]?\s*(.+)$/i;

  for (const rawLine of lines) {
    // A. Skip boilerplate and administrative policies
    if (BOILERPLATE_REGEX.some((rgx) => rgx.test(rawLine))) {
      continue;
    }

    let topicCandidate = '';

    // B. Check for weekly schedule table row (e.g. "Week 1 | Jan 15 | Processes & Threads | Ch 1")
    if (rawLine.includes('|') || rawLine.includes('\t')) {
      const parts = rawLine
        .split(/[|\t]/)
        .map((p) => p.trim())
        .filter((p) => p.length > 0);

      // Find the part that looks like a genuine topic title
      for (const part of parts) {
        // Exclude dates, weeks, chapters, homework mentions
        if (
          part.length >= 6 &&
          part.length <= 80 &&
          !/^(?:week\s*\d+|module\s*\d+|date|reading|hw|homework|assignment|ch\.?\s*\d+|\d{1,2}[\/\-]\d{1,2})/i.test(part) &&
          !BOILERPLATE_REGEX.some((r) => r.test(part))
        ) {
          topicCandidate = part;
          break;
        }
      }
    } else {
      // C. Check for standard module or bullet outline
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
        // Extract right side if it looks like "Module: Title" or use line
        const colonSplit = rawLine.split(/[:–-]/);
        if (colonSplit.length === 2 && colonSplit[1].trim().length > 6) {
          topicCandidate = colonSplit[1].trim();
        } else {
          topicCandidate = rawLine.trim();
        }
      }
    }

    // D. Clean candidate and strip reading notes like "(Read Ch. 4)" or "[Homework 1]"
    if (topicCandidate) {
      topicCandidate = topicCandidate
        .replace(/\((?:read|ch|pp|pages|see)?[^)]*\)/gi, '')
        .replace(/\[(?:read|ch|pp|pages|hw)?[^\]]*\]/gi, '')
        .replace(/,\s*(?:ch|chapter|reading)\.?\s*\d+.*$/gi, '')
        .replace(/\s{2,}/g, ' ')
        .trim();

      // Check min/max bounds and ensure it's not a noise line
      if (
        topicCandidate.length >= 5 &&
        topicCandidate.length <= 85 &&
        !BOILERPLATE_REGEX.some((r) => r.test(topicCandidate)) &&
        !/^(?:overview|review|exam|spring|fall|winter|summer|dates?)$/i.test(topicCandidate)
      ) {
        // Avoid duplicate topics
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

  // Fallback: If strict parsing found 0 topics, pick non-boilerplate content lines
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

  // Calculate extraction confidence score (0 to 100)
  let confidenceScore = 60;
  if (courseCode !== 'COURSE 101') confidenceScore += 15;
  if (foundExamDate) confidenceScore += 15;
  if (topics.length >= 4) confidenceScore += 10;

  return {
    courseName,
    courseCode,
    suggestedColor: SUBJECT_COLORS[Math.floor(Math.random() * SUBJECT_COLORS.length)],
    examDate,
    confidenceScore: Math.min(confidenceScore, 95),
    extractionMethod: 'heuristic',
    warnings: warnings.length > 0 ? warnings : undefined,
    topics,
  };
}

/**
 * AI-Powered Syllabus Parser via Google Gemini Flash API.
 * Yields near-perfect structured extraction for complex, messy, or tabular syllabi.
 */
export async function parseSyllabusWithGemini(
  text: string,
  apiKey: string
): Promise<ParsedSyllabusResult> {
  if (!apiKey || apiKey.trim().length < 10) {
    throw new Error('Valid Gemini API key required for AI extraction');
  }

  const prompt = `You are an expert college academic advisor and syllabus parser for FocusFlow AI.
Analyze the following university course syllabus or document text.
Extract:
1. "courseName": The clean, exact course title (e.g. "Operating Systems & Systems Programming")
2. "courseCode": The official academic code (e.g. "CS 350", "MATH 240")
3. "examDate": The final exam or final project evaluation date in standard "YYYY-MM-DD" format. If only month/day is provided (e.g. Dec 14), assume year 2026. If no exam date is found, estimate a reasonable date 3 to 4 weeks from today.
4. "topics": An array of core syllabus modules or lecture topics in chronological order. Strip out administrative boilerplate (like office hours, grading percentages, textbooks, plagiarism statements).
   Each topic object must have:
   - "name": Concise, professional topic title
   - "difficulty": "easy", "medium", or "hard" based on conceptual complexity
   - "estimatedHours": Number between 1.5 and 4.0 (e.g. 2.0, 2.5, 3.0)

Output ONLY valid JSON matching this schema:
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

Syllabus Text:
"""
${text.slice(0, 12000)}
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

  return {
    courseName: parsed.courseName || 'Imported Course',
    courseCode: parsed.courseCode || 'COURSE 101',
    suggestedColor: SUBJECT_COLORS[Math.floor(Math.random() * SUBJECT_COLORS.length)],
    examDate: parsed.examDate || addDays(getTodayDateString(), 21),
    confidenceScore: 99,
    extractionMethod: 'ai',
    topics: (parsed.topics || []).map((t: any) => ({
      name: t.name || 'Core Concept',
      difficulty: (['easy', 'medium', 'hard'].includes(t.difficulty) ? t.difficulty : 'medium') as Difficulty,
      estimatedHours: typeof t.estimatedHours === 'number' ? Math.max(1, Math.min(t.estimatedHours, 6)) : 2.0,
      pattern: parsed.courseName,
    })),
  };
}

/**
 * Pre-defined sample syllabi for students to test instant document parsing with 1 click.
 */
export const SAMPLE_SYLLABI: Array<{ title: string; subtitle: string; content: string }> = [
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
  const subjectId = `subj-${Date.now()}`;

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
