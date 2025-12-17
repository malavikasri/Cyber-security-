import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { PasswordAnalysis } from '../types';

interface CrackTimeChartProps {
  analysis: PasswordAnalysis;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-cyber-dark border border-cyber-border p-3 rounded-lg shadow-xl">
        <p className="text-cyber-primary font-semibold mb-1">{data.label}</p>
        <p className="text-white text-sm mb-1">{data.description}</p>
        <p className="text-gray-400 text-xs">Estimated: <span className="text-white font-mono">{data.timeDisplay}</span></p>
      </div>
    );
  }
  return null;
};

export const CrackTimeChart: React.FC<CrackTimeChartProps> = ({ analysis }) => {
  
  // Logarithmic scale often works better for time, but for visuals we might just use a cap
  // or simple relative bars. Let's stick to the list view for detailed times and 
  // use the chart to show "Magnitude" of security relative to a weak baseline.
  
  // Actually, a simple comparative list might be better UX than a chart where values range from 1ms to 1 billion years.
  // Let's implement a clean List view instead of a chart for readability, as requested by "User-friendly and readable".
  // A chart with such disparate data (seconds vs millenia) is hard to read.
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white flex items-center gap-2">
        <span className="w-1 h-6 bg-cyber-danger rounded-full"></span>
        Brute Force Estimation
      </h3>
      <div className="grid gap-3">
        {analysis.crackTimes.map((scenario, idx) => (
          <div key={idx} className="group bg-cyber-dark/50 hover:bg-cyber-dark border border-cyber-border hover:border-cyber-primary/50 p-4 rounded-xl transition-all">
            <div className="flex justify-between items-start mb-2">
              <div>
                <div className="font-semibold text-gray-200">{scenario.label}</div>
                <div className="text-xs text-gray-500">{scenario.description}</div>
              </div>
              <div className={`font-mono font-bold text-right ${scenario.timeSeconds < 60 ? 'text-cyber-danger' : scenario.timeSeconds > 31536000 ? 'text-cyber-primary' : 'text-cyber-warning'}`}>
                {scenario.timeDisplay}
              </div>
            </div>
            
            {/* Visual Bar for this specific metric relative to a "Safe" baseline of 1 year */}
            <div className="h-1.5 w-full bg-gray-800 rounded-full overflow-hidden mt-2">
              <div 
                className={`h-full rounded-full ${scenario.timeSeconds < 60 ? 'bg-cyber-danger' : 'bg-cyber-primary'}`}
                style={{ width: `${Math.min(100, (Math.max(0, Math.log10(scenario.timeSeconds + 1)) / 10) * 100)}%` }} // Log scale visual
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
