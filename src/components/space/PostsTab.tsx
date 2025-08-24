
"use client";

import { useState } from 'react';
import type { Post } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PostsListView } from './PostsListView';
import { AppView } from './AppView';

interface PostsTabProps {
  posts: Post[];
  onEditPost: (post: Post) => void;
}

export function PostsTab({ posts, onEditPost }: PostsTabProps) {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  return (
    <Tabs defaultValue="app-view" className="w-full">
      <div className="flex justify-start">
        <TabsList>
          <TabsTrigger value="app-view">عرض التطبيقات</TabsTrigger>
          <TabsTrigger value="post-view">عرض المنشورات</TabsTrigger>
        </TabsList>
      </div>
      <TabsContent value="post-view" className="mt-4">
        <PostsListView posts={posts} onEditPost={onEditPost} />
      </TabsContent>
      <TabsContent value="app-view" className="mt-4">
        <AppView posts={posts} />
      </TabsContent>
    </Tabs>
  );
}
