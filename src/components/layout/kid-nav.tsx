"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, MessageCircle, Compass, Star, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export function KidNav() {
    const pathname = usePathname();

    const links = [
        { href: "/kid/dashboard", label: "خانه", icon: Home, color: "text-kid-blue" },
        { href: "/kid/chat", label: "گفتگو", icon: MessageCircle, color: "text-kid-pink" },
        { href: "/kid/explore", label: "کشف کن", icon: Compass, color: "text-kid-purple" },
        { href: "/kid/rewards", label: "جایزه‌ها", icon: Star, color: "text-kid-yellow" },
    ];

    return (
        <nav className="flex items-center gap-2 md:gap-4 bg-white/80 backdrop-blur-sm p-2 rounded-full shadow-soft border border-white/50">
            {links.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={cn(
                            "flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300",
                            isActive
                                ? "bg-slate-900 text-white shadow-md scale-105"
                                : "text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                        )}
                    >
                        <Icon className={cn("w-5 h-5", isActive ? "text-white" : link.color)} />
                        <span className={cn("hidden md:inline font-bold text-sm", isActive ? "text-white" : "")}>
                            {link.label}
                        </span>
                    </Link>
                )
            })}

            <div className="w-px h-6 bg-slate-200 mx-1"></div>

            <Button
                variant="ghost"
                size="icon"
                asChild
                className="rounded-full text-slate-400 hover:text-red-500 hover:bg-red-50"
                title="خروج"
            >
                <Link href="/profiles">
                    <LogOut className="w-5 h-5" />
                </Link>
            </Button>
        </nav>
    );
}
