
"use client";

import { useState, useEffect } from 'react';
import type { Idea, Space } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Lightbulb, PlusCircle, Trash2, Pencil } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { CreateIdeaDialog } from './CreateIdeaDialog';
import { EditIdeaDialog } from './EditIdeaDialog';


interface IdeasTabProps {
  space: Space;
  onConvertToPost: (content: string) => void;
  onAddIdea: (content: string) => Promise<void>;
  onDeleteIdea: (ideaId: string) => Promise<void>;
  onUpdateIdea: (ideaId: string, content: string) => Promise<void>;
}

export function IdeasTab({ space, onConvertToPost, onAddIdea, onDeleteIdea, onUpdateIdea }: IdeasTabProps) {
    const { toast } = useToast();
    const [ideas, setIdeas] = useState<Idea[]>(space.ideas);
    const [isEditIdeaOpen, setEditIdeaOpen] = useState(false);
    const [ideaToEdit, setIdeaToEdit] = useState<Idea | null>(null);

    useEffect(() => {
        setIdeas(space.ideas);
    }, [space.ideas]);

    const handleConvertToPost = (ideaContent: string) => {
        onConvertToPost(ideaContent);
        toast({
            title: "الفكرة جاهزة للجدولة!",
            description: `تم نقل المحتوى إلى شاشة إنشاء المنشور.`,
        });
    }

    const handleDeleteIdea = async (ideaId: string) => {
      await onDeleteIdea(ideaId);
      toast({
        title: "تم حذف الفكرة!",
        variant: "destructive"
      });
    }
    
    const handleOpenEditDialog = (idea: Idea) => {
        setIdeaToEdit(idea);
        setEditIdeaOpen(true);
    };


  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-headline font-bold">أفكار المحتوى</h2>
        <CreateIdeaDialog onAddIdea={onAddIdea}>
          <Button>
            <PlusCircle />
            أضف فكرة
          </Button>
        </CreateIdeaDialog>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {ideas.map((idea) => (
          <Card key={idea.id} className="flex flex-col">
            <CardContent className="p-6 flex-grow">
              <p className="text-foreground whitespace-pre-wrap">{idea.content}</p>
            </CardContent>
            <CardFooter className="p-4 bg-muted/50 flex justify-between items-center">
              <div className='flex items-center gap-2'>
                <Avatar className="h-6 w-6">
                    {idea.createdBy.avatarUrl && <AvatarImage src={idea.createdBy.avatarUrl} />}
                    <AvatarFallback style={{backgroundColor: idea.createdBy.avatarColor}}>{idea.createdBy.avatarText}</AvatarFallback>
                </Avatar>
                <span className='text-xs text-muted-foreground'>بواسطة {idea.createdBy.name}</span>
              </div>
              <div className='flex gap-1'>
                <Button size="sm" variant="outline" onClick={() => handleConvertToPost(idea.content)}>
                  تحويل
                </Button>
                <Button size="icon" variant="ghost" className='h-8 w-8' onClick={() => handleOpenEditDialog(idea)}>
                    <Pencil className='h-4 w-4'/>
                </Button>
                <Button size="icon" variant="ghost" className='h-8 w-8 text-muted-foreground hover:text-destructive' onClick={() => handleDeleteIdea(idea.id)}>
                    <Trash2 className='h-4 w-4'/>
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
        {ideas.length === 0 && (
            <div className="md:col-span-2 lg:col-span-3 text-center py-16 border-2 border-dashed rounded-lg">
                <Lightbulb className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">لا توجد أفكار بعد</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    هذه هي مساحتك لتبادل الأفكار. أضف فكرتك الأولى!
                </p>
                <CreateIdeaDialog onAddIdea={onAddIdea}>
                    <Button className="mt-4">
                        <PlusCircle />
                        أضف فكرتك الأولى
                    </Button>
                </CreateIdeaDialog>
            </div>
        )}
      </div>
      <EditIdeaDialog 
        idea={ideaToEdit}
        open={isEditIdeaOpen}
        onOpenChange={setEditIdeaOpen}
        onUpdateIdea={onUpdateIdea}
      />
    </div>
  );
}
