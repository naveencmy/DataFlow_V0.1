import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export const useEmployeeStore = create(
  immer((set) => ({
    viewMode: 'grid', // 'grid' | 'table'
    selectedDepartment: 'All',
    selectedEmployeeId: null,

    setViewMode: (mode) => {
      set((state) => {
        state.viewMode = mode;
      });
    },

    setSelectedDepartment: (dept) => {
      set((state) => {
        state.selectedDepartment = dept;
      });
    },

    setSelectedEmployeeId: (id) => {
      set((state) => {
        state.selectedEmployeeId = id;
      });
    },
  }))
);

export default useEmployeeStore;
