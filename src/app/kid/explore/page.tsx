import Link from "next/link";
import { cn } from "@/lib/utils";
import { Sparkles, FlaskConical, Rocket, Music, Palette, Globe, BookOpen, Bug } from "lucide-react";

export default function ExplorePage() {
    const topics = [
        { title: "حیوانات عجیب", emoji: "🦈", color: "bg-blue-100", height: "h-64", icon: Bug },
        { title: "فضای بیکران", emoji: "🚀", color: "bg-indigo-100", height: "h-48", icon: Rocket },
        { title: "آزمایش‌های علمی", emoji: "⚗️", color: "bg-green-100", height: "h-56", icon: FlaskConical },
        { title: "داستان‌های صوتی", emoji: "🎧", color: "bg-orange-100", height: "h-48", icon: Music },
        { title: "نقاشی بکشیم", emoji: "🎨", color: "bg-pink-100", height: "h-64", icon: Palette },
        { title: "دایناسورها", emoji: "🦖", color: "bg-emerald-100", height: "h-52", icon: Bug },
        { title: "سفر به دور دنیا", emoji: "🌍", color: "bg-sky-100", height: "h-48", icon: Globe },
        { title: "چیستان و معما", emoji: "🧩", color: "bg-purple-100", height: "h-56", icon: Sparkles },
        { title: "کتاب‌خوانی", emoji: "📚", color: "bg-yellow-100", height: "h-64", icon: BookOpen },
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between mb-4">
                <h1 className="text-3xl font-black text-slate-800 tracking-tight">
                    جهان رو کشف کن! 🌍
                </h1>
            </div>

            <div className="columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6 pb-20">
                {topics.map((topic, i) => {
                    const Icon = topic.icon;
                    return (
                        <Link
                            key={i}
                            href={`/kid/chat?topic=${encodeURIComponent(topic.title)}`}
                            className={cn(
                                "group break-inside-avoid relative block w-full rounded-[2rem] p-6 transition-all duration-300 hover:scale-105 hover:shadow-xl",
                                topic.color
                            )}
                        >
                            <div className={cn("absolute top-4 right-4 p-2 rounded-full bg-white/30 text-slate-700")}>
                                <Icon className="w-5 h-5" />
                            </div>
                            <div className={cn("flex flex-col items-center justify-center text-center h-full gap-4", topic.height)}>
                                <span className="text-6xl drop-shadow-md group-hover:scale-110 transition-transform duration-300">{topic.emoji}</span>
                                <h3 className="text-xl font-bold text-slate-800">{topic.title}</h3>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
