"use client";
import { useEffect } from "react";
import { ProjectSignal } from "@/lib/signals/signal";

export default function Home() {
  useEffect(() => {
    ProjectSignal.value.click();
  }, []);
  return null;
}
