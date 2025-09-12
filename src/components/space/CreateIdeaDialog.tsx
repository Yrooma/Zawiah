
"use client";

import { useState, type ReactNode } from 'react';
import type { ContentPillar, Idea, ContentType } from '@/lib/types';
import { contentTypes } from '@/lib/data';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

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
  const { toast } = useToast();
  const { user } = useAuth();
  
  const open = controlledOpen !== undefined ? controlledOpen : internalOpen;
  const setOpen = controlledOnOpenChange !== undefined ? controlledOnOpenChange : setInternalOpen;


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
    <Dialog open={open} onOpenChange={setOpen}>
      {DialogTriggerComponent}
      <DialogContent className="sm:max-w-[425px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-headline text-start">إضافة فكرة جديدة</DialogTitle>
          <DialogDescription className="text-start">
            اكتب فكرة المحتوى الخاصة بك. يمكن للفريق رؤيتها والبناء عليها.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="idea-content">فكرتك</Label>
            <Textarea
              id="idea-content"
              value={ideaContent}
              onChange={(e) => setIdeaContent(e.target.value)}
              placeholder="مثال: 'إجراء مسابقة على انستغرام الأسبوع المقبل...'"
              className="min-h-[100px]"
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
        <DialogFooter>
           <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>إلغاء</Button>
          <Button type="submit" onClick={handleCreateIdea} disabled={!ideaContent.trim() || !selectedContentType || isLoading}>
            {isLoading && <Loader2 className="animate-spin" />}
            {isLoading ? 'جارٍ الإضافة...' : 'إضافة فكرة'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
