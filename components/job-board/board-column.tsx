import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { type UniqueIdentifier, useDndContext } from '@dnd-kit/core';
import { SortableContext, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cva } from 'class-variance-authority';
import { FilePenLine, GripVertical, Settings2, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { Dialog } from '@/components/ui/dialog';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import formattedDate from './lib/date-formatter';
import { TaskCard } from './task-card';
import { AllJobs, Job } from './types';
import { Badge } from '../ui/badge';
import Link from 'next/link';
import { JobFormDialog } from './add-card';
import { useDeleteJob, useMutationJobs, useUpdateJob } from './hooks/useJobs';
import { toast } from 'sonner';

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
  tasks: AllJobs;
  isOverlay?: boolean;
  isJobColChanging?: boolean;
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editTask?: Job;
  setStateEditTask?: React.Dispatch<React.SetStateAction<Job | undefined>>;
}

export function BoardColumn({
  column,
  tasks,
  isOverlay,
  isJobColChanging,
  setIsEditDialogOpen,
  setStateEditTask,
}: BoardColumnProps) {
  const { mutate: mutateDeleteJob } = useDeleteJob();
  const [isDeleteAlertOpen, setDeleteIsAlertOpen] = useState(false);
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
          disabled={isJobColChanging}
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
            {tasks.map((job) => (
              <>
                <AlertDialog key={job.uuid}>
                  <AlertDialogTrigger>
                    <TaskCard
                      key={job.id}
                      task={job}
                      ringColor={column.color}
                    />
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        {job.title} -
                        <Badge
                          style={{ backgroundColor: column.color }}
                          className={cn(
                            'ml-2 h-fit text-primary py-2 uppercase font-semibold',
                          )}
                        >
                          {column.title}
                        </Badge>
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        {job.companyURL ? (
                          <>
                            {' '}
                            <Link
                              className="text-ternary underline"
                              href={job.companyURL}
                            >
                              {job.company}
                            </Link>{' '}
                          </>
                        ) : (
                          job.company
                        )}{' '}
                        | {job.location} | {job.jobType} |{' '}
                        {formattedDate(job.date)} - {job.salary}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <div className="py-3 space-y-3">
                      <p className="max-h-[300px] w-full text-wrap overflow-y-auto">
                        {job.description}
                      </p>
                      <ul className="text-sm">
                        {job.contactName && (
                          <li>Contact Name: {job.contactName}</li>
                        )}
                        {job.contactEmail && (
                          <li>Contact Email: {job.contactEmail}</li>
                        )}
                        {job.contactLink && (
                          <li>
                            Contact Profile:{' '}
                            <Link
                              className="text-ternary underline"
                              href={job.contactLink}
                            >
                              {' '}
                              link{' '}
                            </Link>
                          </li>
                        )}
                      </ul>
                    </div>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Close</AlertDialogCancel>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <AlertDialogAction className="flex gap-[0.3rem]">
                            <Settings2 className="size-5" /> Settings
                          </AlertDialogAction>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => {
                              setStateEditTask && setStateEditTask(job);
                              setIsEditDialogOpen(true);
                            }}
                            className="cursor-pointer"
                          >
                            <FilePenLine className="size-4 mr-2" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => setDeleteIsAlertOpen(true)}
                            className="cursor-pointer focus:bg-red-500 focus:text-white"
                          >
                            <Trash2 className="size-4 mr-2" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                <AlertDialog
                  open={isDeleteAlertOpen}
                  onOpenChange={(open) => {
                    setDeleteIsAlertOpen(open);
                  }}
                >
                  <AlertDialogTrigger asChild></AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your account and remove your data from our
                        servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          toast.promise(
                            Promise.all([mutateDeleteJob(job.uuid)]),
                            {
                              loading: 'Deleting...',
                              success: 'Job deleted successfully',
                              error: 'An error occurred',
                            },
                          );
                        }}
                      >
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
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
      <div className="flex gap-4 items-center flex-row justify-center select-none">
        {children}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
}

export const EditDialog = (props: {
  isEditDialogOpen: boolean;
  setIsEditDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  editTask?: Job;
  setStateEditTask?: React.Dispatch<React.SetStateAction<Job | undefined>>;
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { mutate: updateJob } = useUpdateJob();
  const mutateUpdatedJobWithProps = async (jobData: any) => {
    if (!props.editTask) return;
    try {
      updateJob({
        jobId: props.editTask.uuid,
        jobData,
      });
      return { status: 'success' };
    } catch (error) {
      console.error(error);
    }
  };
  if (!props.editTask) return null;
  return (
    <Dialog
      open={props.isEditDialogOpen}
      onOpenChange={(open) => {
        if (!open && props.setStateEditTask) {
          props.setIsEditDialogOpen(false);
          props.setStateEditTask(undefined);
        }
      }}
    >
      <JobFormDialog
        initialData={props.editTask}
        isDialogOpen={props.isEditDialogOpen}
        setIsDialogOpen={props.setIsEditDialogOpen}
        isSubmitting={isSubmitting}
        setIsSubmitting={setIsSubmitting}
        mutate={mutateUpdatedJobWithProps}
        title="Edit Job"
      />
    </Dialog>
  );
};
