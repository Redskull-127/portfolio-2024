'use client';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getJobs } from '@/lib/server/functions/job-board';

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
