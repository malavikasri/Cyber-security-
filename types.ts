export enum StrengthLevel {
  VeryWeak = 'Very Weak',
  Weak = 'Weak',
  Medium = 'Medium',
  Strong = 'Strong',
  VeryStrong = 'Very Strong'
}

export interface CrackTimeScenario {
  label: string;
  guessesPerSecond: number;
  description: string;
  timeSeconds: number;
  timeDisplay: string;
}

export interface PasswordAnalysis {
  length: number;
  hasLower: boolean;
  hasUpper: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
  poolSize: number;
  entropy: number;
  score: number; // 0-100
  strength: StrengthLevel;
  crackTimes: CrackTimeScenario[];
}

export interface AIAnalysisResult {
  critique: string;
  tips: string[];
  hackerPersona: string;
}
