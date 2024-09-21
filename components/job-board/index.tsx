'use client';

import { useSession } from 'next-auth/react';
import { KanbanBoard } from './kanban-board';

export default function JobBoard() {
  const { status } = useSession();
  if (status === 'loading') return <div>Loading...</div>;
  if (status === 'unauthenticated') return <div>Unauthenticated</div>;
  return <KanbanBoard />;
}
