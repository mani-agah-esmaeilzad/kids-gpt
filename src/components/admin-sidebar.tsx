"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CreditCard,
  TicketPercent,
  ShieldAlert,
  Sliders,
  Activity,
  ListChecks,
  FileText,
  DollarSign,
  ShieldCheck,
  Receipt
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin", label: "نمای کلی", icon: LayoutDashboard },
  { href: "/admin/users", label: "کاربران", icon: Users },
  { href: "/admin/plans", label: "پلن‌ها", icon: CreditCard },
  { href: "/admin/subscriptions", label: "اشتراک‌ها", icon: Receipt },
  { href: "/admin/payments", label: "پرداخت‌ها", icon: DollarSign },
  { href: "/admin/coupons", label: "کوپن‌ها", icon: TicketPercent },
  { href: "/admin/usage", label: "مصرف و توکن", icon: Activity },
  { href: "/admin/costs", label: "هزینه‌ها", icon: DollarSign },
  { href: "/admin/safety", label: "ایمنی", icon: ShieldAlert },
  { href: "/admin/limits", label: "Rate Limits", icon: ShieldCheck },
  { href: "/admin/config", label: "تنظیمات", icon: Sliders },
  { href: "/admin/logs", label: "لاگ سیستم", icon: ListChecks },
  { href: "/admin/audit", label: "لاگ‌ها", icon: ListChecks },
  { href: "/admin/exports", label: "خروجی CSV", icon: FileText }
];

export function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden w-72 flex-col gap-2 rounded-3xl bg-card p-4 shadow-soft lg:flex">
      <div className="px-3 py-2">
        <p className="text-xs text-muted-foreground">پنل مدیریت</p>
        <p className="text-lg font-semibold">GPTKids Admin</p>
      </div>
      {items.map((item) => {
        const active = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex items-center gap-3 rounded-2xl px-3 py-2 text-sm font-semibold transition",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
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
