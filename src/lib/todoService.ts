import type { Priority, TodoStatus } from '@type/todo';
import { Timestamp, addDoc, collection } from 'firebase/firestore';

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
  status?: TodoStatus;
}

export interface SaveTodoResult {
  success: boolean;
  id?: string;
  error?: string;
}

export async function saveTodo(
  userId: string,
  todoData: CreateTodoInput
): Promise<SaveTodoResult> {
  console.log("DB 객체 상태:", db);
  try {
    if (!userId) {
      return { success: false, error: '사용자 ID가 필요합니다.' };
    }

    if (!todoData.title.trim()) {
      return { success: false, error: '제목을 입력해주세요.' };
    }
    const now = Date.now();

    const todoDoc = {
      userId,
      title: todoData.title.trim(),
      description: todoData.description.trim(),
      priority: todoData.priority,
      category: todoData.category,
      startDate: todoData.startDate ? Timestamp.fromDate(todoData.startDate) : null,
      endDate: todoData.endDate ? Timestamp.fromDate(todoData.endDate) : null,
      startTime: todoData.startTime,
      endTime: todoData.endTime,
      status: todoData.status || 'todo',
      createdAt: now,
      updatedAt: now,
    };

    const tasksRef = collection(db, 'todoList', userId, 'tasks');
    const docRef = await addDoc(tasksRef, todoDoc);
    toast.success('새 task가 등록되었습니다.');
    return { success: true, id: docRef.id };
  } catch (error) {
    toast.error('task 등록에 실패했습니다. 다시 시도해주세요.');
    console.error('Todo 저장 오류:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.',
    };
  }
}

