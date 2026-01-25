'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AIInsightCard } from '@/components/ai-insight-card';
import { ResourceRecommendations } from '@/components/resource-recommendations';
import api from '@/lib/api';
import { toast } from 'sonner';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

export default function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<{
    progress: any;
    analytics: any;
  } | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [progressRes, analyticsRes] = await Promise.all([
          api.getProgress(),
          api.getAnalyticsSummary()
        ]);

        if (progressRes.success && analyticsRes.success) {
          setDashboardData({
            progress: progressRes.data,
            analytics: analyticsRes.data
          });
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsInitialLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleContinueLearning = async () => {
    setLoading(true);
    try {
      // 1. Check for active learning path
      const pathRes = await api.getLearningPath();

      if (pathRes.success && pathRes.data) {
        // Navigate to learning path
        router.push('/learning-path');
        return;
      }

      // 2. If no path, check for recommended resources
      const resourcesRes = await api.getRecommendedResources();

      if (resourcesRes.success && Array.isArray(resourcesRes.data) && resourcesRes.data.length > 0) {
        const firstResource = resourcesRes.data[0];
        // "Start" this resource
        await api.logStudyTime(new Date().toISOString().split('T')[0], 0.1);
        toast.success(`Resuming: ${firstResource.title}`);
        // In real app, navigate to resource
      } else {
        toast.info('No active courses. Check out the recommendations!');
      }
    } catch (error) {
      console.error('Failed to continue learning:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const progress = dashboardData?.progress;
  const analytics = dashboardData?.analytics;

  // Transform data for charts
  const performanceData = analytics?.quizScores?.map((q: any, i: number) => ({
    week: q.week || `Quiz ${i + 1}`,
    score: q.score
  })) || [];

  const skillData = progress?.topicProgress?.map((t: any) => ({
    topic: t.topicName,
    strong: t.masteryLevel
  })) || [];

  if (isInitialLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl mb-12">
        <div className="relative flex min-h-[400px] flex-col gap-6 bg-cover bg-center bg-no-repeat rounded-3xl items-center justify-center p-8 text-center"
          style={{ backgroundImage: 'linear-gradient(rgba(16, 22, 34, 0.85) 0%, rgba(16, 22, 34, 0.95) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuAHvN2yYECS0zj83Exr4TYYut8jqFu3kIsQGfc9hp4V1iDJCP-IsrEcENq6Roumcr0DxHHETHoNKvgmVJDDT0va2bKOLtE_S-BuO-26lCEPNJqggT3qVHfXuk4pVe5bvr1s_xVpc3GpZFDYSQtOc3a0c9v8lBRHFRJbjn7-9v6xF_oVifofCdm3EuIklfvfni7lspUdjVgqCU8QU59iN4ZpTwKoWJPL_if0u6l1HlRfmCs7tbqUnm4NCGdtm4J79JQHJfk0_lOAQYo")' }}>

          <div className="flex flex-col gap-4 max-w-2xl z-10">
            <span className="text-primary font-bold tracking-[0.2em] text-xs uppercase bg-primary/10 py-1 px-3 rounded-full self-center">Next-Gen Education</span>
            <h1 className="text-white text-4xl font-black leading-tight tracking-tight sm:text-5xl">
              Personalized Learning <span className="text-primary">Powered by AI</span>
            </h1>
            <p className="text-slate-300 text-base font-normal leading-relaxed max-w-md mx-auto">
              Master any skill faster with an adaptive curriculum and 1-on-1 intelligent tutoring designed specifically for your brain.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center z-10">
            <Button
              className="h-12 px-8 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xl shadow-emerald-600/30 hover:scale-105 transition-transform"
              onClick={() => router.push('/quiz')}
            >
              🎯 Start Skill Assessment
            </Button>
            <Button
              variant="outline"
              className="h-12 px-8 bg-white/10 backdrop-blur-sm border-white/20 text-white font-bold rounded-xl hover:bg-white/20 transition-colors"
              onClick={handleContinueLearning}
              disabled={loading}
            >
              {loading ? 'Loading...' : 'Continue Learning'}
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <AIInsightCard
          title="Current Skill Level"
          value={`${progress?.skillLevel || 0}%`}
          insight="Based on your recent quiz performance and topic mastery."
        />
        <AIInsightCard
          title="Learning Progress"
          value={`${progress?.learningProgress || 0}%`}
          insight="Overall completion of your personalized learning path."
        />
        <AIInsightCard
          title="Topics Completed"
          value={`${progress?.topicsCompleted || 0}/${progress?.totalTopics || 0}`}
          insight="Keep going! You're making steady progress through the curriculum."
        />
        <AIInsightCard
          title="Weak Areas"
          value={`${progress?.weakAreas?.length || 0}`}
          insight={progress?.weakAreas?.length > 0 ? `Focus on: ${progress.weakAreas.slice(0, 2).join(', ')}` : "Great job! No critical weak areas detected."}
        />
      </div>

      {/* Learning Resources Section */}
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-primary/10 rounded-xl text-primary">
            <span className="material-symbols-outlined text-2xl">auto_awesome</span>
          </div>
          <h3 className="text-2xl font-bold tracking-tight">Recommended for You</h3>
        </div>
        <ResourceRecommendations />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Performance Chart */}
        <Card className="rounded-3xl border-border bg-card/50 backdrop-blur-sm shadow-glass overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold">Performance Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              {performanceData.length > 0 ? (
                <LineChart data={performanceData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: 'currentColor', opacity: 0.5 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'currentColor', opacity: 0.5 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }}
                    itemStyle={{ color: 'var(--primary)' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="var(--primary)"
                    strokeWidth={3}
                    dot={{ fill: 'var(--primary)', r: 4, strokeWidth: 2, stroke: 'var(--card)' }}
                    activeDot={{ r: 6, strokeWidth: 0 }}
                  />
                </LineChart>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
                  <span className="material-symbols-outlined text-4xl opacity-20">show_chart</span>
                  <p>Complete quizzes to track your performance!</p>
                </div>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Skills Chart */}
        <Card className="rounded-3xl border-border bg-card/50 backdrop-blur-sm shadow-glass overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-bold">Skills Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              {skillData.length > 0 ? (
                <BarChart data={skillData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="topic" axisLine={false} tickLine={false} tick={{ fill: 'currentColor', opacity: 0.5 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: 'currentColor', opacity: 0.5 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }}
                  />
                  <Bar dataKey="strong" fill="var(--primary)" radius={[6, 6, 0, 0]} opacity={0.8} />
                </BarChart>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground gap-2">
                  <span className="material-symbols-outlined text-4xl opacity-20">bar_chart</span>
                  <p>Start learning topics to see your skills grow!</p>
                </div>
              )}
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex gap-4 flex-wrap">
        <Button
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
          onClick={handleContinueLearning}
        >
          Start Learning
        </Button>
        <Button variant="outline" onClick={() => router.push('/quiz')}>
          📝 Take Assessment
        </Button>
        <Button variant="outline" onClick={() => router.push('/recommendations')}>
          View Recommendations
        </Button>
        <Button variant="outline" onClick={() => router.push('/assistant')}>
          Chat with AI Tutor
        </Button>
      </div>
    </DashboardLayout>
  );
}
