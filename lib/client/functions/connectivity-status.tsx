"use client";
import { useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";

export default function ConnectivityStatus() {
  const isOnline = useRef<boolean | null>(null);
  const checkConnectivity = useCallback(() => {
    if (!navigator.onLine) {
      isOnline.current = false;
      toast.warning("You are offline!");
    }
    if (navigator.onLine && isOnline.current === false) {
      isOnline.current = true;
      toast.success("You are online now!");
    }
  }, []);
  useEffect(() => {
    checkConnectivity();
    return () => {
      checkConnectivity();
    };
  }, [checkConnectivity]);
  return null;
}
