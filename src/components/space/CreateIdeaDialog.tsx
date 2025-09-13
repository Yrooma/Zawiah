
"use client";

import { useState, type ReactNode } from 'react';
import type { ContentPillar, Idea, ContentType } from '@/lib/types';
import { contentTypes } from '@/lib/data';
import { Button } from "@/components/ui/button";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose, DialogTrigger } from "@/components/ui/dialog";
import TextareaAutosize from 'react-textarea-autosize';
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Expand, X } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { ScrollArea } from '../ui/scroll-area';

interface CreateIdeaDialogProps {
  pillars: ContentPillar[];
  onAddIdea: (ideaData: Omit<Idea, 'id' | 'createdBy' | 'createdAt'>) => Promise<void>;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: ReactNode;
}

export function CreateIdeaDialog({ children, pillars, onAddIdea, open: controlledOpen, onOpenChange: controlledOnOpenChange }: CreateIdeaDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [ideaContent, setIdeaContent] = useState("");
  const [selectedPillarId, setSelectedPillarId] = useState<string | undefined>(undefined);
  const [selectedContentType, setSelectedContentType] = useState<ContentType | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const [isFocusMode, setFocusMode] = useState(false);
  const [focusContent, setFocusContent] = useState("");
  const { toast } = useToast();
  const { user } = useAuth();
  
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange !== undefined ? controlledOnOpenChange : setInternalOpen;

  const openFocusMode = () => {
    setFocusContent(ideaContent);
    setFocusMode(true);
  };

  const handleSaveFocus = () => {
    setIdeaContent(focusContent);
    setFocusMode(false);
  };

  const handleCreateIdea = async () => {
    if (ideaContent.trim() && selectedContentType && user) {
      setIsLoading(true);
      const selectedPillar = pillars.find(p => p.id === selectedPillarId);
      const ideaData: Omit<Idea, 'id' | 'createdBy' | 'createdAt'> = {
        content: ideaContent,
        pillar: selectedPillar ? { id: selectedPillar.id, name: selectedPillar.name, color: selectedPillar.color } : undefined,
        contentType: selectedContentType,
      };

      try {
        await onAddIdea(ideaData);
        toast({
          title: "تمت إضافة الفكرة!",
          description: `تمت إضافة فكرتك بنجاح.`,
        });
        setIdeaContent("");
        setSelectedPillarId(undefined);
        setSelectedContentType(undefined);
        setOpen(false);
      } catch (error) {
        console.error("Failed to add idea:", error);
        toast({
          variant: "destructive",
          title: "خطأ",
          description: "تعذرت إضافة الفكرة الجديدة. يرجى المحاولة مرة أخرى."
        });
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const DialogTriggerComponent = children ? <DialogTrigger asChild>{children}</DialogTrigger> : null;

  return (
    <ResponsiveDialog open={open} onOpenChange={setOpen}>
      {DialogTriggerComponent}
      <ResponsiveDialogContent className="sm:max-w-[425px] p-0">
        <ResponsiveDialogHeader className="flex flex-row items-center justify-between border-b p-4 flex-shrink-0">
          <ResponsiveDialogTitle className="font-headline text-start">فكرة جديدة</ResponsiveDialogTitle>
          <Button type="submit" onClick={handleCreateIdea} disabled={!ideaContent.trim() || !selectedContentType || isLoading} size="sm">
            {isLoading && <Loader2 className="animate-spin" />}
            {isLoading ? 'جارٍ الحفظ...' : 'حفظ الفكرة'}
          </Button>
        </ResponsiveDialogHeader>
        <div className="grid gap-4 p-4 overflow-y-auto flex-grow">
          <div className="grid w-full gap-1.5">
            <div className="flex items-center justify-between">
                <Label htmlFor="idea-content">فكرتك</Label>
                <Button variant="ghost" size="icon" className="h-6 w-6" onClick={openFocusMode}>
                    <Expand className="h-4 w-4" />
                </Button>
            </div>
            <TextareaAutosize
              id="idea-content"
              value={ideaContent}
              onChange={(e) => setIdeaContent(e.target.value)}
              placeholder="مثال: 'إجراء مسابقة على انستغرام الأسبوع المقبل...'"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 min-h-[100px] resize-none"
              minRows={4}
              maxRows={10}
              disabled={isLoading}
            />
          </div>
          <div className="grid w-full gap-1.5">
            <Label htmlFor="idea-content-type">نوع المحتوى</Label>
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
          {pillars && pillars.length > 0 && (
            <div className="grid w-full gap-1.5">
              <Label htmlFor="idea-pillar">ربط الفكرة بمحور محتوى (اختياري)</Label>
              <Select value={selectedPillarId} onValueChange={setSelectedPillarId}>
                <SelectTrigger id="idea-pillar">
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
        </div>
      </ResponsiveDialogContent>
      <Dialog open={isFocusMode} onOpenChange={setFocusMode}>
        <DialogContent className="w-full h-full max-w-full sm:max-w-full sm:h-full flex flex-col p-0">
            <DialogHeader className="flex flex-row items-center justify-between flex-shrink-0 border-b p-4">
                <DialogTitle>وضع الكتابة المركزة</DialogTitle>
                <div className="flex items-center gap-2">
                    <Button onClick={handleSaveFocus}>تم</Button>
                    <DialogClose asChild>
                        <Button variant="ghost">إلغاء</Button>
                    </DialogClose>
                </div>
            </DialogHeader>
            <div className="flex-grow p-4 overflow-hidden">
                <TextareaAutosize
                    value={focusContent}
                    onChange={(e) => setFocusContent(e.target.value)}
                    placeholder="اكتب فكرتك هنا..."
                    className="w-full h-full rounded-md border-none bg-transparent px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 resize-none overflow-y-auto"
                    autoFocus
                />
            </div>
        </DialogContent>
      </Dialog>
    </ResponsiveDialog>
  );
}
