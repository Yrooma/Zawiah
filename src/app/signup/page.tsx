
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, LayoutGrid } from 'lucide-react';
import { joinSpaceWithToken } from '@/lib/services';
import { FirebaseError } from 'firebase/app';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteToken, setInviteToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const newUser = await signUp(email, password, name);
      
      if (inviteToken.trim()) {
        try {
          await joinSpaceWithToken(newUser.uid, inviteToken.trim());
          toast({
            title: "تم إنشاء الحساب والانضمام إلى مساحة العمل!",
            description: "لقد تم إضافتك بنجاح إلى مساحة العمل.",
          });
        } catch (joinError: any) {
           toast({
            title: "تم إنشاء الحساب ولكن فشل الانضمام",
            description: joinError.message || "لم يتم العثور على رمز الدعوة أو أنه غير صالح.",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "تم إنشاء الحساب!",
          description: "يمكنك الآن إنشاء مساحات العمل الخاصة بك.",
        });
      }

      router.push('/dashboard');

    } catch (error: any) {
       if (error instanceof FirebaseError && error.code === 'auth/weak-password') {
         toast({
            variant: "destructive",
            title: "كلمة المرور ضعيفة",
            description: "يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.",
          });
       } else if (error instanceof FirebaseError && error.code === 'auth/email-already-in-use') {
         toast({
            variant: "destructive",
            title: "البريد الإلكتروني مستخدم بالفعل",
            description: "هذا البريد الإلكتروني مسجل بالفعل. يرجى تسجيل الدخول أو استخدام بريد إلكتروني آخر.",
          });
       }
       else {
        toast({
            variant: "destructive",
            title: "فشل إنشاء الحساب",
            description: "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.",
        });
       }
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-secondary">
      <Card className="w-full max-w-sm mx-auto">
        <CardHeader className="text-center">
          <LayoutGrid className="h-8 w-8 text-primary mx-auto mb-2" />
          <CardTitle className="text-2xl font-headline">إنشاء حساب</CardTitle>
          <CardDescription>أدخل التفاصيل الخاصة بك للبدء.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignup}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="name">الاسم الكامل</Label>
                <Input 
                  id="name" 
                  required 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">البريد الإلكتروني</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">كلمة المرور</Label>
                <Input 
                  id="password" 
                  type="password" 
                  required 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  minLength={6}
                />
                <p className="text-xs text-muted-foreground">يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.</p>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="invite-token">رمز الدعوة (اختياري)</Label>
                <Input
                  id="invite-token"
                  placeholder="أدخل الرمز للانضمام إلى فريق"
                  value={inviteToken}
                  onChange={(e) => setInviteToken(e.target.value)}
                  disabled={isLoading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? <Loader2 className="animate-spin" /> : 'إنشاء حساب'}
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            هل لديك حساب بالفعل؟{' '}
            <Link href="/login" className="underline">
              تسجيل الدخول
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
