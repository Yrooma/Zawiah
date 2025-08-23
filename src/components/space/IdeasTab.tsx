import type { Idea } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
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
            title: "Idea Ready to Plan!",
            description: `"${ideaContent.substring(0, 30)}..." has been moved to the post planner.`,
        });
    }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-headline font-bold">Content Ideas</h2>
        <Button>
          <PlusCircle />
          Add Idea
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
                <span className='text-xs text-muted-foreground'>By {idea.createdBy.name}</span>
              </div>
              <div className='flex gap-2'>
                <Button size="sm" variant="outline" onClick={() => handleConvertToPost(idea.content)}>
                  Convert to Post
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
                <h3 className="mt-4 text-lg font-medium">No ideas yet</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    This is your space for brainstorming. Add your first idea!
                </p>
                <Button className="mt-4">
                    <PlusCircle />
                    Add Your First Idea
                </Button>
            </div>
        )}
      </div>
    </div>
  );
}
