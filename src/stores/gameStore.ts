import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  GameState,
  Achievement,
  DailyQuest,
  getXPForLevel,
  getLevelFromXP,
  getXPProgressInLevel,
  LEVEL_TITLES,
} from '@/types/game';
import { getGameState, updateGameState, addXP as addXPToFirestore } from '@/lib/firebase/firestore';
import { useAuthStore } from './authStore';
import { useUIStore, showXPToast } from './uiStore';

interface GameStore extends GameState {
  // Computed
  xpForNextLevel: number;
  xpInCurrentLevel: number;
  levelProgress: number;
  levelTitle: string;

  // Actions
  addXP: (amount: number, source?: string) => void;
  checkLevelUp: () => boolean;

  unlockWorld: (worldId: string) => void;
  setCurrentWorld: (worldId: string) => void;

  updateStreak: () => void;

  unlockAchievement: (achievement: Achievement) => void;
  checkAchievements: () => void;

  refreshDailyQuests: () => void;
  updateQuestProgress: (questType: string, amount: number) => void;
  completeQuest: (questId: string) => void;

  completeLesson: (lessonId: string) => void;
  updatePhonemeProgress: (phonemeId: string, score: number) => void;

  // Sync
  syncWithFirestore: () => Promise<void>;
  loadFromFirestore: () => Promise<void>;

  // Reset
  reset: () => void;
}

const initialState: GameState = {
  xp: 0,
  level: 1,
  currentWorld: 'letters-land',
  unlockedWorlds: ['letters-land'],
  currentStreak: 0,
  longestStreak: 0,
  lastActivityDate: new Date().toISOString().split('T')[0],
  achievements: [],
  dailyQuests: [],
  lastQuestRefresh: new Date().toISOString().split('T')[0],
  completedLessons: [],
  phonemeProgress: {},
  lastUpdated: new Date().toISOString(),
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // Initial state
      ...initialState,

      // Computed values (re-calculated on each access)
      get xpForNextLevel() {
        return getXPForLevel(get().level + 1);
      },

      get xpInCurrentLevel() {
        return getXPProgressInLevel(get().xp).current;
      },

      get levelProgress() {
        const currentLevelXP = getXPForLevel(get().level);
        const nextLevelXP = getXPForLevel(get().level + 1);
        const xpInLevel = get().xp - currentLevelXP;
        const xpNeeded = nextLevelXP - currentLevelXP;
        return Math.min((xpInLevel / xpNeeded) * 100, 100);
      },

      get levelTitle() {
        return LEVEL_TITLES[Math.min(get().level, 10) - 1] || 'Reading Master';
      },

      // Add XP with level-up check
      addXP: (amount, source = 'unknown') => {
        const prevLevel = get().level;

        set((state) => {
          const newXP = state.xp + amount;
          const newLevel = getLevelFromXP(newXP);

          return {
            xp: newXP,
            level: newLevel,
          };
        });

        // Show XP toast
        showXPToast(amount);

        // Check for level up
        const newLevel = get().level;
        if (newLevel > prevLevel) {
          useUIStore.getState().openModal('levelUp', {
            newLevel,
            title: LEVEL_TITLES[Math.min(newLevel, 10) - 1],
          });
        }

        // Sync to Firestore
        const { user } = useAuthStore.getState();
        if (user) {
          addXPToFirestore(user.uid, amount).catch(console.error);
        }
      },

      // Check if level up occurred
      checkLevelUp: () => {
        const { xp, level } = get();
        const expectedLevel = getLevelFromXP(xp);
        return expectedLevel > level;
      },

      // Unlock a new world
      unlockWorld: (worldId) => {
        set((state) => ({
          unlockedWorlds: state.unlockedWorlds.includes(worldId)
            ? state.unlockedWorlds
            : [...state.unlockedWorlds, worldId],
        }));
        get().syncWithFirestore();
      },

      // Set current world
      setCurrentWorld: (worldId) => {
        set({ currentWorld: worldId });
      },

      // Update daily streak
      updateStreak: () => {
        const today = new Date().toISOString().split('T')[0];
        const { lastActivityDate, currentStreak, longestStreak } = get();

        if (lastActivityDate === today) {
          // Already updated today
          return;
        }

        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = yesterday.toISOString().split('T')[0];

        let newStreak = 1;
        if (lastActivityDate === yesterdayStr) {
          // Consecutive day
          newStreak = currentStreak + 1;
        }

        set({
          currentStreak: newStreak,
          longestStreak: Math.max(newStreak, longestStreak),
          lastActivityDate: today,
        });

        get().syncWithFirestore();
      },

      // Unlock achievement
      unlockAchievement: (achievement) => {
        const { achievements } = get();
        if (achievements.some((a) => a.id === achievement.id)) {
          return; // Already unlocked
        }

        set((state) => ({
          achievements: [
            ...state.achievements,
            {
              ...achievement,
              unlockedAt: new Date().toISOString(),
            },
          ],
        }));

        // Show achievement modal
        useUIStore.getState().openModal('achievement', achievement);

        // Award XP for achievement
        get().addXP(achievement.xpReward || 20, 'achievement');

        get().syncWithFirestore();
      },

      // Check all achievements
      checkAchievements: () => {
        // This will be populated with actual achievement checking logic
        // based on current game state
      },

      // Refresh daily quests
      refreshDailyQuests: () => {
        const today = new Date().toISOString().split('T')[0];
        const { lastQuestRefresh } = get();

        if (lastQuestRefresh === today) {
          return; // Already refreshed today
        }

        // Generate new quests (simplified for now)
        const newQuests: DailyQuest[] = [
          {
            id: `quest-${today}-1`,
            type: 'complete_lessons',
            title: 'Complete 2 Lessons',
            description: 'Finish any 2 lessons today',
            targetValue: 2,
            currentValue: 0,
            xpReward: 30,
            completed: false,
            expiresAt: `${today}T23:59:59.999Z`,
          },
          {
            id: `quest-${today}-2`,
            type: 'earn_xp',
            title: 'Earn 100 XP',
            description: 'Collect 100 XP from any activities',
            targetValue: 100,
            currentValue: 0,
            xpReward: 25,
            completed: false,
            expiresAt: `${today}T23:59:59.999Z`,
          },
          {
            id: `quest-${today}-3`,
            type: 'practice_phonemes',
            title: 'Practice 10 Phonemes',
            description: 'Practice any 10 phoneme sounds',
            targetValue: 10,
            currentValue: 0,
            xpReward: 35,
            completed: false,
            expiresAt: `${today}T23:59:59.999Z`,
          },
        ];

        set({
          dailyQuests: newQuests,
          lastQuestRefresh: today,
        });

        get().syncWithFirestore();
      },

      // Update quest progress
      updateQuestProgress: (questType, amount) => {
        set((state) => ({
          dailyQuests: state.dailyQuests.map((quest) => {
            if (quest.type === questType && !quest.completed) {
              const newValue = quest.currentValue + amount;
              const completed = newValue >= quest.targetValue;

              if (completed) {
                // Award XP for completing quest
                setTimeout(() => get().addXP(quest.xpReward, 'quest'), 100);
              }

              return {
                ...quest,
                currentValue: Math.min(newValue, quest.targetValue),
                completed,
              };
            }
            return quest;
          }),
        }));
      },

      // Mark quest as complete
      completeQuest: (questId) => {
        set((state) => ({
          dailyQuests: state.dailyQuests.map((quest) =>
            quest.id === questId ? { ...quest, completed: true } : quest
          ),
        }));
      },

      // Mark lesson as completed
      completeLesson: (lessonId) => {
        set((state) => ({
          completedLessons: state.completedLessons.includes(lessonId)
            ? state.completedLessons
            : [...state.completedLessons, lessonId],
        }));

        // Update quest progress
        get().updateQuestProgress('complete_lessons', 1);
        get().syncWithFirestore();
      },

      // Update phoneme progress
      updatePhonemeProgress: (phonemeId, score) => {
        set((state) => {
          const current = state.phonemeProgress[phonemeId] || {
            attempts: 0,
            correctCount: 0,
            averageScore: 0,
            lastPracticed: '',
          };

          const newAttempts = current.attempts + 1;
          const newCorrectCount = current.correctCount + (score >= 80 ? 1 : 0);
          const newAverageScore =
            (current.averageScore * current.attempts + score) / newAttempts;

          return {
            phonemeProgress: {
              ...state.phonemeProgress,
              [phonemeId]: {
                attempts: newAttempts,
                correctCount: newCorrectCount,
                averageScore: Math.round(newAverageScore),
                lastPracticed: new Date().toISOString(),
              },
            },
          };
        });

        // Update quest progress
        get().updateQuestProgress('practice_phonemes', 1);
      },

      // Sync to Firestore
      syncWithFirestore: async () => {
        const { user } = useAuthStore.getState();
        if (!user) return;

        const state = get();
        try {
          await updateGameState(user.uid, {
            xp: state.xp,
            level: state.level,
            currentWorld: state.currentWorld,
            unlockedWorlds: state.unlockedWorlds,
            currentStreak: state.currentStreak,
            longestStreak: state.longestStreak,
            lastActivityDate: state.lastActivityDate,
            achievements: state.achievements,
            dailyQuests: state.dailyQuests,
            lastQuestRefresh: state.lastQuestRefresh,
            completedLessons: state.completedLessons,
            phonemeProgress: state.phonemeProgress,
          });
        } catch (error) {
          console.error('Failed to sync game state:', error);
        }
      },

      // Load from Firestore
      loadFromFirestore: async () => {
        const { user } = useAuthStore.getState();
        if (!user) return;

        try {
          const gameState = await getGameState(user.uid);
          set(gameState);
        } catch (error) {
          console.error('Failed to load game state:', error);
        }
      },

      // Reset store
      reset: () => {
        set(initialState);
      },
    }),
    {
      name: 'phonics-game',
      partialize: (state) => ({
        xp: state.xp,
        level: state.level,
        currentWorld: state.currentWorld,
        unlockedWorlds: state.unlockedWorlds,
        currentStreak: state.currentStreak,
        longestStreak: state.longestStreak,
        lastActivityDate: state.lastActivityDate,
        achievements: state.achievements,
        dailyQuests: state.dailyQuests,
        lastQuestRefresh: state.lastQuestRefresh,
        completedLessons: state.completedLessons,
        phonemeProgress: state.phonemeProgress,
      }),
    }
  )
);
