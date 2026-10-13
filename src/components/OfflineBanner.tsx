import React, { useState } from 'react';
import { WifiOff, Wifi, CheckCircle2, X } from 'lucide-react';

interface OfflineBannerProps {
  isOnline: boolean;
  hasChanged?: boolean;
}

export const OfflineBanner: React.FC<OfflineBannerProps> = ({ isOnline, hasChanged }) => {
  const [dismissed, setDismissed] = useState(false);

  // If online and no recent change, show nothing
  if (isOnline && !hasChanged) return null;
  if (!isOnline && dismissed) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="w-full transition-all duration-300"
    >
      {!isOnline ? (
        <div className="bg-amber-500/10 border-b border-amber-500/30 px-4 py-2 flex items-center justify-between text-xs sm:text-sm text-amber-200">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Offline Mode Active:</strong> Calculator is 100% functional locally. AI Tutor will resume once back online.
            </span>
          </div>
          <button
            onClick={() => setDismissed(true)}
            aria-label="Dismiss offline banner"
            className="text-amber-400/80 hover:text-amber-200 p-1 rounded hover:bg-amber-500/20 transition-colors ml-2"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : hasChanged ? (
        <div className="bg-emerald-500/10 border-b border-emerald-500/30 px-4 py-2 flex items-center justify-between text-xs sm:text-sm text-emerald-200 animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <Wifi className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              <strong>Back Online:</strong> Full connection restored. AI Chatbot is ready.
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
};
