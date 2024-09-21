import { ColumnId } from '../kanban-board';

export type Job = {
  id: number;
  userEmail: string;
  columnId: ColumnId;
  title: string;
  company: string;
  companyURL?: string;
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
  uuid: string;
};

export type AllJobs = Job[];
