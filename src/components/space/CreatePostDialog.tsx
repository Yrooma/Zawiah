"use client";

import { useState, type ReactNode, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from "@/hooks/use-toast";
import type { Platform, Post } from '@/lib/types';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSavePost: (postDetails: { title: string; content: string; platform: Platform; scheduledAt: Date }, id?: string) => Promise<void>;
  initialContent?: string;
  postToEdit?: Post;
  children?: ReactNode;
}

export function CreatePostDialog({ open, onOpenChange, onSavePost, initialContent, postToEdit, children }: CreatePostDialogProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [platform, setPlatform] = useState<Platform | undefined>(undefined);
  const [scheduledAt, setScheduledAt] = useState<Date | undefined>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  
  const isEditing = !!postToEdit;
  
  const resetForm = () => {
      setTitle("");
      setContent("");
      setPlatform(undefined);
      setScheduledAt(new Date());
  }

  useEffect(() => {
    if (open) {
      if (postToEdit) {
        setTitle(postToEdit.title);
        setContent(postToEdit.content);
        setPlatform(postToEdit.platform);
        setScheduledAt(postToEdit.scheduledAt as Date);
      } else if (initialContent) {
        setContent(initialContent);
        setTitle("");
        setPlatform(undefined);
        setScheduledAt(new Date());
      } else {
        resetForm();
      }
    }
  }, [postToEdit, initialContent, open]);

  const handleSave = async () => {
    if (!title.trim() || !content.trim() || !platform || !scheduledAt) {
        toast({
            variant: "destructive",
            title: "Fields Required",
            description: "Please fill out all fields to save the post.",
        });
        return;
    }
    
    if (!user) {
        toast({ variant: "destructive", title: "Authentication Error", description: "You must be logged in to save a post." });
        return;
    }

    setIsLoading(true);
    try {
      await onSavePost({ title, content, platform, scheduledAt }, postToEdit?.id);

      toast({
        title: isEditing ? "Post updated!" : "Post created!",
        description: isEditing ? "Your changes to the post have been saved." : "Your draft post has been added to the calendar.",
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not save the post. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
        resetForm();
    }
    onOpenChange(isOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {children}
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="font-headline">{isEditing ? 'Edit Post' : 'Create New Post'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Edit the post details below.' : 'Fill in the details below to create a new draft post.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 'Spring Collection Launch'"
              className="col-span-3"
              disabled={isLoading}
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="content" className="text-right pt-2">
              Content
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your post content here..."
              className="col-span-3 min-h-[120px]"
              disabled={isLoading}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="platform" className="text-right">
              Platform
            </Label>
            <Select value={platform} onValueChange={(value: Platform) => setPlatform(value)} disabled={isLoading}>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a platform" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="instagram">Instagram</SelectItem>
                    <SelectItem value="x">X (Twitter)</SelectItem>
                    <SelectItem value="facebook">Facebook</SelectItem>
                    <SelectItem value="linkedin">LinkedIn</SelectItem>
                    <SelectItem value="threads">Threads</SelectItem>
                </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
             <Label htmlFor="date" className="text-right">
              Publish Date
            </Label>
             <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "col-span-3 justify-start text-left font-normal",
                    !scheduledAt && "text-muted-foreground"
                  )}
                  disabled={isLoading}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {scheduledAt ? format(scheduledAt, 'PPP') : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={scheduledAt}
                  onSelect={setScheduledAt}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>Cancel</Button>
          <Button type="submit" onClick={handleSave} disabled={isLoading}>
             {isLoading && <Loader2 className="animate-spin" />}
            {isLoading ? 'Saving...' : (isEditing ? 'Save Changes' : 'Create Draft Post')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
