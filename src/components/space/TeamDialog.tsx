"use client";

import { useState, type ReactNode } from 'react';
import { Copy, Check, UserPlus } from 'lucide-react';
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
import { users } from '@/lib/mock-data';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '../ui/separator';

interface TeamDialogProps {
  children: ReactNode;
}

const MOCK_TEAM = [users[0], users[1]];
const MOCK_TOKEN = 'a1b2c3d4e5';

export function TeamDialog({ children }: TeamDialogProps) {
  const [hasCopied, setHasCopied] = useState(false);
  const { toast } = useToast();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(MOCK_TOKEN);
    setHasCopied(true);
    toast({ title: "Copied to clipboard!" });
    setTimeout(() => setHasCopied(false), 2000);
  };

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
            <h3 className="text-sm font-medium mb-3">Current Members</h3>
            <div className="space-y-3">
            {MOCK_TEAM.map((user) => (
                <div key={user.id} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <Avatar>
                    <AvatarImage src={user.avatarUrl} />
                    <AvatarFallback>{user.name.slice(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                    <p className="font-semibold">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.id === users[0].id ? 'Owner' : 'Member'}</p>
                    </div>
                </div>
                {user.id !== users[0].id && (
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
            <Input id="link" value={MOCK_TOKEN} readOnly className="font-mono" />
            <Button size="icon" onClick={copyToClipboard}>
              {hasCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
