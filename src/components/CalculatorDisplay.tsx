import React, { useState } from 'react';
import { Copy, Check, Delete, RotateCcw } from 'lucide-react';
import { CalcMode } from '../types/calculator';

interface CalculatorDisplayProps {
  expression: string;
  result: string;
  error?: string | null;
  mode: CalcMode;
  isDegree: boolean;
  onClear: () => void;
  onBackspace: () => void;
  onToggleDegree: () => void;
}

export const CalculatorDisplay: React.FC<CalculatorDisplayProps> = ({
  expression,
  result,
  error,
  mode,
  isDegree,
  onClear,
  onBackspace,
  onToggleDegree,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const textToCopy = error ? expression : result || expression || '0';
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="w-full bg-[#131b2e] border border-slate-700/60 rounded-2xl p-4 sm:p-5 shadow-inner relative flex flex-col justify-between min-h-[140px] sm:min-h-[160px]">
      {/* Top Bar inside Display: Badges & Actions */}
      <div className="flex items-center justify-between text-xs text-slate-400 pb-2">
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-medium uppercase tracking-wider text-[11px]">
            {mode === 'scientific' ? 'Scientific' : 'Standard'}
          </span>
          {mode === 'scientific' && (
            <button
              onClick={onToggleDegree}
              aria-label="Toggle Degree or Radian mode"
              className="px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-cyan-400 font-semibold text-[11px] transition-colors"
            >
              {isDegree ? 'DEG' : 'RAD'}
            </button>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={handleCopy}
            aria-label="Copy result"
            title="Copy result"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors flex items-center gap-1 text-[11px]"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-medium">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>

          <button
            onClick={onBackspace}
            aria-label="Backspace"
            title="Backspace"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <Delete className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onClear}
            aria-label="Clear entry"
            title="Clear entry (C)"
            className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors flex items-center gap-0.5 text-[11px] font-semibold"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>AC</span>
          </button>
        </div>
      </div>

      {/* Main Expression & Result Display Area */}
      <div className="flex flex-col justify-end text-right overflow-hidden py-1">
        {/* Upper Active Expression */}
        <div
          className="text-slate-400 font-mono tabular-nums text-sm sm:text-base tracking-wide overflow-x-auto scrollbar-none whitespace-nowrap min-h-[1.5rem]"
          title={expression || '0'}
        >
          {expression || '0'}
        </div>

        {/* Lower Evaluated Result or Error */}
        <div className="mt-1 flex items-baseline justify-end">
          {error ? (
            <span className="text-rose-400 text-lg sm:text-xl font-medium tracking-tight truncate">
              {error}
            </span>
          ) : (
            <span
              className="text-white font-mono tabular-nums font-bold tracking-tight text-3xl sm:text-4xl lg:text-5xl select-all overflow-x-auto scrollbar-none whitespace-nowrap max-w-full"
              title={result || '0'}
            >
              {result || '0'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
