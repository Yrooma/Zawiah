
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LayoutGrid, ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';

export default function FeaturesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-secondary/50">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <LayoutGrid className="h-6 w-6 text-primary" />
            <span className="font-headline text-xl font-bold">زاوية</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <Link href="/features" className="transition-colors hover:text-primary font-bold text-primary">الميزات</Link>
          </nav>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
                <Link href="/login">تسجيل الدخول</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">
                ابدأ مجاناً <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {children}

      <footer className="w-full border-t bg-background">
        <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row">
            <p className="text-sm text-muted-foreground">© 2024 زاوية. جميع الحقوق محفوظة.</p>
            <div className="flex items-center gap-4">
                 <Link href="/privacy" className="text-sm transition-colors hover:text-primary">سياسة الخصوصية</Link>
                 <Link href="/terms" className="text-sm transition-colors hover:text-primary">شروط الخدمة</Link>
            </div>
        </div>
      </footer>
    </div>
  );
}
