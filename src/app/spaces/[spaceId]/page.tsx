
"use client";

import { useState, useEffect, useCallback, use } from 'react';
import { notFound, useRouter, useParams } from 'next/navigation';
import { getSpaceById, addPost, updatePost, addIdea, deleteIdea, updateIdea } from '@/lib/services';
import type { Space, Post, Platform, PostStatus, Idea, User } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SpaceHeader } from '@/components/space/SpaceHeader';
import { CalendarTab } from '@/components/space/CalendarTab';
import { IdeasTab } from '@/components/space/IdeasTab';
import { CreatePostDialog } from '@/components/space/CreatePostDialog';
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';

export default function SpacePage() {
  const params = useParams();
  const spaceId = params.spaceId as string;
  
  const [space, setSpace] = useState<Space | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [isCreatePostOpen, setCreatePostOpen] = useState(false);
  const [initialPostContent, setInitialPostContent] = useState<string | undefined>(undefined);
  const [postToEdit, setPostToEdit] = useState<Post | undefined>(undefined);
  const { toast } = useToast();

  const fetchSpace = useCallback(async () => {
    if (user) {
      try {
        setIsLoading(true);
        const spaceData = await getSpaceById(spaceId);
        if (spaceData && spaceData.memberIds.includes(user.uid)) {
          setSpace(spaceData);
        } else {
          notFound();
        }
      } catch (err) {
        console.error(err);
        setError("فشل تحميل بيانات المساحة.");
      } finally {
        setIsLoading(false);
      }
    }
  }, [spaceId, user]);

  useEffect(() => {
     if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    if (spaceId && user) {
        fetchSpace();
    }
  }, [fetchSpace, spaceId, user]);

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
  
  const handleAddOrUpdatePost = async (postDetails: { title: string; content: string; platform: Platform; scheduledAt: Date }, id?: string) => {
    if (!space || !user) return;
    
    const currentUser: User = { id: user.uid, name: user.name, avatarUrl: user.avatarUrl };

    try {
      if (id) {
        const postToUpdate = space.posts.find(p => p.id === id);
        if (!postToUpdate) return;
        const updatedPostData = {
          ...postDetails,
          lastModifiedBy: currentUser,
          activityLog: [...postToUpdate.activityLog, { user: currentUser, action: 'تحديث المنشور', date: 'الآن' }]
        };
        await updatePost(space.id, id, updatedPostData);
        
        const updatedPosts = space.posts.map(p => p.id === id ? { ...p, ...updatedPostData, scheduledAt: postDetails.scheduledAt } : p);
        setSpace({...space, posts: updatedPosts});
      } else {
        const newPostData: Omit<Post, 'id'> = {
            ...postDetails,
            status: 'draft',
            createdBy: currentUser, 
            lastModifiedBy: currentUser,
            activityLog: [{ user: currentUser, action: 'إنشاء', date: 'الآن' }],
        };
        const newPost = await addPost(space.id, newPostData);
        
        const updatedPosts = [...space.posts, newPost];
        setSpace({...space, posts: updatedPosts});
      }
    } catch (e) {
        console.error("Failed to save post", e);
        toast({ title: "خطأ في حفظ المنشور", variant: "destructive" });
    }
  };

  const handleUpdatePostStatus = async (postId: string, newStatus: PostStatus) => {
    if (!space || !user) return;
    try {
        const postToUpdate = space.posts.find(p => p.id === postId);
        if (!postToUpdate) return;
        
        const currentUser: User = { id: user.uid, name: user.name, avatarUrl: user.avatarUrl };
        const statusMessages = {
            draft: 'مسودة',
            ready: 'جاهز للنشر',
            published: 'تم النشر',
        };

        const updatedPostData = {
            status: newStatus,
            lastModifiedBy: currentUser,
            activityLog: [...postToUpdate.activityLog, { user: currentUser, action: `غير الحالة إلى "${statusMessages[newStatus]}"`, date: 'الآن' }]
        };

        await updatePost(space.id, postId, updatedPostData);

        const updatedPosts = space.posts.map(p => p.id === postId ? { ...p, ...updatedPostData } : p);
        setSpace({...space, posts: updatedPosts});
    } catch(e) {
        console.error("Failed to update status", e);
        toast({ title: "خطأ في تحديث الحالة", variant: "destructive" });
    }
  };
  
  const handleAddIdea = async (content: string) => {
    if (!space || !user) return;
    try {
      const currentUser: User = { id: user.uid, name: user.name, avatarUrl: user.avatarUrl };
      const newIdeaData: Omit<Idea, 'id'> = {
        content,
        createdBy: currentUser,
        createdAt: new Date().toISOString(),
      };
      const newIdea = await addIdea(space.id, newIdeaData);
      const updatedIdeas = [...space.ideas, newIdea];
      setSpace({ ...space, ideas: updatedIdeas });
    } catch (e) {
      console.error("Failed to add idea", e);
      toast({ title: "خطأ في إضافة الفكرة", variant: "destructive" });
    }
  };

  const handleUpdateIdea = async (ideaId: string, content: string) => {
    if (!space) return;
    try {
      await updateIdea(space.id, ideaId, content);
      const updatedIdeas = space.ideas.map(idea => 
        idea.id === ideaId ? { ...idea, content } : idea
      );
      setSpace({ ...space, ideas: updatedIdeas });
    } catch (e) {
      console.error("Failed to update idea", e);
      toast({ title: "خطأ في تحديث الفكرة", variant: "destructive" });
    }
  };

  const handleDeleteIdea = async (ideaId: string) => {
    if (!space) return;
    try {
      await deleteIdea(space.id, ideaId);
      const updatedIdeas = space.ideas.filter(idea => idea.id !== ideaId);
      setSpace({ ...space, ideas: updatedIdeas });
    } catch (e) {
      console.error("Failed to delete idea", e);
      toast({ title: "خطأ في حذف الفكرة", variant: "destructive" });
    }
  };


  if (isLoading || authLoading || !user) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !space) {
     return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold text-destructive mb-4">خطأ</h1>
        <p className="text-muted-foreground">{error || "تعذر العثور على المساحة المطلوبة."}</p>
        <Button onClick={() => router.push('/dashboard')} className="mt-4">العودة إلى لوحة التحكم</Button>
      </div>
    );
  }


  return (
    <div className="flex flex-col min-h-screen">
      <SpaceHeader 
        spaceName={space.name} 
        onNewPostClick={() => handleOpenCreatePostDialog()}
        space={space}
        onSpaceUpdate={fetchSpace}
      />
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="calendar" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
              <TabsTrigger value="calendar">التقويم</TabsTrigger>
              <TabsTrigger value="ideas">الأفكار</TabsTrigger>
            </TabsList>
            <TabsContent value="calendar" className="mt-6">
              <CalendarTab posts={space.posts} onUpdatePostStatus={handleUpdatePostStatus} onEditPost={handleOpenEditPostDialog} />
            </TabsContent>
            <TabsContent value="ideas" className="mt-6">
              <IdeasTab 
                space={space} 
                onConvertToPost={handleOpenCreatePostDialog}
                onAddIdea={handleAddIdea}
                onDeleteIdea={handleDeleteIdea}
                onUpdateIdea={handleUpdateIdea}
              />
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
