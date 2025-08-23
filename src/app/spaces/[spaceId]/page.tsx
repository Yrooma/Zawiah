import { notFound } from 'next/navigation';
import { spaces } from '@/lib/data';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SpaceHeader } from '@/components/space/SpaceHeader';
import { CalendarTab } from '@/components/space/CalendarTab';
import { IdeasTab } from '@/components/space/IdeasTab';

export default function SpacePage({ params }: { params: { spaceId: string } }) {
  const space = spaces.find((s) => s.id === params.spaceId);

  if (!space) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <SpaceHeader spaceName={space.name} />
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <Tabs defaultValue="calendar" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:w-[400px]">
              <TabsTrigger value="calendar">التقويم</TabsTrigger>
              <TabsTrigger value="ideas">الأفكار</TabsTrigger>
            </TabsList>
            <TabsContent value="calendar" className="mt-6">
              <CalendarTab posts={space.posts} />
            </TabsContent>
            <TabsContent value="ideas" className="mt-6">
              <IdeasTab ideas={space.ideas} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
