
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Calendar, Plus, LifeBuoy, MoreHorizontal } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

const navItems = [
    { href: "/dashboard", icon: Home, label: "المساحات" },
    { href: "/calendar", icon: Calendar, label: "التقويم" },
    { href: "/add", icon: Plus, label: "إضافة", isCentral: true },
    { href: "/guide", icon: LifeBuoy, label: "الدليل" },
    { href: "/more", icon: MoreHorizontal, label: "المزيد" },
];

interface BottomNavbarProps {
    onAddClick: () => void;
}

export function BottomNavbar({ onAddClick }: BottomNavbarProps) {
    const pathname = usePathname();

    return (
        <nav className="sm:hidden fixed bottom-0 left-0 right-0 h-16 bg-background border-t z-50">
            <div className="flex justify-around items-center h-full max-w-md mx-auto">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;

                    if (item.isCentral) {
                        return (
                            <div key={item.href} className="relative -top-4">
                                <Button
                                    size="icon"
                                    className="h-16 w-16 rounded-full bg-primary shadow-lg hover:bg-primary/90"
                                    onClick={onAddClick}
                                >
                                    <Plus className="h-8 w-8" />
                                    <span className="sr-only">{item.label}</span>
                                </Button>
                            </div>
                        );
                    }
                    
                    return (
                        <Link href={item.href} key={item.href} className={cn(
                            "flex flex-col items-center justify-center text-xs gap-1 transition-colors w-16",
                            isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
                        )}>
                            <item.icon className="h-6 w-6" />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}
