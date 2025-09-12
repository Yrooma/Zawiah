"use client";

import { useState, useEffect } from 'react';
import type { TargetMix } from '@/lib/types';
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { contentTypes } from '@/lib/data';
import { useToast } from '@/hooks/use-toast';

interface EditTargetMixDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targetMix?: TargetMix;
  onSave: (newMix: TargetMix) => void;
}

export function EditTargetMixDialog({ open, onOpenChange, targetMix, onSave }: EditTargetMixDialogProps) {
  const [mix, setMix] = useState<TargetMix>({
    educational: 20,
    entertainment: 20,
    inspirational: 20,
    interactive: 20,
    promotional: 20,
  });
  const { toast } = useToast();

  useEffect(() => {
    if (targetMix) {
      setMix(targetMix);
    }
  }, [targetMix]);

  const handleSliderChange = (value: number[], type: keyof TargetMix) => {
    setMix(prev => ({ ...prev, [type]: value[0] }));
  };

  const handleSave = () => {
    const total = Object.values(mix).reduce((sum, val) => sum + val, 0);
    if (total !== 100) {
      toast({
        variant: "destructive",
        title: "المجموع يجب أن يكون 100%",
        description: `المجموع الحالي هو ${total}%. يرجى تعديل القيم.`,
      });
      return;
    }
    onSave(mix);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="font-headline">تعديل المزيج المستهدف</DialogTitle>
          <DialogDescription>
            استخدم المنزلقات لتحديد النسبة المئوية لكل نوع محتوى. يجب أن يكون المجموع 100%.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-6">
          {contentTypes.map(type => (
            <div key={type.value} className="grid grid-cols-4 items-center gap-4">
              <Label className="col-span-1 flex items-center gap-2">
                {type.icon} {type.label}
              </Label>
              <Slider
                value={[mix[type.value]]}
                onValueChange={(value) => handleSliderChange(value, type.value)}
                max={100}
                step={5}
                className="col-span-2"
              />
              <span className="col-span-1 font-bold text-center">{mix[type.value]}%</span>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>إلغاء</Button>
          <Button onClick={handleSave}>حفظ التغييرات</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
