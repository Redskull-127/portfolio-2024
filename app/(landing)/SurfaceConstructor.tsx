"use client";

import { useCallback, useEffect, useRef } from "react";

interface SurfaceEmbedInstance {
  popupSize?: "small" | "medium" | "large";
  embedSurfaceForm(): void;
  showSurfaceForm(): void;
}

interface SurfaceEmbedConstructor {
  new (formUrl: string, mode: string, buttonId: string): SurfaceEmbedInstance;
}

declare global {
  var SurfaceEmbed: SurfaceEmbedConstructor;
}

export interface SurfaceFormProps {
  formUrl: string;
  embedType?: "popup" | "inline" | "slideover" | "widget";
  popupSize?: "small" | "medium" | "large";
  buttonClassName?: string;
}

export default function SurfaceFormScript({
  formUrl,
  embedType = "popup",
  popupSize = "medium",
  buttonClassName = "surface-form-button",
}: SurfaceFormProps) {
  const instanceRef = useRef<SurfaceEmbedInstance | null>(null);
  const isInitializedRef = useRef(false);

  const initializeSurfaceForm = useCallback(() => {
    if (isInitializedRef.current || !formUrl) return;

    try {
      if (typeof SurfaceEmbed === "undefined") {
        console.warn(
          "SurfaceEmbed is not available. Make sure the script is loaded."
        );
        return;
      }

      const surfaceInstance = new SurfaceEmbed(
        formUrl,
        embedType,
        buttonClassName
      );

      surfaceInstance.popupSize = popupSize;
      surfaceInstance.embedSurfaceForm();

      instanceRef.current = surfaceInstance;
      isInitializedRef.current = true;
    } catch (error) {
      console.error("Failed to initialize SurfaceForm:", error);
    }
  }, [formUrl, popupSize, embedType, buttonClassName]);

  useEffect(() => {
    initializeSurfaceForm();

    return () => {
      instanceRef.current = null;
      isInitializedRef.current = false;
    };
  }, [initializeSurfaceForm]);

  return null;
}