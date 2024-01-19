"use client";
import { Children } from "@/lib/types/children";
import { useState, useEffect, useRef } from "react";
import { toast } from "sonner";

function useNetwork() {
  const [isOnline, setNetwork] = useState(window.navigator.onLine);
  useEffect(() => {
    window.addEventListener("offline", () =>
      setNetwork(window.navigator.onLine)
    );
    window.addEventListener("online", () =>
      setNetwork(window.navigator.onLine)
    );
  });
  return isOnline;
}

export default function ConnectivityStatus({ children }: Children) {
  const isOnline = useNetwork();
  const connectivityStatus = useRef<boolean | null>(null);
  useEffect(() => {
    if (connectivityStatus.current === null) {
      connectivityStatus.current = isOnline;
    }
    if (connectivityStatus.current !== isOnline) {
      connectivityStatus.current = isOnline;
      if (isOnline) {
        toast("You are now online!", {
          description: `Welcome back`,
        });
      } else {
        toast("You are now offline!", {
          description: `Please check your internet connection`,
        });
      }
    }
  }, [isOnline]);
  return children;
}
