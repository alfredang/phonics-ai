import { create } from 'zustand';
import { LessonPhase, Lesson, LessonProgress, PhonemeScore } from '@/types/lesson';
import { useGameStore } from './gameStore';

interface LessonState {
  // Current lesson
  currentLesson: Lesson | null;
  currentPhase: LessonPhase;
  phaseIndex: number;

  // Progress tracking
  listenProgress: { completed: boolean; phonemesPlayed: string[] };
  practiceProgress: { completed: boolean; exercisesCompleted: number; score: number };
  playProgress: { completed: boolean; gamesPlayed: number; score: number };
  assessProgress: { completed: boolean; questionsAnswered: number; correctAnswers: number };

  // Session tracking
  sessionStartTime: number;
  attempts: number;
  hintsUsed: number;
  phonemeScores: Record<string, PhonemeScore>;

  // UI State
  showPhaseTransition: boolean;
  currentExerciseIndex: number;
  isComplete: boolean;
}

interface LessonActions {
  // Lesson lifecycle
  startLesson: (lesson: Lesson) => void;
  completePhase: () => void;
  advancePhase: () => void;
  exitLesson: () => void;

  // Phase updates
  updateListenProgress: (phonemeId: string) => void;
  updatePracticeProgress: (correct: boolean, score: number) => void;
  updatePlayProgress: (score: number) => void;
  updateAssessProgress: (correct: boolean) => void;

  // Exercise navigation
  nextExercise: () => void;
  previousExercise: () => void;

  // Helpers
  consumeHint: () => void;
  recordPhonemeAttempt: (phonemeId: string, correct: boolean, score: number) => void;

  // Transitions
  showTransition: () => void;
  hideTransition: () => void;

  // Final results
  calculateResults: () => {
    totalScore: number;
    stars: 0 | 1 | 2 | 3;
    xpEarned: number;
    timeSpent: number;
  };
}

type LessonStore = LessonState & LessonActions;

const initialState: LessonState = {
  currentLesson: null,
  currentPhase: 'listen',
  phaseIndex: 0,

  listenProgress: { completed: false, phonemesPlayed: [] },
  practiceProgress: { completed: false, exercisesCompleted: 0, score: 0 },
  playProgress: { completed: false, gamesPlayed: 0, score: 0 },
  assessProgress: { completed: false, questionsAnswered: 0, correctAnswers: 0 },

  sessionStartTime: 0,
  attempts: 0,
  hintsUsed: 0,
  phonemeScores: {},

  showPhaseTransition: false,
  currentExerciseIndex: 0,
  isComplete: false,
};

const PHASES: LessonPhase[] = ['listen', 'practice', 'play', 'assess'];

export const useLessonStore = create<LessonStore>()((set, get) => ({
  ...initialState,

  // Start a new lesson
  startLesson: (lesson) => {
    set({
      ...initialState,
      currentLesson: lesson,
      currentPhase: 'listen',
      phaseIndex: 0,
      sessionStartTime: Date.now(),
    });
  },

  // Mark current phase as complete
  completePhase: () => {
    const { currentPhase } = get();

    switch (currentPhase) {
      case 'listen':
        set({ listenProgress: { ...get().listenProgress, completed: true } });
        break;
      case 'practice':
        set({ practiceProgress: { ...get().practiceProgress, completed: true } });
        break;
      case 'play':
        set({ playProgress: { ...get().playProgress, completed: true } });
        break;
      case 'assess':
        set({ assessProgress: { ...get().assessProgress, completed: true }, isComplete: true });
        break;
    }
  },

  // Move to next phase
  advancePhase: () => {
    const { phaseIndex } = get();
    const nextIndex = phaseIndex + 1;

    if (nextIndex >= PHASES.length) {
      // Lesson complete
      set({ isComplete: true });
      return;
    }

    set({
      phaseIndex: nextIndex,
      currentPhase: PHASES[nextIndex],
      currentExerciseIndex: 0,
      showPhaseTransition: true,
    });

    // Auto-hide transition after delay
    setTimeout(() => {
      set({ showPhaseTransition: false });
    }, 1500);
  },

  // Exit lesson
  exitLesson: () => {
    set(initialState);
  },

  // Update listen progress
  updateListenProgress: (phonemeId) => {
    const { listenProgress, currentLesson } = get();
    const phonemesPlayed = [...listenProgress.phonemesPlayed, phonemeId];
    const uniquePhonemes = Array.from(new Set(phonemesPlayed));

    // Check if all phonemes have been played
    const targetPhonemes = currentLesson?.content?.phonemes || [];
    const completed = targetPhonemes.every((p) => uniquePhonemes.includes(p.id));

    set({
      listenProgress: { phonemesPlayed: uniquePhonemes, completed },
    });
  },

  // Update practice progress
  updatePracticeProgress: (correct, score) => {
    const { practiceProgress } = get();
    const newExercisesCompleted = practiceProgress.exercisesCompleted + 1;
    const newScore = practiceProgress.score + score;

    set({
      practiceProgress: {
        ...practiceProgress,
        exercisesCompleted: newExercisesCompleted,
        score: newScore,
      },
      attempts: get().attempts + 1,
    });
  },

  // Update play progress
  updatePlayProgress: (score) => {
    const { playProgress } = get();

    set({
      playProgress: {
        ...playProgress,
        gamesPlayed: playProgress.gamesPlayed + 1,
        score: playProgress.score + score,
      },
    });
  },

  // Update assess progress
  updateAssessProgress: (correct) => {
    const { assessProgress } = get();

    set({
      assessProgress: {
        ...assessProgress,
        questionsAnswered: assessProgress.questionsAnswered + 1,
        correctAnswers: assessProgress.correctAnswers + (correct ? 1 : 0),
      },
    });
  },

  // Navigation
  nextExercise: () => {
    set({ currentExerciseIndex: get().currentExerciseIndex + 1 });
  },

  previousExercise: () => {
    const current = get().currentExerciseIndex;
    if (current > 0) {
      set({ currentExerciseIndex: current - 1 });
    }
  },

  // Use hint
  consumeHint: () => {
    set({ hintsUsed: get().hintsUsed + 1 });
  },

  // Record phoneme attempt
  recordPhonemeAttempt: (phonemeId, correct, score) => {
    const { phonemeScores } = get();
    const existing = phonemeScores[phonemeId] || {
      phonemeId,
      attempts: 0,
      correctCount: 0,
      averageScore: 0,
      lastPracticed: undefined,
    };

    const newAttempts = existing.attempts + 1;
    const newCorrectCount = existing.correctCount + (correct ? 1 : 0);
    const newAvgScore = (existing.averageScore * existing.attempts + score) / newAttempts;

    set({
      phonemeScores: {
        ...phonemeScores,
        [phonemeId]: {
          phonemeId,
          attempts: newAttempts,
          correctCount: newCorrectCount,
          averageScore: Math.round(newAvgScore),
          lastPracticed: new Date(),
        },
      },
    });

    // Also update game store
    useGameStore.getState().updatePhonemeProgress(phonemeId, score);
  },

  // Transitions
  showTransition: () => set({ showPhaseTransition: true }),
  hideTransition: () => set({ showPhaseTransition: false }),

  // Calculate final results
  calculateResults: () => {
    const {
      sessionStartTime,
      practiceProgress,
      playProgress,
      assessProgress,
      hintsUsed,
      currentLesson,
    } = get();

    const timeSpent = Math.floor((Date.now() - sessionStartTime) / 1000);

    // Calculate total score (weighted average)
    const practiceScore = practiceProgress.exercisesCompleted > 0
      ? practiceProgress.score / practiceProgress.exercisesCompleted
      : 0;

    const playScore = playProgress.gamesPlayed > 0
      ? playProgress.score / playProgress.gamesPlayed
      : 0;

    const assessScore = assessProgress.questionsAnswered > 0
      ? (assessProgress.correctAnswers / assessProgress.questionsAnswered) * 100
      : 0;

    // Weighted: Practice 30%, Play 30%, Assess 40%
    const totalScore = Math.round(practiceScore * 0.3 + playScore * 0.3 + assessScore * 0.4);

    // Calculate stars
    let stars: 0 | 1 | 2 | 3 = 0;
    if (totalScore >= 90) stars = 3;
    else if (totalScore >= 70) stars = 2;
    else if (totalScore >= 50) stars = 1;

    // Calculate XP
    const baseXP = currentLesson?.xpReward || 50;
    let xpMultiplier = 1;
    if (stars === 3) xpMultiplier = 1.5;
    else if (stars === 2) xpMultiplier = 1.2;

    // Bonus for no hints
    if (hintsUsed === 0) xpMultiplier += 0.1;

    const xpEarned = Math.round(baseXP * xpMultiplier);

    return {
      totalScore,
      stars,
      xpEarned,
      timeSpent,
    };
  },
}));
