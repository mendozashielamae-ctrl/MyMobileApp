import React from 'react';
import { Sparkles, History } from 'lucide-react';
import { CalcMode } from '../types/calculator';

interface CalculatorKeypadProps {
  mode: CalcMode;
  onDigit: (digit: string) => void;
  onOperator: (op: string) => void;
  onFunction: (func: string) => void;
  onEquals: () => void;
  onClear: () => void;
  onToggleSign: () => void;
  onToggleMode: () => void;
  onToggleHistory: () => void;
  onOpenAiChat: () => void;
}

export const CalculatorKeypad: React.FC<CalculatorKeypadProps> = ({
  mode,
  onDigit,
  onOperator,
  onFunction,
  onEquals,
  onClear,
  onToggleSign,
  onToggleMode,
  onToggleHistory,
  onOpenAiChat,
}) => {
  return (
    <div className="w-full flex flex-col gap-2.5 sm:gap-3">
      {/* Keypad Toolbar: Mode Switch, History, AI Shortcut */}
      <div className="flex items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-1.5">
          <button
            onClick={onToggleMode}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
              mode === 'scientific'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            {mode === 'scientific' ? 'Scientific Keys ▲' : 'Scientific Keys ▼'}
          </button>

          <button
            onClick={onToggleHistory}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors"
            title="Open calculation history"
          >
            <History className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden sm:inline">History</span>
          </button>
        </div>

        {/* Quick AI Tutor Keypad Shortcut */}
        <button
          onClick={onOpenAiChat}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 hover:from-cyan-500/30 hover:to-indigo-500/30 border border-cyan-500/40 text-cyan-300 text-xs font-semibold shadow-sm transition-all active:scale-95"
          title="Ask AI Math Tutor about this calculation"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Ask AI</span>
        </button>
      </div>

      {/* Scientific Row Grid (Expanded when scientific mode is on) */}
      {mode === 'scientific' && (
        <div className="grid grid-cols-5 gap-1.5 sm:gap-2 p-2 sm:p-2.5 bg-slate-900/60 border border-slate-800 rounded-2xl animate-in slide-in-from-top-2 duration-200">
          <button
            onClick={() => onFunction('sin(')}
            className="h-10 sm:h-11 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-cyan-300 font-medium text-xs sm:text-sm active:scale-95 transition-all shadow-sm flex items-center justify-center"
          >
            sin
          </button>
          <button
            onClick={() => onFunction('cos(')}
            className="h-10 sm:h-11 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-cyan-300 font-medium text-xs sm:text-sm active:scale-95 transition-all shadow-sm flex items-center justify-center"
          >
            cos
          </button>
          <button
            onClick={() => onFunction('tan(')}
            className="h-10 sm:h-11 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-cyan-300 font-medium text-xs sm:text-sm active:scale-95 transition-all shadow-sm flex items-center justify-center"
          >
            tan
          </button>
          <button
            onClick={() => onDigit('π')}
            className="h-10 sm:h-11 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-medium text-xs sm:text-sm active:scale-95 transition-all shadow-sm flex items-center justify-center"
          >
            π
          </button>
          <button
            onClick={() => onDigit('e')}
            className="h-10 sm:h-11 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 font-medium text-xs sm:text-sm active:scale-95 transition-all shadow-sm flex items-center justify-center"
          >
            e
          </button>

          <button
            onClick={() => onFunction('ln(')}
            className="h-10 sm:h-11 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-cyan-300 font-medium text-xs sm:text-sm active:scale-95 transition-all shadow-sm flex items-center justify-center"
          >
            ln
          </button>
          <button
            onClick={() => onFunction('log(')}
            className="h-10 sm:h-11 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-cyan-300 font-medium text-xs sm:text-sm active:scale-95 transition-all shadow-sm flex items-center justify-center"
          >
            log
          </button>
          <button
            onClick={() => onFunction('√(')}
            className="h-10 sm:h-11 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-cyan-300 font-medium text-xs sm:text-sm active:scale-95 transition-all shadow-sm flex items-center justify-center"
          >
            √
          </button>
          <button
            onClick={() => onOperator('^')}
            className="h-10 sm:h-11 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-cyan-300 font-medium text-xs sm:text-sm active:scale-95 transition-all shadow-sm flex items-center justify-center"
          >
            xʸ
          </button>
          <button
            onClick={() => onOperator('!')}
            className="h-10 sm:h-11 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-cyan-300 font-medium text-xs sm:text-sm active:scale-95 transition-all shadow-sm flex items-center justify-center"
          >
            x!
          </button>
        </div>
      )}

      {/* Primary Keypad Grid */}
      <div className="grid grid-cols-4 gap-2 sm:gap-2.5">
        {/* Row 1 */}
        <button
          onClick={onClear}
          className="h-12 sm:h-14 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-bold text-base sm:text-lg border border-rose-500/20 active:scale-95 transition-all flex items-center justify-center"
        >
          C
        </button>
        <button
          onClick={() => onDigit('(')}
          className="h-12 sm:h-14 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-bold text-base sm:text-lg border border-slate-700/50 active:scale-95 transition-all flex items-center justify-center"
        >
          (
        </button>
        <button
          onClick={() => onDigit(')')}
          className="h-12 sm:h-14 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 font-bold text-base sm:text-lg border border-slate-700/50 active:scale-95 transition-all flex items-center justify-center"
        >
          )
        </button>
        <button
          onClick={() => onOperator('÷')}
          className="h-12 sm:h-14 rounded-2xl bg-indigo-600/90 hover:bg-indigo-500 text-white font-bold text-xl sm:text-2xl border border-indigo-500/50 shadow-md shadow-indigo-600/20 active:scale-95 transition-all flex items-center justify-center"
        >
          ÷
        </button>

        {/* Row 2 */}
        <button
          onClick={() => onDigit('7')}
          className="h-12 sm:h-14 rounded-2xl bg-[#1e293b]/90 hover:bg-slate-700 text-slate-100 font-bold text-lg sm:text-xl border border-slate-700/40 shadow-sm active:scale-95 transition-all flex items-center justify-center"
        >
          7
        </button>
        <button
          onClick={() => onDigit('8')}
          className="h-12 sm:h-14 rounded-2xl bg-[#1e293b]/90 hover:bg-slate-700 text-slate-100 font-bold text-lg sm:text-xl border border-slate-700/40 shadow-sm active:scale-95 transition-all flex items-center justify-center"
        >
          8
        </button>
        <button
          onClick={() => onDigit('9')}
          className="h-12 sm:h-14 rounded-2xl bg-[#1e293b]/90 hover:bg-slate-700 text-slate-100 font-bold text-lg sm:text-xl border border-slate-700/40 shadow-sm active:scale-95 transition-all flex items-center justify-center"
        >
          9
        </button>
        <button
          onClick={() => onOperator('×')}
          className="h-12 sm:h-14 rounded-2xl bg-indigo-600/90 hover:bg-indigo-500 text-white font-bold text-xl sm:text-2xl border border-indigo-500/50 shadow-md shadow-indigo-600/20 active:scale-95 transition-all flex items-center justify-center"
        >
          ×
        </button>

        {/* Row 3 */}
        <button
          onClick={() => onDigit('4')}
          className="h-12 sm:h-14 rounded-2xl bg-[#1e293b]/90 hover:bg-slate-700 text-slate-100 font-bold text-lg sm:text-xl border border-slate-700/40 shadow-sm active:scale-95 transition-all flex items-center justify-center"
        >
          4
        </button>
        <button
          onClick={() => onDigit('5')}
          className="h-12 sm:h-14 rounded-2xl bg-[#1e293b]/90 hover:bg-slate-700 text-slate-100 font-bold text-lg sm:text-xl border border-slate-700/40 shadow-sm active:scale-95 transition-all flex items-center justify-center"
        >
          5
        </button>
        <button
          onClick={() => onDigit('6')}
          className="h-12 sm:h-14 rounded-2xl bg-[#1e293b]/90 hover:bg-slate-700 text-slate-100 font-bold text-lg sm:text-xl border border-slate-700/40 shadow-sm active:scale-95 transition-all flex items-center justify-center"
        >
          6
        </button>
        <button
          onClick={() => onOperator('−')}
          className="h-12 sm:h-14 rounded-2xl bg-indigo-600/90 hover:bg-indigo-500 text-white font-bold text-xl sm:text-2xl border border-indigo-500/50 shadow-md shadow-indigo-600/20 active:scale-95 transition-all flex items-center justify-center"
        >
          −
        </button>

        {/* Row 4 */}
        <button
          onClick={() => onDigit('1')}
          className="h-12 sm:h-14 rounded-2xl bg-[#1e293b]/90 hover:bg-slate-700 text-slate-100 font-bold text-lg sm:text-xl border border-slate-700/40 shadow-sm active:scale-95 transition-all flex items-center justify-center"
        >
          1
        </button>
        <button
          onClick={() => onDigit('2')}
          className="h-12 sm:h-14 rounded-2xl bg-[#1e293b]/90 hover:bg-slate-700 text-slate-100 font-bold text-lg sm:text-xl border border-slate-700/40 shadow-sm active:scale-95 transition-all flex items-center justify-center"
        >
          2
        </button>
        <button
          onClick={() => onDigit('3')}
          className="h-12 sm:h-14 rounded-2xl bg-[#1e293b]/90 hover:bg-slate-700 text-slate-100 font-bold text-lg sm:text-xl border border-slate-700/40 shadow-sm active:scale-95 transition-all flex items-center justify-center"
        >
          3
        </button>
        <button
          onClick={() => onOperator('+')}
          className="h-12 sm:h-14 rounded-2xl bg-indigo-600/90 hover:bg-indigo-500 text-white font-bold text-xl sm:text-2xl border border-indigo-500/50 shadow-md shadow-indigo-600/20 active:scale-95 transition-all flex items-center justify-center"
        >
          +
        </button>

        {/* Row 5 */}
        <button
          onClick={onToggleSign}
          className="h-12 sm:h-14 rounded-2xl bg-[#1e293b]/90 hover:bg-slate-700 text-slate-300 font-bold text-base sm:text-lg border border-slate-700/40 shadow-sm active:scale-95 transition-all flex items-center justify-center"
        >
          ±
        </button>
        <button
          onClick={() => onDigit('0')}
          className="h-12 sm:h-14 rounded-2xl bg-[#1e293b]/90 hover:bg-slate-700 text-slate-100 font-bold text-lg sm:text-xl border border-slate-700/40 shadow-sm active:scale-95 transition-all flex items-center justify-center"
        >
          0
        </button>
        <button
          onClick={() => onDigit('.')}
          className="h-12 sm:h-14 rounded-2xl bg-[#1e293b]/90 hover:bg-slate-700 text-slate-100 font-bold text-lg sm:text-xl border border-slate-700/40 shadow-sm active:scale-95 transition-all flex items-center justify-center"
        >
          .
        </button>
        <button
          onClick={onEquals}
          className="h-12 sm:h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-sky-400 hover:from-cyan-400 hover:to-sky-300 text-slate-950 font-bold text-2xl border border-cyan-300 shadow-lg shadow-cyan-500/25 active:scale-95 transition-all flex items-center justify-center"
        >
          =
        </button>
      </div>
    </div>
  );
};
