
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
import { joinSpaceWithToken } from '@/lib/services';
import type { Space } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

interface JoinSpaceDialogProps {
  children: ReactNode;
  onSpaceJoined: (newSpace: Space) => void;
}

export function JoinSpaceDialog({ children, onSpaceJoined }: JoinSpaceDialogProps) {
  const [open, setOpen] = useState(false);
  const [inviteToken, setInviteToken] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user: authUser } = useAuth();

  const handleJoinSpace = async () => {
    if (inviteToken.trim() && authUser) {
      setIsLoading(true);
      try {
        const joinedSpace = await joinSpaceWithToken(authUser.uid, inviteToken.trim());
        
        if (joinedSpace) {
            onSpaceJoined(joinedSpace);

            toast({
            title: "تم الانضمام إلى المساحة بنجاح!",
            description: `أصبحت الآن عضوًا في "${joinedSpace.name}".`,
            });

            setInviteToken("");
            setOpen(false);
        }

      } catch (error: any) {
        console.error("Failed to join space:", error);
        toast({
          variant: "destructive",
          title: "خطأ",
          description: error.message || "تعذر الانضمام إلى مساحة العمل. يرجى التحقق من الرمز والمحاولة مرة أخرى."
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
          <DialogTitle className="font-headline">الانضمام إلى مساحة عمل</DialogTitle>
          <DialogDescription>
            أدخل رمز الدعوة الذي تلقيته للانضمام إلى مساحة عمل جديدة.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="token" className="text-right">
              الرمز
            </Label>
            <Input
              id="token"
              value={inviteToken}
              onChange={(e) => setInviteToken(e.target.value)}
              placeholder="مثال: 'FASH-ABC123'"
              className="col-span-3 font-mono"
              disabled={isLoading}
            />
          </div>
        </div>
        <DialogFooter>
           <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>إلغاء</Button>
          <Button type="submit" onClick={handleJoinSpace} disabled={!inviteToken.trim() || isLoading}>
            {isLoading && <Loader2 className="animate-spin" />}
            {isLoading ? 'جارٍ الانضمام...' : 'الانضمام إلى مساحة العمل'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
