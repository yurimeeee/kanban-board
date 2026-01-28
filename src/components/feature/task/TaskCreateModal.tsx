import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';

import { cn } from '@lib/utils';
import { saveTask, updateTask, type TaskItem } from '@lib/taskService';
import { useUserStore } from '@store/userSlice';
import type { TaskStatus } from '@type/task';

import { CustomModal } from '@components/ui/custom-modal';
import { Button } from '@components/ui/button';
import { Input } from '@components/ui/input';
import { Label } from '@components/ui/label';
import { Calendar } from '@components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@components/ui/select';

const taskFormSchema = z.object({
  title: z.string().min(1, '제목을 입력해주세요.').max(100, '제목은 100자 이내로 입력해주세요.'),
  description: z.string().max(500, '설명은 500자 이내로 입력해주세요.').optional(),
  priority: z.enum(['low', 'medium', 'high'], {
    required_error: '우선순위를 선택해주세요.',
  }),
  category: z.string().min(1, '카테고리를 선택해주세요.'),
  status: z.enum(['todo', 'in-progress', 'done']).optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  startTime: z.string().optional(),
  endTime: z.string().optional(),
});

type TodoFormValues = z.infer<typeof taskFormSchema>;

const PRIORITY_OPTIONS = [
  { value: 'low', label: '낮음' },
  { value: 'medium', label: '보통' },
  { value: 'high', label: '높음' },
] as const;

const CATEGORY_OPTIONS = [
  { value: 'work', label: '업무' },
  { value: 'personal', label: '개인' },
  { value: 'study', label: '학습' },
  { value: 'health', label: '건강' },
  { value: 'other', label: '기타' },
] as const;

const STATUS_OPTIONS = [
  { value: 'todo', label: 'To Do' },
  { value: 'in-progress', label: 'In Progress' },
  { value: 'done', label: 'Done' },
] as const;

interface TodoCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  editTask?: TaskItem | null;
  defaultStatus?: TaskStatus;
}

export function TaskCreateModal({ isOpen, onClose, onSuccess, editTask, defaultStatus }: TodoCreateModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const user = useUserStore((state) => state.user);

  const isEditMode = !!editTask;

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<TodoFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: '',
      description: '',
      priority: 'medium',
      category: '',
      status: 'todo',
      startTime: '09:00',
      endTime: '18:00',
    },
  });

  // 수정 모드일 때 폼 데이터 설정
  useEffect(() => {
    if (editTask && isOpen) {
      setValue('title', editTask.title);
      setValue('description', editTask.description);
      setValue('priority', editTask.priority);
      setValue('category', editTask.category);
      setValue('status', editTask.status);
      setValue('startTime', editTask.startTime);
      setValue('endTime', editTask.endTime);
      if (editTask.startDate) setValue('startDate', editTask.startDate);
      if (editTask.endDate) setValue('endDate', editTask.endDate);
    } else if (!editTask && isOpen) {
      reset({
        title: '',
        description: '',
        priority: 'medium',
        category: '',
        status: defaultStatus || 'todo',
        startTime: '09:00',
        endTime: '18:00',
      });
    }
  }, [editTask, isOpen, setValue, reset, defaultStatus]);

  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const priority = watch('priority');
  const category = watch('category');
  const status = watch('status');

  const onSubmit = async (values: TodoFormValues) => {
    if (!user?.uid) {
      alert('로그인이 필요합니다.');
      return;
    }

    setIsSubmitting(true);

    try {
      let result;

      if (isEditMode && editTask) {
        result = await updateTask(user.uid, editTask.id, {
          title: values.title,
          description: values.description || '',
          priority: values.priority,
          category: values.category,
          status: values.status,
          startDate: values.startDate,
          endDate: values.endDate,
          startTime: values.startTime || '09:00',
          endTime: values.endTime || '18:00',
        });
      } else {
        result = await saveTask(user.uid, {
          title: values.title,
          description: values.description || '',
          priority: values.priority,
          category: values.category,
          status: values.status,
          startDate: values.startDate,
          endDate: values.endDate,
          startTime: values.startTime || '09:00',
          endTime: values.endTime || '18:00',
        });
      }

      if (result.success) {
        reset();
        onClose();
        onSuccess?.();
      } else {
        alert(result.error || '저장에 실패했습니다.');
      }
    } catch (error) {
      console.error('저장 오류:', error);
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <CustomModal
      title={isEditMode ? '일정 수정' : '새 일정 만들기'}
      description="일정의 세부 정보를 입력해주세요."
      isOpen={isOpen}
      onClose={handleClose}
      className="sm:max-w-[500px]"
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* 제목 */}
        <div className="space-y-2">
          <Label htmlFor="title">제목 *</Label>
          <Input id="title" placeholder="일정 제목을 입력하세요" {...register('title')} />
          {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
        </div>

        {/* 설명 */}
        <div className="space-y-2">
          <Label htmlFor="description">설명</Label>
          <Input id="description" placeholder="일정에 대한 설명을 입력하세요" {...register('description')} />
          {errors.description && <p className="text-sm text-destructive">{errors.description.message}</p>}
        </div>

        {/* 상태 */}
        <div className="space-y-2">
          <Label>상태</Label>
          <Select value={status} onValueChange={(value) => setValue('status', value as TaskStatus)}>
            <SelectTrigger>
              <SelectValue placeholder="선택하세요" />
            </SelectTrigger>
            <SelectContent>
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 우선순위 & 카테고리 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>우선순위 *</Label>
            <Select value={priority} onValueChange={(value) => setValue('priority', value as 'low' | 'medium' | 'high')}>
              <SelectTrigger>
                <SelectValue placeholder="선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {PRIORITY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.priority && <p className="text-sm text-destructive">{errors.priority.message}</p>}
          </div>

          <div className="space-y-2">
            <Label>카테고리 *</Label>
            <Select value={category} onValueChange={(value) => setValue('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="선택하세요" />
              </SelectTrigger>
              <SelectContent>
                {CATEGORY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && <p className="text-sm text-destructive">{errors.category.message}</p>}
          </div>
        </div>

        {/* 시작일 & 종료일 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>시작일</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button type="button" variant="outline" className={cn('w-full justify-start text-left font-normal', !startDate && 'text-muted-foreground')}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, 'PPP', { locale: ko }) : '날짜 선택'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={startDate} onSelect={(date) => setValue('startDate', date)} />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-2">
            <Label>종료일</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button type="button" variant="outline" className={cn('w-full justify-start text-left font-normal', !endDate && 'text-muted-foreground')}>
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, 'PPP', { locale: ko }) : '날짜 선택'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar mode="single" selected={endDate} onSelect={(date) => setValue('endDate', date)} />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* 시작 시간 & 종료 시간 */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="startTime">시작 시간</Label>
            <Input id="startTime" type="time" {...register('startTime')} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="endTime">종료 시간</Label>
            <Input id="endTime" type="time" {...register('endTime')} />
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={handleClose}>
            취소
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? '저장 중...' : isEditMode ? '수정' : '저장'}
          </Button>
        </div>
      </form>
    </CustomModal>
  );
}
