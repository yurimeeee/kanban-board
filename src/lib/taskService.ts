import type { Priority, TaskItem, TaskStatus } from '@type/task';
import {
  Timestamp,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';

import { db } from '@lib/firebase';
import { toast } from 'sonner';

export interface CreateTodoInput {
  title: string;
  description: string;
  priority: Priority;
  category: string;
  startDate?: Date;
  endDate?: Date;
  startTime: string;
  endTime: string;
  status?: TaskStatus;
}

export interface SaveTaskResult {
  success: boolean;
  id?: string;
  error?: string;
}

// 할 일 목록 조회
export async function getTasks(userId: string): Promise<TaskItem[]> {
  try {
    if (!userId) {
      console.error('userId가 필요합니다.');
      return [];
    }

    const tasksRef = collection(db, 'todoList', userId, 'tasks');
    const q = query(tasksRef, orderBy('createdAt', 'desc'));
    const snapshot = await getDocs(q);

    const tasks: TaskItem[] = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        userId: data.userId,
        title: data.title,
        description: data.description,
        priority: data.priority,
        category: data.category,
        startDate: data.startDate?.toDate() || null,
        endDate: data.endDate?.toDate() || null,
        startTime: data.startTime,
        endTime: data.endTime,
        status: data.status,
        createdAt: data.createdAt,
        updatedAt: data.updatedAt,
      };
    });

    return tasks;
  } catch (error) {
    return [];
  }
}

// 할 일 저장
export async function saveTask(
  userId: string,
  taskData: CreateTodoInput
): Promise<SaveTaskResult> {
  try {
    if (!userId) {
      return { success: false, error: '사용자 ID가 필요합니다.' };
    }

    if (!taskData.title.trim()) {
      return { success: false, error: '제목을 입력해주세요.' };
    }

    const now = Date.now();

    const dataDoc = {
      userId,
      title: taskData.title.trim(),
      description: taskData.description.trim(),
      priority: taskData.priority,
      category: taskData.category,
      startDate: taskData.startDate ? Timestamp.fromDate(taskData.startDate) : null,
      endDate: taskData.endDate ? Timestamp.fromDate(taskData.endDate) : null,
      startTime: taskData.startTime,
      endTime: taskData.endTime,
      status: taskData.status || 'todo',
      createdAt: now,
      updatedAt: now,
    };

    const tasksRef = collection(db, 'todoList', userId, 'tasks');
    const docRef = await addDoc(tasksRef, dataDoc);
    toast.success('새 task가 등록되었습니다.');
    return { success: true, id: docRef.id };
  } catch (error) {
    toast.error('task 등록에 실패했습니다. 다시 시도해주세요.');
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
    };
  }
}

// 할 일 수정
export async function updateTask(
  userId: string,
  taskId: string,
  taskData: Partial<CreateTodoInput>
): Promise<SaveTaskResult> {
  try {
    if (!userId || !taskId) {
      return { success: false, error: '사용자 ID와 task ID가 필요합니다.' };
    }

    const taskRef = doc(db, 'todoList', userId, 'tasks', taskId);

    const updateData: Record<string, unknown> = {
      updatedAt: Date.now(),
    };

    if (taskData.title !== undefined) updateData.title = taskData.title.trim();
    if (taskData.description !== undefined) updateData.description = taskData.description.trim();
    if (taskData.priority !== undefined) updateData.priority = taskData.priority;
    if (taskData.category !== undefined) updateData.category = taskData.category;
    if (taskData.startDate !== undefined) {
      updateData.startDate = taskData.startDate ? Timestamp.fromDate(taskData.startDate) : null;
    }
    if (taskData.endDate !== undefined) {
      updateData.endDate = taskData.endDate ? Timestamp.fromDate(taskData.endDate) : null;
    }
    if (taskData.startTime !== undefined) updateData.startTime = taskData.startTime;
    if (taskData.endTime !== undefined) updateData.endTime = taskData.endTime;
    if (taskData.status !== undefined) updateData.status = taskData.status;

    await updateDoc(taskRef, updateData);
    toast.success('task가 수정되었습니다.');
    return { success: true, id: taskId };
  } catch (error) {
    toast.error('task 수정에 실패했습니다. 다시 시도해주세요.');
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
    };
  }
}

// 할 일 삭제
export async function deleteTask(userId: string, taskId: string): Promise<SaveTaskResult> {
  try {
    if (!userId || !taskId) {
      return { success: false, error: '사용자 ID와 task ID가 필요합니다.' };
    }

    const taskRef = doc(db, 'todoList', userId, 'tasks', taskId);
    await deleteDoc(taskRef);
    toast.success('task가 삭제되었습니다.');
    return { success: true };
  } catch (error) {
    toast.error('task 삭제에 실패했습니다. 다시 시도해주세요.');
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
    };
  }
}
