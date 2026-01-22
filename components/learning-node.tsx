import React from 'react';
import { CheckCircle, Lock, PlayCircle } from 'lucide-react';

export const LearningNode = ({ status, title, difficulty, duration }: { status: string; title: string; difficulty: string; duration: string }) => {
  const isLocked = status === 'locked';
  const isCompleted = status === 'completed';
  const isActive = status === 'active';

  return (
    <div className="flex gap-4 relative group">
      {/* Connecting Line */}
      <div className="absolute left-[19px] top-10 bottom-[-20px] w-[2px] bg-slate-200 group-last:hidden" />

      {/* Icon Node */}
      <div
        className={`
        relative z-10 w-10 h-10 rounded-full flex items-center justify-center border-2 shadow-sm transition-all duration-300
        ${isCompleted ? 'bg-emerald-100 border-emerald-500 text-emerald-600' : ''}
        ${isActive ? 'bg-white border-primary text-primary shadow-neon ring-4 ring-primary/10' : ''}
        ${isLocked ? 'bg-slate-50 border-slate-200 text-slate-400' : ''}
      `}
      >
        {isCompleted && <CheckCircle className="w-5 h-5" />}
        {isActive && <PlayCircle className="w-5 h-5 fill-current" />}
        {isLocked && <Lock className="w-4 h-4" />}
      </div>

      {/* Content Card */}
      <div
        className={`
        flex-1 mb-8 p-4 rounded-xl border transition-all duration-300 cursor-pointer
        ${isActive ? 'bg-white border-primary/30 shadow-lg scale-[1.02]' : 'bg-slate-50 border-transparent hover:bg-white hover:border-slate-200'}
        ${isLocked ? 'opacity-60 pointer-events-none' : ''}
      `}
      >
        <div className="flex justify-between items-start">
          <h4 className={`font-semibold ${isActive ? 'text-primary' : 'text-slate-700'}`}>
            {title}
          </h4>
          <span
            className={`text-xs px-2 py-1 rounded-full ${
              difficulty === 'Hard' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'
            }`}
          >
            {difficulty}
          </span>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          {duration} • AI Recommended
        </p>
      </div>
    </div>
  );
};
