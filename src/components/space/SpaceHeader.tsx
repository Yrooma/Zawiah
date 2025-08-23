
import Link from 'next/link';
import { ArrowLeft, Users, PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { TeamDialog } from './TeamDialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User, Settings, LogOut } from 'lucide-react';
import type { Space } from '@/lib/types';
import { useAuth } from '@/hooks/use-auth';


interface SpaceHeaderProps {
  spaceName: string;
  onNewPostClick: () => void;
  space: Space;
  onSpaceUpdate: () => void;
}

export function SpaceHeader({ spaceName, onNewPostClick, space, onSpaceUpdate }: SpaceHeaderProps) {
  const { user, signOut } = useAuth();
  
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <div className="flex items-center gap-4">
          <Link href="/" passHref>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">العودة إلى لوحة التحكم</span>
            </Button>
          </Link>
          <h1 className="text-xl font-headline font-semibold hidden md:block">{spaceName}</h1>
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
          
           <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                <Avatar>
                  <AvatarImage src={user?.avatarUrl} alt="صورة المستخدم" />
                  <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>حسابي</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User />
                <span>الملف الشخصي</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings />
                <span>الإعدادات</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={signOut}>
                <LogOut />
                <span>تسجيل الخروج</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
