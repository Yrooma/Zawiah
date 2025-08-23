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
import { useToast } from '@/hooks/use-toast';
import { Separator } from '../ui/separator';
import type { User } from '@/lib/types';

interface TeamDialogProps {
  children: ReactNode;
  team: User[];
  inviteToken: string;
}

export function TeamDialog({ children, team, inviteToken }: TeamDialogProps) {
  const [hasCopied, setHasCopied] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = () => {
    if (!inviteToken) return;
    navigator.clipboard.writeText(inviteToken);
    setHasCopied(true);
    toast({ title: "Copied token to clipboard!" });
    setTimeout(() => setHasCopied(false), 2000);
  };

  const isOwner = (user: User) => {
      return team.length > 0 && user.id === team[0].id;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline">Manage Team</DialogTitle>
          <DialogDescription>
            Invite up to 2 other members to this space.
          </DialogDescription>
        </DialogHeader>
        <div className="py-2">
            <h3 className="text-sm font-medium mb-3">Current Members ({team.length}/3)</h3>
            <div className="space-y-3">
            {team.map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Avatar>
                    <AvatarImage src={user.avatarUrl} />
                    <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{isOwner(user) ? 'Owner' : 'Member'}</p>
                    </div>
                </div>
                {!isOwner(user) && (
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">Remove</Button>
                )}
                </div>
            ))}
            </div>
        </div>
        <Separator />
        <div className="space-y-2 pt-2">
          <Label htmlFor="link" className="font-medium">Invite with token</Label>
          <div className="flex items-center space-x-2">
            <Input id="link" value={inviteToken} readOnly className="font-mono text-center tracking-widest" />
            <Button size="icon" onClick={copyToClipboard} disabled={!inviteToken}>
              {hasCopied ? <Check /> : <Copy />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
