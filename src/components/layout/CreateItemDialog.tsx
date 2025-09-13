
"use client";

import { useState, useEffect } from 'react';
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
  ResponsiveDialogDescription,
} from "@/components/ui/responsive-dialog";
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import type { Space, Post, Idea, Platform } from '@/lib/types';
import { getSpaces, addPost, addIdea } from '@/lib/services';
import { Loader2, Lightbulb, FileText } from 'lucide-react';
import { CreatePostDialog } from '../space/CreatePostDialog';
import { CreateIdeaDialog } from '../space/CreateIdeaDialog';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

interface CreateItemDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CreateItemDialog({ open, onOpenChange }: CreateItemDialogProps) {
    const [step, setStep] = useState(1);
    const [itemType, setItemType] = useState<'post' | 'idea' | null>(null);
    const [selectedSpace, setSelectedSpace] = useState<string | null>(null);
    const [spaces, setSpaces] = useState<Space[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth();
    const { toast } = useToast();
    const router = useRouter();

    useEffect(() => {
        if (open && user) {
            getSpaces(user.uid).then(userSpaces => {
                setSpaces(userSpaces);
                setIsLoading(false);
            });
        } else if (!open) {
            // Reset state when dialog is closed
            setTimeout(() => {
                setStep(1);
                setItemType(null);
                setSelectedSpace(null);
            }, 300); // delay to allow for closing animation
        }
    }, [open, user]);

    const handleItemTypeSelect = (type: 'post' | 'idea') => {
        setItemType(type);
        setStep(2);
    };

    const handleSpaceSelect = (spaceId: string) => {
        setSelectedSpace(spaceId);
        setStep(3);
    };
    
    const handleAddPost = async (postDetails: Omit<Post, 'id' | 'spaceId' | 'spaceName' | 'status' | 'createdBy' | 'lastModifiedBy' | 'activityLog'>) => {
        if (!selectedSpace || !user) return;
        const currentUser = { id: user.uid, name: user.name, avatarUrl: user.avatarUrl, avatarColor: user.avatarColor, avatarText: user.avatarText };
        const newPostData: Omit<Post, 'id' | 'spaceId' | 'spaceName'> = { 
            ...postDetails, 
            status: 'draft', 
            createdBy: currentUser, 
            lastModifiedBy: currentUser, 
            activityLog: [{ user: currentUser, action: 'إنشاء', date: 'الآن' }] 
        };
        await addPost(selectedSpace, newPostData);
        onOpenChange(false);
        router.push(`/spaces/${selectedSpace}`);
    }

    const handleAddIdea = async (ideaData: Omit<Idea, 'id' | 'createdBy' | 'createdAt'>) => {
        if (!selectedSpace || !user) return;
        const currentUser = { id: user.uid, name: user.name, avatarUrl: user.avatarUrl, avatarColor: user.avatarColor, avatarText: user.avatarText };
        const newIdeaData: Omit<Idea, 'id'> = { 
            ...ideaData, 
            createdBy: currentUser, 
            createdAt: new Date().toISOString() 
        };
        await addIdea(selectedSpace, newIdeaData);
        onOpenChange(false);
        router.push(`/spaces/${selectedSpace}`);
    }
    
    const spaceForDialog = spaces.find(s => s.id === selectedSpace);

    if (step === 3 && itemType === 'post' && spaceForDialog) {
        return <CreatePostDialog 
            open={true}
            onOpenChange={(isOpen) => !isOpen && onOpenChange(false)}
            spaceId={spaceForDialog.id}
            onSavePost={handleAddPost}
            pillars={spaceForDialog.compass?.pillars || []}
            compass={spaceForDialog.compass}
        />
    }

    if (step === 3 && itemType === 'idea' && spaceForDialog) {
        return <CreateIdeaDialog 
            open={true}
            onOpenChange={(isOpen) => !isOpen && onOpenChange(false)}
            onAddIdea={handleAddIdea}
            pillars={spaceForDialog.compass?.pillars || []}
        />
    }

    return (
        <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
            <ResponsiveDialogContent className="p-0">
                <ResponsiveDialogHeader className="p-4 border-b flex-shrink-0">
                    <ResponsiveDialogTitle className="font-headline text-center">إنشاء جديد</ResponsiveDialogTitle>
                    <ResponsiveDialogDescription className="text-center">
                        {step === 1 ? 'ماذا تريد أن تنشئ؟' : 'في أي مساحة عمل؟'}
                    </ResponsiveDialogDescription>
                </ResponsiveDialogHeader>
                
                <div className="p-4 overflow-y-auto flex-grow">
                    {isLoading ? (
                        <div className="flex justify-center items-center h-24">
                            <Loader2 className="animate-spin text-primary" />
                        </div>
                    ) : step === 1 ? (
                        <div className="grid grid-cols-2 gap-4 py-4">
                            <Button variant="outline" className="h-24 flex-col gap-2" onClick={() => handleItemTypeSelect('post')}>
                                <FileText className="h-8 w-8" />
                                <span>منشور</span>
                            </Button>
                            <Button variant="outline" className="h-24 flex-col gap-2" onClick={() => handleItemTypeSelect('idea')}>
                                <Lightbulb className="h-8 w-8" />
                                <span>فكرة</span>
                            </Button>
                        </div>
                    ) : (
                        <div className="py-4 space-y-4">
                            <div>
                                <Label htmlFor="workspace">اختر مساحة العمل</Label>
                                <Select onValueChange={handleSpaceSelect} disabled={spaces.length === 0}>
                                    <SelectTrigger id="workspace">
                                        <SelectValue placeholder={spaces.length > 0 ? "اختر..." : "ليس لديك مساحات عمل"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {spaces.map(space => (
                                            <SelectItem key={space.id} value={space.id}>{space.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button variant="link" onClick={() => setStep(1)}>العودة</Button>
                        </div>
                    )}
                </div>
            </ResponsiveDialogContent>
        </ResponsiveDialog>
    );
}
