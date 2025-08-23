"use client";

import { useState, type ReactNode } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { teamMembers, teamInviteToken, users } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '../ui/separator';

interface TeamDialogProps {
  children: ReactNode;
}

export function TeamDialog({ children }: TeamDialogProps) {
  const [hasCopied, setHasCopied] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(teamInviteToken);
    setHasCopied(true);
    toast({ title: "تم النسخ إلى الحافظة!" });
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline">إدارة الفريق</DialogTitle>
          <DialogDescription>
            ادعُ ما يصل إلى عضوين آخرين إلى هذه المساحة.
          </DialogDescription>
        </DialogHeader>
        <div className="py-2">
            <h3 className="text-sm font-medium mb-3">الأعضاء الحاليون</h3>
            <div className="space-y-3">
            {teamMembers.map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Avatar>
                    <AvatarImage src={user.avatarUrl} />
                    <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.id === users[0].id ? 'المالك' : 'عضو'}</p>
                    </div>
                </div>
                {user.id !== users[0].id && (
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">إزالة</Button>
                )}
                </div>
            ))}
            </div>
        </div>
        <Separator />
        <div className="space-y-2 pt-2">
          <Label htmlFor="link" className="font-medium">الدعوة باستخدام الرمز</Label>
          <div className="flex items-center space-x-2 space-x-reverse">
            <Input id="link" value={teamInviteToken} readOnly className="font-mono" />
            <Button size="icon" onClick={copyToClipboard}>
              {hasCopied ? <Check /> : <Copy />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
