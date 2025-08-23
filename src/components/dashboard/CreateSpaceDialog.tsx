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
import { spaces, users } from '@/lib/data';

interface CreateSpaceDialogProps {
  children: ReactNode;
}

export function CreateSpaceDialog({ children }: CreateSpaceDialogProps) {
  const [open, setOpen] = useState(false);
  const [spaceName, setSpaceName] = useState("");
  const { toast } = useToast();

  const handleCreateSpace = () => {
    if (spaceName.trim()) {
      const newSpace = {
        id: `space-${Date.now()}`,
        name: spaceName,
        team: [users[0]], // Add current user as the owner
        posts: [],
        ideas: [],
        inviteToken: `${spaceName.slice(0,4).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
      };
      spaces.push(newSpace);

      toast({
        title: "تم إنشاء المساحة!",
        description: `تم إنشاء مساحة العمل "${spaceName}" بنجاح.`,
      });
      setSpaceName("");
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="font-headline">إنشاء مساحة جديدة</DialogTitle>
          <DialogDescription>
            أعطِ مساحة التعاون الجديدة اسمًا. يمكنك دعوة أعضاء الفريق لاحقًا.
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
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleCreateSpace} disabled={!spaceName.trim()}>
            إنشاء مساحة
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
