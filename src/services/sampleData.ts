import type { Subject } from '../types/index.ts';
import { addDays, getTodayDateString } from '../utils/dateUtils.ts';

export function getSampleStudentSubjects(): Subject[] {
  const today = getTodayDateString();

  return [
    {
      id: 'subj-cs',
      name: 'Data Structures & Algorithms',
      code: 'CS 201',
      color: '#6366f1', // Indigo
      examDate: addDays(today, 8), // Exam in 8 days
      topics: [
        {
          id: 'top-cs-1',
          subjectId: 'subj-cs',
          name: 'Binary Search Trees & AVL Rotations',
          difficulty: 'hard',
          estimatedHours: 2.5,
          completedHours: 0,
          isCompleted: false,
        },
        {
          id: 'top-cs-2',
          subjectId: 'subj-cs',
          name: 'Graph Traversal (BFS & DFS)',
          difficulty: 'medium',
          estimatedHours: 2.0,
          completedHours: 0,
          isCompleted: false,
        },
        {
          id: 'top-cs-3',
          subjectId: 'subj-cs',
          name: 'Dijkstra & Shortest Path Algorithms',
          difficulty: 'hard',
          estimatedHours: 2.5,
          completedHours: 0,
          isCompleted: false,
        },
        {
          id: 'top-cs-4',
          subjectId: 'subj-cs',
          name: 'Dynamic Programming (Knapsack & LCS)',
          difficulty: 'hard',
          estimatedHours: 3.0,
          completedHours: 0,
          isCompleted: false,
        },
        {
          id: 'top-cs-5',
          subjectId: 'subj-cs',
          name: 'Hash Tables & Collision Resolution',
          difficulty: 'easy',
          estimatedHours: 1.5,
          completedHours: 1.5,
          isCompleted: true,
        },
      ],
    },
    {
      id: 'subj-chem',
      name: 'Organic Chemistry',
      code: 'CHEM 220',
      color: '#10b981', // Emerald
      examDate: addDays(today, 12), // Exam in 12 days
      topics: [
        {
          id: 'top-ch-1',
          subjectId: 'subj-chem',
          name: 'SN1 vs SN2 Reaction Mechanisms',
          difficulty: 'medium',
          estimatedHours: 2.0,
          completedHours: 0,
          isCompleted: false,
        },
        {
          id: 'top-ch-2',
          subjectId: 'subj-chem',
          name: 'Electrophilic Aromatic Substitution',
          difficulty: 'hard',
          estimatedHours: 2.5,
          completedHours: 0,
          isCompleted: false,
        },
        {
          id: 'top-ch-3',
          subjectId: 'subj-chem',
          name: 'NMR & IR Spectroscopy Analysis',
          difficulty: 'hard',
          estimatedHours: 2.5,
          completedHours: 0,
          isCompleted: false,
        },
        {
          id: 'top-ch-4',
          subjectId: 'subj-chem',
          name: 'Alkenes, Alkynes & Hydroboration',
          difficulty: 'easy',
          estimatedHours: 1.5,
          completedHours: 0,
          isCompleted: false,
        },
      ],
    },
    {
      id: 'subj-math',
      name: 'Linear Algebra',
      code: 'MATH 240',
      color: '#f59e0b', // Amber
      examDate: addDays(today, 15), // Exam in 15 days
      topics: [
        {
          id: 'top-math-1',
          subjectId: 'subj-math',
          name: 'Eigenvalues, Eigenvectors & Diagonalization',
          difficulty: 'hard',
          estimatedHours: 2.5,
          completedHours: 0,
          isCompleted: false,
        },
        {
          id: 'top-math-2',
          subjectId: 'subj-math',
          name: 'Gram-Schmidt & Orthogonal Projections',
          difficulty: 'medium',
          estimatedHours: 2.0,
          completedHours: 0,
          isCompleted: false,
        },
        {
          id: 'top-math-3',
          subjectId: 'subj-math',
          name: 'Matrix Inverses & Determinants',
          difficulty: 'easy',
          estimatedHours: 1.5,
          completedHours: 1.5,
          isCompleted: true,
        },
      ],
    },
  ];
}
