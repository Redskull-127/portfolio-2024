"use client";

import { SessionProvider } from "next-auth/react";
import { useEffect, useCallback } from "react";
import { useSession, signIn } from "next-auth/react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Children } from "@/lib/types/children";

export default function NextAuthProvider({ children }: Children) {
  return (
    <SessionProvider>
      <ShowAuthStatus>{children}</ShowAuthStatus>
    </SessionProvider>
  );
}

export function ShowAuthStatus({ children }: Children) {
  const { toast } = useToast();
  const { data: session, status } = useSession();

  const showStatus = useCallback(() => {
    switch (status) {
      case "authenticated":
        toast({
          title: "You are now logged in!",
          description: `Welcome ${session?.user?.name}`,
        });
        break;
      case "unauthenticated":
        toast({
          title: "You are not signed in!",
          description: `Please sign in to continue`,
          action: (
            <Button
              variant={"ghost"}
              onClick={() => {
                signIn("google");
              }}
            >
              Sign in
            </Button>
          ),
        });
        break;
      case "loading":
        toast({
          title: "Logging you in...",
          description: `Please wait`,
        });
        break;
      default:
        break;
    }
  }, [session?.user?.name, status, toast]);

  useEffect(() => {
    showStatus();
    return () => {
      showStatus();
    };
  }, [showStatus]);

  return <>{children}</>;
}
