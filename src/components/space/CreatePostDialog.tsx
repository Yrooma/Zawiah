
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useToast } from "@/hooks/use-toast";
import type { Platform, Post, Idea, ContentPillar, Compass, ContentType } from '@/lib/types';
import { contentTypes } from '@/lib/data';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CalendarIcon, Loader2, Users, Mic2 } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSavePost: (postDetails: { title: string; content: string; platform: Platform; scheduledAt: Date; pillar?: Idea['pillar']; contentType: ContentType }, id?: string) => Promise<void>;
  spaceId: string;
  initialContent?: string;
  initialPillar?: Idea['pillar'];
  initialContentType?: ContentType;
  pillars: ContentPillar[];
  compass?: Compass;
  postToEdit?: Post;
  children?: ReactNode;
}

export function CreatePostDialog({ open, onOpenChange, onSavePost, initialContent, initialPillar, initialContentType, pillars, compass, postToEdit, children }: CreatePostDialogProps) {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [platform, setPlatform] = useState<Platform | undefined>(undefined);
  const [selectedPillarId, setSelectedPillarId] = useState<string | undefined>(undefined);
  const [selectedContentType, setSelectedContentType] = useState<ContentType | undefined>(initialContentType);
  const [scheduledAt, setScheduledAt] = useState<Date | undefined>(new Date());
  const [isLoading, setIsLoading] = useState(false);
  
  const isEditing = !!postToEdit;
  
  const resetForm = () => {
      setTitle("");
      setContent("");
      setPlatform(undefined);
      setScheduledAt(new Date());
      setSelectedPillarId(undefined);
      setSelectedContentType(undefined);
  }

  useEffect(() => {
    if (open) {
      if (postToEdit) {
        setTitle(postToEdit.title);
        setContent(postToEdit.content);
        setPlatform(postToEdit.platform);
        setScheduledAt(postToEdit.scheduledAt as Date);
        setSelectedPillarId(postToEdit.pillar?.id);
        setSelectedContentType(postToEdit.contentType);
      } else {
        setContent(initialContent || "");
        setSelectedPillarId(initialPillar?.id);
        setSelectedContentType(initialContentType);
        setTitle("");
        setPlatform(undefined);
        setScheduledAt(new Date());
      }
    }
  }, [postToEdit, initialContent, initialPillar, initialContentType, open]);

  const handleSave = async () => {
    if (!title.trim() || !content.trim() || !platform || !scheduledAt || !selectedContentType) {
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
    const selectedPillar = pillars.find(p => p.id === selectedPillarId);
    const postDetails = {
      title,
      content,
      platform,
      scheduledAt,
      pillar: selectedPillar ? { id: selectedPillar.id, name: selectedPillar.name, color: selectedPillar.color } : undefined,
      contentType: selectedContentType,
    };

    try {
      await onSavePost(postDetails, postToEdit?.id);

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
      <DialogContent className="sm:max-w-[800px] grid grid-cols-3 gap-8 max-h-[90vh]">
        <div className="col-span-2 h-full flex flex-col">
          <DialogHeader className="text-start">
            <DialogTitle className="font-headline">{isEditing ? 'تعديل المنشور' : 'إنشاء منشور جديد'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'عدّل تفاصيل المنشور أدناه.' : 'املأ التفاصيل أدناه لإنشاء مسودة منشور جديدة.'}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 text-start flex-grow overflow-y-auto pe-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-start">
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
            <Label htmlFor="content" className="text-start pt-2">
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
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="content-type" className="text-start pt-2">
              نوع المحتوى
            </Label>
            <div className="col-span-3">
              <ToggleGroup 
                type="single" 
                value={selectedContentType}
                onValueChange={(value: ContentType) => setSelectedContentType(value)}
                className="grid grid-cols-5 gap-2"
                aria-label="Content type"
              >
                {contentTypes.map((type) => (
                  <ToggleGroupItem key={type.value} value={type.value} aria-label={type.label} className="flex flex-col h-auto p-2 gap-1">
                    <span className="text-2xl">{type.icon}</span>
                    <span className="text-xs">{type.label}</span>
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="platform" className="text-start">
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
           {pillars && pillars.length > 0 && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="post-pillar" className="text-start">
                محور المحتوى
              </Label>
              <Select value={selectedPillarId} onValueChange={setSelectedPillarId} disabled={isLoading}>
                  <SelectTrigger className="col-span-3">
                      <SelectValue placeholder="اختر محور محتوى..." />
                  </SelectTrigger>
                  <SelectContent>
                      {pillars.map(pillar => (
                          <SelectItem key={pillar.id} value={pillar.id}>
                              <div className="flex items-center gap-2">
                                  <span className="h-2 w-2 rounded-full" style={{ backgroundColor: pillar.color }} />
                                  {pillar.name}
                              </div>
                          </SelectItem>
                      ))}
                  </SelectContent>
              </Select>
            </div>
          )}
          <div className="grid grid-cols-4 items-center gap-4">
             <Label htmlFor="date" className="text-start">
              تاريخ النشر
            </Label>
             <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "col-span-3 justify-start text-start font-normal",
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
        </div>
        <div className="col-span-1 bg-muted/50 rounded-lg p-4 space-y-6 overflow-y-auto">
            <h3 className="text-lg font-semibold font-headline">📝 تذكير استراتيجي</h3>
            {compass?.personas && compass.personas.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <h4 className="font-semibold">الجمهور المستهدف</h4>
                </div>
                <ul className="list-disc list-inside text-sm">
                  {compass.personas.map(p => <li key={p.id}>{p.name}</li>)}
                </ul>
              </div>
            )}
             {compass?.tone && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mic2 className="h-4 w-4" />
                  <h4 className="font-semibold">نبرة الصوت</h4>
                </div>
                <p className="text-sm text-muted-foreground p-2 border-s-2">{compass.tone.description}</p>
                {compass.tone.dos.length > 0 && (
                  <div>
                    <h5 className="font-semibold text-sm mb-1">✅ نستخدم:</h5>
                    <p className="text-sm text-muted-foreground">{compass.tone.dos.join('، ')}</p>
                  </div>
                )}
                 {compass.tone.donts.length > 0 && (
                  <div>
                    <h5 className="font-semibold text-sm mb-1">❌ نتجنب:</h5>
                    <p className="text-sm text-muted-foreground">{compass.tone.donts.join('، ')}</p>
                  </div>
                )}
              </div>
            )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
