
"use client";

import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LogOut, Settings, User, LifeBuoy } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MorePage() {
    const { user, signOut } = useAuth();
    const router = useRouter();

    if (!user) {
        return null;
    }

    return (
        <main className="flex-1 p-4 md:p-8 max-w-2xl mx-auto">
            <h1 className="text-3xl font-headline font-bold text-foreground mb-6 text-start">
                المزيد
            </h1>
            <div className="flex flex-col items-center gap-4 mb-8">
                <Avatar className="h-24 w-24 border-4 border-primary/20">
                    {user.avatarUrl && <AvatarImage src={user.avatarUrl} alt={user.name} />}
                    <AvatarFallback className="text-3xl" style={{backgroundColor: user.avatarColor}}>{user.avatarText}</AvatarFallback>
                </Avatar>
                <div className="text-center">
                    <h2 className="text-2xl font-bold">{user.name}</h2>
                    <p className="text-muted-foreground">{user.email}</p>
                </div>
            </div>

            <Card>
                <CardContent className="p-2">
                   <ul className="space-y-1">
                        <li>
                            <Button variant="ghost" className="w-full justify-start gap-3" onClick={() => router.push('/profile')}>
                                <User className="h-5 w-5 text-muted-foreground" />
                                <span>الملف الشخصي</span>
                            </Button>
                        </li>
                        <li>
                            <Button variant="ghost" className="w-full justify-start gap-3" onClick={() => router.push('/guide')}>
                                <LifeBuoy className="h-5 w-5 text-muted-foreground" />
                                <span>الدليل</span>
                            </Button>
                        </li>
                         <li>
                            <Button variant="ghost" className="w-full justify-start gap-3" onClick={() => router.push('/settings')}>
                                <Settings className="h-5 w-5 text-muted-foreground" />
                                <span>الإعدادات</span>
                            </Button>
                        </li>
                         <li>
                            <Button variant="ghost" className="w-full justify-start gap-3 text-destructive hover:text-destructive" onClick={signOut}>
                                <LogOut className="h-5 w-5" />
                                <span>تسجيل الخروج</span>
                            </Button>
                        </li>
                   </ul>
                </CardContent>
            </Card>

        </main>
    )
}
