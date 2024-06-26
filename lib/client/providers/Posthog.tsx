'use client';
import { Children } from '@/lib/types/children';
import posthog from 'posthog-js';
import { PostHogProvider } from 'posthog-js/react';

if (typeof window !== 'undefined') {
  posthog.init(process.env['NEXT_PUBLIC_POSTHOG_KEY']!, {
    api_host: process.env['NEXT_PUBLIC_POSTHOG_HOST'],
    person_profiles: 'always', // or 'always' to create profiles for anonymous users as well
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') posthog.debug();
    },
  });
}
export function CSPostHogProvider({ children }: Children) {
  return <PostHogProvider client={posthog}>{children}</PostHogProvider>;
}
