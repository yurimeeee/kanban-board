export type Priority = 'high' | 'medium' | 'low';
export type ColumnStatus = 'todo' | 'in-progress' | 'done';

export interface TaskTag {
  id: string;
  label: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  dueDate?: string;
  tags: TaskTag[];
  status: ColumnStatus;
}

export interface Column {
  id: ColumnStatus;
  title: string;
  color: string;
  tasks: Task[];
}

export const COLUMN_CONFIG: Record<ColumnStatus, { title: string; color: string }> = {
  'todo': { title: 'To Do', color: '#3B82F6' },
  'in-progress': { title: 'In Progress', color: '#F59E0B' },
  'done': { title: 'Done', color: '#22C55E' },
};

export const PRIORITY_CONFIG: Record<Priority, { label: string; bgColor: string; textColor: string }> = {
  'high': { label: 'HIGH', bgColor: 'bg-red-100', textColor: 'text-red-600' },
  'medium': { label: 'MEDIUM', bgColor: 'bg-yellow-100', textColor: 'text-yellow-600' },
  'low': { label: 'LOW', bgColor: 'bg-green-100', textColor: 'text-green-600' },
};
