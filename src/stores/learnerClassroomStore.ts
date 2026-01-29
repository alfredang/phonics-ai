import { create } from 'zustand';
import { Classroom } from '@/types/classroom';
import * as classroomService from '@/lib/firebase/classrooms';

interface LearnerClassroomStore {
  // State
  joinedClassrooms: Classroom[];
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSuccessMessage: (message: string | null) => void;
  clearMessages: () => void;

  // Operations
  fetchJoinedClassrooms: (studentId: string) => Promise<void>;
  joinClassroom: (
    studentId: string,
    displayName: string,
    joinCode: string,
    avatarUrl?: string
  ) => Promise<Classroom>;
}

export const useLearnerClassroomStore = create<LearnerClassroomStore>((set) => ({
  // Initial state
  joinedClassrooms: [],
  isLoading: false,
  error: null,
  successMessage: null,

  // Setters
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error, isLoading: false, successMessage: null }),
  setSuccessMessage: (message) => set({ successMessage: message, error: null }),
  clearMessages: () => set({ error: null, successMessage: null }),

  // Fetch classrooms the learner has joined
  fetchJoinedClassrooms: async (studentId) => {
    set({ isLoading: true, error: null });
    try {
      const classrooms = await classroomService.getStudentClassrooms(studentId);
      set({ joinedClassrooms: classrooms, isLoading: false });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch classrooms';
      set({ error: message, isLoading: false });
    }
  },

  // Join a classroom using a code
  joinClassroom: async (studentId, displayName, joinCode, avatarUrl) => {
    set({ isLoading: true, error: null, successMessage: null });
    try {
      const classroom = await classroomService.joinClassroom(
        studentId,
        displayName,
        joinCode,
        avatarUrl
      );
      set((state) => ({
        joinedClassrooms: [...state.joinedClassrooms, classroom],
        isLoading: false,
        successMessage: `Successfully joined "${classroom.name}"!`,
      }));
      return classroom;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to join classroom';
      set({ error: message, isLoading: false });
      throw error;
    }
  },
}));
