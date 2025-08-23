
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

interface CreateIdeaDialogProps {
  children: ReactNode;
  onAddIdea: (content: string) => void;
}

export function CreateIdeaDialog({ children, onAddIdea }: CreateIdeaDialogProps) {
  const [open, setOpen] = useState(false);
  const [ideaContent, setIdeaContent] = useState("");
  const { toast } = useToast();

  const handleCreateIdea = () => {
    if (ideaContent.trim()) {
      onAddIdea(ideaContent);
      toast({
        title: "تمت إضافة الفكرة!",
        description: `تمت إضافة فكرتك بنجاح.`,
      });
      setIdeaContent("");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">أضف فكرة جديدة</DialogTitle>
          <DialogDescription>
            اكتب فكرة المحتوى الخاصة بك. يمكن للفريق مشاهدتها والبناء عليها.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="idea-content">فكرتك</Label>
            <Textarea
              id="idea-content"
              value={ideaContent}
              onChange={(e) => setIdeaContent(e.target.value)}
              placeholder="مثال: 'إطلاق مسابقة على انستغرام الأسبوع القادم...'"
              className="min-h-[100px]"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleCreateIdea} disabled={!ideaContent.trim()}>
            أضف الفكرة
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
