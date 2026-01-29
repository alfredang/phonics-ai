import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile, UserSettings, DEFAULT_USER_SETTINGS } from '@/types/user';
import { updateUserProfile, updateUserSettings } from '@/lib/firebase/auth';
import { useAuthStore } from './authStore';

interface UserStore {
  // Settings (synced with Firebase)
  settings: UserSettings;

  // Profile (synced with Firebase)
  profile: UserProfile | null;

  // Local preferences (not synced)
  hasCompletedOnboarding: boolean;
  lastVisitedWorld: string | null;

  // Actions
  setSettings: (settings: Partial<UserSettings>) => void;
  setProfile: (profile: Partial<UserProfile>) => void;
  setOnboardingComplete: () => void;
  setLastVisitedWorld: (worldId: string) => void;

  // Sync with Firebase
  syncSettings: () => Promise<void>;
  syncProfile: () => Promise<void>;

  // Reset
  reset: () => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      // Initial state
      settings: DEFAULT_USER_SETTINGS,
      profile: null,
      hasCompletedOnboarding: false,
      lastVisitedWorld: null,

      // Update settings (local + Firebase)
      setSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }));

        // Debounced sync to Firebase
        get().syncSettings();
      },

      // Update profile (local + Firebase)
      setProfile: (newProfile) => {
        set((state) => ({
          profile: state.profile
            ? { ...state.profile, ...newProfile }
            : { preferredLanguage: 'en-US', ...newProfile },
        }));

        // Sync to Firebase
        get().syncProfile();
      },

      // Mark onboarding as complete
      setOnboardingComplete: () => {
        set({ hasCompletedOnboarding: true });
      },

      // Set last visited world for quick resume
      setLastVisitedWorld: (worldId) => {
        set({ lastVisitedWorld: worldId });
      },

      // Sync settings to Firebase
      syncSettings: async () => {
        const { user } = useAuthStore.getState();
        if (!user) return;

        try {
          await updateUserSettings(user.uid, get().settings);
        } catch (error) {
          console.error('Failed to sync settings:', error);
        }
      },

      // Sync profile to Firebase
      syncProfile: async () => {
        const { user } = useAuthStore.getState();
        const { profile } = get();
        if (!user || !profile) return;

        try {
          await updateUserProfile(user.uid, profile);
        } catch (error) {
          console.error('Failed to sync profile:', error);
        }
      },

      // Reset store
      reset: () => {
        set({
          settings: DEFAULT_USER_SETTINGS,
          profile: null,
          hasCompletedOnboarding: false,
          lastVisitedWorld: null,
        });
      },
    }),
    {
      name: 'phonics-user',
      partialize: (state) => ({
        settings: state.settings,
        profile: state.profile,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
        lastVisitedWorld: state.lastVisitedWorld,
      }),
    }
  )
);
