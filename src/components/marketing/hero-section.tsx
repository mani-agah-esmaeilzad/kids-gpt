import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles, ShieldCheck } from "lucide-react";

export function HeroSection() {
    return (
        <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 to-white pb-16 pt-24 lg:pt-32">
            <div className="container relative z-10 px-4 md:px-6">
                <div className="flex flex-col items-center text-center">
                    <div className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-sm text-blue-800 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <span className="flex h-2 w-2 rounded-full bg-blue-600 mr-2"></span>
                        <span className="font-semibold">جدید: حالت کاوشگر برای کودکان</span>
                    </div>
                    <h1 className="mt-6 max-w-4xl text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl md:text-7xl lg:text-7xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-100">
                        <span className="block text-primary">GPTKids</span>
                        <span className="block mt-2 text-3xl sm:text-5xl lg:text-6xl font-bold text-slate-700">
                            چت‌بات امن و آموزشی برای کودکها
                        </span>
                    </h1>
                    <p className="mt-6 max-w-2xl text-lg text-slate-600 sm:text-xl animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        یک محیط امن، کنترل شده و سرگرم‌کننده برای یادگیری و کشف دنیای هوش مصنوعی. با نظارت کامل والدین و محتوای مناسب سن.
                    </p>
                    <div className="mt-10 flex flex-col gap-4 sm:flex-row animate-in fade-in slide-in-from-bottom-8 duration-700 delay-300">
                        <Button size="lg" className="h-12 px-8 text-lg rounded-2xl shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all font-bold gap-2" asChild>
                            <Link href="/signup">
                                شروع رایگان برای والدین
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                        </Button>
                        <Button size="lg" variant="outline" className="h-12 px-8 text-lg rounded-2xl border-2 hover:bg-slate-50 font-bold" asChild>
                            <Link href="/login">ورود کودکان</Link>
                        </Button>
                    </div>

                    <div className="mt-12 flex items-center justify-center gap-8 text-sm text-slate-500 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-5 h-5 text-green-500" />
                            <span>بدون محتوای نامناسب</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Sparkles className="w-5 h-5 text-yellow-500" />
                            <span>شخصی‌سازی شده</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Decorative gradient blobs */}
            <div className="absolute top-0 left-1/2 -ml-[40rem] w-[80rem] h-[40rem] -z-10 bg-gradient-to-tr from-blue-100 to-purple-100 opacity-50 blur-3xl rounded-full mix-blend-multiply animate-blob"></div>
            <div className="absolute top-0 right-1/2 -mr-[40rem] w-[80rem] h-[40rem] -z-10 bg-gradient-to-tl from-yellow-100 to-green-100 opacity-50 blur-3xl rounded-full mix-blend-multiply animate-blob animation-delay-2000"></div>
        </section>
    );
}
