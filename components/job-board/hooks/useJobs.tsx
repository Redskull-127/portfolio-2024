'use client';
import { UUID } from 'crypto';
import { getJobs, updateJobCol } from '@/lib/server/functions/job-board';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

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

export const useUpdateJobCol = ({
  jobId,
  columnId,
}: {
  jobId: string;
  columnId: string;
}) => {
  return useQuery({
    queryKey: ['updateJobCol'],
    queryFn: async () => await updateJobCol(jobId, columnId),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    enabled: false,
  });
};
