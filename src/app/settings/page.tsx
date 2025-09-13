
"use client";

import { useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { deleteUserAccount } from '@/lib/services';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Loader2, Trash2 } from 'lucide-react';
import { ThemeSwitcher } from '@/components/ui/ThemeSwitcher';

export default function SettingsPage() {
    const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [confirmationText, setConfirmationText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const { user } = useAuth();
    const { toast } = useToast();
    const router = useRouter();

    const handleDeleteAccount = async () => {
        if (!user || confirmationText !== user.email) {
            toast({
                variant: 'destructive',
                title: 'خطأ',
                description: 'النص المدخل لا يطابق بريدك الإلكتروني.',
            });
            return;
        }
        setIsDeleting(true);
        try {
            await deleteUserAccount();
            toast({
                title: 'تم حذف الحساب',
                description: 'تم حذف حسابك بنجاح.',
            });
            router.push('/');
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: 'فشل حذف الحساب',
                description: 'حدث خطأ أثناء حذف حسابك. قد تحتاج إلى تسجيل الخروج وإعادة الدخول.',
            });
            setIsDeleting(false);
        }
    };
    
    return (
        <main  dir="rtl" className="flex-1 p-4 md:p-8 max-w-3xl mx-auto">
            <h1 className="text-3xl font-headline font-bold text-foreground mb-6 text-start">
                الإعدادات
            </h1>

            <Card>
                <CardHeader>
                    <CardTitle>المظهر</CardTitle>
                    <CardDescription>قم بتخصيص مظهر التطبيق.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                           <span>الوضع الداكن</span>
                        </div>
                        <ThemeSwitcher />
                    </div>
                </CardContent>
            </Card>

            <Card className="mt-8 border-destructive">
                <CardHeader>
                    <CardTitle className="text-destructive">منطقة الخطر</CardTitle>
                    <CardDescription>
                        هذه الإجراءات لا يمكن التراجع عنها. يرجى التأكد قبل المتابعة.
                    </CardDescription>
                </CardHeader>
                <CardFooter className="flex justify-between items-center">
                    <p className="font-medium">حذف حسابك نهائياً.</p>
                    <AlertDialog open={isDeleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">
                                <Trash2 />
                                حذف الحساب
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>هل أنت متأكد تمامًا؟</AlertDialogTitle>
                                <AlertDialogDescription>
                                    سيؤدي هذا الإجراء إلى حذف حسابك وجميع بياناتك المرتبطة به بشكل دائم، بما في ذلك مساحات العمل والمنشورات والأفكار. لا يمكن التراجع عن هذا الإجراء.
                                    <br/><br/>
                                    للتأكيد، يرجى كتابة بريدك الإلكتروني: <strong>{user?.email}</strong>
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <Input
                                type="email"
                                placeholder="أدخل بريدك الإلكتروني للتأكيد"
                                value={confirmationText}
                                onChange={(e) => setConfirmationText(e.target.value)}
                                disabled={isDeleting}
                            />
                            <AlertDialogFooter>
                                <AlertDialogCancel disabled={isDeleting}>إلغاء</AlertDialogCancel>
                                <AlertDialogAction
                                    onClick={handleDeleteAccount}
                                    disabled={confirmationText !== user?.email || isDeleting}
                                    className="bg-destructive hover:bg-destructive/90"
                                >
                                    {isDeleting && <Loader2 className="animate-spin" />}
                                    أنا أفهم العواقب، احذف حسابي
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardFooter>
            </Card>
        </main>
    );
}
