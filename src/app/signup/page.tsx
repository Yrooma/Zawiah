
"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Loader2, LayoutGrid, CheckCircle2, XCircle } from 'lucide-react';
import { FirebaseError } from 'firebase/app';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const passwordRequirements = useMemo(() => {
    return [
      { regex: /.{8,}/, text: "8 أحرف على الأقل" },
      { regex: /[a-z]/, text: "حرف صغير واحد على الأقل" },
      { regex: /[A-Z]/, text: "حرف كبير واحد على الأقل" },
      { regex: /[0-9]/, text: "رقم واحد على الأقل" },
      { regex: /[^A-Za-z0-9]/, text: "رمز خاص واحد على الأقل" },
    ];
  }, []);

  const passwordValidation = useMemo(() => {
    return passwordRequirements.map(req => ({
      ...req,
      isValid: req.regex.test(password)
    }));
  }, [password, passwordRequirements]);

  const isPasswordValid = useMemo(() => passwordValidation.every(req => req.isValid), [passwordValidation]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPasswordValid) {
      toast({
        variant: "destructive",
        title: "كلمة المرور غير صالحة",
        description: "يرجى التأكد من أن كلمة المرور تستوفي جميع المتطلبات.",
      });
      return;
    }
    setIsLoading(true);
    try {
      await signUp(email, password, name);
      toast({
        title: "تم إنشاء الحساب!",
        description: "يمكنك الآن إنشاء مساحات العمل الخاصة بك.",
      });
      router.push('/dashboard');

    } catch (error: any) {
       if (error instanceof FirebaseError && error.code === 'auth/weak-password') {
         toast({
            variant: "destructive",
            title: "كلمة المرور ضعيفة",
            description: "كلمة المرور التي أدخلتها ضعيفة جدًا.",
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
                />
              </div>
              <div className="grid gap-2 mt-2">
                {passwordValidation.map((req, index) => (
                  <div key={index} className={`flex items-center text-xs ${req.isValid ? 'text-green-500' : 'text-muted-foreground'}`}>
                    {req.isValid ? <CheckCircle2 className="h-4 w-4 ml-2" /> : <XCircle className="h-4 w-4 ml-2" />}
                    <span>{req.text}</span>
                  </div>
                ))}
              </div>
              <Button type="submit" className="w-full" disabled={isLoading || !isPasswordValid}>
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
