"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  MessageCircle,
  BarChart2,
  Settings,
  CreditCard,
  UserCog
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/parent", label: "خانه", icon: Home },
  { href: "/profiles/manage", label: "پروفایل‌ها", icon: Users },
  { href: "/parent/reports", label: "گزارش‌ها", icon: BarChart2 },
  { href: "/parent/billing", label: "اشتراک", icon: CreditCard },
  { href: "/parent/account", label: "حساب کاربری", icon: UserCog },
  { href: "/parent/settings", label: "تنظیمات", icon: Settings }
];

export function ParentSidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-64 flex-col gap-2 rounded-3xl bg-white/80 p-4 shadow-soft lg:flex">
      <p className="px-3 text-xs font-semibold text-muted-foreground">داشبورد والدین</p>
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-semibold transition",
              active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </aside>
  );
}
