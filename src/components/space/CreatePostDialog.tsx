
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
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { format } from 'date-fns';
import { arSA } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSavePost: (postDetails: { title: string; content: string; platform: Platform; scheduledAt: Date }, id?: string) => void;
  initialContent?: string;
  postToEdit?: Post;
  children?: ReactNode;
}

export function CreatePostDialog({ open, onOpenChange, onSavePost, initialContent, postToEdit, children }: CreatePostDialogProps) {
  const { toast } = useToast();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [platform, setPlatform] = useState<Platform | undefined>(undefined);
  const [scheduledAt, setScheduledAt] = useState<Date | undefined>(new Date());
  
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
        setScheduledAt(postToEdit.scheduledAt);
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

  const handleSave = () => {
    if (!title.trim() || !content.trim() || !platform || !scheduledAt) {
        toast({
            variant: "destructive",
            title: "الحقول مطلوبة",
            description: "الرجاء تعبئة جميع الحقول لحفظ المنشور.",
        });
        return;
    }
    
    onSavePost({ title, content, platform, scheduledAt }, postToEdit?.id);

    toast({
      title: isEditing ? "تم تحديث المنشور!" : "تم إنشاء المنشور!",
      description: isEditing ? "تم حفظ التغييرات على منشورك." : "تمت إضافة مسودة منشورك إلى التقويم.",
    });
    onOpenChange(false);
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
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="font-headline">{isEditing ? 'تعديل المنشور' : 'إنشاء منشور جديد'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'قم بتعديل تفاصيل المنشور أدناه.' : 'املأ التفاصيل أدناه لإنشاء مسودة منشور جديدة.'}
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
            <Select value={platform} onValueChange={(value: Platform) => setPlatform(value)}>
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
                >
                  <CalendarIcon className="ml-2 h-4 w-4" />
                  {scheduledAt ? format(scheduledAt, 'PPP', { locale: arSA }) : <span>اختر تاريخ</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={scheduledAt}
                  onSelect={setScheduledAt}
                  initialFocus
                  locale={arSA}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>
            {isEditing ? 'حفظ التغييرات' : 'إنشاء مسودة المنشور'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
