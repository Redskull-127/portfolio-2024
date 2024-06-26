'use client';
import React, { createContext, useMemo, useContext } from 'react';
import { io, Socket } from 'socket.io-client';

const SocketContext = createContext({} as Socket);

export const useSocket = () => {
  const socket = useContext(SocketContext);
  return socket;
};

export const SocketProvider = (props: { children: React.ReactNode }) => {
  const socket = useMemo(
    () => io(process.env['NEXT_PUBLIC_SOCKET_NEW_URL']!),
    [],
  );

  return (
    <SocketContext.Provider value={socket}>
      {props.children}
    </SocketContext.Provider>
  );
};
