
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LayoutGrid } from 'lucide-react';

export default function TermsPage() {
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
              شروط الخدمة
            </h1>
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>آخر تحديث: 24 يوليو 2024</p>
              
              <h2 className="text-2xl font-bold font-headline text-foreground pt-4">1. الشروط</h2>
              <p>
                من خلال الوصول إلى تطبيق "زاوية"، فإنك توافق على الالتزام بشروط الخدمة هذه، وجميع القوانين واللوائح المعمول بها، وتوافق على أنك مسؤول عن الامتثال لأي قوانين محلية معمول بها. إذا كنت لا توافق على أي من هذه الشروط، فيُحظر عليك استخدام أو الوصول إلى هذا الموقع. المواد الواردة في هذا الموقع محمية بموجب قانون حقوق النشر والعلامات التجارية المعمول به.
              </p>

              <h2 className="text-2xl font-bold font-headline text-foreground pt-4">2. استخدام الترخيص</h2>
              <p>
                يُمنح الإذن بتنزيل نسخة واحدة مؤقتًا من المواد (المعلومات أو البرامج) على موقع "زاوية" للعرض الشخصي وغير التجاري المؤقت فقط. هذا هو منح ترخيص، وليس نقل ملكية، وبموجب هذا الترخيص لا يجوز لك:
              </p>
              <ul className="list-disc ps-8 space-y-2">
                <li>تعديل أو نسخ المواد؛</li>
                <li>استخدام المواد لأي غرض تجاري، أو لأي عرض عام (تجاري أو غير تجاري)؛</li>
                <li>محاولة فك أو عكس هندسة أي برنامج موجود على موقع "زاوية"؛</li>
                <li>إزالة أي حقوق نشر أو إشعارات ملكية أخرى من المواد؛ أو</li>
                <li>نقل المواد إلى شخص آخر أو "عكس" المواد على أي خادم آخر.</li>
              </ul>
              <p>
                سينتهي هذا الترخيص تلقائيًا إذا انتهكت أيًا من هذه القيود وقد يتم إنهاؤه بواسطة "زاوية" في أي وقت. عند إنهاء عرضك لهذه المواد أو عند إنهاء هذا الترخيص، يجب عليك تدمير أي مواد تم تنزيلها في حوزتك سواء في شكل إلكتروني أو مطبوع.
              </p>
              
              <h2 className="text-2xl font-bold font-headline text-foreground pt-4">3. إخلاء المسؤولية</h2>
              <p>
                يتم توفير المواد على موقع "زاوية" على أساس "كما هي". لا تقدم "زاوية" أي ضمانات، صريحة أو ضمنية، وبهذا تتنصل وتنفي جميع الضمانات الأخرى بما في ذلك، على سبيل المثال لا الحصر، الضمانات الضمنية أو شروط القابلية للتسويق، والملاءمة لغرض معين، أو عدم انتهاك الملكية الفكرية أو أي انتهاك آخر للحقوق.
              </p>
              
              <h2 className="text-2xl font-bold font-headline text-foreground pt-4">4. القيود</h2>
              <p>
                لا تتحمل "زاوية" أو مورديها بأي حال من الأحوال المسؤولية عن أي أضرار (بما في ذلك، على سبيل المثال لا الحصر، الأضرار الناجمة عن فقدان البيانات أو الربح، أو بسبب انقطاع الأعمال) الناشئة عن استخدام أو عدم القدرة على استخدام المواد على موقع "زاوية"، حتى لو تم إبلاغ "زاوية" أو ممثل معتمد من "زاوية" شفهيًا أو كتابيًا بإمكانية حدوث مثل هذا الضرر.
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
