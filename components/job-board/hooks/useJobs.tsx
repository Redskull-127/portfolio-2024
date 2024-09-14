'use client';
import { useQuery } from '@tanstack/react-query';
import { getJobs } from '@/lib/server/functions/job-board';

export const useJobs = () => {
  console.log('useJobs');
  return useQuery({
    queryKey: ['jobs'],
    queryFn: async () => await getJobs(),
  });
};
