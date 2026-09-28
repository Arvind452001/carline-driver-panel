import { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, XCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastProps) {
  if (!toasts.length) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full px-4">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: ToastMessage;
  onDismiss: (id: string) => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id);
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast.id, onDismiss]);

  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-500 flex-shrink-0" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0" />;
      default:
        return <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />;
    }
  };

  const getBgClass = () => {
    switch (toast.type) {
      case 'success':
        return 'bg-white border-emerald-200 text-slate-800 shadow-emerald-100/50';
      case 'error':
        return 'bg-white border-red-200 text-slate-800 shadow-red-100/50';
      case 'warning':
        return 'bg-white border-amber-200 text-slate-800 shadow-amber-100/50';
      default:
        return 'bg-white border-blue-200 text-slate-800 shadow-blue-100/50';
    }
  };

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg transition-all duration-300 animate-fade-in ${getBgClass()}`}
    >
      <div className="mt-0.5">{getIcon()}</div>
      <div className="flex-1 text-sm font-medium text-slate-700 leading-snug">
        {toast.message}
      </div>
      <button
        onClick={() => onDismiss(toast.id)}
        className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 rounded-lg hover:bg-slate-100"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
