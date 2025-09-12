"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { ToneOfVoice } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import React from "react";

const toneSchema = z.object({
  description: z.string().min(1, "وصف الشخصية مطلوب"),
  dos: z.array(z.string()),
  donts: z.array(z.string()),
});

interface EditToneDialogProps {
  tone: ToneOfVoice;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (tone: ToneOfVoice) => void;
}

export function EditToneDialog({ tone, open, onOpenChange, onSave }: EditToneDialogProps) {
  const [doInput, setDoInput] = React.useState("");
  const [dontInput, setDontInput] = React.useState("");

  const form = useForm<z.infer<typeof toneSchema>>({
    resolver: zodResolver(toneSchema),
    defaultValues: tone,
  });

  const onSubmit = (values: z.infer<typeof toneSchema>) => {
    onSave(values);
    onOpenChange(false);
  };

  const handleAddDo = () => {
    if (doInput.trim()) {
      form.setValue("dos", [...form.getValues("dos"), doInput.trim()]);
      setDoInput("");
    }
  };
  
  const handleRemoveDo = (index: number) => {
    form.setValue("dos", form.getValues("dos").filter((_, i) => i !== index));
  };

  const handleAddDont = () => {
    if (dontInput.trim()) {
      form.setValue("donts", [...form.getValues("donts"), dontInput.trim()]);
      setDontInput("");
    }
  };

  const handleRemoveDont = (index: number) => {
    form.setValue("donts", form.getValues("donts").filter((_, i) => i !== index));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>تعديل نبرة الصوت والشخصية</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>وصف شخصية العلامة التجارية</FormLabel>
                  <FormControl><Textarea className="min-h-[100px]" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <FormLabel>✅ كلمات نستخدمها</FormLabel>
                <div className="flex gap-2">
                  <Input value={doInput} onChange={e => setDoInput(e.target.value)} />
                  <Button type="button" onClick={handleAddDo}>إضافة</Button>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {form.watch("dos").map((word, i) => (
                    <Badge key={i} variant="secondary" className="flex items-center gap-1">
                      {word}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveDo(i)} />
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <FormLabel>❌ كلمات نتجنبها</FormLabel>
                 <div className="flex gap-2">
                  <Input value={dontInput} onChange={e => setDontInput(e.target.value)} />
                  <Button type="button" onClick={handleAddDont}>إضافة</Button>
                </div>
                <div className="flex flex-wrap gap-2 pt-2">
                  {form.watch("donts").map((word, i) => (
                    <Badge key={i} variant="destructive" className="flex items-center gap-1">
                      {word}
                      <X className="h-3 w-3 cursor-pointer" onClick={() => handleRemoveDont(i)} />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>إلغاء</Button>
              <Button type="submit">حفظ</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
