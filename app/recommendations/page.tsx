'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Sparkles, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

import api from '@/lib/api';

interface Recommendation {
  topic: string;
  priority: 'high' | 'medium' | 'low';
  reason: string;
  suggestedResources: { title: string; type: string; url: string }[];
}

export default function RecommendationsPage() {
  const router = useRouter();
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const data = await api.getQuizRecommendations() as any;
      if (data.success && data.data) {
        setRecommendations(data.data.recommendations);
      } else {
        setError(data.error || 'Failed to fetch recommendations');
      }
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  const handleStartLearning = (url: string, title: string) => {
    toast.success(`Starting: ${title}`);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-6 h-6 text-primary" />
          <h2 className="text-3xl font-bold text-foreground">AI Recommendations</h2>
        </div>
        <p className="text-muted-foreground">
          Personalized learning recommendations based on your quiz results and skill assessments
        </p>
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/20 text-destructive p-4 rounded-lg mb-8 flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <p>{error}</p>
        </div>
      )}

      {recommendations.length === 0 && !error ? (
        <Card className="mb-8 border-dashed">
          <CardContent className="pt-12 pb-12 text-center">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">No Recommendations Yet</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Take a skill assessment quiz to get personalized learning recommendations tailored to your needs.
            </p>
            <Button onClick={() => router.push('/quiz')}>
              Go to Quiz Center
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recommendations.map((rec, index) => (
            <Card
              key={index}
              className="hover:shadow-lg transition-shadow flex flex-col border-l-4 border-l-primary"
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{rec.topic}</CardTitle>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${rec.priority === 'high'
                      ? 'bg-red-100 text-red-800'
                      : rec.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-blue-100 text-blue-800'
                      }`}
                  >
                    {rec.priority} Priority
                  </span>
                </div>
              </CardHeader>
              <CardContent className="flex flex-col flex-1">
                <p className="text-sm text-muted-foreground mb-6">
                  <strong>Why:</strong> {rec.reason}
                </p>

                <div className="space-y-3 flex-1">
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Suggested Resources</p>
                  {rec.suggestedResources.map((resource, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg hover:bg-muted transition-colors border border-transparent hover:border-border">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{resource.title}</span>
                        <span className="text-[10px] text-muted-foreground uppercase">{resource.type}</span>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-primary hover:text-primary hover:bg-primary/10"
                        onClick={() => handleStartLearning(resource.url, resource.title)}
                      >
                        Start
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* CTA Section */}
      <Card className="mt-8 bg-gradient-to-r from-primary/10 to-secondary/10 border border-primary/20">
        <CardContent className="pt-8 text-center">
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Want More Personalized Help?
          </h3>
          <p className="text-muted-foreground mb-6">
            Chat with our AI tutor to get tailored guidance on any topic
          </p>
          <Button
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={() => router.push('/assistant')}
          >
            Chat with AI Tutor
          </Button>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
