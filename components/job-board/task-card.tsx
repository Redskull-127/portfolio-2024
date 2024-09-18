import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cva } from 'class-variance-authority';
import { GripVertical } from 'lucide-react';
import Link from 'next/link';
import formattedDate from './lib/date-formatter';
import { Job } from './types';

export type Task = Job;

interface TaskCardProps {
  task: Task;
  isOverlay?: boolean;
  ringColor?: string;
}

export type TaskType = 'Task';

export interface TaskDragData {
  type: TaskType;
  task: Task;
}

export function TaskCard({ task, isOverlay, ringColor }: TaskCardProps) {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    } satisfies TaskDragData,
    attributes: {
      roleDescription: 'Task',
    },
  });

  const style = {
    transition,
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva('', {
    variants: {
      dragging: {
        over: 'ring-2 opacity-30',
        overlay: 'ring-2 ring-primary',
      },
    },
  });

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={variants({
        dragging: isOverlay ? 'overlay' : isDragging ? 'over' : undefined,
        className: `cursor-pointer hover:border-gray-600 hover:border-opacity-90`,
      })}
    >
      <CardHeader className="px-3 py-3 space-between flex flex-row border-b-2 border-secondary relative">
        <div className="flex items-center">
          <Button
            variant={'ghost'}
            {...attributes}
            {...listeners}
            className="p-1 text-secondary-foreground/50 -ml-2 h-auto cursor-grab"
          >
            <span className="sr-only">Move task</span>
            <GripVertical />
          </Button>
          <p className="overflow-clip">{task.title}</p>
        </div>
        <Badge
          variant={'outline'}
          style={{ borderColor: ringColor }}
          className={cn('ml-auto h-7 font-semibold')}
        >
          Task
        </Badge>
      </CardHeader>
      <CardContent className="px-3 pt-3 pb-6 text-sm text-left whitespace-pre-wrap">
        <p>
          {task.company} | {task.location}
        </p>
        {formattedDate(task.date)}
      </CardContent>
    </Card>
  );
}

export const TaskDialog = ({
  job,
  formattedDate,
  status,
  ringColor,
}: {
  job: Task;
  formattedDate: string;
  status: string;
  ringColor: string;
}) => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>
          {job.title} -
          <Badge
            style={{ backgroundColor: ringColor }}
            className={cn(
              'ml-2 h-fit text-primary py-2 uppercase font-semibold',
            )}
          >
            {status}
          </Badge>
        </DialogTitle>
        <DialogDescription>
          {job.companyURL ? (
            <>
              {' '}
              <Link className="text-ternary underline" href={job.companyURL}>
                {job.company}
              </Link>{' '}
            </>
          ) : (
            job.company
          )}{' '}
          | {job.location} | {job.jobType} | {formattedDate} - {job.salary}
        </DialogDescription>
      </DialogHeader>
      <div className="py-3 space-y-3">
        <p className="max-h-[300px] w-full text-wrap overflow-y-auto">
          {job.description}
        </p>
        <ul className="text-sm">
          {job.contactName && <li>Contact Name: {job.contactName}</li>}
          {job.contactEmail && <li>Contact Email: {job.contactEmail}</li>}
          {job.contactLink && (
            <li>
              Contact Profile:{' '}
              <Link className="text-ternary underline" href={job.contactLink}>
                {' '}
                link{' '}
              </Link>
            </li>
          )}
        </ul>
      </div>
    </DialogContent>
  );
};
