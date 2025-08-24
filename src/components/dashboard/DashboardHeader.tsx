
"use client";

import Link from 'next/link';
import { 
  LayoutGrid, 
  Bell, 
  User, 
  Settings, 
  LogOut,
  Calendar,
  LifeBuoy,
  PlusCircle,
  Home
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '../ui/badge';
import { useAuth } from '@/hooks/use-auth';
import { useState, useEffect } from 'react';
import type { Notification } from '@/lib/types';
import { getNotifications, markNotificationsAsRead } from '@/lib/services';
import { formatDistanceToNow } from 'date-fns';
import { ar } from 'date-fns/locale';
import { usePathname, useRouter } from 'next/navigation';
import { CreateItemDialog } from '../layout/CreateItemDialog';
import { cn } from '@/lib/utils';

export function DashboardHeader() {
  const { user, signOut } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isCreateItemOpen, setCreateItemOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { href: "/dashboard", icon: Home, label: "المساحات" },
    { href: "/calendar", icon: Calendar, label: "التقويم" },
  ];

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
    <>
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2">
              <LayoutGrid className="h-6 w-6 text-primary" />
              <span className="font-headline text-xl font-bold hidden sm:inline-block">زاوية</span>
            </Link>
            <nav className="hidden md:flex items-center gap-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Button key={item.href} variant={isActive ? 'secondary' : 'ghost'} size="sm" asChild>
                    <Link href={item.href}>
                      <item.icon />
                      {item.label}
                    </Link>
                  </Button>
                )
              })}
            </nav>
          </div>
          <div className="flex items-center gap-2 md:gap-4">
             <Button className='hidden md:inline-flex' onClick={() => setCreateItemOpen(true)}>
                <PlusCircle />
                <span>إنشاء جديد</span>
            </Button>
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
                              <p className='font-semibold whitespace-normal'>{n.message}</p>
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
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                    <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => router.push('/more')}>
                    <User />
                    <span>الملف الشخصي</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/guide')}>
                    <LifeBuoy />
                    <span>الدليل</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings />
                    <span>الإعدادات</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
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
       <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-background border-t z-50">
            <div className="flex justify-around items-center h-full max-w-md mx-auto px-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link href={item.href} key={item.href} className={cn(
                            "flex flex-col items-center justify-center text-xs gap-1 transition-colors w-16",
                            isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
                        )}>
                            <item.icon className="h-5 w-5" />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
                <div className="relative">
                    <Button
                        size="icon"
                        className="h-14 w-14 rounded-full bg-primary shadow-lg hover:bg-primary/90 flex flex-col items-center justify-center gap-1 -translate-y-3"
                        onClick={() => setCreateItemOpen(true)}
                    >
                        <PlusCircle className="h-6 w-6" />
                        <span className="text-xs">إضافة</span>
                    </Button>
                </div>
                 <Link href="/more" className={cn(
                        "flex flex-col items-center justify-center text-xs gap-1 transition-colors w-16",
                        pathname === '/more' ? "text-primary" : "text-muted-foreground hover:text-primary"
                    )}>
                    <User className="h-5 w-5" />
                    <span>المزيد</span>
                 </Link>
            </div>
        </nav>
      <CreateItemDialog open={isCreateItemOpen} onOpenChange={setCreateItemOpen} />
    </>
  );
}
