import React from 'react';
import { History, Trash2, X, ArrowUpLeft, Copy, Check } from 'lucide-react';
import { CalculationRecord } from '../types/calculator';

interface HistoryDrawerProps {
  isOpen: boolean;
  history: CalculationRecord[];
  onClose: () => void;
  onSelectRecord: (record: CalculationRecord) => void;
  onClearHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  history,
  onClose,
  onSelectRecord,
  onClearHistory,
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (id: string, text: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-sm sm:max-w-md h-full bg-[#111827] border-l border-slate-800 flex flex-col text-slate-100 shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-bold text-white">Calculation History</h2>
          </div>
          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                aria-label="Clear all calculation history"
                title="Clear all history"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              aria-label="Close history drawer"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* History List Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {history.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500">
              <History className="w-12 h-12 stroke-[1.2] mb-3 text-slate-600" />
              <p className="text-sm font-medium text-slate-300">No calculations recorded yet</p>
              <p className="text-xs text-slate-500 mt-1 max-w-[200px]">
                Calculations you complete with the '=' key will automatically appear here.
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                onClick={() => onSelectRecord(item)}
                className="group p-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800/80 hover:border-cyan-500/30 transition-all cursor-pointer relative"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="text-xs font-mono text-slate-400 break-all line-clamp-2">
                    {item.expression}
                  </span>
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 shrink-0">
                    <button
                      onClick={(e) => handleCopy(item.id, item.result, e)}
                      aria-label="Copy result to clipboard"
                      className="p-1 rounded text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
                      title="Copy result"
                    >
                      {copiedId === item.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <span
                      title="Restore into calculator"
                      className="p-1 rounded text-cyan-400 hover:text-cyan-300 hover:bg-cyan-500/10"
                    >
                      <ArrowUpLeft className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                <div className="mt-1 text-right">
                  <span className="text-lg font-bold font-mono tabular-nums text-white group-hover:text-cyan-300 transition-colors">
                    = {item.result}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer info */}
        {history.length > 0 && (
          <div className="p-3 border-t border-slate-800/60 text-center text-[11px] text-slate-500">
            Tap any calculation to restore it to the keypad
          </div>
        )}
      </div>
    </div>
  );
};
