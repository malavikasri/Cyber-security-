import React, { useState, useMemo } from 'react';
import { PasswordInput } from './components/PasswordInput';
import { StrengthMeter } from './components/StrengthMeter';
import { CrackTimeChart } from './components/CrackTimeChart';
import { AIAnalysisPanel } from './components/AIAnalysisPanel';
import { analyzePassword } from './services/passwordAnalysis';
import { ShieldCheck, Lock, Github } from 'lucide-react';

const App = () => {
  const [password, setPassword] = useState('');
  
  const analysis = useMemo(() => analyzePassword(password), [password]);

  return (
    <div className="min-h-screen bg-cyber-dark text-gray-200 selection:bg-cyber-primary selection:text-black pb-20">
      
      {/* Navbar */}
      <nav className="border-b border-cyber-border bg-cyber-panel/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-cyber-primary/10 p-2 rounded-lg">
              <ShieldCheck className="text-cyber-primary" size={24} />
            </div>
            <h1 className="font-bold text-xl tracking-tight text-white">
              Cyber<span className="text-cyber-primary">Shield</span>
            </h1>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium text-gray-400">
             <span className="hidden md:block">v2.5.0</span>
             <a href="#" className="hover:text-white transition-colors"><Github size={20} /></a>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 mt-12 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Input and Main Stats */}
        <div className="lg:col-span-7 space-y-8">
          <section className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-white">Password Auditor</h2>
              <p className="text-gray-400">Enter a password to simulate brute-force attacks and analyze entropy.</p>
            </div>
            
            <PasswordInput value={password} onChange={setPassword} />
          </section>

          {password.length > 0 ? (
            <div className="animate-[slideUp_0.3s_ease-out]">
                <div className="bg-cyber-panel border border-cyber-border rounded-xl p-6 shadow-2xl shadow-black/50">
                    <StrengthMeter analysis={analysis} />
                </div>
            </div>
          ) : (
            <div className="bg-cyber-panel/30 border border-cyber-border/50 border-dashed rounded-xl p-12 text-center text-gray-600 flex flex-col items-center gap-4">
              <Lock size={48} className="opacity-20" />
              <p>Awaiting input for analysis...</p>
            </div>
          )}
          
          {password.length > 0 && (
             <AIAnalysisPanel analysis={analysis} rawPasswordForStructureOnly={password} />
          )}
        </div>

        {/* Right Column: Detailed Metrics */}
        <div className="lg:col-span-5 space-y-6">
           {password.length > 0 && (
             <div className="animate-[slideInRight_0.4s_ease-out]">
                <div className="bg-cyber-panel border border-cyber-border rounded-xl p-6 mb-6">
                    <CrackTimeChart analysis={analysis} />
                </div>
                
                <div className="bg-cyber-panel border border-cyber-border rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Why Entropy Matters?</h3>
                  <div className="space-y-4 text-sm text-gray-400">
                    <p>
                      <strong className="text-gray-200">Entropy</strong> measures the unpredictability of your password. 
                      High entropy means there are more possible combinations for an attacker to guess.
                    </p>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                      <div className="p-3 bg-cyber-dark rounded-lg border border-cyber-border">
                        <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">Pool Size</div>
                        <div className="text-xl font-mono text-white">{analysis.poolSize}</div>
                      </div>
                      <div className="p-3 bg-cyber-dark rounded-lg border border-cyber-border">
                        <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">Combinations</div>
                        <div className="text-xl font-mono text-white overflow-hidden text-ellipsis">
                          {analysis.entropy > 128 ? '∞' : `~2^${Math.floor(analysis.entropy)}`}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
             </div>
           )}
        </div>

      </main>
    </div>
  );
};

export default App;
