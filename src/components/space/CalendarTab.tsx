"use client";

import { useState } from 'react';
import type { Post } from '@/lib/types';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, getDay, isSameMonth, isToday, addMonths, subMonths, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PostPill } from './PostPill';
import { cn } from '@/lib/utils';
import { PostSheet } from './PostSheet';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

interface CalendarTabProps {
  posts: Post[];
}

export function CalendarTab({ posts }: CalendarTabProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const firstDayOfMonth = startOfMonth(currentDate);
  const lastDayOfMonth = endOfMonth(currentDate);

  const daysInMonth = eachDayOfInterval({
    start: firstDayOfMonth,
    end: lastDayOfMonth,
  });

  const startingDayIndex = getDay(firstDayOfMonth);

  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-headline font-bold text-foreground">
          {format(currentDate, 'MMMM yyyy')}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handlePrevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-7 border-t border-l rounded-t-lg">
        {WEEKDAYS.map((day) => (
          <div key={day} className="text-center font-medium text-muted-foreground p-2 border-r border-b bg-muted/50">
            {day}
          </div>
        ))}
        {Array.from({ length: startingDayIndex }).map((_, i) => (
          <div key={`empty-${i}`} className="border-r border-b" />
        ))}
        {daysInMonth.map((day) => {
          const postsForDay = posts.filter(post => isSameDay(post.scheduledAt, day));
          return (
            <div
              key={day.toString()}
              className={cn(
                'relative min-h-[120px] p-2 border-r border-b',
                !isSameMonth(day, currentDate) && 'bg-muted/30',
                isToday(day) && 'bg-blue-100 dark:bg-blue-900/30'
              )}
            >
              <span className={cn('font-semibold', isToday(day) && 'text-primary font-bold')}>
                {format(day, 'd')}
              </span>
              <div className="mt-2 space-y-1">
                {postsForDay.map(post => (
                  <PostPill key={post.id} post={post} onClick={() => setSelectedPost(post)} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
      <PostSheet post={selectedPost} open={!!selectedPost} onOpenChange={(isOpen) => !isOpen && setSelectedPost(null)} />
    </>
  );
}
