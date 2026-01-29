import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';
import { User, UserProfile, DEFAULT_USER_SETTINGS } from '@/types/user';

// Sign up with email and password
export async function signUp(
  email: string,
  password: string,
  displayName: string
): Promise<User> {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const firebaseUser = userCredential.user;

  // Update Firebase Auth profile
  await updateProfile(firebaseUser, { displayName });

  // Create user document in Firestore
  const newUser: User = {
    uid: firebaseUser.uid,
    email: firebaseUser.email!,
    displayName,
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    profile: {
      preferredLanguage: 'en-US',
    },
    settings: DEFAULT_USER_SETTINGS,
  };

  await setDoc(doc(db, 'users', firebaseUser.uid), {
    ...newUser,
    createdAt: serverTimestamp(),
    lastLoginAt: serverTimestamp(),
  });

  return newUser;
}

// Sign in with email and password
export async function signIn(email: string, password: string): Promise<User> {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  const firebaseUser = userCredential.user;

  // Get user document from Firestore
  const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));

  if (userDoc.exists()) {
    // Update last login time
    await setDoc(
      doc(db, 'users', firebaseUser.uid),
      { lastLoginAt: serverTimestamp() },
      { merge: true }
    );

    const userData = userDoc.data();
    return {
      ...userData,
      uid: firebaseUser.uid,
      email: firebaseUser.email!,
      displayName: firebaseUser.displayName || userData.displayName || 'Learner',
      createdAt: userData.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
    } as User;
  }

  // If user doc doesn't exist (edge case), create it
  const newUser: User = {
    uid: firebaseUser.uid,
    email: firebaseUser.email!,
    displayName: firebaseUser.displayName || 'Learner',
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    profile: {
      preferredLanguage: 'en-US',
    },
    settings: DEFAULT_USER_SETTINGS,
  };

  await setDoc(doc(db, 'users', firebaseUser.uid), {
    ...newUser,
    createdAt: serverTimestamp(),
    lastLoginAt: serverTimestamp(),
  });

  return newUser;
}

// Sign out
export async function signOut(): Promise<void> {
  await firebaseSignOut(auth);
}

// Reset password
export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

// Get user from Firestore
export async function getUser(uid: string): Promise<User | null> {
  const userDoc = await getDoc(doc(db, 'users', uid));

  if (!userDoc.exists()) {
    return null;
  }

  const userData = userDoc.data();
  return {
    ...userData,
    uid,
    createdAt: userData.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    lastLoginAt: userData.lastLoginAt?.toDate?.()?.toISOString() || new Date().toISOString(),
  } as User;
}

// Update user profile
export async function updateUserProfile(
  uid: string,
  profile: Partial<UserProfile>
): Promise<void> {
  await setDoc(
    doc(db, 'users', uid),
    { profile },
    { merge: true }
  );
}

// Update user settings
export async function updateUserSettings(
  uid: string,
  settings: Partial<User['settings']>
): Promise<void> {
  await setDoc(
    doc(db, 'users', uid),
    { settings },
    { merge: true }
  );
}

// Subscribe to auth state changes
export function onAuthChange(callback: (user: FirebaseUser | null) => void) {
  return onAuthStateChanged(auth, callback);
}
