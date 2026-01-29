/**
 * Admin type definitions
 */

import { User, UserRole } from './user';

// App-wide settings stored in Firestore
export interface AppSettings {
  // Registration
  registrationEnabled: boolean;
  registrationDisabledMessage?: string;

  // API Keys (stored securely)
  geminiApiKey?: string;

  // Feature flags
  features: {
    aiPronunciationFeedback: boolean;
    speechRecognition: boolean;
    chatbot: boolean;
  };

  // Maintenance mode
  maintenanceMode: boolean;
  maintenanceMessage?: string;

  // Timestamps
  updatedAt: string;
  updatedBy: string;
}

// Default app settings
export const DEFAULT_APP_SETTINGS: AppSettings = {
  registrationEnabled: true,
  registrationDisabledMessage: 'Registration is currently closed. Please try again later.',
  features: {
    aiPronunciationFeedback: true,
    speechRecognition: true,
    chatbot: true,
  },
  maintenanceMode: false,
  maintenanceMessage: 'The app is currently under maintenance. Please check back later.',
  updatedAt: new Date().toISOString(),
  updatedBy: 'system',
};

// User with additional admin-visible fields
export interface AdminUserView extends User {
  isActive: boolean;
  lastActivityAt?: string;
  totalXp?: number;
  lessonsCompleted?: number;
  joinedClassrooms?: string[];
}

// User creation input for admin
export interface CreateUserInput {
  email: string;
  password: string;
  displayName: string;
  role: UserRole;
  isActive?: boolean;
}

// User update input for admin
export interface UpdateUserInput {
  displayName?: string;
  role?: UserRole;
  isActive?: boolean;
  email?: string;
}

// User filter options
export interface UserFilters {
  role?: UserRole | 'all';
  isActive?: boolean | 'all';
  searchQuery?: string;
}

// Admin statistics
export interface AdminStats {
  totalUsers: number;
  totalLearners: number;
  totalTeachers: number;
  totalParents: number;
  activeToday: number;
  newUsersThisWeek: number;
  totalClassrooms: number;
}
