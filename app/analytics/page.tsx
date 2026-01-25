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

  // Transform data for visualization
  const quizScoresData = progress?.quizScores?.length
    ? progress.quizScores.slice(-8).map((q, i) => ({ week: `Week ${i + 1}`, score: q.score }))
    : [];

  const studyTimeData = progress?.studyTime?.length
    ? progress.studyTime.slice(-7).map(s => ({ day: s.day, hours: s.hours }))
    : [];

  const radarData = quizAnalytics?.topicPerformance
    ? Object.entries(quizAnalytics.topicPerformance).map(([topic, score]) => ({
      topic,
      score,
      fullMark: 100,
    }))
    : [];

  const totalHours = progress?.totalStudyHours || studyTimeData.reduce((sum, day) => sum + day.hours, 0);
  const averageQuizScore = quizAnalytics?.averageScore || (quizScoresData.length > 0 ? Math.round(quizScoresData.reduce((sum, w) => sum + w.score, 0) / quizScoresData.length) : 0);
  const streakDays = progress?.streakDays || 0;

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
                <p className="text-3xl font-bold">{progress?.topicsCompleted || 0}/{progress?.totalTopics || 0}</p>
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
                  {quizScoresData.length > 0 ? (
                    <LineChart data={quizScoresData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="week" tick={{ fill: 'currentColor', opacity: 0.5 }} />
                      <YAxis domain={[0, 100]} tick={{ fill: 'currentColor', opacity: 0.5 }} />
                      <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }} />
                      <Line type="monotone" dataKey="score" stroke="var(--primary)" strokeWidth={3} dot={{ fill: 'var(--primary)', r: 4 }} />
                    </LineChart>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      No quiz data available yet.
                    </div>
                  )}
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
                  {studyTimeData.length > 0 ? (
                    <BarChart data={studyTimeData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                      <XAxis dataKey="day" tick={{ fill: 'currentColor', opacity: 0.5 }} />
                      <YAxis tick={{ fill: 'currentColor', opacity: 0.5 }} />
                      <Tooltip contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '12px' }} />
                      <Bar dataKey="hours" fill="var(--primary)" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      No study time logged yet.
                    </div>
                  )}
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
                {radarData.length > 0 ? (
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="rgba(255,255,255,0.1)" />
                    <PolarAngleAxis dataKey="topic" tick={{ fill: 'currentColor', opacity: 0.7 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: 'currentColor', opacity: 0.5 }} />
                    <Radar name="Score" dataKey="score" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.3} strokeWidth={2} />
                  </RadarChart>
                ) : (
                  <div className="flex items-center justify-center h-full text-muted-foreground">
                    No skill data available yet.
                  </div>
                )}
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
                <div className="space-y-6">
                  {progress?.topicProgress && progress.topicProgress.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                      {progress.topicProgress.map((topic) => (
                        <div key={topic.topicId} className="group relative">
                          <div
                            className={`h-16 rounded-lg ${getMasteryColor(topic.masteryLevel)} flex items-center justify-center transition-all hover:scale-105 cursor-pointer`}
                          >
                            <span className="text-white text-xs font-bold">{topic.masteryLevel}%</span>
                          </div>
                          <p className="text-xs text-center mt-1 text-muted-foreground truncate">{topic.topicName}</p>
                          {/* Tooltip */}
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-popover border border-border rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 whitespace-nowrap">
                            <p className="font-medium">{topic.topicName}</p>
                            <p className="text-xs text-muted-foreground">{getMasteryLabel(topic.masteryLevel)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <p>No topic progress data available yet.</p>
                      <p className="text-sm">Start learning to see your mastery heatmap!</p>
                    </div>
                  )}
                </div>
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
                  {(progress?.strongAreas || []).length > 0 ? (
                    progress?.strongAreas.map((area, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/10">
                        <span className="font-medium">{area}</span>
                        <span className="text-emerald-500 font-bold">90%+</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No strong areas identified yet.</p>
                  )}
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
                  {(progress?.strongAreas || []).length > 0 ? (
                    progress?.strongAreas.map((area, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/10">
                        <span className="font-medium">{area}</span>
                        <span className="text-emerald-500 font-bold">90%+</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No strong areas identified yet.</p>
                  )}
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
                  {(progress?.weakAreas || []).length > 0 ? (
                    progress?.weakAreas.map((area, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-rose-500/10">
                        <span className="font-medium">{area}</span>
                        <span className="text-rose-500 font-bold">&lt;50%</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">No weak areas identified yet.</p>
                  )}
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
                {Object.keys(quizAnalytics?.topicPerformance || {}).length > 0 ? (
                  Object.entries(quizAnalytics!.topicPerformance).map(([topic, score]) => (
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
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">No topic performance data available.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </DashboardLayout>
  );
}
