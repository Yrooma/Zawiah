"use client";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Copy } from "lucide-react";

interface AiPromptSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prompt: string;
}

export function AiPromptSheet({ open, onOpenChange, prompt }: AiPromptSheetProps) {
  const { toast } = useToast();

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt);
    toast({
      title: "تم نسخ الأمر!",
      description: "يمكنك الآن لصق الأمر في نموذج الذكاء الاصطناعي المفضل لديك.",
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col">
        <SheetHeader className="flex-shrink-0">
          <SheetTitle>أمر AI جاهز للنسخ</SheetTitle>
        </SheetHeader>
        <div className="flex-grow overflow-y-auto">
          <Textarea
            value={prompt}
            readOnly
            className="w-full h-full resize-none border-0 focus:ring-0"
          />
        </div>
        <div className="flex-shrink-0 pt-4">
          <Button onClick={handleCopy} className="w-full">
            <Copy className="ms-2 h-4 w-4" />
            نسخ الأمر
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
