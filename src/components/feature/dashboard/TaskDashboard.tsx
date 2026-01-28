import { useState } from 'react';
import { Filter, LayoutGrid, Calendar, Table, Plus, Settings, Search, MoreHorizontal } from 'lucide-react';
import { useTasks } from '@hooks/useTasks';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { CalendarView } from '@components/feature/calendar/CalendarView';
import { TableView } from '@components/feature/table/TableView';
import { TaskCreateModal } from '@components/feature/task/TaskCreateModal';
import { KanbanCard } from '@components/feature/kanban/KanbanCard';
import { COLUMN_CONFIG } from '@type/kanban';
import type { TaskItem } from '@type/task';

export function TaskDashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<TaskItem | null>(null);
  const { isLoggedIn, taskList } = useTasks();

  const handleEditTask = (task: TaskItem) => {
    setEditTask(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditTask(null);
  };

  const handleAddTask = () => {
    setEditTask(null);
    setIsModalOpen(true);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">로그인이 필요합니다</h2>
          <p className="text-gray-500">태스크를 관리하려면 먼저 로그인해주세요.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Tabs defaultValue="kanban" className="w-full">
        {/* 헤더 */}
        <div className="bg-white border-b sticky top-14 z-40">
          <div className="max-w-[1400px] mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Project Board</h1>
                <p className="text-sm text-gray-500 mt-1">
                  총 {taskList.length}개의 태스크
                </p>
              </div>

              <div className="flex items-center gap-4">
                {/* 탭 선택 */}
                <TabsList className="bg-gray-100">
                  <TabsTrigger value="kanban" className="gap-2">
                    <LayoutGrid className="w-4 h-4" />
                    칸반
                  </TabsTrigger>
                  <TabsTrigger value="calendar" className="gap-2">
                    <Calendar className="w-4 h-4" />
                    캘린더
                  </TabsTrigger>
                  <TabsTrigger value="table" className="gap-2">
                    <Table className="w-4 h-4" />
                    테이블
                  </TabsTrigger>
                </TabsList>

                {/* Add Task 버튼 */}
                <Button className="gap-2" onClick={handleAddTask}>
                  <Plus className="w-4 h-4" />
                  Add Task
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 컨텐츠 영역 */}
        <div className="max-w-[1400px] mx-auto">
          {/* 칸반 뷰 */}
          <TabsContent value="kanban" className="mt-0">
            <KanbanBoardContent onEditTask={handleEditTask} />
          </TabsContent>

          {/* 캘린더 뷰 */}
          <TabsContent value="calendar" className="mt-0 p-6">
            <CalendarView onEditTask={handleEditTask} />
          </TabsContent>

          {/* 테이블 뷰 */}
          <TabsContent value="table" className="mt-0 p-6">
            <TableView onEditTask={handleEditTask} />
          </TabsContent>
        </div>
      </Tabs>

      {/* 태스크 생성/수정 모달 */}
      <TaskCreateModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editTask={editTask}
      />
    </div>
  );
}

// 칸반보드 내부 컨텐츠 (헤더 제외)
function KanbanBoardContent({ onEditTask }: { onEditTask: (task: TaskItem) => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<TaskItem | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<'todo' | 'in-progress' | 'done'>('todo');

  const { taskList, isLoading, deleteTask, searchTasks } = useTasks();

  const COLUMN_STATUSES = ['todo', 'in-progress', 'done'] as const;

  const getFilteredTasks = (status: typeof COLUMN_STATUSES[number]) => {
    const filteredBySearch = searchQuery ? searchTasks(searchQuery) : taskList;
    return filteredBySearch.filter((task) => task.status === status);
  };

  const handleAddTask = (status: typeof COLUMN_STATUSES[number]) => {
    setEditTask(null);
    setDefaultStatus(status);
    setIsModalOpen(true);
  };

  const handleEditTaskInternal = (task: TaskItem) => {
    onEditTask(task);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (confirm('정말 삭제하시겠습니까?')) {
      await deleteTask(taskId);
    }
  };


  return (
    <div className="p-6">
      {/* 검색 및 필터 */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 w-[250px] bg-white border-gray-200"
          />
        </div>
        <Button variant="outline" className="gap-2">
          <Filter className="w-4 h-4" />
          Filter
        </Button>
        <Button variant="outline" className="gap-2">
          <Settings className="w-4 h-4" />
          Settings
        </Button>
      </div>

      {/* 로딩 상태 */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-500">불러오는 중...</p>
        </div>
      ) : (
        /* 칸반 컬럼들 */
        <div className="flex gap-6 overflow-x-auto pb-4">
          {COLUMN_STATUSES.map((status) => {
            const config = COLUMN_CONFIG[status];
            const tasks = getFilteredTasks(status);

            return (
              <div key={status} className="flex flex-col bg-gray-100 rounded-xl min-w-[300px] w-[300px]">
                {/* 컬럼 헤더 */}
                <div className="flex items-center justify-between p-4 pb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full"
                      style={{ backgroundColor: config.color }}
                    />
                    <h2 className="font-semibold text-gray-800">{config.title}</h2>
                    <span className="ml-1 px-2 py-0.5 bg-gray-200 text-gray-600 text-xs rounded-full font-medium">
                      {tasks.length}
                    </span>
                  </div>
                  <button className="p-1 hover:bg-gray-200 rounded">
                    <MoreHorizontal className="w-4 h-4 text-gray-500" />
                  </button>
                </div>

                {/* 카드 목록 */}
                <div className="flex-1 p-2 space-y-3 overflow-y-auto max-h-[calc(100vh-350px)]">
                  {tasks.map((task) => (
                    <KanbanCard
                      key={task.id}
                      task={task}
                      onEdit={handleEditTaskInternal}
                      onDelete={handleDeleteTask}
                    />
                  ))}
                </div>

                {/* Add a task 버튼 */}
                <div className="p-3 pt-1">
                  <Button
                    variant="ghost"
                    className="w-full justify-start text-gray-500 hover:text-gray-700 hover:bg-gray-200"
                    onClick={() => handleAddTask(status)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add a task
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 일정 생성 모달 */}
      <TaskCreateModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditTask(null);
        }}
        editTask={editTask}
        defaultStatus={defaultStatus}
      />
    </div>
  );
}
