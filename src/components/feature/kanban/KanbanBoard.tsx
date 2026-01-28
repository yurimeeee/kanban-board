import { useCallback, useEffect, useState } from 'react';
import { Filter, Plus, Search, Settings } from 'lucide-react';
import type { ColumnStatus } from '@type/kanban';
import type { TaskStatus } from '@type/task';
import { getTasks, deleteTask, type TaskItem } from '@lib/taskService';
import { useUserStore } from '@store/userSlice';
import { KanbanColumn } from './KanbanColumn';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { TaskCreateModal } from '@components/feature/task/TaskCreateModal';

const COLUMN_STATUSES: ColumnStatus[] = ['todo', 'in-progress', 'done'];

function mapTaskStatusToColumn(status: TaskStatus): ColumnStatus {
  if (status === 'todo') return 'todo';
  if (status === 'in-progress') return 'in-progress';
  if (status === 'done') return 'done';
  return 'todo';
}

export function KanbanBoard() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<TaskItem | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>('todo');
  const [isLoading, setIsLoading] = useState(true);

  const user = useUserStore((state) => state.user);

  // 데이터 불러오기
  const fetchTasks = useCallback(async () => {
    if (!user?.uid) {
      setTasks([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const tasks = await getTasks(user.uid);
      setTasks(tasks);
    } catch (error) {
      console.error('태스크 불러오기 실패:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user?.uid]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // 컬럼별로 태스크 필터링
  const getTasksByStatus = (status: ColumnStatus): TaskItem[] => {
    return tasks.filter((task) => {
      const taskColumn = mapTaskStatusToColumn(task.status);
      const matchesStatus = taskColumn === status;
      const matchesSearch = searchQuery ? task.title.toLowerCase().includes(searchQuery.toLowerCase()) || task.description.toLowerCase().includes(searchQuery.toLowerCase()) : true;
      return matchesStatus && matchesSearch;
    });
  };

  // 태스크 추가
  const handleAddTask = (status: ColumnStatus) => {
    setEditTask(null);
    // ColumnStatus를 TaskStatus로 변환
    // const taskStatus: TaskStatus = status === 'review' ? 'in-progress' : (status as TaskStatus);
    const taskStatus: TaskStatus = status as TaskStatus;
    setDefaultStatus(taskStatus);
    setIsModalOpen(true);
  };

  // 태스크 수정
  const handleEditTask = (task: TaskItem) => {
    setEditTask(task);
    setIsModalOpen(true);
  };

  // 태스크 삭제
  const handleDeleteTask = async (taskId: string) => {
    if (!user?.uid) return;

    if (confirm('정말 삭제하시겠습니까?')) {
      const result = await deleteTask(user.uid, taskId);
      if (result.success) {
        fetchTasks();
      }
    }
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditTask(null);
  };

  // 저장 성공 후
  const handleSuccess = () => {
    fetchTasks();
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white p-6 flex items-center justify-center">
        <p className="text-gray-500">로그인이 필요합니다.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white p-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Project Board</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your tasks and workflow</p>
        </div>

        <div className="flex items-center gap-3">
          {/* 검색 */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 w-[200px] bg-gray-50 border-gray-200"
            />
          </div>

          {/* Filter 버튼 */}
          <Button variant="outline" className="gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>

          {/* Settings 버튼 */}
          <Button variant="outline" className="gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </Button>

          {/* Add Task 버튼 */}
          <Button className="gap-2" onClick={() => handleAddTask('todo')}>
            <Plus className="w-4 h-4" />
            Add Task
          </Button>
        </div>
      </div>

      {/* 로딩 상태 */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-500">불러오는 중...</p>
        </div>
      ) : (
        /* 칸반 컬럼들 */
        <div className="flex gap-6 overflow-x-auto pb-4">
          {COLUMN_STATUSES.map((status) => (
            <KanbanColumn key={status} status={status} tasks={getTasksByStatus(status)} onAddTask={handleAddTask} onEditTask={handleEditTask} onDeleteTask={handleDeleteTask} />
          ))}
        </div>
      )}

      {/* 일정 생성/수정 모달 */}
      <TaskCreateModal isOpen={isModalOpen} onClose={handleCloseModal} onSuccess={handleSuccess} editTask={editTask} defaultStatus={defaultStatus} />
    </div>
  );
}
