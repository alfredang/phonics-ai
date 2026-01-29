/**
 * Lesson type definitions
 */

import { Phoneme, Word, Sentence, Paragraph, PhonicsRule, BlendingPattern } from './phonics';

// Lesson levels (maps to phonics curriculum)
export type LessonLevel = 1 | 2 | 3 | 4 | 5;

// Lesson phases
export type LessonPhase = 'listen' | 'practice' | 'play' | 'assess';

// Main lesson structure
export interface Lesson {
  id: string;
  worldId: string;
  levelNumber: number;      // Order within the world
  level: LessonLevel;       // Phonics level (1-5)

  // Metadata
  title: string;
  description: string;
  objectives: string[];
  estimatedMinutes: number;

  // Content references
  content: LessonContent;

  // Phase configurations
  phases: {
    listen: ListenPhaseConfig;
    practice: PracticePhaseConfig;
    play: PlayPhaseConfig;
    assess: AssessPhaseConfig;
  };

  // Rewards
  xpReward: number;
  bonusConditions: BonusCondition[];

  // Prerequisites
  prerequisites: string[];   // Lesson IDs required
  unlockRequirements?: {
    previousLessonComplete: boolean;
    minimumStars: number;
  };
}

// Lesson content varies by level
export interface LessonContent {
  // Level 1: Single Characters
  phonemes?: Phoneme[];

  // Level 2: Blending
  words?: Word[];
  blendingPatterns?: BlendingPattern[];

  // Level 3: Rules
  rules?: PhonicsRule[];
  exceptions?: Word[];
  sightWords?: Word[];

  // Level 4: Sentences
  sentences?: Sentence[];

  // Level 5: Paragraphs
  paragraphs?: Paragraph[];
}

// Listen phase configuration
export interface ListenPhaseConfig {
  items: ListenItem[];
  autoAdvance: boolean;
  repeatCount: number;      // How many times to play each item
  showMouthAnimation: boolean;
  showPhonemeHighlight: boolean;
}

export interface ListenItem {
  type: 'phoneme' | 'word' | 'sentence' | 'paragraph';
  contentId: string;
  duration?: number;        // Override auto-calculated duration
}

// Practice phase configuration
export interface PracticePhaseConfig {
  exercises: PracticeExercise[];
  attemptsAllowed: number;
  feedbackLevel: 'minimal' | 'basic' | 'detailed';
  hintsEnabled: boolean;
}

export interface PracticeExercise {
  id: string;
  type: PracticeExerciseType;
  contentIds: string[];     // References to phonemes, words, etc.
  instructions: string;
  successThreshold: number; // 0-100 score needed to pass
  timeLimit?: number;       // Optional time limit in seconds
}

export type PracticeExerciseType =
  | 'repeat_after'          // Listen and repeat
  | 'identify_sound'        // "Which word has the /æ/ sound?"
  | 'match_pairs'           // Match sounds to pictures/words
  | 'build_word'            // Drag phonemes to build word
  | 'sort_sounds'           // Categorize by phoneme type
  | 'fill_blank'            // Complete the word/sentence
  | 'sequence_sounds';      // Put sounds in correct order

// Play phase configuration
export interface PlayPhaseConfig {
  gameType: GameType;
  gameConfig: GameConfig;
  targetScore: number;      // Score needed to pass
  timeLimit?: number;       // Optional time limit in seconds
}

export type GameType =
  | 'phoneme_pop'           // Pop bubbles with correct phoneme
  | 'word_builder'          // Drag letters to build words
  | 'sound_match'           // Match sounds to pictures
  | 'sound_race'            // Speed-based phoneme identification
  | 'sentence_scramble'     // Arrange words in order
  | 'karaoke_challenge'     // Read with timing/score
  | 'story_adventure'       // Interactive story reading
  | 'boss_battle';          // Assessment as game

export interface GameConfig {
  // Common config
  difficulty: 'easy' | 'medium' | 'hard';
  contentIds: string[];

  // Game-specific config
  [key: string]: unknown;
}

// Assess phase configuration
export interface AssessPhaseConfig {
  questions: AssessmentQuestion[];
  passingScore: number;     // Percentage needed to pass
  timeLimit?: number;
  isBossLevel: boolean;
  bossConfig?: BossConfig;
}

export interface AssessmentQuestion {
  id: string;
  type: QuestionType;
  question: string;
  audioPrompt?: string;     // TTS text or audio URL
  options?: string[];       // For multiple choice
  correctAnswer: string | string[];
  points: number;
  hint?: string;
  explanation?: string;     // Shown after answering
}

export type QuestionType =
  | 'multiple_choice'
  | 'audio_response'        // Speak the answer
  | 'drag_drop'
  | 'fill_blank'
  | 'true_false'
  | 'sequence';

// Boss battle configuration
export interface BossConfig {
  name: string;
  character: BossCharacter;
  health: number;
  phases: BossPhase[];
  victoryMessage: string;
  defeatMessage: string;
}

export type BossCharacter =
  | 'vowel_villain'
  | 'consonant_crusher'
  | 'blend_boss'
  | 'rule_breaker'
  | 'story_master';

export interface BossPhase {
  healthThreshold: number;  // Triggers at this % health
  attackPattern: string;
  questionDifficulty: 'easy' | 'medium' | 'hard';
}

// Bonus XP conditions
export interface BonusCondition {
  type: 'time_limit' | 'no_mistakes' | 'first_try' | 'perfect_pronunciation';
  value?: number;           // e.g., complete in X seconds
  bonusXP: number;
  description: string;
}

// Lesson progress (saved per user)
export interface LessonProgress {
  lessonId: string;
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  completedAt?: Date;
  stars: 0 | 1 | 2 | 3;
  bestScore: number;
  attempts: number;
  totalTimeSpent: number;   // seconds
  xpEarned: number;

  phaseProgress: Record<LessonPhase, PhaseProgress>;

  // Detailed performance tracking
  phonemeScores?: Record<string, PhonemeScore>;
}

export interface PhaseProgress {
  completed: boolean;
  score: number;
  attempts: number;
  timeSpent: number;
}

export interface PhonemeScore {
  phonemeId: string;
  attempts: number;
  correctCount: number;
  averageScore: number;
  lastPracticed?: Date;
}
