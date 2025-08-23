
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LayoutGrid, ArrowLeft } from 'lucide-react';
import Image from 'next/image';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-secondary/50">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <LayoutGrid className="h-6 w-6 text-primary" />
            <span className="font-headline text-xl font-bold">زاوية</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <Link href="#features" className="transition-colors hover:text-primary">الميزات</Link>
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

      <main className="flex-1">
        <section className="container mx-auto flex flex-col items-center justify-center space-y-6 px-4 py-16 text-center md:py-24 lg:py-32">
          <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl font-headline">
            خطط، تعاون، وانشر. كل ذلك في مكان واحد.
          </h1>
          <p className="max-w-[700px] text-muted-foreground md:text-xl">
            زاوية هي المنصة المثالية لمنشئي المحتوى والمسوقين لإدارة تقويم المحتوى الخاص بهم، وتبادل الأفكار، والتعاون بسلاسة مع فريقهم.
          </p>
          <Button size="lg" asChild>
            <Link href="/signup">
              ابدأ الآن مجاناً <ArrowLeft className="h-5 w-5" />
            </Link>
          </Button>
        </section>
        
        <section id="features" className="w-full bg-background py-12 md:py-24">
            <div className="container mx-auto px-4">
                 <h2 className="text-3xl font-bold text-center font-headline mb-12">كل ما تحتاجه لنجاح المحتوى الخاص بك</h2>
                 <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    <div className="flex flex-col items-center text-center p-4">
                        <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary"><LayoutGrid className="h-8 w-8" /></div>
                        <h3 className="text-xl font-bold font-headline mb-2">مساحات عمل تعاونية</h3>
                        <p className="text-muted-foreground">أنشئ مساحات منفصلة لكل عميل أو مشروع للحفاظ على تنظيم كل شيء.</p>
                    </div>
                     <div className="flex flex-col items-center text-center p-4">
                        <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary"><LayoutGrid className="h-8 w-8" /></div>
                        <h3 className="text-xl font-bold font-headline mb-2">تقويم محتوى مرئي</h3>
                        <p className="text-muted-foreground">خطط وجدول منشوراتك على وسائل التواصل الاجتماعي بتقويم سهل الاستخدام.</p>
                    </div>
                     <div className="flex flex-col items-center text-center p-4">
                        <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary"><LayoutGrid className="h-8 w-8" /></div>
                        <h3 className="text-xl font-bold font-headline mb-2">بنك الأفكار</h3>
                        <p className="text-muted-foreground">اجمع الأفكار وتبادلها مع فريقك، وحوّلها إلى منشورات بنقرة واحدة.</p>
                    </div>
                 </div>
            </div>
        </section>

        <section className="container mx-auto px-4 py-16 text-center">
             <div className="relative aspect-video mx-auto max-w-5xl rounded-2xl border-8 border-foreground/80 shadow-2xl overflow-hidden">
                <Image src="https://placehold.co/1280x720.png" alt="لقطة شاشة لتطبيق زاوية" layout="fill" objectFit="cover" data-ai-hint="dashboard application" />
             </div>
        </section>

      </main>

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
