
"use client";

import Link from 'next/link';
import { 
  LayoutGrid, 
  Bell, 
  User, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '../ui/badge';
import { useAuth } from '@/hooks/use-auth';
import { useState, useEffect } from 'react';
import type { Notification } from '@/lib/types';
import { getNotifications, markNotificationsAsRead } from '@/lib/services';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';

export function DashboardHeader() {
  const { user, signOut } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      const fetchNotifications = async () => {
        const userNotifications = await getNotifications(user.uid);
        setNotifications(userNotifications);
        setUnreadCount(userNotifications.filter(n => !n.read).length);
      };
      fetchNotifications();
    }
  }, [user]);

  const handleOpenNotifications = async () => {
    if (unreadCount > 0) {
      const unreadIds = notifications.filter(n => !n.read).map(n => n.id);
      await markNotificationsAsRead(unreadIds);
      setUnreadCount(0);
      setNotifications(notifications.map(n => ({...n, read: true})));
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2">
          <LayoutGrid className="h-6 w-6 text-primary" />
          <span className="font-headline text-xl font-bold">زاوية</span>
        </Link>
        <div className="flex items-center gap-4">
          <DropdownMenu onOpenChange={(open) => open && handleOpenNotifications()}>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 justify-center p-0 text-xs">{unreadCount}</Badge>
                )}
                <span className="sr-only">الإشعارات</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>الإشعارات</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.length > 0 ? (
                  notifications.slice(0, 5).map(n => (
                     <DropdownMenuItem key={n.id} asChild>
                        <Link href={n.link} className='flex flex-col items-start'>
                            <p className='font-semibold'>{n.message}</p>
                            <p className='text-muted-foreground text-sm'>
                              {formatDistanceToNow(n.createdAt as Date, { addSuffix: true, locale: ar })}
                            </p>
                        </Link>
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem disabled>
                    ليس لديك إشعارات جديدة.
                  </DropdownMenuItem>
                )}
            </DropdownMenuContent>
          </DropdownMenu>

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
