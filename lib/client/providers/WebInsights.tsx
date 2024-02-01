"use client";

import { useReportWebVitals } from "next/web-vitals";

export function WebVitals() {
  return useReportWebVitals((metric) => {
    console.log(metric);
  });
}
