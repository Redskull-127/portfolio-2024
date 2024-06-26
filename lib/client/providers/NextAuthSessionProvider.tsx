'use client';

import { SessionProvider } from 'next-auth/react';
import { useEffect, useCallback } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { Children } from '@/lib/types/children';
import { toast } from 'sonner';
export default function NextAuthProvider({ children }: Children) {
  return (
    <SessionProvider>
      <ShowAuthStatus>{children}</ShowAuthStatus>
    </SessionProvider>
  );
}

export function ShowAuthStatus({ children }: Children) {
  const { data: session, status } = useSession();

  const showStatus = useCallback(() => {
    switch (status) {
      case 'authenticated':
        toast('You are now logged in!', {
          description: `Welcome ${session?.user?.name}`,
        });
        break;
      case 'unauthenticated':
        toast('You are not signed in!', {
          description: `Please sign in to continue`,
          action: {
            label: 'Sign In',
            onClick: () => {
              signIn('google');
            },
          },
        });
        break;
      case 'loading':
        toast('Logging you in...', {
          description: `Please wait`,
        });
        break;
      default:
        break;
    }
  }, [session?.user?.name, status]);

  useEffect(() => {
    showStatus();
    return () => {
      showStatus();
    };
  }, [showStatus]);

  return <>{children}</>;
}
