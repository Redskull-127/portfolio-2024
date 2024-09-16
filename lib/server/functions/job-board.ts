'use server';
import { jobFormSchema } from '@/components/job-board/add-card';
import { z } from 'zod';
import db from '@/db';
import { jobSchema } from '@/db/schema';
import { auth } from '@/auth';
import { eq } from 'drizzle-orm';
import { AllJobs } from '@/components/job-board/types';

export type AddJobResponse = {
  status: 'success' | 'error';
  message: string;
};

export const getJobs = async () => {
  const user = await auth();
  if (user && user.user?.email) {
    const response = await db
      .select()
      .from(jobSchema)
      .where(eq(jobSchema.userEmail, user.user.email));
    return {
      status: 'success',
      data: response as AllJobs,
    };
  }
  return {
    status: 'error',
    message: 'You must be logged in to view jobs',
  };
};

export const addJob = async (
  jobFormData: z.infer<typeof jobFormSchema>,
): Promise<AddJobResponse> => {
  const user = await auth();
  if (!user) {
    return {
      status: 'error',
      message: 'You must be logged in to add a job',
    };
  }
  try {
    await db
      .insert(jobSchema)
      .values({ ...jobFormData, userEmail: user.user?.email });

    return {
      status: 'success',
      message: 'Job added successfully',
    };
  } catch (error: any) {
    return {
      status: 'error',
      message: error.message,
    };
  }
};
