import type { TaskItem, TaskStatus } from '@type/task';

import { create } from 'zustand';

interface TaskState {
  taskList: TaskItem[];
  isLoading: boolean;
  error: string | null;

  setTaskList: (taskList: TaskItem[]) => void;
  addTask: (task: TaskItem) => void;
  updateTask: (taskId: string, updates: Partial<TaskItem>) => void;
  removeTask: (taskId: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useTaskListStore = create<TaskState>((set) => ({
  taskList: [],
  isLoading: false,
  error: null,

  // 전체 목록
  setTaskList: (taskList) => set({ taskList, isLoading: false, error: null }),

  // 새 태스크 추가
  addTask: (task) =>
    set((state) => ({
      taskList: [task, ...state.taskList],
    })),

  // 태스크 수정
  updateTask: (taskId, updates) =>
    set((state) => ({
      taskList: state.taskList.map((task) =>
        task.id === taskId ? { ...task, ...updates, updatedAt: Date.now() } : task
      ),
    })),

  // 태스크 삭제
  removeTask: (taskId) =>
    set((state) => ({
      taskList: state.taskList.filter((task) => task.id !== taskId),
    })),

  // 로딩 상태
  setLoading: (isLoading) => set({ isLoading }),

  // 에러 상태
  setError: (error) => set({ error, isLoading: false }),

  // 리셋
  reset: () => set({ taskList: [], isLoading: false, error: null }),
}));

// Selector 함수
export const selectTaskList = (state: TaskState) => state.taskList;
export const selectIsLoading = (state: TaskState) => state.isLoading;
export const selectError = (state: TaskState) => state.error;
export const selectTasksByStatus = (status: TaskStatus) => (state: TaskState) =>
  state.taskList.filter((task) => task.status === status);
