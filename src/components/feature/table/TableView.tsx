import { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import { useTasks } from '@hooks/useTasks';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select';
import { cn } from '@lib/utils';
import { PRIORITY_CONFIG, COLUMN_CONFIG } from '@type/kanban';
import type { TaskItem } from '@type/task';

type SortField = 'title' | 'priority' | 'status' | 'endDate' | 'createdAt';
type SortOrder = 'asc' | 'desc';

interface TableViewProps {
  onEditTask?: (task: TaskItem) => void;
}

const STATUS_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
];

const PRIORITY_OPTIONS = [
  { value: 'all', label: '전체' },
  { value: 'high', label: '높음' },
  { value: 'medium', label: '보통' },
  { value: 'low', label: '낮음' },
];

export function TableView({ onEditTask }: TableViewProps) {
  const { taskList, deleteTask } = useTasks();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortField, setSortField] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // 정렬 토글
  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  // 필터링 및 정렬
  const filteredTasks = useMemo(() => {
    let result = [...taskList];

    // 검색 필터
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (task) =>
          task.title.toLowerCase().includes(query) ||
          task.description.toLowerCase().includes(query)
      );
    }

    // 상태 필터
    if (statusFilter !== 'all') {
      result = result.filter((task) => task.status === statusFilter);
    }

    // 우선순위 필터
    if (priorityFilter !== 'all') {
      result = result.filter((task) => task.priority === priorityFilter);
    }

    // 정렬
    result.sort((a, b) => {
      let comparison = 0;

      switch (sortField) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'priority':
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
          break;
        case 'status':
          const statusOrder = { todo: 1, 'in-progress': 2, done: 3 };
          comparison = statusOrder[a.status] - statusOrder[b.status];
          break;
        case 'endDate':
          const dateA = a.endDate ? new Date(a.endDate).getTime() : 0;
          const dateB = b.endDate ? new Date(b.endDate).getTime() : 0;
          comparison = dateA - dateB;
          break;
        case 'createdAt':
          comparison = a.createdAt - b.createdAt;
          break;
      }

      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return result;
  }, [taskList, searchQuery, statusFilter, priorityFilter, sortField, sortOrder]);

  const handleDelete = async (taskId: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      await deleteTask(taskId);
    }
  };

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => (
    <button
      className="flex items-center gap-1 hover:text-gray-900"
      onClick={() => toggleSort(field)}
    >
      {children}
      <ArrowUpDown className={cn('w-3 h-3', sortField === field && 'text-primary')} />
    </button>
  );

  return (
    <div className="bg-white rounded-lg border">
      {/* 필터 영역 */}
      <div className="p-4 border-b flex flex-wrap gap-4">
        <Input
          placeholder="검색..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-[200px]"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="상태" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="우선순위" />
          </SelectTrigger>
          <SelectContent>
            {PRIORITY_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="ml-auto text-sm text-gray-500">
          총 {filteredTasks.length}개
        </div>
      </div>

      {/* 테이블 */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">
                <SortButton field="title">제목</SortButton>
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500 w-[100px]">
                <SortButton field="status">상태</SortButton>
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500 w-[100px]">
                <SortButton field="priority">우선순위</SortButton>
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500 w-[120px]">
                카테고리
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500 w-[120px]">
                <SortButton field="endDate">마감일</SortButton>
              </th>
              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500 w-[50px]">

              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTasks.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-500">
                  태스크가 없습니다.
                </td>
              </tr>
            ) : (
              filteredTasks.map((task) => {
                const priorityConfig = PRIORITY_CONFIG[task.priority];
                const statusConfig = COLUMN_CONFIG[task.status];

                return (
                  <tr
                    key={task.id}
                    className="border-b hover:bg-gray-50 cursor-pointer"
                    onClick={() => onEditTask?.(task)}
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">{task.title}</div>
                      {task.description && (
                        <div className="text-sm text-gray-500 truncate max-w-[300px]">
                          {task.description}
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: statusConfig.color }}
                        />
                        <span className="text-sm">{statusConfig.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={cn(
                          'px-2 py-0.5 rounded text-xs font-medium',
                          priorityConfig.bgColor,
                          priorityConfig.textColor
                        )}
                      >
                        {priorityConfig.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {task.category || '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {task.endDate
                        ? format(task.endDate, 'yyyy.MM.dd', { locale: ko })
                        : '-'}
                    </td>
                    <td className="px-4 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={(e) => {
                              e.stopPropagation();
                              onEditTask?.(task);
                            }}
                          >
                            <Pencil className="w-4 h-4 mr-2" />
                            수정
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(task.id);
                            }}
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            삭제
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
