export type Priority = 'low' | 'medium' | 'high';
export type TaskStatus = 'todo' | 'in-progress' | 'done';

export interface TaskItem {
  id: string;
  userId: string;
  title: string;
  description: string;
  priority: Priority;
  category: string;
  startDate: Date | null | undefined;
  endDate: Date | null | undefined;
  startTime: string;
  endTime: string;
  status: TaskStatus;
  createdAt: number;
  updatedAt: number;
}
