import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex items-center justify-center ${className || ''}`}>
      <Loader2 className={`${sizes[size]} animate-spin text-primary-600`} />
    </div>
  );
}

export function PageSpinner() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary-600 mx-auto" />
        <p className="text-surface-500 text-sm">Loading...</p>
      </div>
    </div>
  );
}
