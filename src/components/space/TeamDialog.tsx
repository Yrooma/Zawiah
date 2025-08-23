
"use client";

import { useState, type ReactNode } from 'react';
import { Copy, Check, LogOut, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '../ui/separator';
import type { Space } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { leaveSpace, deleteSpace } from '@/lib/services';


interface TeamDialogProps {
  children: ReactNode;
  space: Space;
  onSpaceUpdate: () => void;
}

export function TeamDialog({ children, space, onSpaceUpdate }: TeamDialogProps) {
  const [open, setOpen] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();

  const copyToClipboard = () => {
    if (!space.inviteToken) return;
    navigator.clipboard.writeText(space.inviteToken);
    setHasCopied(true);
    toast({ title: "تم نسخ الرمز إلى الحافظة!" });
    setTimeout(() => setHasCopied(false), 2000);
  };

  const isCurrentUserOwner = user?.uid === space.team[0]?.id;

  const handleLeaveSpace = async () => {
    if (!user) return;
    try {
        await leaveSpace(space.id, user.uid);
        toast({ title: `لقد غادرت ${space.name}.`});
        router.push('/dashboard');
    } catch (error: any) {
        toast({ variant: 'destructive', title: "خطأ في مغادرة المساحة", description: error.message });
    }
  }

  const handleDeleteSpace = async () => {
      try {
          await deleteSpace(space.id);
          toast({ title: `تم حذف ${space.name}.`});
          router.push('/dashboard');
      } catch (error: any) {
          toast({ variant: 'destructive', title: "خطأ في حذف المساحة", description: error.message });
      }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-headline">إدارة الفريق</DialogTitle>
          <DialogDescription>
            ادعُ الآخرين أو قم بإدارة عضويتك في هذه المساحة.
          </DialogDescription>
        </DialogHeader>
        <div className="py-2">
            <h3 className="text-sm font-medium mb-3">الأعضاء الحاليون ({space.team.length}/3)</h3>
            <div className="space-y-3">
            {space.team.map((member) => (
                <div key={member.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar>
                        <AvatarImage src={member.avatarUrl} />
                        <AvatarFallback>{member.name.slice(0, 2)}</AvatarFallback>
                        </Avatar>
                        <div>
                        <p className="font-semibold">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{space.team[0].id === member.id ? 'المالك' : 'عضو'}</p>
                        </div>
                    </div>
                </div>
            ))}
            </div>
        </div>
        
        <Separator />

        {isCurrentUserOwner && space.team.length < 3 && (
            <div className="space-y-2 pt-2">
            <Label htmlFor="link" className="font-medium">الدعوة باستخدام الرمز</Label>
            <p className='text-xs text-muted-foreground'>سيتم تجديد هذا الرمز بعد كل استخدام.</p>
            <div className="flex items-center space-x-2">
                <Input id="link" value={space.inviteToken || "مساحة العمل ممتلئة"} readOnly className="font-mono text-center tracking-widest" />
                <Button size="icon" onClick={copyToClipboard} disabled={!space.inviteToken}>
                {hasCopied ? <Check /> : <Copy />}
                </Button>
            </div>
            </div>
        )}

        <DialogFooter className="sm:flex-col sm:items-stretch sm:gap-2 pt-4">
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="outline" className='text-destructive hover:text-destructive'>
                        {isCurrentUserOwner ? <Trash2/> : <LogOut/>}
                        {isCurrentUserOwner ? 'حذف مساحة العمل' : 'مغادرة مساحة العمل'}
                    </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>هل أنت متأكد تمامًا؟</AlertDialogTitle>
                        <AlertDialogDescription>
                            {isCurrentUserOwner 
                                ? "لا يمكن التراجع عن هذا الإجراء. سيؤدي هذا إلى حذف مساحة العمل وجميع بياناتها بشكل دائم."
                                : "ستتم إزالتك من مساحة العمل هذه وستحتاج إلى دعوة جديدة لإعادة الانضمام."
                            }
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>إلغاء</AlertDialogCancel>
                        <AlertDialogAction onClick={isCurrentUserOwner ? handleDeleteSpace : handleLeaveSpace}>
                            متابعة
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
            <DialogClose asChild>
                <Button variant="outline">إغلاق</Button>
            </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

    