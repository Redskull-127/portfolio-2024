"use client";
import { Children } from "@/lib/types/children";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

function useNetwork() {
  const [isOnline, setNetwork] = useState<boolean>();
  useEffect(() => {
    if (!window) return;
    window.addEventListener("offline", () =>
      setNetwork(window.navigator.onLine)
    );
    window.addEventListener("online", () =>
      setNetwork(window.navigator.onLine)
    );
    return () => {
      window.removeEventListener("offline", () =>
        setNetwork(window.navigator.onLine)
      );
      window.removeEventListener("online", () =>
        setNetwork(window.navigator.onLine)
      );
    };
  });
  return isOnline;
}

export default function ConnectivityStatus({ children }: Children) {
  const isOnline = useNetwork();
  const connectivityStatusRef = useRef<boolean | null >(null);
  useEffect(() => {
    if (connectivityStatusRef.current === null) {
    connectivityStatusRef.current = isOnline ?? null;
    }
    if (connectivityStatusRef.current !== isOnline) {
      connectivityStatusRef.current = isOnline ?? null;
      if (isOnline) {
        toast.success("You are now online!", {
          description: `Welcome back`,
        });
      } else {
        toast.warning("You are now offline!", {
          description: `Please check your internet connection`,
        });
      }
    }
  }, [isOnline]);
  return children;
}
