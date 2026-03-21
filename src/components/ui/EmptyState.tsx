import { AlertCircle, CheckCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export default function EmptyState({ icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-16 text-center', className)}>
      {icon && <div className="mb-4 text-surface-300 dark:text-surface-600">{icon}</div>}
      <h3 className="text-lg font-semibold text-surface-700 dark:text-surface-100 mb-1">{title}</h3>
      {description && <p className="text-surface-500 dark:text-surface-300 text-sm max-w-sm mb-6">{description}</p>}
      {action}
    </div>
  );
}

// Alert component
interface AlertProps {
  variant?: 'info' | 'success' | 'error';
  children: React.ReactNode;
  className?: string;
}

export function Alert({ variant = 'info', children, className }: AlertProps) {
  const styles = {
    info: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/50 text-blue-800 dark:text-blue-200',
    success: 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-200',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800/50 text-red-800 dark:text-red-200',
  };

  const icons = {
    info: <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />,
    success: <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />,
  };

  return (
    <div className={cn('flex items-start gap-3 p-4 rounded-xl border', styles[variant], className)}>
      {icons[variant]}
      <div className="text-sm">{children}</div>
    </div>
  );
}
