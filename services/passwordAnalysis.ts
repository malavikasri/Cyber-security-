import { PasswordAnalysis, StrengthLevel, CrackTimeScenario } from '../types';
import { ATTACK_SCENARIOS } from '../constants';

const formatDuration = (seconds: number): string => {
  if (seconds < 1) return "Instantly";
  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  
  const minutes = seconds / 60;
  if (minutes < 60) return `${Math.round(minutes)} minutes`;
  
  const hours = minutes / 60;
  if (hours < 24) return `${Math.round(hours)} hours`;
  
  const days = hours / 24;
  if (days < 30) return `${Math.round(days)} days`;
  
  const months = days / 30;
  if (months < 12) return `${Math.round(months)} months`;
  
  const years = days / 365;
  if (years < 1000) return `${Math.round(years)} years`;
  
  if (years < 1_000_000) return `${Math.round(years / 1000)}k years`;
  if (years < 1_000_000_000) return `${Math.round(years / 1_000_000)}m years`;
  
  return "Centuries";
};

export const analyzePassword = (password: string): PasswordAnalysis => {
  const length = password.length;
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  // Calculate Pool Size
  let poolSize = 0;
  if (hasLower) poolSize += 26;
  if (hasUpper) poolSize += 26;
  if (hasNumber) poolSize += 10;
  if (hasSpecial) poolSize += 33; // Common special chars
  if (poolSize === 0) poolSize = 1; // Prevent log(0)

  // Entropy Calculation: E = L * log2(R)
  const entropy = length * Math.log2(poolSize);

  // Score Calculation (Weighted)
  // Bonus for variety, penalty for short length
  let score = 0;
  if (length > 0) {
    score += Math.min(length * 4, 40); // Up to 40 pts for length
  }
  if (hasLower) score += 10;
  if (hasUpper) score += 15;
  if (hasNumber) score += 15;
  if (hasSpecial) score += 20;
  
  // Entropy Bonus
  if (entropy > 50) score += 10;
  if (entropy > 75) score += 10;
  if (entropy > 100) score += 10;
  
  // Deductions
  if (length < 8) score = Math.min(score, 40); // Cap weak length
  if (poolSize < 30 && length > 0) score -= 10; // Only one type
  
  score = Math.max(0, Math.min(100, score));

  // Determine Strength Label
  let strength = StrengthLevel.VeryWeak;
  if (score >= 20) strength = StrengthLevel.Weak;
  if (score >= 50) strength = StrengthLevel.Medium;
  if (score >= 80) strength = StrengthLevel.Strong;
  if (score >= 95) strength = StrengthLevel.VeryStrong;

  // Calculate Crack Times
  // 2^E / Rate
  const possibleCombinations = Math.pow(poolSize, length);
  
  const crackTimes: CrackTimeScenario[] = ATTACK_SCENARIOS.map(scenario => {
    // Average time is usually half the keyspace for brute force
    const timeSeconds = (possibleCombinations / 2) / scenario.rate;
    return {
      label: scenario.label,
      guessesPerSecond: scenario.rate,
      description: scenario.desc,
      timeSeconds: timeSeconds,
      timeDisplay: formatDuration(timeSeconds)
    };
  });

  return {
    length,
    hasLower,
    hasUpper,
    hasNumber,
    hasSpecial,
    poolSize,
    entropy,
    score,
    strength,
    crackTimes
  };
};
