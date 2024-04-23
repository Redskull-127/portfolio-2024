"use client";
import { usePathname, useRouter } from "next/navigation";

import { HomeIcon, RefreshCwIcon } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from "sonner";

export default function NotFoundClient() {
  const pathname = usePathname();
  const router = useRouter();
  return (
    <AlertDialog open={true}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>404 - Not Found!</AlertDialogTitle>
          <AlertDialogDescription>
            The path (
            <span className="font-mono text-sm font-bold text-red-500">
              {`"${pathname}"`}
            </span>
            ) you&apos;re looking for doesn&apos;t exist! <br />
            <span
              onClick={() => {
                return toast.success(
                  `Issued a warning regarding\n404 - Page Not Found - ("${pathname}")`,
                );
              }}
              className="font-mono text-sm font-bold text-red-500 cursor-pointer"
            >
              Click Here
            </span>{" "}
            to report if you find this as an issue!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertDialogAction>
                  <RefreshCwIcon
                    className="h-5 w-5"
                    onClick={() => router.refresh()}
                  />
                </AlertDialogAction>
              </TooltipTrigger>
              <TooltipContent>
                <p>Refresh current page!</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertDialogAction>
                  <HomeIcon
                    className="h-5 w-5"
                    onClick={() => router.push("/")}
                  />
                </AlertDialogAction>
              </TooltipTrigger>
              <TooltipContent>
                <p>Go to home!</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
