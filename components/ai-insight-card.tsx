import React from 'react';
import { Sparkles, Info } from 'lucide-react';

export const AIInsightCard = ({ title, value, insight, trend }: { title: string; value: string; insight: string; trend?: string }) => {
  return (
    <div className="group relative p-[1px] rounded-2xl bg-gradient-to-br from-indigo-500/20 via-white to-fuchsia-500/20 hover:from-indigo-500 hover:to-fuchsia-500 transition-all duration-300 shadow-glass">
      {/* Inner Content with Glass Effect */}
      <div className="relative h-full bg-white/60 dark:bg-slate-900/80 backdrop-blur-md rounded-2xl p-6 flex flex-col justify-between">
        
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2 text-slate-500 text-sm font-medium uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-ai-sparkle animate-pulse-slow" />
            <span>AI Analysis</span>
          </div>
          <button className="text-slate-400 hover:text-primary transition-colors">
            <Info className="w-4 h-4" />
          </button>
        </div>

        {/* Main Metric */}
        <div>
          <h3 className="text-slate-600 font-medium mb-1">{title}</h3>
          <div className="text-3xl font-bold text-slate-800 tracking-tight">
            {value}
          </div>
        </div>

        {/* AI Contextual Explanation */}
        <div className="mt-4 pt-4 border-t border-slate-200/50">
          <p className="text-sm text-slate-600 leading-relaxed">
            <span className="font-semibold text-indigo-600">Why this matters: </span>
            {insight}
          </p>
        </div>
        
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -z-10 group-hover:bg-indigo-500/20 transition-all" />
      </div>
    </div>
  );
};
