'use client';

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';
import { Flame, Trophy, Clock, Target, BookOpen, TrendingUp, Loader2 } from 'lucide-react';
import api from '@/lib/api';

interface TopicProgress {
  topicId: string;
  topicName: string;
  masteryLevel: number;
  timeSpentMinutes: number;
  lessonsCompleted: number;
  totalLessons: number;
  errorCount: number;
  status: 'not_started' | 'in_progress' | 'mastered';
}

interface ProgressData {
  skillLevel: number;
  learningProgress: number;
  topicsCompleted: number;
  totalTopics: number;
  weakAreas: string[];
  strongAreas: string[];
  topicProgress: TopicProgress[];
  quizScores: { week: string; score: number; date: string }[];
  studyTime: { day: string; hours: number; date: string }[];
  improvementData: { month: string; score: number }[];
  streakDays: number;
  totalStudyHours: number;
}

interface QuizAnalytics {
  totalAttempts: number;
  averageScore: number;
  passRate: number;
  topicPerformance: Record<string, number>;
}

// Topic mastery heatmap data
const topicCategories = [
  { name: 'JavaScript', topics: ['Variables', 'Functions', 'Arrays', 'Objects', 'Async/Await'] },
  { name: 'React', topics: ['Components', 'Hooks', 'State', 'Props', 'Context'] },
  { name: 'TypeScript', topics: ['Types', 'Interfaces', 'Generics', 'Enums', 'Decorators'] },
  { name: 'CSS', topics: ['Flexbox', 'Grid', 'Animations', 'Variables', 'Responsive'] },
];

const getMasteryColor = (level: number) => {
  if (level >= 90) return 'bg-emerald-500';
  if (level >= 70) return 'bg-emerald-400';
  if (level >= 50) return 'bg-amber-400';
  if (level >= 30) return 'bg-amber-300';
  if (level > 0) return 'bg-rose-300';
  return 'bg-muted';
};

const getMasteryLabel = (level: number) => {
  if (level >= 90) return 'Mastered';
  if (level >= 70) return 'Proficient';
  if (level >= 50) return 'Developing';
  if (level >= 30) return 'Beginner';
  if (level > 0) return 'Started';
  return 'Not Started';
};

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [quizAnalytics, setQuizAnalytics] = useState<QuizAnalytics | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'topics' | 'quizzes'>('overview');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [progressRes, quizRes] = await Promise.all([
        api.getProgress(),
        api.getQuizAnalytics(),
      ]);

      if (progressRes.success && progressRes.data) {
        setProgress(progressRes.data as ProgressData);
      }
      if (quizRes.success && quizRes.data) {
        setQuizAnalytics(quizRes.data as QuizAnalytics);
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sample data for visualization (will be replaced by real data)
  const quizScoresData = progress?.quizScores?.length
    ? progress.quizScores.slice(-8).map((q, i) => ({ week: `Week ${i + 1}`, score: q.score }))
    : [
      { week: 'Week 1', score: 65 },
      { week: 'Week 2', score: 68 },
      { week: 'Week 3', score: 72 },
      { week: 'Week 4', score: 80 },
      { week: 'Week 5', score: 85 },
      { week: 'Week 6', score: 88 },
    ];

  const studyTimeData = progress?.studyTime?.length
    ? progress.studyTime.slice(-7).map(s => ({ day: s.day, hours: s.hours }))
    : [
      { day: 'Mon', hours: 2.5 },
      { day: 'Tue', hours: 3.0 },
      { day: 'Wed', hours: 1.5 },
      { day: 'Thu', hours: 4.0 },
      { day: 'Fri', hours: 3.5 },
      { day: 'Sat', hours: 5.0 },
      { day: 'Sun', hours: 2.0 },
    ];

  const radarData = quizAnalytics?.topicPerformance
    ? Object.entries(quizAnalytics.topicPerformance).map(([topic, score]) => ({
      topic,
      score,
      fullMark: 100,
    }))
    : [
      { topic: 'JavaScript', score: 85, fullMark: 100 },
      { topic: 'React', score: 75, fullMark: 100 },
      { topic: 'TypeScript', score: 60, fullMark: 100 },
      { topic: 'CSS', score: 80, fullMark: 100 },
      { topic: 'APIs', score: 70, fullMark: 100 },
    ];

  const totalHours = progress?.totalStudyHours || studyTimeData.reduce((sum, day) => sum + day.hours, 0);
  const averageQuizScore = quizAnalytics?.averageScore || Math.round(quizScoresData.reduce((sum, w) => sum + w.score, 0) / quizScoresData.length);
  const streakDays = progress?.streakDays || 7;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">Progress Analytics</h2>
          <p className="text-muted-foreground">
            Track your learning progress with detailed topic-level insights
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={activeTab === 'overview' ? 'default' : 'outline'}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </Button>
          <Button
            variant={activeTab === 'topics' ? 'default' : 'outline'}
            onClick={() => setActiveTab('topics')}
          >
            Topics
          </Button>
          <Button
            variant={activeTab === 'quizzes' ? 'default' : 'outline'}
            onClick={() => setActiveTab('quizzes')}
          >
            Quizzes
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-orange-500/10 to-rose-500/10 border-orange-500/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-orange-500/20">
                <Flame className="w-5 h-5 text-orange-500" />
              </div>
              <div>
                <p className="text-3xl font-bold text-orange-500">{streakDays}</p>
                <p className="text-xs text-muted-foreground">Day Streak</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10">
                <Trophy className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-bold">{averageQuizScore}%</p>
                <p className="text-xs text-muted-foreground">Avg Quiz Score</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-cyan-500/10">
                <Clock className="w-5 h-5 text-cyan-500" />
              </div>
              <div>
                <p className="text-3xl font-bold">{totalHours.toFixed(1)}h</p>
                <p className="text-xs text-muted-foreground">Total Study Time</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-emerald-500/10">
                <BookOpen className="w-5 h-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-3xl font-bold">{progress?.topicsCompleted || 12}/{progress?.totalTopics || 36}</p>
                <p className="text-xs text-muted-foreground">Topics Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {activeTab === 'overview' && (
        <>
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Quiz Scores Trend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Quiz Scores Trend</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={quizScoresData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="week" tick={{ fill: 'currentColor', opacity: 0.5 }} />
                    <YAxis domain={[0, 100]} tick={{ fill: 'currentColor', opacity: 0.5 }} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }} />
                    <Line type="monotone" dataKey="score" stroke="var(--primary)" strokeWidth={3} dot={{ fill: 'var(--primary)', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Study Time Distribution */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Weekly Study Time</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={studyTimeData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="day" tick={{ fill: 'currentColor', opacity: 0.5 }} />
                    <YAxis tick={{ fill: 'currentColor', opacity: 0.5 }} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }} />
                    <Bar dataKey="hours" fill="var(--primary)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Skill Radar */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg">Skill Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.1)" />
                  <PolarAngleAxis dataKey="topic" tick={{ fill: 'currentColor', opacity: 0.7 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'currentColor', opacity: 0.5 }} />
                  <Radar name="Score" dataKey="score" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.3} strokeWidth={2} />
                </RadarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </>
      )}

      {activeTab === 'topics' && (
        <>
          {/* Topic Mastery Heatmap */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5" />
                Topic Mastery Heatmap
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {topicCategories.map((category) => (
                  <div key={category.name}>
                    <h4 className="font-medium mb-3">{category.name}</h4>
                    <div className="grid grid-cols-5 gap-2">
                      {category.topics.map((topic) => {
                        // Generate random mastery for demo (will use real data)
                        const mastery = Math.floor(Math.random() * 100);
                        return (
                          <div key={topic} className="group relative">
                            <div
                              className={`h-16 rounded-lg ${getMasteryColor(mastery)} flex items-center justify-center transition-all hover:scale-105 cursor-pointer`}
                            >
                              <span className="text-white text-xs font-bold">{mastery}%</span>
                            </div>
                            <p className="text-xs text-center mt-1 text-muted-foreground truncate">{topic}</p>
                            {/* Tooltip */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-popover border border-border rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                              <p className="font-medium">{topic}</p>
                              <p className="text-xs text-muted-foreground">{getMasteryLabel(mastery)}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              {/* Legend */}
              <div className="flex items-center justify-center gap-4 mt-8 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-muted" />
                  <span className="text-xs text-muted-foreground">Not Started</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-rose-300" />
                  <span className="text-xs text-muted-foreground">Started</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-amber-300" />
                  <span className="text-xs text-muted-foreground">Beginner</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-amber-400" />
                  <span className="text-xs text-muted-foreground">Developing</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-emerald-400" />
                  <span className="text-xs text-muted-foreground">Proficient</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-emerald-500" />
                  <span className="text-xs text-muted-foreground">Mastered</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Strengths & Weaknesses */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-emerald-500 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Strong Areas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(progress?.strongAreas || ['React Components', 'JavaScript ES6', 'CSS Flexbox']).map((area, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/10">
                      <span className="font-medium">{area}</span>
                      <span className="text-emerald-500 font-bold">90%+</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg text-rose-500 flex items-center gap-2">
                  <Target className="w-5 h-5" />
                  Areas to Improve
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {(progress?.weakAreas || ['TypeScript Generics', 'Testing', 'System Design']).map((area, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-rose-500/10">
                      <span className="font-medium">{area}</span>
                      <span className="text-rose-500 font-bold">&lt;50%</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {activeTab === 'quizzes' && (
        <>
          {/* Quiz Analytics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-4xl font-bold text-primary">{quizAnalytics?.totalAttempts || 0}</p>
                <p className="text-muted-foreground">Quizzes Taken</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-4xl font-bold text-emerald-500">{quizAnalytics?.passRate || 0}%</p>
                <p className="text-muted-foreground">Pass Rate</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-4xl font-bold text-amber-500">{quizAnalytics?.averageScore || 0}%</p>
                <p className="text-muted-foreground">Average Score</p>
              </CardContent>
            </Card>
          </div>

          {/* Topic Performance */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Performance by Topic</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(quizAnalytics?.topicPerformance || { JavaScript: 85, React: 75, TypeScript: 60 }).map(([topic, score]) => (
                  <div key={topic}>
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{topic}</span>
                      <span className={`font-bold ${score >= 70 ? 'text-emerald-500' : score >= 50 ? 'text-amber-500' : 'text-rose-500'}`}>
                        {score}%
                      </span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${score >= 70 ? 'bg-emerald-500' : score >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                        style={{ width: `${score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </DashboardLayout>
  );
}
