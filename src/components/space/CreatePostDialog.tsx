
"use client";

import { useState, type ReactNode, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useToast } from "@/hooks/use-toast";
import type { Platform, Post, Idea, ContentPillar, Compass, ContentType, PostType } from '@/lib/types';
import { contentTypes, platformPostTypes } from '@/lib/data';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CalendarIcon, Loader2, Users, Mic2, Info } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from '../ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { useIsMobile } from '@/hooks/use-mobile';

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSavePost: (postDetails: { 
    title: string; 
    content: string; 
    platform: Platform; 
    scheduledAt: Date; 
    pillar?: Idea['pillar']; 
    contentType: ContentType,
    postType?: string;
    fields?: { [key: string]: any };
  }, id?: string) => Promise<void>;
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
  const isMobile = useIsMobile();
  
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [platform, setPlatform] = useState<Platform | undefined>(undefined);
  const [selectedPillarId, setSelectedPillarId] = useState<string | undefined>(undefined);
  const [selectedContentType, setSelectedContentType] = useState<ContentType | undefined>(initialContentType);
  const [scheduledAt, setScheduledAt] = useState<Date | undefined>(new Date());
  const [selectedPostTypeId, setSelectedPostTypeId] = useState<string | undefined>();
  const [postFields, setPostFields] = useState<{ [key: string]: any }>({});
  const [isLoading, setIsLoading] = useState(false);
  
  const isEditing = !!postToEdit;
  
  const resetForm = () => {
      setTitle("");
      setContent("");
      setPlatform(undefined);
      setScheduledAt(new Date());
      setSelectedPillarId(undefined);
      setSelectedContentType(undefined);
      setSelectedPostTypeId(undefined);
      setPostFields({});
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
        setSelectedPostTypeId(postToEdit.postType);
        setPostFields(postToEdit.fields || {});
      } else {
        setContent(initialContent || "");
        setSelectedPillarId(initialPillar?.id);
        setSelectedContentType(initialContentType);
        setTitle("");
        setPlatform(undefined);
        setScheduledAt(new Date());
        setSelectedPostTypeId(undefined);
        setPostFields({});
      }
    }
  }, [postToEdit, initialContent, initialPillar, initialContentType, open]);

  useEffect(() => {
    // Reset post type and fields when platform changes
    setSelectedPostTypeId(undefined);
    setPostFields({});
  }, [platform]);

  const handleFieldChange = (fieldId: string, value: any) => {
    setPostFields(prev => ({ ...prev, [fieldId]: value }));
  };

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
      postType: selectedPostTypeId,
      fields: postFields,
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
    <ResponsiveDialog open={open} onOpenChange={handleOpenChange}>
      {children}
      <ResponsiveDialogContent className="sm:max-w-[800px] p-0">
        <ResponsiveDialogHeader className="flex flex-row items-center justify-between border-b p-4">
          <ResponsiveDialogTitle className="font-headline text-start">{isEditing ? 'تعديل المنشور' : 'منشور جديد'}</ResponsiveDialogTitle>
          <Button type="submit" onClick={handleSave} disabled={isLoading}>
             {isLoading && <Loader2 className="animate-spin" />}
            {isLoading ? 'جارٍ الحفظ...' : (isEditing ? 'حفظ التغييرات' : 'إنشاء مسودة')}
          </Button>
        </ResponsiveDialogHeader>
        <div className={cn("grid max-h-[80vh]", isMobile ? "grid-cols-1" : "grid-cols-3 gap-8")}>
          <div className="col-span-2 h-full flex flex-col p-4">
            <div className="grid gap-4 text-start flex-grow overflow-y-auto pe-4">
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
          {platform && (
            <>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="post-type" className="text-start">
                  نوع المنشور
                </Label>
                <Select value={selectedPostTypeId} onValueChange={(value: string) => setSelectedPostTypeId(value)} disabled={isLoading}>
                    <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="اختر نوع المنشور..." />
                    </SelectTrigger>
                    <SelectContent>
                        {platformPostTypes[platform]?.map(type => (
                            <SelectItem key={type.id} value={type.id}>{type.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
              </div>
              {selectedPostTypeId && platformPostTypes[platform]?.find(pt => pt.id === selectedPostTypeId)?.fields.map(field => (
                <div key={field.id} className="grid grid-cols-4 items-start gap-4">
                  <Label htmlFor={field.id} className="text-start pt-2">
                    {field.name}
                  </Label>
                  {field.type === 'textarea' ? (
                    <Textarea
                      id={field.id}
                      value={postFields[field.id] || ''}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      className="col-span-3 min-h-[80px]"
                      disabled={isLoading}
                    />
                  ) : (
                    <Input
                      id={field.id}
                      value={postFields[field.id] || ''}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      placeholder={field.placeholder}
                      className="col-span-3"
                      disabled={isLoading}
                    />
                  )}
                </div>
              ))}
            </>
          )}
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
          </div>
          {!isMobile && (
            <div className="col-span-1 bg-muted/50 rounded-lg p-4 space-y-6 overflow-y-auto">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold font-headline">📝 المساعد الاستراتيجي</h3>
                {platform && compass?.channelStrategies && (
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Info className="h-4 w-4" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>إرشادات النشر لـ {platform}</SheetTitle>
                      </SheetHeader>
                      <div className="py-4">
                        <h4 className="font-semibold mb-2">قائمة مهام النشر</h4>
                        <div className="space-y-2">
                          {compass.channelStrategies.find(s => s.platform === platform)?.publishingChecklist.map(item => (
                            <div key={item.id} className="flex items-center space-x-2">
                              <Checkbox id={item.id} />
                              <label htmlFor={item.id} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                {item.task}
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                )}
              </div>
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
          )}
        </div>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
