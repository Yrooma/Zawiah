import type { Idea } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Lightbulb, PlusCircle, Trash2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useToast } from '@/hooks/use-toast';

interface IdeasTabProps {
  ideas: Idea[];
}

export function IdeasTab({ ideas }: IdeasTabProps) {
    const { toast } = useToast();

    const handleConvertToPost = (ideaContent: string) => {
        toast({
            title: "فكرة جاهزة للتخطيط!",
            description: `تم نقل "${ideaContent.substring(0, 30)}..." إلى مخطط المنشورات.`,
        });
    }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-headline font-bold">أفكار المحتوى</h2>
        <Button>
          <PlusCircle />
          أضف فكرة
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {ideas.map((idea) => (
          <Card key={idea.id} className="flex flex-col">
            <CardContent className="p-6 flex-grow">
              <p className="text-foreground">{idea.content}</p>
            </CardContent>
            <CardFooter className="p-4 bg-muted/50 flex justify-between items-center">
              <div className='flex items-center gap-2'>
                <Avatar className="h-6 w-6">
                    <AvatarImage src={idea.createdBy.avatarUrl} />
                    <AvatarFallback>{idea.createdBy.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className='text-xs text-muted-foreground'>بواسطة {idea.createdBy.name}</span>
              </div>
              <div className='flex gap-2'>
                <Button size="sm" variant="outline" onClick={() => handleConvertToPost(idea.content)}>
                  تحويل إلى منشور
                </Button>
                <Button size="icon" variant="ghost" className='h-8 w-8 text-muted-foreground hover:text-destructive'>
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
                <Button className="mt-4">
                    <PlusCircle />
                    أضف فكرتك الأولى
                </Button>
            </div>
        )}
      </div>
    </div>
  );
}
