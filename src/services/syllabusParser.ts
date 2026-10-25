import type { Subject, Topic, Difficulty } from '../types/index.ts';
import { addDays, getTodayDateString } from '../utils/dateUtils.ts';

export interface ParsedSyllabusResult {
  courseName: string;
  courseCode: string;
  suggestedColor: string;
  examDate: string;
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

/**
 * Intelligent client-side syllabus parser that extracts course details,
 * exam dates, and topics from syllabus text or document contents.
 */
export function parseSyllabusText(text: string): ParsedSyllabusResult {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);

  const today = getTodayDateString();

  // 1. Extract Course Title & Code
  let courseName = 'New Course';
  let courseCode = 'COURSE 101';

  // Look for course code like CS 201, CS-350, MATH 240, BIO 101, CHEM 220
  const codeRegex = /\b([A-Z]{2,5})\s*[-_:]?\s*(\d{2,4}[A-Z]?)\b/i;
  for (const line of lines.slice(0, 10)) {
    const codeMatch = line.match(codeRegex);
    if (codeMatch) {
      courseCode = `${codeMatch[1].toUpperCase()} ${codeMatch[2].toUpperCase()}`;
      // Often the line also has the title: e.g. "CS 350: Operating Systems"
      const namePart = line.replace(codeMatch[0], '').replace(/^[:\-\s]+/, '').trim();
      if (namePart.length > 4) {
        courseName = namePart;
      }
      break;
    }
  }

  // Fallback title detection if not extracted from code line
  if (courseName === 'New Course') {
    for (const line of lines.slice(0, 5)) {
      if (
        !line.toLowerCase().includes('syllabus') &&
        !line.toLowerCase().includes('instructor') &&
        !line.toLowerCase().includes('university') &&
        line.length > 4 &&
        line.length < 60
      ) {
        courseName = line;
        break;
      }
    }
  }

  // 2. Extract Exam Date
  let examDate = addDays(today, 14); // Default 14 days out

  const examKeywords = /(?:final\s*exam|exam\s*date|midterm|test\s*date|finals)\s*[:\-]?\s*([A-Za-z0-9\s,\/]+)/i;
  for (const line of lines) {
    const examMatch = line.match(examKeywords);
    if (examMatch && examMatch[1]) {
      const dateText = examMatch[1].trim();
      // Try parsing date string
      const parsedTimestamp = Date.parse(dateText);
      if (!isNaN(parsedTimestamp)) {
        const d = new Date(parsedTimestamp);
        const yyyy = d.getFullYear();
        const mm = String(d.getMonth() + 1).padStart(2, '0');
        const dd = String(d.getDate()).padStart(2, '0');
        const candidate = `${yyyy}-${mm}-${dd}`;
        if (candidate > today) {
          examDate = candidate;
          break;
        }
      }
    }
  }

  // 3. Extract Topics
  const topics: ParsedSyllabusResult['topics'] = [];

  // Patterns indicating topic lines
  const topicPrefixRegex = /^(?:week\s*\d+|module\s*\d+|unit\s*\d+|chapter\s*\d+|topic\s*\d+|lecture\s*\d+|\d+\.|\*|\-|\u2022)\s*[:\-–.]?\s*(.+)$/i;

  const hardKeywords = [
    'advanced',
    'concurrency',
    'deadlock',
    'dynamic programming',
    'graphs',
    'proof',
    'synthesis',
    'mechanisms',
    'quantum',
    'compiler',
    'optimization',
    'dijkstra',
    'avl',
    'np-complete',
    'distributed',
  ];

  const easyKeywords = [
    'introduction',
    'basics',
    'overview',
    'syntax',
    'review',
    'history',
    'definitions',
    'welcome',
    'setup',
  ];

  for (const line of lines) {
    let candidate = '';

    const prefixMatch = line.match(topicPrefixRegex);
    if (prefixMatch && prefixMatch[1]) {
      candidate = prefixMatch[1].trim();
    } else if (
      (line.includes(':') || line.includes(' - ')) &&
      line.length > 8 &&
      line.length < 80 &&
      !line.toLowerCase().includes('email') &&
      !line.toLowerCase().includes('office') &&
      !line.toLowerCase().includes('textbook')
    ) {
      candidate = line.trim();
    }

    if (candidate && candidate.length >= 4 && candidate.length <= 90) {
      // Remove trailing dates or reading assignments like "(Oct 12)" or "[Ch 3]"
      candidate = candidate.replace(/\([^)]*\)/g, '').replace(/\[[^\]]*\]/g, '').trim();

      // Avoid duplicates
      if (!topics.some((t) => t.name.toLowerCase() === candidate.toLowerCase())) {
        const lower = candidate.toLowerCase();
        let difficulty: Difficulty = 'medium';
        let estimatedHours = 2.0;

        if (hardKeywords.some((kw) => lower.includes(kw))) {
          difficulty = 'hard';
          estimatedHours = 2.5;
        } else if (easyKeywords.some((kw) => lower.includes(kw))) {
          difficulty = 'easy';
          estimatedHours = 1.5;
        }

        topics.push({
          name: candidate,
          difficulty,
          estimatedHours,
          pattern: courseName,
        });
      }
    }
  }

  // If no structured topics were detected, split by lines as fallback
  if (topics.length === 0) {
    const candidateLines = lines.filter(
      (l) => l.length > 10 && l.length < 75 && !l.includes('http') && !l.includes('@')
    );
    for (const l of candidateLines.slice(1, 7)) {
      topics.push({
        name: l,
        difficulty: 'medium',
        estimatedHours: 2.0,
      });
    }
  }

  return {
    courseName,
    courseCode,
    suggestedColor: SUBJECT_COLORS[Math.floor(Math.random() * SUBJECT_COLORS.length)],
    examDate,
    topics,
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
Final Exam Date: 2026-11-18
Instructor: Prof. Henderson

Syllabus & Course Modules:
Module 1: Processes, Threads and Context Switching
Module 2: CPU Scheduling Algorithms (Round Robin, Multi-level Queue)
Module 3: Concurrency, Mutex Locks & Semaphores
Module 4: Deadlock Characterization & Banker's Algorithm
Module 5: Memory Management, Paging & Page Replacement (LRU)
Module 6: Virtual Memory and Translation Lookaside Buffer (TLB)
Module 7: File System Implementation, Inodes & Directory Structure
Module 8: Distributed Systems & Distributed Consensus (Raft)`,
  },
  {
    title: 'BIO 210: Molecular Genetics & Cell Biology',
    subtitle: 'DNA Replication, Gene Expression, CRISPR & Signal Transduction',
    content: `Course: BIO 210 Molecular Genetics & Cell Biology
Exam Date: 2026-11-25

Syllabus Breakdown:
Week 1: DNA Structure, Chromatin Architecture & Histone Modification
Week 2: DNA Replication Mechanisms and Proofreading Enzymes
Week 3: Transcription Factors & RNA Polymerase II Initiation
Week 4: RNA Splicing, Spliceosome Assembly & Alternative Exons
Week 5: Translation & Ribosomal Peptidyl Transferase Kinetics
Week 6: CRISPR-Cas9 Gene Editing & Recombinant DNA Technologies
Week 7: Receptor Tyrosine Kinases & MAPK Signal Transduction Pathways`,
  },
  {
    title: 'MATH 240: Linear Algebra & Matrix Theory',
    subtitle: 'Vector Spaces, Eigenvalues, SVD & Orthogonal Projections',
    content: `Course: MATH 240 Linear Algebra and Matrix Theory
Finals: 2026-11-20

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
