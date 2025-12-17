import React, { useState } from 'react';
import { Eye, EyeOff, Lock, Unlock } from 'lucide-react';

interface PasswordInputProps {
  value: string;
  onChange: (val: string) => void;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({ value, onChange }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="w-full relative group">
      <div className={`absolute -inset-1 bg-gradient-to-r from-cyber-primary to-cyber-accent rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 ${isFocused ? 'opacity-75' : ''}`}></div>
      
      <div className="relative bg-cyber-panel ring-1 ring-cyber-border rounded-lg p-1 flex items-center">
        <div className="pl-4 text-gray-400">
          {value.length > 0 ? (isVisible ? <Unlock size={20} /> : <Lock size={20} />) : <Lock size={20} />}
        </div>
        
        <input
          type={isVisible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="Enter password to analyze..."
          className="w-full bg-transparent border-none outline-none text-white px-4 py-4 font-mono text-lg placeholder-gray-600"
          autoComplete="off"
          data-gramm="false"
        />
        
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="p-2 mr-2 text-gray-500 hover:text-white transition-colors rounded-md hover:bg-white/10"
          title={isVisible ? "Hide password" : "Show password"}
        >
          {isVisible ? <EyeOff size={20} /> : <Eye size={20} />}
        </button>
      </div>
      
      <div className="mt-2 text-xs text-gray-500 flex justify-between px-1">
        <span>🔒 Input is processed locally.</span>
        <span>{value.length} chars</span>
      </div>
    </div>
  );
};
