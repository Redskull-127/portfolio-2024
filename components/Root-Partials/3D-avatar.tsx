'use client';
import Spline from '@splinetool/react-spline';
import { useState } from 'react';
import { Skeleton } from '../ui/skeleton';

export default function Avatar3D() {
  const [loading, setLoading] = useState(true);

  return (
    <div className="absolute size-[400px] max-xl:size-[280px] max-xl:top-10 object-fill overflow-hidden select-none">
      {loading && <Loading />}
      <Spline
        onLoad={() => setLoading(false)}
        style={{
          position: 'absolute',
          animation: 'fade-in 1s ease-in-out',
          userSelect: 'none',
        }}
        scene="https://prod.spline.design/47G-sHHwpZlB68OX/scene.splinecode"
      />
    </div>
  );
}

function Loading() {
  return (
    <div className="absolute size-[400px] max-xl:size-[280px] flex justify-center items-start">
      <Skeleton className="size-24 rounded-full" />
    </div>
  );
}
