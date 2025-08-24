
import { LayoutGrid } from 'lucide-react';

export default function FeaturesPage() {
  return (
    <main className="flex-1">
        <section className="w-full bg-background py-12 md:py-24 lg:py-32">
            <div className="container mx-auto px-4">
                 <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl font-headline">
                        الميزات
                    </h1>
                    <p className="max-w-[700px] mx-auto text-muted-foreground md:text-xl mt-4">
                        كل ما تحتاجه لنجاح المحتوى الخاص بك، منظم في منصة واحدة قوية.
                    </p>
                 </div>
                 <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    <div className="flex flex-col items-center text-center p-4 border rounded-lg shadow-sm hover:shadow-lg transition-shadow">
                        <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary"><LayoutGrid className="h-8 w-8" /></div>
                        <h3 className="text-xl font-bold font-headline mb-2">مساحات عمل تعاونية</h3>
                        <p className="text-muted-foreground">أنشئ مساحات منفصلة لكل عميل أو مشروع للحفاظ على تنظيم كل شيء، ودعوة فريقك للتعاون بسلاسة.</p>
                    </div>
                     <div className="flex flex-col items-center text-center p-4 border rounded-lg shadow-sm hover:shadow-lg transition-shadow">
                        <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary"><LayoutGrid className="h-8 w-8" /></div>
                        <h3 className="text-xl font-bold font-headline mb-2">تقويم محتوى مرئي</h3>
                        <p className="text-muted-foreground">خطط وجدول منشوراتك على وسائل التواصل الاجتماعي بتقويم سهل الاستخدام. قم بسحب وإفلات المنشورات وتغيير حالتها بسهولة.</p>
                    </div>
                     <div className="flex flex-col items-center text-center p-4 border rounded-lg shadow-sm hover:shadow-lg transition-shadow">
                        <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary"><LayoutGrid className="h-8 w-8" /></div>
                        <h3 className="text-xl font-bold font-headline mb-2">بنك الأفكار</h3>
                        <p className="text-muted-foreground">اجمع الأفكار وتبادلها مع فريقك، وحوّلها إلى منشورات قابلة للجدولة بنقرة واحدة. لا تدع فكرة رائعة تضيع مرة أخرى.</p>
                    </div>
                    <div className="flex flex-col items-center text-center p-4 border rounded-lg shadow-sm hover:shadow-lg transition-shadow">
                        <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary"><LayoutGrid className="h-8 w-8" /></div>
                        <h3 className="text-xl font-bold font-headline mb-2">إدارة المهام والحالات</h3>
                        <p className="text-muted-foreground">تتبع تقدم كل منشور من "مسودة" إلى "جاهز للنشر" ثم "تم النشر". تأكد من أن الجميع على نفس الصفحة.</p>
                    </div>
                    <div className="flex flex-col items-center text-center p-4 border rounded-lg shadow-sm hover:shadow-lg transition-shadow">
                        <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary"><LayoutGrid className="h-8 w-8" /></div>
                        <h3 className="text-xl font-bold font-headline mb-2">دعوات عبر البريد الإلكتروني</h3>
                        <p className="text-muted-foreground">قم بدعوة أعضاء الفريق بسهولة إلى مساحات العمل الخاصة بك عبر البريد الإلكتروني. إدارة الوصول والأذونات دون عناء.</p>
                    </div>
                    <div className="flex flex-col items-center text-center p-4 border rounded-lg shadow-sm hover:shadow-lg transition-shadow">
                        <div className="mb-4 rounded-full bg-primary/10 p-4 text-primary"><LayoutGrid className="h-8 w-8" /></div>
                        <h3 className="text-xl font-bold font-headline mb-2">ملفات تعريف شخصية</h3>
                        <p className="text-muted-foreground">يتمتع كل عضو في الفريق بملف تعريف شخصي خاص به، مما يجعل من السهل معرفة من هو المسؤول عن كل إجراء داخل التطبيق.</p>
                    </div>
                 </div>
            </div>
        </section>
    </main>
  );
}
