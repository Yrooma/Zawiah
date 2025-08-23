
"use client";

import { useState, type ReactNode, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useToast } from "@/hooks/use-toast";

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialContent?: string;
  children?: ReactNode;
}

export function CreatePostDialog({ open, onOpenChange, initialContent, children }: CreatePostDialogProps) {
  const { toast } = useToast();
  const [content, setContent] = useState("");

  useEffect(() => {
    if (initialContent) {
      setContent(initialContent);
    } else {
      setContent("");
    }
  }, [initialContent, open]);

  const handleCreatePost = () => {
    toast({
      title: "تم إنشاء المنشور!",
      description: "تمت إضافة مسودة منشورك إلى التقويم.",
    });
    onOpenChange(false);
  };
  
  const handleOpenChange = (isOpen: boolean) => {
    onOpenChange(isOpen);
    if (!isOpen) {
        setContent("");
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {children}
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="font-headline">إنشاء منشور جديد</DialogTitle>
          <DialogDescription>
            املأ التفاصيل أدناه لإنشاء مسودة منشور جديدة.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              العنوان
            </Label>
            <Input
              id="title"
              placeholder="مثال: 'إطلاق مجموعة الربيع'"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="content" className="text-right pt-2">
              المحتوى
            </Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="اكتب محتوى منشورك هنا..."
              className="col-span-3 min-h-[120px]"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="platform" className="text-right">
              المنصة
            </Label>
            <Select>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="اختر منصة" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="instagram">انستغرام</SelectItem>
                    <SelectItem value="x">X (تويتر)</SelectItem>
                    <SelectItem value="facebook">فيسبوك</SelectItem>
                    <SelectItem value="linkedin">لينكد إن</SelectItem>
                    <SelectItem value="threads">ثريدز</SelectItem>
                </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleCreatePost}>
            إنشاء مسودة المنشور
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
