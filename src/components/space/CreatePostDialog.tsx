
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
import type { Platform, Post } from '@/lib/types';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSavePost: (postDetails: { title: string; content: string; platform: Platform; scheduledAt: Date }, id?: string) => Promise<void>;
  initialContent?: string;
  postToEdit?: Post;
  children?: ReactNode;
}

export function CreatePostDialog({ open, onOpenChange, onSavePost, initialContent, postToEdit, children }: CreatePostDialogProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [platform, setPlatform] = useState<Platform | undefined>(undefined);
  const [scheduledAt, setScheduledAt] = useState<Date | undefined>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  
  const isEditing = !!postToEdit;
  
  const resetForm = () => {
      setTitle("");
      setContent("");
      setPlatform(undefined);
      setScheduledAt(new Date());
  }

  useEffect(() => {
    if (open) {
      if (postToEdit) {
        setTitle(postToEdit.title);
        setContent(postToEdit.content);
        setPlatform(postToEdit.platform);
        setScheduledAt(postToEdit.scheduledAt as Date);
      } else if (initialContent) {
        setContent(initialContent);
        setTitle("");
        setPlatform(undefined);
        setScheduledAt(new Date());
      } else {
        resetForm();
      }
    }
  }, [postToEdit, initialContent, open]);

  const handleSave = async () => {
    if (!title.trim() || !content.trim() || !platform || !scheduledAt) {
        toast({
            variant: "destructive",
            title: "الحقول مطلوبة",
            description: "يرجى ملء جميع الحقول لحفظ المنشور.",
        });
        return;
    }
    
    if (!user) {
        toast({ variant: "destructive", title: "خطأ في المصادقة", description: "يجب أن تكون مسجلاً للدخول لحفظ منشور." });
        return;
    }

    setIsLoading(true);
    try {
      await onSavePost({ title, content, platform, scheduledAt }, postToEdit?.id);

      toast({
        title: isEditing ? "تم تحديث المنشور!" : "تم إنشاء المنشور!",
        description: isEditing ? "تم حفظ تغييراتك على المنشور." : "تمت إضافة مسودة منشورك إلى التقويم.",
      });
      onOpenChange(false);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "خطأ",
        description: "تعذر حفظ المنشور. يرجى المحاولة مرة أخرى.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
        resetForm();
    }
    onOpenChange(isOpen);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {children}
      <DialogContent className="sm:max-w-[525px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-headline">{isEditing ? 'تعديل المنشور' : 'إنشاء منشور جديد'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'عدّل تفاصيل المنشور أدناه.' : 'املأ التفاصيل أدناه لإنشاء مسودة منشور جديدة.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              العنوان
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="مثال: 'إطلاق مجموعة الربيع'"
              className="col-span-3"
              disabled={isLoading}
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
              disabled={isLoading}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="platform" className="text-right">
              المنصة
            </Label>
            <Select value={platform} onValueChange={(value: Platform) => setPlatform(value)} disabled={isLoading}>
                <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="اختر منصة" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="instagram">انستغرام</SelectItem>
                    <SelectItem value="x">إكس (تويتر)</SelectItem>
                    <SelectItem value="facebook">فيسبوك</SelectItem>
                    <SelectItem value="linkedin">لينكدإن</SelectItem>
                    <SelectItem value="threads">ثريدز</SelectItem>
                    <SelectItem value="tiktok">تيك توك</SelectItem>
                    <SelectItem value="snapchat">سناب شات</SelectItem>
                    <SelectItem value="email">بريد إلكتروني</SelectItem>
                </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
             <Label htmlFor="date" className="text-right">
              تاريخ النشر
            </Label>
             <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "col-span-3 justify-start text-left font-normal",
                    !scheduledAt && "text-muted-foreground"
                  )}
                  disabled={isLoading}
                >
                  <CalendarIcon className="ms-2 h-4 w-4" />
                  {scheduledAt ? format(scheduledAt, 'PPP') : <span>اختر تاريخًا</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={scheduledAt}
                  onSelect={setScheduledAt}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>إلغاء</Button>
          <Button type="submit" onClick={handleSave} disabled={isLoading}>
             {isLoading && <Loader2 className="animate-spin" />}
            {isLoading ? 'جارٍ الحفظ...' : (isEditing ? 'حفظ التغييرات' : 'إنشاء مسودة')}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
