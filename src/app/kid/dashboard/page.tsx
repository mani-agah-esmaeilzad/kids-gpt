import Link from "next/link";
import Image from "next/image";
import { MessageCircle, Compass, Star, Gamepad2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { getActiveChild } from "@/lib/device-session";
import { getAvatarSrc } from "@/lib/avatars";
import { redirect } from "next/navigation";

export default async function KidDashboard() {
    const child = await getActiveChild();
    if (!child) redirect("/profiles");

    const activities = [
        {
            title: "چت با هوش مصنوعی",
            description: "دوست دانا و مهربون تو!",
            icon: MessageCircle,
            href: "/kid/chat",
            color: "from-blue-400 to-blue-600",
            shadow: "shadow-blue-300/50",
            delay: "delay-0",
        },
        {
            title: "کشف دنیای جدید",
            description: "بریم چیزای عجیب یاد بگیریم",
            icon: Compass,
            href: "/kid/explore",
            color: "from-purple-400 to-purple-600",
            shadow: "shadow-purple-300/50",
            delay: "delay-100",
        },
        {
            title: "جایزه‌ها و امتیازها",
            description: "ببین چقدر ستاره جمع کردی!",
            icon: Star,
            href: "/kid/rewards",
            color: "from-yellow-400 to-yellow-600",
            shadow: "shadow-yellow-300/50",
            delay: "delay-200",
        },
        {
            title: "بازی و سرگرمی",
            description: "وقت بازی و شادیه!",
            icon: Gamepad2,
            href: "/kid/games",
            color: "from-green-400 to-green-600",
            shadow: "shadow-green-300/50",
            delay: "delay-300",
        },
    ];

    return (
        <div className="space-y-6 md:space-y-10 pb-24 px-4 md:px-0">
            {/* Hero Section */}
            <div className="relative overflow-hidden rounded-[2rem] md:rounded-[3rem] bg-gradient-to-r from-kid-blue via-blue-400 to-kid-purple p-6 md:p-12 text-white shadow-xl">
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6 md:gap-12">
                    <div className="relative group perspective-1000">
                        <div className="w-24 h-24 md:w-48 md:h-48 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border-4 border-white/30 shadow-2xl transition-transform duration-500 group-hover:rotate-y-12 group-hover:scale-105">
                            <Image
                                src={getAvatarSrc(child.avatarKey)}
                                alt={child.nickname}
                                width={160}
                                height={160}
                                className="object-contain drop-shadow-xl w-20 h-20 md:w-40 md:h-40"
                            />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-yellow-400 text-yellow-900 border-4 border-white rounded-full p-1.5 md:p-2 shadow-lg animate-bounce">
                            <Sparkles className="w-5 h-5 md:w-8 md:h-8" />
                        </div>
                    </div>

                    <div className="text-center md:text-right space-y-2 flex-1">
                        <h1 className="text-2xl md:text-6xl font-black tracking-tight drop-shadow-md">
                            سلام {child.nickname}! 👋
                        </h1>
                        <p className="text-base md:text-2xl font-medium text-white/90">
                            امروز دوست داری چه ماجراجویی‌ای داشته باشیم؟
                        </p>
                    </div>
                </div>

                {/* Background Decorations */}
                <div className="absolute top-0 right-0 w-32 h-32 md:w-64 md:h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 md:w-64 md:h-64 bg-white/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
            </div>

            {/* Activities Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                {activities.map((activity, index) => {
                    const Icon = activity.icon;
                    return (
                        <Link
                            key={activity.href}
                            href={activity.href}
                            className={cn(
                                "group relative overflow-hidden rounded-[2rem] p-5 md:p-8 transition-all duration-500 hover:scale-[1.03] hover:-translate-y-2 focus:outline-none focus:ring-4 focus:ring-offset-4 ring-offset-kid-bg",
                                "bg-white border-2 border-transparent hover:border-white/50 shadow-md hover:shadow-2xl",
                                activity.shadow
                            )}
                        >
                            <div className={cn(
                                "absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-500 bg-gradient-to-br",
                                activity.color
                            )}></div>

                            <div className="relative z-10 flex items-center md:items-start gap-4 md:gap-6">
                                <div className={cn(
                                    "w-14 h-14 md:w-20 md:h-20 rounded-[1rem] md:rounded-[1.5rem] flex items-center justify-center text-white shadow-lg transform transition-transform duration-500 group-hover:rotate-12 group-hover:scale-110 bg-gradient-to-br shrink-0",
                                    activity.color
                                )}>
                                    <Icon className="w-7 h-7 md:w-10 md:h-10" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg md:text-2xl font-black text-slate-800 mb-0.5 md:mb-1 group-hover:text-primary transition-colors">
                                        {activity.title}
                                    </h3>
                                    <p className="text-sm md:text-lg font-medium text-slate-500 group-hover:text-slate-700 transition-colors line-clamp-1 md:line-clamp-none">
                                        {activity.description}
                                    </p>
                                </div>
                            </div>

                            <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-4 group-hover:translate-x-0 hidden md:block">
                                <div className={cn("rounded-full p-2 text-white bg-gradient-to-r", activity.color)}>
                                    <Sparkles className="w-5 h-5" />
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>

            {/* Discovery Chips */}
            <div className="space-y-4 md:space-y-6">
                <h3 className="text-xl md:text-2xl font-black text-slate-800 flex items-center gap-2 md:gap-3">
                    <span className="text-2xl md:text-3xl">🚀</span>
                    کشف کن!
                </h3>
                <div className="flex flex-wrap gap-2 md:gap-4">
                    {[
                        { label: "دایناسورها 🦖", color: "bg-green-100 text-green-700 border-green-200 hover:bg-green-200" },
                        { label: "فضا و سیارات 🪐", color: "bg-indigo-100 text-indigo-700 border-indigo-200 hover:bg-indigo-200" },
                        { label: "حیوانات دریایی 🐳", color: "bg-cyan-100 text-cyan-700 border-cyan-200 hover:bg-cyan-200" },
                        { label: "چطور قهرمان بشم؟ 🦸", color: "bg-red-100 text-red-700 border-red-200 hover:bg-red-200" },
                        { label: "نقاشی بکشیم 🎨", color: "bg-pink-100 text-pink-700 border-pink-200 hover:bg-pink-200" },
                    ].map((topic) => (
                        <Link
                            key={topic.label}
                            href={`/kid/chat?topic=${encodeURIComponent(topic.label)}`}
                            className={cn(
                                "px-4 py-2 md:px-6 md:py-3 rounded-full text-sm md:text-lg font-bold border-2 transition-all duration-300 transform hover:scale-110 shadow-sm hover:shadow-md",
                                topic.color
                            )}
                        >
                            {topic.label}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
