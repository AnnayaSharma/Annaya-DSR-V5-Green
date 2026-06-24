import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingSpinner: React.FC<{ message?: string }> = ({
  message = 'Discovering your collection…',
}) => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
    <Loader2 className="animate-spin text-emerald-800" size={40} />
    <p className="text-emerald-900/60 font-serif italic">{message}</p>
  </div>
);

export default LoadingSpinner;
