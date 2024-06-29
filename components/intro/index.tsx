'use client';
import { useState, useEffect } from 'react';
import IntroDialog from './intro-dialog';
export default function IntroProvider() {
  const [intro, setIntro] = useState(false);

  useEffect(() => {
    const intro = localStorage.getItem('intro-visited');
    if (!intro) {
      setIntro(true);
    }
  }, []);

  if (!intro) return null;
  if (intro) {
    return <IntroDialog />;
  }
  return null;
}
