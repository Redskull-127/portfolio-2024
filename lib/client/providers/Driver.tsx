'use client';

import { Children } from '@/lib/types/children';
import { driver } from 'driver.js';
import DriverSteps from '@/lib/static/driver-steps.json';
import '@/styles/driver.css';

const Instance = driver({
  showProgress: true,
  steps: DriverSteps,
});

export const DriverProvider: React.FC<Children> = ({ children }: Children) => {
  return <>{children}</>;
};

export const StartDriver = () => {
  return (
    <button
      onClick={() => Instance.drive()}
      className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50"
    >
      <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
      <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
        Tour Website!
      </span>
    </button>
  );
};
