
"use client";

import type { Post, Platform } from '@/lib/types';
import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { PlatformIcon, PLATFORM_DETAILS } from './PlatformIcon';

interface AppViewProps {
  posts: Post[];
}

export function AppView({ posts }: AppViewProps) {
  const postsByPlatform = useMemo(() => {
    const platformCounts: { [key in Platform]?: number } = {};
    for (const post of posts) {
      platformCounts[post.platform] = (platformCounts[post.platform] || 0) + 1;
    }
    return platformCounts;
  }, [posts]);

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {Object.entries(PLATFORM_DETAILS).map(([platform, details]) => {
        const count = postsByPlatform[platform as Platform] || 0;
        return (
          <Card key={platform}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{details.name}</CardTitle>
              <PlatformIcon platform={platform as Platform} className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{count}</div>
              <p className="text-xs text-muted-foreground">
                {count === 0 ? 'لا توجد منشورات' : count === 1 ? 'منشور واحد' : count === 2 ? 'منشوران' : `${count} منشورات`}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
