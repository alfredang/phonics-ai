import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  query,
  where,
  getDocs,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import { GameState } from '@/types/game';
import { LessonProgress } from '@/types/lesson';

// ============================================
// Game State Operations
// ============================================

const DEFAULT_GAME_STATE: Omit<GameState, 'lastUpdated'> = {
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
};

export async function getGameState(userId: string): Promise<GameState> {
  const docRef = doc(db, 'gameStates', userId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    // Initialize game state for new user
    const initialState: GameState = {
      ...DEFAULT_GAME_STATE,
      lastUpdated: new Date().toISOString(),
    };
    await setDoc(docRef, {
      ...initialState,
      lastUpdated: serverTimestamp(),
    });
    return initialState;
  }

  const data = docSnap.data();
  return {
    ...data,
    lastUpdated: data.lastUpdated?.toDate?.()?.toISOString() || new Date().toISOString(),
  } as GameState;
}

export async function updateGameState(
  userId: string,
  updates: Partial<GameState>
): Promise<void> {
  const docRef = doc(db, 'gameStates', userId);
  await updateDoc(docRef, {
    ...updates,
    lastUpdated: serverTimestamp(),
  });
}

export async function addXP(userId: string, amount: number): Promise<void> {
  const currentState = await getGameState(userId);
  const newXP = currentState.xp + amount;

  await updateDoc(doc(db, 'gameStates', userId), {
    xp: newXP,
    lastUpdated: serverTimestamp(),
  });
}

// ============================================
// Lesson Progress Operations
// ============================================

export async function getLessonProgress(
  userId: string,
  lessonId: string
): Promise<LessonProgress | null> {
  const docRef = doc(db, 'lessonProgress', userId, 'lessons', lessonId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  const data = docSnap.data();
  return {
    ...data,
    completedAt: data.completedAt?.toDate?.()?.toISOString(),
    lastAttemptAt: data.lastAttemptAt?.toDate?.()?.toISOString(),
  } as unknown as LessonProgress;
}

export async function updateLessonProgress(
  userId: string,
  lessonId: string,
  progress: Partial<LessonProgress>
): Promise<void> {
  const docRef = doc(db, 'lessonProgress', userId, 'lessons', lessonId);
  await setDoc(
    docRef,
    {
      ...progress,
      lastAttemptAt: serverTimestamp(),
    },
    { merge: true }
  );
}

export async function getAllLessonProgress(
  userId: string
): Promise<Record<string, LessonProgress>> {
  const collectionRef = collection(db, 'lessonProgress', userId, 'lessons');
  const querySnapshot = await getDocs(collectionRef);

  const progress: Record<string, LessonProgress> = {};
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    progress[doc.id] = {
      ...data,
      completedAt: data.completedAt?.toDate?.()?.toISOString(),
      lastAttemptAt: data.lastAttemptAt?.toDate?.()?.toISOString(),
    } as unknown as LessonProgress;
  });

  return progress;
}

// ============================================
// Leaderboard Operations
// ============================================

interface LeaderboardEntry {
  rank: number;
  userId: string;
  displayName: string;
  avatarUrl?: string;
  xp: number;
  level: number;
}

export async function getWeeklyLeaderboard(
  limitCount: number = 10
): Promise<LeaderboardEntry[]> {
  const weekId = getWeekId();
  const collectionRef = collection(db, 'leaderboard', 'weekly', weekId);
  const q = query(collectionRef, orderBy('xp', 'desc'), limit(limitCount));

  const querySnapshot = await getDocs(q);
  const entries: LeaderboardEntry[] = [];
  let rank = 0;

  querySnapshot.forEach((doc) => {
    rank++;
    const data = doc.data();
    entries.push({
      rank,
      userId: doc.id,
      displayName: data.displayName,
      avatarUrl: data.avatarUrl,
      xp: data.xp,
      level: data.level,
    });
  });

  return entries;
}

// Helper to get current week ID (YYYY-WW format)
function getWeekId(): string {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const days = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
  const weekNumber = Math.ceil((days + startOfYear.getDay() + 1) / 7);
  return `${now.getFullYear()}-${weekNumber.toString().padStart(2, '0')}`;
}
