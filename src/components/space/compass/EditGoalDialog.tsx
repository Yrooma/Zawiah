"use client";

import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { Goal } from "@/lib/types";
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
import { PlusCircle, Trash2 } from "lucide-react";

const kpiSchema = z.object({
  id: z.string(),
  metric: z.string().min(1, "اسم المؤشر مطلوب"),
  target: z.string().min(1, "القيمة المستهدفة مطلوبة"),
});

const goalSchema = z.object({
  objective: z.string().min(1, "الهدف الاستراتيجي مطلوب"),
  kpis: z.array(kpiSchema),
});

interface EditGoalDialogProps {
  goal: Goal;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (updatedGoal: Goal) => void;
}

export function EditGoalDialog({ goal, open, onOpenChange, onSave }: EditGoalDialogProps) {
  const form = useForm<z.infer<typeof goalSchema>>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      objective: goal.objective || "",
      kpis: goal.kpis || [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "kpis",
  });

  const onSubmit = (values: z.infer<typeof goalSchema>) => {
    onSave(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>تعديل الأهداف الرئيسية</DialogTitle>
          <DialogDescription>
            حدد الهدف الاستراتيجي العام وأضف مؤشرات الأداء الرئيسية لتتبعه.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            <FormField
              control={form.control}
              name="objective"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الهدف الاستراتيجي العام</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="مثال: أن نصبح المرجع الأول في مجال التسويق الرقمي في المنطقة."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div>
              <FormLabel>مؤشرات الأداء الرئيسية (KPIs)</FormLabel>
              <div className="space-y-2 mt-2">
                {fields.map((field, index) => (
                  <div key={field.id} className="flex items-start gap-2">
                    <FormField
                      control={form.control}
                      name={`kpis.${index}.metric`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input placeholder="اسم المؤشر (مثال: نسبة التفاعل)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`kpis.${index}.target`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input placeholder="القيمة المستهدفة (مثال: 5%)" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="button" variant="ghost" size="icon" className="mt-1" onClick={() => remove(index)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => append({ id: crypto.randomUUID(), metric: "", target: "" })}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                إضافة مؤشر آخر
              </Button>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>إلغاء</Button>
              <Button type="submit">حفظ التغييرات</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
