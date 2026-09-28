export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'earning' | 'payout' | 'incentive';
  paymentMethod: 'Cash' | 'UPI' | 'Bank Transfer' | 'Bonus';
  status: 'Completed' | 'Pending' | 'Failed';
}