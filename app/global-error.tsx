"use client"; // Error components must be Client Components

import { useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    toast(error.name, {
      description: error.message,
    });
  }, [error]);

  return (
    <html lang="en">
      <head>
        <title>Error</title>
      </head>
      <body>
        <div className="h-screen w-full flex justify-center items-center flex-col gap-5">
          <h2>Something went wrong!</h2>
          <Button onClick={reset}>Try again</Button>
        </div>
      </body>
    </html>
  );
}
