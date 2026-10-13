/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { Sparkles } from 'lucide-react';
import { CalcMode, CalculationRecord, ChatMessage } from './types/calculator';
import { evaluateMathExpression } from './utils/mathEngine';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { Header } from './components/Header';
import { OfflineBanner } from './components/OfflineBanner';
import { CalculatorDisplay } from './components/CalculatorDisplay';
import { CalculatorKeypad } from './components/CalculatorKeypad';
import { HistoryDrawer } from './components/HistoryDrawer';
import { ChatbotDrawer } from './components/ChatbotDrawer';
import { OnboardingModal } from './components/OnboardingModal';

const HISTORY_STORAGE_KEY = 'omnicalc_history_v1';
const ONBOARDING_STORAGE_KEY = 'omnicalc_onboarding_completed';

export default function App() {
  const { isOnline, hasChanged } = useOnlineStatus();

  // Calculator State
  const [expression, setExpression] = useState<string>('');
  const [result, setResult] = useState<string>('0');
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<CalcMode>('standard');
  const [isDegree, setIsDegree] = useState<boolean>(true);

  // History State
  const [history, setHistory] = useState<CalculationRecord[]>(() => {
    try {
      const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Drawers & Modals
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [isOnboardingOpen, setIsOnboardingOpen] = useState<boolean>(() => {
    try {
      return localStorage.getItem(ONBOARDING_STORAGE_KEY) !== 'true';
    } catch {
      return false;
    }
  });

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoadingAi, setIsLoadingAi] = useState<boolean>(false);

  // Persist history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history.slice(0, 50)));
    } catch {
      // Storage unavailable
    }
  }, [history]);

  // Live evaluation effect: update preview as expression changes
  useEffect(() => {
    if (!expression || expression.trim() === '') {
      setResult('0');
      setError(null);
      return;
    }

    const evalResult = evaluateMathExpression(expression, isDegree);
    if (evalResult.success && evalResult.formatted) {
      setResult(evalResult.formatted);
      setError(null);
    } else {
      // While typing an incomplete expression (like "4 + "), do not flash error unless syntax is completely broken
      setError(null);
    }
  }, [expression, isDegree]);

  // Keypad Handlers
  const handleDigit = useCallback((digit: string) => {
    setError(null);
    setExpression((prev) => {
      // Don't allow multiple leading zeros
      if (prev === '0' && digit !== '.') return digit;
      return prev + digit;
    });
  }, []);

  const handleOperator = useCallback((op: string) => {
    setError(null);
    setExpression((prev) => {
      if (!prev && (op === '−' || op === '-')) return '−';
      if (!prev) return '0' + op;
      
      // If last char is an operator, replace it (unless it's negative sign or exponent)
      const lastChar = prev.slice(-1);
      if (['+', '−', '-', '×', '*', '÷', '/'].includes(lastChar)) {
        return prev.slice(0, -1) + op;
      }
      return prev + op;
    });
  }, []);

  const handleFunction = useCallback((fn: string) => {
    setError(null);
    setExpression((prev) => (prev === '0' ? fn : prev + fn));
  }, []);

  const handleClear = useCallback(() => {
    setExpression('');
    setResult('0');
    setError(null);
  }, []);

  const handleBackspace = useCallback(() => {
    setError(null);
    setExpression((prev) => {
      if (!prev || prev.length <= 1) return '';
      // Check for multi-character functions at end (sin(, cos(, tan(, log(, ln(, sqrt()
      const funcs = ['sin(', 'cos(', 'tan(', 'log(', 'ln(', '√('];
      for (const f of funcs) {
        if (prev.endsWith(f)) {
          return prev.slice(0, -f.length);
        }
      }
      return prev.slice(0, -1);
    });
  }, []);

  const handleToggleSign = useCallback(() => {
    setExpression((prev) => {
      if (!prev) return '−';
      if (prev.startsWith('−')) return prev.slice(1);
      if (prev.startsWith('-')) return prev.slice(1);
      return '−' + prev;
    });
  }, []);

  const handleEquals = useCallback(() => {
    if (!expression || expression.trim() === '') return;

    const evalResult = evaluateMathExpression(expression, isDegree);
    if (evalResult.success && evalResult.formatted) {
      const finalResult = evalResult.formatted;
      setResult(finalResult);
      setError(null);

      // Record in History
      const record: CalculationRecord = {
        id: Date.now().toString(),
        expression,
        result: finalResult,
        timestamp: Date.now(),
      };
      setHistory((prev) => [record, ...prev]);

      // Set evaluated result as current expression for continuation
      setExpression(finalResult);
    } else {
      setError(evalResult.error || 'Syntax Error');
    }
  }, [expression, isDegree]);

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in chat input
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      if (e.key >= '0' && e.key <= '9') {
        handleDigit(e.key);
      } else if (e.key === '.') {
        handleDigit('.');
      } else if (e.key === '+') {
        handleOperator('+');
      } else if (e.key === '-') {
        handleOperator('−');
      } else if (e.key === '*') {
        handleOperator('×');
      } else if (e.key === '/') {
        e.preventDefault();
        handleOperator('÷');
      } else if (e.key === '(' || e.key === ')') {
        handleDigit(e.key);
      } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        handleEquals();
      } else if (e.key === 'Backspace') {
        handleBackspace();
      } else if (e.key === 'Escape') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleDigit, handleOperator, handleEquals, handleBackspace, handleClear]);

  // History Selection
  const handleSelectRecord = (record: CalculationRecord) => {
    setExpression(record.expression);
    setResult(record.result);
    setError(null);
    setIsHistoryOpen(false);
  };

  const handleClearHistory = () => {
    setHistory([]);
    try {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch {
      // Ignore
    }
  };

  // Close Onboarding and persist
  const handleCloseOnboarding = () => {
    setIsOnboardingOpen(false);
    try {
      localStorage.setItem(ONBOARDING_STORAGE_KEY, 'true');
    } catch {
      // Ignore
    }
  };

  // Chat API Integration
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isLoadingAi) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoadingAi(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-6).map((m) => ({
            role: m.role,
            content: m.content,
          })),
          calculatorContext: {
            expression,
            result,
            mode,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to communicate with AI tutor');
      }

      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content: data.text,
        resultValue: data.resultValue || undefined,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err: any) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        content:
          err.message ||
          'Could not reach AI Tutor. If running offline, your standard calculator remains available.',
        isError: true,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoadingAi(false);
    }
  };

  // Inject AI result value into calculator
  const handleInsertResultToCalculator = (val: string) => {
    setExpression(val);
    setResult(val);
    setError(null);
    setIsChatOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/20">
      {/* Top Bar Header */}
      <Header
        isOnline={isOnline}
        onOpenTour={() => setIsOnboardingOpen(true)}
        onOpenAiChat={() => setIsChatOpen(true)}
      />

      {/* Network Status Offline Banner */}
      <OfflineBanner isOnline={isOnline} hasChanged={hasChanged} />

      {/* Main Viewport Container */}
      <main className="flex-1 flex flex-col items-center justify-center p-3 sm:p-6 lg:p-8">
        <div className="w-full max-w-md sm:max-w-lg bg-[#111827] border border-slate-800 rounded-3xl p-4 sm:p-6 shadow-2xl relative flex flex-col gap-4 sm:gap-5">
          {/* Subtle Ambient Glow */}
          <div className="absolute -top-12 -left-12 w-36 h-36 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-12 -right-12 w-36 h-36 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Calculator Display */}
          <CalculatorDisplay
            expression={expression}
            result={result}
            error={error}
            mode={mode}
            isDegree={isDegree}
            onClear={handleClear}
            onBackspace={handleBackspace}
            onToggleDegree={() => setIsDegree((prev) => !prev)}
          />

          {/* Calculator Keypad */}
          <CalculatorKeypad
            mode={mode}
            onDigit={handleDigit}
            onOperator={handleOperator}
            onFunction={handleFunction}
            onEquals={handleEquals}
            onClear={handleClear}
            onToggleSign={handleToggleSign}
            onToggleMode={() => setMode((prev) => (prev === 'standard' ? 'scientific' : 'standard'))}
            onToggleHistory={() => setIsHistoryOpen(true)}
            onOpenAiChat={() => setIsChatOpen(true)}
          />
        </div>

        {/* Offline & Keyboard Guide Footer Note */}
        <div className="mt-4 text-center text-xs text-slate-500 flex items-center justify-center gap-3">
          <span>Type numbers or use keypad</span>
          <span aria-hidden="true">·</span>
          <span>Offline PWA Ready</span>
          <span aria-hidden="true">·</span>
          <span>Tabular Math Precision</span>
        </div>
      </main>

      {/* Floating AI Chatbot Action Button (Bottom-Right) */}
      <button
        onClick={() => setIsChatOpen(true)}
        aria-label="Open AI Math Assistant"
        className="fixed bottom-5 right-5 z-30 flex items-center gap-2 p-3 sm:px-4 sm:py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 font-bold shadow-xl shadow-cyan-500/25 hover:brightness-110 active:scale-95 transition-all group"
      >
        <Sparkles className="w-5 h-5 fill-current text-slate-950" />
        <span className="hidden sm:inline text-xs sm:text-sm font-bold tracking-tight">AI Tutor</span>
      </button>

      {/* History Slide-Over Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        history={history}
        onClose={() => setIsHistoryOpen(false)}
        onSelectRecord={handleSelectRecord}
        onClearHistory={handleClearHistory}
      />

      {/* AI Chatbot Slide-Over Drawer */}
      <ChatbotDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        messages={messages}
        isLoading={isLoadingAi}
        isOnline={isOnline}
        currentExpression={expression}
        currentResult={result}
        onSendMessage={handleSendMessage}
        onInsertResultToCalculator={handleInsertResultToCalculator}
        onClearChat={() => setMessages([])}
      />

      {/* Interactive 3-Step Onboarding Modal */}
      <OnboardingModal
        isOpen={isOnboardingOpen}
        onClose={handleCloseOnboarding}
      />
    </div>
  );
}
