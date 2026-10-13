import React from 'react';
import { Sparkles, HelpCircle, Wifi, WifiOff } from 'lucide-react';
import { PWAInstallButton } from './PWAInstallButton';

interface HeaderProps {
  isOnline: boolean;
  onOpenTour: () => void;
  onOpenAiChat: () => void;
}

export const Header: React.FC<HeaderProps> = ({ isOnline, onOpenTour, onOpenAiChat }) => {
  return (
    <header className="w-full border-b border-slate-800 bg-[#0b0f17]/90 backdrop-blur-md sticky top-0 z-30">
      <div className="max-w-4xl mx-auto px-4 h-14 sm:h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Single Text Wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-slate-950 font-black text-xs shadow-sm">
            Ω
          </div>
          <span className="text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap">
            OmniCalc <span className="text-cyan-400 font-medium text-xs sm:text-sm">AI</span>
          </span>
        </div>

        {/* Zone 2: Navigation Affordances & Status */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Status badge */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
              isOnline
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : 'bg-amber-500/10 border-amber-500/20 text-amber-300'
            }`}
          >
            {isOnline ? (
              <>
                <Wifi className="w-3 h-3 shrink-0" />
                <span className="hidden sm:inline">Online</span>
              </>
            ) : (
              <>
                <WifiOff className="w-3 h-3 shrink-0" />
                <span>Offline</span>
              </>
            )}
          </div>

          {/* Tour / Guide button */}
          <button
            onClick={onOpenTour}
            aria-label="View interactive walkthrough tour"
            title="Interactive Walkthrough"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 hover:bg-slate-850 transition-colors"
          >
            <HelpCircle className="w-4 h-4" />
            <span className="hidden sm:inline">Tour</span>
          </button>

          {/* PWA Install Button */}
          <PWAInstallButton />
        </div>

        {/* Zone 3: 1 Primary Action */}
        <div className="shrink-0">
          <button
            onClick={onOpenAiChat}
            aria-label="Open AI Math Tutor Assistant"
            className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-cyan-500/20 hover:brightness-110 active:scale-95 transition-all whitespace-nowrap"
          >
            <Sparkles className="w-4 h-4 fill-current text-slate-950" />
            <span>AI Tutor</span>
          </button>
        </div>
      </div>
    </header>
  );
};
