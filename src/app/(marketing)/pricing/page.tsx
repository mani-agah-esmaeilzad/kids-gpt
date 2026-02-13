import { Button } from "@/components/ui/button";
import { Check, Star, Zap, Shield } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function PricingPage() {
  const plans = [
    {
      name: "رایگان",
      price: "۰",
      period: "همیشه",
      description: "برای شروع و آشنایی با محیط",
      features: [
        "دسترسی محدود به چت",
        "۱ پروفایل کودک",
        "گزارش هفتگی",
        "محتوای امن"
      ],
      cta: "شروع رایگان",
      href: "/signup",
      variant: "outline",
      color: "border-slate-200"
    },
    {
      name: "پیشرفته",
      price: "۱۴۹,۰۰۰",
      period: "ماهانه",
      description: "محبوب‌ترین انتخاب والدین",
      features: [
        "چت نامحدود",
        "۳ پروفایل کودک",
        "گزارش لحظه‌ای",
        "تنظیمات شخصی‌سازی",
        "اولویت در پاسخگویی"
      ],
      cta: "انتخاب طرح",
      href: "/signup?plan=pro",
      variant: "default",
      color: "border-primary/20 ring-4 ring-primary/5",
      badge: "پیشنهاد ما"
    },
    {
      name: "خانواده",
      price: "۳۹۹,۰۰۰",
      period: "۳ ماهه",
      description: "اقتصادی برای خانواده‌های بزرگ",
      features: [
        "همه امکانات پیشرفته",
        "۵ پروفایل کودک",
        "دانلود آرشیو گفتگوها",
        "پشتیبانی اختصاصی",
        "دسترسی به محتوای آموزشی ویژه"
      ],
      cta: "خرید اشتراک",
      href: "/signup?plan=family",
      variant: "outline",
      color: "border-orange-200 bg-orange-50/50"
    }
  ];

  return (
    <div className="py-24">
      <div className="container px-4 md:px-6">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <Badge variant="secondary" className="mb-4">سرمایه‌گذاری روی آینده</Badge>
          <h1 className="text-4xl md:text-5xl font-black tracking-tight text-slate-900">
            انتخابی هوشمندانه برای <span className="text-primary">کودکان هوشمند</span>
          </h1>
          <p className="text-xl text-slate-600">
            با هزینه‌ای کمتر از یک کلاس خصوصی، معلمی دانا و صبور برای کودکتان استخدام کنید.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-[2.5rem] p-8 bg-white shadow-soft transition-all hover:-translate-y-2 hover:shadow-xl border-2 ${plan.color}`}
            >
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold shadow-md">
                  {plan.badge}
                </div>
              )}

              <div className="text-center mb-8">
                <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                <div className="flex items-center justify-center gap-1">
                  <span className="text-4xl font-black text-slate-800">{plan.price}</span>
                  <span className="text-sm text-slate-500 flex flex-col items-start leading-tight">
                    <span>تومان</span>
                    <span>{plan.period}</span>
                  </span>
                </div>
                <p className="text-sm text-slate-500 mt-4">{plan.description}</p>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3 text-sm text-slate-700">
                    <div className="rounded-full bg-green-100 p-1 mt-0.5">
                      <Check className="w-3 h-3 text-green-600" />
                    </div>
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                asChild
                className={`w-full h-12 rounded-xl font-bold text-base ${plan.variant === 'outline' ? 'hover:bg-slate-50' : 'shadow-lg shadow-primary/20'}`}
                variant={plan.variant as any}
              >
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>

        <div className="mt-24 grid md:grid-cols-3 gap-8 text-center">
          <div className="space-y-2">
            <div className="mx-auto w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-4">
              <Shield className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900">گارانتی بازگشت وجه</h4>
            <p className="text-sm text-slate-500">تا ۷ روز در صورت نارضایتی، تمام مبلغ را برمی‌گردانیم.</p>
          </div>
          <div className="space-y-2">
            <div className="mx-auto w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-4">
              <Zap className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900">فعالسازی آنی</h4>
            <p className="text-sm text-slate-500">بلافاصله بعد از پرداخت، حساب شما ارتقا می‌یابد.</p>
          </div>
          <div className="space-y-2">
            <div className="mx-auto w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center text-yellow-600 mb-4">
              <Star className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-900">لغو در هر زمان</h4>
            <p className="text-sm text-slate-500">هیچ تعهدی نیست. هر وقت خواستید تمدید نکنید.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
