'use client';

import { useSession } from 'next-auth/react';
import { KanbanBoard } from './kanban-board';
import JobKanbanStats from './statistics';
export default function JobBoard() {
  const { status } = useSession();
  if (status === 'unauthenticated') return <div>Unauthenticated</div>;
  if (status === 'loading') return <div>Loading...</div>;
  return <JobKanbanStats />;
}
