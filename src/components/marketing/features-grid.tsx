import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Bot, Compass, Award, Trophy, Settings, Activity, FileText, Lock } from "lucide-react";

export function FeaturesGrid() {
    return (
        <section className="py-20 bg-slate-50">
            <div className="container px-4 md:px-6">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                        طراحی شده برای همه اعضای خانواده
                    </h2>
                    <p className="mt-4 text-lg text-slate-600">
                        ابزارهای قدرتمند برای والدین، تجربه جادویی برای کودکان
                    </p>
                </div>

                <Tabs defaultValue="kids" className="w-full max-w-4xl mx-auto">
                    <TabsList className="grid w-full grid-cols-2 mb-8 p-1 bg-white border rounded-2xl shadow-sm h-14">
                        <TabsTrigger value="kids" className="rounded-xl text-base data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 h-12">برای کودکان 🧒</TabsTrigger>
                        <TabsTrigger value="parents" className="rounded-xl text-base data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 h-12">برای والدین 👨‍👩‍👧‍👦</TabsTrigger>
                    </TabsList>

                    <TabsContent value="kids" className="grid gap-6 sm:grid-cols-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <FeatureCard
                            icon={<Bot className="w-8 h-8 text-pink-500" />}
                            title="دوست هوشمند"
                            desc="یک همبازی که همیشه آماده پاسخ دادن به سوالات کنجکاوانه است."
                            className="bg-pink-50/50 border-pink-100 hover:border-pink-200"
                        />
                        <FeatureCard
                            icon={<Compass className="w-8 h-8 text-blue-500" />}
                            title="حالت کاوش"
                            desc="سفری امن به دنیای علم، تاریخ و طبیعت با زبان ساده."
                            className="bg-blue-50/50 border-blue-100 hover:border-blue-200"
                        />
                        <FeatureCard
                            icon={<Award className="w-8 h-8 text-yellow-500" />}
                            title="نشان‌ها و جوایز"
                            desc="تشویق به یادگیری با دریافت نشان‌های افتخار برای هر پیشرفت."
                            className="bg-yellow-50/50 border-yellow-100 hover:border-yellow-200"
                        />
                        <FeatureCard
                            icon={<Trophy className="w-8 h-8 text-green-500" />}
                            title="چالش‌های روزانه"
                            desc="معماها و بازی‌های فکری برای تقویت خلاقیت و هوش."
                            className="bg-green-50/50 border-green-100 hover:border-green-200"
                        />
                    </TabsContent>

                    <TabsContent value="parents" className="grid gap-6 sm:grid-cols-2 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <FeatureCard
                            icon={<Settings className="w-8 h-8 text-slate-700" />}
                            title="کنترل کامل"
                            desc="مدیریت زمان استفاده، موضوعات مجاز و سطح دسترسی."
                            className="bg-white hover:border-slate-300"
                        />
                        <FeatureCard
                            icon={<Activity className="w-8 h-8 text-slate-700" />}
                            title="مانیتورینگ زنده"
                            desc="مشاهده فعالیت‌ها و مکالمات کودک در لحظه برای اطمینان خاطر."
                            className="bg-white hover:border-slate-300"
                        />
                        <FeatureCard
                            icon={<FileText className="w-8 h-8 text-slate-700" />}
                            title="گزارش‌های هفتگی"
                            desc="تحلیل علایق و پیشرفت کودک در یادگیری مفاهیم جدید."
                            className="bg-white hover:border-slate-300"
                        />
                        <FeatureCard
                            icon={<Lock className="w-8 h-8 text-slate-700" />}
                            title="پروفایل‌های کودک"
                            desc="انتخاب سریع پروفایل مثل نتفلیکس برای ورود مستقیم به گفتگوی امن."
                            className="bg-white hover:border-slate-300"
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </section>
    );
}

function FeatureCard({ title, desc, icon, className }: { title: string; desc: string; icon: React.ReactNode; className?: string }) {
    return (
        <Card className={`border shadow-sm transition-all hover:shadow-md ${className}`}>
            <CardHeader>
                <div className="mb-2 p-3 w-fit rounded-xl bg-white shadow-sm border">
                    {icon}
                </div>
                <CardTitle className="text-xl">{title}</CardTitle>
                <CardDescription className="text-base mt-2 leading-relaxed">{desc}</CardDescription>
            </CardHeader>
        </Card>
    )
}
