"use client";
import { Children } from "@/lib/types/children";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

function useNetwork() {
  const superWindow = typeof window !== "undefined" && window.navigator.onLine;
  const [isOnline, setNetwork] = useState<boolean>(superWindow);
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
  const connectivityStatusRef = useRef<boolean | null>(null);
  useEffect(() => {
    if (!isOnline) {
      connectivityStatusRef.current = isOnline;
      toast.warning("You are offline!");
    }
    if (isOnline && connectivityStatusRef.current === false) {
      connectivityStatusRef.current = isOnline;
      toast.success("You are online!");
    }
  }, [isOnline]);
  return children;
}
