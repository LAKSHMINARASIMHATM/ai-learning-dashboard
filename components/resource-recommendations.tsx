'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ResourceCard } from './resource-card';
import { Sparkles, Loader2 } from 'lucide-react';
import api from '@/lib/api';
import { toast } from 'sonner';

interface Resource {
  _id: string;
  title: string;
  description: string;
  type: 'video' | 'article' | 'interactive' | 'course';
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  rating: number;
  author: string;
  url?: string;
  matched?: boolean;
}

export function ResourceRecommendations() {
  const [loading, setLoading] = useState(true);
  const [matchedResources, setMatchedResources] = useState<Resource[]>([]);
  const [otherResources, setOtherResources] = useState<Resource[]>([]);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        // Fetch recommended resources
        const recommendedRes = await api.getRecommendedResources();
        if (recommendedRes.success && Array.isArray(recommendedRes.data)) {
          setMatchedResources((recommendedRes.data as any[]).map((r: any) => ({ ...r, matched: true })));
        }

        // Fetch other popular resources
        const allRes = await api.getResources();
        if (allRes.success && Array.isArray(allRes.data)) {
          // Filter out ones that are already in matched
          const matchedIds = new Set((recommendedRes.data as any[])?.map((r: any) => r._id) || []);
          setOtherResources((allRes.data as any[]).filter((r: any) => !matchedIds.has(r._id)).slice(0, 4));
        }
      } catch (error) {
        console.error('Failed to fetch resources:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  const handleAccessResource = async (resource: Resource) => {
    try {
      // Log study time or progress
      await api.logStudyTime(new Date().toISOString().split('T')[0], 0.5); // Log 30 mins
      toast.success(`Started learning: ${resource.title}`);

      // Open the real resource URL in a new tab
      if (resource.url) {
        window.open(resource.url, '_blank', 'noopener,noreferrer');
      }
    } catch (error) {
      console.error('Failed to access resource:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            Recommended Learning Resources
          </h3>
          <p className="text-sm text-muted-foreground mt-1">AI-curated resources based on your skill gaps and learning goals</p>
        </div>
      </div>

      {/* Top Recommendations - Matched to Skill Gaps */}
      {matchedResources.length > 0 && (
        <Card className="border-primary/30 bg-gradient-to-r from-primary/5 via-transparent to-transparent">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <span className="inline-block w-2 h-2 rounded-full bg-primary animate-pulse" />
              Matched to Your Skill Gaps
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matchedResources.map((resource) => (
                <ResourceCard
                  key={resource._id}
                  {...resource}
                  onAccess={() => handleAccessResource(resource)}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Other Recommended Resources */}
      <div>
        <h4 className="font-semibold text-foreground mb-3">Other Popular Resources</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {otherResources.map((resource) => (
            <ResourceCard
              key={resource._id}
              {...resource}
              onAccess={() => handleAccessResource(resource)}
            />
          ))}
        </div>
      </div>

      {/* View All Button */}
      <div className="pt-4">
        <Button variant="outline" className="w-full bg-transparent">
          Browse All Resources
        </Button>
      </div>
    </div>
  );
}
