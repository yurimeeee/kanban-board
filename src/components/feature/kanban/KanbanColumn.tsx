import { MoreHorizontal, Plus } from 'lucide-react';
import { COLUMN_CONFIG, type ColumnStatus } from '@type/kanban';
import type { TaskItem } from '@type/task';
import { KanbanCard } from './KanbanCard';
import { Button } from '@components/ui/button';

interface KanbanColumnProps {
  status: ColumnStatus;
  tasks: TaskItem[];
  onAddTask?: (status: ColumnStatus) => void;
  onEditTask?: (task: TaskItem) => void;
  onDeleteTask?: (taskId: string) => void;
}

export function KanbanColumn({ status, tasks, onAddTask, onEditTask, onDeleteTask }: KanbanColumnProps) {
  const config = COLUMN_CONFIG[status];

  return (
    <div className="flex flex-col bg-gray-50 rounded-xl min-w-[300px] w-[300px]">
      {/* 컬럼 헤더 */}
      <div className="flex items-center justify-between p-4 pb-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: config.color }} />
          <h2 className="font-semibold text-gray-800">{config.title}</h2>
          <span className="ml-1 px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded-full font-medium">{tasks.length}</span>
        </div>
        <button className="p-1 hover:bg-gray-200 rounded">
          <MoreHorizontal className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* 카드 목록 */}
      <div className="flex-1 p-2 space-y-3 overflow-y-auto max-h-[calc(100vh-300px)]">
        {tasks.map((task) => (
          <KanbanCard key={task.id} task={task} onEdit={onEditTask} onDelete={onDeleteTask} />
        ))}
      </div>

      {/* Add a task 버튼 */}
      <div className="p-3 pt-1">
        <Button variant="ghost" className="w-full justify-start text-gray-500 hover:text-gray-700 hover:bg-gray-100" onClick={() => onAddTask?.(status)}>
          <Plus className="w-4 h-4 mr-2" />
          Add a task
        </Button>
      </div>
    </div>
  );
}
