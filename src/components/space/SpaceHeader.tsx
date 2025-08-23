
import Link from 'next/link';
import { ArrowLeft, Users, PlusCircle, Bell, User, Settings, LogOut } from 'lucide-react';
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
import { CreatePostDialog } from './CreatePostDialog';
import type { Space } from '@/lib/types';
import { spaces } from '@/lib/data'; // We'll get the space data from here

interface SpaceHeaderProps {
  spaceName: string;
  onNewPostClick: () => void;
}

export function SpaceHeader({ spaceName, onNewPostClick }: SpaceHeaderProps) {
  // This is a placeholder to find the current space. In a real app,
  // this would come from a data fetch based on the spaceId.
  const currentSpace = spaces.find(s => s.name === spaceName);

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
          <TeamDialog team={currentSpace?.team || []} inviteToken={currentSpace?.inviteToken || ''}>
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
                  <AvatarImage src="https://placehold.co/100x100/EFEFEFF/333333?text=AD" alt="صورة المستخدم الرمزية" />
                  <AvatarFallback>AD</AvatarFallback>
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
              <DropdownMenuItem>
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
