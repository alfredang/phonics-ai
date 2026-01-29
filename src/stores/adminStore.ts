import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  AppSettings,
  AdminUserView,
  CreateUserInput,
  UpdateUserInput,
  UserFilters,
  AdminStats,
} from '@/types/admin';
import * as adminService from '@/lib/firebase/admin';

export type AdminViewAs = 'admin' | 'learner' | 'teacher' | 'parent';

interface AdminStore {
  // State
  users: AdminUserView[];
  selectedUser: AdminUserView | null;
  appSettings: AppSettings | null;
  stats: AdminStats | null;
  filters: UserFilters;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;

  // View As state (for admin to view other dashboards)
  viewAs: AdminViewAs;

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSuccessMessage: (message: string | null) => void;
  clearMessages: () => void;
  setFilters: (filters: UserFilters) => void;
  setViewAs: (view: AdminViewAs) => void;

  // App Settings Operations
  fetchAppSettings: () => Promise<void>;
  updateAppSettings: (updates: Partial<AppSettings>, updatedBy: string) => Promise<void>;
  updateGeminiApiKey: (apiKey: string, updatedBy: string) => Promise<void>;
  toggleRegistration: (enabled: boolean, message: string | undefined, updatedBy: string) => Promise<void>;

  // User Operations
  fetchUsers: (filters?: UserFilters) => Promise<void>;
  fetchUserById: (userId: string) => Promise<AdminUserView | null>;
  createUser: (input: CreateUserInput) => Promise<AdminUserView>;
  updateUser: (userId: string, updates: UpdateUserInput) => Promise<void>;
  deactivateUser: (userId: string) => Promise<void>;
  activateUser: (userId: string) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;
  clearSelectedUser: () => void;

  // Stats Operations
  fetchStats: () => Promise<void>;
}

export const useAdminStore = create<AdminStore>()(
  persist(
    (set, get) => ({
      // Initial state
      users: [],
      selectedUser: null,
      appSettings: null,
      stats: null,
      filters: {},
      isLoading: false,
      error: null,
      successMessage: null,
      viewAs: 'admin' as AdminViewAs,

      // Setters
      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error, isLoading: false, successMessage: null }),
      setSuccessMessage: (message) => set({ successMessage: message, error: null }),
      clearMessages: () => set({ error: null, successMessage: null }),
      setFilters: (filters) => set({ filters }),
      setViewAs: (view) => set({ viewAs: view }),

  // ============================================
  // APP SETTINGS OPERATIONS
  // ============================================

  fetchAppSettings: async () => {
    set({ isLoading: true, error: null });
    try {
      const settings = await adminService.getAppSettings();
      set({ appSettings: settings, isLoading: false });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch app settings';
      set({ error: message, isLoading: false });
    }
  },

  updateAppSettings: async (updates, updatedBy) => {
    set({ isLoading: true, error: null });
    try {
      await adminService.updateAppSettings(updates, updatedBy);
      // Refresh settings
      const settings = await adminService.getAppSettings();
      set({
        appSettings: settings,
        isLoading: false,
        successMessage: 'Settings updated successfully',
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update settings';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  updateGeminiApiKey: async (apiKey, updatedBy) => {
    set({ isLoading: true, error: null });
    try {
      await adminService.updateGeminiApiKey(apiKey, updatedBy);
      // Refresh settings
      const settings = await adminService.getAppSettings();
      set({
        appSettings: settings,
        isLoading: false,
        successMessage: 'API key updated successfully',
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update API key';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  toggleRegistration: async (enabled, message, updatedBy) => {
    set({ isLoading: true, error: null });
    try {
      await adminService.toggleRegistration(enabled, message, updatedBy);
      // Refresh settings
      const settings = await adminService.getAppSettings();
      set({
        appSettings: settings,
        isLoading: false,
        successMessage: enabled ? 'Registration enabled' : 'Registration disabled',
      });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update registration';
      set({ error: errorMessage, isLoading: false });
      throw error;
    }
  },

  // ============================================
  // USER OPERATIONS
  // ============================================

  fetchUsers: async (filters) => {
    set({ isLoading: true, error: null });
    try {
      const users = await adminService.getAllUsers(filters);
      set({ users, filters: filters || {}, isLoading: false });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch users';
      set({ error: message, isLoading: false });
    }
  },

  fetchUserById: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      const user = await adminService.getUserById(userId);
      set({ selectedUser: user, isLoading: false });
      return user;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch user';
      set({ error: message, isLoading: false });
      return null;
    }
  },

  createUser: async (input) => {
    set({ isLoading: true, error: null });
    try {
      const user = await adminService.createUser(input);
      set((state) => ({
        users: [user, ...state.users],
        isLoading: false,
        successMessage: `User "${input.displayName}" created successfully`,
      }));
      return user;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to create user';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  updateUser: async (userId, updates) => {
    set({ isLoading: true, error: null });
    try {
      await adminService.updateUser(userId, updates);
      set((state) => ({
        users: state.users.map((u) =>
          u.uid === userId ? { ...u, ...updates } : u
        ),
        selectedUser:
          state.selectedUser?.uid === userId
            ? { ...state.selectedUser, ...updates }
            : state.selectedUser,
        isLoading: false,
        successMessage: 'User updated successfully',
      }));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update user';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  deactivateUser: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      await adminService.deactivateUser(userId);
      set((state) => ({
        users: state.users.map((u) =>
          u.uid === userId ? { ...u, isActive: false } : u
        ),
        selectedUser:
          state.selectedUser?.uid === userId
            ? { ...state.selectedUser, isActive: false }
            : state.selectedUser,
        isLoading: false,
        successMessage: 'User deactivated',
      }));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to deactivate user';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  activateUser: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      await adminService.activateUser(userId);
      set((state) => ({
        users: state.users.map((u) =>
          u.uid === userId ? { ...u, isActive: true } : u
        ),
        selectedUser:
          state.selectedUser?.uid === userId
            ? { ...state.selectedUser, isActive: true }
            : state.selectedUser,
        isLoading: false,
        successMessage: 'User activated',
      }));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to activate user';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  deleteUser: async (userId) => {
    set({ isLoading: true, error: null });
    try {
      await adminService.deleteUser(userId);
      set((state) => ({
        users: state.users.filter((u) => u.uid !== userId),
        selectedUser:
          state.selectedUser?.uid === userId ? null : state.selectedUser,
        isLoading: false,
        successMessage: 'User deleted',
      }));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete user';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  clearSelectedUser: () => set({ selectedUser: null }),

  // ============================================
  // STATS OPERATIONS
  // ============================================

  fetchStats: async () => {
    set({ isLoading: true, error: null });
    try {
      const stats = await adminService.getAdminStats();
      set({ stats, isLoading: false });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch stats';
      set({ error: message, isLoading: false });
    }
  },
    }),
    {
      name: 'admin-store',
      partialize: (state) => ({
        viewAs: state.viewAs,
      }),
    }
  )
);
