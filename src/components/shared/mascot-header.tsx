"use client";

import React from "react";
import { MotionFade } from "@/components/motion-fade";
import { Sparkles } from "lucide-react";

interface MascotHeaderProps {
    title: string;
    subtitle?: string;
    mascotAlign?: "left" | "right" | "center";
}

export function MascotHeader({ title, subtitle, mascotAlign = "center" }: MascotHeaderProps) {
    return (
        <div className={`relative w-full overflow-hidden rounded-[2rem] bg-gradient-to-b from-kid-blue/10 to-transparent p-8 text-center md:p-12 ${mascotAlign === "left" ? "text-right" : mascotAlign === "right" ? "text-left" : "text-center"}`}>
            <MotionFade>
                <div className="relative z-10 mx-auto max-w-2xl space-y-4">
                    <div className="flex justify-center">
                        <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-soft animate-floaty">
                            {/* Placeholder for actual Mascot SVG */}
                            <Sparkles className="h-12 w-12 text-kid-blue" />
                            <div className="absolute -right-2 top-0 h-4 w-4 rounded-full bg-kid-yellow animate-bounce" />
                        </div>
                    </div>

                    <h1 className="text-3xl font-extrabold text-foreground md:text-5xl tracking-tight">
                        {title}
                    </h1>

                    {subtitle && (
                        <p className="text-lg font-medium text-muted-foreground md:text-xl">
                            {subtitle}
                        </p>
                    )}
                </div>
            </MotionFade>

            {/* Decorative background circles */}
            <div className="absolute -top-12 -left-12 h-40 w-40 rounded-full bg-kid-blue/10 blur-3xl" />
            <div className="absolute -bottom-12 -right-12 h-40 w-40 rounded-full bg-kid-pink/10 blur-3xl" />
        </div>
    );
}
