'use client';

import { useToastStore, type ToastType } from '@/stores/toast-store';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export function Toaster() {
  const { toasts, removeToast } = useToastStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[9999] flex flex-col gap-3 w-full max-w-md px-4 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }: { toast: any; onRemove: () => void }) {
  const icons = {
    success: <CheckCircle className="w-5 h-5 text-emerald-500" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };

  const bgColors = {
    success: 'bg-emerald-50 border-emerald-100 dark:bg-emerald-900/20 dark:border-emerald-900/30',
    error: 'bg-red-50 border-red-100 dark:bg-red-900/20 dark:border-red-900/30',
    warning: 'bg-amber-50 border-amber-100 dark:bg-amber-900/20 dark:border-amber-900/30',
    info: 'bg-blue-50 border-blue-100 dark:bg-blue-900/20 dark:border-blue-900/30',
  };

  return (
    <div
      className={cn(
        'pointer-events-auto flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border shadow-lg animate-slide-up-fade backdrop-blur-md',
        bgColors[toast.type as ToastType] || bgColors.info
      )}
    >
      <div className="flex items-center gap-3">
        {icons[toast.type as ToastType] || icons.info}
        <p className="text-sm font-medium text-surface-900 dark:text-surface-50">
          {toast.message}
        </p>
      </div>
      <button
        onClick={onRemove}
        className="p-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
      >
        <X className="w-4 h-4 text-surface-400 hover:text-surface-900 dark:hover:text-surface-50" />
      </button>
    </div>
  );
}
