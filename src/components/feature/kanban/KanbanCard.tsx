import { Calendar, MessageSquare, MoreHorizontal, Paperclip, Pencil, Trash2 } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@components/ui/dropdown-menu';

import { PRIORITY_CONFIG } from '@type/kanban';
import type { TaskItem } from '@lib/taskService';
import { cn } from '@lib/utils';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface KanbanCardProps {
  task: TaskItem;
  onEdit?: (task: TaskItem) => void;
  onDelete?: (taskId: string) => void;
}

export function KanbanCard({ task, onEdit, onDelete }: KanbanCardProps) {
  const priorityConfig = PRIORITY_CONFIG[task.priority];

  const formattedDate = task.endDate ? format(task.endDate, 'yyyy. M. d.', { locale: ko }) : null;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer">
      {/* 헤더: 우선순위 + 날짜 + 메뉴 */}
      <div className="flex items-center justify-between mb-3">
        <span className={cn('px-2 py-0.5 rounded text-xs font-semibold', priorityConfig.bgColor, priorityConfig.textColor)}>{priorityConfig.label}</span>

        <div className="flex items-center gap-2">
          {formattedDate && (
            <span className="flex items-center text-xs text-gray-400">
              <Calendar className="w-3 h-3 mr-1" />
              {formattedDate}
            </span>
          )}

          {/* Three-dot 메뉴 */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1 hover:bg-gray-100 rounded" onClick={(e) => e.stopPropagation()}>
                <MoreHorizontal className="w-4 h-4 text-gray-500" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(task);
                }}
              >
                <Pencil className="w-4 h-4 mr-2" />
                수정
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="cursor-pointer text-red-600 focus:text-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(task.id);
                }}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                삭제
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* 제목 */}
      <h3 className="font-semibold text-gray-900 mb-1">{task.title}</h3>

      {/* 설명 */}
      <p className="text-sm text-gray-500 mb-3 line-clamp-2">{task.description}</p>

      {/* 카테고리 태그 */}
      {task.category && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded font-medium">{task.category}</span>
        </div>
      )}

      {/* 푸터: 시간 정보 */}
      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <span className="text-xs text-gray-400">
          {task.startTime} - {task.endTime}
        </span>
      </div>
    </div>
  );
}
