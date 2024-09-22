'use server';
import { auth } from '@/auth';
import type { jobFormSchema } from '@/components/job-board/add-card';
import type { AllJobs } from '@/components/job-board/types';
import db from '@/db';
import { jobSchema } from '@/db/schema';
import { eq } from 'drizzle-orm';
import type { z } from 'zod';

export type AddJobResponse = {
  status: 'success' | 'error';
  message: string;
};

export const getJobs = async () => {
  const user = await auth();
  if (user?.user?.email) {
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
    await db.insert(jobSchema).values({
      ...jobFormData,
      userEmail: user.user?.email ?? '',
      uuid: crypto.randomUUID(),
      contactInfo: jobFormData.contactInfo.map((info) => ({
        email: info.email ?? '',
        name: info.name ?? '',
        link: info.link ?? '',
      })),
    });

    return {
      status: 'success',
      message: 'Job added successfully',
    };
  } catch (error) {
    return {
      status: 'error',
      message: (error as Error).message,
    };
  }
};

export const updateJobCol = async (jobId: string, columnId: string) => {
  console.log('Server', jobId, columnId);
  const user = await auth();
  if (!user) {
    return {
      status: 'error',
      message: 'You must be logged in to update a job',
    };
  }
  try {
    await db
      .update(jobSchema)
      .set({ columnId })
      .where(eq(jobSchema.uuid, jobId));
    return {
      status: 'success',
      message: 'Job updated successfully',
    };
  } catch (error) {
    return {
      status: 'error',
      message: (error as Error).message,
    };
  }
};

export const updateJob = async (
  jobId: string,
  jobFormData: z.infer<typeof jobFormSchema>,
) => {
  const user = await auth();
  if (!user) {
    return {
      status: 'error',
      message: 'You must be logged in to update a job',
    };
  }
  try {
    await db
      .update(jobSchema)
      .set({
        ...jobFormData,
        contactInfo: jobFormData.contactInfo.map((info) => ({
          email: info.email ?? '',
          name: info.name ?? '',
          link: info.link ?? '',
        })),
      })
      .where(eq(jobSchema.uuid, jobId));
    return {
      status: 'success',
      message: 'Job updated successfully',
    };
  } catch (error) {
    return {
      status: 'error',
      message: (error as Error).message,
    };
  }
};

export const deleteJob = async (jobId: string) => {
  const user = await auth();
  if (!user) {
    return {
      status: 'error',
      message: 'You must be logged in to delete a job',
    };
  }
  try {
    await db.delete(jobSchema).where(eq(jobSchema.uuid, jobId));
    return {
      status: 'success',
      message: 'Job deleted successfully',
    };
  } catch (error) {
    return {
      status: 'error',
      message: (error as Error).message,
    };
  }
};
