
"use client";

import { useState, type ReactNode, useEffect } from 'react';
import { LogOut, Trash2, Loader2, Send } from 'lucide-react';
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
import type { Space, User } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { leaveSpace, deleteSpace, updateSpace, createInvite } from '@/lib/services';
import { Textarea } from '../ui/textarea';


interface TeamDialogProps {
  children: ReactNode;
  space: Space;
  onSpaceUpdate: () => void;
}

export function TeamDialog({ children, space: initialSpace, onSpaceUpdate }: TeamDialogProps) {
  const [open, setOpen] = useState(false);
  const [space, setSpace] = useState(initialSpace);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(initialSpace.name);
  const [editedDescription, setEditedDescription] = useState(initialSpace.description);
  const [isSaving, setIsSaving] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [isInviting, setIsInviting] = useState(false);

  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();
  
  useEffect(() => {
    setSpace(initialSpace);
  }, [initialSpace]);
  
  useEffect(() => {
    if (open) {
      setEditedName(space.name);
      setEditedDescription(space.description);
      setIsEditing(false);
      setInviteEmail("");
    }
  }, [open, space]);

  const isCurrentUserOwner = user?.uid === space.team[0]?.id;
  const isTeamFull = space.team.length >= 3;

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
        setSpace(prev => ({...prev, name: editedName, description: editedDescription }));
        onSpaceUpdate(); // Refresh parent state
        toast({ title: "تم تحديث المساحة بنجاح!"});
        setIsEditing(false);
    } catch(error: any) {
        toast({ variant: 'destructive', title: "خطأ في تحديث المساحة", description: error.message });
    } finally {
        setIsSaving(false);
    }
  }
  
  const handleInviteUser = async () => {
    if (!inviteEmail.trim() || !user) return;
    
    // Simple email validation
    if (!/^\S+@\S+\.\S+$/.test(inviteEmail)) {
        toast({ variant: 'destructive', title: "بريد إلكتروني غير صالح", description: "الرجاء إدخال عنوان بريد إلكتروني صالح." });
        return;
    }

    if (inviteEmail === user.email) {
      toast({ variant: 'destructive', title: "لا يمكنك دعوة نفسك." });
      return;
    }

    setIsInviting(true);
    try {
        const currentUser: User = { id: user.uid, name: user.name, avatarUrl: user.avatarUrl, avatarColor: user.avatarColor, avatarText: user.avatarText };
        await createInvite(space, currentUser, inviteEmail);
        toast({ title: "تم إرسال الدعوة بنجاح!", description: `تم إرسال دعوة إلى ${inviteEmail} للانضمام إلى مساحتك.`});
        setInviteEmail("");
    } catch(error: any) {
        toast({ variant: 'destructive', title: "فشل إرسال الدعوة", description: error.message });
    } finally {
        setIsInviting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-headline text-start">إدارة الفريق</DialogTitle>
          <DialogDescription className="text-start">
            {isCurrentUserOwner ? "عدّل تفاصيل المساحة، قم بدعوة أعضاء جدد، أو قم بإدارة عضويتك." : "قم بإدارة عضويتك في هذه المساحة."}
          </DialogDescription>
        </DialogHeader>

        {isCurrentUserOwner && (
            <>
                <div className="py-2 text-start">
                    <Label className='font-medium'>تفاصيل المساحة</Label>
                    {!isEditing ? (
                        <div className="p-2 mt-2">
                             <p className="font-semibold">{space.name}</p>
                             <p className="text-sm text-muted-foreground">{space.description}</p>
                             <Button variant="outline" size="sm" className='mt-2' onClick={() => setIsEditing(true)}>تعديل</Button>
                        </div>
                    ) : (
                        <div className='space-y-3 mt-2'>
                           <div className="text-start">
                             <Label htmlFor='spaceName' className='text-xs'>اسم المساحة</Label>
                             <Input id="spaceName" value={editedName} onChange={(e) => setEditedName(e.target.value)} disabled={isSaving} />
                           </div>
                           <div className="text-start">
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
        
        <div className="py-2 text-start">
            <h3 className="text-sm font-medium mb-3">الأعضاء الحاليون ({space.team.length}/3)</h3>
            <div className="space-y-3">
            {space.team.map((member) => (
                <div key={member.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Avatar>
                            {member.avatarUrl && <AvatarImage src={member.avatarUrl} />}
                            <AvatarFallback style={{backgroundColor: member.avatarColor}}>{member.avatarText}</AvatarFallback>
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

        {isCurrentUserOwner && (
            <>
            <Separator />
            <div className="py-2 text-start">
                <h3 className="text-sm font-medium mb-2">دعوة عضو جديد</h3>
                {isTeamFull ? (
                    <p className="text-sm text-muted-foreground">مساحة العمل ممتلئة. لا يمكنك إضافة المزيد من الأعضاء.</p>
                ) : (
                    <div className="flex gap-2">
                        <Input 
                            type="email" 
                            placeholder="أدخل البريد الإلكتروني للعضو"
                            value={inviteEmail}
                            onChange={(e) => setInviteEmail(e.target.value)}
                            disabled={isInviting}
                        />
                        <Button onClick={handleInviteUser} disabled={isInviting || !inviteEmail}>
                            {isInviting ? <Loader2 className="animate-spin" /> : <Send />}
                        </Button>
                    </div>
                )}
            </div>
            </>
        )}
        
        <Separator />

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
