"use client";
import { useEffect, useState } from "react";

export function ActionCharacter() {
  const [action, setAction] = useState<String>();
  useEffect(() => {
    if (
      navigator.platform.indexOf("Mac") === 0 ||
      navigator.platform === "iPhone"
    ) {
      setAction("⌘");
    } else {
      setAction("CTRL");
    }
  }, []);
  return action!;
}
