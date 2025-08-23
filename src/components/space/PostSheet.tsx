"use client";

import type { Post, Platform, PostStatus } from "@/lib/types";
import Image from "next/image";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Instagram, Facebook, Copy, CheckCircle, Pencil } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { format } from "date-fns";

const PlatformDisplay = ({ platform }: { platform: Platform }) => {
    const platformDetails = {
        instagram: { name: 'Instagram', Icon: Instagram, color: 'bg-pink-500' },
        x: { 
            name: 'X (Twitter)', 
            Icon: () => (
                <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 fill-white">
                    <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z" />
                </svg>
            ),
            color: 'bg-black' 
        },
        facebook: { name: 'Facebook', Icon: Facebook, color: 'bg-blue-600' },
        linkedin: { name: 'LinkedIn', Icon: () => <span className="font-bold text-sm">in</span>, color: 'bg-sky-700' },
        threads: { name: 'Threads', Icon: () => <span className="font-bold text-xl">@</span>, color: 'bg-gray-800' },
    };
    const details = platformDetails[platform];

    return (
        <div className="flex items-center gap-2">
            <div className={`p-1.5 rounded-md ${details.color} flex items-center justify-center text-white`}>
                <details.Icon />
            </div>
            <span className="font-semibold">{details.name}</span>
        </div>
    )
}

interface PostSheetProps {
    post: Post | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onUpdateStatus: (postId: string, newStatus: PostStatus) => void;
    onEdit: (post: Post) => void;
}

export function PostSheet({ post, open, onOpenChange, onUpdateStatus, onEdit }: PostSheetProps) {
  const { toast } = useToast();

  if (!post) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(post.content);
    toast({ title: "Post content copied!" });
  };
  
  const handleMarkAsPublished = () => {
    onUpdateStatus(post.id, 'published');
    onOpenChange(false);
    toast({
        title: "Status Updated!",
        description: `"${post.title}" has been marked as published.`,
        variant: "default",
        className: "bg-accent text-accent-foreground"
      });
  }

  const statusMessages = {
    draft: 'Draft',
    ready: 'Ready to Publish',
    published: 'Published',
  };

  const statusClasses = {
    draft: 'bg-yellow-500 text-yellow-900',
    ready: 'bg-blue-500 text-white',
    published: 'bg-green-600 text-white',
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-lg p-0 flex flex-col" side="left">
        <SheetHeader className="p-6 pb-4">
          <div className="flex justify-between items-start">
            <SheetTitle className="font-headline text-2xl">{post.title}</SheetTitle>
            <Button variant="outline" size="icon" onClick={() => onEdit(post)}>
              <Pencil />
              <span className="sr-only">Edit Post</span>
            </Button>
          </div>
          <div className="flex justify-between items-center text-sm pt-2">
            <Badge className={statusClasses[post.status]}>{statusMessages[post.status]}</Badge>
            <div className="text-muted-foreground">{format(post.scheduledAt, 'PPP')}</div>
          </div>
        </SheetHeader>
        <div className="flex-grow overflow-y-auto p-6 pt-2 space-y-6">
            <div>
                <h3 className="font-semibold mb-2">Platform</h3>
                <div className="p-3 rounded-lg bg-secondary">
                    <PlatformDisplay platform={post.platform} />
                </div>
            </div>

            {post.imageUrl && (
                <div>
                    <h3 className="font-semibold mb-2">Media</h3>
                    <div className="relative aspect-video rounded-lg overflow-hidden border">
                        <Image src={post.imageUrl} alt={post.title} layout="fill" objectFit="cover" data-ai-hint="social media lifestyle" />
                    </div>
                </div>
            )}
            
            <div>
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">Content</h3>
                    <Button variant="outline" size="sm" onClick={handleCopy}>
                        Copy Text
                        <Copy />
                    </Button>
                </div>
                <div className="border rounded-lg p-4 bg-muted/30 text-sm whitespace-pre-wrap">
                    {post.content}
                </div>
            </div>

            <div>
                <h3 className="font-semibold mb-3">Activity Log</h3>
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
                            <span className="ml-auto text-xs text-muted-foreground">{log.date}</span>
                        </li>
                    ))}
                </ul>
            </div>

        </div>
        {post.status !== 'published' && (
             <SheetFooter className="p-6 bg-background border-t">
                <Button size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" onClick={handleMarkAsPublished}>
                    Update Status to: Published
                    <CheckCircle />
                </Button>
            </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
}
