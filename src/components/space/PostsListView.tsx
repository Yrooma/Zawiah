
"use client";

import { useState } from 'react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import type { Post, PostStatus } from '@/lib/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { PostSheet } from './PostSheet';
import { cn } from '@/lib/utils';
import { PlatformIcon } from './PlatformIcon';
import { Button } from '@/components/ui/button';

interface PostsListViewProps {
  posts: Post[];
  onEditPost: (post: Post) => void;
  onDeletePost: (postId: string) => void;
}

const statusMessages: { [key in PostStatus]: string } = {
  draft: 'مسودة',
  ready: 'جاهز للنشر',
  published: 'تم النشر',
};

const statusClasses: { [key in PostStatus]: string } = {
  draft: 'bg-yellow-500 text-yellow-900',
  ready: 'bg-blue-500 text-white',
  published: 'bg-green-600 text-white',
};

export function PostsListView({ posts, onEditPost, onDeletePost }: PostsListViewProps) {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const handlePostSheetClose = () => {
    setSelectedPost(null);
  }

  const handleEdit = (post: Post) => {
    handlePostSheetClose();
    setTimeout(() => onEditPost(post), 100);
  }

  return (
    <>
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-center">العنوان</TableHead>
              <TableHead className="text-center">محور المحتوى</TableHead>
              <TableHead className="text-center">المنصة</TableHead>
              <TableHead className="text-center">الحالة</TableHead>
              <TableHead className="text-center">تاريخ النشر</TableHead>
              <TableHead className="text-center">الإجراءات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.length > 0 ? posts.map(post => (
              <TableRow key={post.id} onClick={() => setSelectedPost(post)} className="cursor-pointer">
                <TableCell className="font-medium text-center">{post.title}</TableCell>
                <TableCell className="text-center">
                  {post.pillar ? (
                    <div className="flex items-center justify-center gap-2">
                      <span>{post.pillar.name}</span>
                      <div className="h-2 w-2 rounded-full" style={{ backgroundColor: post.pillar.color }} />
                    </div>
                  ) : (
                    <span className="text-muted-foreground">-</span>
                  )}
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <span className="capitalize">{post.platform}</span>
                    <PlatformIcon platform={post.platform} className="h-4 w-4 text-muted-foreground" />
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="default" className={cn("pointer-events-none", statusClasses[post.status])}>
                    {statusMessages[post.status]}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">{format(post.scheduledAt as Date, 'd MMMM yyyy', { locale: ar })}</TableCell>
                <TableCell className="text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeletePost(post.id);
                    }}
                  >
                    حذف
                  </Button>
                </TableCell>
              </TableRow>
            )) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24">
                  لا توجد منشورات حتى الآن.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <PostSheet 
        post={selectedPost} 
        open={!!selectedPost} 
        onOpenChange={(isOpen) => !isOpen && handlePostSheetClose()}
        onUpdateStatus={() => {}} // This view is read-only for status
        onEdit={handleEdit}
      />
    </>
  );
}
