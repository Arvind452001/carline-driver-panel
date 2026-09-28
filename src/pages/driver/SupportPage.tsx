import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { api } from '@/services/api';

const ticketSchema = z.object({
  subject: z.string().min(5),
  category: z.string().min(1),
  description: z.string().min(10),
});

export function SupportPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const { register, handleSubmit, reset } = useForm({
    resolver: zodResolver(ticketSchema),
  });

  const onSubmit = async (data: any) => {
    await api.createSupportTicket(data);
    alert('Ticket submitted');
    reset();
    // Refresh tickets
    const updated = await api.getSupportTickets();
    setTickets(updated);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-navy">Support</h2>
      <div className="card">
        <h3 className="font-semibold mb-4">Submit a Ticket</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label>Subject</label>
            <input {...register('subject')} className="input-field" />
          </div>
          <div>
            <label>Category</label>
            <select {...register('category')} className="input-field">
              <option value="">Select</option>
              <option value="account">Account</option>
              <option value="payments">Payments</option>
              <option value="trips">Trips</option>
              <option value="documents">Documents</option>
              <option value="vehicle">Vehicle</option>
              <option value="technical">Technical Issues</option>
            </select>
          </div>
          <div>
            <label>Description</label>
            <textarea {...register('description')} rows={4} className="input-field" />
          </div>
          <button type="submit" className="btn-primary">Submit Ticket</button>
        </form>
      </div>
      <div className="card">
        <h3 className="font-semibold mb-4">Previous Tickets</h3>
        <table className="min-w-full divide-y divide-gray-200">
          <thead><tr><th>Ticket ID</th><th>Subject</th><th>Status</th><th>Created</th></tr></thead>
          <tbody>
            {tickets.map((t) => (
              <tr key={t.id}><td>{t.id}</td><td>{t.subject}</td><td><span className="badge badge-info">{t.status}</span></td><td>{t.created}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}