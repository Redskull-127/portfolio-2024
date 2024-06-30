'use client';
import { getTotalVisits } from '@/lib/server/google/apis/search-analytics';
import { useEffect, useState } from 'react';

export default function TotalViews() {
  const [totalViews, setTotalViews] = useState(0);

  useEffect(() => {
    getTotalVisits().then((total) => {
      if (total) setTotalViews(total);
    });

    return () => {
      setTotalViews(0);
    };
  }, []);

  return <span>{totalViews ? totalViews : 'Loading ...'}</span>;
}
