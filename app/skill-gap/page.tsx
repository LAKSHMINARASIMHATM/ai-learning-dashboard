'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { api } from '@/lib/api';
import { Loader2 } from 'lucide-react';

interface SkillGap {
  topic: string;
  currentLevel: number;
  targetLevel: number;
  gap?: number;
  priority: 'high' | 'medium' | 'low';
}

interface SkillGapData {
  skills: SkillGap[];
  hasRealData: boolean;
  message?: string;
  lastAssessmentDate?: string;
}

export default function SkillGapAnalysisPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [skills, setSkills] = useState<SkillGap[]>([]);
  const [hasRealData, setHasRealData] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await api.getSkillGaps();
      if (response.success && response.data) {
        setSkills(response.data.skills || []);
        setHasRealData(response.data.hasRealData ?? false);
      }
    } catch (error) {
      console.error('Failed to fetch skill gaps:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  const criticalGapsCount = skills.filter(s => s.priority === 'high').length;
  const totalGap = skills.reduce((sum, s) => sum + (s.targetLevel - s.currentLevel), 0);
  const avgGap = skills.length > 0 ? Math.round(totalGap / skills.length) : 0;
  const roleReadiness = skills.length > 0
    ? Math.round(skills.reduce((sum, s) => sum + s.currentLevel, 0) / (skills.length * 100) * 100)
    : 0;

  // Skills with data vs no data
  const activeSkills = skills.filter(s => s.currentLevel > 0);
  const noDataSkills = skills.filter(s => s.currentLevel === 0);

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Skill Gap Analysis</h2>
          <p className="text-foreground/60 font-medium">
            {hasRealData
              ? 'Computed from your quiz scores and learning path progress'
              : 'Complete quizzes to generate your personalized skill map'}
          </p>
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

      {/* No data banner */}
      {!hasRealData && (
        <div className="mb-8 rounded-3xl bg-gradient-to-r from-primary/10 to-cyan-500/10 border border-primary/20 p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-primary/20 text-primary">
              <span className="material-symbols-outlined text-2xl">quiz</span>
            </span>
            <div>
              <p className="font-bold text-lg">No assessment data yet</p>
              <p className="text-foreground/60 text-sm">Take quizzes in your learning path to see real skill levels here.</p>
            </div>
          </div>
          <button
            className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-all shadow-lg shadow-primary/25"
            onClick={() => router.push('/quiz')}
          >
            Start a Quiz
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Radar Chart Section */}
        <div className="lg:col-span-2 relative min-h-[400px] flex items-center justify-center rounded-3xl bg-card/50 backdrop-blur-xl shadow-glass border border-border p-8 overflow-hidden">
          <div className="absolute -top-10 -left-10 w-32 h-32 bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

          {skills.length > 0 ? (
            <svg className="w-full h-full max-h-[320px] relative z-10 drop-shadow-sm" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
              {/* Background Grid */}
              <g className="stroke-foreground/10" fill="none" strokeWidth="1">
                <circle cx="150" cy="150" r="30"></circle>
                <circle cx="150" cy="150" r="60"></circle>
                <circle cx="150" cy="150" r="90"></circle>
                <circle cx="150" cy="150" r="120"></circle>
                {/* Percentage labels */}
                <text x="154" y="148" className="fill-foreground/20 text-[8px]" textAnchor="start">25%</text>
                <text x="154" y="118" className="fill-foreground/20 text-[8px]" textAnchor="start">50%</text>
                <text x="154" y="88" className="fill-foreground/20 text-[8px]" textAnchor="start">75%</text>
                <text x="154" y="58" className="fill-foreground/20 text-[8px]" textAnchor="start">100%</text>
                {/* Spokes */}
                {skills.map((_, i) => {
                  const angle = (Math.PI * 2 * i) / skills.length - Math.PI / 2;
                  const x = 150 + 120 * Math.cos(angle);
                  const y = 150 + 120 * Math.sin(angle);
                  return <line key={i} x1="150" y1="150" x2={x} y2={y} />;
                })}
              </g>

              {/* Labels with score */}
              <g className="text-[10px] fill-foreground/60 font-bold tracking-wide" textAnchor="middle">
                {skills.map((skill, i) => {
                  const angle = (Math.PI * 2 * i) / skills.length - Math.PI / 2;
                  const x = 150 + 142 * Math.cos(angle);
                  const y = 150 + 142 * Math.sin(angle);
                  return (
                    <text key={i} x={x} y={y}>
                      {skill.topic} {hasRealData ? `(${skill.currentLevel}%)` : ''}
                    </text>
                  );
                })}
              </g>

              {/* Current level (filled area) */}
              {hasRealData && activeSkills.length >= 3 && (
                <path
                  className="drop-shadow-lg"
                  d={`M ${skills.map((s, i) => {
                    const angle = (Math.PI * 2 * i) / skills.length - Math.PI / 2;
                    const r = (s.currentLevel / 100) * 120;
                    return `${150 + r * Math.cos(angle)} ${150 + r * Math.sin(angle)}`;
                  }).join(' L ')} Z`}
                  fill="url(#gradientPrimary)"
                  stroke="var(--primary)"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                ></path>
              )}

              {/* Target Path (dashed outline) */}
              <path
                d={`M ${skills.map((s, i) => {
                  const angle = (Math.PI * 2 * i) / skills.length - Math.PI / 2;
                  const r = (s.targetLevel / 100) * 120;
                  return `${150 + r * Math.cos(angle)} ${150 + r * Math.sin(angle)}`;
                }).join(' L ')} Z`}
                fill="none"
                opacity="0.5"
                stroke="#06b6d4"
                strokeDasharray="6 4"
                strokeLinejoin="round"
                strokeWidth="2"
              ></path>

              {/* Current level dots */}
              {hasRealData && skills.map((s, i) => {
                const angle = (Math.PI * 2 * i) / skills.length - Math.PI / 2;
                const r = (s.currentLevel / 100) * 120;
                const cx = 150 + r * Math.cos(angle);
                const cy = 150 + r * Math.sin(angle);
                return (
                  <circle
                    key={`dot-${i}`}
                    cx={cx}
                    cy={cy}
                    r="4"
                    fill="var(--primary)"
                    stroke="white"
                    strokeWidth="2"
                    className="drop-shadow-md"
                  />
                );
              })}

              <defs>
                <radialGradient cx="150" cy="150" gradientUnits="userSpaceOnUse" id="gradientPrimary" r="120">
                  <stop offset="0" stopColor="var(--primary)" stopOpacity="0.25"></stop>
                  <stop offset="1" stopColor="var(--primary)" stopOpacity="0.05"></stop>
                </radialGradient>
              </defs>
            </svg>
          ) : (
            <div className="text-center text-muted-foreground">
              <p>No skill data available.</p>
              <p className="text-sm">Complete a quiz or assessment to see your skill gaps.</p>
            </div>
          )}
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
            <p className="text-4xl font-black tracking-tight">{criticalGapsCount}</p>
            {!hasRealData && <p className="text-xs text-foreground/40">Take quizzes to measure</p>}
          </div>

          <div className="flex flex-col gap-2 rounded-3xl bg-card p-6 shadow-sm border border-border">
            <div className="flex items-center gap-3 mb-2">
              <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <span className="material-symbols-outlined text-2xl">school</span>
              </span>
              <p className="text-xs font-bold text-foreground/50 uppercase tracking-widest">Avg Gap</p>
            </div>
            <p className="text-4xl font-black tracking-tight">{avgGap}%</p>
          </div>

          <div className="flex flex-col gap-2 rounded-3xl bg-primary p-6 shadow-lg shadow-primary/20 text-white">
            <div className="flex items-center gap-3 mb-2">
              <span className="flex size-10 items-center justify-center rounded-xl bg-white/20 text-white">
                <span className="material-symbols-outlined text-2xl">trending_up</span>
              </span>
              <p className="text-xs font-bold text-white/70 uppercase tracking-widest">Role Readiness</p>
            </div>
            <p className="text-4xl font-black tracking-tight">{roleReadiness}%</p>
            {hasRealData && (
              <p className="text-xs text-white/60 mt-1">Based on quiz scores & learning progress</p>
            )}
          </div>
        </div>
      </div>

      {/* Priority Gaps */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold tracking-tight">Priority Gaps</h3>
          {hasRealData && (
            <button
              className="text-sm font-bold text-primary hover:underline"
              onClick={() => router.push('/quiz')}
            >
              Retake Quizzes
            </button>
          )}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {skills.filter(s => s.priority !== 'low').map((skill) => (
            <div key={skill.topic} className="rounded-3xl bg-card p-6 shadow-sm border border-border relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <span className="material-symbols-outlined text-8xl text-primary">analytics</span>
              </div>
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <p className="text-xl font-bold leading-tight">{skill.topic}</p>
                    <p className="text-xs text-foreground/50 mt-1 font-bold uppercase tracking-wide">
                      {skill.currentLevel === 0
                        ? 'Not assessed'
                        : skill.targetLevel - skill.currentLevel > 50
                          ? 'Critical'
                          : 'Growth'}
                    </p>
                  </div>
                  <span className={`inline-flex items-center rounded-lg px-3 py-1 text-[10px] font-bold uppercase tracking-wider border ${skill.priority === 'high'
                    ? 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                    : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                    }`}>
                    {skill.priority} Priority
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative h-3 flex-1 rounded-full bg-foreground/5 overflow-hidden">
                    <div
                      className={`absolute left-0 top-0 h-full bg-gradient-to-r rounded-full shadow-lg transition-all duration-1000 ${skill.priority === 'high' ? 'from-rose-500 to-orange-400' : 'from-amber-400 to-yellow-300'
                        }`}
                      style={{ width: `${skill.currentLevel}%` }}
                    ></div>
                    <div
                      className="absolute top-0 h-full w-0.5 bg-foreground z-10 opacity-20"
                      style={{ left: `${skill.targetLevel}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-black w-12 text-right">-{skill.targetLevel - skill.currentLevel}%</span>
                </div>
                <div className="flex justify-between mt-2 text-[10px] uppercase font-bold tracking-widest text-foreground/30">
                  <span>Current: {skill.currentLevel}%</span>
                  <span>Target: {skill.targetLevel}%</span>
                </div>
              </div>
            </div>
          ))}
          {skills.filter(s => s.priority !== 'low').length === 0 && (
            <div className="col-span-2 text-center py-12 text-muted-foreground">
              <p>No high priority gaps found. Great job!</p>
            </div>
          )}
        </div>
      </div>

      {/* Data sources info (only with real data) */}
      {hasRealData && (
        <div className="rounded-3xl bg-card/50 border border-border p-6 mb-8">
          <h3 className="text-lg font-bold mb-4">How your scores are calculated</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary/10 text-primary shrink-0">
                <span className="material-symbols-outlined text-lg">quiz</span>
              </span>
              <div>
                <p className="font-bold text-sm">Quiz Scores</p>
                <p className="text-xs text-foreground/50">50% weight — based on your quiz answer accuracy</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex size-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 shrink-0">
                <span className="material-symbols-outlined text-lg">route</span>
              </span>
              <div>
                <p className="font-bold text-sm">Learning Path Progress</p>
                <p className="text-xs text-foreground/50">30% weight — checklist items you&apos;ve completed</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex size-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500 shrink-0">
                <span className="material-symbols-outlined text-lg">insights</span>
              </span>
              <div>
                <p className="font-bold text-sm">Mastery Level</p>
                <p className="text-xs text-foreground/50">20% weight — from your overall topic progress</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
