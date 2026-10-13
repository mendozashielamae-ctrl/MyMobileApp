export interface CalculationRecord {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

export type CalcMode = 'standard' | 'scientific';

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  resultValue?: string;
  timestamp: number;
  isError?: boolean;
}

export interface OnboardingStep {
  title: string;
  subtitle: string;
  description: string;
  highlight: string;
  featureKey: string;
}
