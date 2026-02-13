import { Zap, Star, Trophy, Target, Medal } from "lucide-react";
import { cn } from "@/lib/utils";

export default function RewardsPage() {
    // Mock data - in real app would come from DB
    const stats = {
        xp: 1250,
        level: 5,
        nextLevelXp: 2000,
        streak: 3,
        badges: [
            { id: 1, name: "کنجکاو", icon: "🕵️", unlocked: true },
            { id: 2, name: "دانشمند", icon: "👨‍🔬", unlocked: true },
            { id: 3, name: "خلاق", icon: "🎨", unlocked: false },
            { id: 4, name: "فضانورد", icon: "👩‍🚀", unlocked: false },
        ]
    };

    const progress = (stats.xp / stats.nextLevelXp) * 100;

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            {/* Header Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-yellow-400 to-orange-400 text-white rounded-[2.5rem] p-8 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-20"><Zap className="w-24 h-24" /></div>
                    <div className="relative z-10">
                        <p className="font-bold text-yellow-100 mb-1">امتیاز کل</p>
                        <h2 className="text-5xl font-black">{stats.xp}</h2>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-400 to-indigo-500 text-white rounded-[2.5rem] p-8 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-20"><Trophy className="w-24 h-24" /></div>
                    <div className="relative z-10">
                        <p className="font-bold text-blue-100 mb-1">سطح شما</p>
                        <h2 className="text-5xl font-black">Level {stats.level}</h2>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-400 to-emerald-500 text-white rounded-[2.5rem] p-8 shadow-lg relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-20"><Target className="w-24 h-24" /></div>
                    <div className="relative z-10">
                        <p className="font-bold text-green-100 mb-1">زنجیره یادگیری</p>
                        <h2 className="text-5xl font-black">{stats.streak} روز</h2>
                    </div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-white rounded-[2rem] p-8 shadow-soft border border-slate-100">
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <h3 className="text-2xl font-bold text-slate-800">مسیر پیشرفت</h3>
                        <p className="text-slate-500">فقط {stats.nextLevelXp - stats.xp} امتیاز تا سطح بعدی!</p>
                    </div>
                    <Medal className="w-10 h-10 text-yellow-500 animate-bounce" />
                </div>
                <div className="h-6 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-kid-yellow to-kid-orange transition-all duration-1000 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            {/* Badges Grid */}
            <div>
                <h3 className="text-2xl font-bold text-slate-800 mb-6">نشان‌های افتخار</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {stats.badges.map((badge) => (
                        <div
                            key={badge.id}
                            className={cn(
                                "aspect-square rounded-[2rem] flex flex-col items-center justify-center ring-4 border-4 border-white shadow-sm transition-all hover:scale-105",
                                badge.unlocked
                                    ? "bg-gradient-to-br from-indigo-50 to-purple-50 ring-purple-100"
                                    : "bg-slate-100 ring-slate-50 grayscale opacity-60"
                            )}
                        >
                            <span className="text-6xl mb-4 drop-shadow-sm">{badge.icon}</span>
                            <span className={cn("font-bold", badge.unlocked ? "text-slate-800" : "text-slate-400")}>
                                {badge.name}
                            </span>
                            {!badge.unlocked && <span className="text-xs text-slate-400 mt-1">قفل است</span>}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
