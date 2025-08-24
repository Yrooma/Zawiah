
"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
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
    
    const handleAddPost = async (postDetails: { title: string; content: string; platform: Platform; scheduledAt: Date }) => {
        if (!selectedSpace || !user) return;
        const newPostData = { ...postDetails, status: 'draft', createdBy: {id: user.uid, name: user.name, avatarUrl: user.avatarUrl}, lastModifiedBy: {id: user.uid, name: user.name, avatarUrl: user.avatarUrl}, activityLog: [{ user: {id: user.uid, name: user.name, avatarUrl: user.avatarUrl}, action: 'إنشاء', date: 'الآن' }] };
        await addPost(selectedSpace, newPostData);
        onOpenChange(false);
        router.push(`/spaces/${selectedSpace}`);
    }

    const handleAddIdea = async (content: string) => {
        if (!selectedSpace || !user) return;
        const newIdeaData = { content, createdBy: {id: user.uid, name: user.name, avatarUrl: user.avatarUrl}, createdAt: new Date().toISOString() };
        await addIdea(selectedSpace, newIdeaData);
        onOpenChange(false);
        router.push(`/spaces/${selectedSpace}`);
    }

    if (step === 3 && itemType === 'post' && selectedSpace) {
        return <CreatePostDialog 
            open={true}
            onOpenChange={(isOpen) => !isOpen && onOpenChange(false)}
            spaceId={selectedSpace}
            onSavePost={handleAddPost}
        />
    }

    if (step === 3 && itemType === 'idea' && selectedSpace) {
        return <CreateIdeaDialog 
            open={true}
            onOpenChange={(isOpen) => !isOpen && onOpenChange(false)}
            onAddIdea={(content) => handleAddIdea(content)}
        />
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="font-headline text-center">إنشاء جديد</DialogTitle>
                    <DialogDescription className="text-center">
                        {step === 1 ? 'ماذا تريد أن تنشئ؟' : 'في أي مساحة عمل؟'}
                    </DialogDescription>
                </DialogHeader>
                
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
            </DialogContent>
        </Dialog>
    );
}
