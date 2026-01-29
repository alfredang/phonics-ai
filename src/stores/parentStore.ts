import { create } from 'zustand';
import {
  ParentLink,
  StudentProgressSummary,
  ChildProgressReport,
} from '@/types/classroom';
import * as parentLinkService from '@/lib/firebase/parentLinks';

interface ParentStore {
  // State
  children: ParentLink[];
  selectedChild: StudentProgressSummary | null;
  selectedChildReport: ChildProgressReport | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setChildren: (children: ParentLink[]) => void;
  setSelectedChild: (child: StudentProgressSummary | null) => void;
  setSelectedChildReport: (report: ChildProgressReport | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Operations
  fetchChildren: (parentId: string) => Promise<void>;
  linkChild: (
    parentId: string,
    parentDisplayName: string,
    linkCode: string
  ) => Promise<ParentLink>;
  selectChild: (childId: string) => Promise<void>;
  getChildProgress: (childId: string) => Promise<StudentProgressSummary | null>;
  getChildProgressReport: (childId: string) => Promise<ChildProgressReport | null>;
  removeChild: (linkId: string, parentId: string) => Promise<void>;
}

export const useParentStore = create<ParentStore>((set) => ({
  // Initial state
  children: [],
  selectedChild: null,
  selectedChildReport: null,
  isLoading: false,
  error: null,

  // Setters
  setChildren: (children) => set({ children }),
  setSelectedChild: (child) => set({ selectedChild: child }),
  setSelectedChildReport: (report) => set({ selectedChildReport: report }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error, isLoading: false }),
  clearError: () => set({ error: null }),

  // Fetch all linked children for a parent
  fetchChildren: async (parentId) => {
    set({ isLoading: true, error: null });
    try {
      const children = await parentLinkService.getParentChildren(parentId);
      set({ children, isLoading: false });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch children';
      set({ error: message, isLoading: false });
    }
  },

  // Link a new child using a link code
  linkChild: async (parentId, parentDisplayName, linkCode) => {
    set({ isLoading: true, error: null });
    try {
      const link = await parentLinkService.createLinkRequest(
        parentId,
        parentDisplayName,
        linkCode
      );
      // Note: Link is pending until child approves, so we don't add to children list yet
      set({ isLoading: false });
      return link;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to link child';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  // Select a child and load their progress
  selectChild: async (childId) => {
    set({ isLoading: true, error: null });
    try {
      const progress = await parentLinkService.getChildProgress(childId);
      set({ selectedChild: progress, isLoading: false });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to load child progress';
      set({ error: message, isLoading: false });
    }
  },

  // Get child progress
  getChildProgress: async (childId) => {
    set({ isLoading: true, error: null });
    try {
      const progress = await parentLinkService.getChildProgress(childId);
      set({ selectedChild: progress, isLoading: false });
      return progress;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch child progress';
      set({ error: message, isLoading: false });
      return null;
    }
  },

  // Get detailed progress report
  getChildProgressReport: async (childId) => {
    set({ isLoading: true, error: null });
    try {
      const report = await parentLinkService.getChildProgressReport(childId);
      set({ selectedChildReport: report, isLoading: false });
      return report;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch progress report';
      set({ error: message, isLoading: false });
      return null;
    }
  },

  // Remove a child link
  removeChild: async (linkId, parentId) => {
    set({ isLoading: true, error: null });
    try {
      await parentLinkService.removeParentLink(linkId, parentId);
      set((state) => ({
        children: state.children.filter((c) => c.id !== linkId),
        selectedChild:
          state.selectedChild?.userId ===
          state.children.find((c) => c.id === linkId)?.childId
            ? null
            : state.selectedChild,
        selectedChildReport:
          state.selectedChildReport?.child.userId ===
          state.children.find((c) => c.id === linkId)?.childId
            ? null
            : state.selectedChildReport,
        isLoading: false,
      }));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to remove child';
      set({ error: message, isLoading: false });
      throw error;
    }
  },
}));

// Store for learner to manage parent links
interface LearnerParentStore {
  pendingLinks: ParentLink[];
  activeLinks: ParentLink[];
  linkCode: string | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;

  // Operations
  generateLinkCode: (childId: string, displayName: string) => Promise<string>;
  fetchPendingLinks: (childId: string) => Promise<void>;
  fetchActiveLinks: (childId: string) => Promise<void>;
  approveLink: (linkId: string, childId: string) => Promise<void>;
  rejectLink: (linkId: string, childId: string) => Promise<void>;
}

export const useLearnerParentStore = create<LearnerParentStore>((set) => ({
  // Initial state
  pendingLinks: [],
  activeLinks: [],
  linkCode: null,
  isLoading: false,
  error: null,

  // Setters
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error, isLoading: false }),
  clearError: () => set({ error: null }),

  // Generate a link code for parent to use
  generateLinkCode: async (childId, displayName) => {
    set({ isLoading: true, error: null });
    try {
      const code = await parentLinkService.generateChildLinkCode(childId, displayName);
      set({ linkCode: code, isLoading: false });
      return code;
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to generate link code';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  // Fetch pending parent link requests
  fetchPendingLinks: async (childId) => {
    set({ isLoading: true, error: null });
    try {
      const links = await parentLinkService.getPendingLinksForChild(childId);
      set({ pendingLinks: links, isLoading: false });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch pending links';
      set({ error: message, isLoading: false });
    }
  },

  // Fetch active parent links
  fetchActiveLinks: async (childId) => {
    set({ isLoading: true, error: null });
    try {
      const links = await parentLinkService.getChildParents(childId);
      set({ activeLinks: links, isLoading: false });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to fetch parent links';
      set({ error: message, isLoading: false });
    }
  },

  // Approve a pending link
  approveLink: async (linkId, childId) => {
    set({ isLoading: true, error: null });
    try {
      await parentLinkService.approveParentLink(linkId, childId);
      set((state) => {
        const approvedLink = state.pendingLinks.find((l) => l.id === linkId);
        return {
          pendingLinks: state.pendingLinks.filter((l) => l.id !== linkId),
          activeLinks: approvedLink
            ? [...state.activeLinks, { ...approvedLink, status: 'active' as const }]
            : state.activeLinks,
          isLoading: false,
        };
      });
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to approve link';
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  // Reject/remove a link
  rejectLink: async (linkId, childId) => {
    set({ isLoading: true, error: null });
    try {
      await parentLinkService.rejectParentLink(linkId, childId);
      set((state) => ({
        pendingLinks: state.pendingLinks.filter((l) => l.id !== linkId),
        activeLinks: state.activeLinks.filter((l) => l.id !== linkId),
        isLoading: false,
      }));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Failed to remove link';
      set({ error: message, isLoading: false });
      throw error;
    }
  },
}));
