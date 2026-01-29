import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, UserRole } from '@/types/user';
import * as authService from '@/lib/firebase/auth';

interface AuthStore {
  // State
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;

  // Actions
  setUser: (user: User | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Auth operations
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (email: string, password: string, displayName: string, role?: UserRole) => Promise<User>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  initializeAuth: () => () => void;

  // Helpers
  getDashboardPath: () => string;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isLoading: true,
      isAuthenticated: false,
      error: null,

      // Setters
      setUser: (user) =>
        set({
          user,
          isAuthenticated: !!user,
          isLoading: false,
        }),

      setLoading: (loading) => set({ isLoading: loading }),

      setError: (error) => set({ error, isLoading: false }),

      clearError: () => set({ error: null }),

      // Sign in
      signIn: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const user = await authService.signIn(email, password);
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return user;
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Failed to sign in';
          set({
            error: getAuthErrorMessage(message),
            isLoading: false,
          });
          throw error;
        }
      },

      // Sign up
      signUp: async (email, password, displayName, role = 'learner') => {
        set({ isLoading: true, error: null });
        try {
          const user = await authService.signUp(email, password, displayName, role);
          set({
            user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return user;
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Failed to create account';
          set({
            error: getAuthErrorMessage(message),
            isLoading: false,
          });
          throw error;
        }
      },

      // Sign out
      signOut: async () => {
        set({ isLoading: true });
        try {
          await authService.signOut();
          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
            error: null,
          });
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Failed to sign out';
          set({
            error: message,
            isLoading: false,
          });
          throw error;
        }
      },

      // Reset password
      resetPassword: async (email) => {
        set({ isLoading: true, error: null });
        try {
          await authService.resetPassword(email);
          set({ isLoading: false });
        } catch (error: unknown) {
          const message = error instanceof Error ? error.message : 'Failed to send reset email';
          set({
            error: getAuthErrorMessage(message),
            isLoading: false,
          });
          throw error;
        }
      },

      // Initialize auth listener
      initializeAuth: () => {
        set({ isLoading: true });

        const unsubscribe = authService.onAuthChange(async (firebaseUser) => {
          if (firebaseUser) {
            try {
              const user = await authService.getUser(firebaseUser.uid);
              if (user) {
                set({
                  user,
                  isAuthenticated: true,
                  isLoading: false,
                });
              } else {
                set({
                  user: null,
                  isAuthenticated: false,
                  isLoading: false,
                });
              }
            } catch (error) {
              console.error('Error fetching user data:', error);
              set({
                user: null,
                isAuthenticated: false,
                isLoading: false,
              });
            }
          } else {
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
            });
          }
        });

        return unsubscribe;
      },

      // Get dashboard path based on user role
      getDashboardPath: () => {
        const user = get().user;
        if (!user) return '/login';

        switch (user.role) {
          case 'admin':
            return '/admin';
          case 'teacher':
            return '/teacher';
          case 'parent':
            return '/parent';
          case 'learner':
          default:
            return '/dashboard';
        }
      },
    }),
    {
      name: 'phonics-auth',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Helper to convert Firebase error codes to user-friendly messages
function getAuthErrorMessage(error: string): string {
  if (error.includes('auth/email-already-in-use')) {
    return 'This email is already registered. Try signing in instead.';
  }
  if (error.includes('auth/invalid-email')) {
    return 'Please enter a valid email address.';
  }
  if (error.includes('auth/weak-password')) {
    return 'Password should be at least 6 characters long.';
  }
  if (error.includes('auth/user-not-found')) {
    return 'No account found with this email. Try signing up instead.';
  }
  if (error.includes('auth/wrong-password')) {
    return 'Incorrect password. Please try again.';
  }
  if (error.includes('auth/too-many-requests')) {
    return 'Too many failed attempts. Please try again later.';
  }
  if (error.includes('auth/invalid-credential')) {
    return 'Invalid email or password. Please check and try again.';
  }
  return error;
}
