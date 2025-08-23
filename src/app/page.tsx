
"use client";

import Link from 'next/link';
import { PlusCircle, Loader2, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { SpaceCard } from '@/components/dashboard/SpaceCard';
import { CreateSpaceDialog } from '@/components/dashboard/CreateSpaceDialog';
import { JoinSpaceDialog } from '@/components/dashboard/JoinSpaceDialog';
import { getSpaces } from '@/lib/services';
import type { Space } from '@/lib/types';
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  const fetchSpaces = async () => {
    if(user) {
      try {
        setIsLoading(true);
        const spacesFromDb = await getSpaces(user.uid);
        setSpaces(spacesFromDb);
        setError(null);
      } catch (err) {
        setError("Failed to fetch workspaces. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchSpaces();
  }, [user]);

  const handleSpaceCreated = (newSpace: Space) => {
    setSpaces(prevSpaces => [...prevSpaces, newSpace]);
  }
  
  const handleSpaceJoined = (joinedSpace: Space) => {
    // Check if the space is already in the list to avoid duplicates
    if (!spaces.find(s => s.id === joinedSpace.id)) {
      setSpaces(prevSpaces => [...prevSpaces, joinedSpace]);
    }
    // Or just refetch all spaces to be safe
    fetchSpaces();
  }

  if (authLoading || !user) {
    return (
       <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-headline font-bold text-foreground">
              Your Workspaces
            </h1>
            <div className='flex items-center gap-2'>
              <JoinSpaceDialog onSpaceJoined={handleSpaceJoined}>
                <Button variant="outline">
                  <UserPlus />
                  Join a Workspace
                </Button>
              </JoinSpaceDialog>
              <CreateSpaceDialog onSpaceCreated={handleSpaceCreated}>
                <Button>
                  <PlusCircle />
                  Create New Space
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
              <h2 className="text-xl font-semibold text-destructive">Error</h2>
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
              <h2 className="text-xl font-semibold text-muted-foreground">No workspaces yet.</h2>
              <p className="text-muted-foreground mt-2">Get started by creating a new workspace or joining an existing one.</p>
              <div className="flex justify-center gap-4 mt-4">
                <JoinSpaceDialog onSpaceJoined={handleSpaceJoined}>
                  <Button variant="outline">
                    <UserPlus />
                    Join a Workspace
                  </Button>
                </JoinSpaceDialog>
                <CreateSpaceDialog onSpaceCreated={handleSpaceCreated}>
                  <Button>
                    <PlusCircle />
                    Create First Workspace
                  </Button>
                </CreateSpaceDialog>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
