'use client';
import { useState, useEffect } from 'react';
import IntroDialog from './intro-dialog';
import { usePathname } from 'next/navigation';
export default function IntroProvider() {
  const path = usePathname();
  const [intro, setIntro] = useState(false);

  useEffect(() => {
    const intro = localStorage.getItem('intro-visited');
    if ((!intro || intro === 'false') && path === '/') {
      setIntro(true);
    }
  }, [path]);

  if (!intro) return null;
  if (intro) {
    return <IntroDialog />;
  }
  return null;
}
