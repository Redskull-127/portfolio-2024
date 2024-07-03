'use client';
import { useState, useEffect } from 'react';
import IntroDialog from './intro-dialog';
import { usePathname } from 'next/navigation';
import { useIntroContext } from '@/lib/client/providers/intro-provider';
export default function IntroProvider() {
  const path = usePathname();
  const [intro, setIntro] = useState(false);
  const { setIsIntroOpen } = useIntroContext();

  useEffect(() => {
    const intro = localStorage.getItem('intro-visited');
    if ((!intro || intro === 'false') && path === '/') {
      setIntro(true);
    }
    if (intro === 'true') {
      setIsIntroOpen(false);
    }
  }, [path, setIsIntroOpen]);

  if (!intro) return null;
  if (intro) {
    return <IntroDialog />;
  }
  return null;
}
