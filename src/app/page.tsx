import Link from 'next/link';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { SpaceCard } from '@/components/dashboard/SpaceCard';
import { CreateSpaceDialog } from '@/components/dashboard/CreateSpaceDialog';
import { spaces } from '@/lib/mock-data';

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader />
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-headline font-bold text-foreground">
              مساحات العمل الخاصة بك
            </h1>
            <CreateSpaceDialog>
              <Button>
                <PlusCircle />
                إنشاء مساحة جديدة
              </Button>
            </CreateSpaceDialog>
          </div>
          {spaces.length > 0 ? (
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
              <h2 className="text-xl font-semibold text-muted-foreground">لا توجد مساحات عمل حتى الآن.</h2>
              <p className="text-muted-foreground mt-2">ابدأ بإنشاء مساحة التعاون الأولى لك.</p>
              <CreateSpaceDialog>
                <Button className="mt-4">
                  <PlusCircle />
                  إنشاء مساحة العمل الأولى
                </Button>
              </CreateSpaceDialog>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
