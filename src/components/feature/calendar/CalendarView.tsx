import { useState, useMemo } from 'react';
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isToday,
} from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTasks } from '@hooks/useTasks';
import { Button } from '@components/ui/button';
import { cn } from '@lib/utils';
import { PRIORITY_CONFIG } from '@type/kanban';
import type { TaskItem } from '@type/task';

interface CalendarViewProps {
  onEditTask?: (task: TaskItem) => void;
}

export function CalendarView({ onEditTask }: CalendarViewProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const { taskList } = useTasks();

  // 해당 날짜의 태스크 가져오기
  const getTasksForDate = (date: Date) => {
    return taskList.filter((task) => {
      if (task.endDate) {
        return isSameDay(task.endDate, date);
      }
      if (task.startDate) {
        return isSameDay(task.startDate, date);
      }
      return false;
    });
  };

  // 캘린더 날짜 배열 생성
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const days = [];
    let day = startDate;

    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }

    return days;
  }, [currentMonth]);

  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  return (
    <div className="bg-white rounded-lg border p-6">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">
          {format(currentMonth, 'yyyy년 M월', { locale: ko })}
        </h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentMonth(new Date())}
          >
            오늘
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 mb-2">
        {weekDays.map((day, index) => (
          <div
            key={day}
            className={cn(
              'text-center text-sm font-medium py-2',
              index === 0 && 'text-red-500',
              index === 6 && 'text-blue-500'
            )}
          >
            {day}
          </div>
        ))}
      </div>

      {/* 캘린더 그리드 */}
      <div className="grid grid-cols-7 border-t border-l">
        {calendarDays.map((day, index) => {
          const dayTasks = getTasksForDate(day);
          const isCurrentMonth = isSameMonth(day, currentMonth);

          return (
            <div
              key={index}
              className={cn(
                'min-h-[120px] border-r border-b p-2',
                !isCurrentMonth && 'bg-gray-50'
              )}
            >
              <div
                className={cn(
                  'text-sm mb-1',
                  !isCurrentMonth && 'text-gray-400',
                  isToday(day) &&
                    'bg-primary text-primary-foreground w-6 h-6 rounded-full flex items-center justify-center',
                  index % 7 === 0 && isCurrentMonth && 'text-red-500',
                  index % 7 === 6 && isCurrentMonth && 'text-blue-500'
                )}
              >
                {format(day, 'd')}
              </div>

              {/* 태스크 목록 */}
              <div className="space-y-1">
                {dayTasks.slice(0, 3).map((task) => {
                  const priorityConfig = PRIORITY_CONFIG[task.priority];
                  return (
                    <div
                      key={task.id}
                      className={cn(
                        'text-xs px-1.5 py-0.5 rounded truncate cursor-pointer hover:opacity-80',
                        priorityConfig.bgColor,
                        priorityConfig.textColor
                      )}
                      onClick={() => onEditTask?.(task)}
                      title={task.title}
                    >
                      {task.title}
                    </div>
                  );
                })}
                {dayTasks.length > 3 && (
                  <div className="text-xs text-gray-500 px-1">
                    +{dayTasks.length - 3}개 더
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
