'use client';
import { Children } from '@/lib/types/children';
import { createContext, useContext } from 'react';
import { useState } from 'react';

const introContext = createContext(
  {} as {
    isIntroOpen: boolean;
    setIsIntroOpen: (open: boolean) => void;
  },
);

export function useIntroContext() {
  return useContext(introContext);
}

export function IntroDialogProvider({ children }: Children) {
  const [isIntroOpen, setIsIntroOpen] = useState<boolean>(true);

  return (
    <introContext.Provider
      value={{
        isIntroOpen,
        setIsIntroOpen,
      }}
    >
      {children}
    </introContext.Provider>
  );
}
