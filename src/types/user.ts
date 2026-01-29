/**
 * User type definitions
 */

export type UserRole = 'learner' | 'teacher' | 'parent';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  role: UserRole;
  createdAt: string;          // ISO date string
  lastLoginAt: string;        // ISO date string

  // Profile
  profile: UserProfile;

  // Settings
  settings: UserSettings;
}

export interface UserProfile {
  age?: number;
  grade?: string;
  preferredLanguage: string;
  learningGoal?: string;
  parentEmail?: string;       // For parental controls/reports
}

export interface UserSettings {
  // Audio
  soundEnabled: boolean;
  musicEnabled: boolean;
  soundEffectsVolume: number; // 0-100
  musicVolume: number;        // 0-100
  autoplayAudio: boolean;

  // Speech
  speechRate: number;         // TTS speed (0.5 - 2.0)
  speechVoice?: string;       // Preferred TTS voice

  // Display
  showIPA: boolean;
  showPhonemeColors: boolean;
  fontSize: 'small' | 'medium' | 'large';

  // Gameplay
  difficulty: 'easy' | 'normal' | 'hard';
  autoAdvanceLessons: boolean;
  showHints: boolean;

  // Notifications
  notifications: NotificationSettings;
}

export interface NotificationSettings {
  dailyReminder: boolean;
  dailyReminderTime?: string; // HH:mm format
  achievementAlerts: boolean;
  streakReminder: boolean;
  weeklyProgress: boolean;
}

// Default settings for new users
export const DEFAULT_USER_SETTINGS: UserSettings = {
  soundEnabled: true,
  musicEnabled: true,
  soundEffectsVolume: 80,
  musicVolume: 50,
  autoplayAudio: true,
  speechRate: 1.0,
  showIPA: true,
  showPhonemeColors: true,
  fontSize: 'medium',
  difficulty: 'normal',
  autoAdvanceLessons: false,
  showHints: true,
  notifications: {
    dailyReminder: true,
    dailyReminderTime: '16:00',
    achievementAlerts: true,
    streakReminder: true,
    weeklyProgress: true,
  },
};

// Auth state
export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}
