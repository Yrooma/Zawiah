
"use client";

import type { Post, Platform, PostStatus } from "@/lib/types";
import Image from "next/image";
import Link from "next/link";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Instagram, Facebook, Copy, CheckCircle, Pencil, Mail, MessageSquare, ExternalLink } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { format } from "date-fns";
import { ar } from 'date-fns/locale';
import { platformPostTypes } from "@/lib/data";
import { PlatformIcon } from "./PlatformIcon";

interface PostSheetProps {
    post: Post | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUpdateStatus: (postId: string, newStatus: PostStatus, spaceId: string) => void;
    onEdit: (post: Post) => void;
}

export function PostSheet({ post, open, onOpenChange, onUpdateStatus, onEdit }: PostSheetProps) {
  const { toast } = useToast();

  if (!post) return null;

  const postTypeDetails = post.platform && post.postType 
    ? platformPostTypes[post.platform]?.find(pt => pt.id === post.postType) 
    : null;

  const handleCopy = () => {
    navigator.clipboard.writeText(post.content);
    toast({ title: "تم نسخ محتوى المنشور!" });
  };
  
  const handleMarkAsPublished = () => {
    if (!post.spaceId) return;
    onUpdateStatus(post.id, 'published', post.spaceId);
    onOpenChange(false);
    toast({
        title: "تم تحديث الحالة!",
        description: `تم تحديد "${post.title}" كمنشور تم نشره.`,
        variant: "default",
        className: "bg-accent text-accent-foreground"
      });
  }

  const statusMessages = {
    draft: 'مسودة',
    ready: 'جاهز للنشر',
    published: 'تم النشر',
  };

  const statusClasses = {
    draft: 'bg-yellow-500 text-yellow-900',
    ready: 'bg-blue-500 text-white',
    published: 'bg-green-600 text-white',
  };

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="w-full sm:max-w-lg p-0 flex flex-col">
        <ResponsiveDialogHeader className="p-6 pb-4 text-start">
          <div className="flex justify-between items-start">
            <ResponsiveDialogTitle className="font-headline text-2xl">{post.title}</ResponsiveDialogTitle>
            <Button variant="outline" size="icon" onClick={() => onEdit(post)}>
              <Pencil />
              <span className="sr-only">تعديل المنشور</span>
            </Button>
          </div>
          <div className="flex justify-between items-center text-sm pt-2">
            <Badge className={statusClasses[post.status]}>{statusMessages[post.status]}</Badge>
            <div className="text-muted-foreground">{format(post.scheduledAt as Date, 'PPP', { locale: ar })}</div>
          </div>
        </ResponsiveDialogHeader>
        <div className="flex-grow overflow-y-auto p-6 pt-2 space-y-6 text-start">
            { post.spaceName && (
              <div>
                <h3 className="font-semibold mb-2">مساحة العمل</h3>
                <div className="p-3 rounded-lg bg-secondary flex justify-between items-center">
                    <span>{post.spaceName}</span>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/spaces/${post.spaceId}`}>
                        افتح
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    </Button>
                </div>
              </div>
            )}
            <div>
                <h3 className="font-semibold mb-2">المنصة</h3>
                <div className="p-3 rounded-lg bg-secondary flex items-center gap-2">
                    <PlatformIcon platform={post.platform} className="h-5 w-5" />
                    <span className="font-semibold capitalize">{post.platform}</span>
                </div>
            </div>

            {postTypeDetails && (
              <div>
                <h3 className="font-semibold mb-2">نوع المنشور</h3>
                <div className="p-3 rounded-lg bg-secondary">
                    <p className="font-semibold">{postTypeDetails.name}</p>
                    {post.fields && Object.keys(post.fields).length > 0 && (
                      <div className="mt-2 pt-2 border-t border-muted/50 space-y-1">
                        {Object.entries(post.fields).map(([fieldId, value]) => {
                          const fieldDef = postTypeDetails.fields.find(f => f.id === fieldId);
                          return (
                            <div key={fieldId} className="text-sm">
                              <span className="font-medium text-muted-foreground">{fieldDef?.name || fieldId}: </span>
                              <span>{value}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                </div>
              </div>
            )}

            {post.pillar && (
              <div>
                <h3 className="font-semibold mb-2">محور المحتوى</h3>
                <div className="p-3 rounded-lg bg-secondary flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full" style={{ backgroundColor: post.pillar.color }} />
                    <span className="font-semibold">{post.pillar.name}</span>
                </div>
              </div>
            )}

            {post.imageUrl && (
                <div>
                    <h3 className="font-semibold mb-2">الوسائط</h3>
                    <div className="relative aspect-video rounded-lg overflow-hidden border">
                        <Image src={post.imageUrl} alt={post.title} layout="fill" objectFit="cover" data-ai-hint="social media lifestyle" />
                    </div>
                </div>
            )}
            
            <div>
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">المحتوى</h3>
                    <Button variant="outline" size="sm" onClick={handleCopy}>
                        نسخ النص
                        <Copy />
                    </Button>
                </div>
                <div className="border rounded-lg p-4 bg-muted/30 text-sm whitespace-pre-wrap">
                    {post.content}
                </div>
            </div>

            <div>
                <h3 className="font-semibold mb-3">سجل النشاط</h3>
                <ul className="space-y-3 text-sm">
                    {post.activityLog.map((log, index) => (
                        <li key={index} className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                                {log.user.avatarUrl && <AvatarImage src={log.user.avatarUrl} />}
                                <AvatarFallback style={{backgroundColor: log.user.avatarColor}}>{log.user.avatarText}</AvatarFallback>
                            </Avatar>
                            <div>
                                <span className="font-medium">{log.user.name}</span>
                                <span className="text-muted-foreground"> {log.action.toLowerCase()}</span>
                            </div>
                            <span className="me-auto text-xs text-muted-foreground">{log.date}</span>
                        </li>
                    ))}
                </ul>
            </div>

        </div>
        {post.status !== 'published' && (
             <div className="p-6 bg-background border-t">
                <Button size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleMarkAsPublished}>
                    تحديث الحالة إلى: تم النشر
                    <CheckCircle />
                </Button>
            </div>
        )}
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
