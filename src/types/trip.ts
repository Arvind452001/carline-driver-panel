export interface Trip {
  id: string;
  date: string;
  pickup: string;
  drop: string;
  distance: number; // km
  amount: number;
  paymentMethod: 'Cash' | 'UPI' | 'Card';
  status: 'Completed' | 'Cancelled' | 'Pending';
  rating?: number;
  passenger?: string;
}