
"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { updateProfile, updateUserPassword } from '@/lib/services';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { FirebaseError } from 'firebase/app';

const profileFormSchema = z.object({
  name: z.string().min(2, { message: "يجب أن يكون الاسم حرفين على الأقل." }),
  avatarUrl: z.string().url({ message: "الرجاء إدخال رابط صالح." }).optional().or(z.literal('')),
});

const passwordFormSchema = z.object({
    currentPassword: z.string().min(1, { message: "كلمة المرور الحالية مطلوبة." }),
    newPassword: z.string().min(6, { message: "يجب أن تكون كلمة المرور الجديدة 6 أحرف على الأقل." }),
});

export default function ProfilePage() {
    const { user, loading, refreshUser } = useAuth();
    const { toast } = useToast();
    const [isEditing, setIsEditing] = useState(false);

    const profileForm = useForm<z.infer<typeof profileFormSchema>>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            name: user?.name || '',
            avatarUrl: user?.avatarUrl || '',
        },
    });

    const passwordForm = useForm<z.infer<typeof passwordFormSchema>>({
        resolver: zodResolver(passwordFormSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
        },
    });

    if (user && profileForm.getValues('name') !== user.name) {
        profileForm.reset({ name: user.name, avatarUrl: user.avatarUrl });
    }

    const onProfileSubmit = async (values: z.infer<typeof profileFormSchema>) => {
        if (!user) return;
        try {
            await updateProfile(user.uid, values);
            await refreshUser();
            toast({ title: "تم تحديث الملف الشخصي بنجاح!" });
            setIsEditing(false);
        } catch (error) {
            toast({ variant: "destructive", title: "خطأ", description: "فشل تحديث الملف الشخصي." });
        }
    };
    
    const onPasswordSubmit = async (values: z.infer<typeof passwordFormSchema>) => {
        try {
            await updateUserPassword(values.currentPassword, values.newPassword);
            toast({ title: "تم تحديث كلمة المرور بنجاح!" });
            passwordForm.reset();
        } catch (error) {
             if (error instanceof FirebaseError && error.code === 'auth/wrong-password') {
                passwordForm.setError("currentPassword", { type: "manual", message: "كلمة المرور الحالية غير صحيحة." });
            } else {
                toast({ variant: "destructive", title: "خطأ", description: "فشل تحديث كلمة المرور." });
            }
        }
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full pt-16">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }
    
    if (!user) return null;

    return (
        <main className="flex-1 p-4 md:p-8 max-w-3xl mx-auto">
            <h1 className="text-3xl font-headline font-bold text-foreground mb-6 text-start">
                الملف الشخصي
            </h1>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                         <div>
                            <CardTitle>تفاصيل الملف الشخصي</CardTitle>
                            <CardDescription>عرض وتعديل معلومات ملفك الشخصي.</CardDescription>
                         </div>
                         {!isEditing && <Button onClick={() => setIsEditing(true)}>تعديل</Button>}
                    </div>
                </CardHeader>
                <Form {...profileForm}>
                    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-6">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage src={profileForm.watch('avatarUrl') || user.avatarUrl} />
                                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold">{user.name}</h2>
                                    <p className="text-muted-foreground">{user.email}</p>
                                </div>
                            </div>
                            
                            {isEditing && (
                                <div className='space-y-4 pt-4'>
                                    <FormField
                                        control={profileForm.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>الاسم</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="اسمك الكامل" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={profileForm.control}
                                        name="avatarUrl"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>رابط الصورة الرمزية</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="https://example.com/avatar.png" {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>
                            )}
                        </CardContent>
                        {isEditing && (
                            <CardFooter className="justify-end gap-2">
                                <Button variant="ghost" onClick={() => { setIsEditing(false); profileForm.reset({name: user.name, avatarUrl: user.avatarUrl}); }}>إلغاء</Button>
                                <Button type="submit" disabled={profileForm.formState.isSubmitting}>
                                     {profileForm.formState.isSubmitting && <Loader2 className="animate-spin" />}
                                    حفظ التغييرات
                                </Button>
                            </CardFooter>
                        )}
                    </form>
                </Form>
            </Card>
            
            <Card className="mt-8">
                 <CardHeader>
                    <CardTitle>الأمان</CardTitle>
                    <CardDescription>إدارة إعدادات الأمان الخاصة بك.</CardDescription>
                </CardHeader>
                <Form {...passwordForm}>
                    <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
                        <CardContent className="space-y-4">
                             <FormField
                                control={passwordForm.control}
                                name="currentPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>كلمة المرور الحالية</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={passwordForm.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>كلمة المرور الجديدة</FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                        <CardFooter className="justify-end">
                            <Button type="submit" disabled={passwordForm.formState.isSubmitting}>
                                {passwordForm.formState.isSubmitting && <Loader2 className="animate-spin" />}
                                تغيير كلمة المرور
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </Card>
        </main>
    );
}
