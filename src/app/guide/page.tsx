
import { LifeBuoy } from "lucide-react";

export default function GuidePage() {
  return (
    <main className="flex-1 p-4 md:p-8 flex flex-col items-center justify-center text-center">
        <LifeBuoy className="h-16 w-16 text-primary mb-4" />
        <h1 className="text-3xl font-headline font-bold text-foreground mb-2">
            الدليل
        </h1>
        <p className="text-muted-foreground max-w-md">
            هذا القسم قيد الإنشاء. قريباً، ستجد هنا أدلة مفيدة وبرامج تعليمية لمساعدتك في تحقيق أقصى استفادة من زاوية.
        </p>
    </main>
  );
}
