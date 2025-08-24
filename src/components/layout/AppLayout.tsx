
"use client";

import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { DashboardHeader } from "../dashboard/DashboardHeader";

interface AppLayoutProps {
    children: React.ReactNode;
    showHeader?: boolean;
}

export function AppLayout({ children, showHeader = true }: AppLayoutProps) {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && !user) {
            router.push('/login');
        }
    }, [user, loading, router]);

    if (loading || !user) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
            </div>
        );
    }
    
    return (
        <div className="flex flex-col min-h-screen">
            {showHeader && <DashboardHeader />}
            <div className="flex-1 pb-20 md:pb-0">{children}</div>
        </div>
    )
}
