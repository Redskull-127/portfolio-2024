export type Job = {
  id: number;
  userId: number;
  title: string;
  company: string;
  jobType:
    | 'Internship'
    | 'Full-time'
    | 'Part-time'
    | 'Contract'
    | 'Temporary'
    | 'Freelance';
  description: string;
  location: 'Remote' | string;
  salary?: string;
  applyLink: string;
  date: string;
  contactEmail?: string;
  contactName?: string;
  contactLink?: string;
};

export type AllJobs = Job[];
