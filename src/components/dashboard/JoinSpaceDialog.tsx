
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
            title: "Successfully joined space!",
            description: `You are now a member of "${joinedSpace.name}".`,
            });

            setInviteToken("");
            setOpen(false);
        }

      } catch (error: any) {
        console.error("Failed to join space:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Could not join the workspace. Please check the token and try again."
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
          <DialogTitle className="font-headline">Join a Workspace</DialogTitle>
          <DialogDescription>
            Enter the invite token you received to join a new workspace.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="token" className="text-right">
              Token
            </Label>
            <Input
              id="token"
              value={inviteToken}
              onChange={(e) => setInviteToken(e.target.value)}
              placeholder="e.g. 'FASH-ABC123'"
              className="col-span-3 font-mono"
              disabled={isLoading}
            />
          </div>
        </div>
        <DialogFooter>
           <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>Cancel</Button>
          <Button type="submit" onClick={handleJoinSpace} disabled={!inviteToken.trim() || isLoading}>
            {isLoading && <Loader2 className="animate-spin" />}
            {isLoading ? 'Joining...' : 'Join Workspace'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
