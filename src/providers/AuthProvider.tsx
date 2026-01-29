'use client';

import { useEffect, ReactNode } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { useGameStore } from '@/stores/gameStore';
import { useUserStore } from '@/stores/userStore';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const loadFromFirestore = useGameStore((state) => state.loadFromFirestore);
  const refreshDailyQuests = useGameStore((state) => state.refreshDailyQuests);
  const updateStreak = useGameStore((state) => state.updateStreak);

  // Initialize Firebase auth listener on mount
  useEffect(() => {
    const unsubscribe = initializeAuth();
    return () => unsubscribe();
  }, [initializeAuth]);

  // Load game state when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadFromFirestore();
      refreshDailyQuests();
      updateStreak();
    }
  }, [isAuthenticated, loadFromFirestore, refreshDailyQuests, updateStreak]);

  return <>{children}</>;
}
