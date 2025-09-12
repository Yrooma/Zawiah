
"use client";

import { useState, useMemo } from 'react';
import type { Post, PostStatus, ContentPillar, ContentType } from '@/lib/types';
import { contentTypes } from '@/lib/data';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameMonth, isToday, addMonths, subMonths, isSameDay } from 'date-fns';
import { ar } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PostPill } from './PostPill';
import { cn } from '@/lib/utils';
import { PostSheet } from './PostSheet';
import { Badge } from '../ui/badge';

const WEEKDAYS = ['أحد', 'اثنين', 'ثلاثاء', 'أربعاء', 'خميس', 'جمعة', 'سبت'];

interface CalendarTabProps {
  posts: Post[];
  pillars: ContentPillar[];
  onUpdatePostStatus: (postId: string, newStatus: PostStatus) => void;
  onEditPost: (post: Post) => void;
}

export function CalendarTab({ posts, pillars, onUpdatePostStatus, onEditPost }: CalendarTabProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [activePillarId, setActivePillarId] = useState<string | null>(null);
  const [activeContentType, setActiveContentType] = useState<ContentType | null>(null);

  const filteredPosts = useMemo(() => {
    let filtered = posts;
    if (activePillarId) {
      filtered = filtered.filter(post => post.pillar?.id === activePillarId);
    }
    if (activeContentType) {
      filtered = filtered.filter(post => post.contentType === activeContentType);
    }
    return filtered;
  }, [posts, activePillarId, activeContentType]);

  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);

  const daysInMonth = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth,
  });

  const startingDayIndex = getDay(firstDayOfMonth);

  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const handlePostSheetClose = () => {
    setSelectedPost(null);
  }
  
  const handleEdit = (post: Post) => {
    handlePostSheetClose();
    setTimeout(() => onEditPost(post), 100);
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-headline font-bold text-foreground">
          {format(currentDate, 'MMMM yyyy', { locale: ar })}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handlePrevMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="space-y-4 mb-4">
        {pillars && pillars.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-medium">فلترة حسب المحور:</span>
            <Button
              variant={!activePillarId ? 'secondary' : 'ghost'} 
              size="sm" 
              onClick={() => setActivePillarId(null)}
              className="rounded-full"
            >
              الكل
            </Button>
            {pillars.map(pillar => (
              <Button 
                key={pillar.id}
                variant={activePillarId === pillar.id ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setActivePillarId(pillar.id)}
                className="rounded-full"
              >
                <span className="h-2 w-2 rounded-full me-2" style={{ backgroundColor: pillar.color }} />
                {pillar.name}
              </Button>
            ))}
          </div>
        )}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-medium">فلترة حسب النوع:</span>
          <Button 
            variant={!activeContentType ? 'secondary' : 'ghost'} 
            size="sm" 
            onClick={() => setActiveContentType(null)}
            className="rounded-full"
          >
            الكل
          </Button>
          {contentTypes.map(type => (
            <Button 
              key={type.value}
              variant={activeContentType === type.value ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setActiveContentType(type.value)}
              className="rounded-full"
            >
              {type.icon}
              <span className="me-1">{type.label}</span>
            </Button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-7 border-t border-e rounded-t-lg">
        {WEEKDAYS.map((day) => (
          <div key={day} className="text-center font-medium text-muted-foreground p-2 border-s border-b bg-muted/50 text-xs sm:text-sm">
            {day}
          </div>
        ))}
        {Array.from({ length: startingDayIndex }).map((_, i) => (
          <div key={`empty-${i}`} className="border-s border-b" />
        ))}
        {daysInMonth.map((day) => {
          const postsForDay = filteredPosts.filter(post => isSameDay(post.scheduledAt as Date, day));
          return (
            <div
              key={day.toString()}
              className={cn(
                'relative min-h-[100px] p-1 sm:p-2 border-s border-b',
                !isSameMonth(day, currentDate) && 'bg-muted/30',
                isToday(day) && 'bg-blue-100 dark:bg-blue-900/30'
              )}
            >
              <span className={cn('text-xs sm:text-base font-semibold', isToday(day) && 'text-primary font-bold')}>
                {format(day, 'd')}
              </span>
              <div className="mt-1 sm:mt-2 space-y-1">
                {postsForDay.map(post => (
                  <PostPill key={post.id} post={post} onClick={() => setSelectedPost(post)} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <PostSheet 
        post={selectedPost} 
        open={!!selectedPost} 
        onOpenChange={(isOpen) => !isOpen && handlePostSheetClose()}
        onUpdateStatus={onUpdatePostStatus}
        onEdit={handleEdit}
      />
    </>
  );
}
