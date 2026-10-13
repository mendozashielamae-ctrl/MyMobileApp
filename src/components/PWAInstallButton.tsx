import React, { useState } from 'react';
import { Download, Share2, PlusSquare, X } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // If already running inside standalone PWA mode, don't show install buttons
  if (isInstalled) {
    return null;
  }

  return (
    <>
      {isInstallable && (
        <button
          onClick={install}
          aria-label="Install App for Offline Use"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-medium transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Install Offline App</span>
          <span className="sm:hidden">Install</span>
        </button>
      )}

      {isIOS && !isInstallable && (
        <button
          onClick={() => setShowIOSGuide(true)}
          aria-label="Install on iOS"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-medium transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-slate-400" />
          <span>Install PWA</span>
        </button>
      )}

      {showIOSGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-[#111827] border border-slate-700 p-6 shadow-2xl text-slate-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Download className="w-4 h-4 text-cyan-400" />
                Install on iPhone / iPad
              </h3>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="text-slate-400 hover:text-white p-1 rounded-md"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-3 text-xs leading-relaxed text-slate-300">
              <p className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400 font-bold">1</span>
                <span>
                  Tap the <strong className="text-white inline-flex items-center gap-1"><Share2 className="w-3.5 h-3.5 inline text-cyan-400" /> Share</strong> button located in the Safari toolbar.
                </span>
              </p>
              <p className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400 font-bold">2</span>
                <span>
                  Scroll down the action sheet and select <strong className="text-white inline-flex items-center gap-1"><PlusSquare className="w-3.5 h-3.5 inline text-cyan-400" /> Add to Home Screen</strong>.
                </span>
              </p>
              <p className="flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-cyan-500/20 text-cyan-400 font-bold">3</span>
                <span>
                  Launch OmniCalc directly from your home screen for full offline instant access.
                </span>
              </p>
            </div>

            <button
              onClick={() => setShowIOSGuide(false)}
              className="mt-5 w-full rounded-xl bg-slate-800 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}
    </>
  );
};
