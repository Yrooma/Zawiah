
"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { getSpaces, updatePost } from '@/lib/services';
import type { Space, Post, Platform, PostStatus, User } from '@/lib/types';
import { CalendarTab } from '@/components/space/CalendarTab';
import { CreatePostDialog } from '@/components/space/CreatePostDialog';
import { Loader2, PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { CreateItemDialog } from '@/components/layout/CreateItemDialog';

export default function PersonalCalendarPage() {
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  const [isCreatePostOpen, setCreatePostOpen] = useState(false);
  const [isCreateItemOpen, setCreateItemOpen] = useState(false);
  const [postToEdit, setPostToEdit] = useState<Post | undefined>(undefined);
  const { toast } = useToast();

  const fetchAllPosts = useCallback(async () => {
    if (user) {
      try {
        setIsLoading(true);
        const spacesFromDb = await getSpaces(user.uid);
        setSpaces(spacesFromDb);
        const postsWithSpaceInfo = spacesFromDb.flatMap(space => 
            space.posts.map(post => ({
                ...post,
                spaceId: space.id,
                spaceName: space.name,
            }))
        );
        setAllPosts(postsWithSpaceInfo);
      } catch (err) {
        console.error(err);
        toast({
          title: "خطأ",
          description: "فشل تحميل المنشورات.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }
  }, [user, toast]);

  useEffect(() => {
    fetchAllPosts();
  }, [fetchAllPosts]);
  
  const handleOpenEditPostDialog = (post: Post) => {
    setPostToEdit(post);
    setCreatePostOpen(true);
  }

  const handleAddOrUpdatePost = async (postDetails: { title: string; content: string; platform: Platform; scheduledAt: Date }, id?: string) => {
    if (!postToEdit?.spaceId || !user) return;
    
    const currentUser: User = { id: user.uid, name: user.name, avatarUrl: user.avatarUrl };
    
    try {
      if (id) {
         const postToUpdate = allPosts.find(p => p.id === id);
        if (!postToUpdate) return;

        const updatedPostData = {
          ...postDetails,
          lastModifiedBy: currentUser,
          activityLog: [...postToUpdate.activityLog, { user: currentUser, action: 'تحديث المنشور', date: 'الآن' }]
        };
        await updatePost(postToEdit.spaceId, id, updatedPostData);
        await fetchAllPosts(); // Refresh all posts
      }
    } catch (e) {
        console.error("Failed to save post", e);
        toast({ title: "خطأ في حفظ المنشور", variant: "destructive" });
    }
  };

  const handleUpdatePostStatus = async (postId: string, newStatus: PostStatus, spaceId: string) => {
    if (!user) return;
    try {
        const postToUpdate = allPosts.find(p => p.id === postId);
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

        await updatePost(spaceId, postId, updatedPostData);
        await fetchAllPosts(); // Refresh all posts
    } catch(e) {
        console.error("Failed to update status", e);
        toast({ title: "خطأ في تحديث الحالة", variant: "destructive" });
    }
  };

  if (isLoading || authLoading) {
    return (
      <div className="flex justify-center items-center h-full pt-16">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <main className="flex-1 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <h1 className="text-3xl font-headline font-bold text-foreground">
                التقويم الشخصي
            </h1>
            <Button onClick={() => setCreateItemOpen(true)}>
                <PlusCircle />
                <span>إنشاء جديد</span>
            </Button>
        </div>
        <CalendarTab 
            posts={allPosts} 
            onUpdatePostStatus={handleUpdatePostStatus} 
            onEditPost={handleOpenEditPostDialog} 
        />
        {postToEdit && (
          <CreatePostDialog
            spaceId={postToEdit.spaceId!}
            open={isCreatePostOpen}
            onOpenChange={setCreatePostOpen}
            postToEdit={postToEdit}
            onSavePost={handleAddOrUpdatePost}
          />
        )}
        <CreateItemDialog open={isCreateItemOpen} onOpenChange={setCreateItemOpen} />
      </div>
    </main>
  );
}
