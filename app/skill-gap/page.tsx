'use client';

import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const skillGapData = [
  { topic: 'Design', score: 75, target: 90, status: 'Critical', priority: 'High' },
  { topic: 'Coding', score: 60, target: 85, status: 'Leadership', priority: 'Med' },
  { topic: 'Strategy', score: 45, target: 80, status: 'Critical', priority: 'High' },
  { topic: 'Research', score: 70, target: 85, status: 'Growth', priority: 'Low' },
  { topic: 'Mgmt', score: 55, target: 75, status: 'Leadership', priority: 'Med' },
];

export default function SkillGapAnalysisPage() {
  const router = useRouter();
  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Skill Gap Analysis</h2>
          <p className="text-foreground/60 font-medium">Identify your strengths and areas for improvement</p>
        </div>
        <div className="flex gap-4 text-xs font-bold uppercase tracking-wider">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-primary shadow-[0_0_8px_rgba(19,91,236,0.6)]"></span>
            <span className="text-foreground/60">Current</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.6)]"></span>
            <span className="text-foreground/60">Target</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Radar Chart Section */}
        <div className="lg:col-span-2 relative min-h-[400px] flex items-center justify-center rounded-3xl bg-card/50 backdrop-blur-xl shadow-glass border border-border p-8 overflow-hidden">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

          <svg className="w-full h-full max-h-[320px] relative z-10 drop-shadow-sm" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
            <g className="stroke-foreground/10" fill="none" strokeWidth="1">
              <circle cx="150" cy="150" r="30"></circle>
              <circle cx="150" cy="150" r="60"></circle>
              <circle cx="150" cy="150" r="90"></circle>
              <circle cx="150" cy="150" r="120"></circle>
              <line x1="150" x2="150" y1="150" y2="30"></line>
              <line x1="150" x2="264" y1="150" y2="112"></line>
              <line x1="150" x2="222" y1="150" y2="249"></line>
              <line x1="150" x2="78" y1="150" y2="249"></line>
              <line x1="150" x2="36" y1="150" y2="112"></line>
            </g>
            <g className="text-[11px] fill-foreground/50 font-bold tracking-wide" text-anchor="middle">
              <text x="150" y="20">Design</text>
              <text x="280" y="115">Coding</text>
              <text x="235" y="270">Strategy</text>
              <text x="65" y="270">Research</text>
              <text x="20" y="115">Mgmt</text>
            </g>
            {/* Current Path */}
            <path className="drop-shadow-lg" d="M150 60 L240 120 L200 220 L100 230 L70 130 Z" fill="url(#gradientPrimary)" stroke="var(--primary)" strokeLinejoin="round" strokeWidth="2.5"></path>
            {/* Target Path */}
            <path d="M150 30 L260 110 L220 250 L75 250 L36 110 Z" fill="none" opacity="0.5" stroke="#06b6d4" strokeDasharray="6 4" strokeLinejoin="round" strokeWidth="2"></path>
            <defs>
              <radialGradient cx="150" cy="150" gradientUnits="userSpaceOnUse" id="gradientPrimary" r="120">
                <stop offset="0" stopColor="var(--primary)" stopOpacity="0.25"></stop>
                <stop offset="1" stopColor="var(--primary)" stopOpacity="0.05"></stop>
              </radialGradient>
            </defs>
          </svg>
        </div>

        {/* Quick Stats */}
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2 rounded-3xl bg-card p-6 shadow-sm border border-border">
            <div className="flex items-center gap-3 mb-2">
              <span className="flex size-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-500">
                <span className="material-symbols-outlined text-2xl">priority_high</span>
              </span>
              <p className="text-xs font-bold text-foreground/50 uppercase tracking-widest">Critical Gaps</p>
            </div>
            <p className="text-4xl font-black tracking-tight">3</p>
          </div>

          <div className="flex flex-col gap-2 rounded-3xl bg-card p-6 shadow-sm border border-border">
            <div className="flex items-center gap-3 mb-2">
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <span className="material-symbols-outlined text-2xl">school</span>
              </span>
              <p className="text-xs font-bold text-foreground/50 uppercase tracking-widest">Learning Hours</p>
            </div>
            <p className="text-4xl font-black tracking-tight">12.5</p>
          </div>

          <div className="flex flex-col gap-2 rounded-3xl bg-primary p-6 shadow-lg shadow-primary/20 text-white">
            <div className="flex items-center gap-3 mb-2">
              <span className="flex size-10 items-center justify-center rounded-xl bg-white/20 text-white">
                <span className="material-symbols-outlined text-2xl">trending_up</span>
              </span>
              <p className="text-xs font-bold text-white/70 uppercase tracking-widest">Role Readiness</p>
            </div>
            <p className="text-4xl font-black tracking-tight">78%</p>
          </div>
        </div>
      </div>

      {/* Priority Gaps */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold tracking-tight">Priority Gaps</h3>
          <button
            className="text-sm font-bold text-primary hover:underline"
            onClick={() => router.push('/recommendations')}
          >
            View All
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skillGapData.filter(s => s.priority !== 'Low').map((skill) => (
            <div key={skill.topic} className="rounded-3xl bg-card p-6 shadow-sm border border-border relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="material-symbols-outlined text-8xl text-primary">analytics</span>
              </div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-xl font-bold leading-tight">{skill.topic}</p>
                    <p className="text-xs text-foreground/50 mt-1 font-bold uppercase tracking-wide">{skill.status}</p>
                  </div>
                  <span className={`inline-flex items-center rounded-lg px-3 py-1 text-[10px] font-bold uppercase tracking-wider border ${skill.priority === 'High'
                    ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                    : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                    }`}>
                    {skill.priority} Priority
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative h-3 flex-1 rounded-full bg-foreground/5 overflow-hidden">
                    <div
                      className={`absolute left-0 top-0 h-full bg-gradient-to-r rounded-full shadow-lg ${skill.priority === 'High' ? 'from-rose-500 to-orange-400' : 'from-amber-400 to-yellow-300'
                        }`}
                      style={{ width: `${skill.score}%` }}
                    ></div>
                    <div
                      className="absolute top-0 h-full w-0.5 bg-foreground z-10 opacity-20"
                      style={{ left: `${skill.target}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-black w-12 text-right">-{skill.target - skill.score}%</span>
                </div>
                <div className="flex justify-between mt-2 text-[10px] uppercase font-bold tracking-widest text-foreground/30">
                  <span>Current: {skill.score}%</span>
                  <span>Target: {skill.target}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
