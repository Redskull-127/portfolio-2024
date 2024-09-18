'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import {
  type Announcements,
  DndContext,
  type DragEndEvent,
  type DragOverEvent,
  DragOverlay,
  type DragStartEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { SortableContext, arrayMove } from '@dnd-kit/sortable';
import { useDraggable } from 'react-use-draggable-scroll';
import { toast } from 'sonner';
import AddCard from './add-card';
import { BoardColumn, BoardContainer } from './board-column';
import type { Column } from './board-column';
import { useJobs, useUpdateJobCol } from './hooks/useJobs';
import { coordinateGetter } from './keyboard-presets';
import { TaskCard } from './task-card';
import type { AllJobs, Job } from './types';
import { hasDraggableData } from './utils';

const defaultCols = [
  {
    id: 'open' as const,
    title: 'Open',
    color: '#ff213b',
  },
  {
    id: 'applied' as const,
    title: 'Applied',
    color: '#80cb80',
  },
  {
    id: 'interviewing' as const,
    title: 'Interviewing',
    color: '#f28b30',
  },
  {
    id: 'offer' as const,
    title: 'Offer',
    color: '#31bcb5',
  },
  {
    id: 'rejected' as const,
    title: 'Rejected',
    color: '#ed3d88',
  },
] satisfies Column[];

export type ColumnId = (typeof defaultCols)[number]['id'];

export function KanbanBoard() {
  const { data, isPending, isLoading } = useJobs();
  if (isLoading || isPending) return <div>Loading...</div>;
  if (data?.data) {
    if (data.status !== 'success') {
      return <div>Something went wrong!</div>;
    }

    return (
      <main className="size-full flex flex-col gap-5">
        <h1 className="inline-flex items-center gap-2 text-2xl font-bold">
          Kanban Board <AddCard />{' '}
        </h1>
        {typeof window !== 'undefined' && (
          <KanbanBoardComponent initialTasks={data.data} />
        )}
      </main>
    );
  }
  return <div>Something went wrong!</div>;
}

function KanbanBoardComponent({ initialTasks }: { initialTasks: AllJobs }) {
  const [columns, setColumns] = useState<Column[]>(defaultCols);
  const pickedUpTaskColumn = useRef<ColumnId | null>(null);
  const [shiftCard, setShiftCard] = useState<{
    jobId: string;
    columnId: string;
  }>({
    jobId: '',
    columnId: '',
  });
  const {
    data: updateJobColData,
    refetch: fetchUpdateJobCol,
    isRefetching: isJobColChanging,
  } = useUpdateJobCol(shiftCard);
  const columnsId = useMemo(() => columns.map((col) => col.id), [columns]);

  const [tasks, setTasks] = useState<AllJobs>(initialTasks);

  const [activeColumn, setActiveColumn] = useState<Column | null>(null);

  const [activeTask, setActiveTask] = useState<Job | null>(null);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: coordinateGetter,
    }),
  );

  const kanbanBoardRef =
    useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;
  const { events: kanbanBoardScrollEvents } = useDraggable(kanbanBoardRef, {
    isMounted: !(activeTask || activeColumn),
    applyRubberBandEffect: true,
  });
  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  function getDraggingTaskData(taskId: number, columnId: ColumnId) {
    const tasksInColumn = tasks.filter((task) => task.columnId === columnId);
    const taskPosition = tasksInColumn.findIndex((task) => task.id === taskId);
    const column = columns.find((col) => col.id === columnId);
    return {
      tasksInColumn,
      taskPosition,
      column,
    };
  }

  const announcements: Announcements = {
    onDragStart({ active }) {
      if (!hasDraggableData(active)) return;
      if (active.data.current?.type === 'Column') {
        const startColumnIdx = columnsId.findIndex((id) => id === active.id);
        const startColumn = columns[startColumnIdx];
        return `Picked up Column ${startColumn?.title} at position: ${
          startColumnIdx + 1
        } of ${columnsId.length}`;
      }
      if (active.data.current?.type === 'Task') {
        pickedUpTaskColumn.current = active.data.current.task
          .columnId as ColumnId;
        const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
          active.id as unknown as number,
          pickedUpTaskColumn.current,
        );
        return `Picked up Task ${
          active.data.current.task.title
        } at position: ${taskPosition + 1} of ${
          tasksInColumn.length
        } in column ${column?.title}`;
      }
    },
    onDragOver({ active, over }) {
      if (!hasDraggableData(active) || !hasDraggableData(over)) return;

      if (
        active.data.current?.type === 'Column' &&
        over.data.current?.type === 'Column'
      ) {
        const overColumnIdx = columnsId.findIndex((id) => id === over.id);
        return `Column ${active.data.current.column.title} was moved over ${
          over.data.current.column.title
        } at position ${overColumnIdx + 1} of ${columnsId.length}`;
      }
      if (
        active.data.current?.type === 'Task' &&
        over.data.current?.type === 'Task'
      ) {
        const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
          over.id as number,
          over.data.current.task.columnId as ColumnId,
        );
        if (over.data.current.task.columnId !== pickedUpTaskColumn.current) {
          return `Task ${
            active.data.current.task.title
          } was moved over column ${column?.title} in position ${
            taskPosition + 1
          } of ${tasksInColumn.length}`;
        }
        return `Task was moved over position ${taskPosition + 1} of ${
          tasksInColumn.length
        } in column ${column?.title}`;
      }
    },
    onDragEnd({ active, over }) {
      if (!hasDraggableData(active) || !hasDraggableData(over)) {
        pickedUpTaskColumn.current = null;
        return;
      }
      if (
        active.data.current?.type === 'Column' &&
        over.data.current?.type === 'Column'
      ) {
        const overColumnPosition = columnsId.findIndex((id) => id === over.id);

        return `Column ${
          active.data.current.column.title
        } was dropped into position ${overColumnPosition + 1} of ${
          columnsId.length
        }`;
      }
      if (
        active.data.current?.type === 'Task' &&
        over.data.current?.type === 'Task'
      ) {
        const { tasksInColumn, taskPosition, column } = getDraggingTaskData(
          over.id as number,
          over.data.current.task.columnId as ColumnId,
        );
        if (over.data.current.task.columnId !== pickedUpTaskColumn.current) {
          const handleJobColChange = async () => {
            setShiftCard({
              jobId: active.data.current?.task.uuid,
              columnId: column?.id as ColumnId,
            });
            if (shiftCard.jobId !== '' && shiftCard.columnId !== '') {
              return await fetchUpdateJobCol().then(() => {
                setShiftCard({
                  jobId: '',
                  columnId: '',
                });
              });
            }
          };

          toast.promise(handleJobColChange(), {
            loading: 'Moving task...',
            success: 'Task moved successfully',
            error: 'Error moving task',
          });

          console.log(
            `Task was dropped into column ${column?.title} in position ${
              taskPosition + 1
            } of ${tasksInColumn.length}`,
          );
          return `Task was dropped into column ${column?.title} in position ${
            taskPosition + 1
          } of ${tasksInColumn.length}`;
        }
        return `Task was dropped into position ${taskPosition + 1} of ${
          tasksInColumn.length
        } in column ${column?.title}`;
      }
      pickedUpTaskColumn.current = null;
    },
    onDragCancel({ active }) {
      pickedUpTaskColumn.current = null;
      if (!hasDraggableData(active)) return;
      return `Dragging ${active.data.current?.type} cancelled.`;
    },
  };

  return (
    <DndContext
      accessibility={{
        announcements,
      }}
      sensors={sensors}
      onDragStart={onDragStart}
      onDragEnd={onDragEnd}
      onDragOver={onDragOver}
      autoScroll={true}
    >
      <div
        {...kanbanBoardScrollEvents}
        className="max-w-full space-x-3 overflow-x-scroll scrollbar-hide"
        ref={kanbanBoardRef}
      >
        <BoardContainer>
          <SortableContext items={columnsId}>
            {columns.map((col) => (
              <BoardColumn
                key={col.id}
                isJobColChanging={isJobColChanging}
                column={col}
                tasks={tasks.filter((task) => task.columnId === col.id)}
              />
            ))}
          </SortableContext>
        </BoardContainer>

        {'document' in window &&
          createPortal(
            <DragOverlay>
              {activeColumn && (
                <BoardColumn
                  isOverlay
                  column={activeColumn}
                  tasks={tasks.filter(
                    (task) => task.columnId === activeColumn.id,
                  )}
                />
              )}
              {activeTask && <TaskCard task={activeTask} isOverlay />}
            </DragOverlay>,
            document.body,
          )}
      </div>
    </DndContext>
  );

  function onDragStart(event: DragStartEvent) {
    if (!hasDraggableData(event.active)) return;
    const data = event.active.data.current;
    if (data?.type === 'Column') {
      setActiveColumn(data.column);
      return;
    }

    if (data?.type === 'Task') {
      setActiveTask(data.task);
      return;
    }
  }

  function onDragEnd(event: DragEndEvent) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (!hasDraggableData(active)) return;

    const activeData = active.data.current;

    if (activeId === overId) return;

    const isActiveAColumn = activeData?.type === 'Column';
    if (!isActiveAColumn) return;

    setColumns((columns) => {
      const activeColumnIndex = columns.findIndex((col) => col.id === activeId);

      const overColumnIndex = columns.findIndex((col) => col.id === overId);

      return arrayMove(columns, activeColumnIndex, overColumnIndex);
    });
  }

  function onDragOver(event: DragOverEvent) {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    if (!hasDraggableData(active) || !hasDraggableData(over)) return;

    const activeData = active.data.current;
    const overData = over.data.current;

    const isActiveATask = activeData?.type === 'Task';
    const isOverATask = overData?.type === 'Task';

    if (!isActiveATask) return;

    // Im dropping a Task over another Task
    if (isActiveATask && isOverATask) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const overIndex = tasks.findIndex((t) => t.id === overId);
        const activeTask = tasks[activeIndex];
        const overTask = tasks[overIndex];
        if (
          activeTask &&
          overTask &&
          activeTask.columnId !== overTask.columnId
        ) {
          activeTask.columnId = overTask.columnId;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }

        return arrayMove(tasks, activeIndex, overIndex);
      });
    }

    const isOverAColumn = overData?.type === 'Column';

    // Im dropping a Task over a column
    if (isActiveATask && isOverAColumn) {
      setTasks((tasks) => {
        const activeIndex = tasks.findIndex((t) => t.id === activeId);
        const activeTask = tasks[activeIndex];
        if (activeTask) {
          activeTask.columnId = overId as ColumnId;
          return arrayMove(tasks, activeIndex, activeIndex);
        }
        return tasks;
      });
    }
  }
}
