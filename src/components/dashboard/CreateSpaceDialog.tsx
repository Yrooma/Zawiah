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
import type { Space } from '@/lib/types';
import { users } from '@/lib/data';

interface CreateSpaceDialogProps {
  children: ReactNode;
  onSpaceCreated: (newSpace: Space) => void;
}

export function CreateSpaceDialog({ children, onSpaceCreated }: CreateSpaceDialogProps) {
  const [open, setOpen] = useState(false);
  const [spaceName, setSpaceName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleCreateSpace = async () => {
    if (spaceName.trim()) {
      setIsLoading(true);
      try {
        const newSpaceData = {
          name: spaceName,
          team: [users[0]], // Add current user as the owner
          // Firestore will initialize posts and ideas as empty arrays/subcollections
        };
        const newSpace = await addSpace(newSpaceData);
        
        onSpaceCreated(newSpace);

        toast({
          title: "Space created!",
          description: `Workspace "${spaceName}" has been created successfully.`,
        });

        setSpaceName("");
        setOpen(false);

      } catch (error) {
        console.error("Failed to create space:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not create the new workspace. Please try again."
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
          <DialogTitle className="font-headline">Create New Space</DialogTitle>
          <DialogDescription>
            Give your new collaboration space a name. You can invite team members later.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={spaceName}
              onChange={(e) => setSpaceName(e.target.value)}
              placeholder="e.g. 'Fashion Store Campaign'"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleCreateSpace} disabled={!spaceName.trim() || isLoading}>
            {isLoading ? 'Creating...' : 'Create Space'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
