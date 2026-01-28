import { useState } from 'react';
import { Filter, LayoutGrid, Calendar, Table, Plus, Settings, Search, MoreHorizontal } from 'lucide-react';
import { DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors, useDroppable, type DragStartEvent, type DragEndEvent } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useTasks } from '@hooks/useTasks';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { CalendarView } from '@components/feature/calendar/CalendarView';
import { TableView } from '@components/feature/table/TableView';
import { TaskCreateModal } from '@components/feature/task/TaskCreateModal';
import { KanbanCard } from '@components/feature/kanban/KanbanCard';
import { COLUMN_CONFIG } from '@type/kanban';
import type { TaskItem, TaskStatus } from '@type/task';

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
                <p className="text-sm text-gray-500 mt-1">총 {taskList.length}개의 태스크</p>
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

                <Button className="gap-2" onClick={handleAddTask}>
                  <Plus className="w-4 h-4" />
                  Add Task
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* 컨텐츠 */}
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

      <TaskCreateModal isOpen={isModalOpen} onClose={handleCloseModal} editTask={editTask} />
    </div>
  );
}

// 드래그
function DraggableCard({ task, onEdit, onDelete }: { task: TaskItem; onEdit: (task: TaskItem) => void; onDelete: (taskId: string) => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <KanbanCard task={task} onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
}

// 드롭
function DroppableColumn({
  status,
  tasks,
  onAddTask,
  onEditTask,
  onDeleteTask,
}: {
  status: TaskStatus;
  tasks: TaskItem[];
  onAddTask: (status: TaskStatus) => void;
  onEditTask: (task: TaskItem) => void;
  onDeleteTask: (taskId: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const config = COLUMN_CONFIG[status];

  return (
    <div className={`flex flex-col bg-gray-100 rounded-xl min-w-[300px] w-[300px] transition-colors ${isOver ? 'bg-gray-200 ring-2 ring-primary ring-opacity-50' : ''}`}>
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
      <div ref={setNodeRef} className="flex-1 p-2 space-y-3 overflow-y-auto max-h-[calc(100vh-350px)] min-h-[100px]">
        <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <DraggableCard key={task.id} task={task} onEdit={onEditTask} onDelete={onDeleteTask} />
          ))}
        </SortableContext>
      </div>

      <div className="p-3 pt-1">
        <Button variant="ghost" className="w-full justify-start text-gray-500 hover:text-gray-700 hover:bg-gray-200" onClick={() => onAddTask(status)}>
          <Plus className="w-4 h-4 mr-2" />
          Add a task
        </Button>
      </div>
    </div>
  );
}

// 칸반보드 내부 컨텐츠
function KanbanBoardContent({ onEditTask }: { onEditTask: (task: TaskItem) => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editTask, setEditTask] = useState<TaskItem | null>(null);
  const [defaultStatus, setDefaultStatus] = useState<TaskStatus>('todo');
  const [activeTask, setActiveTask] = useState<TaskItem | null>(null);

  const { taskList, isLoading, deleteTask, editTask: updateTask, searchTasks } = useTasks();

  const COLUMN_STATUSES: TaskStatus[] = ['todo', 'in-progress', 'done'];

  // 센서 설정
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getFilteredTasks = (status: TaskStatus) => {
    const filteredBySearch = searchQuery ? searchTasks(searchQuery) : taskList;
    return filteredBySearch.filter((task) => task.status === status);
  };

  const handleAddTask = (status: TaskStatus) => {
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

  // 드래그 시작
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const task = taskList.find((t) => t.id === active.id);
    if (task) {
      setActiveTask(task);
    }
  };

  // 드래그 종료, 상태 업데이트
  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id as string;
    const task = taskList.find((t) => t.id === taskId);
    if (!task) return;

    // over.id가 컬럼 상태인지 확인
    let newStatus: TaskStatus | null = null;

    if (COLUMN_STATUSES.includes(over.id as TaskStatus)) {
      newStatus = over.id as TaskStatus;
    } else {
      // over.id가 다른 태스크의 id인 경우, 해당 태스크의 상태를 찾음
      const overTask = taskList.find((t) => t.id === over.id);
      if (overTask) {
        newStatus = overTask.status;
      }
    }

    // 상태가 변경된 경우에만 업데이트
    if (newStatus && task.status !== newStatus) {
      await updateTask(taskId, { status: newStatus });
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
        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="flex gap-6 overflow-x-auto pb-4">
            {COLUMN_STATUSES.map((status) => (
              <DroppableColumn
                key={status}
                status={status}
                tasks={getFilteredTasks(status)}
                onAddTask={handleAddTask}
                onEditTask={handleEditTaskInternal}
                onDeleteTask={handleDeleteTask}
              />
            ))}
          </div>

          {/* 드래그 중인 카드 오버레이 */}
          <DragOverlay>
            {activeTask ? (
              <div className="rotate-3 shadow-xl">
                <KanbanCard task={activeTask} onEdit={() => {}} onDelete={() => {}} />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

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
