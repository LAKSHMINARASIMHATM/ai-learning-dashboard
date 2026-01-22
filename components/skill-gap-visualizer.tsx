import React from 'react';

// Wrapper for your Recharts Component
export const SkillGapVisualizer = ({ children }) => {
  return (
    <div className="bg-white rounded-3xl p-8 shadow-card border border-slate-100">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Skill Proficiency</h2>
          <p className="text-sm text-slate-500">Based on your last 5 quizzes</p>
        </div>
        
        {/* Legend */}
        <div className="flex gap-4 text-xs font-medium">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-primary/20 border border-primary"></span>
            <span>You</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-slate-100 border border-slate-300"></span>
            <span>Course Avg</span>
          </div>
        </div>
      </div>

      {/* Chart Container */}
      <div className="h-[300px] w-full flex items-center justify-center relative">
        {/* Background Grid Accent */}
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
        {children} 
      </div>
      
      {/* Actionable Footer */}
      <div className="mt-6 p-4 bg-indigo-50 rounded-xl flex justify-between items-center">
        <span className="text-indigo-900 text-sm font-medium">Critical Gap: Data Structures</span>
        <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm rounded-lg shadow-md transition-transform active:scale-95">
          Generate Study Plan
        </button>
      </div>
    </div>
  );
};
