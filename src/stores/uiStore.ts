import { create } from 'zustand';

// Modal types
export type ModalType =
  | 'achievement'
  | 'levelUp'
  | 'lessonComplete'
  | 'confirmation'
  | 'settings'
  | 'profile'
  | 'hint'
  | 'pause'
  | 'quit';

// Toast types
export interface Toast {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning' | 'xp';
  message: string;
  duration?: number;
  xpAmount?: number;
}

interface UIStore {
  // Modal state
  activeModal: ModalType | null;
  modalData: unknown;

  // Toast notifications
  toasts: Toast[];

  // Loading states
  globalLoading: boolean;
  loadingMessage: string;

  // Sidebar state (desktop)
  sidebarCollapsed: boolean;

  // Sound effects toggle (quick access)
  soundMuted: boolean;

  // Actions
  openModal: (type: ModalType, data?: unknown) => void;
  closeModal: () => void;

  showToast: (toast: Omit<Toast, 'id'>) => void;
  dismissToast: (id: string) => void;
  clearAllToasts: () => void;

  setGlobalLoading: (loading: boolean, message?: string) => void;

  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;

  toggleSound: () => void;
  setSound: (muted: boolean) => void;
}

// Generate unique IDs for toasts
let toastIdCounter = 0;
const generateToastId = () => `toast-${++toastIdCounter}-${Date.now()}`;

export const useUIStore = create<UIStore>()((set, get) => ({
  // Initial state
  activeModal: null,
  modalData: null,
  toasts: [],
  globalLoading: false,
  loadingMessage: '',
  sidebarCollapsed: false,
  soundMuted: false,

  // Modal actions
  openModal: (type, data = null) => {
    set({ activeModal: type, modalData: data });
  },

  closeModal: () => {
    set({ activeModal: null, modalData: null });
  },

  // Toast actions
  showToast: (toast) => {
    const id = generateToastId();
    const newToast: Toast = {
      id,
      duration: 4000, // Default 4 seconds
      ...toast,
    };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    // Auto-dismiss after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        get().dismissToast(id);
      }, newToast.duration);
    }
  },

  dismissToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  clearAllToasts: () => {
    set({ toasts: [] });
  },

  // Loading actions
  setGlobalLoading: (loading, message = '') => {
    set({ globalLoading: loading, loadingMessage: message });
  },

  // Sidebar actions
  toggleSidebar: () => {
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
  },

  setSidebarCollapsed: (collapsed) => {
    set({ sidebarCollapsed: collapsed });
  },

  // Sound actions
  toggleSound: () => {
    set((state) => ({ soundMuted: !state.soundMuted }));
  },

  setSound: (muted) => {
    set({ soundMuted: muted });
  },
}));

// Helper functions for common toast patterns
export const showSuccessToast = (message: string) => {
  useUIStore.getState().showToast({ type: 'success', message });
};

export const showErrorToast = (message: string) => {
  useUIStore.getState().showToast({ type: 'error', message, duration: 6000 });
};

export const showXPToast = (amount: number) => {
  useUIStore.getState().showToast({
    type: 'xp',
    message: `+${amount} XP`,
    xpAmount: amount,
    duration: 3000,
  });
};
