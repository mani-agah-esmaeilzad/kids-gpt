import { Star, Zap, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { PricingCards } from "@/components/pricing-cards";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export default function PricingPage() {
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

        <PricingCards />

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
