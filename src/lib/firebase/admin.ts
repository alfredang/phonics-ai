import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { db, auth } from './config';
import { User, UserRole, DEFAULT_USER_SETTINGS } from '@/types/user';
import {
  AppSettings,
  AdminUserView,
  CreateUserInput,
  UpdateUserInput,
  UserFilters,
  AdminStats,
  DEFAULT_APP_SETTINGS,
} from '@/types/admin';

// ============================================
// APP SETTINGS
// ============================================

// Get app settings
export async function getAppSettings(): Promise<AppSettings> {
  const settingsDoc = await getDoc(doc(db, 'settings', 'app'));

  if (!settingsDoc.exists()) {
    // Create default settings if they don't exist
    await setDoc(doc(db, 'settings', 'app'), {
      ...DEFAULT_APP_SETTINGS,
      updatedAt: serverTimestamp(),
    });
    return DEFAULT_APP_SETTINGS;
  }

  const data = settingsDoc.data();
  return {
    ...data,
    updatedAt: data.updatedAt instanceof Timestamp
      ? data.updatedAt.toDate().toISOString()
      : data.updatedAt,
  } as AppSettings;
}

// Update app settings
export async function updateAppSettings(
  updates: Partial<AppSettings>,
  updatedBy: string
): Promise<void> {
  await updateDoc(doc(db, 'settings', 'app'), {
    ...updates,
    updatedAt: serverTimestamp(),
    updatedBy,
  });
}

// Update Gemini API key
export async function updateGeminiApiKey(
  apiKey: string,
  updatedBy: string
): Promise<void> {
  await updateDoc(doc(db, 'settings', 'app'), {
    geminiApiKey: apiKey,
    updatedAt: serverTimestamp(),
    updatedBy,
  });
}

// Toggle registration
export async function toggleRegistration(
  enabled: boolean,
  message: string | undefined,
  updatedBy: string
): Promise<void> {
  await updateDoc(doc(db, 'settings', 'app'), {
    registrationEnabled: enabled,
    registrationDisabledMessage: message,
    updatedAt: serverTimestamp(),
    updatedBy,
  });
}

// Check if registration is enabled
export async function isRegistrationEnabled(): Promise<{ enabled: boolean; message?: string }> {
  const settings = await getAppSettings();
  return {
    enabled: settings.registrationEnabled,
    message: settings.registrationDisabledMessage,
  };
}

// ============================================
// USER MANAGEMENT
// ============================================

// Get all users with optional filters
export async function getAllUsers(filters?: UserFilters): Promise<AdminUserView[]> {
  let q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));

  // Note: Complex filters may require composite indexes in Firestore
  const snapshot = await getDocs(q);

  let users: AdminUserView[] = [];

  for (const docSnapshot of snapshot.docs) {
    const userData = docSnapshot.data();

    // Get game state for additional info
    const gameStateDoc = await getDoc(doc(db, 'gameStates', docSnapshot.id));
    const gameState = gameStateDoc.exists() ? gameStateDoc.data() : {};

    const user: AdminUserView = {
      uid: docSnapshot.id,
      email: userData.email,
      displayName: userData.displayName,
      avatarUrl: userData.avatarUrl,
      role: userData.role || 'learner',
      createdAt: userData.createdAt instanceof Timestamp
        ? userData.createdAt.toDate().toISOString()
        : userData.createdAt,
      lastLoginAt: userData.lastLoginAt instanceof Timestamp
        ? userData.lastLoginAt.toDate().toISOString()
        : userData.lastLoginAt,
      profile: userData.profile || { preferredLanguage: 'en-US' },
      settings: userData.settings || DEFAULT_USER_SETTINGS,
      isActive: userData.isActive !== false, // Default to active
      lastActivityAt: gameState.lastActivityAt instanceof Timestamp
        ? gameState.lastActivityAt.toDate().toISOString()
        : gameState.lastActivityAt,
      totalXp: gameState.xp || 0,
      lessonsCompleted: (gameState.completedLessons || []).length,
      joinedClassrooms: userData.joinedClassrooms || [],
    };

    users.push(user);
  }

  // Apply filters in memory (for simplicity - could be optimized with Firestore queries)
  if (filters) {
    if (filters.role && filters.role !== 'all') {
      users = users.filter((u) => u.role === filters.role);
    }
    if (filters.isActive !== undefined && filters.isActive !== 'all') {
      users = users.filter((u) => u.isActive === filters.isActive);
    }
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      users = users.filter(
        (u) =>
          u.displayName.toLowerCase().includes(query) ||
          u.email.toLowerCase().includes(query)
      );
    }
  }

  return users;
}

// Get single user by ID
export async function getUserById(userId: string): Promise<AdminUserView | null> {
  const userDoc = await getDoc(doc(db, 'users', userId));

  if (!userDoc.exists()) {
    return null;
  }

  const userData = userDoc.data();

  // Get game state for additional info
  const gameStateDoc = await getDoc(doc(db, 'gameStates', userId));
  const gameState = gameStateDoc.exists() ? gameStateDoc.data() : {};

  return {
    uid: userId,
    email: userData.email,
    displayName: userData.displayName,
    avatarUrl: userData.avatarUrl,
    role: userData.role || 'learner',
    createdAt: userData.createdAt instanceof Timestamp
      ? userData.createdAt.toDate().toISOString()
      : userData.createdAt,
    lastLoginAt: userData.lastLoginAt instanceof Timestamp
      ? userData.lastLoginAt.toDate().toISOString()
      : userData.lastLoginAt,
    profile: userData.profile || { preferredLanguage: 'en-US' },
    settings: userData.settings || DEFAULT_USER_SETTINGS,
    isActive: userData.isActive !== false,
    lastActivityAt: gameState.lastActivityAt instanceof Timestamp
      ? gameState.lastActivityAt.toDate().toISOString()
      : gameState.lastActivityAt,
    totalXp: gameState.xp || 0,
    lessonsCompleted: (gameState.completedLessons || []).length,
    joinedClassrooms: userData.joinedClassrooms || [],
  };
}

// Create a new user (admin function)
export async function createUser(input: CreateUserInput): Promise<AdminUserView> {
  // Create Firebase Auth user
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    input.email,
    input.password
  );
  const firebaseUser = userCredential.user;

  // Update display name
  await updateProfile(firebaseUser, { displayName: input.displayName });

  // Create Firestore user document
  const newUser: Omit<User, 'uid'> & { isActive: boolean } = {
    email: input.email,
    displayName: input.displayName,
    role: input.role,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    profile: {
      preferredLanguage: 'en-US',
    },
    settings: DEFAULT_USER_SETTINGS,
    isActive: input.isActive !== false,
  };

  await setDoc(doc(db, 'users', firebaseUser.uid), {
    ...newUser,
    createdAt: serverTimestamp(),
    lastLoginAt: serverTimestamp(),
  });

  return {
    ...newUser,
    uid: firebaseUser.uid,
    totalXp: 0,
    lessonsCompleted: 0,
    joinedClassrooms: [],
  };
}

// Update user (admin function)
export async function updateUser(
  userId: string,
  updates: UpdateUserInput
): Promise<void> {
  const updateData: Record<string, unknown> = {};

  if (updates.displayName !== undefined) {
    updateData.displayName = updates.displayName;
  }
  if (updates.role !== undefined) {
    updateData.role = updates.role;
  }
  if (updates.isActive !== undefined) {
    updateData.isActive = updates.isActive;
  }

  await updateDoc(doc(db, 'users', userId), updateData);
}

// Deactivate user (soft delete)
export async function deactivateUser(userId: string): Promise<void> {
  await updateDoc(doc(db, 'users', userId), {
    isActive: false,
  });
}

// Activate user
export async function activateUser(userId: string): Promise<void> {
  await updateDoc(doc(db, 'users', userId), {
    isActive: true,
  });
}

// Delete user (hard delete - use with caution)
export async function deleteUser(userId: string): Promise<void> {
  // Delete user document
  await deleteDoc(doc(db, 'users', userId));

  // Delete game state
  await deleteDoc(doc(db, 'gameStates', userId));

  // Note: Firebase Auth user deletion requires Admin SDK (server-side)
  // For client-side, we just delete the Firestore data
}

// ============================================
// ADMIN STATISTICS
// ============================================

// Get admin dashboard statistics
export async function getAdminStats(): Promise<AdminStats> {
  const usersSnapshot = await getDocs(collection(db, 'users'));
  const classroomsSnapshot = await getDocs(
    query(collection(db, 'classrooms'), where('isActive', '==', true))
  );

  let totalLearners = 0;
  let totalTeachers = 0;
  let totalParents = 0;
  let activeToday = 0;
  let newUsersThisWeek = 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  usersSnapshot.forEach((doc) => {
    const data = doc.data();
    const role = data.role || 'learner';

    // Count by role
    if (role === 'learner') totalLearners++;
    else if (role === 'teacher') totalTeachers++;
    else if (role === 'parent') totalParents++;

    // Check if active today
    const lastLogin = data.lastLoginAt instanceof Timestamp
      ? data.lastLoginAt.toDate()
      : new Date(data.lastLoginAt || 0);
    if (lastLogin >= today) {
      activeToday++;
    }

    // Check if new this week
    const createdAt = data.createdAt instanceof Timestamp
      ? data.createdAt.toDate()
      : new Date(data.createdAt || 0);
    if (createdAt >= oneWeekAgo) {
      newUsersThisWeek++;
    }
  });

  return {
    totalUsers: usersSnapshot.size,
    totalLearners,
    totalTeachers,
    totalParents,
    activeToday,
    newUsersThisWeek,
    totalClassrooms: classroomsSnapshot.size,
  };
}

// ============================================
// ADMIN VERIFICATION
// ============================================

// Check if a user is an admin
export async function isUserAdmin(userId: string): Promise<boolean> {
  const userDoc = await getDoc(doc(db, 'users', userId));

  if (!userDoc.exists()) {
    return false;
  }

  return userDoc.data().role === 'admin';
}

// Promote user to admin by email
export async function promoteToAdminByEmail(email: string): Promise<{ success: boolean; message: string }> {
  try {
    // Find user by email
    const usersQuery = query(collection(db, 'users'), where('email', '==', email), limit(1));
    const snapshot = await getDocs(usersQuery);

    if (snapshot.empty) {
      return { success: false, message: `No user found with email: ${email}` };
    }

    const userDoc = snapshot.docs[0];
    const userId = userDoc.id;
    const currentRole = userDoc.data().role;

    if (currentRole === 'admin') {
      return { success: false, message: `User ${email} is already an admin` };
    }

    // Update role to admin
    await updateDoc(doc(db, 'users', userId), {
      role: 'admin',
    });

    return { success: true, message: `Successfully promoted ${email} to admin` };
  } catch (error) {
    console.error('Error promoting user to admin:', error);
    return { success: false, message: `Failed to promote user: ${error}` };
  }
}

// Get user by email
export async function getUserByEmail(email: string): Promise<AdminUserView | null> {
  const usersQuery = query(collection(db, 'users'), where('email', '==', email), limit(1));
  const snapshot = await getDocs(usersQuery);

  if (snapshot.empty) {
    return null;
  }

  const userDoc = snapshot.docs[0];
  return getUserById(userDoc.id);
}
