import type { Space } from '@/lib/types';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { FileText, Lightbulb } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface SpaceCardProps {
  space: Space;
}

export function SpaceCard({ space }: SpaceCardProps) {
  const postsCount = space.posts.length;
  const ideasCount = space.ideas.length;

  return (
    <Card className="h-full flex flex-col hover:border-primary/50 hover:shadow-lg transition-all duration-200">
      <CardHeader>
        <CardTitle className="font-headline">{space.name}</CardTitle>
        <CardDescription>A space for content collaboration.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="flex items-center space-x-2">
          <div className="flex -space-x-2">
            <TooltipProvider>
              {space.team.map((member) => (
                <Tooltip key={member.id}>
                  <TooltipTrigger asChild>
                    <Avatar className="border-2 border-background">
                      <AvatarImage src={member.avatarUrl} />
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{member.name}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </div>
          <span className="text-sm text-muted-foreground">{space.team.length} members</span>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between text-sm text-muted-foreground bg-secondary/50 py-3 px-6 rounded-b-lg">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          <span>{postsCount} Posts</span>
        </div>
        <div className="flex items-center gap-2">
          <Lightbulb className="w-4 h-4" />
          <span>{ideasCount} Ideas</span>
        </div>
      </CardFooter>
    </Card>
  );
}
