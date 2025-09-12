"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import type { Persona } from "@/lib/types";
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

const personaSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "اسم الشخصية مطلوب"),
  age: z.coerce.number().min(1, "العمر مطلوب"),
  jobTitle: z.string().min(1, "الوظيفة مطلوبة"),
  goals: z.string().min(1, "الأهداف مطلوبة"),
  challenges: z.string().min(1, "التحديات مطلوبة"),
  preferredPlatforms: z.string().min(1, "المنصات المفضلة مطلوبة"),
  avatar: z.string().optional(),
});

interface EditPersonaDialogProps {
  persona?: Persona;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (persona: Persona) => void;
}

export function EditPersonaDialog({ persona, open, onOpenChange, onSave }: EditPersonaDialogProps) {
  const form = useForm<z.infer<typeof personaSchema>>({
    resolver: zodResolver(personaSchema),
    defaultValues: persona || {
      id: crypto.randomUUID(),
      name: "",
      age: 0,
      jobTitle: "",
      goals: "",
      challenges: "",
      preferredPlatforms: "",
      avatar: "",
    },
  });

  const onSubmit = (values: z.infer<typeof personaSchema>) => {
    onSave(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{persona ? "تعديل شخصية" : "إنشاء شخصية جديدة"}</DialogTitle>
          <DialogDescription>
            املأ البيانات لوصف شريحة من جمهورك المستهدف.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>الاسم</FormLabel>
                    <FormControl><Input placeholder="مثال: سارة" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>العمر</FormLabel>
                    <FormControl><Input type="number" placeholder="مثال: 28" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="jobTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>الوظيفة</FormLabel>
                  <FormControl><Input placeholder="مثال: مديرة تسويق" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="goals"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>أهدافها</FormLabel>
                  <FormControl><Textarea placeholder="ماذا تريد أن تحقق؟" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="challenges"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>تحدياتها</FormLabel>
                  <FormControl><Textarea placeholder="ما هي الصعوبات التي تواجهها؟" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="preferredPlatforms"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>المنصات المفضلة</FormLabel>
                  <FormControl><Input placeholder="مثال: انستقرام، لينكدإن" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
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
