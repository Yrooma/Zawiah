
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
import { useAuth } from '@/hooks/use-auth';

interface CreateIdeaDialogProps {
  onAddIdea: (content: string) => Promise<void>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}

export function CreateIdeaDialog({ children, onAddIdea, open: controlledOpen, onOpenChange: controlledOnOpenChange }: CreateIdeaDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [ideaContent, setIdeaContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange !== undefined ? controlledOnOpenChange : setInternalOpen;


  const handleCreateIdea = async () => {
    if (ideaContent.trim() && user) {
      setIsLoading(true);
      try {
        await onAddIdea(ideaContent);
        toast({
          title: "تمت إضافة الفكرة!",
          description: `تمت إضافة فكرتك بنجاح.`,
        });
        setIdeaContent("");
        setOpen(false);
      } catch (error) {
        console.error("Failed to add idea:", error);
        toast({
          variant: "destructive",
          title: "خطأ",
          description: "تعذرت إضافة الفكرة الجديدة. يرجى المحاولة مرة أخرى."
        });
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const DialogTriggerComponent = children ? <DialogTrigger asChild>{children}</DialogTrigger> : null;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {DialogTriggerComponent}
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-headline text-start">إضافة فكرة جديدة</DialogTitle>
          <DialogDescription className="text-start">
            اكتب فكرة المحتوى الخاصة بك. يمكن للفريق رؤيتها والبناء عليها.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="idea-content">فكرتك</Label>
            <Textarea
              id="idea-content"
              value={ideaContent}
              onChange={(e) => setIdeaContent(e.target.value)}
              placeholder="مثال: 'إجراء مسابقة على انستغرام الأسبوع المقبل...'"
              className="min-h-[100px]"
              disabled={isLoading}
            />
          </div>
        </div>
        <DialogFooter>
           <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>إلغاء</Button>
          <Button type="submit" onClick={handleCreateIdea} disabled={!ideaContent.trim() || isLoading}>
            {isLoading && <Loader2 className="animate-spin" />}
            {isLoading ? 'جارٍ الإضافة...' : 'إضافة فكرة'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
