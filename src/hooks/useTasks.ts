import { useCallback, useEffect } from 'react';
import { useTaskListStore } from '@store/taskSlice';
import { useUserStore } from '@store/userSlice';
import {
  getTasks,
  saveTask,
  updateTask as updateTaskApi,
  deleteTask as deleteTaskApi,
  type CreateTodoInput,
} from '@lib/taskService';
import type { TaskItem, TaskStatus } from '@type/task';

export function useTasks() {
  const user = useUserStore((state) => state.user);

  // 스토어 상태
  const taskList = useTaskListStore((state) => state.taskList);
  const isLoading = useTaskListStore((state) => state.isLoading);
  const error = useTaskListStore((state) => state.error);

  // 스토어 액션
  const setTaskList = useTaskListStore((state) => state.setTaskList);
  const updateTaskInStore = useTaskListStore((state) => state.updateTask);
  const removeTask = useTaskListStore((state) => state.removeTask);
  const setLoading = useTaskListStore((state) => state.setLoading);
  const setError = useTaskListStore((state) => state.setError);
  const reset = useTaskListStore((state) => state.reset);

  // 태스크 목록 조회
  const fetchTasks = useCallback(async () => {
    if (!user?.uid) {
      reset();
      return;
    }

    setLoading(true);
    try {
      const tasks = await getTasks(user.uid);
      setTaskList(tasks);
    } catch (err) {
      setError(err instanceof Error ? err.message : '태스크를 불러오는데 실패했습니다.');
    }
  }, [user?.uid, setTaskList, setLoading, setError, reset]);

  // 태스크 생성
  const createTask = useCallback(
    async (taskData: CreateTodoInput) => {
      if (!user?.uid) {
        return { success: false, error: '로그인이 필요합니다.' };
      }

      const result = await saveTask(user.uid, taskData);

      if (result.success && result.id) {
        await fetchTasks();
      }

      return result;
    },
    [user?.uid, fetchTasks]
  );

  // 태스크 수정
  const editTask = useCallback(
    async (taskId: string, taskData: Partial<CreateTodoInput>) => {
      if (!user?.uid) {
        return { success: false, error: '로그인이 필요합니다.' };
      }

      updateTaskInStore(taskId, taskData as Partial<TaskItem>);

      const result = await updateTaskApi(user.uid, taskId, taskData);

      if (!result.success) {
        await fetchTasks();
      }

      return result;
    },
    [user?.uid, updateTaskInStore, fetchTasks]
  );

  // 태스크 삭제
  const deleteTask = useCallback(
    async (taskId: string) => {
      if (!user?.uid) {
        return { success: false, error: '로그인이 필요합니다.' };
      }

      removeTask(taskId);

      const result = await deleteTaskApi(user.uid, taskId);

      if (!result.success) {
        await fetchTasks();
      }

      return result;
    },
    [user?.uid, removeTask, fetchTasks]
  );

  // 상태별 태스크 필터링
  const getTasksByStatus = useCallback(
    (status: TaskStatus) => {
      return taskList.filter((task) => task.status === status);
    },
    [taskList]
  );

  // 검색 필터링
  const searchTasks = useCallback(
    (query: string) => {
      if (!query.trim()) return taskList;
      const lowerQuery = query.toLowerCase();
      return taskList.filter(
        (task) =>
          task.title.toLowerCase().includes(lowerQuery) ||
          task.description.toLowerCase().includes(lowerQuery)
      );
    },
    [taskList]
  );

  // 초기 데이터 로드
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  return {
    taskList,
    isLoading,
    error,
    isLoggedIn: !!user,

    fetchTasks,
    createTask,
    editTask,
    deleteTask,

    getTasksByStatus,
    searchTasks,
  };
}

export function useTasksByStatus(status: TaskStatus) {
  const taskList = useTaskListStore((state) => state.taskList);
  return taskList.filter((task) => task.status === status);
}
