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

export function DashboardHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto flex h-16 items-center justify-between px-4 md:px-8">
        <Link href="/" className="flex items-center gap-2">
          <LayoutGrid className="h-6 w-6 text-primary" />
          <span className="font-headline text-xl font-bold">CollabPost</span>
        </Link>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge variant="destructive" className="absolute -top-1 -right-1 h-4 w-4 justify-center p-0 text-xs">٢</Badge>
                <span className="sr-only">الإشعارات</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>الإشعارات</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                    <div className='flex flex-col'>
                        <p className='font-semibold'>منشور مستحق لـ "متجر أزياء أزور"</p>
                        <p className='text-muted-foreground text-sm'>حان وقت النشر على انستغرام.</p>
                    </div>
                </DropdownMenuItem>
                <DropdownMenuItem>
                    <div className='flex flex-col'>
                        <p className='font-semibold'>فكرة جديدة من سميرة</p>
                        <p className='text-muted-foreground text-sm'>"تسليط الضوء على موادنا المستدامة."</p>
                    </div>
                </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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
                <User className="ms-2 h-4 w-4" />
                <span>الملف الشخصي</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings className="ms-2 h-4 w-4" />
                <span>الإعدادات</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LogOut className="ms-2 h-4 w-4" />
                <span>تسجيل الخروج</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
