import { useMemo } from 'react';

const formattedDate = (jobDate: string) => {
  const date = new Date(jobDate);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export default formattedDate;
