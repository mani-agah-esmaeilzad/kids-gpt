import { Button } from "@/components/ui/button";
import { GraduationCap, Users, BookOpen, BarChart } from "lucide-react";
import Link from "next/link";

export default function SchoolsPage() {
  return (
    <div className="py-12 md:py-24">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col md:flex-row gap-12 items-center mb-24">
          <div className="flex-1 space-y-6">
            <div className="inline-flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-bold mb-2">
              <GraduationCap className="w-4 h-4" />
              ویژه مدارس و موسسات آموزشی
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
              کلاس درس آینده <br />
              <span className="text-indigo-600">همین امروز</span>
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              KidsGPT به معلمان کمک می‌کند تا کنجکاوی دانش‌آموزان را هدایت کنند و به هر دانش‌آموز یک دستیار آموزشی شخصی بدهند.
            </p>
            <div className="flex gap-4">
              <Button size="lg" className="h-14 px-8 rounded-full bg-indigo-600 hover:bg-indigo-700">
                درخواست دموی سازمانی
              </Button>
            </div>
          </div>
          <div className="flex-1 bg-indigo-50 rounded-[3rem] p-8 md:p-12 border-2 border-indigo-100 border-dashed">
            <div className="space-y-6">
              <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xl">1</div>
                <div>
                  <h3 className="font-bold text-slate-900">پنل مدیریت یکپارچه</h3>
                  <p className="text-sm text-slate-500">مدیریت صدها دانش‌آموز با چند کلیک</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xl">2</div>
                <div>
                  <h3 className="font-bold text-slate-900">محتوای منطبق با برنامه درسی</h3>
                  <p className="text-sm text-slate-500">تنظیم هوش مصنوعی بر اساس کتب درسی</p>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white p-4 rounded-2xl shadow-sm">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold text-xl">3</div>
                <div>
                  <h3 className="font-bold text-slate-900">تخفیف حجمی ویژه</h3>
                  <p className="text-sm text-slate-500">تا ۵۰٪ تخفیف برای مدارس دولتی</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 text-center">
          <div className="bg-slate-50 p-8 rounded-3xl">
            <Users className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="font-bold text-xl mb-2">کار گروهی</h3>
            <p className="text-slate-600">امکان تعریف پروژه‌های گروهی با کمک هوش مصنوعی</p>
          </div>
          <div className="bg-slate-50 p-8 rounded-3xl">
            <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="font-bold text-xl mb-2">رفع اشکال</h3>
            <p className="text-slate-600">دانش‌آموزان می‌توانند در خانه رفع اشکال کنند.</p>
          </div>
          <div className="bg-slate-50 p-8 rounded-3xl">
            <BarChart className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <h3 className="font-bold text-xl mb-2">تحلیل پیشرفت</h3>
            <p className="text-slate-600">گزارش‌های دقیق از نقاط ضعف و قوت کلاس</p>
          </div>
        </div>
      </div>
    </div>
  );
}
