'use client';
import { Children } from '@/lib/types/children';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';

if (typeof window !== 'undefined') {
  posthog.init(process.env['NEXT_PUBLIC_POSTHOG_KEY']!, {
    api_host: process.env['NEXT_PUBLIC_POSTHOG_HOST'],
    person_profiles: 'always', // or 'always' to create profiles for anonymous users as well
  });
}
export function CSPostHogProvider({ children }: Children) {
  if (process.env['NODE_ENV'] === 'development') return <>{children}</>;
  else return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
