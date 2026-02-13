import { ShieldCheck, Eye, Lock, MessageSquare, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function SafetyPage() {
  return (
    <div className="py-16 md:py-24">
      <div className="container px-4 md:px-6 max-w-4xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-bold mb-4">
            <ShieldCheck className="w-4 h-4" />
            اولویت اول ما: امنیت کودک
          </div>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900">
            فضایی امن برای <span className="text-green-600">کنجکاوی‌های بی‌پایان</span>
          </h1>
          <p className="text-xl text-slate-600 leading-relaxed">
            ما با ترکیبی از هوش مصنوعی پیشرفته و نظارت دقیق، محیطی را ساخته‌ایم که کودکان بتوانند با خیال راحت یاد بگیرند و بازی کنند.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
            <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm mb-6">
              <MessageSquare className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">فیلترینگ محتوای نامناسب</h3>
            <p className="text-slate-600 leading-relaxed">
              هوش مصنوعی ما به گونه‌ای آموزش دیده که پاسخ‌های مناسب سن کودک بدهد. کلمات زشت، خشونت‌آمیز یا نامناسب به صورت خودکار شناسایی و مسدود می‌شوند.
            </p>
          </div>

          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
            <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center text-purple-600 shadow-sm mb-6">
              <Eye className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">نظارت کامل والدین</h3>
            <p className="text-slate-600 leading-relaxed">
              شما در داشبورد والدین می‌توانید ریز مکالمات کودک را ببینید، موضوعات خاص را محدود کنید و گزارش‌های پیشرفت را دریافت کنید.
            </p>
          </div>

          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
            <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center text-orange-600 shadow-sm mb-6">
              <Lock className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">حریم خصوصی داده‌ها</h3>
            <p className="text-slate-600 leading-relaxed">
              ما اطلاعات کودکان را نمی‌فروشیم و از آنها برای تبلیغات استفاده نمی‌کنیم. تمام داده‌های مکالمه رمزنگاری شده و امن هستند.
            </p>
          </div>

          <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100">
            <div className="bg-white w-14 h-14 rounded-2xl flex items-center justify-center text-red-600 shadow-sm mb-6">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">مکانیزم‌های "چیزهای بد"</h3>
            <p className="text-slate-600 leading-relaxed">
              اگر کودک در مورد موضوعات خطرناک (مثل آسیب به خود) صحبت کند، سیستم بلافاصله موضوع را عوض کرده و به والدین هشدار می‌دهد.
            </p>
          </div>
        </div>

        <div className="bg-blue-600 rounded-[2.5rem] p-8 md:p-12 text-white text-center relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-black mb-6">استانداردهای ما</h2>
            <div className="flex flex-wrap justify-center gap-4 md:gap-8">
              <div className="flex items-center gap-2 bg-blue-700/50 px-4 py-2 rounded-full backdrop-blur-sm">
                <CheckCircle2 className="w-5 h-5 text-blue-200" />
                <span className="font-semibold">تایید شده توسط روانشناسان</span>
              </div>
              <div className="flex items-center gap-2 bg-blue-700/50 px-4 py-2 rounded-full backdrop-blur-sm">
                <CheckCircle2 className="w-5 h-5 text-blue-200" />
                <span className="font-semibold">بدون تبلیغات</span>
              </div>
              <div className="flex items-center gap-2 bg-blue-700/50 px-4 py-2 rounded-full backdrop-blur-sm">
                <CheckCircle2 className="w-5 h-5 text-blue-200" />
                <span className="font-semibold">مطابق قوانین COPPA</span>
              </div>
            </div>
          </div>
          {/* Decorative */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        </div>
      </div>
    </div>
  );
}
