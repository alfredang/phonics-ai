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
  increment,
  Timestamp,
} from 'firebase/firestore';
import { db } from './config';
import {
  Classroom,
  ClassroomStudent,
  CreateClassroomInput,
  StudentProgressSummary,
} from '@/types/classroom';

// Generate a random 6-character join code
export function generateJoinCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Excluding similar chars (0, O, 1, I)
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Create a new classroom
export async function createClassroom(
  teacherId: string,
  teacherName: string,
  input: CreateClassroomInput
): Promise<Classroom> {
  const classroomRef = doc(collection(db, 'classrooms'));
  const joinCode = generateJoinCode();

  const classroom: Classroom = {
    id: classroomRef.id,
    name: input.name,
    description: input.description,
    teacherId,
    teacherName,
    joinCode,
    createdAt: new Date().toISOString(),
    studentCount: 0,
    isActive: true,
  };

  await setDoc(classroomRef, {
    ...classroom,
    createdAt: serverTimestamp(),
  });

  return classroom;
}

// Get classroom by ID
export async function getClassroom(classroomId: string): Promise<Classroom | null> {
  const classroomDoc = await getDoc(doc(db, 'classrooms', classroomId));

  if (!classroomDoc.exists()) {
    return null;
  }

  const data = classroomDoc.data();
  return {
    ...data,
    id: classroomDoc.id,
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : data.createdAt,
  } as Classroom;
}

// Get classroom by join code
export async function getClassroomByJoinCode(joinCode: string): Promise<Classroom | null> {
  const q = query(
    collection(db, 'classrooms'),
    where('joinCode', '==', joinCode.toUpperCase()),
    where('isActive', '==', true)
  );

  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    return null;
  }

  const doc = snapshot.docs[0];
  const data = doc.data();
  return {
    ...data,
    id: doc.id,
    createdAt: data.createdAt instanceof Timestamp
      ? data.createdAt.toDate().toISOString()
      : data.createdAt,
  } as Classroom;
}

// Get all classrooms for a teacher
export async function getTeacherClassrooms(teacherId: string): Promise<Classroom[]> {
  const q = query(
    collection(db, 'classrooms'),
    where('teacherId', '==', teacherId)
  );

  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      id: doc.id,
      createdAt: data.createdAt instanceof Timestamp
        ? data.createdAt.toDate().toISOString()
        : data.createdAt,
    } as Classroom;
  });
}

// Join a classroom as a student
export async function joinClassroom(
  studentId: string,
  displayName: string,
  joinCode: string,
  avatarUrl?: string
): Promise<Classroom> {
  const classroom = await getClassroomByJoinCode(joinCode);

  if (!classroom) {
    throw new Error('Invalid join code. Please check and try again.');
  }

  // Check if student is already in the classroom
  const existingStudent = await getDoc(
    doc(db, 'classrooms', classroom.id, 'students', studentId)
  );

  if (existingStudent.exists()) {
    throw new Error('You have already joined this classroom.');
  }

  // Add student to classroom
  const student: ClassroomStudent = {
    userId: studentId,
    displayName,
    avatarUrl,
    joinedAt: new Date().toISOString(),
    level: 1,
    xp: 0,
    currentStreak: 0,
    lessonsCompleted: 0,
  };

  await setDoc(
    doc(db, 'classrooms', classroom.id, 'students', studentId),
    {
      ...student,
      joinedAt: serverTimestamp(),
    }
  );

  // Increment student count
  await updateDoc(doc(db, 'classrooms', classroom.id), {
    studentCount: increment(1),
  });

  return classroom;
}

// Get all students in a classroom
export async function getClassroomStudents(
  classroomId: string
): Promise<ClassroomStudent[]> {
  const studentsRef = collection(db, 'classrooms', classroomId, 'students');
  const snapshot = await getDocs(studentsRef);

  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      ...data,
      userId: doc.id,
      joinedAt: data.joinedAt instanceof Timestamp
        ? data.joinedAt.toDate().toISOString()
        : data.joinedAt,
      lastActivityAt: data.lastActivityAt instanceof Timestamp
        ? data.lastActivityAt.toDate().toISOString()
        : data.lastActivityAt,
    } as ClassroomStudent;
  });
}

// Get classrooms a student has joined
export async function getStudentClassrooms(studentId: string): Promise<Classroom[]> {
  // This requires a collection group query or denormalized data
  // For simplicity, we'll store joined classrooms in user document
  const userDoc = await getDoc(doc(db, 'users', studentId));

  if (!userDoc.exists()) {
    return [];
  }

  const joinedClassrooms = userDoc.data().joinedClassrooms || [];
  const classrooms: Classroom[] = [];

  for (const classroomId of joinedClassrooms) {
    const classroom = await getClassroom(classroomId);
    if (classroom) {
      classrooms.push(classroom);
    }
  }

  return classrooms;
}

// Update student progress in classroom (called when student completes activities)
export async function updateStudentProgress(
  classroomId: string,
  studentId: string,
  progress: Partial<ClassroomStudent>
): Promise<void> {
  await updateDoc(
    doc(db, 'classrooms', classroomId, 'students', studentId),
    {
      ...progress,
      lastActivityAt: serverTimestamp(),
    }
  );
}

// Remove a student from a classroom
export async function removeStudent(
  classroomId: string,
  studentId: string
): Promise<void> {
  await deleteDoc(doc(db, 'classrooms', classroomId, 'students', studentId));

  // Decrement student count
  await updateDoc(doc(db, 'classrooms', classroomId), {
    studentCount: increment(-1),
  });
}

// Update classroom details
export async function updateClassroom(
  classroomId: string,
  updates: Partial<Pick<Classroom, 'name' | 'description' | 'isActive'>>
): Promise<void> {
  await updateDoc(doc(db, 'classrooms', classroomId), updates);
}

// Regenerate join code
export async function regenerateJoinCode(classroomId: string): Promise<string> {
  const newCode = generateJoinCode();
  await updateDoc(doc(db, 'classrooms', classroomId), {
    joinCode: newCode,
  });
  return newCode;
}

// Delete a classroom (soft delete by setting isActive to false)
export async function deleteClassroom(classroomId: string): Promise<void> {
  await updateDoc(doc(db, 'classrooms', classroomId), {
    isActive: false,
  });
}

// Get detailed student progress (for teacher view)
export async function getStudentProgress(
  studentId: string
): Promise<StudentProgressSummary | null> {
  // Get user data
  const userDoc = await getDoc(doc(db, 'users', studentId));
  if (!userDoc.exists()) {
    return null;
  }

  // Get game state data
  const gameStateDoc = await getDoc(doc(db, 'gameStates', studentId));
  const gameState = gameStateDoc.exists() ? gameStateDoc.data() : {};

  const userData = userDoc.data();

  return {
    userId: studentId,
    displayName: userData.displayName || 'Student',
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
