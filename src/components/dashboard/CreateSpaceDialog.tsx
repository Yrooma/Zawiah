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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { addSpace } from '@/lib/services';
import type { Space, User } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

interface CreateSpaceDialogProps {
  children: ReactNode;
  onSpaceCreated: (newSpace: Space) => void;
}

export function CreateSpaceDialog({ children, onSpaceCreated }: CreateSpaceDialogProps) {
  const [open, setOpen] = useState(false);
  const [spaceName, setSpaceName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user: authUser } = useAuth();

  const handleCreateSpace = async () => {
    if (spaceName.trim() && authUser) {
      setIsLoading(true);
      try {
        const owner: User = {
          id: authUser.uid,
          name: authUser.name,
          avatarUrl: authUser.avatarUrl,
        };
        const newSpaceData = {
          name: spaceName,
          team: [owner],
          memberIds: [owner.id],
        };
        const newSpace = await addSpace(newSpaceData);
        
        onSpaceCreated(newSpace);

        toast({
          title: "تم إنشاء المساحة!",
          description: `تم إنشاء مساحة العمل "${spaceName}" بنجاح.`,
        });

        setSpaceName("");
        setOpen(false);

      } catch (error) {
        console.error("Failed to create space:", error);
        toast({
          variant: "destructive",
          title: "خطأ",
          description: "تعذر إنشاء مساحة العمل الجديدة. يرجى المحاولة مرة أخرى."
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
          <DialogTitle className="font-headline">إنشاء مساحة جديدة</DialogTitle>
          <DialogDescription>
            أعط مساحة التعاون الجديدة اسمًا. يمكنك دعوة أعضاء الفريق لاحقًا.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              الاسم
            </Label>
            <Input
              id="name"
              value={spaceName}
              onChange={(e) => setSpaceName(e.target.value)}
              placeholder="مثال: 'حملة متجر الأزياء'"
              className="col-span-3"
              disabled={isLoading}
            />
          </div>
        </div>
        <DialogFooter>
           <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>إلغاء</Button>
          <Button type="submit" onClick={handleCreateSpace} disabled={!spaceName.trim() || isLoading}>
            {isLoading && <Loader2 className="animate-spin" />}
            {isLoading ? 'جارٍ الإنشاء...' : 'إنشاء مساحة'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
