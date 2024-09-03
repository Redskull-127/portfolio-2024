'use client';
import { useEffect, useState } from 'react';
import WebSocket from 'isomorphic-ws';

const SOCKET_URL = process.env['NEXT_PUBLIC_LIVEUSER']!;
export default function LiveCount(params: {
  translation: {
    liveUser: string;
    liveUsers: string;
  };
}) {
  const [activeUsers, setActiveUsers] = useState(0);

  useEffect(() => {
    const ws = new WebSocket(SOCKET_URL);
    ws.onmessage = (event: any) => {
      const data = JSON.parse(event.data);
      setActiveUsers(data.activeUsers);
    };

    return () => {
      ws.close();
    };
  }, []);
  if (!activeUsers) return null;
  if (activeUsers === 0) return null;
  return (
    <span>
      {activeUsers}{' '}
      {activeUsers === 1
        ? params.translation.liveUser
        : params.translation.liveUsers}
    </span>
  );
}
