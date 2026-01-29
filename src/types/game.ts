/**
 * Game and gamification type definitions
 */

// Main game state for a user
export interface GameState {
  // XP and Level
  xp: number;
  level: number;

  // World progression
  currentWorld: string;
  unlockedWorlds: string[];

  // Streaks
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;   // ISO date string

  // Achievements
  achievements: Achievement[];

  // Daily quests
  dailyQuests: DailyQuest[];
  lastQuestRefresh: string;   // ISO date string

  // Completed lessons
  completedLessons: string[];

  // Phoneme progress tracking
  phonemeProgress: Record<string, PhonemeProgress>;

  // Last sync timestamp
  lastUpdated: string;
}

// Phoneme progress tracking
export interface PhonemeProgress {
  attempts: number;
  correctCount: number;
  averageScore: number;
  lastPracticed: string;
}

// World definition
export interface World {
  id: string;
  name: string;               // "Letters Land", "Word City", etc.
  description: string;

  // Visual theme
  theme: WorldTheme;
  backgroundImage?: string;
  iconImage?: string;

  // Levels in this world
  levels: WorldLevel[];

  // Unlock requirements
  unlockRequirement: WorldUnlockRequirement;

  // Metadata
  order: number;              // Display order
  totalLessons: number;
}

export interface WorldTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  gradientColors: string[];
}

export interface WorldLevel {
  lessonId: string;
  position: { x: number; y: number };  // Map coordinates (0-100)
  isBoss: boolean;
  connectionTo?: string[];    // Connected lessonIds for path drawing
}

export interface WorldUnlockRequirement {
  type: 'none' | 'world_complete' | 'xp_threshold' | 'level_threshold';
  value?: string | number;    // World ID or threshold value
}

// Achievement definitions
export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;               // Icon name or URL
  category: AchievementCategory;
  requirement: AchievementRequirement;
  xpReward: number;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  isSecret?: boolean;         // Hidden until unlocked
}

export type AchievementCategory =
  | 'progress'                // Completing lessons/worlds
  | 'streak'                  // Daily streaks
  | 'performance'             // Scores and accuracy
  | 'collection'              // Mastering phonemes/words
  | 'special';                // Special events/challenges

export interface AchievementRequirement {
  type: AchievementRequirementType;
  target: number;
  worldId?: string;           // For world-specific achievements
  phonemeCategory?: string;   // For phoneme mastery
}

export type AchievementRequirementType =
  | 'lessons_completed'
  | 'worlds_completed'
  | 'perfect_scores'
  | 'streak_days'
  | 'xp_total'
  | 'phonemes_mastered'
  | 'words_learned'
  | 'boss_defeated'
  | 'quests_completed';

export interface UnlockedAchievement {
  achievementId: string;
  unlockedAt: string;         // ISO date string
  progress?: number;          // For progressive achievements
}

// Daily quest definitions
export interface DailyQuest {
  id: string;
  type: QuestType;
  title: string;
  description: string;
  targetValue: number;
  currentValue: number;
  xpReward: number;
  completed: boolean;
  expiresAt: string;          // ISO date string
}

export type QuestType =
  | 'complete_lessons'
  | 'earn_xp'
  | 'perfect_score'
  | 'practice_phonemes'
  | 'complete_games'
  | 'maintain_streak';

// XP and Level calculations
export interface LevelInfo {
  level: number;
  xpRequired: number;         // XP needed to reach this level
  xpForNextLevel: number;     // XP needed to reach next level
  title: string;              // Level title (e.g., "Phonics Explorer")
  perks?: string[];           // Unlocked features/cosmetics
}

// Leaderboard entry
export interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  avatarUrl?: string;
  xp: number;
  level: number;
  streak: number;
}

// Game session for analytics
export interface GameSession {
  sessionId: string;
  userId: string;
  startTime: string;
  endTime?: string;
  lessonsAttempted: string[];
  lessonsCompleted: string[];
  xpEarned: number;
  events: GameEvent[];
}

export interface GameEvent {
  type: string;
  timestamp: string;
  data: Record<string, unknown>;
}

// Level titles by level number
export const LEVEL_TITLES: Record<number, string> = {
  1: 'Phonics Beginner',
  2: 'Sound Seeker',
  3: 'Letter Explorer',
  4: 'Word Builder',
  5: 'Blend Master',
  6: 'Rule Learner',
  7: 'Sentence Starter',
  8: 'Story Reader',
  9: 'Phonics Champion',
  10: 'Reading Master',
};

// XP calculation for levels
export function getXPForLevel(level: number): number {
  // Exponential growth: 100, 150, 225, 338, 506, ...
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

export function getLevelFromXP(totalXP: number): number {
  let level = 1;
  let xpNeeded = 100;
  let xpAccumulated = 0;

  while (xpAccumulated + xpNeeded <= totalXP) {
    xpAccumulated += xpNeeded;
    level++;
    xpNeeded = getXPForLevel(level);
  }

  return level;
}

export function getXPProgressInLevel(totalXP: number): { current: number; required: number } {
  let level = 1;
  let xpNeeded = 100;
  let xpAccumulated = 0;

  while (xpAccumulated + xpNeeded <= totalXP) {
    xpAccumulated += xpNeeded;
    level++;
    xpNeeded = getXPForLevel(level);
  }

  return {
    current: totalXP - xpAccumulated,
    required: xpNeeded,
  };
}
