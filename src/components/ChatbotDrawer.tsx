import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Send, X, WifiOff, CornerDownLeft, Bot, User, Trash2 } from 'lucide-react';
import { ChatMessage } from '../types/calculator';

interface ChatbotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  isLoading: boolean;
  isOnline: boolean;
  currentExpression: string;
  currentResult: string;
  onSendMessage: (text: string) => void;
  onInsertResultToCalculator: (value: string) => void;
  onClearChat: () => void;
}

export const ChatbotDrawer: React.FC<ChatbotDrawerProps> = ({
  isOpen,
  onClose,
  messages,
  isLoading,
  isOnline,
  currentExpression,
  currentResult,
  onSendMessage,
  onInsertResultToCalculator,
  onClearChat,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    onSendMessage(inputText.trim());
    setInputText('');
  };

  const handleChipClick = (prompt: string) => {
    if (isLoading) return;
    onSendMessage(prompt);
  };

  const hasCalculation = Boolean(currentExpression && currentExpression !== '0');

  return (
    <div className="fixed inset-0 z-40 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in">
      <div className="w-full max-w-md sm:max-w-lg h-full bg-[#111827] border-l border-slate-800 flex flex-col text-slate-100 shadow-2xl animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-[#0e1422]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-slate-950 shadow-md shadow-cyan-500/20">
              <Sparkles className="w-4 h-4 fill-current" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                OmniCalc AI Tutor
              </h2>
              <p className="text-[11px] text-slate-400">Step-by-step math reasoning & answers</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            {messages.length > 0 && (
              <button
                onClick={onClearChat}
                aria-label="Clear chat history"
                title="Clear chat"
                className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              aria-label="Close tutor panel"
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Current Calculator Context Ribbon */}
        {hasCalculation && (
          <div className="px-4 py-2 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-slate-400 overflow-hidden truncate">
              <span className="font-semibold text-cyan-400 uppercase text-[10px] tracking-wider shrink-0">
                Active:
              </span>
              <span className="font-mono text-slate-200 truncate">{currentExpression}</span>
              <span className="text-slate-500">=</span>
              <span className="font-mono font-bold text-white shrink-0">{currentResult}</span>
            </div>
            <button
              onClick={() => handleChipClick(`Explain the step-by-step solution for: ${currentExpression}`)}
              disabled={!isOnline || isLoading}
              className="text-[11px] font-medium text-cyan-400 hover:text-cyan-300 hover:underline shrink-0 ml-2 disabled:opacity-50"
            >
              Explain This
            </button>
          </div>
        )}

        {/* Offline Warning inside Chat if disconnected */}
        {!isOnline && (
          <div className="m-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-2.5 text-xs text-amber-200">
            <WifiOff className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-300">AI Tutor is Offline</p>
              <p className="mt-0.5 text-amber-200/90 leading-relaxed">
                Your calculator engine continues to operate 100% offline. Reconnect to the internet to ask new questions or generate step-by-step tutor breakdowns.
              </p>
            </div>
          </div>
        )}

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-4 text-slate-400">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-3">
                <Bot className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-white">How can I assist your calculation?</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs leading-relaxed">
                Ask about formulas, algebra, unit conversions, or request an explanation of your current equation.
              </p>

              {/* Starter Suggested Chips */}
              <div className="mt-5 w-full max-w-xs flex flex-col gap-1.5 text-left">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 px-1">
                  Suggested Prompts:
                </p>
                <button
                  onClick={() => handleChipClick(
                    hasCalculation
                      ? `Can you explain the mathematical steps to evaluate: ${currentExpression}?`
                      : 'How does the order of operations (PEMDAS) work in complex formulas?'
                  )}
                  disabled={!isOnline}
                  className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-cyan-300 transition-colors disabled:opacity-50"
                >
                  {hasCalculation
                    ? `Break down "${currentExpression}" step-by-step`
                    : 'Explain order of operations (PEMDAS)'}
                </button>
                <button
                  onClick={() => handleChipClick('Calculate compound interest for $1000 at 5% for 3 years')}
                  disabled={!isOnline}
                  className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-cyan-300 transition-colors disabled:opacity-50"
                >
                  Calculate compound interest ($1000 at 5%, 3 yrs)
                </button>
                <button
                  onClick={() => handleChipClick('Convert 45 miles per hour to meters per second')}
                  disabled={!isOnline}
                  className="p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-800 text-xs text-slate-300 hover:text-cyan-300 transition-colors disabled:opacity-50"
                >
                  Convert 45 mph to meters per second
                </button>
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'model' && (
                  <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center shrink-0 mt-0.5 text-indigo-300">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-sm ${
                    msg.role === 'user'
                      ? 'bg-gradient-to-r from-cyan-600 to-indigo-600 text-white font-medium rounded-tr-sm'
                      : 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-sm'
                  }`}
                >
                  <div className="whitespace-pre-wrap break-words">{msg.content}</div>

                  {/* Quick Action: Insert Result Into Calculator */}
                  {msg.resultValue && (
                    <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center justify-between gap-2">
                      <span className="text-[11px] text-slate-400">
                        Result: <strong className="text-cyan-300 font-mono">{msg.resultValue}</strong>
                      </span>
                      <button
                        onClick={() => onInsertResultToCalculator(msg.resultValue!)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[11px] font-semibold transition-colors active:scale-95"
                      >
                        <CornerDownLeft className="w-3 h-3" />
                        <span>Insert to Keypad</span>
                      </button>
                    </div>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0 mt-0.5 text-slate-300">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))
          )}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-2.5 items-center text-slate-400 text-xs">
              <div className="w-7 h-7 rounded-lg bg-indigo-600/30 border border-indigo-500/40 flex items-center justify-center shrink-0 text-indigo-300">
                <Sparkles className="w-4 h-4 animate-spin text-cyan-400" />
              </div>
              <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-1.5 text-slate-300">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse delay-100" />
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse delay-200" />
                <span className="ml-1 text-[11px]">Thinking through the math...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSubmit} className="p-3 sm:p-4 border-t border-slate-800 bg-[#0e1422]">
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                isOnline ? 'Ask about formulas, conversions, or steps...' : 'Offline mode — reconnect to chat'
              }
              disabled={!isOnline || isLoading}
              className="flex-1 bg-slate-900 border border-slate-750 focus:border-cyan-400 focus:outline-none rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 disabled:opacity-50 transition-colors"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || !isOnline || isLoading}
              aria-label="Send message"
              className="p-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 font-bold shadow-md shadow-cyan-500/20 hover:brightness-110 disabled:opacity-40 disabled:hover:brightness-100 active:scale-95 transition-all"
            >
              <Send className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
