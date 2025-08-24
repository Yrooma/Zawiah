
"use client";

import Link from 'next/link';
import { PlusCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SpaceCard } from '@/components/dashboard/SpaceCard';
import { CreateSpaceDialog } from '@/components/dashboard/CreateSpaceDialog';
import { getSpaces } from '@/lib/services';
import type { Space } from '@/lib/types';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';

export default function DashboardPage() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchSpaces = async () => {
    if(user) {
      try {
        setIsLoading(true);
        const spacesFromDb = await getSpaces(user.uid);
        setSpaces(spacesFromDb);
        setError(null);
      } catch (err) {
        setError("فشل في جلب مساحات العمل. يرجى المحاولة مرة أخرى لاحقًا.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    if(user) {
      fetchSpaces();
    }
  }, [user]);

  const handleSpaceCreated = (newSpace: Space) => {
    setSpaces(prevSpaces => [...prevSpaces, newSpace]);
  }

  return (
    <main className="flex-1 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <h1 className="text-3xl font-headline font-bold text-foreground">
            مساحات العمل الخاصة بك
          </h1>
          <div className='flex items-center gap-2'>
            <CreateSpaceDialog onSpaceCreated={handleSpaceCreated}>
              <Button>
                <PlusCircle />
                <span className="hidden sm:inline-block">مساحة جديدة</span>
              </Button>
            </CreateSpaceDialog>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-16">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
           <div className="text-center py-16 border-2 border-dashed rounded-lg bg-destructive/10 border-destructive/50">
            <h2 className="text-xl font-semibold text-destructive">خطأ</h2>
            <p className="text-muted-foreground mt-2">{error}</p>
          </div>
        ) : spaces.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {spaces.map((space) => (
              <Link href={`/spaces/${space.id}`} key={space.id} className="block transition-transform transform hover:-translate-y-1">
                <SpaceCard space={space} />
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 border-2 border-dashed rounded-lg">
            <h2 className="text-xl font-semibold text-muted-foreground">لا توجد مساحات عمل حتى الآن.</h2>
            <p className="text-muted-foreground mt-2">ابدأ بإنشاء مساحة عمل جديدة للتعاون مع فريقك.</p>
            <div className="flex justify-center gap-4 mt-4">
              <CreateSpaceDialog onSpaceCreated={handleSpaceCreated}>
                <Button>
                  <PlusCircle />
                  إنشاء مساحة العمل الأولى
                </Button>
              </CreateSpaceDialog>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
