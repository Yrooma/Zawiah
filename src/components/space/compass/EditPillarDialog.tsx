"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { ContentPillar } from "@/lib/types";
import { Button } from "@/components/ui/button";
import {
  ResponsiveDialog,
  ResponsiveDialogContent,
  ResponsiveDialogDescription,
  ResponsiveDialogHeader,
  ResponsiveDialogTitle,
} from "@/components/ui/responsive-dialog";
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

const pillarSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "اسم المحور مطلوب"),
  description: z.string().min(1, "الوصف مطلوب"),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "يجب أن يكون اللون صالحاً (hex)"),
});

interface EditPillarDialogProps {
  pillar?: ContentPillar;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (pillar: ContentPillar) => void;
}

const defaultColors = ["#8B5CF6", "#EC4899", "#F59E0B", "#10B981", "#3B82F6", "#EF4444"];

export function EditPillarDialog({ pillar, open, onOpenChange, onSave }: EditPillarDialogProps) {
  const form = useForm<z.infer<typeof pillarSchema>>({
    resolver: zodResolver(pillarSchema),
    defaultValues: pillar || {
      id: crypto.randomUUID(),
      name: "",
      description: "",
      color: defaultColors[0],
    },
  });

  const onSubmit = (values: z.infer<typeof pillarSchema>) => {
    onSave(values);
    onOpenChange(false);
  };

  return (
    <ResponsiveDialog open={open} onOpenChange={onOpenChange}>
      <ResponsiveDialogContent className="sm:max-w-[425px] p-0">
        <ResponsiveDialogHeader className="p-4 border-b flex-shrink-0">
          <ResponsiveDialogTitle>{pillar ? "تعديل محور" : "إضافة محور جديد"}</ResponsiveDialogTitle>
        </ResponsiveDialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 p-4 overflow-y-auto">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم المحور</FormLabel>
                  <FormControl><Input placeholder="مثال: محتوى تعليمي" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>وصف بسيط</FormLabel>
                  <FormControl><Textarea placeholder="مثال: منشورات تشرح كيفية استخدام المنتج." {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اختر لوناً مميزاً</FormLabel>
                  <FormControl>
                    <div className="flex items-center gap-2">
                      <Input type="color" className="p-1 h-10 w-14" {...field} />
                      <div className="flex flex-wrap gap-2">
                        {defaultColors.map(color => (
                          <Button
                            key={color}
                            type="button"
                            className="h-8 w-8 rounded-full"
                            style={{ backgroundColor: color }}
                            onClick={() => form.setValue("color", color)}
                          />
                        ))}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2 pt-4 p-4 border-t flex-shrink-0">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>إلغاء</Button>
              <Button type="submit">حفظ</Button>
            </div>
          </form>
        </Form>
      </ResponsiveDialogContent>
    </ResponsiveDialog>
  );
}
