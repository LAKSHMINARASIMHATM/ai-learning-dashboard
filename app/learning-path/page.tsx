'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  CheckCircle2,
  Circle,
  Lock,
  PlayCircle,
  BookOpen,
  Video,
  FileText,
  Code,
  HelpCircle,
  ChevronRight,
  Loader2,
  Trophy,
  Clock,
  TrendingUp
} from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  estimatedHours: number;
  resourceType: 'video' | 'article' | 'exercise' | 'project' | 'quiz';
  isRequired: boolean;
  completed: boolean;
}

interface LearningStep {
  _id: string;
  title: string;
  description: string;
  order: number;
  completed: boolean;
  estimatedTime: number;
  checklist: ChecklistItem[];
  quizTopic?: string;
}

interface LearningPath {
  _id: string;
  title: string;
  description: string;
  category: string;
  totalWeeks: number;
  difficulty: string;
  steps: LearningStep[];
  progress: number;
}

export default function LearningPathPage() {
  const router = useRouter();
  const [path, setPath] = useState<LearningPath | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchPath();
  }, []);

  const fetchPath = async () => {
    setLoading(true);
    try {
      const res = await api.getLearningPath();
      if (res.success && res.data) {
        setPath(res.data as LearningPath);
      } else {
        toast.error('Failed to load learning path');
      }
    } catch (error) {
      console.error('Error fetching path:', error);
      toast.error('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const toggleChecklistItem = async (stepIndex: number, itemId: string, currentStatus: boolean) => {
    if (!path) return;
    setUpdating(itemId);
    try {
      const res = await api.updateChecklistItem(stepIndex, itemId, !currentStatus);
      if (res.success && res.data) {
        // Refresh path to get updated progress
        fetchPath();
        toast.success('Progress updated!');
      }
    } catch (error) {
      toast.error('Failed to update progress');
    } finally {
      setUpdating(null);
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4" />;
      case 'article': return <FileText className="w-4 h-4" />;
      case 'exercise': return <Code className="w-4 h-4" />;
      case 'project': return <PlayCircle className="w-4 h-4" />;
      case 'quiz': return <HelpCircle className="w-4 h-4" />;
      default: return <BookOpen className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-[60vh]">
          <Loader2 className="w-10 h-10 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  if (!path) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold mb-4">No Learning Path Found</h2>
          <p className="text-muted-foreground mb-8 text-lg">We couldn't find an active learning path for you.</p>
          <Button size="lg" onClick={() => router.push('/')}>
            Go to Dashboard
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest">
                {path.category}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest ${path.difficulty === 'beginner' ? 'bg-emerald-100 text-emerald-700' :
                path.difficulty === 'intermediate' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'
                }`}>
                {path.difficulty}
              </span>
            </div>
            <h2 className="text-4xl font-black tracking-tight mb-2">{path.title}</h2>
            <p className="text-foreground/60 font-medium max-w-2xl text-lg">
              {path.description}
            </p>
          </div>
          <div className="bg-card p-6 rounded-3xl border border-border shadow-sm min-w-[240px]">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Overall Mastery</span>
              <span className="text-xl font-black text-primary">{Math.round(path.progress)}%</span>
            </div>
            <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full shadow-glow transition-all duration-1000"
                style={{ width: `${path.progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Timeline Section */}
        <div className="lg:col-span-2 space-y-12">
          {path.steps.map((step, sIdx) => (
            <div key={step._id} className="relative">
              {/* Step Header */}
              <div className="flex items-center gap-4 mb-8">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-xl ${step.completed ? 'bg-emerald-500 text-white' : 'bg-primary text-white'
                  }`}>
                  {sIdx + 1}
                </div>
                <div>
                  <h3 className="text-2xl font-bold">{step.title}</h3>
                  <p className="text-muted-foreground font-medium">{step.description}</p>
                </div>
              </div>

              {/* Checklist Items */}
              <div className="ml-6 border-l-2 border-dashed border-border pl-10 space-y-4">
                {step.checklist.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => toggleChecklistItem(sIdx, item.id, item.completed)}
                    disabled={updating === item.id}
                    className={`flex items-center justify-between w-full p-4 rounded-2xl border transition-all text-left group ${item.completed
                      ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-900'
                      : 'bg-card border-border hover:border-primary/50'
                      }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        {updating === item.id ? (
                          <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        ) : item.completed ? (
                          <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                        ) : (
                          <Circle className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
                        )}
                      </div>
                      <div>
                        <p className={`font-bold ${item.completed ? 'line-through opacity-50' : ''}`}>
                          {item.title}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            {getResourceIcon(item.resourceType)}
                            {item.resourceType}
                          </span>
                          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {item.estimatedHours}h
                          </span>
                        </div>
                      </div>
                    </div>
                    <ChevronRight className={`w-5 h-5 transition-transform ${item.completed ? 'opacity-0' : 'group-hover:translate-x-1 text-muted-foreground'}`} />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Stats */}
        <div className="space-y-6">
          <Card className="rounded-3xl border-border bg-card shadow-sm overflow-hidden sticky top-24">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold">Path Overview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-foreground/50 uppercase tracking-widest">Total Steps</span>
                <span className="text-lg font-black">{path.steps.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-foreground/50 uppercase tracking-widest">Est. Duration</span>
                <span className="text-lg font-black">{path.totalWeeks} Weeks</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-foreground/50 uppercase tracking-widest">Status</span>
                <span className="text-sm font-black bg-primary/10 text-primary px-3 py-1 rounded-full uppercase tracking-widest">Active</span>
              </div>

              <div className="pt-6 border-t border-border space-y-4">
                <div className="p-4 rounded-2xl bg-muted/50 border border-border">
                  <div className="flex items-center gap-3 mb-2">
                    <Trophy className="w-5 h-5 text-amber-500" />
                    <span className="text-xs font-bold uppercase tracking-widest">Next Milestone</span>
                  </div>
                  <p className="text-sm font-bold">
                    {path.steps.find(s => !s.completed)?.title || 'All Completed!'}
                  </p>
                </div>

                <Button
                  className="w-full py-6 rounded-2xl text-lg font-bold shadow-lg shadow-primary/20"
                  onClick={() => router.push('/quiz')}
                >
                  Take Quiz
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="p-8 rounded-3xl bg-gradient-to-br from-indigo-600 to-blue-700 text-white relative overflow-hidden shadow-xl">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16"></div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-cyan-300" />
                <span className="text-xs font-black uppercase tracking-widest text-cyan-300">Learning Tip</span>
              </div>
              <h4 className="text-xl font-bold mb-2">Consistency is Key</h4>
              <p className="text-white/80 text-sm font-medium leading-relaxed">
                Completing just 2 checklist items per day keeps you on track for your goal.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
