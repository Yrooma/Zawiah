
import Link from 'next/link';
import { ArrowRight, Users, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TeamDialog } from './TeamDialog';
import type { Space } from '@/lib/types';

interface SpaceHeaderProps {
  spaceName: string;
  onNewPostClick: () => void;
  space: Space;
  onSpaceUpdate: () => void;
}

export function SpaceHeader({ spaceName, onNewPostClick, space, onSpaceUpdate }: SpaceHeaderProps) {
  return (
    <div className="bg-secondary border-b">
        <div className="max-w-7xl mx-auto flex h-20 items-center justify-between px-4 md:px-8">
            <div className="flex items-center gap-2 md:gap-4">
                <Link href="/dashboard" passHref>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                    <ArrowRight className="h-4 w-4" />
                    <span className="sr-only">العودة إلى لوحة التحكم</span>
                    </Button>
                </Link>
                <h1 className="text-xl md:text-2xl font-headline font-semibold truncate">{spaceName}</h1>
            </div>
            <div className="flex items-center gap-2 md:gap-4">
                 <TeamDialog space={space} onSpaceUpdate={onSpaceUpdate}>
                    <Button variant="outline">
                    <Users />
                    <span className="hidden md:inline-block">إدارة الفريق</span>
                    </Button>
                </TeamDialog>
                <Button onClick={onNewPostClick}>
                    <PlusCircle />
                    <span className="hidden md:inline-block">منشور جديد</span>
                </Button>
            </div>
        </div>
    </div>
  );
}
