"use client";

import { useState, useEffect } from 'react';
import { notFound } from 'next/navigation';
import { getSpaceById } from '@/lib/services';
import type { Space, Post, Platform, PostStatus } from '@/lib/types';
import { users } from '@/lib/data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SpaceHeader } from '@/components/space/SpaceHeader';
import { CalendarTab } from '@/components/space/CalendarTab';
import { IdeasTab } from '@/components/space/IdeasTab';
import { CreatePostDialog } from '@/components/space/CreatePostDialog';
import React from 'react';
import { Loader2 } from 'lucide-react';

export default function SpacePage({ params: { spaceId } }: { params: { spaceId: string } }) {
  const [space, setSpace] = useState<Space | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isCreatePostOpen, setCreatePostOpen] = useState(false);
  const [initialPostContent, setInitialPostContent] = useState<string | undefined>(undefined);
  const [postToEdit, setPostToEdit] = useState<Post | undefined>(undefined);

  useEffect(() => {
    const fetchSpace = async () => {
      try {
        setIsLoading(true);
        const spaceData = await getSpaceById(spaceId);
        if (spaceData) {
          setSpace(spaceData);
        } else {
          notFound();
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load space data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSpace();
  }, [spaceId]);

  const handleOpenCreatePostDialog = (content?: string) => {
    setInitialPostContent(content);
    setPostToEdit(undefined);
    setCreatePostOpen(true);
  };

  const handleOpenEditPostDialog = (post: Post) => {
    setPostToEdit(post);
    setInitialPostContent(undefined); 
    setCreatePostOpen(true);
  }
  
  const handleAddOrUpdatePost = (postDetails: { title: string; content: string; platform: Platform; scheduledAt: Date }, id?: string) => {
    if (!space) return;

    if (id) {
        // Update existing post
        const updatedPosts = space.posts.map(p => {
            if (p.id === id) {
                const updatedPost = {
                    ...p,
                    ...postDetails,
                    lastModifiedBy: users[0],
                    activityLog: [...p.activityLog, { user: users[0], action: 'updated the post', date: 'Just now' }]
                };
                return updatedPost;
            }
            return p;
        });
        setSpace({...space, posts: updatedPosts});
    } else {
        // Add new post
        const newPost: Post = {
            id: `post-${Date.now()}`,
            ...postDetails,
            status: 'draft',
            createdBy: users[0], 
            lastModifiedBy: users[0],
            activityLog: [{ user: users[0], action: 'created', date: 'Just now' }],
        };
        const updatedPosts = [...space.posts, newPost];
        setSpace({...space, posts: updatedPosts});
    }
  };

  const handleUpdatePostStatus = (postId: string, newStatus: PostStatus) => {
    if (!space) return;
    const statusMessages = {
      draft: 'Draft',
      ready: 'Ready to Publish',
      published: 'Published',
    };
    const updatedPosts = space.posts.map(p => {
      if (p.id === postId) {
        return { 
          ...p, 
          status: newStatus,
          lastModifiedBy: users[0],
          activityLog: [...p.activityLog, { user: users[0], action: `changed status to "${statusMessages[newStatus]}"`, date: 'Just now' }]
        };
      }
      return p;
    });
    setSpace({...space, posts: updatedPosts});
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !space) {
     return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-destructive mb-4">Error</h1>
        <p className="text-muted-foreground">{error || "Could not find the requested space."}</p>
        <Button onClick={() => window.location.href = '/'} className="mt-4">Go to Dashboard</Button>
      </div>
    );
  }


  return (
    <div className="flex flex-col min-h-screen">
      <SpaceHeader 
        spaceName={space.name} 
        onNewPostClick={() => handleOpenCreatePostDialog()}
      />
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="calendar" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
              <TabsTrigger value="calendar">Calendar</TabsTrigger>
              <TabsTrigger value="ideas">Ideas</TabsTrigger>
            </TabsList>
            <TabsContent value="calendar" className="mt-6">
              <CalendarTab posts={space.posts} onUpdatePostStatus={handleUpdatePostStatus} onEditPost={handleOpenEditPostDialog} />
            </TabsContent>
            <TabsContent value="ideas" className="mt-6">
              <IdeasTab space={space} onConvertToPost={handleOpenCreatePostDialog} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <CreatePostDialog
        open={isCreatePostOpen}
        onOpenChange={setCreatePostOpen}
        initialContent={initialPostContent}
        postToEdit={postToEdit}
        onSavePost={handleAddOrUpdatePost}
      />
    </div>
  );
}
