'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Clock, Star, Play, FileText, Code } from 'lucide-react';

interface ResourceCardProps {
  title: string;
  description: string;
  type: 'video' | 'article' | 'interactive' | 'course';
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  rating: number;
  author: string;
  matched?: boolean;
  url?: string;
  onAccess?: () => void;
}

const typeIcons = {
  video: <Play className="w-4 h-4" />,
  article: <FileText className="w-4 h-4" />,
  interactive: <Code className="w-4 h-4" />,
  course: <BookOpen className="w-4 h-4" />,
};

const difficultyColors = {
  beginner: 'bg-emerald-100 text-emerald-800',
  intermediate: 'bg-blue-100 text-blue-800',
  advanced: 'bg-purple-100 text-purple-800',
};

export function ResourceCard({
  title,
  description,
  type,
  duration,
  difficulty,
  rating,
  author,
  matched = false,
  url,
  onAccess,
}: ResourceCardProps) {
  return (
    <Card className={`hover:shadow-lg transition-all ${matched ? 'border-primary/50 bg-gradient-to-br from-primary/5 to-transparent' : ''}`}>
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <CardTitle className="text-lg">{title}</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">{author}</p>
          </div>
          {matched && <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded whitespace-nowrap">AI Recommended</span>}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>

        {/* Metadata */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded-full">
            {typeIcons[type]}
            <span className="capitalize">{type}</span>
          </div>
          <div className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded-full">
            <Clock className="w-3 h-3" />
            <span>{duration}</span>
          </div>
          <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full capitalize ${difficultyColors[difficulty]}`}>
            {difficulty}
          </div>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${i < Math.floor(rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">({rating})</span>
        </div>

        {/* Action Button */}
        <Button
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground mt-2"
          size="sm"
          onClick={onAccess}
        >
          Access Resource
        </Button>
      </CardContent>
    </Card>
  );
}
