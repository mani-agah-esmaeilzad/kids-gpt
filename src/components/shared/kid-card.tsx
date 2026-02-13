import { cn } from "@/lib/utils";
import { ArrowLeft } from "lucide-react";

interface KidCardProps {
    variant: "blue" | "pink" | "green" | "yellow" | "purple" | "orange";
    title: string;
    description: string;
    icon: React.ReactNode;
    onClick: () => void;
    className?: string;
}

export function KidCard({ variant, title, description, icon, onClick, className }: KidCardProps) {
    const variantStyles = {
        blue: "bg-kid-blue border-kid-blue/20 text-white",
        pink: "bg-kid-pink border-kid-pink/20 text-white",
        green: "bg-kid-green border-kid-green/20 text-white",
        yellow: "bg-kid-yellow border-kid-yellow/20 text-kid-neutral",
        purple: "bg-kid-purple border-kid-purple/20 text-white",
        orange: "bg-kid-orange border-kid-orange/20 text-white",
    };

    return (
        <button
            onClick={onClick}
            className={cn(
                "group relative w-full overflow-hidden rounded-3xl p-6 text-left transition-all duration-300 hover:scale-[1.02] hover:shadow-xl",
                variantStyles[variant],
                className
            )}
        >
            <div className="relative z-10 flex min-h-[140px] flex-col justify-between">
                <div>
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                        {icon}
                    </div>
                    <h3 className="text-xl font-bold md:text-2xl">{title}</h3>
                    <p className="mt-1 text-sm opacity-90 md:text-base font-medium">{description}</p>
                </div>

                <div className="mt-4 flex items-center gap-2 text-sm font-bold opacity-0 transition-opacity group-hover:opacity-100">
                    <span>شروع کنید</span>
                    <ArrowLeft className="h-4 w-4" />
                </div>
            </div>

            {/* Decorative circles */}
            <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10 blur-2xl transition-transform duration-500 group-hover:scale-150" />
            <div className="absolute -bottom-4 -left-4 h-32 w-32 rounded-full bg-white/10 blur-3xl transition-transform duration-500 group-hover:scale-150" />
        </button>
    );
}
