import Link from "next/link";
import Image from "next/image";

export function SiteFooter() {
  return (
    <footer className="border-t bg-white/70">
      <div className="container grid gap-8 py-12 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <div className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="KidsGPT Logo"
              width={48}
              height={48}
              className="rounded-2xl shadow-soft"
            />
            <div>
              <p className="text-sm font-bold">GPTKids</p>
              <p className="text-xs text-muted-foreground">چت‌بات امن برای کودکان</p>
            </div>
          </div>
          <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
            طراحی شده برای خانواده‌های ایرانی با تمرکز بر ایمنی، حریم خصوصی و تجربه کودک‌محور.
          </p>
        </div>

        <div className="space-y-3 text-sm">
          <p className="font-bold text-slate-900">محصول</p>
          <Link href="/pricing" className="block text-slate-500 hover:text-primary transition-colors">
            قیمت‌گذاری
          </Link>
          <Link href="/parents" className="block text-slate-500 hover:text-primary transition-colors">
            برای والدین
          </Link>
          <Link href="/schools" className="block text-slate-500 hover:text-primary transition-colors">
            مدارس و موسسات
          </Link>
        </div>

        <div className="space-y-3 text-sm">
          <p className="font-bold text-slate-900">منابع</p>
          <Link href="/safety" className="block text-slate-500 hover:text-primary transition-colors">
            استانداردهای ایمنی
          </Link>
          <Link href="/faq" className="block text-slate-500 hover:text-primary transition-colors">
            سوالات متداول
          </Link>
          <Link href="/blog" className="block text-slate-500 hover:text-primary transition-colors">
            وبلاگ آموزشی
          </Link>
        </div>

        <div className="space-y-3 text-sm">
          <p className="font-bold text-slate-900">قانونی</p>
          <Link href="/privacy" className="block text-slate-500 hover:text-primary transition-colors">
            حریم خصوصی
          </Link>
          <Link href="/terms" className="block text-slate-500 hover:text-primary transition-colors">
            قوانین و شرایط
          </Link>
          <p className="text-slate-400 pt-4">پشتیبانی: hello@gptkids.ir</p>
        </div>
      </div>
      <div className="border-t py-6 text-center text-xs text-slate-400">
        © 2026 GPTKids. همه حقوق محفوظ است. توسعه داده شده با ❤️ برای کودکان ایران.
      </div>
    </footer>
  );
}
