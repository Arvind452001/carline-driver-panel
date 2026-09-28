export type ApplicationStatus = 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED' | 'ACTIVATED';

export interface Application {
  id: string;
  status: ApplicationStatus;
  submittedAt: string;
  updatedAt: string;
  rejectionReason?: string;
  timeline: {
    status: ApplicationStatus;
    date: string;
    note?: string;
  }[];
}