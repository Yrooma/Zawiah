
"use client";

import { useState, type ReactNode, useEffect } from 'react';
import { Copy, Check, LogOut, Trash2, Loader2, RefreshCw } from 'lucide-react';
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
import { leaveSpace, deleteSpace, updateSpace, regenerateInviteToken } from '@/lib/services';
import { Textarea } from '../ui/textarea';


interface TeamDialogProps {
  children: ReactNode;
  space: Space;
  onSpaceUpdate: () => void;
}

export function TeamDialog({ children, space, onSpaceUpdate }: TeamDialogProps) {
  const [open, setOpen] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(space.name);
  const [editedDescription, setEditedDescription] = useState(space.description);
  const [isSaving, setIsSaving] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    if (open) {
      setEditedName(space.name);
      setEditedDescription(space.description);
      setIsEditing(false);
    }
  }, [open, space]);

  const copyToClipboard = () => {
    if (!space.inviteToken) return;
    navigator.clipboard.writeText(space.inviteToken);
    setHasCopied(true);
    toast({ title: "تم نسخ الرمز إلى الحافظة!" });
    setTimeout(() => setHasCopied(false), 2000);
  };
  
  const handleRegenerateToken = async () => {
    setIsRegenerating(true);
    try {
        await regenerateInviteToken(space.id);
        onSpaceUpdate();
        toast({ title: "تم إنشاء رمز دعوة جديد!" });
    } catch (error: any) {
        toast({ variant: 'destructive', title: "خطأ", description: "فشل إنشاء رمز جديد."});
    } finally {
        setIsRegenerating(false);
    }
  }

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
  
  const handleSaveChanges = async () => {
    if (!editedName.trim()) {
        toast({ variant: 'destructive', title: "الاسم مطلوب" });
        return;
    }
    setIsSaving(true);
    try {
        await updateSpace(space.id, editedName, editedDescription);
        toast({ title: "تم تحديث المساحة بنجاح!"});
        onSpaceUpdate();
        setIsEditing(false);
    } catch(error: any) {
        toast({ variant: 'destructive', title: "خطأ في تحديث المساحة", description: error.message });
    } finally {
        setIsSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-headline">إدارة الفريق</DialogTitle>
          <DialogDescription>
            {isCurrentUserOwner ? "عدّل تفاصيل المساحة، ادعُ الآخرين، أو قم بإدارة عضويتك." : "ادعُ الآخرين أو قم بإدارة عضويتك في هذه المساحة."}
          </DialogDescription>
        </DialogHeader>

        {isCurrentUserOwner && (
            <>
                <div className="py-2">
                    <Label className='font-medium'>تفاصيل المساحة</Label>
                    {!isEditing ? (
                        <div className="p-2 mt-2">
                             <p className="font-semibold">{space.name}</p>
                             <p className="text-sm text-muted-foreground">{space.description}</p>
                             <Button variant="outline" size="sm" className='mt-2' onClick={() => setIsEditing(true)}>تعديل</Button>
                        </div>
                    ) : (
                        <div className='space-y-3 mt-2'>
                           <div>
                             <Label htmlFor='spaceName' className='text-xs'>اسم المساحة</Label>
                             <Input id="spaceName" value={editedName} onChange={(e) => setEditedName(e.target.value)} disabled={isSaving} />
                           </div>
                           <div>
                             <Label htmlFor='spaceDesc' className='text-xs'>وصف المساحة</Label>
                             <Textarea id="spaceDesc" value={editedDescription} onChange={(e) => setEditedDescription(e.target.value)} className='min-h-[60px]' disabled={isSaving}/>
                           </div>
                           <div className='flex gap-2 justify-end'>
                             <Button variant="ghost" onClick={() => setIsEditing(false)} disabled={isSaving}>إلغاء</Button>
                             <Button onClick={handleSaveChanges} disabled={isSaving}>
                                {isSaving && <Loader2 className="animate-spin" />}
                                حفظ التغييرات
                             </Button>
                           </div>
                        </div>
                    )}
                </div>
                <Separator />
            </>
        )}
        
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
            <p className='text-xs text-muted-foreground'>يتم تجديد هذا الرمز تلقائيًا بعد كل استخدام.</p>
            <div className="flex items-center space-x-2 space-x-reverse">
                <Input id="link" value={space.inviteToken || "مساحة العمل ممتلئة"} readOnly className="font-mono text-center tracking-widest" />
                 <Button size="icon" onClick={handleRegenerateToken} disabled={!space.inviteToken || isRegenerating}>
                    {isRegenerating ? <Loader2 className='animate-spin' /> : <RefreshCw />}
                </Button>
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
