export type Priority = 'low' | 'medium' | 'high';
export type TodoStatus = 'todo' | 'in-progress' | 'done';

export interface Todo {
  id: string;
  userId: string;
  title: string;
  description: string;
  priority: Priority;
  category: string;

  // 날짜 및 시간
  startDate: Date | undefined;
  endDate: Date | undefined;
  startTime: string; // "09:00"
  endTime: string;   // "18:00"

  // 메타데이터
  status: TodoStatus;
  createdAt: number;
  updatedAt: number;
}