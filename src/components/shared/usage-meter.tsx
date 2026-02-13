"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface UsageMeterProps {
    current: number;
    max: number;
    label?: string;
    className?: string;
}

export function UsageMeter({ current, max, label, className }: UsageMeterProps) {
    const percentage = Math.min(100, Math.max(0, (current / max) * 100));
    const isWarning = percentage >= 80;
    const isCritical = percentage >= 95;

    return (
        <div className={cn("space-y-2", className)}>
            <div className="flex justify-between items-end">
                {label && <span className="text-sm font-medium text-muted-foreground">{label}</span>}
                <span className={cn("text-sm font-bold", isCritical ? "text-destructive" : isWarning ? "text-orange-500" : "text-primary")}>
                    {current} / {max}
                </span>
            </div>
            <div className="h-4 w-full overflow-hidden rounded-full bg-secondary">
                <div
                    className={cn(
                        "h-full transition-all duration-500 ease-out",
                        isCritical ? "bg-destructive" : isWarning ? "bg-orange-500" : "bg-primary"
                    )}
                    style={{ width: `${percentage}%` }}
                />
            </div>
            {isWarning && (
                <p className="text-xs text-orange-600 font-medium">
                    {isCritical ? "ظرفیت تقریباً پر شده است!" : "به سقف مجاز نزدیک می‌شوید."}
                </p>
            )}
        </div>
    );
}
