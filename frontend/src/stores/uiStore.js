import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export const useUIStore = create(
  immer((set) => ({
    sidebarCollapsed: false,
    activeModals: {},
    toasts: [],
    searchQuery: '',

    toggleSidebar: () => {
      set((state) => {
        state.sidebarCollapsed = !state.sidebarCollapsed;
      });
    },

    setSearchQuery: (query) => {
      set((state) => {
        state.searchQuery = query;
      });
    },

    openModal: (modalName, payload = null) => {
      set((state) => {
        state.activeModals[modalName] = payload || true;
      });
    },

    closeModal: (modalName) => {
      set((state) => {
        delete state.activeModals[modalName];
      });
    },

    addToast: ({ title, message, type = 'info', duration = 4000 }) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      set((state) => {
        state.toasts.push({ id, title, message, type });
      });

      if (duration > 0) {
        setTimeout(() => {
          set((state) => {
            state.toasts = state.toasts.filter((t) => t.id !== id);
          });
        }, duration);
      }
    },

    removeToast: (id) => {
      set((state) => {
        state.toasts = state.toasts.filter((t) => t.id !== id);
      });
    },
  }))
);

export default useUIStore;
