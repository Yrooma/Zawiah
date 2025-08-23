"use client";

import Link from 'next/link';
import { PlusCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { SpaceCard } from '@/components/dashboard/SpaceCard';
import { CreateSpaceDialog } from '@/components/dashboard/CreateSpaceDialog';
import { getSpaces } from '@/lib/services';
import type { Space } from '@/lib/types';
import { useState, useEffect } from 'react';

export default function DashboardPage() {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSpaces = async () => {
      try {
        setIsLoading(true);
        const spacesFromDb = await getSpaces();
        setSpaces(spacesFromDb);
        setError(null);
      } catch (err) {
        setError("Failed to fetch workspaces. Please try again later.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSpaces();
  }, []);

  const handleSpaceCreated = (newSpace: Space) => {
    setSpaces(prevSpaces => [...prevSpaces, newSpace]);
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
            <CreateSpaceDialog onSpaceCreated={handleSpaceCreated}>
              <Button>
                <PlusCircle />
                Create New Space
              </Button>
            </CreateSpaceDialog>
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
                <Link href={`/spaces/${space.id}`} key={space.id} legacyBehavior>
                  <a className="block transition-transform transform hover:-translate-y-1">
                    <SpaceCard space={space} />
                  </a>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border-2 border-dashed rounded-lg">
              <h2 className="text-xl font-semibold text-muted-foreground">No workspaces yet.</h2>
              <p className="text-muted-foreground mt-2">Get started by creating your first collaboration space.</p>
              <CreateSpaceDialog onSpaceCreated={handleSpaceCreated}>
                <Button className="mt-4">
                  <PlusCircle />
                  Create First Workspace
                </Button>
              </CreateSpaceDialog>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
