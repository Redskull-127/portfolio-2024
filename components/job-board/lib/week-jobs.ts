import { AllJobs } from '../types';

export function getWeeklyApplications(jobsApplied: AllJobs) {
  const today = new Date();
  const currentMonth = today.getMonth(); // 0-based month index (0 = January)
  const currentYear = today.getFullYear();

  // Initialize an array to store counts for each week (4 weeks in a month)
  const weeks = [0, 0, 0, 0];

  // Iterate over jobs and count them based on the week of the month
  jobsApplied.forEach((job) => {
    const jobDate = new Date(job.date);
    const jobMonth = jobDate.getMonth();
    const jobYear = jobDate.getFullYear();
    const jobDay = jobDate.getDate();

    // Only count jobs that were applied in the current month and year
    if (jobMonth === currentMonth && jobYear === currentYear) {
      if (jobDay <= 7) {
        weeks[0]++; // First week
      } else if (jobDay <= 14) {
        weeks[1]++; // Second week
      } else if (jobDay <= 21) {
        weeks[2]++; // Third week
      } else {
        weeks[3]++; // Fourth week
      }
    }
  });

  return weeks;
}
