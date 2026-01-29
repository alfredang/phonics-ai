# Role-Based Authentication Skill

## Overview

Implement role-based access control (RBAC) in a Next.js application with Firebase Authentication and Firestore. This pattern supports multiple user types (e.g., learner, teacher, parent) with role-specific dashboards and permissions.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Registration                         │
│                    (Role Selection UI)                      │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    Firebase Auth                            │
│               (Create user + custom claims)                 │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│                    Firestore User Doc                       │
│              { uid, email, role, profile }                  │
└─────────────────────────┬───────────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
     /dashboard      /teacher        /parent
     (learner)       (teacher)       (parent)
```

## Type Definitions

```typescript
// types/user.ts
export type UserRole = 'learner' | 'teacher' | 'parent';

export interface User {
  uid: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  role: UserRole;
  createdAt: string;
  lastLoginAt: string;
  profile: UserProfile;
  settings: UserSettings;
}

export interface UserProfile {
  age?: number;
  grade?: string;
  school?: string;
  interests?: string[];
}

export interface UserSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  notificationsEnabled: boolean;
  theme: 'light' | 'dark' | 'system';
}
```

## Firebase Auth Integration

### Sign Up with Role

```typescript
// lib/firebase/auth.ts
import {
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';
import type { User, UserRole } from '@/types/user';

export async function signUp(
  email: string,
  password: string,
  displayName: string,
  role: UserRole = 'learner'
): Promise<User> {
  // Create Firebase Auth user
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const firebaseUser = userCredential.user;

  // Update display name
  await updateProfile(firebaseUser, { displayName });

  // Create user document with role
  const userData: User = {
    uid: firebaseUser.uid,
    email: firebaseUser.email!,
    displayName,
    role, // Store role in Firestore
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    profile: {},
    settings: {
      soundEnabled: true,
      musicEnabled: true,
      notificationsEnabled: true,
      theme: 'system',
    },
  };

  await setDoc(doc(db, 'users', firebaseUser.uid), userData);

  return userData;
}
```

### Get User with Role

```typescript
export async function getUserData(uid: string): Promise<User | null> {
  const userDoc = await getDoc(doc(db, 'users', uid));
  if (!userDoc.exists()) return null;
  return userDoc.data() as User;
}
```

## Zustand Auth Store

```typescript
// stores/authStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, UserRole } from '@/types/user';
import * as authService from '@/lib/firebase/auth';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  // Actions
  signUp: (email: string, password: string, displayName: string, role?: UserRole) => Promise<User>;
  signIn: (email: string, password: string) => Promise<User>;
  signOut: () => Promise<void>;

  // Helpers
  getDashboardPath: () => string;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isLoading: true,
      isAuthenticated: false,

      signUp: async (email, password, displayName, role = 'learner') => {
        const user = await authService.signUp(email, password, displayName, role);
        set({ user, isAuthenticated: true });
        return user;
      },

      signIn: async (email, password) => {
        const user = await authService.signIn(email, password);
        set({ user, isAuthenticated: true });
        return user;
      },

      signOut: async () => {
        await authService.signOut();
        set({ user: null, isAuthenticated: false });
      },

      // Route to correct dashboard based on role
      getDashboardPath: () => {
        const { user } = get();
        if (!user) return '/login';

        switch (user.role) {
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
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user }),
    }
  )
);
```

## Registration with Role Selection

```tsx
// app/(auth)/register/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import type { UserRole } from '@/types/user';

const roles: { value: UserRole; label: string; icon: string; description: string }[] = [
  {
    value: 'learner',
    label: 'Student',
    icon: '🎓',
    description: 'I want to learn and practice',
  },
  {
    value: 'teacher',
    label: 'Teacher',
    icon: '👩‍🏫',
    description: 'I want to manage students',
  },
  {
    value: 'parent',
    label: 'Parent',
    icon: '👪',
    description: 'I want to track my child\'s progress',
  },
];

export default function RegisterPage() {
  const router = useRouter();
  const { signUp, getDashboardPath } = useAuthStore();
  const [selectedRole, setSelectedRole] = useState<UserRole>('learner');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    displayName: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signUp(formData.email, formData.password, formData.displayName, selectedRole);
      router.push(getDashboardPath());
    } catch (error) {
      console.error('Registration failed:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Role Selection */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {roles.map((role) => (
          <button
            key={role.value}
            type="button"
            onClick={() => setSelectedRole(role.value)}
            className={`p-4 rounded-xl border-2 transition-all ${
              selectedRole === role.value
                ? 'border-purple-500 bg-purple-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <span className="text-3xl">{role.icon}</span>
            <p className="font-semibold mt-2">{role.label}</p>
            <p className="text-sm text-gray-500">{role.description}</p>
          </button>
        ))}
      </div>

      {/* Form Fields */}
      <input
        type="text"
        placeholder="Display Name"
        value={formData.displayName}
        onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
      />
      <input
        type="email"
        placeholder="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        value={formData.password}
        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
      />

      <button type="submit">Create Account</button>
    </form>
  );
}
```

## Role-Based Layout Guards

### Teacher Layout Guard

```tsx
// app/teacher/layout.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuthStore();

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login');
      } else if (user?.role !== 'teacher') {
        // Redirect non-teachers to their appropriate dashboard
        router.push(user?.role === 'parent' ? '/parent' : '/dashboard');
      }
    }
  }, [isAuthenticated, isLoading, user, router]);

  // Show loading while checking auth
  if (isLoading || !user || user.role !== 'teacher') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <TeacherSidebar />
      <main className="ml-64 p-8">{children}</main>
    </div>
  );
}
```

### Reusable Role Guard HOC

```tsx
// components/auth/withRoleGuard.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import type { UserRole } from '@/types/user';

export function withRoleGuard(
  Component: React.ComponentType,
  allowedRoles: UserRole[]
) {
  return function GuardedComponent(props: any) {
    const router = useRouter();
    const { user, isAuthenticated, isLoading, getDashboardPath } = useAuthStore();

    useEffect(() => {
      if (!isLoading) {
        if (!isAuthenticated) {
          router.push('/login');
        } else if (user && !allowedRoles.includes(user.role)) {
          router.push(getDashboardPath());
        }
      }
    }, [isAuthenticated, isLoading, user, router]);

    if (isLoading || !user || !allowedRoles.includes(user.role)) {
      return <LoadingSpinner />;
    }

    return <Component {...props} />;
  };
}

// Usage:
// export default withRoleGuard(TeacherDashboard, ['teacher']);
```

## Firestore Security Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper functions
    function isAuthenticated() {
      return request.auth != null;
    }

    function isOwner(userId) {
      return request.auth.uid == userId;
    }

    function getUserRole() {
      return get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role;
    }

    function isTeacher() {
      return getUserRole() == 'teacher';
    }

    function isParent() {
      return getUserRole() == 'parent';
    }

    // Users collection
    match /users/{userId} {
      allow read: if isAuthenticated() && (isOwner(userId) || isTeacher() || isParent());
      allow create: if isAuthenticated() && isOwner(userId);
      allow update: if isAuthenticated() && isOwner(userId);
    }

    // Classrooms collection (teacher-only write)
    match /classrooms/{classroomId} {
      allow read: if isAuthenticated();
      allow create: if isAuthenticated() && isTeacher();
      allow update, delete: if isAuthenticated() &&
        resource.data.teacherId == request.auth.uid;

      // Students subcollection
      match /students/{studentId} {
        allow read: if isAuthenticated() &&
          (isTeacher() || request.auth.uid == studentId);
        allow write: if isAuthenticated() && isTeacher();
      }
    }

    // Parent links
    match /parentLinks/{linkId} {
      allow read: if isAuthenticated() &&
        (resource.data.parentId == request.auth.uid ||
         resource.data.childId == request.auth.uid);
      allow create: if isAuthenticated() && isParent();
      allow update: if isAuthenticated() &&
        resource.data.childId == request.auth.uid; // Child approves
    }

    // Game progress (learner owns, teacher/parent can read)
    match /gameStates/{userId} {
      allow read: if isAuthenticated() && (
        isOwner(userId) ||
        isTeacher() ||
        isParentOf(userId)
      );
      allow write: if isAuthenticated() && isOwner(userId);
    }
  }
}
```

## Role-Specific Features

### Teacher: Classroom Management

```typescript
// lib/firebase/classrooms.ts
export async function createClassroom(
  teacherId: string,
  name: string,
  description?: string
): Promise<Classroom> {
  const joinCode = generateJoinCode(); // 6-char uppercase

  const classroomData: Classroom = {
    id: '', // Will be set after creation
    name,
    description,
    teacherId,
    teacherName: '', // Fetch from user doc
    joinCode,
    createdAt: new Date().toISOString(),
    studentCount: 0,
    isActive: true,
  };

  const docRef = await addDoc(collection(db, 'classrooms'), classroomData);
  return { ...classroomData, id: docRef.id };
}

export async function joinClassroom(
  studentId: string,
  joinCode: string
): Promise<{ success: boolean; classroomId?: string }> {
  // Find classroom by join code
  const q = query(
    collection(db, 'classrooms'),
    where('joinCode', '==', joinCode.toUpperCase()),
    where('isActive', '==', true)
  );
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return { success: false };
  }

  const classroom = snapshot.docs[0];

  // Add student to classroom
  await setDoc(
    doc(db, 'classrooms', classroom.id, 'students', studentId),
    {
      userId: studentId,
      joinedAt: new Date().toISOString(),
      // Include snapshot of student progress for quick display
    }
  );

  // Increment student count
  await updateDoc(doc(db, 'classrooms', classroom.id), {
    studentCount: increment(1),
  });

  return { success: true, classroomId: classroom.id };
}
```

### Parent: Child Linking

```typescript
// lib/firebase/parentLinks.ts
export async function generateChildLinkCode(childId: string): Promise<string> {
  const code = nanoid(8).toUpperCase();

  await setDoc(doc(db, 'pendingParentLinks', code), {
    childId,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24h
  });

  return code;
}

export async function linkParentToChild(
  parentId: string,
  linkCode: string
): Promise<{ success: boolean; childId?: string }> {
  const pendingDoc = await getDoc(doc(db, 'pendingParentLinks', linkCode));

  if (!pendingDoc.exists()) {
    return { success: false };
  }

  const { childId, expiresAt } = pendingDoc.data();

  if (new Date(expiresAt) < new Date()) {
    return { success: false }; // Expired
  }

  // Create parent-child link
  await addDoc(collection(db, 'parentLinks'), {
    parentId,
    childId,
    linkedAt: new Date().toISOString(),
    status: 'active',
  });

  // Delete pending link
  await deleteDoc(doc(db, 'pendingParentLinks', linkCode));

  return { success: true, childId };
}
```

## Navigation by Role

```tsx
// components/navigation/RoleBasedNav.tsx
'use client';

import { useAuthStore } from '@/stores/authStore';
import LearnerNav from './LearnerNav';
import TeacherNav from './TeacherNav';
import ParentNav from './ParentNav';

export default function RoleBasedNav() {
  const { user } = useAuthStore();

  if (!user) return null;

  switch (user.role) {
    case 'teacher':
      return <TeacherNav />;
    case 'parent':
      return <ParentNav />;
    case 'learner':
    default:
      return <LearnerNav />;
  }
}
```

## Best Practices

1. **Store Role in Firestore**: Don't rely solely on custom claims; store in user document for easier querying
2. **Check Role Server-Side**: Use Firestore rules to enforce permissions, not just client-side guards
3. **Default Role**: Always have a default role (e.g., 'learner') for edge cases
4. **Role Migration**: Plan for users who might change roles or have multiple roles
5. **Session Persistence**: Use Zustand persist to maintain auth state across refreshes
6. **Loading States**: Always show loading UI while checking auth to prevent flash of wrong content

## Related Skills

- [Next.js Static Export](../nextjs-static-export/SKILL.md)
- [GitHub Pages Documentation](../github-pages-documentation/SKILL.md)
