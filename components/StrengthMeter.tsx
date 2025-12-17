import React from 'react';
import { PasswordAnalysis, StrengthLevel } from '../types';
import { STRENGTH_COLORS } from '../constants';
import { Check, X, ShieldAlert, ShieldCheck, Shield } from 'lucide-react';

interface StrengthMeterProps {
  analysis: PasswordAnalysis;
}

const RequirementItem: React.FC<{ met: boolean; label: string }> = ({ met, label }) => (
  <div className={`flex items-center space-x-2 text-sm ${met ? 'text-gray-300' : 'text-gray-600'}`}>
    <div className={`w-4 h-4 rounded-full flex items-center justify-center ${met ? 'bg-cyber-primary text-black' : 'bg-gray-800'}`}>
      {met ? <Check size={10} strokeWidth={4} /> : <X size={10} />}
    </div>
    <span>{label}</span>
  </div>
);

export const StrengthMeter: React.FC<StrengthMeterProps> = ({ analysis }) => {
  const color = STRENGTH_COLORS[analysis.strength];
  
  const getIcon = () => {
    switch(analysis.strength) {
      case StrengthLevel.VeryWeak: return <ShieldAlert className="text-red-500" size={32} />;
      case StrengthLevel.Weak: return <ShieldAlert className="text-orange-500" size={32} />;
      case StrengthLevel.Medium: return <Shield className="text-amber-500" size={32} />;
      case StrengthLevel.Strong: return <ShieldCheck className="text-emerald-500" size={32} />;
      case StrengthLevel.VeryStrong: return <ShieldCheck className="text-blue-500" size={32} />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Score Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-cyber-dark rounded-xl border border-cyber-border">
            {getIcon()}
          </div>
          <div>
            <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Strength</h3>
            <div className="text-2xl font-bold" style={{ color }}>
              {analysis.strength}
            </div>
          </div>
        </div>
        <div className="text-right">
            <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider">Entropy</h3>
            <div className="text-2xl font-bold text-white font-mono">
              {Math.round(analysis.entropy)} <span className="text-base text-gray-500">bits</span>
            </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-4 w-full bg-gray-800 rounded-full overflow-hidden relative">
        <div 
          className="h-full transition-all duration-700 ease-out relative"
          style={{ width: `${analysis.score}%`, backgroundColor: color }}
        >
          <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
        </div>
      </div>

      {/* Requirements Grid */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <RequirementItem met={analysis.length >= 8} label="8+ Characters" />
        <RequirementItem met={analysis.hasUpper} label="Uppercase" />
        <RequirementItem met={analysis.hasLower} label="Lowercase" />
        <RequirementItem met={analysis.hasNumber} label="Numbers" />
        <RequirementItem met={analysis.hasSpecial} label="Symbols" />
        <RequirementItem met={analysis.length >= 12} label="12+ Recommended" />
      </div>
    </div>
  );
};
