import { StrengthLevel } from './types';

// Approximate guesses per second for different scenarios
export const ATTACK_SCENARIOS = [
  {
    label: "Online Attack",
    rate: 1000, // 1k/s (Throttled API)
    desc: "Remote web login brute-force"
  },
  {
    label: "Offline (Fast PC)",
    rate: 100_000_000, // 100M/s
    desc: "Standard CPU running hashcat"
  },
  {
    label: "Offline (High-End GPU)",
    rate: 10_000_000_000, // 10B/s
    desc: "RTX 4090 cracking MD5/SHA1"
  },
  {
    label: "Supercomputer Cluster",
    rate: 1_000_000_000_000, // 1T/s
    desc: "State-actor level massive array"
  }
];

export const STRENGTH_COLORS: Record<StrengthLevel, string> = {
  [StrengthLevel.VeryWeak]: '#EF4444', // Red 500
  [StrengthLevel.Weak]: '#F97316', // Orange 500
  [StrengthLevel.Medium]: '#F59E0B', // Amber 500
  [StrengthLevel.Strong]: '#10B981', // Emerald 500
  [StrengthLevel.VeryStrong]: '#3B82F6', // Blue 500
};

export const COMMON_PATTERNS = [
  '123456',
  'password',
  'qwerty',
  'admin',
  'welcome'
];
