
"use client";

import { useState, type ReactNode, useEffect } from 'react';
import { LogOut, Trash2, Loader2, Copy, Check, RefreshCw } from 'lucide-react';
import { Button } from "@/components/ui/button";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog";
import { DialogTrigger } from "@/components/ui/dialog";
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
import { leaveSpace, deleteSpace, updateSpace, generateSpaceInviteToken, revokeInviteToken } from '@/lib/services';
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
  const [isGeneratingToken, setIsGeneratingToken] = useState(false);
  const [hasCopied, setHasCopied] = useState(false);

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
      setHasCopied(false);
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
  
  const handleGenerateToken = async () => {
    if (!user) return;
    
    setIsGeneratingToken(true);
    try {
        const token = await generateSpaceInviteToken(space.id, user.uid);
        setSpace(prev => ({...prev, inviteToken: token }));
        // Don't call onSpaceUpdate() to prevent dialog from closing
        toast({ title: "تم إنشاء رمز الدعوة!", description: "يمكن للأعضاء الجدد استخدام هذا الرمز للانضمام إلى مساحتك." });
    } catch(error: any) {
        toast({ variant: 'destructive', title: "فشل إنشاء رمز الدعوة", description: error.message });
    } finally {
        setIsGeneratingToken(false);
    }
  }

  const handleCopyToken = () => {
    if (!space.inviteToken) return;
    navigator.clipboard.writeText(space.inviteToken);
    setHasCopied(true);
    toast({ title: "تم نسخ الرمز!", description: "يمكنك الآن مشاركة رمز الدعوة مع الأعضاء الجدد." });
    setTimeout(() => setHasCopied(false), 2000);
  }

  const handleRevokeToken = async () => {
    if (!user) return;
    
    try {
        await revokeInviteToken(space.id, user.uid);
        setSpace(prev => ({...prev, inviteToken: undefined }));
        // Don't call onSpaceUpdate() to prevent dialog from closing
        toast({ title: "تم إلغاء رمز الدعوة", description: "لم يعد بإمكان استخدام الرمز السابق للانضمام." });
    } catch(error: any) {
        toast({ variant: 'destructive', title: "فشل إلغاء رمز الدعوة", description: error.message });
    }
  }

  return (
    <ResponsiveDialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <ResponsiveDialogContent className="sm:max-w-md p-0">
        <ResponsiveDialogHeader className="p-4 border-b flex-shrink-0">
          <ResponsiveDialogTitle className="font-headline text-start">إدارة الفريق</ResponsiveDialogTitle>
        </ResponsiveDialogHeader>

        <div className="p-4 overflow-y-auto">
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
                <h3 className="text-sm font-medium mb-2">رمز دعوة الأعضاء</h3>
                {isTeamFull ? (
                    <p className="text-sm text-muted-foreground">مساحة العمل ممتلئة. لا يمكنك إضافة المزيد من الأعضاء.</p>
                ) : space.inviteToken ? (
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Input 
                                value={space.inviteToken}
                                readOnly
                                className="font-mono text-center tracking-widest"
                            />
                            <Button size="icon" onClick={handleCopyToken}>
                                {hasCopied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                            </Button>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={handleGenerateToken} disabled={isGeneratingToken}>
                                {isGeneratingToken ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                                إنشاء رمز جديد
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleRevokeToken}>
                                إلغاء الرمز
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            شارك هذا الرمز مع الأعضاء الجدد للانضمام إلى مساحتك. الرمز صالح لمدة 7 أيام.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-2">
                        <Button onClick={handleGenerateToken} disabled={isGeneratingToken} className="w-full">
                            {isGeneratingToken ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
                            إنشاء رمز دعوة
                        </Button>
                        <p className="text-xs text-muted-foreground">
                            أنشئ رمزًا مكونًا من 8 أحرف لدعوة أعضاء جدد إلى مساحتك.
                        </p>
                    </div>
                )}
            </div>
            </>
        )}
        </div>
        
        <div className="p-4 border-t flex-shrink-0">
            <AlertDialog>
                <AlertDialogTrigger asChild>
                    <Button variant="outline" className='text-destructive hover:text-destructive w-full justify-center'>
                        {isCurrentUserOwner ? <Trash2 className="me-2" /> : <LogOut className="me-2" />}
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
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
