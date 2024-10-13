'use client';
import { useFeatureFlagEnabled } from 'posthog-js/react';
import { Children } from '../types/children';
import { FeatureNotEnabled } from './not-enabled';

export default function JobBoardFlag({ children }: Children) {
  const jobBoardFlag = useFeatureFlagEnabled('job-board');
  if (!jobBoardFlag) return <FeatureNotEnabled />;
  return children;
}
