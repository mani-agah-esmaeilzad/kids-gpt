import { Button } from "@/components/ui/button";
import { Brain, Heart, Shield, Zap, BarChart3, Clock } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ParentsMarketingPage() {
    return (
        <div className="space-y-24 py-12 md:py-24">
            {/* Hero Section */}
            <section className="container px-4 md:px-6">
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-24">
                    <div className="flex-1 space-y-6 text-center lg:text-right">
                        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
                            خیالتان راحت، <br />
                            <span className="text-primary">هوش مصنوعی</span> در خدمت تربیت
                        </h1>
                        <p className="text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0">
                            ما ابزاری ساخته‌ایم که به جای جایگزین شدن با والدین، دستیار هوشمند آن‌ها باشد. نظارت کامل داشته باشید، بدون اینکه آزادی کودک را سلب کنید.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Button size="lg" className="h-14 px-8 text-lg rounded-full" asChild>
                                <Link href="/signup">شروع نظارت هوشمند</Link>
                            </Button>
                            <Button size="lg" variant="outline" className="h-14 px-8 text-lg rounded-full" asChild>
                                <Link href="/safety">چگونه کار می‌کند؟</Link>
                            </Button>
                        </div>
                    </div>
                    <div className="flex-1 relative">
                        <div className="relative w-full aspect-square max-w-md mx-auto lg:max-w-none">
                            <div className="absolute inset-0 bg-blue-100 rounded-full blur-3xl opacity-50 animate-pulse"></div>
                            {/* Mockup or Image would go here */}
                            <div className="relative bg-white rounded-[2.5rem] p-6 shadow-2xl border border-slate-100 rotate-3 hover:rotate-0 transition-transform duration-500">
                                <div className="flex items-center gap-4 mb-6 border-b pb-4">
                                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                        <Shield className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">گزارش امنیت</h3>
                                        <p className="text-sm text-slate-500">امروز، ۱۴:۳۰</p>
                                    </div>
                                </div>
                                <p className="text-slate-700 font-medium mb-4">
                                    "علی امروز درباره نجوم سوالات خیلی خوبی پرسید. اما وقتی بحث به سمت خشونت رفت، ما موضوع را مودبانه عوض کردیم."
                                </p>
                                <div className="flex gap-2">
                                    <span className="bg-slate-100 px-3 py-1 rounded-full text-xs font-bold text-slate-600">#نجوم</span>
                                    <span className="bg-green-100 px-3 py-1 rounded-full text-xs font-bold text-green-600">#کنجکاوی</span>
                                    <span className="bg-red-50 px-3 py-1 rounded-full text-xs font-bold text-red-500">#محافظت_شده</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Grid */}
            <section className="container px-4 md:px-6">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl font-black text-slate-900 mb-4">چرا والدین KidsGPT را دوست دارند؟</h2>
                    <p className="text-lg text-slate-600">چون ما تعادل ظریفی بین سرگرمی کودک و آرامش والدین ایجاد کرده‌ایم.</p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    <FeatureCard
                        icon={<BarChart3 className="w-8 h-8 text-blue-500" />}
                        title="گزارش‌های تحلیلی"
                        desc="ببینید کودکتان به چه موضوعاتی علاقه دارد و چقدر وقت صرف یادگیری کرده است."
                    />
                    <FeatureCard
                        icon={<Clock className="w-8 h-8 text-orange-500" />}
                        title="مدیریت زمان"
                        desc="سقف استفاده روزانه تعیین کنید تا تعادل زندگی دیجیتال و واقعی حفظ شود."
                    />
                    <FeatureCard
                        icon={<Brain className="w-8 h-8 text-purple-500" />}
                        title="پرورش خلاقیت"
                        desc="هوش مصنوعی ما کودک را تشویق می‌کند تا سوال بپرسد و راه حل‌های جدید پیدا کند."
                    />
                    <FeatureCard
                        icon={<Shield className="w-8 h-8 text-green-500" />}
                        title="فیلتر کلمات"
                        desc="لیست کلمات ممنوعه اختصاصی خودتان را بسازید یا به فیلترهای استاندارد ما اعتماد کنید."
                    />
                    <FeatureCard
                        icon={<Zap className="w-8 h-8 text-yellow-500" />}
                        title="پاسخ‌های متناسب سن"
                        desc="زبانی که برای یک کودک ۵ ساله استفاده می‌شود با یک نوجوان ۱۲ ساله متفاوت است."
                    />
                    <FeatureCard
                        icon={<Heart className="w-8 h-8 text-red-500" />}
                        title="بدون قضاوت"
                        desc="کودکان می‌توانند هر «سوال احمقانه‌ای» را بپرسند بدون اینکه خجالت بکشند."
                    />
                </div>
            </section>

            {/* CTA */}
            <section className="container px-4 md:px-6">
                <div className="bg-slate-900 rounded-[3rem] p-12 md:p-24 text-center text-white relative overflow-hidden">
                    <div className="relative z-10 max-w-2xl mx-auto space-y-8">
                        <h2 className="text-3xl md:text-5xl font-black">همین امروز شروع کنید</h2>
                        <p className="text-xl text-slate-300">
                            اولین ماه استفاده از KidsGPT رایگان است. هیچ ریسکی وجود ندارد.
                        </p>
                        <Button size="lg" className="h-16 px-12 text-xl rounded-full bg-white text-slate-900 hover:bg-slate-100" asChild>
                            <Link href="/signup">ساخت حساب کاربری</Link>
                        </Button>
                    </div>
                    <div className="absolute top-0 left-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
                </div>
            </section>
        </div>
    );
}

function FeatureCard({ icon, title, desc }: { icon: any, title: string, desc: string }) {
    return (
        <div className="bg-slate-50 p-8 rounded-[2rem] hover:bg-white hover:shadow-xl transition-all duration-300 border border-slate-100 group">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-6 group-hover:scale-110 transition-transform">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
            <p className="text-slate-600 leading-relaxed">{desc}</p>
        </div>
    )
}
