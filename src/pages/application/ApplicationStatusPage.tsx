import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Clock, Loader2 } from 'lucide-react';
import { api } from '@/services/api';
import { Application, ApplicationStatus } from '@/types/application';

export function ApplicationStatusPage() {
  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.getApplicationStatus('DRV2026001234').then((data) => {
      setApplication(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>;
  if (!application) return <div>No application found.</div>;

  const statusMap: Record<ApplicationStatus, { label: string; icon: any; color: string }> = {
    PENDING: { label: 'Pending Review', icon: Clock, color: 'text-yellow-500' },
    UNDER_REVIEW: { label: 'Under Review', icon: Loader2, color: 'text-blue-500' },
    APPROVED: { label: 'Approved', icon: CheckCircle, color: 'text-green-500' },
    REJECTED: { label: 'Rejected', icon: XCircle, color: 'text-red-500' },
    ACTIVATED: { label: 'Activated', icon: CheckCircle, color: 'text-green-500' },
  };

  const current = statusMap[application.status];

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="card space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-navy">Application Status</h1>
            <p className="text-gray-500 text-sm">ID: {application.id}</p>
          </div>
          <div className={`flex items-center gap-2 ${current.color}`}>
            <current.icon className="w-5 h-5" />
            <span className="font-semibold">{current.label}</span>
          </div>
        </div>

        {/* Timeline */}
        <div className="relative pl-6 border-l-2 border-gray-200 space-y-6">
          {application.timeline.map((item, idx) => {
            const status = statusMap[item.status];
            const Icon = status.icon;
            return (
              <div key={idx} className="relative flex items-start gap-4">
                <div className={`absolute -left-9 w-4 h-4 rounded-full ${idx === application.timeline.length - 1 ? 'bg-primary-500' : 'bg-gray-300'}`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${status.color}`} />
                    <span className="font-medium">{status.label}</span>
                  </div>
                  <p className="text-sm text-gray-500">{new Date(item.date).toLocaleString()}</p>
                  {item.note && <p className="text-sm text-gray-600 mt-1">{item.note}</p>}
                </div>
              </div>
            );
          })}
        </div>

        {application.status === 'REJECTED' && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            <strong>Rejection Reason:</strong> {application.rejectionReason || 'Your driving license document could not be verified.'}
            <div className="flex gap-4 mt-3">
              <button className="btn-secondary text-sm">Update Application</button>
              <button className="btn-primary text-sm">Reapply</button>
            </div>
          </div>
        )}

        {application.status === 'APPROVED' && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-green-700">
            <strong>Congratulations!</strong> Your driver application has been approved.
            <button className="btn-primary mt-3" onClick={() => navigate('/dashboard')}>Activate Account</button>
          </div>
        )}
      </div>
    </div>
  );
}