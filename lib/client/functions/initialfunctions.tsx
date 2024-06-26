'use client';
import { useEffect } from 'react';
// @ts-ignore
import { toast } from 'sonner';

export function SpotifyTip() {
  useEffect(() => {
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
  }, []);
  return null;
}
