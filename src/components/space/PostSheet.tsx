"use client";

import type { Post, Platform } from "@/lib/types";
import Image from "next/image";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Instagram, Facebook, Copy, CheckCircle } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { format } from "date-fns";
import { arSA } from "date-fns/locale";

const PlatformDisplay = ({ platform }: { platform: Platform }) => {
    const platformDetails = {
        instagram: { name: 'انستغرام', Icon: Instagram, color: 'bg-pink-500' },
        x: { 
            name: 'X (تويتر)', 
            Icon: () => (
                <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 fill-white">
                    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                </svg>
            ),
            color: 'bg-black' 
        },
        facebook: { name: 'فيسبوك', Icon: Facebook, color: 'bg-blue-600' },
        linkedin: { name: 'لينكد إن', Icon: () => <span>in</span>, color: 'bg-sky-700' },
        threads: { name: 'ثريدز', Icon: () => <span>@</span>, color: 'bg-gray-800' },
    };
    const details = platformDetails[platform];

    return (
        <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-full ${details.color}`}>
                <details.Icon />
            </div>
            <span className="font-semibold text-white">{details.name}</span>
        </div>
    )
}

interface PostSheetProps {
    post: Post | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function PostSheet({ post, open, onOpenChange }: PostSheetProps) {
  const { toast } = useToast();

  if (!post) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(post.content);
    toast({ title: "تم نسخ محتوى المنشور!" });
  };
  
  const handleMarkAsPublished = () => {
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
    published: 'bg-gray-500 text-white',
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col">
        <SheetHeader className="p-6 pb-0">
          <SheetTitle className="font-headline text-2xl ps-8">{post.title}</SheetTitle>
          <div className="flex justify-between items-center text-sm pt-2">
            <Badge className={statusClasses[post.status]}>{statusMessages[post.status]}</Badge>
            <div className="text-muted-foreground">{format(post.scheduledAt, 'PPPP', { locale: arSA })}</div>
          </div>
        </SheetHeader>
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
            <div>
                <h3 className="font-semibold mb-2">المنصة</h3>
                <div className="bg-primary/80 text-primary-foreground p-3 rounded-lg">
                    <PlatformDisplay platform={post.platform} />
                </div>
            </div>

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
                        <Copy className="ms-2 h-4 w-4"/>
                        نسخ النص
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
                                <AvatarImage src={log.user.avatarUrl} />
                                <AvatarFallback>{log.user.name.slice(0, 2)}</AvatarFallback>
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
        <SheetFooter className="p-6 bg-background border-t">
          <Button size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleMarkAsPublished}>
            <CheckCircle className="ms-2 h-5 w-5"/>
            تحديث الحالة إلى: تم النشر
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
