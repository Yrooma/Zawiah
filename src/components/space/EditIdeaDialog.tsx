
"use client";

import { useState, useEffect, type ReactNode } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';
import type { Idea } from '@/lib/types';

interface EditIdeaDialogProps {
  idea: Idea | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateIdea: (ideaId: string, content: string) => Promise<void>;
}

export function EditIdeaDialog({ idea, open, onOpenChange, onUpdateIdea }: EditIdeaDialogProps) {
  const [ideaContent, setIdeaContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (idea) {
      setIdeaContent(idea.content);
    }
  }, [idea]);

  const handleUpdate = async () => {
    if (idea && ideaContent.trim()) {
      setIsLoading(true);
      try {
        await onUpdateIdea(idea.id, ideaContent);
        toast({
          title: "Idea updated!",
          description: `Your idea has been successfully updated.`,
        });
        onOpenChange(false);
      } catch (error) {
        console.error("Failed to update idea:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not update the idea. Please try again."
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Edit Idea</DialogTitle>
          <DialogDescription>
            Make changes to your idea below.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="idea-content">Idea Content</Label>
            <Textarea
              id="idea-content"
              value={ideaContent}
              onChange={(e) => setIdeaContent(e.target.value)}
              placeholder="e.g. 'Run an Instagram contest next week...'"
              className="min-h-[100px]"
              disabled={isLoading}
            />
          </div>
        </div>
        <DialogFooter>
           <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>Cancel</Button>
          <Button type="submit" onClick={handleUpdate} disabled={!ideaContent.trim() || isLoading}>
            {isLoading && <Loader2 className="animate-spin" />}
            {isLoading ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
