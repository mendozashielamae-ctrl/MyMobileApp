import React, { useState } from 'react';
import { Calculator, WifiOff, Sparkles, ArrowRight, ArrowLeft, Check, X } from 'lucide-react';
import { OnboardingStep } from '../types/calculator';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const STEPS: OnboardingStep[] = [
  {
    title: 'Precision Dual-Line Calculator',
    subtitle: 'Step 1 of 3 · Core Keypad',
    description:
      'OmniCalc delivers high-speed arithmetic and scientific functions with live real-time expression preview, parentheses support, and calculation history.',
    highlight: 'Standard & Scientific mode switch anytime',
    featureKey: 'calc',
  },
  {
    title: '100% Offline-First Architecture',
    subtitle: 'Step 2 of 3 · Offline Resilience',
    description:
      'Engineered as a Progressive Web App (PWA). All mathematical calculations run entirely on your device with zero network delays—even on airplanes or without cell reception.',
    highlight: 'No connection required for instant results',
    featureKey: 'offline',
  },
  {
    title: 'AI Math Tutor & Problem Solver',
    subtitle: 'Step 3 of 3 · Conversational Assistant',
    description:
      'Encounter a challenging calculation? Tap the AI Chatbot button anytime to get step-by-step derivations, financial explanations, or paste computed answers straight into your keypad.',
    highlight: 'One-click "Insert into Calculator" action',
    featureKey: 'ai',
  },
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const step = STEPS[currentStep];
  const isLast = currentStep === STEPS.length - 1;

  const handleNext = () => {
    if (isLast) {
      onClose();
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(0, prev - 1));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="onboarding-title"
        className="w-full max-w-lg bg-[#111827] border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative text-slate-100 flex flex-col overflow-hidden"
      >
        {/* Subtle decorative glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header Row with Skip/Close */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-400">
            <span>{step.subtitle}</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Close walkthrough"
            className="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feature Icon Hero */}
        <div className="my-6 flex items-center justify-center">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-slate-900 to-slate-800 border border-slate-700 flex items-center justify-center shadow-lg relative">
            {step.featureKey === 'calc' && <Calculator className="w-10 h-10 text-cyan-400" />}
            {step.featureKey === 'offline' && <WifiOff className="w-10 h-10 text-emerald-400" />}
            {step.featureKey === 'ai' && <Sparkles className="w-10 h-10 text-indigo-400" />}
            <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-slate-950 border border-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-300">
              {currentStep + 1}
            </div>
          </div>
        </div>

        {/* Text Content */}
        <div className="text-center space-y-3">
          <h2 id="onboarding-title" className="text-2xl font-bold tracking-tight text-white">
            {step.title}
          </h2>
          <p className="text-sm leading-relaxed text-slate-300 max-w-md mx-auto">
            {step.description}
          </p>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-slate-800/80 border border-slate-700/60 text-xs font-medium text-cyan-300">
            <span>Feature:</span>
            <span className="text-slate-200">{step.highlight}</span>
          </div>
        </div>

        {/* Progress Dots */}
        <div className="flex items-center justify-center gap-2 my-6">
          {STEPS.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentStep(idx)}
              aria-label={`Go to step ${idx + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentStep ? 'w-8 bg-cyan-400' : 'w-2 bg-slate-700 hover:bg-slate-600'
              }`}
            />
          ))}
        </div>

        {/* Navigation Actions */}
        <div className="flex items-center justify-between gap-3 pt-2">
          {currentStep > 0 ? (
            <button
              onClick={handlePrev}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-700 text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>
          ) : (
            <button
              onClick={onClose}
              className="text-xs text-slate-400 hover:text-slate-200 px-3 py-2 hover:underline"
            >
              Skip Walkthrough
            </button>
          )}

          <button
            onClick={handleNext}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-slate-950 font-semibold text-sm shadow-lg shadow-cyan-500/20 hover:brightness-110 active:scale-[0.98] transition-all ml-auto"
          >
            <span>{isLast ? 'Launch Calculator' : 'Next Step'}</span>
            {isLast ? <Check className="w-4 h-4 stroke-[2.5]" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
