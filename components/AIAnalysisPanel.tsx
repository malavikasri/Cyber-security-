import React, { useState } from 'react';
import { Bot, Sparkles, AlertTriangle, ShieldAlert, Terminal } from 'lucide-react';
import { PasswordAnalysis, AIAnalysisResult } from '../types';
import { generateSecurityReport } from '../services/geminiService';

interface AIAnalysisPanelProps {
  analysis: PasswordAnalysis;
  rawPasswordForStructureOnly: string;
}

export const AIAnalysisPanel: React.FC<AIAnalysisPanelProps> = ({ analysis, rawPasswordForStructureOnly }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AIAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!process.env.API_KEY) {
      setError("API Key not configured. AI features unavailable.");
      return;
    }

    setLoading(true);
    setError(null);
    
    // Create a safe structural representation (e.g., "P@ss" -> "ULLS")
    const structure = rawPasswordForStructureOnly.split('').map(char => {
        if (/[a-z]/.test(char)) return 'L';
        if (/[A-Z]/.test(char)) return 'U';
        if (/[0-9]/.test(char)) return 'N';
        return 'S';
    }).join('');

    try {
      const report = await generateSecurityReport(analysis, structure);
      setResult(report);
    } catch (err) {
      setError("Failed to generate AI report. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (analysis.length === 0) return null;

  return (
    <div className="bg-cyber-panel border border-cyber-border rounded-xl p-6 relative overflow-hidden">
        {/* Decorative background glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-cyber-accent opacity-10 blur-3xl rounded-full pointer-events-none"></div>

        <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-indigo-500/10 rounded-lg text-cyber-accent border border-cyber-accent/20">
                <Bot size={24} />
            </div>
            <div>
                <h3 className="text-lg font-bold text-white">AI Security Consultant</h3>
                <p className="text-xs text-gray-400">Powered by Gemini 2.5 Flash</p>
            </div>
        </div>

        {!result && !loading && (
            <div className="text-center py-6">
                <p className="text-gray-400 mb-4 text-sm">
                    Generate a personalized hacker persona simulation and detailed security critique based on your password's mathematical structure.
                </p>
                <button
                    onClick={handleAnalyze}
                    className="group relative inline-flex items-center gap-2 px-6 py-3 bg-cyber-accent hover:bg-indigo-500 text-white rounded-lg font-medium transition-all hover:shadow-[0_0_20px_rgba(99,102,241,0.5)]"
                >
                    <Sparkles size={18} className="group-hover:animate-spin" />
                    Run Advanced Analysis
                </button>
                <p className="mt-3 text-[10px] text-gray-600 uppercase tracking-widest">
                    Only metadata is sent. Your password remains local.
                </p>
            </div>
        )}

        {loading && (
            <div className="py-8 flex flex-col items-center justify-center space-y-4">
                <div className="relative w-16 h-16">
                    <div className="absolute inset-0 border-4 border-gray-800 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-cyber-accent rounded-full border-t-transparent animate-spin"></div>
                </div>
                <div className="text-cyber-accent font-mono text-sm animate-pulse">
                    Simulating brute force scenarios...
                </div>
            </div>
        )}

        {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3 text-red-400">
                <AlertTriangle size={20} />
                <span className="text-sm">{error}</span>
            </div>
        )}

        {result && (
            <div className="space-y-6 animate-[fadeIn_0.5s_ease-out]">
                {/* Hacker Persona Card */}
                <div className="bg-black/30 rounded-lg p-4 border-l-4 border-cyber-danger">
                    <div className="flex items-center gap-2 text-cyber-danger mb-2 font-mono text-xs uppercase tracking-wider">
                        <Terminal size={14} />
                        Attack Simulation
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed italic">
                        "{result.hackerPersona}"
                    </p>
                </div>

                {/* Critique */}
                <div>
                    <h4 className="text-white font-semibold mb-2 flex items-center gap-2">
                        <ShieldAlert size={16} className="text-cyber-warning" />
                        Vulnerability Report
                    </h4>
                    <p className="text-gray-400 text-sm">{result.critique}</p>
                </div>

                {/* Tips */}
                <div>
                    <h4 className="text-white font-semibold mb-2">Hardening Recommendations</h4>
                    <ul className="space-y-2">
                        {result.tips.map((tip, i) => (
                            <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-cyber-primary shrink-0"></span>
                                {tip}
                            </li>
                        ))}
                    </ul>
                </div>
                
                <button 
                  onClick={() => setResult(null)}
                  className="w-full py-2 text-xs text-gray-500 hover:text-white transition-colors"
                >
                  Clear Analysis
                </button>
            </div>
        )}
    </div>
  );
};
