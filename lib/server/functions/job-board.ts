'use server';
import { Task } from '@/components/job-board/task-card';
import JobAPI from '@/test/job-board.json';

export const getJobs = async () => {
  return JobAPI as Task[];
};

export const addJob = async () => {
  console.log('Job added');
};
