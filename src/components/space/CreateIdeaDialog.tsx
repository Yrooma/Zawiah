"use client";

import { useState, type ReactNode } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';

interface CreateIdeaDialogProps {
  children: ReactNode;
  onAddIdea: (content: string) => Promise<void>;
}

export function CreateIdeaDialog({ children, onAddIdea }: CreateIdeaDialogProps) {
  const [open, setOpen] = useState(false);
  const [ideaContent, setIdeaContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCreateIdea = async () => {
    if (ideaContent.trim()) {
      setIsLoading(true);
      try {
        await onAddIdea(ideaContent);
        toast({
          title: "Idea added!",
          description: `Your idea has been successfully added.`,
        });
        setIdeaContent("");
        setOpen(false);
      } catch (error) {
        console.error("Failed to add idea:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not add the new idea. Please try again."
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Add New Idea</DialogTitle>
          <DialogDescription>
            Write down your content idea. The team can see and build upon it.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="idea-content">Your Idea</Label>
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
           <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>Cancel</Button>
          <Button type="submit" onClick={handleCreateIdea} disabled={!ideaContent.trim() || isLoading}>
            {isLoading && <Loader2 className="animate-spin" />}
            {isLoading ? 'Adding...' : 'Add Idea'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
