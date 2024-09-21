'use client';
import {
  deleteJob,
  getJobs,
  updateJob,
  updateJobCol,
} from '@/lib/server/functions/job-board';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { jobFormSchema } from '../add-card';
import { z } from 'zod';

export const useJobs = () => {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: async () => await getJobs(),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const useMutationJobs = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: async () => await getJobs(),
    onSuccess: (data) => {
      queryClient.setQueryData(['jobs'], data);
    },
  });
  return mutation;
};

export const useUpdateJobCol = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      jobId,
      columnId,
    }: {
      jobId: string;
      columnId: string;
    }) => await updateJobCol(jobId, columnId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['jobs'],
      });
    },
  });
};

export const useUpdateJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      jobId,
      jobData,
    }: {
      jobId: string;
      jobData: z.infer<typeof jobFormSchema>;
    }) => await updateJob(jobId, jobData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['jobs'],
      });
    },
  });
};

export const useDeleteJob = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (jobId: string) => await deleteJob(jobId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['jobs'],
      });
    },
  });
};
