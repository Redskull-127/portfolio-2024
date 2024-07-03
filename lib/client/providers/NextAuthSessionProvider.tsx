'use client';

import { SessionProvider } from 'next-auth/react';
import { useEffect, useCallback } from 'react';
import { useSession, signIn } from 'next-auth/react';
import { Children } from '@/lib/types/children';
import { toast } from 'sonner';
import { useIntroContext } from './intro-provider';

const IntroTips = () => {
  toast(
    <div>
      {' '}
      <h1>❔ Did you know?</h1>
      <div className="inline-flex">
        Press{' '}
        <pre>
          <code> CTRL + K </code>
        </pre>{' '}
        to open the command bar!
      </div>{' '}
    </div>,
  );
};

export default function NextAuthProvider({ children }: Children) {
  return (
    <SessionProvider>
      <ShowAuthStatus>{children}</ShowAuthStatus>
    </SessionProvider>
  );
}

export function ShowAuthStatus({ children }: Children) {
  const { data: session, status } = useSession();
  const { isIntroOpen } = useIntroContext();
  const showStatus = useCallback(() => {
    switch (status) {
      case 'authenticated':
        toast('You are now logged in!', {
          description: `Welcome ${session?.user?.name}`,
        });
        IntroTips();
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
        IntroTips();
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
    console.log('isIntroOpen', isIntroOpen);
    if (!isIntroOpen) {
      showStatus();
    }
  }, [isIntroOpen, showStatus]);

  return <>{children}</>;
}
