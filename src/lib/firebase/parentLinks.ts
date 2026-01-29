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
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import { ParentLink, StudentProgressSummary, ChildProgressReport } from '@/types/classroom';

// Generate a random 8-character link code
export function generateLinkCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Generate a link code for a child (stored in user document)
export async function generateChildLinkCode(
  childId: string,
  childDisplayName: string
): Promise<string> {
  const linkCode = generateLinkCode();

  // Store the pending link code in a dedicated collection
  await setDoc(doc(db, 'pendingParentLinks', linkCode), {
    childId,
    childDisplayName,
    linkCode,
    createdAt: serverTimestamp(),
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hour expiry
  });

  return linkCode;
}

// Parent uses link code to create a pending link
export async function createLinkRequest(
  parentId: string,
  parentDisplayName: string,
  linkCode: string
): Promise<ParentLink> {
  // Find the pending link
  const pendingLinkDoc = await getDoc(doc(db, 'pendingParentLinks', linkCode.toUpperCase()));

  if (!pendingLinkDoc.exists()) {
    throw new Error('Invalid or expired link code. Please ask your child for a new code.');
  }

  const pendingData = pendingLinkDoc.data();

  // Check if already linked
  const existingLinkQuery = query(
    collection(db, 'parentLinks'),
    where('parentId', '==', parentId),
    where('childId', '==', pendingData.childId)
  );
  const existingLinks = await getDocs(existingLinkQuery);

  if (!existingLinks.empty) {
    throw new Error('You are already linked to this child.');
  }

  // Create the parent link
  const linkRef = doc(collection(db, 'parentLinks'));
  const link: ParentLink = {
    id: linkRef.id,
    parentId,
    childId: pendingData.childId,
    childDisplayName: pendingData.childDisplayName,
    parentDisplayName,
    linkedAt: new Date().toISOString(),
    status: 'pending',
    linkCode: linkCode.toUpperCase(),
  };

  await setDoc(linkRef, {
    ...link,
    linkedAt: serverTimestamp(),
  });

  // Delete the pending link code (one-time use)
  await deleteDoc(doc(db, 'pendingParentLinks', linkCode.toUpperCase()));

  return link;
}

// Child approves the parent link
export async function approveParentLink(
  linkId: string,
  childId: string
): Promise<void> {
  const linkDoc = await getDoc(doc(db, 'parentLinks', linkId));

  if (!linkDoc.exists()) {
    throw new Error('Link not found.');
  }

  const linkData = linkDoc.data();

  if (linkData.childId !== childId) {
    throw new Error('You are not authorized to approve this link.');
  }

  await updateDoc(doc(db, 'parentLinks', linkId), {
    status: 'active',
    linkCode: null, // Remove the code after approval
  });
}

// Child rejects/removes a parent link
export async function rejectParentLink(
  linkId: string,
  childId: string
): Promise<void> {
  const linkDoc = await getDoc(doc(db, 'parentLinks', linkId));

  if (!linkDoc.exists()) {
    throw new Error('Link not found.');
  }

  const linkData = linkDoc.data();

  if (linkData.childId !== childId) {
    throw new Error('You are not authorized to remove this link.');
  }

  await deleteDoc(doc(db, 'parentLinks', linkId));
}

// Get all children linked to a parent
export async function getParentChildren(parentId: string): Promise<ParentLink[]> {
  const q = query(
    collection(db, 'parentLinks'),
    where('parentId', '==', parentId),
    where('status', '==', 'active')
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      linkedAt: data.linkedAt instanceof Timestamp
        ? data.linkedAt.toDate().toISOString()
        : data.linkedAt,
    } as ParentLink;
  });
}

// Get pending link requests for a child
export async function getPendingLinksForChild(childId: string): Promise<ParentLink[]> {
  const q = query(
    collection(db, 'parentLinks'),
    where('childId', '==', childId),
    where('status', '==', 'pending')
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      linkedAt: data.linkedAt instanceof Timestamp
        ? data.linkedAt.toDate().toISOString()
        : data.linkedAt,
    } as ParentLink;
  });
}

// Get all parents linked to a child
export async function getChildParents(childId: string): Promise<ParentLink[]> {
  const q = query(
    collection(db, 'parentLinks'),
    where('childId', '==', childId),
    where('status', '==', 'active')
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      linkedAt: data.linkedAt instanceof Timestamp
        ? data.linkedAt.toDate().toISOString()
        : data.linkedAt,
    } as ParentLink;
  });
}

// Parent removes their own link to a child
export async function removeParentLink(
  linkId: string,
  parentId: string
): Promise<void> {
  const linkDoc = await getDoc(doc(db, 'parentLinks', linkId));

  if (!linkDoc.exists()) {
    throw new Error('Link not found.');
  }

  const linkData = linkDoc.data();

  if (linkData.parentId !== parentId) {
    throw new Error('You are not authorized to remove this link.');
  }

  await deleteDoc(doc(db, 'parentLinks', linkId));
}

// Get child's progress for parent view
export async function getChildProgress(
  childId: string
): Promise<StudentProgressSummary | null> {
  // Get user data
  const userDoc = await getDoc(doc(db, 'users', childId));
  if (!userDoc.exists()) {
    return null;
  }

  // Get game state data
  const gameStateDoc = await getDoc(doc(db, 'gameStates', childId));
  const gameState = gameStateDoc.exists() ? gameStateDoc.data() : {};

  const userData = userDoc.data();

  return {
    userId: childId,
    displayName: userData.displayName || 'Child',
    avatarUrl: userData.avatarUrl,
    level: gameState.level || 1,
    levelTitle: gameState.levelTitle || 'Beginner',
    xp: gameState.xp || 0,
    levelProgress: gameState.levelProgress || 0,
    currentStreak: gameState.currentStreak || 0,
    longestStreak: gameState.longestStreak || 0,
    completedLessons: gameState.completedLessons || [],
    lessonsCompleted: (gameState.completedLessons || []).length,
    phonemeProgress: gameState.phonemeProgress || {},
    lastActivityAt: gameState.lastActivityAt instanceof Timestamp
      ? gameState.lastActivityAt.toDate().toISOString()
      : gameState.lastActivityAt,
    achievements: gameState.achievements || [],
  };
}

// Get detailed progress report for parent
export async function getChildProgressReport(
  childId: string
): Promise<ChildProgressReport | null> {
  const progress = await getChildProgress(childId);

  if (!progress) {
    return null;
  }

  // Get activity data for the past 7 days
  // In a real implementation, this would come from an activity log collection
  const weeklyActivity = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    weeklyActivity.push({
      date: date.toISOString().split('T')[0],
      lessonsCompleted: 0, // Would come from actual data
      xpEarned: 0,
      practiceMinutes: 0,
    });
  }

  // Get recent lessons - would come from lesson progress collection
  const recentLessons: ChildProgressReport['recentLessons'] = [];

  // Get phoneme mastery breakdown
  const phonemeMastery = Object.entries(progress.phonemeProgress || {}).map(
    ([phonemeId, data]) => ({
      phonemeId,
      symbol: phonemeId, // Would map to actual symbol from phonemes constant
      masteryLevel: data.masteryLevel || 0,
      practiceCount: data.attempts || 0,
    })
  );

  return {
    child: progress,
    weeklyActivity,
    recentLessons,
    phonemeMastery,
  };
}
