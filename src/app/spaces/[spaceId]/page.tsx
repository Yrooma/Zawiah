
"use client";

import { useState } from 'react';
import { notFound } from 'next/navigation';
import { spaces, users } from '@/lib/data';
import type { Post, Platform, PostStatus } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SpaceHeader } from '@/components/space/SpaceHeader';
import { CalendarTab } from '@/components/space/CalendarTab';
import { IdeasTab } from '@/components/space/IdeasTab';
import { CreatePostDialog } from '@/components/space/CreatePostDialog';
import React from 'react';

export default function SpacePage({ params }: { params: { spaceId: string } }) {
  const spaceId = params.spaceId;
  const space = spaces.find((s) => s.id === spaceId);

  if (!space) {
    notFound();
  }

  const [posts, setPosts] = useState<Post[]>(space.posts);
  const [isCreatePostOpen, setCreatePostOpen] = useState(false);
  const [initialPostContent, setInitialPostContent] = useState<string | undefined>(undefined);
  const [postToEdit, setPostToEdit] = useState<Post | undefined>(undefined);

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
    if (id) {
        // Update existing post
        const updatedPosts = posts.map(p => {
            if (p.id === id) {
                return {
                    ...p,
                    ...postDetails,
                    lastModifiedBy: users[0],
                    activityLog: [...p.activityLog, { user: users[0], action: 'حدّث المنشور', date: 'الآن' }]
                };
            }
            return p;
        });
        setPosts(updatedPosts);
        space.posts = updatedPosts;
    } else {
        // Add new post
        const newPost: Post = {
            id: `post-${Date.now()}`,
            ...postDetails,
            status: 'draft',
            createdBy: users[0], 
            lastModifiedBy: users[0],
            activityLog: [{ user: users[0], action: 'أنشأ', date: 'الآن' }],
        };
        const updatedPosts = [...posts, newPost];
        setPosts(updatedPosts);
        space.posts = updatedPosts; 
    }
  };

  const handleUpdatePostStatus = (postId: string, newStatus: PostStatus) => {
    const statusMessages = {
      draft: 'مسودة',
      ready: 'جاهز للنشر',
      published: 'تم النشر',
    };
    const updatedPosts = posts.map(p => {
      if (p.id === postId) {
        return { 
          ...p, 
          status: newStatus,
          lastModifiedBy: users[0],
          activityLog: [...p.activityLog, { user: users[0], action: `غيّر الحالة إلى "${statusMessages[newStatus]}"`, date: 'الآن' }]
        };
      }
      return p;
    });
    setPosts(updatedPosts);
    space.posts = updatedPosts; 
  };


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
              <TabsTrigger value="calendar">التقويم</TabsTrigger>
              <TabsTrigger value="ideas">الأفكار</TabsTrigger>
            </TabsList>
            <TabsContent value="calendar" className="mt-6">
              <CalendarTab posts={posts} onUpdatePostStatus={handleUpdatePostStatus} onEditPost={handleOpenEditPostDialog} />
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
        initialContent={initialContent}
        postToEdit={postToEdit}
        onSavePost={handleAddOrUpdatePost}
      />
    </div>
  );
}
