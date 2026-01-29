import { create } from 'zustand';
import {
  Classroom,
  ClassroomStudent,
  CreateClassroomInput,
  StudentProgressSummary,
} from '@/types/classroom';
import * as classroomService from '@/lib/firebase/classrooms';

interface TeacherStore {
  // State
  classrooms: Classroom[];
  selectedClassroom: Classroom | null;
  students: ClassroomStudent[];
  selectedStudent: StudentProgressSummary | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setClassrooms: (classrooms: Classroom[]) => void;
  setSelectedClassroom: (classroom: Classroom | null) => void;
  setStudents: (students: ClassroomStudent[]) => void;
  setSelectedStudent: (student: StudentProgressSummary | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Operations
  fetchClassrooms: (teacherId: string) => Promise<void>;
  createClassroom: (
    teacherId: string,
    teacherName: string,
    input: CreateClassroomInput
  ) => Promise<Classroom>;
  selectClassroom: (classroomId: string) => Promise<void>;
  fetchStudents: (classroomId: string) => Promise<void>;
  getStudentProgress: (studentId: string) => Promise<StudentProgressSummary | null>;
  updateClassroom: (
    classroomId: string,
    updates: Partial<Pick<Classroom, 'name' | 'description' | 'isActive'>>
  ) => Promise<void>;
  regenerateJoinCode: (classroomId: string) => Promise<string>;
  removeStudent: (classroomId: string, studentId: string) => Promise<void>;
  deleteClassroom: (classroomId: string) => Promise<void>;
}

export const useTeacherStore = create<TeacherStore>((set, get) => ({
  // Initial state
  classrooms: [],
  selectedClassroom: null,
  students: [],
  selectedStudent: null,
  isLoading: false,
  error: null,

  // Setters
  setClassrooms: (classrooms) => set({ classrooms }),
  setSelectedClassroom: (classroom) => set({ selectedClassroom: classroom }),
  setStudents: (students) => set({ students }),
  setSelectedStudent: (student) => set({ selectedStudent: student }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error, isLoading: false }),
  clearError: () => set({ error: null }),

  // Fetch all classrooms for a teacher
  fetchClassrooms: async (teacherId) => {
    set({ isLoading: true, error: null });
    try {
      const classrooms = await classroomService.getTeacherClassrooms(teacherId);
      set({ classrooms, isLoading: false });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch classrooms';
      set({ error: message, isLoading: false });
    }
  },

  // Create a new classroom
  createClassroom: async (teacherId, teacherName, input) => {
    set({ isLoading: true, error: null });
    try {
      const classroom = await classroomService.createClassroom(
        teacherId,
        teacherName,
        input
      );
      set((state) => ({
        classrooms: [...state.classrooms, classroom],
        isLoading: false,
      }));
      return classroom;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to create classroom';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  // Select a classroom and load its details
  selectClassroom: async (classroomId) => {
    set({ isLoading: true, error: null });
    try {
      const classroom = await classroomService.getClassroom(classroomId);
      if (classroom) {
        set({ selectedClassroom: classroom });
        await get().fetchStudents(classroomId);
      } else {
        set({ error: 'Classroom not found', isLoading: false });
      }
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to load classroom';
      set({ error: message, isLoading: false });
    }
  },

  // Fetch students in a classroom
  fetchStudents: async (classroomId) => {
    set({ isLoading: true, error: null });
    try {
      const students = await classroomService.getClassroomStudents(classroomId);
      set({ students, isLoading: false });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch students';
      set({ error: message, isLoading: false });
    }
  },

  // Get detailed progress for a student
  getStudentProgress: async (studentId) => {
    set({ isLoading: true, error: null });
    try {
      const progress = await classroomService.getStudentProgress(studentId);
      set({ selectedStudent: progress, isLoading: false });
      return progress;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch student progress';
      set({ error: message, isLoading: false });
      return null;
    }
  },

  // Update classroom details
  updateClassroom: async (classroomId, updates) => {
    set({ isLoading: true, error: null });
    try {
      await classroomService.updateClassroom(classroomId, updates);
      set((state) => ({
        classrooms: state.classrooms.map((c) =>
          c.id === classroomId ? { ...c, ...updates } : c
        ),
        selectedClassroom:
          state.selectedClassroom?.id === classroomId
            ? { ...state.selectedClassroom, ...updates }
            : state.selectedClassroom,
        isLoading: false,
      }));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to update classroom';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  // Regenerate join code
  regenerateJoinCode: async (classroomId) => {
    set({ isLoading: true, error: null });
    try {
      const newCode = await classroomService.regenerateJoinCode(classroomId);
      set((state) => ({
        classrooms: state.classrooms.map((c) =>
          c.id === classroomId ? { ...c, joinCode: newCode } : c
        ),
        selectedClassroom:
          state.selectedClassroom?.id === classroomId
            ? { ...state.selectedClassroom, joinCode: newCode }
            : state.selectedClassroom,
        isLoading: false,
      }));
      return newCode;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to regenerate join code';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  // Remove a student from a classroom
  removeStudent: async (classroomId, studentId) => {
    set({ isLoading: true, error: null });
    try {
      await classroomService.removeStudent(classroomId, studentId);
      set((state) => ({
        students: state.students.filter((s) => s.userId !== studentId),
        classrooms: state.classrooms.map((c) =>
          c.id === classroomId ? { ...c, studentCount: c.studentCount - 1 } : c
        ),
        selectedClassroom:
          state.selectedClassroom?.id === classroomId
            ? {
                ...state.selectedClassroom,
                studentCount: state.selectedClassroom.studentCount - 1,
              }
            : state.selectedClassroom,
        isLoading: false,
      }));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to remove student';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  // Delete a classroom (soft delete)
  deleteClassroom: async (classroomId) => {
    set({ isLoading: true, error: null });
    try {
      await classroomService.deleteClassroom(classroomId);
      set((state) => ({
        classrooms: state.classrooms.filter((c) => c.id !== classroomId),
        selectedClassroom:
          state.selectedClassroom?.id === classroomId ? null : state.selectedClassroom,
        students: state.selectedClassroom?.id === classroomId ? [] : state.students,
        isLoading: false,
      }));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to delete classroom';
      set({ error: message, isLoading: false });
      throw error;
    }
  },
}));
