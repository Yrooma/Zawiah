
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LayoutGrid } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-secondary/50">
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center gap-2">
            <LayoutGrid className="h-6 w-6 text-primary" />
            <span className="font-headline text-xl font-bold">زاوية</span>
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/login">تسجيل الدخول</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">
                ابدأ مجاناً
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl font-headline mb-8">
              سياسة الخصوصية
            </h1>
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>آخر تحديث: 24 يوليو 2024</p>
              <h2 className="text-2xl font-bold font-headline text-foreground pt-4">مقدمة</h2>
              <p>
                "زاوية" ("نحن"، "لنا"، أو "الخاص بنا") تدير تطبيق الويب ("الخدمة"). هذه الصفحة تبلغكم بسياساتنا المتعلقة بجمع واستخدام والكشف عن البيانات الشخصية عند استخدامكم لخدمتنا والخيارات التي لديكم بشأن تلك البيانات.
              </p>

              <h2 className="text-2xl font-bold font-headline text-foreground pt-4">جمع المعلومات واستخدامها</h2>
              <p>
                نقوم بجمع أنواع مختلفة من المعلومات لأغراض متنوعة لتوفير وتحسين خدمتنا لكم.
              </p>

              <h3 className="text-xl font-bold font-headline text-foreground pt-2">أنواع البيانات التي يتم جمعها</h3>
              <h4>البيانات الشخصية</h4>
              <p>
                أثناء استخدام خدمتنا، قد نطلب منكم تزويدنا ببعض المعلومات الشخصية التي يمكن استخدامها للاتصال بكم أو التعرف عليكم ("البيانات الشخصية"). قد تشمل هذه المعلومات، على سبيل المثال لا الحصر:
              </p>
              <ul className="list-disc ps-8 space-y-2">
                <li>عنوان البريد الإلكتروني</li>
                <li>الاسم الأول واسم العائلة</li>
                <li>ملفات تعريف الارتباط وبيانات الاستخدام</li>
              </ul>

              <h2 className="text-2xl font-bold font-headline text-foreground pt-4">استخدام البيانات</h2>
              <p>
                نستخدم البيانات التي نجمعها لأغراض مختلفة:
              </p>
              <ul className="list-disc ps-8 space-y-2">
                <li>لتوفير وصيانة خدمتنا</li>
                <li>لإعلامكم بالتغييرات التي تطرأ على خدمتنا</li>
                <li>للسماح لكم بالمشاركة في الميزات التفاعلية لخدمتنا عندما تختارون القيام بذلك</li>
                <li>لتوفير دعم العملاء</li>
                <li>لجمع تحليلات أو معلومات قيمة حتى نتمكن من تحسين خدمتنا</li>
                <li>لمراقبة استخدام خدمتنا</li>
                <li>للكشف عن المشكلات الفنية ومنعها ومعالجتها</li>
              </ul>
              
              <h2 className="text-2xl font-bold font-headline text-foreground pt-4">أمن البيانات</h2>
              <p>
                أمن بياناتكم مهم لنا، ولكن تذكروا أنه لا توجد وسيلة نقل عبر الإنترنت أو طريقة تخزين إلكترونية آمنة 100%. بينما نسعى جاهدين لاستخدام وسائل مقبولة تجاريًا لحماية بياناتكم الشخصية، لا يمكننا ضمان أمنها المطلق.
              </p>

              <h2 className="text-2xl font-bold font-headline text-foreground pt-4">التغييرات على سياسة الخصوصية هذه</h2>
              <p>
                قد نقوم بتحديث سياسة الخصوصية الخاصة بنا من وقت لآخر. سنبلغكم بأي تغييرات عن طريق نشر سياسة الخصوصية الجديدة على هذه الصفحة.
              </p>
            </div>
          </div>
        </div>
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
