import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
  SheetDescription
} from "@/components/ui/sheet";

const navItems = [
  { href: "/pricing", label: "قیمت‌گذاری" },
  { href: "/safety", label: "ایمنی" },
  { href: "/parents", label: "برای والدین" },
  { href: "/schools", label: "مدارس" },
  { href: "/faq", label: "سوالات" }
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                <Menu className="h-6 w-6" />
                <span className="sr-only">منو</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <SheetTitle>منوی اصلی</SheetTitle>
              <SheetDescription>دسترسی سریع به بخش‌های سایت</SheetDescription>
              <div className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-lg font-medium text-foreground hover:text-primary transition-colors block py-2"
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="border-t pt-4 mt-2 flex flex-col gap-3">
                  <Link href="/login" className="text-lg font-medium text-muted-foreground hover:text-foreground">
                    ورود والدین
                  </Link>
                  <Link href="/signup" className="text-lg font-bold text-primary">
                    ثبت نام رایگان
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>

          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="KidsGPT Logo"
              width={48}
              height={48}
              className="rounded-2xl shadow-soft hover:scale-105 transition-transform"
            />
            <div>
              <p className="text-sm font-bold">GPTKids</p>
              <p className="text-xs text-muted-foreground">gptkids.ir</p>
            </div>
          </Link>
        </div>

        <nav className="hidden items-center gap-6 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-semibold text-muted-foreground transition hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="hidden lg:flex items-center gap-3">
          <Link href="/login" className="text-sm font-semibold text-muted-foreground">
            ورود والدین
          </Link>
          <Button asChild size="sm">
            <Link href="/signup">شروع رایگان</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
