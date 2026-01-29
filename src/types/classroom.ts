/**
 * Classroom and parent-child linking type definitions
 */

// Classroom types
export interface Classroom {
  id: string;
  name: string;
  description?: string;
  teacherId: string;
  teacherName: string;
  joinCode: string; // 6-char uppercase code
  createdAt: string; // ISO date string
  studentCount: number;
  isActive: boolean;
}

export interface ClassroomStudent {
  userId: string;
  displayName: string;
  avatarUrl?: string;
  joinedAt: string; // ISO date string
  // Snapshot of progress for quick display
  level: number;
  xp: number;
  currentStreak: number;
  lessonsCompleted: number;
  lastActivityAt?: string; // ISO date string
}

// Parent-child linking types
export interface ParentLink {
  id: string;
  parentId: string;
  childId: string;
  childDisplayName: string;
  parentDisplayName: string;
  linkedAt: string; // ISO date string
  status: 'pending' | 'active';
  linkCode?: string; // Only present for pending links
}

// Progress summary for teachers/parents viewing student/child data
export interface StudentProgressSummary {
  userId: string;
  displayName: string;
  avatarUrl?: string;
  // Level & XP
  level: number;
  levelTitle: string;
  xp: number;
  levelProgress: number; // 0-100
  // Streaks
  currentStreak: number;
  longestStreak: number;
  // Lessons
  completedLessons: string[];
  lessonsCompleted: number;
  // Phoneme mastery
  phonemeProgress: Record<
    string,
    {
      attempts: number;
      correct: number;
      masteryLevel: number; // 0-100
    }
  >;
  // Activity
  lastActivityAt?: string;
  totalPracticeTime?: number; // minutes
  // Achievements
  achievements: string[];
}

// For creating new classrooms
export interface CreateClassroomInput {
  name: string;
  description?: string;
}

// For joining classrooms
export interface JoinClassroomInput {
  joinCode: string;
}

// Child progress report for parents
export interface ChildProgressReport {
  child: StudentProgressSummary;
  weeklyActivity: {
    date: string;
    lessonsCompleted: number;
    xpEarned: number;
    practiceMinutes: number;
  }[];
  recentLessons: {
    lessonId: string;
    lessonName: string;
    completedAt: string;
    stars: number;
    score: number;
  }[];
  phonemeMastery: {
    phonemeId: string;
    symbol: string;
    masteryLevel: number;
    practiceCount: number;
  }[];
}
