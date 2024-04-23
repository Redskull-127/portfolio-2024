"use client";
import { Children } from "@/lib/types/children";
import { createContext, useContext } from "react";
import { useState } from "react";

export type CastDetailsProps = {
  src: string;
  title: string;
};

const CastContext = createContext(
  {} as {
    castDetails: CastDetailsProps;
    setCastDetails: (details: CastDetailsProps) => void;
  },
);

export function useCastContext() {
  return useContext(CastContext);
}

export function ChromeCastProvider({ children }: Children) {
  const [castDetails, setCastDetails] = useState<CastDetailsProps>({
    src: "",
    title: "",
  });

  return (
    <CastContext.Provider
      value={{
        castDetails,
        setCastDetails,
      }}
    >
      {children}
    </CastContext.Provider>
  );
}
