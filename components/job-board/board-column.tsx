import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { useDndContext, type UniqueIdentifier } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { useMemo } from 'react';
import { Task, TaskCard } from './task-card';
import { cva } from 'class-variance-authority';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GripVertical } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

export interface Column {
  id: UniqueIdentifier;
  title: string;
  color: string;
}

export type ColumnType = 'Column';

export interface ColumnDragData {
  type: ColumnType;
  column: Column;
}

interface BoardColumnProps {
  column: Column;
  tasks: Task[];
  isOverlay?: boolean;
}

export function BoardColumn({ column, tasks, isOverlay }: BoardColumnProps) {
  const tasksIds = useMemo(() => {
    return tasks.map((task) => task.id);
  }, [tasks]);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: 'Column',
      column,
    } satisfies ColumnDragData,
    attributes: {
      roleDescription: `Column: ${column.title}`,
    },
  });

  const style = {
    transition,
    borderTopColor: `${column.color}`,
    transform: CSS.Translate.toString(transform),
  };

  const variants = cva(
    cn(
      'h-[500px] transition-all duration-300 max-h-[500px] w-[325px] max-w-full bg-primary-foreground flex flex-col flex-shrink-0 snap-center',
    ),
    {
      variants: {
        dragging: {
          default: 'border-t-4',
          over: 'border-t-8 ',
          overlay: 'border-t-8',
        },
      },
    },
  );

  return (
    <Card
      ref={setNodeRef}
      style={style}
      className={variants({
        dragging: isOverlay ? 'overlay' : isDragging ? 'over' : undefined,
      })}
    >
      <CardHeader className="p-4 font-semibold border-b-2 text-left flex flex-row space-between items-center">
        <Button
          variant={'ghost'}
          {...attributes}
          {...listeners}
          className=" p-1 text-primary/50 -ml-2 h-auto cursor-grab relative"
        >
          <span className="sr-only">{`Move column: ${column.title}`}</span>
          <GripVertical />
        </Button>
        <span className="ml-auto"> {column.title}</span>
      </CardHeader>
      <ScrollArea>
        <CardContent className="flex flex-grow flex-col gap-2 p-2">
          <SortableContext items={tasksIds}>
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </SortableContext>
        </CardContent>
      </ScrollArea>
    </Card>
  );
}

export function BoardContainer({ children }: { children: React.ReactNode }) {
  const dndContext = useDndContext();

  const variations = cva('px-2 md:px-0 flex lg:justify-center pb-4 size-fit', {
    variants: {
      dragging: {
        default: 'snap-x snap-mandatory',
        active: 'snap-none',
      },
    },
  });

  return (
    <ScrollArea
      className={variations({
        dragging: dndContext.active ? 'active' : 'default',
      })}
    >
      <div className="flex gap-4 items-center flex-row justify-center">
        {children}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}
