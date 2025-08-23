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

interface CreateSpaceDialogProps {
  children: ReactNode;
}

export function CreateSpaceDialog({ children }: CreateSpaceDialogProps) {
  const [open, setOpen] = useState(false);
  const [spaceName, setSpaceName] = useState("");
  const { toast } = useToast();

  const handleCreateSpace = () => {
    if (spaceName.trim()) {
      toast({
        title: "Space Created!",
        description: `The space "${spaceName}" has been successfully created.`,
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
              placeholder="e.g., 'Fashion Store Campaign'"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleCreateSpace} disabled={!spaceName.trim()}>
            Create Space
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
